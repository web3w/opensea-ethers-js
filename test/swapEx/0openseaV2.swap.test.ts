import * as secrets from '../../../secrets.json'
import {SwapEx} from "../../src/swapEx/swapEx";
import {OpenseaExAgent} from "../../lib";
import {SellOrderParams} from "web3-accounts";

const rpcUrl = 'https://api-test.element.market/api/v1/jsonrpc'
const seller = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A'
const buyer = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401'


;(async () => {
        const sellEx = new OpenseaExAgent({
            chainId: 4,
            address: seller,
            priKey: secrets.accounts[seller],
            rpcUrl
        })

        const eleSwapEx = new SwapEx({
            chainId: 4,
            address: buyer,
            rpcUrl,
            priKey: secrets.accounts[buyer]
        });


        try {
            const sellAsset = {
                tokenId: '18',
                tokenAddress: '0x2d0c5c5a495134e53ea65c94c4e07f45731f7201',
                schemaName: 'ERC721'
            }
            // paymentToken: sellEx.contracts.ETH,
            const sellParams = {
                asset: sellAsset,
                startAmount: 0.0001
            } as SellOrderParams

            // console.log(sellParams)
            const sellData = await sellEx.createSellOrder(sellParams)
            // console.log(sellData)

            const orderStr = JSON.stringify(sellData)

            const acceptData = await sellEx.getMatchCallData({orderStr})

            const acceptGas = await sellEx.contracts.estimateGas(acceptData.callData)

            console.log("--------Opensea atomicMatch_ gas", acceptGas)


            const buyMaker = eleSwapEx.swapExContract.address
            const matchData = await sellEx.getMatchCallData({
                orderStr,
                makerAddress: buyMaker,
                assetRecipientAddress: buyer
            })
            console.log('\n--------------------Opensea Market------------------\n')
            // console.log('Market buyMaker', 2, buyMaker)
            // console.log('sell', JSON.stringify(matchData.sell, null, 2))
            // console.log('buy', JSON.stringify(matchData.buy, null, 2))
            // console.log('params', matchData.params)
            // console.log('callData', matchData.callData.data)

            const data = {
                "marketId": "0",
                "value": matchData.sell.basePrice,
                "tradeData": matchData.callData.data
            }
            const value = matchData.sell.basePrice

            const gas = await eleSwapEx.swapExContract.estimateGas.batchBuyWithETH([data], {value})
            const dataOrder = await eleSwapEx.batchBuyWithETHSimulate([data])

            console.log('batchBuyWithETH gas', gas.toString(), dataOrder)


        } catch (e) {
            console.log(e)
        }
    }
)()
