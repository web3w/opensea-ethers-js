import {ElementSchemaName} from "web3-wallets";

export const CryptoKitties = {
    4: [{
        tokenId: '16',
        tokenAddress: '0x1530272ce6e4589f5c09151a7c9a118a58d70e09',
        schemaName: ElementSchemaName.CryptoKitties
    }]
}

export const asset1155Share = {
    4: [
        { // exist false
            tokenId: '105886420831251411528890303004419979784764244768332317573040781541409042726913',
            tokenAddress: '0x4cddbf865ee2a1a3711648bb192e285f290f7985',
            schemaName: 'ERC1155'
        },
        {
            tokenId: '48357347090121215447684748936604759886031964957482485448462203856440422039562',
            tokenAddress: '0x4cddbf865ee2a1a3711648bb192e285f290f7985',
            schemaName: 'ERC1155'
        }],
}


export const asset721 = {
    4: [
        {
            tokenId: '9',
            tokenAddress: '0xb556f251eacbec4badbcddc4a146906f2c095bee',
            schemaName: ElementSchemaName.ERC721
        },
        {
            tokenId: '1',
            tokenAddress: '0x323ce7344EeecfCe716720599cE7689930D25119',
            schemaName: ElementSchemaName.ERC721
        }, {
            tokenId: '17',
            tokenAddress: '0x2d0c5c5a495134e53ea65c94c4e07f45731f7201',
            schemaName: ElementSchemaName.ERC721
        }],
    97: [
        {
            tokenId: '67',
            tokenAddress: "0xcf09aba56f36a4521094c3bf6a303262636b2e1a",
            schemaName: 'ERC721'
        },
        {
            tokenId: '68',
            tokenAddress: "0xcf09aba56f36a4521094c3bf6a303262636b2e1a",
            schemaName: 'ERC721'
        },
        {
            tokenId: '461427',
            tokenAddress: '0xe6e40679da5ee99216414037dc0c62d07074fb42',
            schemaName: 'ERC721'
        }, {
            tokenId: '1',
            tokenAddress: '0xcf09aba56f36a4521094c3bf6a303262636b2e1a',
            schemaName: 'ERC721'
        }],
    137: [
        {
            tokenId: '1',
            tokenAddress: '0x9a7d9ceddf4f8be037b8ef4878e22f29c2d2023c',
            schemaName: 'ERC721'
        }
    ],
    80001: [
        {
            tokenId: '51',
            tokenAddress: '0x3fd9fe18c14155ce9222bd42e13c7ec856a8bb78',
            schemaName: 'ERC721',
            collection: {
                elementSellerFeeBasisPoints: 180,
                transferFeeAddress: "0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401"
            }
        }, {
            tokenId: '4676314080394472507455332797632474230665182066565445726959043743302144753665',
            tokenAddress: '0xdf131408bbfa3c48d3b60041ae1cbafc017cdfe1',
            schemaName: 'ERC721'
        }
    ],
    43113: [{
        tokenId: '1',
        tokenAddress: '0xF12e5F6591b4bd80B56b257e758C9CEBADa2a542',
        schemaName: 'ERC721'
    }]
}

export const asset1155 = {
    4: [
        {
            tokenId: '82534249212256588388302984865502979938480676321224842567195230008927460524332',
            tokenAddress: '0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656',
            schemaName: 'ERC1155'
        }
    ],
    97: [
        {
            tokenId: '1',
            tokenAddress: '0x8Dd87EA5724562027751527df4De4E0CC3d052b0',
            schemaName: 'ERC1155',
            collection: {
                elementSellerFeeBasisPoints: 100,
                transferFeeAddress: "0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401"
            }
        }, {
            tokenId: '2',
            tokenAddress: '0x8dd87ea5724562027751527df4de4e0cc3d052b0',
            schemaName: 'ERC1155',
            collection: {
                elementSellerFeeBasisPoints: 100,
                transferFeeAddress: "0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401"
            }
        }]
}

export const erc20Tokens = {
    4: [{
        name: 'TST',
        address: '0xb506bfaa7661dabf4de80672bd3f13f4610a5fdf',
        symbol: 'TST',
        decimals: 18
    }],
    97: [{
        name: 'TST',
        address: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
        symbol: 'TST',
        decimals: 18
    }],

    43113: {}
}

