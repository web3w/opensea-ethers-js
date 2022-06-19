import {
    Asset,
    HowToCall,
    Order,
    OrderJSON,
    SaleKind,
    UnhashedOrder,
    UnsignedOrder,
    Token,
    BigNumber, FeeMethod,
} from '../types'

import {ElementError} from './error'
import {
    MIN_EXPIRATION_SECONDS,
    ORDER_MATCHING_LATENCY_SECONDS,
    STATIC_EXTRADATA,
    NULL_ADDRESS, INVERSE_BASIS_POINT
} from './constants'
import {makeBigNumber, toBaseUnitAmount} from './helper'
import {OfferType, OrderSide, MetaAsset} from "web3-accounts";


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

export function generatePseudoRandomSalt() {
    return new BigNumber(new Date().getTime())
}


export function getElementAsset(asset: Asset, quantity: string = "1"): MetaAsset {
    const tokenId = asset.tokenId != undefined ? asset.tokenId.toString() : undefined

    const assetFromFields = (fields) => ({
        id: fields.ID,
        address: fields.Address,
        quantity: fields.Quantity,
        data: fields.Data
    })

    return assetFromFields({
        ID: tokenId,
        Quantity: quantity.toString(),
        Address: asset.tokenAddress.toLowerCase(),
        Name: asset.name,
        Data: asset.data || ''
    })
}

export function getSchemaAndAsset(asset: Asset, quantity: number) {
    // const quantityBN = makeBigNumber(quantity) // WyvernProtocol.toBaseUnitAmount(makeBigNumber(quantity), asset.decimals || 0)

    const elementAsset = getElementAsset(asset, quantity.toString())
    return {
        elementAsset,
        quantityBN: new BigNumber(quantity)
    }
}

export function getPriceParameters(
    orderSide: OrderSide,
    paymentTokenObj: Token,
    expirationTime: number,
    startAmount: number,
    endAmount?: number,
    waitingForBestCounterOrder = false,
    englishAuctionReservePrice?: number
) {
    const priceDiff = endAmount != undefined ? startAmount - endAmount : 0
    const token = paymentTokenObj

    const paymentToken = token.address.toLowerCase()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const tokenDecimals = token.decimals || token.decimal

    const isEther = token.address == NULL_ADDRESS

    // if (!isEther) {
    //   const tokenList = getTokenList(network)
    //   token = tokenList.find((val) => val.address.toLowerCase() == paymentToken)
    // }

    // Validation
    if (isNaN(startAmount) || startAmount == undefined || startAmount < 0) {
        throw new ElementError({code: '1000', message: `Starting price must be a number >= 0`})
    }
    if (!isEther && !token) {
        throw new ElementError({code: '1000', message: `No ERC-20 token found for '${paymentToken}'`})
    }
    if (isEther && waitingForBestCounterOrder) {
        throw new ElementError({code: '1000', message: `English auctions must use wrapped ETH or an ERC-20 token.`})
    }
    // if (isEther && orderSide === OrderSide.Buy) {
    //   throw new Error(`Offers must use wrapped ETH or an ERC-20 token.`)
    // }
    if (priceDiff < 0) {
        throw new ElementError({code: '1000', message: 'End price must be less than or equal to the start price.'})
    }
    if (priceDiff > 0 && expirationTime == 0) {
        throw new ElementError({code: '1000', message: 'Expiration time must be set if order will change in price.'})
    }
    if (englishAuctionReservePrice && !waitingForBestCounterOrder) {
        throw new ElementError({code: '1000', message: 'Reserve prices may only be set on English auctions.'})
    }
    if (englishAuctionReservePrice && englishAuctionReservePrice < startAmount) {
        throw new ElementError({
            code: '1000',
            message: 'Reserve price must be greater than or equal to the start amount.'
        })
    }

    // Note: WyvernProtocol.toBaseUnitAmount(makeBigNumber(startAmount), tokenDecimals)
    // will fail if too many decimal places, so special-case ether
    const basePrice = toBaseUnitAmount(makeBigNumber(startAmount), tokenDecimals)

    const extra = toBaseUnitAmount(makeBigNumber(priceDiff), tokenDecimals)

    const reservePrice = englishAuctionReservePrice
        ? toBaseUnitAmount(makeBigNumber(englishAuctionReservePrice), tokenDecimals)
        : undefined

    return {basePrice, extra, paymentToken, reservePrice}
}

export function getTimeParameters(
    expirationTimestamp: number,
    listingTimestamp?: number,
    waitingForBestCounterOrder = false
) {
    // Validation
    const minExpirationTimestamp = Math.round(Date.now() / 1000 + MIN_EXPIRATION_SECONDS)
    const minListingTimestamp = Math.round(Date.now() / 1000 - 1)
    if (expirationTimestamp != 0 && expirationTimestamp < minExpirationTimestamp) {
        throw new ElementError({
            code: '1000',
            message: `Expiration time must be at least ${MIN_EXPIRATION_SECONDS} seconds from now, or zero (non-expiring).`
        })
    }
    if (listingTimestamp && listingTimestamp < minListingTimestamp) {
        throw new ElementError({code: '1000', message: 'Listing time cannot be in the past.'})
    }
    if (listingTimestamp && expirationTimestamp !== 0 && listingTimestamp >= expirationTimestamp) {
        throw new ElementError({code: '1000', message: 'Listing time must be before the expiration time.'})
    }
    if (waitingForBestCounterOrder && expirationTimestamp == 0) {
        throw new ElementError({code: '1000', message: 'English auctions must have an expiration time.'})
    }
    if (waitingForBestCounterOrder && listingTimestamp) {
        throw new ElementError({code: '1000', message: `Cannot schedule an English auction for the future.`})
    }
    if (Number(expirationTimestamp.toString()) != expirationTimestamp) {
        throw new ElementError({code: '1000', message: `Expiration timestamp must be a whole number of seconds`})
    }

    if (waitingForBestCounterOrder) {
        listingTimestamp = expirationTimestamp
        // Expire one week from now, to ensure server can match it
        // Later, this will expire closer to the listingTime
        expirationTimestamp += ORDER_MATCHING_LATENCY_SECONDS
    } else {
        // Small offset to account for latency
        listingTimestamp = listingTimestamp || Math.round(Date.now() / 1000 - 100)
    }

    return {
        listingTime: makeBigNumber(listingTimestamp),
        expirationTime: makeBigNumber(expirationTimestamp)
    }
}

export async function _makeBuyOrder({
                                        exchangeAddr,
                                        protocolFeePoints,
                                        asset,
                                        quantity,
                                        accountAddress,
                                        startAmount,
                                        expirationTime = 0,
                                        paymentTokenObj,
                                        extraBountyBasisPoints = 0,
                                        feeRecipientAddr,
                                        sellOrder,
                                        offerType
                                    }: {
    exchangeAddr: string
    protocolFeePoints: number
    asset: Asset
    quantity: number
    accountAddress: string
    startAmount: number
    expirationTime: number
    paymentTokenObj: Token
    extraBountyBasisPoints: number
    feeRecipientAddr: string
    sellOrder?: Order
    offerType?: OfferType
}): Promise<UnhashedOrder> {
    const {elementAsset, quantityBN} = getSchemaAndAsset(asset, quantity)

    const metadata = {
        asset: elementAsset,
        schema: asset.schemaName
    }
    const taker = sellOrder ? sellOrder.maker : NULL_ADDRESS

    // const {target, dataToCall, replacementPattern} = encodeBuy(metadata, accountAddress, offerType)

    const {basePrice, extra, paymentToken} = getPriceParameters(
        OrderSide.Buy,
        paymentTokenObj,
        expirationTime,
        startAmount
    )
    const times = getTimeParameters(expirationTime)

    // -------- Fee -----------

    let totalSellerFeeBasisPoints = protocolFeePoints

    if (asset?.collection?.royaltyFeePoints) {
        totalSellerFeeBasisPoints = Number(protocolFeePoints) + Number(asset.collection.royaltyFeePoints)
    }
    _validateFees(0, totalSellerFeeBasisPoints)
    // OrderSide.Buy
    const feeRecipient = feeRecipientAddr

    // takerRelayerFee=totalSellerFeeBasisPoints
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
        makerRelayerFee = makeBigNumber(0)
        takerRelayerFee = makeBigNumber(totalSellerFeeBasisPoints)
    }
    const makerProtocolFee = makeBigNumber(0)
    const takerProtocolFee = makeBigNumber(0)
    const makerReferrerFee = makeBigNumber(0)
    const feeMethod = FeeMethod.SplitFee


    return {
        exchange: exchangeAddr,
        maker: accountAddress,
        taker,
        quantity: quantityBN,
        makerRelayerFee,
        takerRelayerFee,
        makerProtocolFee,
        takerProtocolFee,
        makerReferrerFee,
        waitingForBestCounterOrder: false,
        feeMethod,
        feeRecipient,
        side: OrderSide.Buy,
        saleKind: SaleKind.FixedPrice,
        target: "",
        howToCall: HowToCall.Call,
        calldata: "",
        replacementPattern: "",
        staticTarget: NULL_ADDRESS,
        staticExtradata: "0x",
        paymentToken,
        basePrice,
        extra,
        listingTime: times.listingTime,
        expirationTime: times.expirationTime,
        salt: generatePseudoRandomSalt(),
        metadata,
        offerType
    } as UnhashedOrder
}

export async function _makeSellOrder({
                                         exchangeAddr,
                                         protocolFeePoints,
                                         asset,
                                         quantity,
                                         accountAddress,
                                         startAmount,
                                         endAmount,
                                         listingTime,
                                         expirationTime,
                                         waitForHighestBid,
                                         englishAuctionReservePrice = 0,
                                         paymentTokenObj,
                                         extraBountyBasisPoints,
                                         feeRecipientAddr,
                                         buyerAddress
                                     }: {
    exchangeAddr: string
    protocolFeePoints: number
    asset: Asset
    quantity: number
    accountAddress: string
    startAmount: number
    endAmount?: number
    waitForHighestBid: boolean
    englishAuctionReservePrice?: number
    listingTime?: number
    expirationTime: number
    paymentTokenObj: Token
    extraBountyBasisPoints: number
    feeRecipientAddr: string
    buyerAddress: string
}): Promise<UnhashedOrder> {
    const {elementAsset, quantityBN} = getSchemaAndAsset(asset, quantity)
    const metadata = {
        asset: elementAsset,
        schema: asset.schemaName
    }
    // const {target, dataToCall, replacementPattern} = encodeSell(metadata, accountAddress)

    const orderSaleKind =
        endAmount !== undefined && endAmount !== startAmount ? SaleKind.DutchAuction : SaleKind.FixedPrice

    const {basePrice, extra, paymentToken, reservePrice} = getPriceParameters(
        OrderSide.Sell,
        paymentTokenObj,
        expirationTime,
        startAmount,
        endAmount,
        waitForHighestBid,
        englishAuctionReservePrice
    )
    const times = getTimeParameters(expirationTime, listingTime, waitForHighestBid)

    // -------- Fee -----------
    const isPrivate = buyerAddress != NULL_ADDRESS

    let totalSellerFeeBasisPoints = protocolFeePoints

    if (isPrivate) {
        totalSellerFeeBasisPoints = 0
    } else if (asset?.collection?.royaltyFeePoints) {
        totalSellerFeeBasisPoints = protocolFeePoints + asset.collection.royaltyFeePoints
    }
    _validateFees(0, totalSellerFeeBasisPoints)

    // waitForHighestBid = false
    // Use buyer as the maker when it's an English auction, so Wyvern sets prices correctly
    const feeRecipient = waitForHighestBid ? NULL_ADDRESS : feeRecipientAddr

    // maker_relayer_fee: '1250', = totalSellerFeeBasisPoints

    const makerRelayerFee = waitForHighestBid
        ? makeBigNumber(0)
        : makeBigNumber(totalSellerFeeBasisPoints)
    const takerRelayerFee = waitForHighestBid
        ? makeBigNumber(totalSellerFeeBasisPoints)
        : makeBigNumber(0)
    const makerProtocolFee = makeBigNumber(0)
    const takerProtocolFee = makeBigNumber(0)
    const makerReferrerFee = makeBigNumber(0)
    const feeMethod = FeeMethod.SplitFee


    return {
        exchange: exchangeAddr,
        maker: accountAddress,
        taker: buyerAddress,
        quantity: quantityBN,
        makerRelayerFee,
        takerRelayerFee,
        makerProtocolFee,
        takerProtocolFee,
        makerReferrerFee,
        waitingForBestCounterOrder: waitForHighestBid,
        englishAuctionReservePrice: reservePrice ? makeBigNumber(reservePrice) : undefined,
        feeMethod,
        feeRecipient,
        side: OrderSide.Sell,
        saleKind: orderSaleKind,
        target: "",
        howToCall: HowToCall.Call,
        calldata: "",
        replacementPattern: "",
        staticTarget: NULL_ADDRESS,
        staticExtradata: "0x",
        paymentToken,
        basePrice,
        extra,
        listingTime: times.listingTime,
        expirationTime: times.expirationTime,
        salt: generatePseudoRandomSalt(),
        metadata
    } as UnhashedOrder
}


export const orderToJSON = (order: Order): OrderJSON => {
    const asJSON: OrderJSON = {
        exchange: order.exchange.toLowerCase(),
        maker: order.maker.toLowerCase(),
        taker: order.taker.toLowerCase(),
        makerRelayerFee: order.makerRelayerFee.toString(),
        takerRelayerFee: order.takerRelayerFee.toString(),
        makerProtocolFee: order.makerProtocolFee.toString(),
        takerProtocolFee: order.takerProtocolFee.toString(),
        makerReferrerFee: order.makerReferrerFee.toString(),
        feeMethod: order.feeMethod,
        feeRecipient: order.feeRecipient.toLowerCase(),
        side: order.side,
        saleKind: order.saleKind,
        target: order.target.toLowerCase(),
        howToCall: order.howToCall,
        calldata: order.calldata,
        replacementPattern: order.replacementPattern,
        staticTarget: order.staticTarget.toLowerCase(),
        staticExtradata: order.staticExtradata,
        paymentToken: order.paymentToken.toLowerCase(),
        quantity: order.quantity.toString(),
        basePrice: order.basePrice.toString(),
        englishAuctionReservePrice: order?.englishAuctionReservePrice?.toString(),
        extra: order.extra.toString(),
        listingTime: order.listingTime.toString(),
        expirationTime: order.expirationTime.toString(),
        salt: order.salt.toString(),

        metadata: order.metadata,

        v: order.v,
        r: order.r,
        s: order.s,

        hash: order.hash
    }
    if (order.nonce) {
        asJSON.nonce = order.nonce
    }
    return asJSON
}

//计算当前 订单的总价格
export async function getCurrentPrice(exchangeHelper: any, order: Order): Promise<string> {
    const currentPrice: string = await exchangeHelper.methods
        .calculateFinalPrice(
            order.side?.toString(),
            order.saleKind?.toString(),
            order.basePrice?.toString(),
            order.extra?.toString(),
            order.listingTime?.toString(),
            order.expirationTime?.toString()
        )
        .call()

    return currentPrice
}

export function _makeMatchingOrder({
                                       unSignedOrder,
                                       makerAddress,
                                       feeRecipientAddress
                                   }: {
    unSignedOrder: UnsignedOrder
    makerAddress: string
    feeRecipientAddress: string
}): UnhashedOrder {
    const order = unSignedOrder

    // const {target, dataToCall, replacementPattern} = computeOrderParams(order, assetRecipientAddress)
    // const times = getTimeParameters(0)
    // Compat for matching buy orders that have fee recipient still on them
    const feeRecipient = order.feeRecipient == NULL_ADDRESS ? feeRecipientAddress : NULL_ADDRESS

    const matchingOrder: UnhashedOrder = {
        exchange: order.exchange,
        maker: makerAddress,
        taker: order.maker,
        quantity: order.quantity,
        makerRelayerFee: order.makerRelayerFee,
        takerRelayerFee: order.takerRelayerFee,
        makerProtocolFee: order.makerProtocolFee,
        takerProtocolFee: order.takerProtocolFee,
        makerReferrerFee: order.makerReferrerFee,
        waitingForBestCounterOrder: false,
        feeMethod: order.feeMethod,
        feeRecipient,
        side: (order.side + 1) % 2,
        saleKind: SaleKind.FixedPrice,
        target: order.target,
        howToCall: order.howToCall,
        calldata: order.calldata,
        replacementPattern: order.replacementPattern,
        staticTarget: NULL_ADDRESS,
        staticExtradata: '0x',
        paymentToken: order.paymentToken,
        basePrice: order.basePrice,
        extra: makeBigNumber(0),
        listingTime: order.listingTime,
        expirationTime: makeBigNumber(0),
        salt: makeBigNumber(0),
        metadata: order.metadata
    }
    return matchingOrder
}

/**
 * Assign an order and a new matching order to their buy/sell sides
 * @param order Original order
 * @param matchingOrder The result of _makeMatchingOrder
 */
export function assignOrdersToSides(order: Order, matchingOrder: UnsignedOrder): { buy: Order; sell: Order } {
    const isSellOrder = order.side == OrderSide.Sell

    let buy: Order
    let sell: Order
    if (!isSellOrder) {
        buy = order
        sell = {
            ...matchingOrder,
            v: buy.v,
            r: buy.r,
            s: buy.s
        }
    } else {
        sell = order
        buy = {
            ...matchingOrder,
            v: sell.v,
            r: sell.r,
            s: sell.s
        }
    }
    return {buy, sell}
}

export const orderFromJSON = (order: any): Order => {
    const createdDate = new Date() // `${order.created_date}Z`
    const orderHash = order.hash || order.orderHash
    const fromJSON: Order = {
        hash: orderHash,
        cancelledOrFinalized: order.cancelled || order.finalized,
        markedInvalid: order.marked_invalid,
        metadata: order.metadata,
        quantity: new BigNumber(order.quantity || 1),
        exchange: order.exchange,
        makerAccount: order.maker,
        takerAccount: order.taker,
        // Use string address to conform to Element Order schema
        maker: order.maker,
        taker: order.taker,
        makerRelayerFee: new BigNumber(order.makerRelayerFee),
        takerRelayerFee: new BigNumber(order.takerRelayerFee),
        makerProtocolFee: new BigNumber(order.makerProtocolFee),
        takerProtocolFee: new BigNumber(order.takerProtocolFee),
        makerReferrerFee: new BigNumber(order.makerReferrerFee || 0),
        waitingForBestCounterOrder: order.feeRecipient == NULL_ADDRESS,
        feeMethod: order.feeMethod,
        feeRecipientAccount: order.feeRecipient,
        feeRecipient: order.feeRecipient,
        side: order.side,
        saleKind: order.saleKind,
        target: order.target,
        howToCall: order.howToCall,
        calldata: order.calldata,
        replacementPattern: order.replacementPattern,
        staticTarget: order.staticTarget,
        staticExtradata: order.staticExtradata,
        paymentToken: order.paymentToken,
        basePrice: new BigNumber(order.basePrice),
        extra: new BigNumber(order.extra),
        currentBounty: new BigNumber(order.currentBounty || 0),
        currentPrice: new BigNumber(order.currentPrice || 0),

        createdTime: new BigNumber(Math.round(createdDate.getTime() / 1000)),
        listingTime: new BigNumber(order.listingTime),
        expirationTime: new BigNumber(order.expirationTime),

        salt: new BigNumber(order.salt),
        v: Number(order.v),
        r: order.r,
        s: order.s,

        paymentTokenContract: order.paymentToken || undefined,
        asset: order.asset || undefined,
        assetBundle: order.assetBundle || undefined
    }

    // Use client-side price calc, to account for buyer fee (not added by server) and latency
    // fromJSON.currentPrice = estimateCurrentPrice(fromJSON)

    return fromJSON
}

