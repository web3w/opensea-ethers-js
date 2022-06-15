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
            // const config = {proxyUrl: 'http://127.0.0.1:7890',protocolFeePoint:2}
            const config = Test_API_CONFIG[chainId]
            const sdk = new OpenseaExAgent({
                chainId,
                address: seller,
                privateKeys: secrets.privateKeys
            }, config)

            const query: AssetsQueryParams = {
                assets: [{
                    asset_contract_addresses: "0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656", //
                    token_ids: "101812471375485254897399191407611800007244227253696807451733282608805056610305"
                }]
            }
            const assets = await sdk.api.getAssets(query)

            const sellAsset =   assets.map((val) => ({
                tokenId: val.token_id,
                tokenAddress: val.address,
                schemaName: val.schema_name,
                collection: {
                    transferFeeAddress: val.royaltyFeeAddress || "",
                    elementSellerFeeBasisPoints: Number(val.royaltyFeeAddress)
                }
            }))[0]
            if(!sellAsset) throw "error"

            // paymentToken: sellEx.contracts.ETH,
            const sellParams = {
                asset: sellAsset,
                startAmount: 0.0001,
            } as SellOrderParams

            const sellData = await sdk.createSellOrder(sellParams)
            // const sellData = await sellEx.createBuyOrder(sellParams)

            const foo = await sdk.api.postOrder(JSON.stringify(sellData)).catch((e: any) => {
                console.log('eee', e.message)
            })
            console.log('success', foo)
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
