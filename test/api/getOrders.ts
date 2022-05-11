import {ElementSDK, ElementAPI, ElementExSwap, OrderType, ExSchemaName, Asset} from "../../index";
import * as secrets from '../../../secrets.json'
import {OrderQueryParams} from "../../src/api/restful/ordersApi";

const buyer = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A'
const chainId = 4
const eleAPI = new ElementAPI({
        chainId,
        address: buyer,
        priKey: secrets.accounts[buyer]
    })
;(async () => {
    // await elementOrders.login()
    const thirdStandards = ['element-ex-v3', 'opensea-wyv','element-wyv']
    const asset = {
        tokenId: "3",
        assetContractAddress: '0xbe8a6dc659e0c8ddbb328ab278bc56cd014f9794'
    }
    const params = {
        tokenId: asset.tokenId,
        assetContractAddress: asset.assetContractAddress,
        orderType: OrderType.All,
        thirdStandards
    } as OrderQueryParams
    const list = await eleAPI.getOrders(params)
    console.log(list.recordCount)
    for (const order of list.inforList) {
        const {metadata} = order
        console.log(`OrderId ${order.id} schemaName ${metadata.schema}  priceUSD ${order.priceUSD}`)
    }
})()
