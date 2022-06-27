import QueryString from "querystring";
import {orderToJSON} from "../utils/makeOrder";
import {openseaOrderFromJSON} from "../utils/helper";

import {
    AssetCollection,
    OrdersQueryParams,
    AssetsQueryParams,
    APIConfig, OrderJSON, OrderSide, sleep, BaseFetch
} from "../types";

import {OPENSEA_API_TIMEOUT, OPENSEA_API_CONFIG, ORDERS_PATH, OPENSEA_API_KEY} from "../utils/constants";
import {assert, schemas} from "../assert/index";


export class OpenseaAPI extends BaseFetch {
    constructor(
        config?: APIConfig
    ) {
        const chainId = config?.chainId || 1
        const url = OPENSEA_API_CONFIG[chainId].apiBaseUrl || OPENSEA_API_CONFIG[1].apiBaseUrl
        const apiBaseUrl = config?.apiBaseUrl || url
        super({
            apiBaseUrl,
            apiKey: config?.apiKey || OPENSEA_API_KEY
        })
        if (OPENSEA_API_CONFIG[chainId]) {
            this.proxyUrl = config?.proxyUrl
            this.apiTimeout = config?.apiTimeout || OPENSEA_API_TIMEOUT
        } else {
            throw 'OpenseaAPI unsport chainId:' + config?.chainId
        }
    }

    //https://docs.opensea.io/reference/getting-assets
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
            console.log(`${this.apiBaseUrl}/api/v1/assets?${queryUrl}`)
            //https://api-test.element.market/bridge/opensea/api/v1/assets?
            const json = await this.getQueryString('/api/v1/assets', queryUrl)

            // json.assets.collection.dev_seller_fee_basis_points
            // json.assets.asset_contract.dev_seller_fee_basis_points
            return json.assets.map(val => ({
                ...val.asset_contract,
                royaltyFeePoints: Number(val.collection?.dev_seller_fee_basis_points),
                protocolFeePoints: Number(val.collection?.opensea_seller_fee_basis_points),
                royaltyFeeAddress: val.collection?.payout_address,
                sell_orders: val.sell_orders,
                token_id: val.token_id
            }))
        } catch (error: any) {
            this.throwOrContinue(error, retries)
            await sleep(3000)
            return this.getAssets(queryParams, retries - 1)
        }
    }

    //https://docs.opensea.io/reference/retrieving-orders
    public async getOrders(queryParams: OrdersQueryParams, retries = 2): Promise<{ orders: OrderJSON[], count: number }> {
        const {token_ids, owner, limit, side, order_by, asset_contract_address} = queryParams
        try {
            queryParams.limit = queryParams.limit || 10
            queryParams.side = queryParams.side || OrderSide.Buy
            queryParams.order_by = queryParams.order_by || 'created_date'
            const json = await this.get(`${ORDERS_PATH}/orders`, queryParams, {
                headers: {
                    "X-API-KEY": this.apiKey || OPENSEA_API_KEY
                }
            })
            if (!json.orders) {
                throw new Error('Not  found: no  matching  order  found')
            }
            const orders: any[] = []
            for (let i = 0; i < json.orders.length; i++) {
                const order = openseaOrderFromJSON(json.orders[i])
                orders.push(orderToJSON(order))
            }
            return {
                orders,
                count: json.count
            }
        } catch (error: any) {
            this.throwOrContinue(error, retries)
            await sleep(3000)
            return this.getOrders(queryParams, retries - 1)
        }
    }

    public async postOrder(orderStr: string, retries = 2): Promise<any> {
        const singSellOrder = JSON.parse(orderStr)
        assert.doesConformToSchema('PostOrder', singSellOrder, schemas.orderSchema)
        try {
            const opts = {
                headers: {
                    'X-API-KEY': this.apiKey || OPENSEA_API_KEY
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
            await sleep(3000)
            return this.postOrder(orderStr, retries)
        }
    }

}
