import {SellOrderParams} from "web3-wallets";

import * as secrets from '../../../../secrets.json'
import {AssetOrdersQueryParams} from "../../../src/openseaEx/types";
import {OpenseaExAgent} from "../../../src/openseaEx/openseaExAgent";
import {asset721} from "../../assets";


// const account2 = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A'
const seller = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401'


;(async () => {
        try {
            const chainId = 4
            const sellEx = new OpenseaExAgent({
                chainId,
                address: seller,
                priKey: secrets.accounts[seller]
            }, {proxyUrl: 'http://127.0.0.1:7890',apiTimeout:20000})

            const sellAsset = asset721[chainId][0]



            // paymentToken: sellEx.contracts.ETH,
            const sellParams = {
                asset: sellAsset,
                startAmount: 0.0001,
            } as SellOrderParams

            // const sellData = await sellEx.createSellOrder(sellParams)
            // console.log(sellData)

            const sellData = {
                exchange: '0xdd54d660178b28f6033a953b0e55073cfa7e3744',
                maker: '0x0a56b3317ed60dc4e1027a63ffbe9df6fb102401',
                taker: '0x0000000000000000000000000000000000000000',
                makerRelayerFee: '250',
                takerRelayerFee: '0',
                makerProtocolFee: '0',
                takerProtocolFee: '0',
                makerReferrerFee: '0',
                feeMethod: 1,
                feeRecipient: '0x5b3256965e7c3cf26e11fcaf296dfc8807c01073',
                side: 1,
                saleKind: 0,
                target: '0x45b594792a5cdc008d0de1c1d69faa3d16b3ddc1',
                howToCall: 1,
                dataToCall: '0xfb16a5950000000000000000000000000a56b3317ed60dc4e1027a63ffbe9df6fb1024010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b556f251eacbec4badbcddc4a146906f2c095bee0000000000000000000000000000000000000000000000000000000000000009000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000000',
                replacementPattern: '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                staticTarget: '0x0000000000000000000000000000000000000000',
                staticExtradata: '0x',
                paymentToken: '0x0000000000000000000000000000000000000000',
                quantity: '1',
                basePrice: '100000000000000',
                englishAuctionReservePrice: undefined,
                extra: '0',
                listingTime: '1652866287',
                expirationTime: '1655458380',
                salt: '1652866386984',
                metadata: {
                    asset: {
                        id: '9',
                        address: '0xb556f251eacbec4badbcddc4a146906f2c095bee',
                        quantity: '1',
                        data: ''
                    },
                    schema: 'ERC721'
                },
                v: 28,
                r: '0x1c912db86cf20ae4f5c19a0d38ab58a6d30c66b4a9d44509a558a3fed2456b61',
                s: '0x58011e94a5ae9b8596d988542f144c05bc441c20bd5c6bd77024bc65235ab4b5',
                hash: '0x790a93a920adb6233701a95d10c2ba7e887a0888ac2c53b802ea74e30d14e3b9',
                nonce: '1'
            }

            const foo = await sellEx.openseaApi.postSingedOrder(JSON.stringify(sellData)).catch(e => {
                console.log(e)
            })
            console.log('success', foo)

            const query = {
                asset_contract_address: sellAsset.tokenAddress, //
                token_ids: [sellAsset.tokenId]
            } as AssetOrdersQueryParams
            const order = await sellEx.openseaApi.getAssetOrders(query)

            console.log(order)

            // await buyEx.exAgent.acceptOrder(JSON.stringify(sellData))
        } catch (e) {
            console.log(e)
        }
    }
)()
