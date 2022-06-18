import EventEmitter from 'events'

import {
    OPENSEA_CONTRACTS_ADDRESSES,
    OpenseaABI,
} from './contracts/index'

import {
    Web3Accounts,
    Token,
    APIConfig,
    OrderType,
    Asset,
    BuyOrderParams,
    CreateOrderParams,
    MatchParams,
    SellOrderParams,
    NullToken,
} from 'web3-accounts'
import {
    Order, OrderJSON, UnhashedOrder,
    ethSend,
    getEstimateGas,
    WalletInfo,
    getChainRpcUrl,
    NULL_BLOCK_HASH,
    NULL_ADDRESS,
    LimitedCallSpec,
    BigNumber
} from "./types"
import {Contract, ethers} from "ethers";

import {
    _makeBuyOrder,
    _makeMatchingOrder,
    _makeSellOrder,
    assignOrdersToSides,
    orderFromJSON,
    orderToJSON
} from "./utils/makeOrder";
import {ElementError} from "./utils/error";
import {metadataToAsset, getWyvOrderParams, getEIP712TypedData} from "./utils/helper";
import {DEFAULT_EXPIRATION_TIME, DEFAULT_LISTING_TIME, DEFAULT_SELLER_FEE_BASIS_POINTS} from "./utils/constants";
import {assert, schemas} from "./assert/index";


export class OpenSea extends EventEmitter {
    public walletInfo: WalletInfo
    public protocolFeePoint = DEFAULT_SELLER_FEE_BASIS_POINTS
    // address
    public contractAddresses: any
    // public WETHAddr: string
    public exchangeKeeper: string
    public feeRecipientAddress: string
    public tokenTransferProxyAddress: string
    public accountProxyAddress: string

    // contracts
    public merkleValidator: Contract
    public exchange: Contract
    public exchangeProxyRegistry: Contract
    public assetShared: Contract

    public userAccount: Web3Accounts
    public GasWarpperToken: Token

    constructor(wallet: WalletInfo, config?: APIConfig) {
        super()
        const contracts = config?.contractAddresses || OPENSEA_CONTRACTS_ADDRESSES[wallet.chainId]
        if (config?.protocolFeePoint) {
            this.protocolFeePoint = config.protocolFeePoint
        }
        this.walletInfo = wallet
        this.accountProxyAddress = NULL_ADDRESS

        const chainId = wallet.chainId
        // fee = '0x5b3256965e7C3cF26E11FCAf296DfC8807C01073'

        if (!contracts) {
            throw  chainId + 'Opensea sdk undefine contracts address'
        }
        const merkleProofAddr = contracts.MerkleProof
        const exchangeAddr = contracts.WyvernExchange
        const proxyRegistryAddr = contracts.WyvernProxyRegistry
        const tokenTransferProxyAddr = contracts.WyvernTokenTransferProxy
        const feeRecipientAddress = contracts.FeeRecipientAddress
        const assetSharedAddress = contracts.AssetContractShared

        this.contractAddresses = contracts

        this.GasWarpperToken = {
            name: 'GasToken',
            symbol: 'GasToken',
            address: contracts.GasToken,
            decimals: 18
        }
        this.feeRecipientAddress = feeRecipientAddress
        this.tokenTransferProxyAddress = tokenTransferProxyAddr
        this.exchangeKeeper = contracts.ExchangeKeeper


        this.userAccount = new Web3Accounts(wallet)
        const options = this.userAccount.signer
        if (exchangeAddr && proxyRegistryAddr) {
            this.exchangeProxyRegistry = new ethers.Contract(proxyRegistryAddr, OpenseaABI.proxyRegistry.abi, options)
            this.exchange = new ethers.Contract(exchangeAddr, OpenseaABI.openseaExV2.abi, options)
            this.merkleValidator = new ethers.Contract(merkleProofAddr, OpenseaABI.merkleValidator.abi, options)
            this.assetShared = new ethers.Contract(assetSharedAddress, OpenseaABI.assetContractShared.abi, options)
        } else {
            throw `${this.walletInfo.chainId} abi undefined`
        }
    }

    async registerProxyCallData(): Promise<LimitedCallSpec> {
        const data = await this.exchangeProxyRegistry.populateTransaction.registerProxy()
        return {
            from: data.from,
            to: data.to,
            data: data.data
        } as LimitedCallSpec
    }

    //1 register proxy
    async getAccountProxy(account?: string): Promise<{ accountProxy: string }> {
        if (account) {
            const accountProxy = await this.exchangeProxyRegistry.proxies(account)
            return {accountProxy}
        }
        if (this.accountProxyAddress == NULL_ADDRESS) {
            this.accountProxyAddress = await this.exchangeProxyRegistry.proxies(this.walletInfo.address)
        }
        return {accountProxy: this.accountProxyAddress}
        // return this.accountProxyAddress
    }

    //2 approve pay token
    async getTokenProxyApprove(tokenAddr: string, maker?: string) {
        // const {accountProxy} = await this.getAccountProxy(maker)
        return this.userAccount.getTokenApprove(tokenAddr, this.tokenTransferProxyAddress, maker)
    }

    //3  approve NFTs to proxy
    async getAssetProxyApprove(asset: Asset, maker?: string) {
        const {accountProxy} = await this.getAccountProxy(maker)
        return this.userAccount.getAssetApprove(asset, accountProxy, maker)
    }

    async getOrderApproveStep(params: CreateOrderParams, side: OrderType) {
        try {
            const {asset, paymentToken, startAmount, quantity} = params
            const tokenAddr = paymentToken ? paymentToken.address : NULL_ADDRESS
            const decimals: number = paymentToken ? paymentToken.decimals : 18
            let accountRegister, assetApprove, tokenApprove

            // 检查 Sell 买单
            if (side == OrderType.Sell) {
                const {accountProxy} = await this.getAccountProxy()
                // const registerCallData =
                accountRegister = {
                    isApprove: accountProxy != NULL_ADDRESS,
                    calldate: accountProxy != NULL_ADDRESS ? undefined : await this.registerProxyCallData()
                }
                assetApprove = await this.getAssetProxyApprove(asset)
                if (Number(assetApprove.balances) < Number(quantity)) {
                    throw 'Asset is not enough'
                }
            }
            //transfer fee
            if (tokenAddr != NULL_ADDRESS) {
                const {allowance, balances, calldata} = await this.getTokenProxyApprove(tokenAddr)
                const spend = new BigNumber(startAmount).times(new BigNumber(10).pow(decimals))
                if (spend.gt(balances)) {
                    throw 'Token is not enough'
                }
                tokenApprove = {
                    isApprove: spend.lt(allowance),
                    balances,
                    calldata: spend.lt(allowance) ? undefined : calldata
                }
            }
            return {
                accountRegister,
                assetApprove,
                tokenApprove
            }
            // checkDataToCall(contract.networkName, order)
        } catch (err: any) {
            console.error(err)
            throw err
        }

    }

    // v2 712 sign data
    async hashToSign_(order: UnhashedOrder) {
        const {orderParm} = getWyvOrderParams(JSON.stringify(order))

        return this.exchange.hashToSign_(...orderParm)
    }

    async validateOrder_(order: UnhashedOrder, sigStr: string) {
        const {orderParm} = getWyvOrderParams(JSON.stringify(order))
        const sig = ethers.utils.splitSignature(sigStr)
        const isValidOrder = await this.exchange.validateOrder_(...orderParm, sig.v, sig.r, sig.s)
        if (!isValidOrder) {
            const validParams = await this.exchange.validateOrderParameters_(...orderParm)

            if (!validParams) {
                console.log('validateOrderParameters_', validParams)
                return false
            }

            const hash = await this.hashToSign_(order)
            const isCancelled = await this.exchange.cancelledOrFinalized(hash)
            if (isCancelled) {
                console.log('cancelledOrFinalized', validParams)
                return false
            }
        }
        return isValidOrder
    }

    async getMatchCallData({
                               orderStr,
                               makerAddress,
                               assetRecipientAddress,
                               metadata = NULL_BLOCK_HASH
                           }: MatchParams
    ): Promise<{ callData: LimitedCallSpec, params: any, buy: OrderJSON, sell: OrderJSON }> {

        const bestOrder: OrderJSON = JSON.parse(orderStr)
        assert.doesConformToSchema('OrderStringCheck', bestOrder, schemas.orderSchema)
        const makeParmas = {
            order: bestOrder,
            makerAddress: makerAddress || this.walletInfo.address,
            assetRecipientAddress: assetRecipientAddress || this.walletInfo.address,
            chainId: this.walletInfo.chainId
        }
        // getWyvOrderParams
        const orders = await this.makeMatchingOrder(makeParmas)
        const buy = orderToJSON(orders.buy)
        const sell = orderToJSON(orders.sell)
        // getWyvOrderParams

        const params = [
            [buy.exchange, buy.maker, buy.taker, buy.feeRecipient, sell.target, buy.staticTarget, buy.paymentToken,
                sell.exchange, sell.maker, sell.taker, sell.feeRecipient, sell.target, sell.staticTarget, sell.paymentToken],
            [buy.makerRelayerFee, buy.takerRelayerFee, buy.makerProtocolFee, buy.takerProtocolFee, buy.basePrice, buy.extra, buy.listingTime, buy.expirationTime, buy.salt,
                sell.makerRelayerFee, sell.takerRelayerFee, sell.makerProtocolFee, sell.takerProtocolFee, sell.basePrice, sell.extra, sell.listingTime, sell.expirationTime, sell.salt],
            [buy.feeMethod, buy.side, buy.saleKind, buy.howToCall,
                sell.feeMethod, sell.side, sell.saleKind, sell.howToCall],
            buy.calldata,
            sell.calldata,
            buy.replacementPattern,
            sell.replacementPattern,
            buy.staticExtradata,
            sell.staticExtradata
        ]

        await this.isCanMatch({params, buy, sell})

        const data = await this.exchange.populateTransaction.atomicMatch_(...params,
            [buy.v || 0, sell.v || 0],
            [
                buy.r || NULL_BLOCK_HASH,
                buy.s || NULL_BLOCK_HASH,
                sell.r || NULL_BLOCK_HASH,
                sell.s || NULL_BLOCK_HASH,
                metadata
            ])
        const callData = {
            to: data.to,
            data: data.data,
            value: bestOrder.paymentToken == NULL_ADDRESS ? bestOrder.basePrice.toString() : undefined,
            from: this.walletInfo.address
        } as LimitedCallSpec

        return {callData, params, buy, sell}
    }

    public async createSellOrder({
                                     asset,
                                     quantity = 1,
                                     paymentToken = NullToken,
                                     listingTime = 0,
                                     expirationTime = 0,
                                     startAmount,
                                     endAmount,
                                     buyerAddress
                                 }: SellOrderParams): Promise<any> {
        const params = {asset, quantity, paymentToken, startAmount, expirationTime} as CreateOrderParams
        const {accountRegister, assetApprove, tokenApprove} = await this.getOrderApproveStep(params, OrderType.Sell)
        if (!accountRegister.isApprove) {
            const tx = await ethSend(this.walletInfo, accountRegister.calldata)
            await tx.wait()
        }

        if (!assetApprove.isApprove) {
            const tx = await ethSend(this.walletInfo, assetApprove.calldata)
            await tx.wait()
            console.log(tx.hash)
        }

        if (paymentToken.address != NULL_ADDRESS && !tokenApprove.isApprove) {
            const tx = await ethSend(this.walletInfo, tokenApprove.calldata)
            await tx.wait()
        }

        expirationTime = expirationTime ? parseInt(String(expirationTime)) : DEFAULT_LISTING_TIME + DEFAULT_EXPIRATION_TIME;

        const exchangeAddr = this.exchange.address
        const feeRecipientAddr = this.feeRecipientAddress
        const accountAddress = this.walletInfo.address
        const sellOrderParams = {
            exchangeAddr,
            protocolFeePoint: this.protocolFeePoint,
            asset,
            quantity,
            accountAddress,
            startAmount,
            listingTime,
            expirationTime,
            paymentTokenObj: paymentToken,
            extraBountyBasisPoints: 0,
            feeRecipientAddr,
            endAmount,
            waitForHighestBid: false,
            buyerAddress: buyerAddress || NULL_ADDRESS
        }

        const sellOrder = await _makeSellOrder(sellOrderParams) //
        sellOrder.howToCall = 1
        const {
            dataToCall,
            replacementPattern,
            target
        } = await this.encodeCallData(sellOrder, sellOrderParams.buyerAddress)
        sellOrder.target = target
        sellOrder.calldata = dataToCall
        sellOrder.replacementPattern = replacementPattern

        return this.creatSignedOrder({unHashOrder: sellOrder})
    }

    public async createBuyOrder({
                                    asset,
                                    quantity = 1,
                                    paymentToken = this.GasWarpperToken,
                                    expirationTime,
                                    startAmount
                                }: BuyOrderParams): Promise<any> {
        paymentToken = paymentToken.address == NULL_ADDRESS ? this.GasWarpperToken : paymentToken
        if (paymentToken.address == NULL_ADDRESS) 'Create buy order must be erc20 token'

        const exchangeAddr = this.exchange.address
        const feeRecipientAddr = this.feeRecipientAddress
        const accountAddress = this.walletInfo.address

        const params = {asset, quantity, paymentToken, startAmount, expirationTime} as CreateOrderParams
        const {tokenApprove} = await this.getOrderApproveStep(params, OrderType.Buy)

        if (!tokenApprove.isApprove) {
            const tx = await ethSend(this.walletInfo, tokenApprove.calldata)
            await tx.wait()
        }
        expirationTime = expirationTime ? parseInt(String(expirationTime)) : DEFAULT_LISTING_TIME + DEFAULT_EXPIRATION_TIME;
        const buyOrderParams = {
            exchangeAddr,
            protocolFeePoint: this.protocolFeePoint,
            asset,
            quantity,
            accountAddress,
            startAmount,
            expirationTime,
            paymentTokenObj: paymentToken,
            extraBountyBasisPoints: 0,
            feeRecipientAddr
        }
        const buyOrder = await _makeBuyOrder(buyOrderParams)

        buyOrder.howToCall = 1
        const {dataToCall, replacementPattern, target} = await this.encodeCallData(buyOrder, accountAddress)
        buyOrder.target = target
        buyOrder.calldata = dataToCall
        buyOrder.replacementPattern = replacementPattern
        return this.creatSignedOrder({unHashOrder: buyOrder})
    }


    public async creatSignedOrder(
        {unHashOrder}: { unHashOrder: UnhashedOrder }
    ): Promise<OrderJSON> {
        const hash = await this.hashToSign_(unHashOrder)

        // const expirationTime = parseInt((new Date().getTime() / 1000) + (60 * 60 * 24 * 10))
        // await this.checkUnhashedOrder(unHashOrder)
        try {
            const nonces = await this.exchange.nonces(unHashOrder.maker)
            const nonce = nonces.toString()
            // let msg = hash
            const version = '2.3'//await this.exchange.version()
            const name = 'Wyvern Exchange Contract'//await this.exchange.name()
            const verifyingContract = this.exchange.address
            const eip712Domain = {name, version, chainId: this.walletInfo.chainId, verifyingContract}

            const typedData = getEIP712TypedData(JSON.stringify(unHashOrder), eip712Domain, Number(nonce))
            // typedData.message.makerProtocolFee =250
            // msg = JSON.stringify(typedData)
            // delete typedData.types.EIP712Domain;
            const sigStr = await (<any>this.userAccount.signer)._signTypedData(typedData.domain, typedData.types, typedData.message)

            const signature = ethers.utils.splitSignature(sigStr)

            const isValid = await this.validateOrder_(unHashOrder, sigStr)
            if (!isValid) {
                throw 'validateOrder_ false'
            }
            const hashedOrder = {
                ...unHashOrder,
                hash,
                nonce
            }

            const orderWithSignature: Order = {
                ...hashedOrder,
                r: signature.r,
                s: signature.s,
                v: signature.v
            }

            return orderToJSON(orderWithSignature)
        } catch (error: any) {
            if (error.data) {
                error.data.order = unHashOrder
            } else {
                // eslint-disable-next-line no-ex-assign
                error = {...error, message: error.message, data: {order: unHashOrder}}
            }
            throw error
        }
    }

    public async checkMatchOrder(orderStr: string) {
        const {orderParm, orderJson} = getWyvOrderParams(orderStr)
        const orderHash = await this.exchange.hashToSign_(...orderParm)
        if (!orderJson.calldata) throw 'The order has no CallData definition'
        // 检查订单是否被批量取消-
        if (orderJson.hash !== orderHash) {
            throw 'The order has been filled or cancelled'
        }

        // 检查订单是否有效
        const isValidOrder = await this.exchange.validateOrder_(...orderParm, orderJson.v, orderJson.r, orderJson.s)
        if (!isValidOrder) {
            const validParams = await this.exchange.validateOrderParameters_(...orderParm)
            if (!validParams) {
                const error = {code: '1208', context: {part: 'Sell'}, data: orderStr}
                throw new ElementError(error)
            }

            const isCancelled = await this.exchange.cancelledOrFinalized(orderHash)
            if (isCancelled) {
                let side = 'sell'
                if (orderJson.side === OrderType.Buy) {
                    side = 'buy'
                }
                console.log('cancelledOrFinalized', validParams)
                throw side + ' Order cancelledOrFinalized false' + side
            }

            if (orderJson.v != 27 && orderJson.v != 28) {
                return false
            }
            throw new ElementError({code: '1203', data: orderStr})
            // return false
        }

        if (orderJson.side === OrderType.Sell) {
            const maker = orderJson.maker
            // 检查资产授权  // 检查资产余额
            const asset = metadataToAsset(orderJson.metadata)
            const {isApprove, balances} = await this.getAssetProxyApprove(asset, maker)
            if (balances == '0') {
                throw 'Seller asset balance 0'
            }
            if (!isApprove) {
                throw("Seller asset must be approved");
            }
            //transfer fee
            if (orderJson.paymentToken != NULL_ADDRESS) {
                const {allowance} = await this.getTokenProxyApprove(orderJson.paymentToken, maker)
                const spend = new BigNumber(orderJson.basePrice)
                if (spend.gt(allowance)) {
                    console.log("Seller erc20 token approved allowance is not enough");
                }
            }
        }

        if (orderJson.side === OrderType.Buy) {
            const maker = orderJson.maker
            if (orderJson.paymentToken == NULL_ADDRESS) throw 'Buy order payment token can\'t be ETH'
            const {allowance, balances} = await this.getTokenProxyApprove(orderJson.paymentToken, maker)
            const spend = new BigNumber(orderJson.basePrice)
            if (spend.gt(balances)) {
                throw 'Buyer erc20 token is not enough balances:' + balances
            }
            if (spend.gt(allowance)) {
                throw("Buyer erc20 token approved allowance is not enough allowance:" + allowance);
            }
        }

        return isValidOrder
    }

    private async encodeCallData(order: UnhashedOrder, assetRecipientAddress: string) {
        const from = order.maker
        // const to = NULL_ADDRESS
        const token = order.metadata.asset.address
        const tokenId = order.metadata.asset.id
        const amount = order.quantity.toString()
        const root = NULL_BLOCK_HASH//ethers.utils.arrayify('0x');
        const proof = [] //ethers.utils.arrayify([]);
        let dataToCall = "", replacementPattern = ""

        //ok https://rinkeby.etherscan.io/tx/0x1a9ab7ba090f62460a2157187578ba7698cadd9d48a430cadc2da785e890c0b8
        if (order.metadata.schema.toLowerCase() == 'erc721') {
            // const gas = await this.contracts.merkleValidator.estimateGas.matchERC721UsingCriteria(from, to, token, tokenId, root, proof)

            if (order.side == OrderType.Sell) {
                const callData = await this.merkleValidator.populateTransaction.matchERC721UsingCriteria(from, NULL_ADDRESS, token, tokenId, root, proof)
                dataToCall = callData.data || ""
                replacementPattern = '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
            }

            if (order.side == OrderType.Buy) {
                const callData = await this.merkleValidator.populateTransaction.matchERC721UsingCriteria(NULL_ADDRESS, assetRecipientAddress, token, tokenId, root, proof)
                dataToCall = callData.data || ""
                replacementPattern = '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
            }
        }

        if (order.metadata.schema.toLowerCase() == 'erc1155') {

            if (order.side == OrderType.Sell) {
                const callData = await this.merkleValidator.populateTransaction.matchERC1155UsingCriteria(from, NULL_ADDRESS, token, tokenId, amount, root, proof)
                dataToCall = callData.data || ""
                replacementPattern = '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
            }
            if (order.side == OrderType.Buy) {
                //
                const callData = await this.merkleValidator.populateTransaction.matchERC1155UsingCriteria(NULL_ADDRESS, assetRecipientAddress, token, tokenId, amount, root, proof)
                dataToCall = callData.data || ""
                replacementPattern = '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
            }
        }
        const target: string = this.merkleValidator.address
        return {dataToCall, replacementPattern, target}
    }

    private async makeMatchingOrder(params: { order: any, makerAddress: string, assetRecipientAddress: string }) {
        const {order, makerAddress, assetRecipientAddress} = params
        const bestOrder: OrderJSON = order as OrderJSON
        const signedOrder = orderFromJSON(bestOrder)
        const matchingOrder = _makeMatchingOrder({
            unSignedOrder: signedOrder,
            makerAddress,
            feeRecipientAddress: signedOrder.feeRecipient
        })
        // 伪造 对手单
        const unsignData = {...matchingOrder, hash: signedOrder.hash}

        // unsignData.maker =
        const {dataToCall, replacementPattern} = await this.encodeCallData(unsignData, assetRecipientAddress)
        unsignData.calldata = dataToCall
        unsignData.replacementPattern = replacementPattern

        return assignOrdersToSides(signedOrder, unsignData)

    }

    private async isCanMatch({params, buy, sell}: { params: any, buy: OrderJSON, sell: OrderJSON }) {
        const exchange = this.exchange
        // exchange.options.address = sell.exchange

        // debugger
        const isCalldataCanMatch = await exchange.orderCalldataCanMatch(
            buy.calldata,
            buy.replacementPattern,
            sell.calldata,
            sell.replacementPattern).catch((e: any) => {
            throw 'orderCalldataCanMatch error'
        })
        if (!isCalldataCanMatch) {
            // buyReplacementPattern Buy-side order calldata replacement mask
            // sellReplacementPattern Sell-side order calldata replacement mask
            // Whether the orders' calldata can be matched
            console.log('isCalldataCanMatch buy \n', buy.calldata, '\n', buy.replacementPattern, '\n sell \n', sell.calldata, '\n', sell.replacementPattern)
            throw 'orderCalldataCanMatch error'
        }
        const isCanMatch = await exchange.ordersCanMatch_(...params).catch((e: any) => {
            //  (buy.paymentToken == sell.paymentToken) &&
            //  (buy.target == sell.target)
            //  (buy.howToCall == sell.howToCall)
            console.log(e)
        })

        if (!isCanMatch) {
            console.error(params)
            throw 'ordersCanMatch_ error'
        }
    }

    public async matchOrder(orderStr: string) {
        await this.checkMatchOrder(orderStr)
        const {callData, sell} = await this.getMatchCallData({orderStr})
        console.assert(sell.exchange.toLowerCase() == this.exchange.address.toLowerCase(), 'AcceptOrder error')
        return ethSend(this.walletInfo, callData)
    }

    public async cancelOrder(orderStr: string) {
        const {orderParm, orderJson} = getWyvOrderParams(orderStr)
        const params = [...orderParm, orderJson.v, orderJson.r, orderJson.s]

        // console.log(params)
        // await this.exchange.hashToSign_(...orderParm)
        // const nonce = await this.exchange.nonces(unHashOrder.maker)
        const hase = await this.exchange.hashToSign_(...orderParm)
        const isCancel = await this.exchange.cancelledOrFinalized(hase)

        if (isCancel) throw 'cancelledOrFinalized'
        // const callData = nonce ?  this.contracts.exchange.populateTransaction.cancelOrderWithNonce_(...params, nonce)
        //     :  this.contracts.exchange.populateTransaction.cancelOrder_(...params)

        const data = await this.exchange.populateTransaction.cancelOrder_(...params)
        const callData = {
            from: data.from,
            to: data.to,
            data: data.data
        } as LimitedCallSpec
        const rpcUrl = this.walletInfo.rpcUrl?.url || await getChainRpcUrl(this.walletInfo.chainId)
        // const gas = await getEstimateGas(rpcUrl, callData)
        // console.log(gas)
        return ethSend(this.walletInfo, callData)
    }

    // cancel all order
    private async incrementNonce() {
        const data = await this.exchange.populateTransaction.incrementNonce()
        const callData = {
            from: this.walletInfo.address,
            to: this.exchange.options.address,
            data: data.data
        } as LimitedCallSpec
        const rpcUrl = this.walletInfo.rpcUrl?.url || await getChainRpcUrl(this.walletInfo.chainId)
        await getEstimateGas(rpcUrl, callData)
        return ethSend(this.walletInfo, callData)
    }

    public async cancelOrders(orders: string[]) {
        if (orders.length == 0) {
            return this.incrementNonce()
        } else {
            return this.cancelOrder(orders[0])
        }
    }

    async ethSend(callData: LimitedCallSpec) {
        return ethSend(this.walletInfo, callData).catch(err => {
            throw err
        })
    }

    async estimateGas(callData: LimitedCallSpec) {
        const rpcUrl = this.walletInfo.rpcUrl?.url || await getChainRpcUrl(this.walletInfo.chainId)
        return getEstimateGas(rpcUrl, callData).catch(err => {
            throw err
        })
    }
}

