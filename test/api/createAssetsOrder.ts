import {Asset, ElementAPI, ElementSDK, ExSchemaName, MakeOrderType, OrderType, SellOrderParams} from "../../index";
import * as secrets from '../../../secrets.json'
import {RPC_PUB_PROVIDER} from "../../src/contracts/config";
import {asset721} from "../assets";

// const buyer = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A'
// const seller = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401'

const buyer = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A';
const seller = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401';
// const chainId = 4
// const asset = asset721[chainId][0] as Asset

const eleAPI = new ElementAPI({
        chainId: 4,
        address: seller,
        priKey: secrets.accounts[seller]
    })
;(async () => {

    const data = await eleAPI.exploreAssetsList()
    console.log(data.totalCount, eleAPI.accountAddress)
    const list = data.edges.filter(edge => {
        const {asset} = edge.node
        return  asset.chain == 'eth' && asset.contractAddress.toLowerCase() != "0x4cddbf865ee2a1a3711648bb192e285f290f7985"
    })

    // const listBsc = data.edges.filter(edge => {
    //     const {asset} = edge.node
    //     return asset.chain == 'bsc' && asset.tokenType == 'ERC721'
    // })
    // const list = data.edges//.splice(23)
    for (const edge of list) {
        const {asset} = edge.node
        const {collection, paymentTokens} = asset
        console.log(`name ${asset.name} chainId ${Number(asset.chainId)}  tokenType ${asset.tokenType} royalty ${collection.royalty}`)

        // const standard = asset.chainId == '0x4' || asset.chainId == '0x1' ? ExSchemaName.ElementExV3
        //     : asset.chain == 'bsc' ? ExSchemaName.ZeroEx : ExSchemaName.ElementEx

        if (asset.chainId == '0x4' || asset.chainId == '0x1') {
            console.log(`https://testnets.element.market/assets/${asset.contractAddress}/${asset.tokenId}`)
        } else if (asset.chainId == '0x61') {
            console.log(`https://testnets.element.market/assets/bsctest/${asset.contractAddress}/${asset.tokenId}`)
        } else {
            console.log("chainId", asset.chainId)
        }

        const exSDK = new ElementSDK({
            chainId: Number(asset.chainId),
            address: seller,
            priKey: secrets.accounts[seller]
        })

        const buyerSDK = new ElementSDK({
            chainId: Number(asset.chainId),
            address: buyer,
            priKey: secrets.accounts[buyer]
        })

        const assetCollection = {
            elementSellerFeeBasisPoints: collection.royalty,
            transferFeeAddress: collection.royaltyAddress
        }

        const ownerAsset = {
            tokenId: asset.tokenId,
            tokenAddress: asset.contractAddress,
            schemaName: asset.tokenType,
            collection: assetCollection
        }

        // console.log(await exSDK.hiddenOrder({hash: res.orderHash, standard}))

        for (let i = 1; i < 2; i++) {
            const buyParams = {
                asset: ownerAsset,
                startAmount: Number('0.0' + i.toString()),
                quantity: 1,
                expirationTime: Math.round(new Date().getTime() / 1000 + 86000),
            } as SellOrderParams
            try {

                const sellDataV3 = await exSDK.createOrder(MakeOrderType.FixPriceOrder, buyParams)
                const buyDataV3 = await buyerSDK.createOrder(MakeOrderType.MakeOfferOrder, buyParams)
                const sellStrV3 = JSON.stringify(sellDataV3)
                const buyStrV3 = JSON.stringify(buyDataV3)
                const sellResV3 = await exSDK.postOrder(sellStrV3)
                console.log('Sell OrderId V3', sellResV3.id || sellResV3.message)
                const buyResV3 = await exSDK.postOrder(buyStrV3)
                console.log('Buy OrderId V3', buyResV3.id || buyResV3.message)


                let standard = ExSchemaName.ElementEx
                if (asset.chainId == '0x61') {
                    standard = ExSchemaName.ZeroEx
                }
                buyParams.standard = standard
                const sellData = await exSDK.createOrder(MakeOrderType.FixPriceOrder, buyParams)
                const buyData = await buyerSDK.createOrder(MakeOrderType.MakeOfferOrder, buyParams)
                const sellStr = JSON.stringify(sellData)
                const buyStr = JSON.stringify(buyData)
                const res = await exSDK.postOrder(sellStr, {standard})
                console.log('Sell OrderId', standard, res.id || res.message)
                const res1 = await exSDK.postOrder(buyStr, {standard})
                console.log('Buy OrderId', standard, res1.id || res1.message)


            } catch (e) {
                debugger
                // console.log(eleSDK.exAgent)
                // @ts-ignore
                const approve = await exSDK.approveOrder(e)
                const tx = await exSDK.ethSend(approve)
                if (tx) {
                    await tx?.wait
                    console.log(tx.hash)
                }

            }
        }
    }

})()
