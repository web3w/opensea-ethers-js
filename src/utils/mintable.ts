import {Contract, ethers} from "ethers";

export type MintableToken = {
    creator: string,
    creatorIndex: number,
    creatorIndexMaxSupply: number
}


// https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/105886420831251411528890303004419979784764244768332317573040781519418810171393

//https://testnets.opensea.io/assets/0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656/105886420831251411528890303004419979784764244768332317573040781521617833426945


export async function getMintableAssetInfo(erc1155: Contract, account: string, tokenId: string) {
    // const creator = await erc1155.creator(tokenId)
    const {creator} = splitMintableTokenId(tokenId);
    // 如对应token id 的资产未创建 未false
    // const exists = await erc1155.exists(tokenId)
    // const totalSupply = await erc1155.totalSupply(tokenId)
    // const maxSupply = await erc1155.maxSupply(tokenId)
    // const superBalances = await erc1155.superBalanceOf(crater, tokenId)
    // const uri = await erc1155.uri(tokenId)
    // const overURI = await erc1155._getOverrideURI(tokenId)

    let balances = 0
    if (creator == account.toLowerCase()) {
        balances = (await erc1155.superBalanceOf(creator, tokenId)).toString()
        // const totalSupply = await erc1155.totalSupply(tokenId)
        // const maxSupply = await erc1155.maxSupply(tokenId)

    } else {
        balances = (await erc1155.balanceOf(account,tokenId)).toString()
    }

    return {balances}

}

export function getMintableTokenId(token: MintableToken): string {
    const ADDRESS_BITS = 160;
    const INDEX_BITS = 56;
    const SUPPLY_BITS = 40;
    const {creator, creatorIndex, creatorIndexMaxSupply} = token
    return ethers.BigNumber.from(creator).shl(96)
        .or(ethers.BigNumber.from(creatorIndex).shl(40))
        .or(ethers.utils.hexValue(creatorIndexMaxSupply)).toString()
}

export function splitMintableTokenId(tokenId: string): MintableToken {
    const ADDRESS_BITS = 160;
    const INDEX_BITS = 56;
    const SUPPLY_BITS = 40;
    // const allHex = new BigNumber(tokenId).toString(16)
    // const allHex1 = ethers.BigNumber.from(tokenId).toHexString()
    const creator = ethers.BigNumber.from(tokenId).shr(96).toHexString();
    // const tokenIndex = ethers.BigNumber.from(tokenId).shr(96).toHexString();

    const creatorIndexAndMaxSupply = ethers.BigNumber.from(tokenId).xor(ethers.BigNumber.from(creator).shl(96))
    const creatorIndex = creatorIndexAndMaxSupply.shr(40).toNumber();
    const creatorIndexMask = ethers.BigNumber.from(creator).shl(96).or((ethers.BigNumber.from(creatorIndex).shl(40)))
    const creatorIndexMaxSupply = ethers.BigNumber.from(tokenId).xor(creatorIndexMask).toNumber()
    // tokenMaxSupply
    // console.log(address, tokenIndex, tokenMaxSupply)
    return {
        creator,
        creatorIndex,
        creatorIndexMaxSupply
    }
}
