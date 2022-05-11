import EventEmitter from 'events'
import {RPC_PROVIDER, ContractABI, MOCK_CONTRACTS_ADDRESSES} from './config'
import {ethers, Signer, ContractInterface, Contract} from 'ethers'

import {getProvider, WalletInfo} from "web3-wallets";

// export {ethers}
export class ContractBase extends EventEmitter {
    public chainId: number
    public readonly signer: Signer
    // public readonly provider: any
    public readonly signerAddress: string
    // public readonly walletSigner: any

    public walletInfo: WalletInfo
    public erc20Abi: any
    public erc721Abi: any
    public erc1155Abi: any
    public Mock721: Contract | undefined
    public Mock1155: Contract | undefined


    constructor(wallet: WalletInfo) {
        super()
        wallet.rpcUrl = wallet.rpcUrl || RPC_PROVIDER[wallet.chainId]
        this.walletInfo = wallet
        const {address, chainId, walletSigner} = getProvider(wallet)

        this.chainId = chainId
        this.signer = walletSigner
        // this.provider = walletProvider
        // this.walletSigner = walletSigner
        this.signerAddress = address

        this.erc20Abi = ContractABI.erc20.abi
        this.erc721Abi = ContractABI.erc721.abi
        this.erc1155Abi = ContractABI.erc1155.abi
        const mock = MOCK_CONTRACTS_ADDRESSES[wallet.chainId]
        if (mock) {
            this.Mock721 = this.getContract(mock.ERC721, ContractABI.erc721.abi)
            this.Mock1155 = this.getContract(mock.ERC1155, ContractABI.erc1155.abi)
        }
    }

    getContract(contractAddresses: string, abi: ContractInterface): Contract {
        return new ethers.Contract(contractAddresses, abi, this.signer)
    }

}
