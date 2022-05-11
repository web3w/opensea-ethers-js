import ERC20Abi from './common/ERC20.json'
import ERC721Abi from './common/ERC721.json'
import ERC1155Abi from './common/ERC1155.json'
import WETHAbi from './common/WETH.json'
//opensea
import AuthenticatedProxy from './openseaV2/AuthenticatedProxy.json'
import proxyRegistryABI from './openseaV2/WyvernProxyRegistry.json'
import exchangeABI from './openseaV2/WyvernExchange.json'
import merkleValidatorABI from './openseaV2/MerkleValidator.json'

export interface AbiInfo {
    contractName: string
    sourceName?: string
    abi: any
}

export const OpenseaABI = {
    weth: WETHAbi as AbiInfo,
    authenticatedProxy: AuthenticatedProxy as AbiInfo,
    proxyRegistry: proxyRegistryABI as AbiInfo,
    openseaExV2: exchangeABI as AbiInfo,
    merkleValidator: merkleValidatorABI as AbiInfo
}

export const ContractABI = {
    weth: WETHAbi as AbiInfo,
    erc20: ERC20Abi as AbiInfo,
    erc721: ERC721Abi as AbiInfo,
    erc1155: ERC1155Abi as AbiInfo,
}
