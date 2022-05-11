
export {ContractABI, OpenseaABI} from './abi/index'


export const RPC_PROVIDER: { [key: number]: string } = {
    1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    3: 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    56: 'https://bsc-dataseed1.defibit.io/',
    97: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    137: 'https://rpc-mainnet.maticvigil.com',
    80001: 'https://matic-mumbai.chainstacklabs.com',
    43113: "https://api.avax-test.network/ext/bc/C/rpc",
    43114: "https://api.avax.network/ext/bc/C/rpc"
}

// export const RPC_PUB_PROVIDER = {
//     1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
//     4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
//     56: 'https://bsc-dataseed1.defibit.io/',
//     97: 'https://data-seed-prebsc-1-s1.binance.org:8545',
//     137: 'https://rpc-mainnet.maticvigil.com',
//     80001: 'https://polygon-mumbai.g.alchemy.com/v2/9NqLsboUltGGnzDsJsOq5fJ740fZPaVE',
//     43113: "https://api.avax-test.network/ext/bc/C/rpc",
//     43114: "https://api.avax.network/ext/bc/C/rpc"
// }

//
// export const GasLimitOffset = 1.18
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
        'FeeRecipientAddress': '0x5b3256965e7c3cf26e11fcaf296dfc8807c01073'
    },
    4: {//rinkeby
        'MerkleProof': '0x45b594792a5cdc008d0de1c1d69faa3d16b3ddc1',
        'WyvernExchange': '0xdD54D660178B28f6033a953b0E55073cFA7e3744',
        'WyvernProxyRegistry': '0x1E525EEAF261cA41b809884CBDE9DD9E1619573A',
        'WyvernTokenTransferProxy': '0xCdC9188485316BF6FA416d02B4F680227c50b89e',
        'GasToken': '0xc778417e063141139fce010982780140aa0cd5ab',
        'FeeRecipientAddress': '0x5b3256965e7c3cf26e11fcaf296dfc8807c01073'
    }

}


export const MOCK_CONTRACTS_ADDRESSES = {
    1: {
        "ERC721": "0xb18380485f7ba9c23deb729bedd3a3499dbd4449",
        "ERC1155": "0x4Fde78d3C8718f093f6Eb3699e3Ed8d091498dF9",
        "ERC20": ""
    },
    4: {
        "ERC721": "0x5F069e9E7311da572299533B7078859085F7d82C",
        "ERC1155": "0xb6316833725F866f2Aad846DE30A5f50F09E247b",
        "ERC20": "0x68801757CC7987e3888A19EF2E8Eb7d15dBDCDe6"
    },
    56: {
        "ERC721": "0xCA3605ca7cffAA27a8D9a9B7E41bcb3c51e590D9",
        "ERC1155": "0x00FD05B17D884D86b964CEEd8652EfC8333b59Fe",
        "ERC20": ""
    },
    97: {
        "ERC721": "0xCF09Aba56f36a4521094c3bF6A303262636B2e1A",
        "ERC1155": "0x52e325E79820d8547798A2405d595020C75B713a",
        "ERC20": "0x717978fC69c1263Ab118E8A2015BBBb563Ca1EE2"
    },

    137: {
        "ERC721": "0xd077bd42b79eB45F6eC24d025c6025B9749215CE",
        "ERC1155": "0x6c57b71EF74B0B94c42520c09fbBCE1ACcC238A8",
        "ERC20": ""
    },
    80001: {
        "ERC721": "0x3fd9FE18C14155CE9222BD42E13c7ec856A8BB78",
        "ERC1155": "0x7Fed7eD540c0731088190fed191FCF854ed65Efa",
        "ERC20": "0x00dd6D1436899fBbA1acaD3c6E30A85520c1AE3e"
    },
    43114: {
        "ERC721": "0x90259D1416E5AeA964eAC2441aA20e9Fb2D99262",
        "ERC1155": "0xdad95F1Ec9360Ffd5c942592b9A5988172134a35",
        "ERC20": ""
    },
    43113: {
        "ERC721": "0xF12e5F6591b4bd80B56b257e758C9CEBADa2a542",
        "ERC1155": "0x88aF41822C65A64e9614D3784Fa1c99b8a02E5f5",
        "ERC20": "0x5df0d6A56523d49650A2526873C2C055201AA879"
    }

}


