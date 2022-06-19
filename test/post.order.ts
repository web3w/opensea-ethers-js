import {SellOrderParams} from "web3-accounts";

import * as secrets from '../../secrets.json'
import {OpenSeaSDK} from "../src/index";
import {AssetsQueryParams} from "../src/types";


const seller = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A'
const buyer = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401'

const API_CONFIG = {
        1: {
            proxyUrl: 'http://127.0.0.1:7890',
            apiTimeout: 10200,
            protocolFeePoints: 250
        },
        4: {
            proxyUrl: 'http://127.0.0.1:7890',
            apiTimeout: 10200,
            protocolFeePoints: 250
        }
    }

;(async () => {
        try {

            const chainId = 4
            const config = API_CONFIG[chainId]
            const sdk = new OpenSeaSDK({
                chainId,
                address: seller,
                privateKeys: secrets.privateKeys
            }, config)
            const ownerAsset = (await sdk.getOwnerAssets())[0]
            const asset = {
                tokenId: ownerAsset.token_id,
                tokenAddress: ownerAsset.address,
                schemaName: ownerAsset.schema_name,
                collection: {
                    royaltyFeeAddress: ownerAsset.royaltyFeeAddress,
                    royaltyFeePoints: ownerAsset.royaltyFeePoints
                }
            }
            console.log(asset)
            if (!asset) throw "error"
            const sellParams = {
                asset,
                startAmount: 0.0001,
            } as SellOrderParams

            const buyData = await sdk.createBuyOrder(sellParams)
            const cancelTx = await sdk.cancelOrders([JSON.stringify(buyData)])
            await cancelTx.wait()
            console.log("success cancelOrders", cancelTx.hash)

            const buyOrder = await sdk.api.postOrder(JSON.stringify(buyData))
            console.log('Success offer', buyOrder.id)




            const sellData = await sdk.createSellOrder(sellParams)
            const sellOrder = await sdk.api.postOrder(JSON.stringify(sellData))
            console.log('success listing', sellOrder.id)




            // await buyEx.exAgent.acceptOrder(JSON.stringify(sellData))
        } catch (e) {
            console.log(e)
        }
    }
)()
