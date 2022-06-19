import * as secrets from '../../secrets.json'
import {
    Asset,
    assetToMetadata,
    SellOrderParams,
    tokenToMetadata,
    Token
} from "web3-accounts";

import {asset721, erc20Tokens} from "./assets";
import {OpenSeaSDK} from "../index";

const rpcUrl = 'https://api-test.element.market/api/v1/jsonrpc'

const buyer = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401';
const seller = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A';

// const newGuy = '0xB678bAC834679CF1E3B2d5d2Dd21319447d42861'
const chainId = 4
const asset = asset721[chainId][0] as Asset
const token = erc20Tokens[chainId][0] as Token


const eleAgent = new OpenSeaSDK({
    chainId,
    address: seller,
    privateKeys: secrets.privateKeys
});

const eleSDK = new OpenSeaSDK({
    chainId,
    address: seller,
    privateKeys: secrets.privateKeys
});

const buySDK = new OpenSeaSDK({
    chainId,
    address: buyer,
    privateKeys: secrets.privateKeys
});

;(async () => {
        // const tokenBal = await eleSDK.getUserTokenBalance(token.address, token.decimals)
        // console.log(tokenBal)
        try {
            // const registerApp = await eleAgent.getRegisterProxy()
            // console.log(registerApp)
            const assetMeta = assetToMetadata(asset, "1")
            const assetApp = await eleAgent.getAssetApprove([assetMeta])
            const tokenMata = tokenToMetadata(token, "0.03")
            const tokenApp = await eleAgent.getAssetApprove([tokenMata])
            // console.log(tokenApp)

            const buyParams = {
                asset,
                startAmount: Number('0.002'),
                quantity: 1
            } as SellOrderParams
            const sellData = await eleSDK.createSellOrder(buyParams)
            // const order = {...sellData, version: 0}
            const sellOrderStr = JSON.stringify(sellData)

            const cancelOrderTx = await eleSDK.cancelOrders([sellOrderStr])
            await cancelOrderTx.wait()

            const buyTx = await buySDK.matchOrder(sellOrderStr)
            await buyTx.wait()
            console.log('Buy success', buyTx.hash)


            // const order = await eleSDK.postOrder(sellOrderStr, {standard})
            // console.log(order.id || order)

            // const lowParams = {
            //     orderStr: sellOrderStr,
            //     basePrice: new BigNumber(0.001).times(new BigNumber(10).pow(18)).toString(),
            //     royaltyFeePoints: 200,
            //     royaltyFeeAddress: "0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401",
            //     standard
            // } as LowerPriceOrderParams
            //
            // const sellLowData = await eleSDK.createLowerPriceOrder(lowParams)
            //
            // const res = await eleSDK.postOrder(sellOrderStr, {standard: ExSchemaName.ElementExV3})
            // console.log(res.id || res)

        } catch (err: any) {
            debugger
            console.log(err)
        }
    }
)()
