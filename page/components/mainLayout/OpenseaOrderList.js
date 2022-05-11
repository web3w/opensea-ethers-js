import {Button, Modal, Radio, Space, Table} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {Context} from '../AppContext'
import "./index.css"
import {ExSchemaName, OrderType, MakeOrderType} from "../../../src/types/elementTypes";

import {nftOrder} from './config'

const {asset, columns} = nftOrder

export function OpenseaOrderList(props) {
    const {eleSDK, wallet} = useContext(Context)
    const [dataSource, setDataSource] = useState([])

    const account = wallet.walletProvider.address
    const chainId = wallet.walletProvider.chainId
    const [createOrderVisible, setCreateOrderVisible] = useState(false);
    const [selectOrder, setSelectOrder] = useState();

    const showModal = async (record) => {
        setCreateOrderVisible(true)
        console.log('showModal', record)
        const owner = await eleSDK.userAccount.getERC721OwnerOf(record.assetAddress, record.name)
        record['owner'] = owner
        setSelectOrder(record)
    }

    const setModal = (visible) => {
        setCreateOrderVisible(visible)
    }

    const postOrder = async (visible) => {

        console.log(selectOrder)
        // {
        //     "key": 11,
        //     "name": "719455",
        //     "assetAddress": "0x5fecbbbaf9f3126043a48a35eb2eb8667d469d53",
        //     "children": [],
        //     "owner": "0xeA199722372dea9DF458dbb56be7721af117a9Bc"
        // }
        const sellAsset = {
            tokenId: selectOrder.name,
            tokenAddress: selectOrder.assetAddress,
            schemaName: 'ERC721',
            collection: {
                elementSellerFeeBasisPoints: 500,
                transferFeeAddress: "0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401"
            }
        }
        // paymentToken: sellEx.contracts.ETH,
        const expirationTime = parseInt((new Date().getTime() / 1000) + (60 * 60 * 24 * 10))
        //['No expiration_time was set, expiration_time must be within 6 months of order creation.']
        const sellParams = {
            asset: sellAsset,
            startAmount: 0.6,
            standard: ExSchemaName.OpenseaEx
        }
        const order = await eleSDK.createOrder(MakeOrderType.FixPriceOrder, sellParams)
        const orderStr = JSON.stringify(order)
        const list = await eleSDK.postOpenSeaOrder(orderStr)
        console.log(list)
        // setCreateOrderVisible(false)
    }

    useEffect(() => {
        console.log('useEffect')
        columns.push({
            "title": "Action",
            "key": "id",
            "fixed": 'right',
            "render": (text, record) => (
                <Space size="middle">
                    {record.name == "ERC721" || record.name == "ERC1155" ?
                        <a onClick={() => createOrder(record)}>GetApprove</a>
                        : record.address ? (record.address == account ?
                            <a onClick={() => createOrder(record)}>CancelOrder</a>
                            : <a onClick={() => createOrder(record)}>MatchOrder</a>)
                            : <a onClick={() => showModal(record)}> CreateOrder </a>}
                    {record.side == 1 && <a onClick={() => createOrder(record)}>Add</a>}
                </Space>
            )
        })

        async function fetchData() {
            const dataList = asset[chainId]
            for (let nfts of dataList) {
                const {children, address} = nfts
                for (let asset of children) {
                    asset['assetAddress'] = address
                    const {name} = asset
                    const params = {
                        tokenId: name,
                        assetContractAddress: address,
                        orderType: OrderType.All
                    }
                    // const list = await eleSDK.openseaApi.getOrders(params)
                    const infoList =[] //list.inforList
                    asset.children = []
                    for (const edge of infoList) {
                        debugger
                        const {metadata, quantity, side, listingTime, basePrice, maker} = edge
                        asset.children.push({
                            standard: 'OpenSea',
                            quantity,
                            side,
                            priceUSD: basePrice,
                            key: listingTime,
                            address: maker,
                            name: listingTime
                        })
                    }

                }
            }
            // console.log(data)
            setDataSource(dataList)
        }

        fetchData();
    }, [])

    const createOrder = async (obj) => {
        if (obj.key) {
            console.log(obj)
            alert(obj.key)
        }
    };
    return (
        <div style={{padding: 24, minHeight: 360}}>
            <Table dataSource={dataSource} columns={columns}/>
            OpenseaOrderList
            <Modal title="Basic Modal" visible={createOrderVisible}
                   onOk={() => postOrder(false)}
                   onCancel={() => setModal(false)}>
                <p>{selectOrder && selectOrder.assetAddress}</p>
                <p>{selectOrder && selectOrder.name}</p>
                <p>{selectOrder && selectOrder.owner}</p>
                <p>Some contents...</p>
            </Modal>
        </div>
    )
}
