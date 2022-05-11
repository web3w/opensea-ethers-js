import {WalletInfo, Token, Asset, OrderType} from "./elementTypes";
import EventEmitter from 'events'

export interface MixedPayment {
    ethValue: string,
    wethValue: string
}

// export {ElementSchemaName}

export type MatchParams = {
    orderStr: string;
    takerAmount?: string
    makerAddress?: string
    assetRecipientAddress?: string
    metadata?: string
    standard?: string
}

export interface CreateOrderParams {
    asset: Asset
    quantity: number
    paymentToken: Token
    startAmount: number
    expirationTime: number
    protocolFeePoint?: number
    protocolFeeAddress?: string
    standard?: string
    nonce?: number
    accountAddress?: string
}

export interface SellOrderParams extends CreateOrderParams {
    listingTime?: number
    endAmount?: number
    buyerAddress?: string
    englishAuctionReservePrice?: number
}

// export interface EnglishAuctionOrderParams extends CreateOrderParams {
//     englishAuctionReservePrice?: number
// }

export enum OfferType {
    ItemOffer = 'item_offer',
    ContractOffer = 'contract_offer'
}

export interface BuyOrderParams extends CreateOrderParams {
    askOrderStr?: string // best ask
    offerType?: OfferType
}

export interface LowerPriceOrderParams {
    orderStr: string,
    basePrice: string,
    royaltyFeePoint: number
    royaltyFeeAddress: string
    standard: string;
    protocolFeePoint?: number
    protocolFeeAddress?: string
    nonce?: number
    accountAddress?: string
}

export interface AcceptOrderOption {
    metadata?: string
    takerAmount?: string
    taker?: string
    standard?: string
    mixedPayment?: MixedPayment
    sellTokenId?: string
}

export interface BatchAcceptOrderOption {
    metadatas?: string[],
    takerAmounts?: string[],
    takers?: string[],
    standard?: string;
    mixedPayment?: MixedPayment
}


export interface ExAgent extends EventEmitter {
    contracts: any
    walletInfo: WalletInfo
    getOrderApproveStep: (params: CreateOrderParams, side: OrderType) => Promise<any>
    getMatchCallData: (params: MatchParams) => Promise<any>
    createSellOrder: (order: SellOrderParams) => Promise<any>
    createLowerPriceOrder: (order: LowerPriceOrderParams) => Promise<any>
    createBuyOrder: (order: BuyOrderParams) => Promise<any>
    acceptOrder: (order: string, option?: AcceptOrderOption) => Promise<any>
    cancelOrders: (orders: string[]) => Promise<any>
    acceptOrders?: (orders: string[], option?: BatchAcceptOrderOption) => Promise<any>
    approveOrder?: (error: any) => Promise<any>
    checkOrderMatch?: (order: string, params?: MatchParams) => Promise<any>
    checkOrderPost?: (order: string, params?: MatchParams) => Promise<any>
}




