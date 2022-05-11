import * as secrets from '../../../secrets.json'
import {Asset, ExSchemaName, MakeOrderType, Token} from "../../src/types/elementTypes";
import {LowerPriceOrderParams, SellOrderParams} from "../../src/types/agentTypes";
import {asset721, erc20Tokens} from "../assets";
import BigNumber from "bignumber.js";
import {OpenseaEx} from "../../src/openseaEx/openseaEx";

const rpcUrl = 'https://api-test.element.market/api/v1/jsonrpc'

const buyer = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401';
const seller = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A';
const chainId = 4
const asset = asset721[chainId][0] as Asset
const token = erc20Tokens[chainId][0] as Token


const eleSDK = new OpenseaEx({
    chainId,
    address: seller,
    priKey: secrets.accounts[seller]
});

const buySDK = new OpenseaEx({
    chainId,
    address: buyer,
    priKey: secrets.accounts[buyer]
});

const standard = ExSchemaName.OpenseaEx
;(async () => {
        // const tokenBal = await eleSDK.getUserTokenBalance(token.address, token.decimals)
        // console.log(tokenBal)
        try {
            const buyParams = {
                asset,
                startAmount: Number('0.002'),
                quantity: 1,
                standard
            } as SellOrderParams
            const sellData = await eleSDK.createSellOrder(buyParams)
            // const order = {...sellData, version: 0}
            const sellOrderStr = JSON.stringify(sellData)

            const buyTx = await buySDK.acceptOrder(sellOrderStr)
            await buyTx.wait()
            console.log('Buy success', buyTx.hash)

            const cancelOrderTx = await eleSDK.cancelOrders([sellOrderStr])
            await cancelOrderTx.wait()

            const order = await eleSDK.postOrder(sellOrderStr, {standard})
            console.log(order.id || order)

            // const lowParams = {
            //     orderStr: sellOrderStr,
            //     basePrice: new BigNumber(0.001).times(new BigNumber(10).pow(18)).toString(),
            //     royaltyFeePoint: 200,
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
            // console.log(eleSDK.exAgent)
            // @ts-ignore
            const ex = await eleSDK.getExAgent(standard)
            const calldata = await ex.approveOrder(err)
            const tx = await eleSDK.ethSend(calldata)
            if (tx) {
                await tx.wait()
                console.log(tx.hash)
            }

        }
    }
)()
