import {SellOrderParams} from "web3-wallets";

import * as secrets from '../../../../secrets.json'
import {OpenseaAPI} from "../../../src/api/opensea";


const rpcUrl = 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
const buyer = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A'
const seller = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401'
import * as QueryString from "querystring";
import * as dns from "dns";
import {asset1155} from "../../assets";
import {AssetsQueryParams} from "element-sdk";

;(async () => {
        const chainId = 4
        const sellAsset = asset1155[chainId][0]


        // console.log(QueryString.(sellAsset))
        try {
            const openseaApi = new OpenseaAPI({chainId, address: seller})

            //https://api.opensea.io/api/v1/assets?include_orders=true&owner=0x7db3E3f10faD9DB3a2DA202Ddfe62e6A05b86087&limit=50&asset_contract_addresses=0x495f947276749ce646f68ac8c248420045cb7b5e&token_ids=56856944892922603446944648471554743932116139985269722688802462491120156803082&asset_contract_addresses=0xb9ab19454ccb145f9643214616c5571b8a4ef4f2&token_ids=5647&asset_contract_addresses=0x495f947276749ce646f68ac8c248420045cb7b5e&token_ids=56856944892922603446944648471554743932116139985269722688802462494418691686401&asset_contract_addresses=0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7&token_ids=8498&asset_contract_addresses=0x495f947276749ce646f68ac8c248420045cb7b5e&token_ids=56856944892922603446944648471554743932116139985269722688802462497717226569729&asset_contract_addresses=0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7&token_ids=10360&asset_contract_addresses=0x2821e35072ccdad0d69665092f64eb280b385c73&token_ids=6759&asset_contract_addresses=0x06012c8cf97bead5deae237070f9587f8e7a266d&token_ids=2001229
            //     ?include_orders=true&owner=0x7db3E3f10faD9DB3a2DA202Ddfe62e6A05b86087&limit=50

            const query:AssetsQueryParams = {
                assets: [{
                    asset_contract_addresses: sellAsset.tokenAddress, //
                    token_ids: sellAsset.tokenId
                }]
            }
            const order = await openseaApi.getAssets(query)

            console.log(order)

            // await buyEx.exAgent.acceptOrder(JSON.stringify(sellData))
        } catch (e) {
            console.log(e)
        }
    }
)()
