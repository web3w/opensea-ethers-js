import { makeBigNumber } from './helper'
import {
  INVERSE_BASIS_POINT,
  DEFAULT_SELLER_FEE_BASIS_POINTS,
  DEFAULT_BUYER_FEE_BASIS_POINTS,
  DEFAULT_MAX_BOUNTY,
  ELEMENT_SELLER_BOUNTY_BASIS_POINTS
} from './constants'
import { Asset, ComputedFees, OrderSide, UnhashedOrder, FeeMethod } from '../types'

/**
 * Compute the fees for an order
 * @param param0 __namedParameters
 * @param asset Asset to use for fees. May be blank ONLY for multi-collection bundles.
 * @param side The side of the order (buy or sell)
 * @param accountAddress The account to check fees for (useful if fees differ by account, like transfer fees)
 * @param isPrivate Whether the order is private or not (known taker)
 * @param extraBountyBasisPoints The basis points to add for the bounty. Will throw if it exceeds the assets' contract's Element fee.
 */
export function computeFees({
                              asset,
                              side,
                              accountAddress,
                              isPrivate = false,
                              extraBountyBasisPoints = 0
                            }: {
  asset?: Asset
  side: OrderSide
  accountAddress?: string
  isPrivate?: boolean
  extraBountyBasisPoints?: number
}): ComputedFees {
  let elementBuyerFeeBasisPoints = DEFAULT_BUYER_FEE_BASIS_POINTS
  let elementSellerFeeBasisPoints = DEFAULT_SELLER_FEE_BASIS_POINTS
  let devBuyerFeeBasisPoints = 0
  let devSellerFeeBasisPoints = 0
  let transferFee = makeBigNumber(0)
  let transferFeeTokenAddress
  let maxTotalBountyBPS = DEFAULT_MAX_BOUNTY

  if (asset) {
    elementBuyerFeeBasisPoints += asset?.collection?.elementBuyerFeeBasisPoints || 0
    elementSellerFeeBasisPoints += asset?.collection?.elementSellerFeeBasisPoints || 0
    devBuyerFeeBasisPoints += asset?.collection?.devBuyerFeeBasisPoints || 0
    devSellerFeeBasisPoints += asset?.collection?.devSellerFeeBasisPoints || 0

    maxTotalBountyBPS = elementSellerFeeBasisPoints
  }

  // Compute transferFrom fees
  if (side == OrderSide.Sell && asset) {
    // Server-side knowledge
    transferFee = asset?.collection?.transferFee ? makeBigNumber(asset?.collection?.transferFee.toString() || '0') : transferFee
    transferFeeTokenAddress = asset?.collection?.transferFeePaymentToken
      ? asset?.collection?.transferFeePaymentToken?.address
      : transferFeeTokenAddress
  }

  // Compute bounty
  let sellerBountyBasisPoints = side == OrderSide.Sell ? extraBountyBasisPoints : 0

  // Check that bounty is in range of the element fee
  const bountyTooLarge = sellerBountyBasisPoints + ELEMENT_SELLER_BOUNTY_BASIS_POINTS > maxTotalBountyBPS
  if (sellerBountyBasisPoints > 0 && bountyTooLarge) {
    let errorMessage = `Total bounty exceeds the maximum for this asset type (${maxTotalBountyBPS / 100}%).`
    if (maxTotalBountyBPS >= ELEMENT_SELLER_BOUNTY_BASIS_POINTS) {
      errorMessage += ` Remember that Element will add ${
        ELEMENT_SELLER_BOUNTY_BASIS_POINTS / 100
      }% for referrers with OpenSea accounts!`
    }
    throw new Error(errorMessage)
  }

  // Remove fees for private orders
  if (isPrivate) {
    elementBuyerFeeBasisPoints = 0
    elementSellerFeeBasisPoints = 0
    devBuyerFeeBasisPoints = 0
    devSellerFeeBasisPoints = 0
    sellerBountyBasisPoints = 0
  }

  return {
    totalBuyerFeeBasisPoints: elementBuyerFeeBasisPoints + devBuyerFeeBasisPoints,
    totalSellerFeeBasisPoints: elementSellerFeeBasisPoints + devSellerFeeBasisPoints,
    elementBuyerFeeBasisPoints,
    elementSellerFeeBasisPoints,
    devBuyerFeeBasisPoints,
    devSellerFeeBasisPoints,
    sellerBountyBasisPoints,
    transferFee,
    transferFeeTokenAddress
  }
}

export function _getBuyFeeParameters(
  totalBuyerFeeBasisPoints: number,
  totalSellerFeeBasisPoints: number,
  sellOrder?: UnhashedOrder
) {
  _validateFees(totalBuyerFeeBasisPoints, totalSellerFeeBasisPoints)

  let makerRelayerFee
  let takerRelayerFee

  if (sellOrder) {
    // Use the sell order's fees to ensure compatiblity and force the order
    // to only be acceptable by the sell order maker.
    // Swap maker/taker depending on whether it's an English auction (taker)
    // TODO add extraBountyBasisPoints when making bidder bounties
    makerRelayerFee = sellOrder.waitingForBestCounterOrder
      ? makeBigNumber(sellOrder.makerRelayerFee)
      : makeBigNumber(sellOrder.takerRelayerFee)
    takerRelayerFee = sellOrder.waitingForBestCounterOrder
      ? makeBigNumber(sellOrder.takerRelayerFee)
      : makeBigNumber(sellOrder.makerRelayerFee)
  } else {
    makerRelayerFee = makeBigNumber(totalBuyerFeeBasisPoints)
    takerRelayerFee = makeBigNumber(totalSellerFeeBasisPoints)
  }

  return {
    makerRelayerFee,
    takerRelayerFee,
    makerProtocolFee: makeBigNumber(0),
    takerProtocolFee: makeBigNumber(0),
    makerReferrerFee: makeBigNumber(0), // TODO use buyerBountyBPS
    feeMethod: FeeMethod.SplitFee
  }
}

// waitForHighestBid true 英式拍卖
export function _getSellFeeParameters(
  totalBuyerFeeBasisPoints: number,
  totalSellerFeeBasisPoints: number,
  waitForHighestBid: boolean,
  sellerBountyBasisPoints = 0
) {
  _validateFees(totalBuyerFeeBasisPoints, totalSellerFeeBasisPoints)

  // Swap maker/taker fees when it's an English auction,
  // since these sell orders are takers not makers
  const makerRelayerFee = waitForHighestBid
    ? makeBigNumber(totalBuyerFeeBasisPoints)
    : makeBigNumber(totalSellerFeeBasisPoints)
  const takerRelayerFee = waitForHighestBid
    ? makeBigNumber(totalSellerFeeBasisPoints)
    : makeBigNumber(totalBuyerFeeBasisPoints)

  return {
    makerRelayerFee,
    takerRelayerFee,
    makerProtocolFee: makeBigNumber(0),
    takerProtocolFee: makeBigNumber(0),
    makerReferrerFee: makeBigNumber(sellerBountyBasisPoints),
    feeMethod: FeeMethod.SplitFee
  }
}

/**
 * Validate fee parameters
 * @param totalBuyerFeeBasisPoints Total buyer fees
 * @param totalSellerFeeBasisPoints Total seller fees
 */
export function _validateFees(totalBuyerFeeBasisPoints: number, totalSellerFeeBasisPoints: number) {
  const maxFeePercent = INVERSE_BASIS_POINT / 100

  if (totalBuyerFeeBasisPoints > INVERSE_BASIS_POINT || totalSellerFeeBasisPoints > INVERSE_BASIS_POINT) {
    throw new Error(`Invalid buyer/seller fees: must be less than ${maxFeePercent}%`)
  }

  if (totalBuyerFeeBasisPoints < 0 || totalSellerFeeBasisPoints < 0) {
    throw new Error(`Invalid buyer/seller fees: must be at least 0%`)
  }
}
