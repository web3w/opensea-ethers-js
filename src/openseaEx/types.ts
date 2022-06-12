import {
    Asset,
    Token,
    OfferType,
    OrderType,
    ExchangeMetadata,
    APIConfig
} from "web3-accounts"
import {BigNumber} from 'web3-wallets'

export {
    NULL_BLOCK_HASH,
    NULL_ADDRESS, getProvider, getEstimateGas,
    ethSend,
    BigNumber,
    ETH_TOKEN_ADDRESS,
    CHAIN_CONFIG,
    getChainRpcUrl,
    hexUtils,
    getEIP712DomainHash,
    createEIP712TypedData
} from 'web3-wallets'
export type {Signature, WalletInfo, LimitedCallSpec, EIP712TypedData, EIP712Domain} from 'web3-wallets'


export { OrderType}
export type {Asset, Token, APIConfig, ExchangeMetadata}

export interface OrdersQueryParams {
    token_ids: string[]
    asset_contract_address: string
    payment_token_address?: string
    include_bundled?: boolean
    maker?: string
    taker?: string
    side?: number
    owner?: string
    order_by?: string
    limit?: number
    offset?: number
}

export interface AssetsQueryParams {
    assets?: {
        asset_contract_addresses: string
        token_ids: string
    }[],
    owner?: string
    limit?: number
    include_orders?: boolean
}

export interface AssetCollection {
    name: string
    symbol: string
    payout_address?: string //opensea royalty fee address
    dev_seller_fee_basis_points?: number //open sea royalty fee
    seller_fee_basis_points?: number //open sea protocol fee
    address?: string
    token_id?: string
    schema_name?: string
    nft_version?: string
    created_date?: string
    sell_orders?: any
}

// https://testnets-api.opensea.io/api/v1/assets?include_orders=true&owner=0x9f7a946d935c8efc7a8329c0d894a69ba241345a&limit=50&asset_contract_addresses=0x4cddbf865ee2a1a3711648bb192e285f290f7985&token_ids=4676314080394472507455332797632474230665182066565445726959043747700191264868&asset_contract_addresses=0xb556f251eacbec4badbcddc4a146906f2c095bee&token_ids=2&asset_contract_addresses=0x5fecbbbaf9f3126043a48a35eb2eb8667d469d53&token_ids=719455&asset_contract_addresses=0xb556f251eacbec4badbcddc4a146906f2c095bee&token_ids=3
/**
 * Full annotated Fungible Token spec with OpenSea metadata
 */
// export interface ElemetnFungibleToken extends Token {
//     imageUrl?: string
//     ethPrice?: string
//     usdPrice?: string
// }


//----------- OrderJSON--------------
export interface ECSignature {
    v: number
    r: string
    s: string
}

export interface OrderJSON extends Partial<ECSignature> {
    exchange: string
    maker: string
    taker: string
    makerRelayerFee: string
    takerRelayerFee: string
    makerProtocolFee: string
    takerProtocolFee: string
    makerReferrerFee: string
    feeRecipient: string
    feeMethod: number
    side: number
    saleKind: number
    target: string
    howToCall: number
    calldata: string
    replacementPattern: string
    staticTarget: string
    staticExtradata: string
    paymentToken: string
    quantity: string
    basePrice: string
    englishAuctionReservePrice: string | undefined
    extra: string

    // createdTime is undefined when order hasn't been posted yet
    // createdTime?: number | string
    listingTime: number | string
    expirationTime: number | string

    salt: string

    metadata: ExchangeMetadata

    hash: string
    nonce?: number | string
    orderHash?: string
    chain?: string
    chainId?: string
}

export interface BaseOrder {
    exchange: string
    maker: string
    taker: string
    makerRelayerFee: BigNumber
    takerRelayerFee: BigNumber
    makerProtocolFee: BigNumber
    takerProtocolFee: BigNumber
    feeRecipient: string
    feeMethod: number
    side: number
    saleKind: number
    target: string
    howToCall: number
    calldata: string
    replacementPattern: string
    staticTarget: string
    staticExtradata: string
    paymentToken: string
    basePrice: BigNumber
    extra: BigNumber
    listingTime: BigNumber
    expirationTime: BigNumber
    salt: BigNumber
}

export enum FeeMethod {
    ProtocolFee = 0,
    SplitFee = 1
}

//
// export enum OrderType {
//     All = -1,
//     Buy = 0,
//     Sell = 1
// }

export enum SaleKind {
    FixedPrice = 0,
    DutchAuction = 1
}

export enum HowToCall {
    Call = 0,
    DelegateCall = 1,
    StaticCall = 2,
    Create = 3
}

export interface UnhashedOrder extends BaseOrder {
    feeMethod: FeeMethod
    side: OrderType
    saleKind: SaleKind
    howToCall: HowToCall
    quantity: BigNumber
    offerType?: OfferType

    // Element-specific
    makerReferrerFee: BigNumber
    waitingForBestCounterOrder?: boolean
    englishAuctionReservePrice?: BigNumber

    metadata: ExchangeMetadata
}

export interface UnsignedOrder extends UnhashedOrder {
    hash: string
    nonce?: string | number
}

export interface OpenSeaUser {
    // Username for this user
    username: string
}

export interface OpenSeaAccount {
    // Wallet address for this account
    address: string
    // Public configuration info, including "affiliate" for users who are in the Element affiliate program
    config: string

    // This account's profile image - by default, randomly generated by the server
    profileImgUrl: string

    // More information explicitly set by this account's owner on Element
    user: OpenSeaUser | null
}

export interface PaymentTokenToken extends Token {
    imageUrl?: string
    ethPrice?: string
    usdPrice?: string
}

/**
 * Orders don't need to be signed if they're pre-approved
 * with a transaction on the contract to approveOrder_
 */
export interface Order extends UnsignedOrder, Partial<ECSignature> {
    // Read-only server-side appends
    createdTime?: BigNumber
    currentPrice?: BigNumber
    currentBounty?: BigNumber
    makerAccount?: OpenSeaAccount
    takerAccount?: OpenSeaAccount
    feeRecipientAccount?: OpenSeaAccount
    paymentTokenContract?: PaymentTokenToken
    cancelledOrFinalized?: boolean
    markedInvalid?: boolean
    asset?: any
    assetBundle?: any
    id?: any
    orderHash?: any
}


/******************** Fees ***********************/
/**
 * The basis point values of each type of fee
 */
export interface OpenSeaFees {
    // Fee for Element levied on sellers
    elementSellerFeeBasisPoints: number
    // Fee for Element levied on buyers
    elementBuyerFeeBasisPoints: number
    // Fee for the collection owner levied on sellers
    devSellerFeeBasisPoints: number
    // Fee for the collection owner levied on buyers
    devBuyerFeeBasisPoints: number
}

/**
 * Fully computed fees including bounties and transfer fees
 */
export interface ComputedFees extends OpenSeaFees {
    // Total fees. dev + element
    totalBuyerFeeBasisPoints: number
    totalSellerFeeBasisPoints: number

    // Fees that the item's creator takes on every transfer
    transferFee: BigNumber
    transferFeeTokenAddress: string | null

    // Fees that go to whoever refers the order to the taker.
    // Comes out of OpenSea fees
    sellerBountyBasisPoints: number
}


export interface UnsignedOrder extends UnhashedOrder {
    hash: string
    nonce?: string | number
}

//----------- OrderJSON--------------
export interface ECSignature {
    v: number
    r: string
    s: string
}

export interface OrderJSON extends Partial<ECSignature> {
    exchange: string
    maker: string
    taker: string
    makerRelayerFee: string
    takerRelayerFee: string
    makerProtocolFee: string
    takerProtocolFee: string
    makerReferrerFee: string
    feeRecipient: string
    feeMethod: number
    side: number
    saleKind: number
    target: string
    howToCall: number
    calldata: string
    replacementPattern: string
    staticTarget: string
    staticExtradata: string
    paymentToken: string
    quantity: string
    basePrice: string
    englishAuctionReservePrice: string | undefined
    extra: string

    // createdTime is undefined when order hasn't been posted yet
    // createdTime?: number | string
    listingTime: number | string
    expirationTime: number | string

    salt: string

    metadata: ExchangeMetadata

    hash: string
    nonce?: number | string
    orderHash?: string
    chain?: string
    chainId?: string
}

