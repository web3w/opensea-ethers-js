export {ElementSchemaName, OrderType, BigNumber} from './src/types/elementTypes'

export type {
    WalletInfo,
    ElementConfig,
    Asset,
    Token,
    LimitedCallSpec,
    Network,
    ExchangeMetadata
} from './src/types/elementTypes'

export type {
    MatchParams,
    BuyOrderParams,
    SellOrderParams,
    CreateOrderParams,
    LowerPriceOrderParams
} from './src/types/agentTypes'

export {UserAccount} from './src/userAccount'
export {OpenseaAPI} from './src/api/opensea'
export {OpenseaEx} from './src/openseaEx/openseaEx'
export {OpenseaExAgent} from './src/openseaEx/openseaExAgent'
export {RPC_PROVIDER} from './src/contracts/config'

export {Web3Wallets, detectWallets, ProviderNames, getEstimateGas, ethSend} from 'web3-wallets'
