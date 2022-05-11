
import BigNumber from "bignumber.js";
import {Fetch} from "./restful/base";
import {ElementConfig, OrderQueryParams, WalletInfo} from "../types/elementTypes";
import {NULL_ADDRESS, Order} from "../openseaEx/types";
import {orderToJSON} from "../openseaEx/utils/makeOrder";
import {openseaOrderFromJSON} from "../openseaEx/utils/helper";
// import {OrderJSON} from "../openseaEx/types";



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
    public apiKey = ''

    constructor(
        wallet: WalletInfo,
        config?: ElementConfig
    ) {
        super({})
        if (apiConfig[wallet.chainId]) {
            this.apiBaseUrl = apiConfig[wallet.chainId].apiBaseUrl
            this.apiKey = apiConfig[wallet.chainId].apiKey
        }
    }

    public async getOrders(queryParams: OrderQueryParams): Promise<any> {
        const limit = 2
        const asset_contract_address = queryParams.assetContractAddress
        const token_id = queryParams.tokenId
        const side = 1//queryParams.orderType
        const query = {token_id, asset_contract_address, limit, side}
        console.log(query)
        const json = await this.get(`${ORDERBOOK_PATH}/orders`, query, {
            headers: {
                "X-API-KEY": this.apiKey
            }
        })
        const orders = json.orders
        if (!orders) {
            throw new Error(`Not found: no matching order found`)
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

        // json = await this.post(`${ORDERBOOK_PATH}/orders/post/`, order) as OrderJSON
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
