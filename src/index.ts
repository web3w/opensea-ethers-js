import EventEmitter from 'events'

import {
    BuyOrderParams,
    CreateOrderParams,
    APIConfig,
    ExchangetAgent,
    ExchangeMetadata,
    LowerPriceOrderParams,
    MatchParams,
    metadataToAsset,
    OrderType,
    SellOrderParams
} from "web3-accounts"

import {
    WalletInfo,
    LimitedCallSpec,
    BigNumber,
    NULL_ADDRESS,
    AssetsQueryParams,
    AssetCollection,
    FeesInfo
} from "./types"

import {OpenSea} from "./opensea";
import {OpenseaAPI} from "./api/opensea";
import {Asset} from "web3-accounts/lib/src/types";
import {detectWallets} from "web3-wallets";

export class OpenSeaSDK extends EventEmitter implements ExchangetAgent {
    public contracts: OpenSea
    public walletInfo: WalletInfo
    public api: OpenseaAPI

    constructor(wallet: WalletInfo, config?: APIConfig) {
        super()
        const {chainId, address} = wallet
        let conf: APIConfig = {chainId, account: address}
        if (config) {
            conf = {...conf, ...config}
        }
        this.contracts = new OpenSea(wallet, conf)
        this.api = new OpenseaAPI(conf)
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

            if (schema.toLowerCase() == 'erc20') {
                const {allowance, balances, calldata} = await this.contracts.getTokenProxyApprove(address)
                const spend = new BigNumber(quantity).times(new BigNumber(10).pow(decimals || 18))
                assetApprove.push({
                    isApprove: spend.lte(allowance),
                    balances,
                    calldata: spend.lte(allowance) ? undefined : calldata
                })
            } else if (schema.toLowerCase() == 'erc721' || schema.toLowerCase() == 'erc1155') {
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

    async createSellOrder(params: SellOrderParams): Promise<any> {
        return this.contracts.createSellOrder(params)
    }

    async createBuyOrder(params: BuyOrderParams): Promise<any> {
        return this.contracts.createBuyOrder(params)
    }

    async matchOrder(orderStr: string) {
        return this.contracts.matchOrder(orderStr)
    }

    async fulfillOrder(orderStr: string) {
        return this.contracts.matchOrder(orderStr)
    }

    async cancelOrders(orders: string[]) {
        return this.contracts.cancelOrders(orders)
    }

    async getAssetBalances(asset: Asset, account?: string): Promise<string> {
        return this.contracts.userAccount.getAssetBalances(asset, account)
    }

    async getTokenBalances(params: {
        tokenAddress: string;
        accountAddress?: string;
        rpcUrl?: string;
    }): Promise<any> {
        return this.contracts.userAccount.getTokenBalances({
            tokenAddr: params.tokenAddress,
            account: params.accountAddress,
            rpcUrl: params.rpcUrl
        })
    }

    async transfer(asset: Asset, to: string, quantity: number) {
        return this.contracts.userAccount.transfer(asset, to, quantity)
    }

    async getOwnerAssets(tokens?: AssetsQueryParams): Promise<AssetCollection[]> {
        if (tokens) {
            tokens.owner = tokens.owner || this.walletInfo.address
        } else {
            tokens = {
                owner: this.walletInfo.address,
                limit: 1,
            }
        }
        return this.api.getAssets(tokens)
    }

    async getAssetsFees(tokens: AssetsQueryParams): Promise<FeesInfo[]> {
        const assets: AssetCollection[] = await this.api.getAssets(tokens)
        return assets.map(val => (<FeesInfo>{
            royaltyFeeAddress: val.royaltyFeeAddress,
            royaltyFeePoint: val.royaltyFeePoint,
            protocolFeePoint: val.protocolFeePoint,
            protocolFeeAddress: this.contracts.feeRecipientAddress
        }))
    }

    //TODO
    async createLowerPriceOrder(params: LowerPriceOrderParams): Promise<any> {
        return Promise.resolve()
    }
}

