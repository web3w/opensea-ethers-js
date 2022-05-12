import {
    ECSignature,
    UnhashedOrder,
    UnsignedOrder,
    BigNumber,
    OrderJSON,
    Asset,
    Order,
    NULL_ADDRESS,
    ExchangeMetadata
} from '../types'


export function toBaseUnitAmount(amount: BigNumber, decimals: number): BigNumber {
    const unit = new BigNumber(10).pow(decimals)
    return amount.times(unit).integerValue()
}


export function makeBigNumber(arg: number | string | BigNumber): BigNumber {
    // Zero sometimes returned as 0x from contracts
    if (arg === '0x') {
        arg = 0
    }
    // fix "new BigNumber() number type has more than 15 significant digits"
    arg = arg.toString()
    return new BigNumber(<string>arg)
}


export function orderSigEncode(order: ECSignature): Array<any> {
    const orderSigKeys = ['v', 'r', 's']
    const orderSigValueArray: any[] = []
    for (const key of orderSigKeys) {

        if (order[key] === undefined) {
            console.log('orderSigEncode key undefined', key)
            continue
        }
        orderSigValueArray.push(order[key])
    }
    return orderSigValueArray
}

export function getWyvOrderParams(orderStr: string): { orderJson: any, orderParm: Array<any> } {
    const order: OrderJSON = JSON.parse(orderStr)
    const orderParm = [
        [order.exchange, order.maker, order.taker, order.feeRecipient, order.target, order.staticTarget, order.paymentToken],
        [
            order.makerRelayerFee.toString(),
            order.takerRelayerFee.toString(),
            order.makerProtocolFee.toString(),
            order.takerProtocolFee.toString(),
            order.basePrice.toString(),
            order.extra.toString(),
            order.listingTime.toString(),
            order.expirationTime.toString(),
            order.salt.toString()
        ],
        order.feeMethod,
        order.side,
        order.saleKind,
        order.howToCall,
        order.dataToCall,// order.calldata,
        order.replacementPattern,
        order.staticExtradata
    ]
    return {orderParm, orderJson: order}
}

export function assetToMetadata(asset: Asset, quantity: string = "1", data?: string): ExchangeMetadata {
    return <ExchangeMetadata>{
        asset: {
            id: asset.tokenId,
            address: asset.tokenAddress,
            quantity,
            data
        },
        schema: asset.schemaName
    }
}

export function metadataToAsset(metadata: ExchangeMetadata, data?: Asset): Asset {
    return <Asset>{
        ...data,
        tokenId: metadata.asset.id,
        tokenAddress: metadata.asset.address,
        schemaName: metadata.schema
    }
}


export const openseaOrderFromJSON = (order: any): Order => {
    // console.log(order)
    const createdDate = new Date(`${order.created_date}Z`)

    const fromJSON: Order = {
        hash: order.order_hash || order.hash,
        cancelledOrFinalized: order.cancelled || order.finalized,
        markedInvalid: order.marked_invalid,
        metadata: order.metadata,
        quantity: new BigNumber(order.quantity || 1),
        exchange: order.exchange,
        makerAccount: order.maker,
        takerAccount: order.maker,
        // Use string address to conform to Wyvern Order schema
        maker: order.maker.address,
        taker: order.taker.address,
        makerRelayerFee: new BigNumber(order.maker_relayer_fee),
        takerRelayerFee: new BigNumber(order.taker_relayer_fee),
        makerProtocolFee: new BigNumber(order.maker_protocol_fee),
        takerProtocolFee: new BigNumber(order.taker_protocol_fee),
        makerReferrerFee: new BigNumber(order.maker_referrer_fee || 0),
        waitingForBestCounterOrder: order.fee_recipient.address == NULL_ADDRESS,
        feeMethod: order.fee_method,
        feeRecipientAccount: order.fee_recipient,
        feeRecipient: order.fee_recipient.address,
        side: order.side,
        saleKind: order.sale_kind,
        target: order.target,
        howToCall: order.how_to_call,
        dataToCall: order.calldata,//dataToCall
        replacementPattern: order.replacement_pattern,
        staticTarget: order.static_target,
        staticExtradata: order.static_extradata,
        paymentToken: order.payment_token,
        basePrice: new BigNumber(order.base_price),
        extra: new BigNumber(order.extra),
        currentBounty: new BigNumber(order.current_bounty || 0),
        currentPrice: new BigNumber(order.current_price || 0),

        createdTime: new BigNumber(Math.round(createdDate.getTime() / 1000)),
        listingTime: new BigNumber(order.listing_time),
        expirationTime: new BigNumber(order.expiration_time),

        salt: new BigNumber(order.salt),
        v: parseInt(order.v),
        r: order.r,
        s: order.s,

        paymentTokenContract: order.payment_token_contract,
        assetBundle: order.asset_bundle
    }

    // Use client-side price calc, to account for buyer fee (not added by server) and latency
    // fromJSON.currentPrice = estimateCurrentPrice(fromJSON)
    return fromJSON
}

