import {ElementSDK, ElementAPI, ElementExSwap, OrderType, ExSchemaName, Asset, ElementSchemaName} from "../../index";
import * as secrets from '../../../secrets.json'
import {OrderQueryParams} from "../../src/api/restful/ordersApi";
import {ElementCollection} from "../../src/types/elementTypes";

const buyer = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A'
const chainId = 97
const eleAPI = new ElementAPI({
    chainId,
    address: buyer,
})

export async function getAsset(asset: Asset): Promise<{ asset: Asset, owners: any }> {
    const params = {
        tokenId: asset.tokenId,
        assetContractAddress: asset.tokenAddress,
    } as OrderQueryParams
    const list = await eleAPI.getAssetsDetail(params)
    // console.log(list.collection.royalty, list.collection.royaltyAddress)
    const collection = {
        elementSellerFeeBasisPoints: list.collection.royalty,
        transferFeeAddress: list.collection.royaltyAddress
    } as ElementCollection
    asset.collection = collection

    const owners = list.assetOwners.edges.map(val => val.node.owner)
    return {asset, owners}
}

export async function getAssetOrders(asset: Asset) {
    const query = {
        assetContractAddress: asset.tokenAddress.toLowerCase(),
        tokenId: asset.tokenId || "1",
        orderType: OrderType.All,
        thirdStandards: [ExSchemaName.ZeroEx, ExSchemaName.ElementExV3],
    }
    // account: seller
    const orders = await eleAPI.getOrders(query)
    return orders
}

export async function getAccountAssetList(account: string, assetAddr?: string) {
    const data = await eleAPI.exploreAssetsList(account)
    console.log(data.totalCount, eleAPI.accountAddress)
    const list = data.edges.filter(edge => {
        const {asset} = edge.node
        return assetAddr ? asset.contractAddress.toLowerCase() != assetAddr : true
    })
    return list.map(val => {
        const {asset} = val.node
        const collection = {
            elementSellerFeeBasisPoints: asset.collection.royalty,
            transferFeeAddress: asset.collection.royaltyAddress
        } as ElementCollection
        return {
            chainId: Number(asset.chainId),
            name: asset.name,
            tokenId: asset.tokenId,
            tokenAddress: asset.contractAddress,
            schemaName: asset.tokenType,
            data: asset.imageThumbnailUrl,
            collection
        } as Asset
    })
}

