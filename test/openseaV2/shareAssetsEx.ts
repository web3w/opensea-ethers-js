import {asset1155Share} from "../assets";
import BigNumber from "bignumber.js";
import {SellOrderParams, Asset,} from "web3-wallets";
import * as secrets from '../../../secrets.json'
import {ethers} from "ethers";
import {OpenseaEx} from "../../index";
import {converStringToBytes, getMintableAssetInfo, getMintableTokenId} from "../../src/openseaEx/utils/mintable";

const buyer = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A';
const seller = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401';

const newGuy= '0xB678bAC834679CF1E3B2d5d2Dd21319447d42861'

//0xeA199722372dea9DF458dbb56be7721af117a9Bc

// https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/105886420831251411528890303004419979784764244768332317573040781519418810171393

//https://testnets.opensea.io/assets/0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656/105886420831251411528890303004419979784764244768332317573040781521617833426945


;(async () => {
    try {

        const chainId = 4
        const tokenId = getMintableTokenId({creator: newGuy, creatorIndex: 3, creatorIndexMaxSupply: 300})

        const sdk = new OpenseaEx({
            chainId,
            address: newGuy,
            priKey: secrets.accounts[newGuy]
        })
        const account = await sdk.getAccountProxy()

        // https://polygonscan.com/address/0x2953399124f0cbb46d2cbacd8a89cf0599974963#code
        // const version = await sdk.assetShared.ERC712_VERSION()
        // const openSeaVersion = await sdk.assetShared.openSeaVersion()
        // const creator = await sdk.assetShared.creator(tokenId)
        // const name = await sdk.assetShared.name()
        // const symbol = await sdk.assetShared.symbol()
        // const address = sdk.assetShared.address
        // console.log(address,name,symbol)

        const openSeaUrl = `https://testnets.opensea.io/assets/${sdk.assetShared.address}/${tokenId}`
        console.log(openSeaUrl)
        const elementUrl = `https://testnets.element.market/assets/${sdk.assetShared.address}/${tokenId}`
        console.log(elementUrl)
        // const balances = (await sdk.assetShared.balanceOf(seller, tokenId)).toString()
        // const exists = await sdk.assetShared.exists(tokenId)
        //
        // const totalSupply = (await sdk.assetShared.totalSupply(tokenId)).toString()
        // const maxSupply = (await sdk.assetShared.maxSupply(tokenId)).toString()
        //https://api.opensea.io/api/v2/metadata/matic/0x2953399124F0cBB46d2CbACD8A89cF0599974963/0x{id}
        // https://testnets-api.opensea.io/api/v1/metadata/0x88B48F654c30e99bc2e4A1559b4Dcf1aD93FA656/0x{id}
        const uri = await sdk.assetShared.uri(tokenId)
        // const isPermanentURI = await sdk.assetShared.isPermanentURI(tokenId)
        // console.log(isPermanentURI)

        const url = "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/" + 1;
        // const url ="data:application/json;base64,eyJuYW1lIjogIkJhZyAjMSIsICJkZXNjcmlwdGlvbiI6ICJMb290IGlzIHJhbmRvbWl6ZWQgYWR2ZW50dXJlciBnZWFyIGdlbmVyYXRlZCBhbmQgc3RvcmVkIG9uIGNoYWluLiBTdGF0cywgaW1hZ2VzLCBhbmQgb3RoZXIgZnVuY3Rpb25hbGl0eSBhcmUgaW50ZW50aW9uYWxseSBvbWl0dGVkIGZvciBvdGhlcnMgdG8gaW50ZXJwcmV0LiBGZWVsIGZyZWUgdG8gdXNlIExvb3QgaW4gYW55IHdheSB5b3Ugd2FudC4iLCAiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhCeVpYTmxjblpsUVhOd1pXTjBVbUYwYVc4OUluaE5hVzVaVFdsdUlHMWxaWFFpSUhacFpYZENiM2c5SWpBZ01DQXpOVEFnTXpVd0lqNDhjM1I1YkdVK0xtSmhjMlVnZXlCbWFXeHNPaUIzYUdsMFpUc2dabTl1ZEMxbVlXMXBiSGs2SUhObGNtbG1PeUJtYjI1MExYTnBlbVU2SURFMGNIZzdJSDA4TDNOMGVXeGxQanh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGp4MFpYaDBJSGc5SWpFd0lpQjVQU0l5TUNJZ1kyeGhjM005SW1KaGMyVWlQaUpIY21sdElGTm9iM1YwSWlCSGNtRjJaU0JYWVc1a0lHOW1JRk5yYVd4c0lDc3hQQzkwWlhoMFBqeDBaWGgwSUhnOUlqRXdJaUI1UFNJME1DSWdZMnhoYzNNOUltSmhjMlVpUGtoaGNtUWdUR1ZoZEdobGNpQkJjbTF2Y2p3dmRHVjRkRDQ4ZEdWNGRDQjRQU0l4TUNJZ2VUMGlOakFpSUdOc1lYTnpQU0ppWVhObElqNUVhWFpwYm1VZ1NHOXZaRHd2ZEdWNGRENDhkR1Y0ZENCNFBTSXhNQ0lnZVQwaU9EQWlJR05zWVhOelBTSmlZWE5sSWo1SVlYSmtJRXhsWVhSb1pYSWdRbVZzZER3dmRHVjRkRDQ4ZEdWNGRDQjRQU0l4TUNJZ2VUMGlNVEF3SWlCamJHRnpjejBpWW1GelpTSStJa1JsWVhSb0lGSnZiM1FpSUU5eWJtRjBaU0JIY21WaGRtVnpJRzltSUZOcmFXeHNQQzkwWlhoMFBqeDBaWGgwSUhnOUlqRXdJaUI1UFNJeE1qQWlJR05zWVhOelBTSmlZWE5sSWo1VGRIVmtaR1ZrSUV4bFlYUm9aWElnUjJ4dmRtVnpQQzkwWlhoMFBqeDBaWGgwSUhnOUlqRXdJaUI1UFNJeE5EQWlJR05zWVhOelBTSmlZWE5sSWo1T1pXTnJiR0ZqWlNCdlppQkZibXhwWjJoMFpXNXRaVzUwUEM5MFpYaDBQangwWlhoMElIZzlJakV3SWlCNVBTSXhOakFpSUdOc1lYTnpQU0ppWVhObElqNUhiMnhrSUZKcGJtYzhMM1JsZUhRK1BDOXpkbWMrIn0="
        const _data = converStringToBytes(url)

        const tx = await sdk.assetShared.mint(newGuy, tokenId, 5,'0x')
        await tx.wait()

        // const tx = await sdk.assetShared.safeTransferFrom(seller, buyer, tokenId, 2,_data)
        // await tx.wait()
        console.log(tx.hash)


        // const info = await getMintableAssetInfo(sdk.assetShared, seller, tokenId)
        // console.log(exists)

        // const asset = asset1155Share[chainId][0] as Asset
        // const metadata1155Share = assetToMetadata(asset, "1")


    } catch (e) {
        console.log(e)
    }

})()
