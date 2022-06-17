import {SellOrderParams} from "web3-accounts";

import * as secrets from '../../../secrets.json'
import {OrdersQueryParams} from "../../src/types";
import {OpenSeaSDK} from "../../src/index";
import {asset721} from "../assets";


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
            const sellEx = new OpenSeaSDK({
                chainId,
                address: seller,
                privateKeys: secrets.privateKeys
            }, config)

            const buyEx = new OpenSeaSDK({
                chainId,
                address: buyer,
                privateKeys: secrets.privateKeys
            }, config)

            const sellAsset = asset721[chainId][1]

            const query = {
                asset_contract_address: sellAsset.tokenAddress, //
                token_ids: [sellAsset.tokenId]
            } as OrdersQueryParams
            const {orders} = await sellEx.api.getOrders(query)
            console.log(orders)

            const tx = await buyEx.matchOrder(JSON.stringify(orders[0]))

            // paymentToken: sellEx.contracts.ETH,
            const sellParams = {
                asset: sellAsset,
                startAmount: 0.0001,
            } as SellOrderParams

            // const sellData = await sellEx.createSellOrder(sellParams)
            const sellData = await sellEx.createBuyOrder(sellParams)

            const foo = await sellEx.api.postOrder(JSON.stringify(sellData)).catch((e: any) => {
                console.log('eee', e.message)
            })
            console.log('success', foo)


            const assetsQuery = {
                assets: [{
                    asset_contract_addresses: sellAsset.tokenAddress, //
                    token_ids: sellAsset.tokenId
                }],
                include_orders: true,
            } as AssetsQueryParams
            const order = await sellEx.api.getAssets(assetsQuery)

            console.log(order)

            // await buyEx.exAgent.acceptOrder(JSON.stringify(sellData))
        } catch (e) {
            console.log(e)
        }
    }
)()
