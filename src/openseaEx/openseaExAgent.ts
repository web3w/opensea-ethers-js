import EventEmitter from 'events'

import {
    BuyOrderParams,
    CreateOrderParams,
    ElementConfig,
    LowerPriceOrderParams,
    MatchParams,
    OrderType,
    SellOrderParams,
    WalletInfo
} from '../../index'

import {OpenseaEx} from "./openseaEx";
import {ExAgent} from "../types/agentTypes";


export class OpenseaExAgent extends EventEmitter implements ExAgent {
    public contracts: OpenseaEx
    public walletInfo: WalletInfo

    constructor(wallet: WalletInfo, config?: ElementConfig) {
        super()
        const {chainId, address} = wallet
        let conf: ElementConfig = {chainId}
        if (config) {
            conf = config
        }
        // const {walletProvider} = getProvider(wallet)
        this.contracts = new OpenseaEx(wallet, conf)
        // this.walletProvider = walletProvider
        this.walletInfo = wallet
    }

    async getOrderApproveStep(params: CreateOrderParams, side: OrderType) {
        return this.contracts.getOrderApproveStep(params, side)
    }

    async getMatchCallData(params: MatchParams): Promise<any> {
        return this.contracts.getMatchCallData(params)
    }

    public async createSellOrder(params: SellOrderParams): Promise<any> {
        return this.contracts.createSellOrder(params)
    }

    public async createBuyOrder(params: BuyOrderParams): Promise<any> {
        return this.contracts.createBuyOrder(params)
    }

    public async acceptOrder(orderStr: string) {
        return this.contracts.acceptOrder(orderStr)
    }

    public async cancelOrders(orders: string[]) {
        return this.contracts.cancelOrders(orders)
    }

    async createLowerPriceOrder(params: LowerPriceOrderParams): Promise<any> {
        return Promise.resolve()
    }
}

