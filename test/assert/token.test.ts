import {erc20Tokens} from "../assets";
import {assert, schemas} from "../../src/assert";


const buyer = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A';
const seller = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401';

const newGuy = '0xB678bAC834679CF1E3B2d5d2Dd21319447d42861'

//0xeA199722372dea9DF458dbb56be7721af117a9Bc

// https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/105886420831251411528890303004419979784764244768332317573040781519418810171393

//https://testnets.opensea.io/assets/0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656/105886420831251411528890303004419979784764244768332317573040781521617833426945


;(async () => {
    try {
        const token = {
            name: 'TST',
            address: '0xb506bfaa7661dabf4de80672bd3f13f4610a5fdf',
            symbol: 'TST',
            decimals: 18
        }
        assert.doesConformToSchema('Token', token, schemas.tokenSchema)
        console.log("")
    } catch (e:any) {
        console.log(e.message)
    }

})()
