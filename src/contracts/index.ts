// import AuthenticatedProxy from './abi/openseaV2/AuthenticatedProxy.json'
import proxyRegistryABI from './abi/openseaV2/WyvernProxyRegistry.json'
import exchangeABI from './abi/openseaV2/WyvernExchange.json'
import merkleValidatorABI from './abi/openseaV2/MerkleValidator.json'
import OpenseaExSwap from './abi/aggtrade/OpenseaExSwap.json'

export interface AbiInfo {
    contractName: string
    sourceName?: string
    abi: any
}

// authenticatedProxy: AuthenticatedProxy as AbiInfo,
export const OpenseaABI = {
    swapEx: OpenseaExSwap as AbiInfo,
    proxyRegistry: proxyRegistryABI as AbiInfo,
    openseaExV2: exchangeABI as AbiInfo,
    merkleValidator: merkleValidatorABI as AbiInfo
}


// export const OPENSEA_CONTRACTS_ADDRESSES_V1: { [key: number]: any } = {
//     1: { //main
//         'MerkleProof': '0xbaf2127b49fc93cbca6269fade0f7f31df4c88a7',
//         'WyvernExchange': '0x7be8076f4ea4a4ad08075c2508e481d6c946d12b',
//         'WyvernProxyRegistry': '0xa5409ec958c83c3f309868babaca7c86dcb077c1',
//         'WyvernTokenTransferProxy': '0xe5c783ee536cf5e63e792988335c4255169be4e1',
//         'GasToken': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//         'FeeRecipientAddress': '0x5b3256965e7c3cf26e11fcaf296dfc8807c01073'
//     },
//     4: {//rinkeby
//         'MerkleProof': '0x45b594792a5cdc008d0de1c1d69faa3d16b3ddc1',
//         'WyvernExchange': '0x5206e78b21ce315ce284fb24cf05e0585a93b1d9',
//         'WyvernProxyRegistry': '0xf57b2c51ded3a29e6891aba85459d600256cf317',
//         'WyvernTokenTransferProxy': '0x82d102457854c985221249f86659c9d6cf12aa72',
//         'GasToken': '0xc778417e063141139fce010982780140aa0cd5ab',
//         'FeeRecipientAddress': '0x5b3256965e7C3cF26E11FCAf296DfC8807C01073'
//     }
// }


//WyvernExchange https://rinkeby.etherscan.io/address/0xdD54D660178B28f6033a953b0E55073cFA7e3744
export const OPENSEA_CONTRACTS_ADDRESSES: { [key: number]: any } = {
    1: { //main
        'MerkleProof': '0xbaf2127b49fc93cbca6269fade0f7f31df4c88a7',
        'WyvernExchange': '0x7f268357A8c2552623316e2562D90e642bB538E5',
        'WyvernProxyRegistry': '0xa5409ec958c83c3f309868babaca7c86dcb077c1',
        'WyvernTokenTransferProxy': '0xe5c783ee536cf5e63e792988335c4255169be4e1',
        'GasToken': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        'FeeRecipientAddress': '0x5b3256965e7c3cf26e11fcaf296dfc8807c01073',
    },
    4: {//rinkeby
        'MerkleProof': '0x45b594792a5cdc008d0de1c1d69faa3d16b3ddc1',
        'WyvernExchange': '0xdD54D660178B28f6033a953b0E55073cFA7e3744',
        'WyvernProxyRegistry': '0x1E525EEAF261cA41b809884CBDE9DD9E1619573A',
        'WyvernTokenTransferProxy': '0xCdC9188485316BF6FA416d02B4F680227c50b89e',
        'GasToken': '0xc778417e063141139fce010982780140aa0cd5ab',
        'FeeRecipientAddress': '0x5b3256965e7c3cf26e11fcaf296dfc8807c01073',
    }
}

export const ExSwap_CONTRACTS_ADDRESSES = {
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
        3: '0x18f256732A5c980E450b2b8c32ad2F12ca2442f8',//ZeroExV4
    },
    56: {
        ExSwap: "0x56085ea9c43DEa3C994c304C53B9915bFf132D20",
        0: '0xb3e3DfCb2d9f3DdE16d78B9e6EB3538Eb32B5ae1', // elementV3
    },
    97: {
        ExSwap: "0x58cF35B07D906Faf109eE64fae8C9bA44A835283",
        0: '0x30FAD3918084eba4379FD01e441A3Bb9902f0843', // elementV3
    },
    137: {
        ExSwap: "0xb3e808E102AC4bE070ee3daAC70672ffC7c1Adca",
        0: '0xEAF5453b329Eb38Be159a872a6ce91c9A8fb0260', // elementV3
    },
    80001: {
        ExSwap: "0x736222d4C24912e4b29667bC83c1384A2Ab28337",
        0: '0x2431e7671d1557d991a138c7af5d4cd223a605d6', // elementV3
    },
    43113: {
        ExSwap: "0x6d417B28DC0813A101C42ddcec97318c0d64D367",
        0: '0xd089757a20a36B0978156659Cc1063B929Da76aB', // elementV3
    },
    43114: {
        ExSwap: "0x37ad2bd1E4F1C0109133E07955488491233c9372",
        0: '0x18cd9270DbdcA86d470cfB3be1B156241fFfA9De', // elementV3
    }
}

