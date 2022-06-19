import * as secrets from '../../secrets.json'
import {assetToMetadata} from "../src/utils/helper";
import {Seaport} from "../../src/openseaEx";
import {Web3Accounts, Asset, SellOrderParams} from "web3-accounts";
import {asset721} from "./assets";


const buyer = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A'
const seller = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401'

// const standard = ExSchemaName.OpenseaEx

;(async () => {
        try {
            const chainId = 4
            const sellEx = new Seaport({
                chainId,
                address: seller,
                privateKeys: secrets.privateKeys
            },)

            const buyerSdk = new Seaport({
                chainId,
                address: buyer,
                privateKeys: secrets.privateKeys
            })
            const sellAsset = asset721[chainId][1] as Asset

            const sellBal = await sellEx.userAccount.getAssetBalances(sellAsset)
            const buyerBal = await sellEx.userAccount.getAssetBalances(sellAsset, buyer)
            if (sellBal == '0' && buyerBal == '0') {
                throw 'Asset balance 0'
            }
            if (Number(buyerBal) > Number(sellBal)) {
                const buyerSDK = new Web3Accounts({
                    chainId,
                    address: buyer,
                    privateKeys: secrets.privateKeys
                });
                const metadata = assetToMetadata(sellAsset, "1")
                const tx = await buyerSDK.assetTransfer(metadata, seller)
                await tx.wait()
            }

            // paymentToken: sellEx.contracts.ETH,
            const sellParams = {
                asset: sellAsset,
                startAmount: 0.002,
            } as SellOrderParams




            // const step = await eleEx.getOrderApproveStep(sellParams, OrderSide.Sell)
            // console.log(step)
            const sellData = await sellEx.createSellOrder(sellParams)
            const orderStr = JSON.stringify(sellData)

            // const res = await eleEx.postOpenSeaOrder(orderStr)
            // const res = await eleEx.postOrder(orderStr,{standard})
            // console.log(res)
            const {callData, params, sell, buy} = await buyerSdk.getMatchCallData({
                orderStr,
            })
            //https://rinkeby.etherscan.io/tx/0x290a6ae032856189e148b0d352ab76b45c2f07bbf2db4f32ed65c21e2798c5a6
            const gas = await buyerSdk.estimateGas(callData).catch(async (err: any) => {
                console.log(err)
            })
            console.log('Buy Now success ', gas)

            // const acceptTx = await buyerSdk.acceptOrder(orderStr, {standard}).catch(async (err: any) => {
            //     console.log(err)
            // })
            // await acceptTx.wait()
            // console.log('Buy Now success ', acceptTx.hash)


            const buyData = await buyerSdk.createBuyOrder(sellParams)
            const buyOrderStr = JSON.stringify(buyData)
            const offerOrder = await sellEx.getMatchCallData({
                orderStr: buyOrderStr,
            })

            //ok https://rinkeby.etherscan.io/tx/0x1a9ab7ba090f62460a2157187578ba7698cadd9d48a430cadc2da785e890c0b8
            const offerGas = await sellEx.estimateGas(offerOrder.callData).catch(async (err: any) => {
                console.log(err)
            })
            console.log("Offer  success ", offerGas)
            // const tx = await eleEx.ethSend(offerOrder.callData)
            // if(tx){
            //     console.log(tx.hash)
            // }
        } catch
            (e) {
            console.log(e)
        }
    }
)()
