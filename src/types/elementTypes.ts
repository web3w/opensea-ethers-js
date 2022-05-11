import BigNumber from 'bignumber.js'
import {WalletInfo, LimitedCallSpec} from 'web3-wallets'

BigNumber.config({EXPONENTIAL_AT: 1e9})
import {MatchParams, OfferType} from "./agentTypes";

// import {ChainInfo} from "../api/types";

export {BigNumber, OfferType}
export type {WalletInfo, LimitedCallSpec}


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


export enum OrderType {
    All = -1,
    Buy = 0,
    Sell = 1
}



export interface ElementConfig {
    chainId?: number;
    account?: string
    authToken?: string
    apiBaseUrl?: string
    protocolFeePoint?: number
    protocolFeeAddress?: string
    contractAddresses?: any
}

export interface Token {
    name: string
    symbol: string
    address: string
    decimals: number
}


// Element Schemas (see https://github.com/definancer/element-js)
export enum ElementSchemaName {
    ERC20 = 'ERC20',
    ERC721 = 'ERC721',
    ERC1155 = 'ERC1155',
    CryptoKitties = 'CryptoKitties',
    ENSShortNameAuction = 'ENSShortNameAuction'
    // LegacyEnjin = 'Enjin',
    // ElementShardType = 'ElementShardType',
    // CryptoPunks = 'CryptoPunks'
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

/**
 * Annotated collection with OpenSea metadata
 */
export interface ElementCollection extends ElementFees {
    // Name of the collection
    name: string
    // Description of the collection
    description: string
    // Image for the collection
    imageUrl: string
    // The per-transfer fee, in base units, for this asset in its transfer method
    transferFee: BigNumber | string | null
    transferFeeAddress?: string
    // The transfer fee token for this asset in its transfer method
    transferFeePaymentToken: ElemetnFungibleToken | null
}

interface ElementNFTAsset {
    id: string
    address: string
    quantity?: string
    data?: string
    collection?: ElementCollection
}

interface ElementFTAsset {
    id?: string
    address: string
    quantity: string
    data?: string
    collection?: ElementCollection
}

export type ElementAsset = ElementNFTAsset | ElementFTAsset

export interface ExchangeMetadata {
    asset: ElementAsset
    schema: ElementSchemaName
    version?: number
    referrerAddress?: string
}

export interface Asset {
    // The asset's token ID, or null if ERC-20
    tokenId: string | undefined
    // The asset's contract address
    tokenAddress: string
    // The Element schema name (e.g. "ERC721") for this asset
    schemaName: ElementSchemaName
    // Optional for ENS names
    name?: string
    data?: string
    // Optional for fungible items
    decimals?: number
    chainId?: number
    collection?: ElementCollection
}

export interface ChainInfo {
    chain?: string
    chainId?: string
}

export interface OrderQueryParams extends ChainInfo {
    assetContractAddress: string //
    tokenId: string
    orderType: OrderType
}
