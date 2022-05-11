// 登陆签名

import {ethers, Contract, providers, Signer, VoidSigner, Wallet, Transaction, ContractInterface} from 'ethers'

import {getProvider, WalletInfo} from "web3-wallets";


export async function loginSign(
    nonce: number,
    address: string,
    priKey?: string
): Promise<{ message: string; signature: string }> {
    // const signerAddr = account || this.signerAddress
    const {walletSigner} = getProvider({address, chainId: 1, priKey})
    const message = `Welcome to Opensea!
   \nClick "Sign" to sign in. No password needed!
   \nI accept the Element Terms of Service: \n https://element.market/tos
   \nWallet address:\n${address}
   \nNonce:\n${nonce}`
    // const addr = await walletSigner.getAddress()
    const signature = await walletSigner.signMessage(message).catch((e: any) => {
        // this.emit('Error', e)
        throw e
    })
    const pubAddr = ethers.utils.verifyMessage(message, signature)
    console.assert(pubAddr.toLowerCase() == address.toLowerCase(), 'Login sign message error')
    return {message, signature}
}

// 取消订单签名
export async function cancelSign(hash: string, address: string, priKey?: string): Promise<any> {
    // const signerAddress = await signer.getAddress()
    const {walletSigner} = getProvider({address, chainId: 1, priKey})
    const hashify = ethers.utils.arrayify(hash)
    const signature = await walletSigner.signMessage(hashify).catch((e: any) => {
        // this.emit('Error', e)
        throw e
    })


    const pubAddr = ethers.utils.verifyMessage(hashify, signature)
    console.assert(pubAddr.toLowerCase() == address.toLowerCase(), 'Cancel sign message error')
    // debugger
    return {hash, signature}
}

export function priKeyToAddress(privateKey) {
    return new Wallet(privateKey).address.toLowerCase()
}
