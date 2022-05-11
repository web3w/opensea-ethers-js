import * as secrets from '../../../secrets.json'
import {OpenseaEx} from "../../src/openseaEx/openseaEx";

const rpcUrl = 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
const account2 = '0x409A0fAfF484920aBD8be44892047C6038d5D0e4'
const account1 = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401'


;(async () => {
        const buyEx = new OpenseaEx({
            chainId: 4,
            address: account2,
            priKey: secrets.accounts[account2]
        })
        try {
            const orderStr = '{"exchange":"0x5206e78b21ce315ce284fb24cf05e0585a93b1d9","maker":"0x633f6c7e25ee757d12643a32ce1586ac9e8542d5","taker":"0x0000000000000000000000000000000000000000","makerRelayerFee":"250","takerRelayerFee":"0","makerProtocolFee":"0","takerProtocolFee":"0","makerReferrerFee":"0","feeMethod":1,"feeRecipient":"0x5b3256965e7c3cf26e11fcaf296dfc8807c01073","side":1,"saleKind":0,"target":"0x56df6c8484500dc3e2fe5a02bed70b4969ffafdb","howToCall":0,"dataToCall":"0x23b872dd000000000000000000000000633f6c7e25ee757d12643a32ce1586ac9e8542d500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000025","replacementPattern":"0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000","staticTarget":"0x0000000000000000000000000000000000000000","staticExtradata":"0x","paymentToken":"0x0000000000000000000000000000000000000000","quantity":"1","basePrice":"760000000000000000","englishAuctionReservePrice":"","extra":"0","listingTime":"1643184620","expirationTime":"1645863112","salt":"32162850062048223837331955186088142873978079787884484962197726107857529178062","metadata":{"asset":{"id":"37","address":"0x56df6c8484500dc3e2fe5a02bed70b4969ffafdb"},"schema":"ERC721","version":0},"v":28,"r":"0x989b59b5017fad65ccfeca85cf8188d5564418729dc69043088843979e7fbdae","s":"0x15d59ea46e043d9f2ec25976c077a7247bfaa0d1b508c096be7b84c161663a33","hash":"0xba8317cc752be5af89dd1fc2db10d442d353c3b03bc1ff2dbfff874ef5b9a917"}'
            console.log(JSON.parse(orderStr))
            const tx = await buyEx.acceptOrder(orderStr)
            console.log(tx.hash)
        } catch (e) {
            console.log(e)
        }
    }
)()
