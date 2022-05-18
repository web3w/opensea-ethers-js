import {Button, Modal, Radio, Space, Table} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {Context} from '../AppContext'
import "./index.css"
import {OrderType,} from "web3-wallets";

import {nftOrder} from './config'

const {asset, columns} = nftOrder

async function getOrders() {
    const dataList = asset[chainId]
    for (let nfts of dataList) {
        const {children, address} = nfts
        for (let asset of children) {
            asset['assetAddress'] = address
            const {name} = asset
            const params = {
                token_id: name,
                asset_contract_address: address
            }
            const list = await eleSDK.openseaApi.getOrders(params)
            asset.children = []
            for (const edge of list) {
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
        const owner = await wallet.userAccount.getERC721OwnerOf(record.assetAddress, record.name)
        record['owner'] = owner
        setSelectOrder(record)
    }

    const setModal = (visible) => {
        setCreateOrderVisible(visible)
    }

    const postOrder = async (visible) => {
        const assets = [{
            asset_contract_addresses: selectOrder.assetAddress, //
            token_ids: selectOrder.name
        }]
        const foo = {assets}
        const asset = await eleSDK.openseaApi.getAssets(foo)
        const sellAsset = {
            tokenId: selectOrder.name,
            tokenAddress: selectOrder.assetAddress,
            schemaName: 'ERC721',
            collection: {
                elementSellerFeeBasisPoints: asset[0].dev_seller_fee_basis_points,
                transferFeeAddress: asset[0].payout_address
            }
        }
        debugger

        const sellParams = {
            asset: sellAsset,
            startAmount: 0.6
        }
        const order = await eleSDK.createSellOrder(sellParams)
        const orderStr = JSON.stringify(order)
        const list = await eleSDK.openseaApi.postSingedOrder(orderStr)
        console.log(list)
        // setCreateOrderVisible(false)
    }

    const getAssets = async () => {
        const dataList = asset[chainId]
        const assets = dataList.map(val => {
            return {
                asset_contract_addresses: val.address, //
                token_ids: val.children[0].name
            }
        })
        const foo = { assets}
        const list = await eleSDK.openseaApi.getAssets(foo)
        console.log(list)
    };

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
                debugger
                for (let asset of children) {
                    asset['assetAddress'] = address
                    const {name} = asset
                    const params = {
                        token_id: name,
                        asset_contract_address: address
                    }
                    const list = await eleSDK.openseaApi.getOrders(params)
                    asset.children = []
                    debugger
                    for (const order of list) {
                        const {metadata, quantity, side, listingTime, basePrice, maker} = order
                        asset.children.push({
                            tokenId: name,
                            tokenAddress: address,
                            order: order,
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
            <Button type="primary" onClick={getAssets}>
                GetAssets
            </Button>
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
