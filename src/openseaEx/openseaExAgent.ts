import EventEmitter from 'events'

import {
    BuyOrderParams,
    CreateOrderParams,
    APIConfig,
    TokenSchemaName,
    ExchangetAgent,
    ExchangeMetadata,
    LowerPriceOrderParams,
    MatchParams,
    metadataToAsset,
    OrderType,
    SellOrderParams
} from "web3-accounts"

import {WalletInfo, LimitedCallSpec, BigNumber,NULL_ADDRESS} from "./types"

import {OpenseaEx} from "./openseaEx";
import {OpenseaAPI} from "../api/opensea";

export class OpenseaExAgent extends EventEmitter implements ExchangetAgent {
    public contracts: OpenseaEx
    public walletInfo: WalletInfo
    public openseaApi: OpenseaAPI

    constructor(wallet: WalletInfo, config?: APIConfig) {
        super()
        const {chainId} = wallet
        let conf: APIConfig = {chainId}
        if (config) {
            conf = config
        }
        this.contracts = new OpenseaEx(wallet, conf)
        this.openseaApi = new OpenseaAPI(wallet, conf)
        this.walletInfo = wallet
    }

    async getRegisterProxy(): Promise<{ isRegister: boolean, accountProxy: string, calldata: LimitedCallSpec | undefined }> {
        const {accountProxy} = await this.contracts.getAccountProxy()
        // const registerCallData =
        const isRegister = accountProxy != NULL_ADDRESS
        const calldata = isRegister ? undefined : await this.contracts.registerProxyCallData()
        return {
            isRegister,
            accountProxy,
            calldata
        }
    }

    async getAssetApprove(metadatas: ExchangeMetadata[], decimals?: number) {
        const assetApprove: any[] = []
        for (const metadata of metadatas) {
            const {asset, schema} = metadata
            const metaAsset = metadataToAsset(metadata)
            const {address, quantity} = asset
            if (!quantity) throw 'Asset quantity is undefined'

            if (schema == TokenSchemaName.ERC20) {
                const {allowance, balances, calldata} = await this.contracts.getTokenProxyApprove(address)
                const spend = new BigNumber(quantity).times(new BigNumber(10).pow(decimals || 18))
                // if (spend.gt(balances)) {
                //     // throw 'Token is not enough'
                // }
                assetApprove.push({
                    isApprove: spend.lte(allowance),
                    balances,
                    calldata: spend.lte(allowance) ? undefined : calldata
                })
            } else if (schema == TokenSchemaName.ERC721 || schema == TokenSchemaName.ERC1155) {
                const data = await this.contracts.getAssetProxyApprove(metaAsset)
                assetApprove.push(data)
            }
        }
        return assetApprove
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

