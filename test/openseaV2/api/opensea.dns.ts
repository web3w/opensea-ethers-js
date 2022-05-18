import {SellOrderParams} from "web3-wallets";

import * as secrets from '../../../../secrets.json'
import {OpenseaAPI} from "../../../src/api/opensea";


const rpcUrl = 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
const buyer = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A'
const seller = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401'
import * as QueryString from "querystring";
import * as dns from "dns";
import * as https from "https";

import fetch from 'node-fetch';

// const HttpProxyAgent = require('https-proxy-agent');
import {HttpsProxyAgent} from 'https-proxy-agent';

const controller = new AbortController();

const timeoutId = setTimeout(() => controller.abort(), 10000);

;(async () => {
        try {
            // const url = 'https://www.google.com/'
            // const url = 'https://www.baidu.com/'
            // const url = 'https://testnets-api.opensea.io/api/v1/assets?include_orders=true&owner=0x9F7A946d935c8Efc7A8329C0d894A69bA241345A&limit=50&asset_contract_addresses=0xb556f251eacbec4badbcddc4a146906f2c095bee&token_ids=9'
            const url =  'https://testnets-api.opensea.io/wyvern/v1/orders?token_ids=9&asset_contract_address=0xb556f251eacbec4badbcddc4a146906f2c095bee&limit=10&side=0&order_by=created_date'
            const agent = new HttpsProxyAgent('http://127.0.0.1:7890');
            const google = await fetch(url, {signal: controller.signal,agent});
            console.log(google.status)
            console.log(await google.json())
            clearTimeout(timeoutId);
        } catch (err: any) {
            console.log(err)
            clearTimeout(timeoutId);
        }
        return


        const url = 'https://testnets-api.opensea.io/api/v1/assets?include_orders=true&owner=0x9F7A946d935c8Efc7A8329C0d894A69bA241345A&limit=50&asset_contract_addresses=0xb556f251eacbec4badbcddc4a146906f2c095bee&token_ids=9'
        const host = 'testnets-api.opensea.io'
        const fetchParam = {
            method: 'GET',
            agent: new HttpsProxyAgent("http://127.0.0.1:7890")
        }
        fetch(url, fetchParam).then((response) => {
            console.log(response)
        }, (e) => {
            console.log(e)
        })
        return


        // export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
        // options
        // let options = {
        //     host: host,
        //     path: '/api/v1/assets?include_orders=true&owner=0x9F7A946d935c8Efc7A8329C0d894A69bA241345A&limit=50&asset_contract_addresses=0xb556f251eacbec4badbcddc4a146906f2c095bee&token_ids=9'
        // }
        https.get(url, async (http_res) => {
            let data = "";
            console.log('Response is ' + http_res.statusCode);
            // this event fires many times, each time collecting another piece of the response
            http_res.on("data", function (chunk) {
                // append this chunk to our growing `data` var
                data += chunk;
                console.log(chunk)
            });

            // this event fires *one* time, after all the `data` events/chunks have been gathered
            http_res.on("end", function () {
                // you can use res.send instead of console.log to output via express
                console.log(data);

            });
        });
        return

        // console.log(new URL(url))
        // dns.lookup(host, console.log)
        // dns.lookup(host, {hints: dns.ADDRCONFIG | dns.V4MAPPED}, console.log)
        dns.lookup(host, {hints: dns.ADDRCONFIG | dns.V4MAPPED}, async (err, ipStr) => {
            console.log(ipStr)
            const newUrl = `https://${ipStr}/api/v1/assets?include_orders=true&owner=0x9F7A946d935c8Efc7A8329C0d894A69bA241345A&limit=50&asset_contract_addresses=0xb556f251eacbec4badbcddc4a146906f2c095bee&token_ids=9`

            const options = {
                host: ipStr,
                path: '/api/v1/assets',
                search: '?include_orders=true&owner=0x9F7A946d935c8Efc7A8329C0d894A69bA241345A&limit=50&asset_contract_addresses=0xb556f251eacbec4badbcddc4a146906f2c095bee&token_ids=9'
            }
            https.get(options, function (http_res) {
                // initialize the container for our data
                let data = "";

                // this event fires many times, each time collecting another piece of the response
                http_res.on("data", function (chunk) {
                    // append this chunk to our growing `data` var
                    data += chunk;
                    console.log(chunk)
                });

                // this event fires *one* time, after all the `data` events/chunks have been gathered
                http_res.on("end", function () {
                    // you can use res.send instead of console.log to output via express
                    console.log(data);

                });
            });
        })

    }
)()
//
// const options = {
//     headers: {
//         host: ipStr,
//         path: '/api/v1/assets',
//         "accept": "*/*",
//         "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
//         "cache-control": "no-cache",
//         "pragma": "no-cache",
//         "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"101\", \"Google Chrome\";v=\"101\"",
//         "sec-ch-ua-mobile": "?0",
//         "sec-ch-ua-platform": "\"macOS\"",
//         "sec-fetch-dest": "empty",
//         "sec-fetch-mode": "cors",
//         "sec-fetch-site": "same-site",
//         "x-readme-api-explorer": "4.146.0",
//         "Referer": "https://docs.opensea.io/",
//         "Referrer-Policy": "strict-origin-when-cross-origin"
//     }
// };
