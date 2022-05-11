import {ElementSDK, ElementAPI, ElementExSwap, OrderType, ExSchemaName, Asset} from "../../index";
import * as secrets from '../../../secrets.json'

const buyer = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A'
const chainId = 4
const eleAPI = new ElementAPI({
        chainId,
        address: buyer,
        priKey: secrets.accounts[buyer]
    })
;(async () => {
    // await elementOrders.login()

    //
    // const list = await eleAPI.getUserAssetsList() // error
    const list = await eleAPI.exploreAssetsList()
    console.log(list.totalCount)
    for (const edge of list.edges) {
        const {asset} = edge.node
        if (asset == null) continue
        const {collection, paymentTokens} = asset
        console.log(`name ${asset.name} chainId ${Number(asset.chainId)}  tokenType ${asset.tokenType} royalty ${collection.royalty}`)
    }

})()
