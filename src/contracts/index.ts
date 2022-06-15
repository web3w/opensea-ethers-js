// import AuthenticatedProxy from './abi/openseaV2/AuthenticatedProxy.json'
import proxyRegistryABI from './abi/openseaV2/WyvernProxyRegistry.json'
import exchangeABI from './abi/openseaV2/WyvernExchange.json'
import merkleValidatorABI from './abi/openseaV2/MerkleValidator.json'
import assetContractShared from './abi/openseaV2/AssetContractShared.json'
import exSwap from './abi/aggtrade/ExSwap.json'

export interface AbiInfo {
    contractName: string
    sourceName?: string
    abi: any
}

// authenticatedProxy: AuthenticatedProxy as AbiInfo,
export const OpenseaABI = {
    proxyRegistry: proxyRegistryABI as AbiInfo,
    openseaExV2: exchangeABI as AbiInfo,
    merkleValidator: merkleValidatorABI as AbiInfo,
    assetContractShared: assetContractShared as AbiInfo
}

export const ContractABI = {
    swapEx: exSwap as AbiInfo
}

//WyvernExchange https://rinkeby.etherscan.io/address/0xdD54D660178B28f6033a953b0E55073cFA7e3744
export const OPENSEA_CONTRACTS_ADDRESSES: { [key: number]: any } = {
    1: { //main
        'MerkleProof': '0xbaf2127b49fc93cbca6269fade0f7f31df4c88a7',
        'WyvernExchange': '0x7f268357A8c2552623316e2562D90e642bB538E5',
        'WyvernProxyRegistry': '0xa5409ec958c83c3f309868babaca7c86dcb077c1',
        'WyvernTokenTransferProxy': '0xe5c783ee536cf5e63e792988335c4255169be4e1',
        'GasToken': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        'FeeRecipientAddress': '0x5b3256965e7c3cf26e11fcaf296dfc8807c01073',
        'AssetContractShared': "0x495f947276749ce646f68ac8c248420045cb7b5e",
        'ExchangeKeeper': "0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656"

    },
    4: {//rinkeby
        'MerkleProof': '0x45b594792a5cdc008d0de1c1d69faa3d16b3ddc1',
        'WyvernExchange': '0xdD54D660178B28f6033a953b0E55073cFA7e3744',
        'WyvernProxyRegistry': '0x1E525EEAF261cA41b809884CBDE9DD9E1619573A',
        'WyvernTokenTransferProxy': '0xCdC9188485316BF6FA416d02B4F680227c50b89e',
        'GasToken': '0xc778417e063141139fce010982780140aa0cd5ab',
        'FeeRecipientAddress': '0x5b3256965e7c3cf26e11fcaf296dfc8807c01073',
        'AssetContractShared': "0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656",
        'ExchangeKeeper': "0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656"
    },
    137: {//bsc
        'MerkleProof': '0x45b594792a5cdc008d0de1c1d69faa3d16b3ddc1',
        'WyvernExchange': '0xdD54D660178B28f6033a953b0E55073cFA7e3744',
        'WyvernProxyRegistry': '0x1E525EEAF261cA41b809884CBDE9DD9E1619573A',
        'WyvernTokenTransferProxy': '0xCdC9188485316BF6FA416d02B4F680227c50b89e',
        'GasToken': '0xc778417e063141139fce010982780140aa0cd5ab',
        'FeeRecipientAddress': '0x5b3256965e7c3cf26e11fcaf296dfc8807c01073',
        'AssetContractShared': "0x2953399124f0cbb46d2cbacd8a89cf0599974963",
        'ExchangeKeeper': "0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656"
    }
}


export const EXSWAP_CONTRACTS_ADDRESSES = {
    1: {
        ExSwap: "0x69Cf8871F61FB03f540bC519dd1f1D4682Ea0bF6",
        0: '0x7f268357A8c2552623316e2562D90e642bB538E5', // opensea
        1: '0x74d8e56924909731d0e65F954fc439Fa04634a61', //elementV1
        2: '0x20F780A973856B93f63670377900C1d2a50a77c4' // //elementV3
    },
    4: {
        ExSwap: "0x1A365EC4d192F7ddE7c5c638DD4871653D93Ee06",
        0: '0xdD54D660178B28f6033a953b0E55073cFA7e3744', // opensea
        1: '0x7ac5c8568122341f5D2c404eC8F9dE56456D60CA',//elementV1
        2: '0x8D6022B8A421B08E9E4cEf45E46f1c83C85d402F',//elementV3
    }
}

