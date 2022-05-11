import {ethers, providers,} from 'ethers'
import {ContractBase} from './contracts/index'
import {
    LimitedCallSpec,
    Asset,
    ElementSchemaName,
    ExchangeMetadata,
    WalletInfo,

} from './types/elementTypes'

import {ethSend} from "web3-wallets";
import {metadataToAsset} from "./openseaEx/utils/helper";
import {NULL_ADDRESS} from "./openseaEx/utils/constants";


export class UserAccount extends ContractBase {
    constructor(wallet: WalletInfo) {
        super(wallet)
    }

    public async approveErc20ProxyCalldata(tokenAddr: string, spender: string, allowance?: string): Promise<LimitedCallSpec> {
        const quantity = allowance || ethers.constants.MaxInt256.toString() //200e18.toString() //
        const erc20 = this.getContract(tokenAddr, this.erc20Abi)
        const data = await erc20.populateTransaction.approve(spender, quantity)

        return {
            from: data.from,
            to: data.to,
            data: data.data
        } as LimitedCallSpec

    }


    public async approveErc20Proxy(tokenAddr: string, spender: string, allowance?: string) {
        const callData = await this.approveErc20ProxyCalldata(tokenAddr, spender, allowance)
        return ethSend(this.walletInfo, callData)
    }


    public async approveErc721ProxyCalldata(tokenAddr: string, operator: string, isApprove = true): Promise<LimitedCallSpec> {

        const erc721 = this.getContract(tokenAddr, this.erc721Abi)
        const data = await erc721.populateTransaction.setApprovalForAll(operator, isApprove)

        return {
            from: data.from,
            to: data.to,
            data: data.data
        } as LimitedCallSpec

    }

    public async approveErc721Proxy(tokenAddr: string, operator: string) {
        const callData = await this.approveErc721ProxyCalldata(tokenAddr, operator)
        return ethSend(this.walletInfo, callData)
    }

    public async approveErc721ProxyFalse(tokenAddr: string, operator: string) {
        const callData = await this.approveErc721ProxyCalldata(tokenAddr, operator, false)
        return ethSend(this.walletInfo, callData)
    }

    public async approveErc1155ProxyCalldata(tokenAddr: string, operator: string) {

        const erc1155 = this.getContract(tokenAddr, this.erc1155Abi)
        const data = await erc1155.populateTransaction.setApprovalForAll(operator, true)

        return {
            from: data.from,
            to: data.to,
            data: data.data
        } as LimitedCallSpec

    }

    public async approveErc1155Proxy(tokenAddr: string, operator: string) {
        const calldata = await this.approveErc1155ProxyCalldata(tokenAddr, operator)
        return ethSend(this.walletInfo, calldata)
    }

    public async getGasBalances({
                                    account,
                                    rpcUrl
                                }: { account?: string, rpcUrl?: string }): Promise<string> {
        const owner = account || this.signerAddress
        let provider: any = this.signer
        let rpc = rpcUrl || this.walletInfo.rpcUrl
        let ethBal = '0'
        if (rpcUrl) {
            const network = {
                name: owner,
                chainId: this.walletInfo.chainId
            }
            provider = new providers.JsonRpcProvider(rpc, network)
        }
        if (account && ethers.utils.isAddress(account)) {
            if (rpcUrl) {
                // ethBal = (await provider.getBalance(this.walletInfo.address)).toString()
                const ethStr = await provider.send('eth_getBalance', [owner, 'latest'])
                ethBal = parseInt(ethStr).toString()
            } else {
                const ethStr = (await provider.provider.send('eth_getBalance', [owner, 'latest']))
                ethBal = parseInt(ethStr).toString()

            }
        }
        return ethBal
    }

    public async getTokenBalances({
                                      tokenAddr,
                                      account,
                                      rpcUrl
                                  }: { tokenAddr: string, account?: string, rpcUrl?: string }): Promise<string> {
        const owner = account || this.signerAddress
        let provider: any = this.signer
        let erc20Bal = '0'
        let rpc = rpcUrl || this.walletInfo.rpcUrl
        if (rpcUrl) {
            const network = {
                name: owner,
                chainId: this.walletInfo.chainId
            }
            provider = new providers.JsonRpcProvider(rpc, network)
        }
        if (tokenAddr
            && ethers.utils.isAddress(tokenAddr)
            && tokenAddr != NULL_ADDRESS) {

            const erc20 = this.getContract(tokenAddr, this.erc20Abi)
            if (rpcUrl) {
                // erc20Bal = await erc20.connect(provider).balanceOf(owner)
                const callData = await erc20.populateTransaction.balanceOf(owner)
                const erc20Str = await provider.send('eth_call', [callData, 'latest'])
                erc20Bal = parseInt(erc20Str).toString()
            } else {
                erc20Bal = await erc20.balanceOf(owner)
            }
        }
        return erc20Bal
    }

    public async getERC20Balances(erc20Addr: string, account?: string): Promise<string> {
        const owner = account || this.signerAddress
        const erc20 = this.getContract(erc20Addr, this.erc20Abi)
        const result = await erc20.balanceOf(owner)
        return result.toString()
    }

    public async getERC20Allowance(erc20Addr: string, spender: string, account?: string): Promise<string> {
        const owner = account || this.signerAddress
        // console.log('getERC20Allowance', owner, spender)
        const erc20 = this.getContract(erc20Addr, this.erc20Abi)
        const result = await erc20.allowance(owner, spender)
        return result.toString()
    }

    public async getERC721Balances(to: string, tokenId: string, account?: string): Promise<string> {
        const checkAddr = account || this.signerAddress
        const owner = await this.getERC721OwnerOf(to, tokenId)
        return checkAddr.toLowerCase() === owner.toLowerCase() ? '1' : '0'
    }

    public async getERC721OwnerOf(to: string, tokenId: string): Promise<string> {
        const erc721 = this.getContract(to, this.erc721Abi)
        return erc721.ownerOf(tokenId)
    }

    public async getERC721Allowance(to: string, operator: string, account?: string): Promise<boolean> {
        const owner = account || this.signerAddress
        const erc721 = this.getContract(to, this.erc721Abi)
        return erc721.isApprovedForAll(owner, operator)
    }

    public async getERC1155Balances(to: string, tokenId: string, account?: string): Promise<string> {
        const owner = account || this.signerAddress
        const erc1155 = this.getContract(to, this.erc1155Abi)
        const result = await erc1155.balanceOf(owner, tokenId)
        return result.toString()
    }

    public async getERC1155Allowance(to: string, operator: string, account?: string): Promise<boolean> {
        const owner = account || this.signerAddress
        const erc1155 = this.getContract(to, this.erc1155Abi)
        return erc1155.isApprovedForAll(owner, operator)
    }

    public async getAssetApprove(asset: Asset, operator: string, account?: string) {
        const owner = account || this.signerAddress
        let isApprove = false, balances = '0', calldata
        const tokenAddr = asset.tokenAddress
        const tokenId = asset.tokenId || '0'
        if (asset.schemaName == ElementSchemaName.ERC721) {
            isApprove = await this.getERC721Allowance(tokenAddr, operator, owner)
            calldata = isApprove ? undefined : this.approveErc721ProxyCalldata(tokenAddr, operator)
            balances = await this.getERC721Balances(tokenAddr, tokenId, owner)
        } else if (asset.schemaName == ElementSchemaName.ERC1155) {
            isApprove = await this.getERC1155Allowance(tokenAddr, operator, owner)
            calldata = isApprove ? undefined : this.approveErc1155ProxyCalldata(tokenAddr, operator)
            balances = await this.getERC1155Balances(tokenAddr, tokenId, owner)
        }
        // else if (asset.schemaName == ElementSchemaName.ERC20) {
        //   const allowance = await this.getERC20Allowance(tokenAddr)
        //   isApprove = quantity.lte(allowance)
        //   balances = await this.getERC20Balances(tokenAddr, tokenId)
        // }
        return {
            isApprove,
            balances,
            calldata
        }
    }

    public async getTokenApprove(tokenAddr: string, spender: string, account?: string) {
        const owner = account || this.signerAddress
        if (!ethers.utils.isAddress(tokenAddr)) throw 'GetTokenApprove error'
        const allowance = await this.getERC20Allowance(tokenAddr, spender, owner)
        const balances = await this.getERC20Balances(tokenAddr, owner)
        const calldata = this.approveErc20ProxyCalldata(tokenAddr, spender)
        return {
            allowance,
            balances,
            calldata
        }
    }

    public async assetApprove(asset: Asset, operator: string) {
        const tokenAddr = asset.tokenAddress
        if (asset.schemaName == ElementSchemaName.ERC721) {
            return this.approveErc721Proxy(tokenAddr, operator)
        } else if (asset.schemaName == ElementSchemaName.ERC1155) {
            return this.approveErc1155Proxy(tokenAddr, operator)
        } else {
            throw 'assetApprove error'
        }
    }

    public async getAssetBalances(asset: Asset, account?: string) {
        const owner = account || this.signerAddress
        let balances = '0'
        const tokenAddr = asset.tokenAddress
        const tokenId = asset.tokenId || '0'
        if (asset.schemaName == ElementSchemaName.ERC721) {
            balances = await this.getERC721Balances(tokenAddr, tokenId, owner)
        } else if (asset.schemaName == ElementSchemaName.ERC1155) {
            balances = await this.getERC1155Balances(tokenAddr, tokenId, owner)
        } else if (asset.schemaName == ElementSchemaName.ERC20) {
            balances = await this.getERC20Balances(tokenAddr, tokenId)
        }
        return balances
    }

    public async assetTransfer(metadata: ExchangeMetadata, to: string) {
        const from = this.signerAddress
        const assetQ = metadataToAsset(metadata)
        const balance = await this.getAssetBalances(assetQ, from)

        const {asset, schema} = metadata
        const {address, quantity, data, id} = asset

        if (Number(quantity || 1) > Number(balance)) {
            throw 'Asset banacle not enough'
        }

        const tokenId = id
        let calldata
        if (schema === ElementSchemaName.ERC721) {
            const erc721 = this.getContract(address, this.erc721Abi)
            // const gas = await erc721.estimateGas.safeTransferFrom(from, to, tokenId)
            calldata = await erc721.populateTransaction.safeTransferFrom(from, to, tokenId)
        }

        if (schema === ElementSchemaName.CryptoKitties) {
            const erc721 = this.getContract(address, this.erc721Abi)
            calldata = await erc721.populateTransaction.transferFrom(from, to, tokenId)
        }

        if (schema === ElementSchemaName.ERC1155) {
            const erc1155 = this.getContract(address, this.erc1155Abi)
            // const gas = await erc1155.estimateGas.safeTransferFrom(from, to, tokenId, quantity, data || '0x')
            calldata = await erc1155.populateTransaction.safeTransferFrom(from, to, tokenId, quantity, data || '0x')
        }

        if (schema === ElementSchemaName.ERC20) {
            const erc20 = this.getContract(address, this.erc20Abi)
            calldata = await erc20.populateTransaction.safeTransferFrom(from, to, quantity)
        }
        if (!calldata) throw schema + 'asset transfer error'
        return ethSend(this.walletInfo, calldata)
    }

    public async getAssetShareInfo(shareAssetAddress: string, tokenId: string) {
        const erc1155 = this.getContract(shareAssetAddress, this.erc1155Abi)
        // 如对应token id 的资产未创建 未false
        const exists = await erc1155.exists(tokenId)
        // const balance = (await erc1155.balanceOf(this.walletInfo.address, tokenId)).toString()
        // const creator = await erc1155.creator(tokenId)
        // const uri = await erc1155.uri(tokenId)
        // const overURI = await erc1155._getOverrideURI(tokenId)
        // console.log(balance.toString(), creator, uri, overURI)
        return {
            exists
        }
    }
}



