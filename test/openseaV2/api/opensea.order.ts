import {SellOrderParams} from "web3-wallets";

import * as secrets from '../../../../secrets.json'
import {AssetOrdersQueryParams} from "../../../src/openseaEx/types";
import {OpenseaExAgent} from "../../../src/openseaEx/openseaExAgent";
import {asset721} from "../../assets";
import {AssetsQueryParams} from "element-sdk";


const seller = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A'
// const seller = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401'


;(async () => {
        try {
            const chainId = 4
            const sellEx = new OpenseaExAgent({
                chainId,
                address: seller,
                priKey: secrets.accounts[seller]
            }, {proxyUrl: 'http://127.0.0.1:7890', apiTimeout: 10200})

            const sellAsset = asset721[chainId][1]

            // paymentToken: sellEx.contracts.ETH,
            const sellParams = {
                asset: sellAsset,
                startAmount: 0.0001,
            } as SellOrderParams

            // const sellData = await sellEx.createSellOrder(sellParams)
            // const sellData = await sellEx.createBuyOrder(sellParams)

            // const foo = await sellEx.openseaApi.postSingedOrder(JSON.stringify(sellData)).catch((e: any) => {
            //     console.log('eee',e.message)
            // })
            // console.log('success', foo)

            // const query = {
            //     asset_contract_address: sellAsset.tokenAddress, //
            //     token_ids: [sellAsset.tokenId]
            // } as AssetOrdersQueryParams
            // const order = await sellEx.openseaApi.getAssetOrders(query)

            const assetsQuery = {
                assets: [{
                    asset_contract_addresses: sellAsset.tokenAddress, //
                    token_ids: sellAsset.tokenId
                }],
                include_orders:true,
            } as AssetsQueryParams
            const order = await sellEx.openseaApi.getAssets(assetsQuery)

            console.log(order)

            // await buyEx.exAgent.acceptOrder(JSON.stringify(sellData))
        } catch (e) {
            console.log(e)
        }
    }
)()
