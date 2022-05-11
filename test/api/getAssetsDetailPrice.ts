import {ElementSDK, ElementAPI, ElementExSwap, OrderType, ExSchemaName, Asset} from "../../index";
import * as secrets from '../../../secrets.json'
import {OrderQueryParams} from "../../src/api/restful/ordersApi";
import {asset721} from "../assets";

const buyer = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A'
const chainId = 97
const eleAPI = new ElementAPI({
        chainId,
        address: buyer,
        priKey: secrets.accounts[buyer]
    })
;(async () => {
    // await elementOrders.login()
    // const thirdStandards = chainId == 4 ? ['element-ex-v3', 'opensea-wyv', 'element-wyv']:["nfttrade-zero-ex", "opensea-wyv", "element-ex-v3"]
    const thirdStandards = ["nfttrade-zero-ex", "opensea-wyv", "element-ex-v3"]
    const asset = asset721[chainId][0]
    const params = {
        tokenId: asset.tokenId,
        assetContractAddress: asset.tokenAddress,
        orderType: OrderType.Sell,
        thirdStandards
    } as OrderQueryParams
    const list = await eleAPI.getAssetsDetailPrice(params)
    console.log(list.edges.length)
    for (const edge of list.edges) {
        const order = edge.node
        const {metadata} = order
        console.log(`OrderId ${order.id} schemaName ${metadata.schema} standard ${order.standard || 'element-wyn'}  priceUSD ${order.priceUSD}`)
    }
})()
