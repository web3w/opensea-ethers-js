import {SellOrderParams} from "web3-wallets";

import * as secrets from '../../../../secrets.json'
import {OpenseaAPI, OrderQueryParams} from "../../../src/api/opensea";

import {OpenseaEx} from "../../../src/openseaEx/openseaEx";


const rpcUrl = 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
// const account2 = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A'
const seller = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401'


;(async () => {
        try {
            const chainId = 4
            const sellEx = new OpenseaEx({
                chainId,
                address: seller,
                priKey: secrets.accounts[seller],
                rpcUrl
            })

            const sellAsset = {
                tokenId: '9',
                tokenAddress: '0xb556f251eacbec4badbcddc4a146906f2c095bee',
                schemaName: 'ERC721'
            }

            const openseaApi = new OpenseaAPI({chainId, address: seller})

            const query = {
                assetContractAddress: sellAsset.tokenAddress, //
                tokenId: sellAsset.tokenId
            } as OrderQueryParams
            const order = await openseaApi.getOrders(query)

            console.log(order)

            // paymentToken: sellEx.contracts.ETH,
            const sellParams = {
                asset: sellAsset,
                startAmount: 0.0001,
            } as SellOrderParams

            const sellData = await sellEx.createSellOrder(sellParams)
            console.log(sellData)


            const foo = await openseaApi.postSingedOrder(JSON.stringify(sellData)).catch(e => {
                console.log(e)
            })
            console.log('success', foo)

            // await buyEx.exAgent.acceptOrder(JSON.stringify(sellData))
        } catch (e) {
            console.log(e)
        }
    }
)()
