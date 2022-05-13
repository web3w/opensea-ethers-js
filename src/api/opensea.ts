import {Fetch} from "./restful/base";
import {ElementConfig, OrderType, WalletInfo} from "web3-wallets";
import {orderToJSON} from "../openseaEx/utils/makeOrder";
import {openseaOrderFromJSON} from "../openseaEx/utils/helper";
import QueryString from "querystring";
import {AssetCollection, AssetQueryParams, OrderQueryParams} from "../openseaEx/types";


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
    public accountAddress = ''

    constructor(
        wallet: WalletInfo,
        config?: ElementConfig
    ) {
        super()
        if (apiConfig[wallet.chainId]) {
            this.apiBaseUrl = config?.apiBaseUrl || apiConfig[wallet.chainId].apiBaseUrl
            this.apiKey = config?.account || apiConfig[wallet.chainId].apiKey
        }
    }

    public async getAssets(owner: string, queryParams: AssetQueryParams[]): Promise<AssetCollection[]> {
        const list = queryParams.map((val: any) => {
            return QueryString.stringify(val)
        })
        const assetList = list.join('&')

        const query = {
            include_orders: true,
            owner,
            limit: 50
        }
        const queryUrl = `${QueryString.stringify(query)}&${assetList}`
        const json = await this.getURL('/api/v1/assets', queryUrl)

        const assets = json.assets.map(val => ({...val.asset_contract, token_id: val.token_id}))

        return assets

    }

    public async getOrders(queryParams: OrderQueryParams): Promise<any> {
        const limit = 2
        const asset_contract_address = queryParams.assetContractAddress
        const token_id = queryParams.tokenId
        const side = queryParams.orderType || 1//queryParams.orderType
        const query = {token_id, asset_contract_address, limit, side}
        console.log(query)
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
        return {recordCount: eleOrders.length, inforList: eleOrders}
    }

    public async postSingedOrder(orderStr: string): Promise<any> {
        const singSellOrder = JSON.parse(orderStr)
        delete singSellOrder.hash
        delete singSellOrder.offerType
        singSellOrder.calldata = singSellOrder.dataToCall
        // singSellOrder.nonce = singSellOrder.nonce.toString()
        delete singSellOrder.dataToCall

        // json = await this.post(`${ORDERBOOK_PATH} / orders / post / `, order) as OrderJSON
        try {
            const opts = {
                headers: {
                    'X-API-KEY': this.apiKey
                }
            }
            const json = await this.post(
                `${ORDERBOOK_PATH}/orders/post`,
                singSellOrder,
                opts
            )
            console.log('Success', json)
        } catch
            (error) {
            console.log(error)
        }
    }


}
