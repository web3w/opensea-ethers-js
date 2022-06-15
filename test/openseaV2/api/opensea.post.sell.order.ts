import {SellOrderParams} from "web3-accounts";

import * as secrets from '../../../../secrets.json'
import {OpenseaExAgent} from "../../../src/openseaEx/openseaExAgent";
import {AssetsQueryParams} from "../../../src/openseaEx/types";


const seller = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A'
const buyer = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401'

const Test_API_CONFIG = {
        1: {
            proxyUrl: 'http://127.0.0.1:7890',
            apiTimeout: 10200,
            protocolFeePoint: 250
        },
        4: {
            proxyUrl: 'http://127.0.0.1:7890',
            apiTimeout: 10200,
            protocolFeePoint: 250
        }
    }

;(async () => {
        try {

            const chainId = 4
            const config = Test_API_CONFIG[chainId]
            const sdk = new OpenseaExAgent({
                chainId,
                address: seller,
                privateKeys: secrets.privateKeys
            }, config)
            const val = (await sdk.getOwnerAssets()) [0]
            const sellAsset = {
                tokenId: val.token_id,
                tokenAddress: val.address,
                schemaName: val.schema_name,
                collection: {
                    royaltyFeeAddress: val.royaltyFeeAddress,
                    royaltyFeePoint: val.royaltyFeePoint
                }
            }
            if (!sellAsset) throw "error"

            // paymentToken: sellEx.contracts.ETH,
            const sellParams = {
                asset: sellAsset,
                startAmount: 0.0001,
            } as SellOrderParams

            const buyData = await sdk.createBuyOrder(sellParams)
            const buyOrder = await sdk.api.postOrder(JSON.stringify(buyData)).catch((e: any) => {
                console.log('eee', e.message)
            })
            console.log('success buyOrder', buyOrder.id)

            const sellData = await sdk.createSellOrder(sellParams)


            const sellOrder = await sdk.api.postOrder(JSON.stringify(sellData)).catch((e: any) => {
                console.log('eee', e.message)
            })
            console.log('success sellOrder', sellOrder.id)
            return

            // const orderQuery = {
            //     asset_contract_address: sellAsset.tokenAddress, //
            //     token_ids: [sellAsset.tokenId]
            // }
            // const {orders} = await sdk.api.getOrders(orderQuery)
            // console.log(orders)

            // const tx = await buyEx.matchOrder(JSON.stringify(orders[0]))


            const assetsQuery = {
                assets: [{
                    asset_contract_addresses: sellAsset.tokenAddress, //
                    token_ids: sellAsset.tokenId
                }],
                include_orders: true,
            } as AssetsQueryParams
            const order = await sdk.api.getAssets(assetsQuery)

            console.log(order)

            // await buyEx.exAgent.acceptOrder(JSON.stringify(sellData))
        } catch (e) {
            console.log(e)
        }
    }
)()
