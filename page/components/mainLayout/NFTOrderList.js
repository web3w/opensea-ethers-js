import {Button, Modal, Radio, Space, Table} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {Context} from '../AppContext'
import "./index.css"
import {OrderType} from "web3-wallets";

// const {nftOrder} = require("./config.json")
import {nftOrder} from './config'
import {CreateOrderForm} from "./CreateOrderForm";

const {data, columns} = nftOrder

export function NFTOrderList(props) {
    const {eleSDK, wallet} = useContext(Context)
    const [dataSource, setDataSource] = useState([])
    const [openseaData, setOpenseaData] = useState([])

    const account = wallet.walletProvider.address
    const [createOrderVisible, setCreateOrderVisible] = useState(false);
    const [selectOrder, setSelectOrder] = useState();

    const showModal = async (record) => {
        setCreateOrderVisible(true)
        console.log('showModal', record)

        debugger
        const owner = await wallet.userAccount.getERC721OwnerOf(record.assetAddress, record.name)
        debugger
        record['owner'] = owner
        setSelectOrder(record)
    }

    const setModal = (visible) => {
        setCreateOrderVisible(visible)
    }

    const postOrder = (visible) => {

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
            const thirdStandards = ['element-ex-v3', 'opensea-wyv']
            for (let nfts of data) {
                const {children, address} = nfts
                for (let asset of children) {
                    asset['assetAddress'] = address
                    const {name} = asset
                    const params = {
                        tokenId: name,
                        assetContractAddress: address,
                        orderType: OrderType.Sell,
                        thirdStandards
                    }
                    const list = await eleSDK.openseaApi.getOrders(params)
                    asset.children = []
                    for (const edge of list.edges) {
                        const {metadata, quantity, side, listingTime, priceUSD, maker, standard, id} = edge.node
                        asset.children.push({
                            standard: standard || 'element-wyn',
                            quantity,
                            side,
                            priceUSD: priceUSD.toString(),
                            key: id,
                            address: maker,
                            name: id
                        })
                    }

                    // debugger
                    // const openseaOrders = await eleSDK.openseaApi.getOrders(params)
                    //
                    // for (const opensea of openseaOrders) {
                    //     debugger
                    //     const {metadata, quantity, side, listingTime, priceUSD, maker, standard, id} = opensea
                    //     asset.children.push({
                    //         standard: standard || 'element-wyn',
                    //         quantity,
                    //         side,
                    //         priceUSD: priceUSD.toString(),
                    //         key: id,
                    //         address: maker,
                    //         name: id
                    //     })
                    // }

                    // openseaData
                }
            }
            console.log(data)
            setDataSource(data)
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
