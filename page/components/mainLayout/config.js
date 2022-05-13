import React from "react";
import {Space, Tag} from "antd";

export const nftOrder = {
    'asset': {
        1: [
            {
                "name": "ERC721",
                "key": "721_1",
                "address": "0xb18380485f7ba9c23deb729bedd3a3499dbd4449",
                "children": [
                    {
                        "key": 1,
                        "name": "8306"
                    }
                ]
            },
            {
                "name": "ERC1155",
                "key": "1155_1",
                "address": "0x4fde78d3c8718f093f6eb3699e3ed8d091498df9",
                "children": [
                    {
                        "key": 11,
                        "name": "105886420831251411528890303004419979784764244768332317573040781521617833426945"
                    }
                ]
            }],
        4: [
            {
                "key": "1155_2",
                "name": "ERC1155",
                "address": "0x4cddbf865ee2a1a3711648bb192e285f290f7985",
                "children": [
                    {
                        "key": 12,
                        "name": "4676314080394472507455332797632474230665182066565445726959043747700191264868"
                    },
                    {
                        "key": 13,
                        "name": "105886420831251411528890303004419979784764244768332317573040781543608065982465"
                    }
                ]
            },
            {
                "name": "ERC721",
                "key": "721_2",
                "address": "0xb556f251eacbec4badbcddc4a146906f2c095bee",
                "children": [
                    {
                        "key": 12,
                        "name": "2"
                    },
                    {
                        "key": 13,
                        "name": "3"
                    }
                ]
            },
            {
                "name":
                    "ERC721",
                "key":
                    "721_1",
                "address":
                    "0x5fecbbbaf9f3126043a48a35eb2eb8667d469d53",
                "children":
                    [
                        {
                            "key": 11,
                            "name": "719455"
                        }
                    ]
            }
        ]
    },
    "data":
        [
            {
                "name": "ERC721",
                "key": "721_1",
                "address": "0x5fecbbbaf9f3126043a48a35eb2eb8667d469d53",
                "children": [
                    {
                        "key": 11,
                        "name": "719455"
                    }
                ]
            },
            {
                "name": "ERC721",
                "key": "721_2",
                "address": "0xaf1136d48a92d228a23352932a4ab229c5f0cb2c",
                "children": [
                    {
                        "key": 713,
                        "name": "2"
                    },
                    {
                        "key": 714,
                        "name": "3"
                    }
                ]
            },
            {
                "key": "1155_1",
                "name": "ERC1155",
                "address": "0x4cddbf865ee2a1a3711648bb192e285f290f7985",
                "children": [
                    {
                        "key": 12,
                        "name": "4676314080394472507455332797632474230665182066565445726959043747700191264868"
                    },
                    {
                        "key": 13,
                        "name": "105886420831251411528890303004419979784764244768332317573040781543608065982465"
                    }
                ]
            }
        ],
    "bscTestData":
        [
            {
                'type': 'ERC721',
                'address': '0x066561b3369fa33E56D58C3fcE621FF82B4Cdd3F',
                'tokenId': [1,]
            },
            {
                'type': 'ERC1155',
                'address': '0x8Dd87EA5724562027751527df4De4E0CC3d052b0',
                'tokenId': []
            },
            {
                'type': 'ERC20',
                'address': '0x066561b3369fa33E56D58C3fcE621FF82B4Cdd3F',
                'tokenId': []
            }
        ],
    "columns":
        [
            {
                "title": "name",
                "dataIndex": "name",
                "key": "name",
                "ellipsis": true
            },
            {
                "title": "address",
                "dataIndex": "address",
                "key": "address",
                "ellipsis": true
            },
            {
                "title": "PriceUSD",
                "dataIndex": "priceUSD",
                "key": "priceUSD"
            },
            {
                title: 'S',
                dataIndex: 'side',
                key: 'side',
                render: (text, record) => {
                    return <a>{text === 1 ? '卖' : text === 0 ? '买' : record?.children?.length}</a>
                },
                width: 40,
            },
            {
                "title": "Standard",
                "dataIndex": "standard",
                "key": "standard",
                render: (text, record) => {
                    // console.log('Standard', text, record)
                    const standards = []
                    if (record.children) {
                        console.log(record)
                        record.children.map(asset => {
                            let orders = asset.children
                            if (orders && orders.length > 0) {
                                orders.map(val => {
                                    if (val.standard && !standards.includes(val.standard)) {
                                        standards.push(val.standard)
                                    }
                                })
                            } else {
                                if (asset.standard && !standards.includes(asset.standard)) {
                                    standards.push(asset.standard)
                                }
                            }
                        })
                    } else if (record.standard) {
                        standards.push(record.standard)
                    }
                    return standards.map((val, index) => <Tag key={val + index} color={'geekblue'} c>{val}</Tag>)
                }
            }

        ]
}
