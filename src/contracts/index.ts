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

// {
//     "deployed": {
//     "rinkeby": {
//         "TestToken": "0xf44cf0b9b8328adf6d899667b2427d13759087f0",
//             "TestDAO": "0x64a07f5472f87d273846f11e0b1d6d69cd2001fa",
//             "Migrations": "0x38dcf18e64a3ed64767919ec6960d71040e35c82",
//             "MerkleProof": "0xcd8f54ed0dcfda2f44064ad279c8c559ff7ff244",
//             "WyvernToken": "0xd1be358dab323802a3c469b0787476fdcb8af5d6",
//             "WyvernDAO": "0x1b4c767502d01deee83af491c946b469e0620e30",
//             "WyvernRegistry": "0xe59640a71231352aa97d3f1b503ad066c799fad9",
//             "SaleKindInterface": "0x726f4782c533c8aa98da9291f586dc37b41b0bb8",
//             "WyvernExchange": "0x5206e78b21ce315ce284fb24cf05e0585a93b1d9",
//             "DirectEscrowProvider": "0x22f617c80e5f4908b943b938e7dc5ab735e64372",
//             "WyvernProxyRegistry": "0xf57b2c51ded3a29e6891aba85459d600256cf317",
//             "TestStatic": "0xc33a203d61c688433e53fcb6f3af7c6aa12192a4",
//             "WyvernDAOProxy": "0x65cb6ea254f716ac9ffdf542994214dabf1c8aa2",
//             "WyvernAtomicizer": "0x613a12b156ffa304f714cc38d6ae5d3df70d8063",
//             "WyvernTokenTransferProxy": "0x82d102457854c985221249f86659c9d6cf12aa72"
//     },
//     "main": {
//             "MerkleProof": "0xcc3bf5a8e925f7b70238eda8dbe51b2a5ea8ae2c",
//             "WyvernToken": "0x056017c55ae7ae32d12aef7c679df83a85ca75ff",
//             "WyvernDAO": "0x17f68886d00845867c154c912b4ccc506ec92fc7",
//             "TestToken": "0x293e49a9a091d166f7d29ad8da39e0c85aa66e4a",
//             "TestDAO": "0x65df732afac6969ab4761778e4f9840df3187587",
//             "TestStatic": "0x38a0f4acbb5efabb44539f960a60376cb6547602",
//             "WyvernProxyRegistry": "0xa5409ec958c83c3f309868babaca7c86dcb077c1",
//             "SaleKindInterface": "0x77a1dada690ab5172d80ae3b7ccaf88ee3c2e607",
//             "WyvernExchange": "0x7be8076f4ea4a4ad08075c2508e481d6c946d12b",
//             "WyvernDAOProxy": "0xa839d4b5a36265795eba6894651a8af3d0ae2e68",
//             "WyvernAtomicizer": "0xc99f70bfd82fb7c8f8191fdfbfb735606b15e5c5",
//             "WyvernTokenTransferProxy": "0xe5c783ee536cf5e63e792988335c4255169be4e1"
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
        'SharedAssetAddress': "0x495f947276749ce646f68ac8c248420045cb7b5e",
        'ExchangeKeeper': "0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656"

    },
    4: {//rinkeby
        'MerkleProof': '0x45b594792a5cdc008d0de1c1d69faa3d16b3ddc1',
        'WyvernExchange': '0xdD54D660178B28f6033a953b0E55073cFA7e3744',
        'WyvernProxyRegistry': '0x1E525EEAF261cA41b809884CBDE9DD9E1619573A',
        'WyvernTokenTransferProxy': '0xCdC9188485316BF6FA416d02B4F680227c50b89e',
        'GasToken': '0xc778417e063141139fce010982780140aa0cd5ab',
        'FeeRecipientAddress': '0x5b3256965e7c3cf26e11fcaf296dfc8807c01073',
        'SharedAssetAddress': "0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656",
        'ExchangeKeeper': "0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656"
    }
}
// https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/105886420831251411528890303004419979784764244768332317573040781519418810171393

//https://testnets.opensea.io/assets/0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656/105886420831251411528890303004419979784764244768332317573040781521617833426945

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
    }
}

