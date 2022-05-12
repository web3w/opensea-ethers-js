import {Fetch} from "./restful/base";
import {ElementConfig, OrderType, WalletInfo} from "web3-wallets";
import {orderToJSON} from "../openseaEx/utils/makeOrder";
import {openseaOrderFromJSON} from "../openseaEx/utils/helper";
import QueryString from "querystring";
import * as http from "http";


export interface ChainInfo {
    chain?: string
    chainId?: string
}

export interface OrderQueryParams extends ChainInfo {
    assetContractAddress: string //
    tokenId: string
    orderType: OrderType
}

export interface AssetQueryParams {
    asset_contract_addresses: string
    token_ids: string
}

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

    public async getAssets(owner: string, queryParams: AssetQueryParams[]): Promise<any> {

        const list = queryParams.map((val: any) => {
            return QueryString.stringify(val)
        })
        const assetList = list.join('&')
        const other = {
            include_orders: true,
            owner,
            limit: 50
        }
        // const qs = QueryString.stringify(other) + '&' + assetList

        const url = `${this.apiBaseUrl}/v1/assets?${QueryString.stringify(other)}&${assetList}`

        const options = new URL(url)
        console.log(options)

        return new Promise(resolve => {
            http.get(options, function (http_res) {
                // initialize the container for our data
                var data = "";

                // this event fires many times, each time collecting another piece of the response
                http_res.on("data", function (chunk) {
                    // append this chunk to our growing `data` var
                    data += chunk;

                });

                // this event fires *one* time, after all the `data` events/chunks have been gathered
                http_res.on("end", function () {
                    // you can use res.send instead of console.log to output via express
                    console.log(data);
                    resolve(data)
                });
            });
        })


        // const options = {
        //     protocol:'https:',
        //     host: 'localhost',
        //     port:3000,
        //     path: '/iso/country/Japan',
        //     method:'GET'
        // };
        // const response = await this._fetch(url,options)
        // return response.json()
        // include_orders=true&owner=0x7db3E3f10faD9DB3a2DA202Ddfe62e6A05b86087&limit=50
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
