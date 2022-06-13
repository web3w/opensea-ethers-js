import {erc20Tokens} from "../assets";
import {assert, schemas} from "../../src/assert";
import metadataSchema from "../../src/assert/schemas/base/metadata_schema.json";


const buyer = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A';
const seller = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401';

const newGuy = '0xB678bAC834679CF1E3B2d5d2Dd21319447d42861'

//0xeA199722372dea9DF458dbb56be7721af117a9Bc

// https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/105886420831251411528890303004419979784764244768332317573040781519418810171393

//https://testnets.opensea.io/assets/0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656/105886420831251411528890303004419979784764244768332317573040781521617833426945
const order = {
        "exchange": "0x5206e78b21ce315ce284fb24cf05e0585a93b1d9",
        "maker": "0x633f6c7e25ee757d12643a32ce1586ac9e8542d5",
        "taker": "0x0000000000000000000000000000000000000000",
        "makerRelayerFee": "250",
        "takerRelayerFee": "0",
        "makerProtocolFee": "0",
        "takerProtocolFee": "0",
        "makerReferrerFee": "0",
        "feeMethod": 1,
        "feeRecipient": "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073",
        "side": 1,
        "saleKind": 0,
        "target": "0x56df6c8484500dc3e2fe5a02bed70b4969ffafdb",
        "howToCall": 0,
        "calldata": "0x23b872dd000000000000000000000000633f6c7e25ee757d12643a32ce1586ac9e8542d500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000025",
        "replacementPattern": "0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000",
        "staticTarget": "0x0000000000000000000000000000000000000000",
        "staticExtradata": "0x",
        "paymentToken": "0x0000000000000000000000000000000000000000",
        "quantity": "1",
        "basePrice": "760000000000000000",
        "englishAuctionReservePrice": "",
        "extra": "0",
        "listingTime": "1643184620",
        "expirationTime": "1645863112",
        "salt": "32162850062048223837331955186088142873978079787884484962197726107857529178062",
        "metadata": {
            "asset": {"id": "37", "address": "0x56df6c8484500dc3e2fe5a02bed70b4969ffafdb"},
            "schema": "ERC721",
            "version": 0
        },
        "v": 28,
        "r": "0x989b59b5017fad65ccfeca85cf8188d5564418729dc69043088843979e7fbdae",
        "s": "0x15d59ea46e043d9f2ec25976c077a7247bfaa0d1b508c096be7b84c161663a33",
        "hash": "0xba8317cc752be5af89dd1fc2db10d442d353c3b03bc1ff2dbfff874ef5b9a917"
    }

;(async () => {
    try {
        assert.doesConformToSchema('Metadata check', order.metadata, schemas.metadataSchema)
        assert.doesConformToSchema('OrderStringCheck', order, schemas.orderSchema)
        // console.log("")
    } catch (e: any) {
        console.log(e.message)
    }

})()
