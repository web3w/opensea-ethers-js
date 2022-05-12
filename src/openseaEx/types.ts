// import {
//     ElementAsset,
// } from "../types/elementTypes"


/**
 * Annotated collection with OpenSea metadata
 */
// export interface ElementCollection extends ElementFees {
//     // Name of the collection
//     name: string
//     // Description of the collection
//     description: string
//     // Image for the collection
//     imageUrl: string
//     // The per-transfer fee, in base units, for this asset in its transfer method
//     transferFee: BigNumber | string | null
//     transferFeeAddress?: string
//     // The transfer fee token for this asset in its transfer method
//     transferFeePaymentToken: ElemetnFungibleToken | null
// }


import {
    Asset,
    Token,
    OfferType,
    ElementSchemaName,
    ExchangeMetadata,
    BigNumber,

} from "web3-wallets"



export enum Network {
    Local = 'private',
    Main = 'main',
    Ropsten = 'ropsten',
    Rinkeby = 'rinkeby',
    Kovan = 'kovan',
    Polygon = 'polygon',
    Mumbai = 'mumbai',
    BSCTEST = 'bsc_test',
    BSC = 'bsc',
    Avalanche = 'avax',
    AvaxTest = 'avax_test',
    Fantom = 'fantom',
    Celo = 'celo',
    Optimism = 'optimism',
}

/**
 * Full annotated Fungible Token spec with OpenSea metadata
 */
export interface ElemetnFungibleToken extends Token {
    imageUrl?: string
    ethPrice?: string
    usdPrice?: string
}

/**
 * The basis point values of each type of fee
 */
export interface ElementFees {
    // Fee for Element levied on sellers
    elementSellerFeeBasisPoints: number
    // Fee for Element levied on buyers
    elementBuyerFeeBasisPoints: number
    // Fee for the collection owner levied on sellers
    devSellerFeeBasisPoints: number
    // Fee for the collection owner levied on buyers
    devBuyerFeeBasisPoints: number
}

export {ElementSchemaName, BigNumber}
export type {Asset, Token, ExchangeMetadata}

export const NULL_BLOCK_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

// interface ElementNFTAsset {
//     id: string
//     address: string
//     quantity?: string
//     data?: string
//     collection?: ElementCollection
// }
//
// interface ElementFTAsset {
//     id?: string
//     address: string
//     quantity: string
//     data?: string
//     collection?: ElementCollection
// }

// export type ElementAsset = ElementNFTAsset | ElementFTAsset


// export interface ExchangeMetadataForAsset {
//     asset: ElementAsset
//     schema: ElementSchemaName
//     version?: number
//     referrerAddress?: string
// }


// export type ExchangeMetadata = ExchangeMetadataForAsset

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
    dataToCall: string
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


export interface ElementOrder {
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
    dataToCall: string
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

export enum OrderSide {
    Buy = 0,
    Sell = 1
}

export enum OrderType {
    All = -1,
    Buy = 0,
    Sell = 1
}

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

export interface UnhashedOrder extends ElementOrder {
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

export interface ElementUser {
    // Username for this user
    username: string
}

export interface ElementAccount {
    // Wallet address for this account
    address: string
    // Public configuration info, including "affiliate" for users who are in the Element affiliate program
    config: string

    // This account's profile image - by default, randomly generated by the server
    profileImgUrl: string

    // More information explicitly set by this account's owner on Element
    user: ElementUser | null
}

export interface ElementFungibleToken extends Token {
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
    makerAccount?: ElementAccount
    takerAccount?: ElementAccount
    feeRecipientAccount?: ElementAccount
    paymentTokenContract?: ElementFungibleToken
    cancelledOrFinalized?: boolean
    markedInvalid?: boolean
    asset?: any
    assetBundle?: any
    id?: any
    orderHash?: any
}


/******************** Fees ***********************/


/**
 * Fully computed fees including bounties and transfer fees
 */
export interface ComputedFees extends ElementFees {
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
    dataToCall: string
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
