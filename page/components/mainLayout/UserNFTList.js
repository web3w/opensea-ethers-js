import {Button, Radio, Space, Table} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {Context} from '../AppContext'
import "./index.css"


export function UserNFTList(props) {
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
            const list = await eleSDK.elementApi.getUserAssetsList()

            console.log(list.totalCount)
            let collections = []
            for (const edge of list.edges) {
                const {asset} = edge.node
                if (asset == null) continue
                const {tokenType,name,contractAddress,tokenId,ownedQuantity, paymentTokens} = asset
                console.log(asset)
                console.log(`name ${asset.name} chainId ${Number(asset.chainId)}  tokenType ${asset.tokenType} royalty ${asset.collection.royalty}`)
                let collection = collections.find(val => val.address == contractAddress)
                if (!collection) {
                    collection = {
                        key: "key_" + contractAddress,
                        name: tokenType + '(' + name + ')',
                        address: contractAddress,
                        children: []
                    }
                    collections.push(collection)
                }

                collection.children.push({
                    key: contractAddress+tokenId,
                    name: tokenId,
                    address: contractAddress,
                    priceBase: ownedQuantity,
                    standard:""
                })
            }
            setDataSource(collections)
        }

        fetchData();
    }, [])

    return (<div style={{padding: 24, minHeight: 360}}>
        <Table dataSource={dataSource} columns={columns}/>
    </div>)
}
