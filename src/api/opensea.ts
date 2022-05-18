import {Fetch, Sleep} from "./restful/base";
import {APIConfig, OrderType, WalletInfo} from "web3-wallets";
import {orderToJSON} from "../openseaEx/utils/makeOrder";
import {openseaOrderFromJSON} from "../openseaEx/utils/helper";
import QueryString from "querystring";
import {AssetCollection, AssetOrdersQueryParams, AssetsQueryParams} from "../openseaEx/types";


const ORDERBOOK_VERSION = 1
const ORDERBOOK_PATH = `/wyvern/v${ORDERBOOK_VERSION}`

//has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
const apiConfig = {
    1: {
        apiBaseUrl: 'https://api.opensea.io',
        apiKey: '2f6f419a083c46de9d83ce3dbe7db601'
    },
    4: {
        apiBaseUrl: 'https://testnets-api.opensea.io',
        apiKey: '2f6f419a083c46de9d83ce3dbe7db601'
    }
}


export class OpenseaAPI extends Fetch {
    constructor(
        wallet: WalletInfo,
        config?: APIConfig
    ) {
        super()
        const {chainId} = wallet
        if (apiConfig[chainId]) {
            this.apiBaseUrl = config?.apiBaseUrl || apiConfig[chainId].apiBaseUrl
            this.apiKey = config?.authToken || apiConfig[chainId].apiKey
            this.proxyUrl = config?.proxyUrl || ""
            this.apiTimeout = config?.apiTimeout || 2000
        } else {
            throw 'OpenseaAPI unsport chainId:' + wallet.chainId
        }
    }

    public async getAssets(queryParams: AssetsQueryParams, retries = 2): Promise<AssetCollection[]> {
        const {owner, include_orders, limit, assets} = queryParams
        const list = assets ? assets.map((val: any) => {
            return QueryString.stringify(val)
        }) : []
        const assetList = list.join('&')
        const query = {
            include_orders: include_orders || false,
            limit: limit || 10
        }
        if (owner) {
            query['owner'] = owner
        }
        const queryUrl = list.length > 0
            ? `${QueryString.stringify(query)}&${assetList}`
            : QueryString.stringify(query)

        try {
            const json = await this.getURL('/api/v1/assets', queryUrl)
            return json.assets.map(val => ({
                ...val.asset_contract,
                buy_orders: val.buy_orders,
                sell_orders: val.sell_orders,
                token_id: val.token_id
            }))
        } catch (error: any) {
            this.throwOrContinue(error, retries)
            await Sleep(3000)
            return this.getAssets(queryParams, retries - 1)
        }
    }

    public async getAssetOrders(queryParams: AssetOrdersQueryParams, retries = 2): Promise<any> {
        const {token_ids, asset_contract_address} = queryParams
        try {
            const query = {
                token_ids,
                asset_contract_address,
                limit: queryParams.limit || 10,
                side: queryParams.side || 0,
                order_by: queryParams.order_by || 'created_date'
            }
            const json = await this.get(`${ORDERBOOK_PATH}/orders`, query, {
                headers: {
                    "X-API-KEY": this.apiKey
                }
            })
            const orders = json.orders
            if (!orders) {
                throw new Error('Not  found: no  matching  order  found')
            }
            const eleOrders: any[] = []
            for (let i = 0; i < orders.length; i++) {
                const order = openseaOrderFromJSON(orders[i])
                eleOrders.push(orderToJSON(order))
            }
            return eleOrders
        } catch (error: any) {
            this.throwOrContinue(error, retries)
            await Sleep(3000)
            return this.getAssetOrders(queryParams, retries - 1)
        }
    }

    public async postSingedOrder(orderStr: string, retries = 2): Promise<any> {
        const singSellOrder = JSON.parse(orderStr)
        // delete singSellOrder.hash
        // delete singSellOrder.offerType
        // singSellOrder.calldata = singSellOrder.dataToCall
        // singSellOrder.nonce = singSellOrder.nonce.toString()
        // delete singSellOrder.dataToCall

        try {
            const opts = {
                headers: {
                    'X-API-KEY': this.apiKey
                }
            }
            const result = await this.post(
                `${ORDERBOOK_PATH}/orders/post`,
                singSellOrder,
                opts
            ).catch((e: any) => {
                console.log(e)
                throw e
            })
            return result
        } catch (error: any) {
            this.throwOrContinue(error, retries)
            await Sleep(3000)
            return this.postSingedOrder(orderStr, retries)
        }
    }


}
