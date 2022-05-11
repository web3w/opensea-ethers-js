/**
 * To simplify typifying ABIs
 */
export interface CustomError {
  name?: string
  data?: any
  code: string
  message?: string
  context?: {
    [key: string]: any
  }
}

export type ElementErrorCodes = Array<Readonly<CustomError>>

// 10 开头 用户+合约 授权错误
// 11 开头 资产，各类资产余额，授权，ID错误
// 12 开头 订单约束条件
// 20 开头 合约执行错误 rpc 网络请求错
// 40 开头 是MetaMask的拒绝 异常
export const ErrorCodes: ElementErrorCodes = [
  {
    code: 'INVALID_ARGUMENT',
    message: 'Smart contract error'
  },
  {
    code: '1000',
    message: 'SDK'
  },
  {
    code: '1001',
    message: 'Account no registration'
  },
  {
    code: '1002',
    message: 'Account authProxy without authorization exchangeProxyRegistryAddr '
  },
  {
    code: '1003',
    message: 'Order match estimateGas failure {{msg}}'
  },
  {
    code: '1004',
    message: 'Order match failure {{msg}}'
  },
  {
    code: '1101',
    message: 'TokenTransferProxy allowAmount equel 0 '
  },
  {
    code: '1102',
    message: 'ERC1155TransferProxy NFTs isApprovedForAll is false '
  },
  {
    code: '1103', // nft 余额不足
    message: '{{assetType}} balanceOf insufficient order quantity  {{orderQuantity}} owner quantity {{ownerQuantity}}!'
  },
  {
    code: '1104', // ERC20，ETH 余额为0
    message: 'Insufficient {{assetType}} balance'
    // messageCN：'{{assetType}}币种余额为0'
  },
  {
    code: '1106',
    message: 'ERC721TransferProxy NFTs getApproved is false '
  },
  {
    code: '1108',
    message: '{{schemaName}} NFTs isApproved is false {{tokenId}} '
  },
  {
    code: '1201',
    message: 'Order: buy.basePrice to be greater than sell.basePrice!'
  },
  {
    code: '1202',
    message: 'Order can match false'
  },
  {
    code: '1203',
    message: 'Order validateOrder false '
  },
  {
    code: '1204',
    message: 'Buy order payment Token cannot be ETH '
  },
  {
    code: '1205',
    message: 'Order parameter false '
  },
  {
    code: '1206', // Erc721..
    message: '{{assetType}} asset does not support '
  },
  {
    code: '1207', // buy sell The order has been filled or cancelled
    message: '{{orderSide}} Order cancelledOrFinalized false '
  },
  {
    code: '1208', // dataToCall,target,replacementPattern
    message: 'CheckDataToCall {{part}} error '
  },
  {
    code: '1209', // 和 schemas 地址不一致
    message: '{{assetType}} asset address {{address}} not support  '
  },
  {
    code: '1211', // ElementShareAsset order uri 和 order version 中返回的 uri 不一致
    message: 'The ElementShareAsset Order URI does not match the URI returned in Order Version '
  },
  {
    code: '1212', // ElementShareAsset  tokenId 的暂时无法交易
    message: 'The ElementShareAsset TokenID cannot be traded for the time being '
  },
  {
    code: '1213', //  取消完成 Orders were cancelled in bulk via incrementNonce
    message: 'The order has been filled or cancelled'
  },
  {
    code: '2001',
    message: '{{funcName}} RPC send request error {{stack}} {{msg}}'
  },
  {
    code: '2002',
    message: '{{funcName}} RPC call request error {{stack}}'
  },
  {
    code: '2003',
    message: '{{funcName}} RPC web3 request error {{stack}}'
  },
  {
    code: '2004',
    message: '{{funcName}} RPC execution error {{stack}}'
  },
  {
    code: '4001',
    message: 'MetaMask Error '
  }
]

function render(template: string, context: Record<string, unknown>) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return template.replace(/\{\{(.*?)\}\}/g, (match, key) => context[key.trim()])
}

// const template = "{{name   }}很厉name害，才{{age   }}岁";
// const context = { name: "jawil", age: "15" };
// console.log(render(template, context));

export class ElementError extends Error {
  public code: string
  public data: any
  public context: any

  constructor(err: CustomError) {
    const _err: CustomError | undefined = ErrorCodes.find((val) => val.code == err.code)

    if (Number(_err?.code) > 1000) {
      const message = err.context && _err?.message ? render(_err.message, err.context) : _err?.message
      super(message)
    } else {
      if (_err?.code == '1000') {
        const message = err.message || ''
        super(message + '-' + _err?.message)
      } else {
        super('undefined code!')
      }
    }
    this.code = err.code.toString()
    this.data = err.data
    this.context = err.context
  }
}
//
// try {
//   throw new ElementError({ code: '2003', context: { funcName: 'funcName', stack: 'funcName stack' } })
// } catch (e) {
//   console.log('ll', e)
// }
