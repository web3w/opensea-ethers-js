import {Fetch, Sleep} from "./restful/base";
import {orderToJSON} from "../openseaEx/utils/makeOrder";
import {openseaOrderFromJSON} from "../openseaEx/utils/helper";
import QueryString from "querystring";
import {
    AssetCollection,
    OrdersQueryParams,
    AssetsQueryParams,
    APIConfig,
    WalletInfo, OrderType
} from "../openseaEx/types";

import {OPENSEA_API_TIMEOUT, OPENSEA_API_CONFIG, ORDERS_PATH} from "../openseaEx/utils/constants";

export class OpenseaAPI extends Fetch {
    constructor(
        config?: APIConfig
    ) {
        super()
        const chainId = config?.chainId || 1
        if (OPENSEA_API_CONFIG[chainId]) {
            this.apiBaseUrl = config?.apiBaseUrl || OPENSEA_API_CONFIG[chainId].apiBaseUrl
            this.apiKey = config?.authToken || OPENSEA_API_CONFIG[chainId].apiKey
            this.proxyUrl = config?.proxyUrl || ""
            this.apiTimeout = config?.apiTimeout || OPENSEA_API_TIMEOUT
        } else {
            throw 'OpenseaAPI unsport chainId:' + config?.chainId
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

    public async getOrders(queryParams: OrdersQueryParams, retries = 2): Promise<any> {
        const {token_ids, asset_contract_address} = queryParams
        try {
            const query = {
                token_ids,
                asset_contract_address,
                limit: queryParams.limit || 10,
                side: queryParams.side || OrderType.Buy,
                order_by: queryParams.order_by || 'created_date'
            }
            const json = await this.get(`${ORDERS_PATH}/orders`, query, {
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
            return {
                orders: eleOrders,
                count: json.count
            }
        } catch (error: any) {
            this.throwOrContinue(error, retries)
            await Sleep(3000)
            return this.getOrders(queryParams, retries - 1)
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
                `${ORDERS_PATH}/orders/post`,
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
