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
    const asset = asset721[chainId][0]
    const params = {
        tokenId: asset.tokenId,
        assetContractAddress: asset.tokenAddress,
    } as OrderQueryParams
    const list = await eleAPI.getAssetsDetail(params)
    console.log(list.collection.royalty, list.collection.royaltyAddress)

    const collection = {
        elementSellerFeeBasisPoints: list.collection.royalty,
        transferFeeAddress: list.collection.royaltyAddress
    }

})()
