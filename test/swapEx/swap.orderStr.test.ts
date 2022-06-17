import * as secrets from '../../../secrets.json'
import {SwapEx} from "../../src/swapEx/swapEx";
import {OpenSeaSDK} from "../../src/index";
import {SellOrderParams} from "web3-accounts";

const rpcUrl = 'https://api-test.element.market/api/v1/jsonrpc'
const buyer = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A'
const seller = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401'


;(async () => {

        const sellerEx = new OpenSeaSDK({
            chainId: 4,
            address: seller,
            privateKeys: secrets.privateKeys
        })

        const buyerEx = new OpenSeaSDK({
            chainId: 4,
            address: buyer,
            privateKeys: secrets.privateKeys
        })
        const eleSwapEx = new SwapEx({
            chainId: 4,
            address: buyer,
            privateKeys: secrets.privateKeys
        });

        try {

            const sellAsset = {
                tokenId: '31',
                tokenAddress: '0x56df6c8484500dc3e2fe5a02bed70b4969ffafdb',
                schemaName: 'ERC721'
            }
            // paymentToken: sellEx.contracts.ETH,
            const sellParams = {
                asset: sellAsset,
                startAmount: 0.0001
            } as SellOrderParams

            // console.log(sellParams)
            const sellData = await sellerEx.createSellOrder(sellParams)


            const orderStr = '{"exchange":"0xdd54d660178b28f6033a953b0e55073cfa7e3744","maker":"0x0a56b3317ed60dc4e1027a63ffbe9df6fb102401","taker":"0x0000000000000000000000000000000000000000","makerRelayerFee":"250","takerRelayerFee":"0","makerProtocolFee":"0","takerProtocolFee":"0","makerReferrerFee":"0","feeMethod":1,"feeRecipient":"0x5b3256965e7c3cf26e11fcaf296dfc8807c01073","side":1,"saleKind":0,"target":"0x45b594792a5cdc008d0de1c1d69faa3d16b3ddc1","howToCall":1,"dataToCall":"0xfb16a5950000000000000000000000000a56b3317ed60dc4e1027a63ffbe9df6fb102401000000000000000000000000000000000000000000000000000000000000000000000000000000000000000056df6c8484500dc3e2fe5a02bed70b4969ffafdb000000000000000000000000000000000000000000000000000000000000001f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000000","replacementPattern":"0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","staticTarget":"0x0000000000000000000000000000000000000000","staticExtradata":"0x","paymentToken":"0x0000000000000000000000000000000000000000","quantity":"1","basePrice":"18000000000000000","englishAuctionReservePrice":"","extra":"0","listingTime":"1652346566","expirationTime":"1652432650","salt":"1652346666161","metadata":{"asset":{"id":"31","address":"0x56df6c8484500dc3e2fe5a02bed70b4969ffafdb"},"schema":"ERC721","version":0},"v":27,"r":"0xda767c1177c48844ef89a4bbad35e4dbc4842398349f9342d10c5bd24dad83ae","s":"0x00a70f206d1651cdefe27c8767003928a07bedee801d335d512b13f1654d56c3","hash":"0x28a5832e750715ae13c7c7ebd4c9aed13a6c4b5e1432622c4c154db12e3b2cbf"}'

            const dd = await buyerEx.contracts.checkMatchOrder(orderStr)
            const acceptData = await buyerEx.getMatchCallData({orderStr})

            const acceptGas = await buyerEx.contracts.estimateGas(acceptData.callData)

            console.log("--------Opensea atomicMatch_ gas", acceptGas)


            const buyMaker = eleSwapEx.swapExContract.address
            const matchData = await buyerEx.getMatchCallData({
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
