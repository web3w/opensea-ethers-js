import {Button, Radio, Space, Table} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {Context} from '../AppContext'
import "./index.css"


export function UserOrderList(props) {
    const {eleSDK} = useContext(Context)
    const [dataSource, setDataSource] = useState([])
    const columns = [
        {
            title: 'name',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
        },
        {
            title: 'address',
            dataIndex: 'address',
            key: 'address',
            ellipsis: true,
        },
        {
            title: 'Price',
            dataIndex: 'priceBase',
            key: 'priceBase',
        },
        {
            title: 'Standard',
            dataIndex: 'standard',
            key: 'standard',
        },
    ];

    useEffect(() => {
        async function fetchData() {
            const list = await eleSDK.elementApi.getAccountOrders()
            console.log(list.edges.totalCount)
            let collections = []
            for (const edge of list.edges) {
                const {node} = edge
                const {asset, quantity, standard, metadata, maker, expirationTime, priceUSD} = node
                const {schema} = metadata
                const {chain, contractAddress, name, tokenId} = asset
                console.log(`name ${name} chain ${chain} qty ${quantity}  standard ${standard}`)
                let collection = collections.find(val => val.address == contractAddress)
                if (!collection) {
                    collection = {
                        key: "key_" + contractAddress,
                        name: schema + '(' + name + ')',
                        address: contractAddress,
                        children: []
                    }
                    collections.push(collection)
                }

                collection.children.push({
                    key: expirationTime,
                    name: tokenId,
                    address: maker,
                    priceBase: priceUSD,
                    standard
                })

            }
            console.log(collections)
            setDataSource(collections)
        }

        fetchData();
    }, [setDataSource])

    return (<div style={{padding: 24, minHeight: 360}}>
        <Table dataSource={dataSource} columns={columns}/>
    </div>)
}
