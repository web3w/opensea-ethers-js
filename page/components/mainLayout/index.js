import {message, Layout, Descriptions, Button, Drawer, Menu} from 'antd';
import React, {useState, useEffect, useContext} from "react";
import {DesktopOutlined, FileOutlined, PieChartOutlined,} from '@ant-design/icons';
import "./index.css"
import {Context} from "../AppContext";
import {NFTOrderList} from "./NFTOrderList";
import {UserOrderList} from "./UserOrderList";
import {UserNFTList} from "./UserNFTList";
import {OpenseaOrderList} from "./OpenseaOrderList";
// import {CreateOrderForm} from "./CreateOrderForm";

const {Header, Content, Footer, Sider} = Layout;

export function MainLayout() {
    const {wallet, eleSDK} = useContext(Context)
    const [collapsed, setCollapsed] = useState(false);

    const [drawerVisible, setDrawerVisible] = useState(false);


    const [selected, setSelected] = useState("OpenseaOrderList");
    const onCollapse = (value) => {
        setCollapsed(value);
    };
    useEffect(() => {

    }, [])

    const selectWallet = async (obj) => {
        if (obj.key) {
            setSelected(obj.key)
        }
    };


    const showDrawer = async () => {
        console.log(wallet)
        const {walletProvider} = wallet
        const {address, chainId} = walletProvider


        // setDrawerVisible(true);
        const rpcUrl = "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
        // const tokenBal = await sdk.getUserTokenBalance({tokenAddr: NULL_ADDRESS, decimals: 18, rpcUrl})
        const bal = await wallet.userAccount.getUserTokenBalance({
            tokenAddr: "0x44C73A7b3B286c78944aD79b2BBa0204916Cebca",
            decimals: 18,
            account: "0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401"
        })
        debugger
        console.log(bal)
    };

    const onClose = () => {
        setDrawerVisible(false)
    };


    const SupportWallet = ['OpenseaOrderList', 'WatchNFTs', "AccountOrders", "AccountNFTs"]
    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                <div className="logo">Element SDK</div>
                <Menu theme="dark" defaultSelectedKeys={['OpenseaOrderList']} mode="inline"
                      onClick={selectWallet}>
                    {
                        SupportWallet.map(val => (
                            <Menu.Item key={val} icon={<FileOutlined/>}>
                                {val}
                            </Menu.Item>
                        ))
                    }

                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{padding: 10}}>
                    {wallet.walletName && <Descriptions size="small" column={2}>
                        <Descriptions.Item label="Name">{wallet.walletName}</Descriptions.Item>
                        <Descriptions.Item label="ChainId">
                            <a>{wallet.walletProvider.chainId}</a>
                        </Descriptions.Item>
                        <Descriptions.Item label="Address">{wallet.walletProvider.address}</Descriptions.Item>
                        {wallet.walletProvider.peerMetaName &&
                        <Descriptions.Item
                            label="PeerMetaName">{wallet.walletProvider.peerMetaName}</Descriptions.Item>}
                    </Descriptions>}
                </Header>

                {selected == 'OpenseaOrderList' && <OpenseaOrderList/>}

                {selected == 'WatchNFTs' && <NFTOrderList/>}

                {selected == 'AccountOrders' && <UserOrderList/>}

                {selected == 'AccountNFTs' && <UserNFTList/>}

                <Footer>
                    <Button type="primary" onClick={showDrawer}>
                        Open drawer
                    </Button>
                </Footer>
            </Layout>

        </Layout>
        // </AppContext.Provider>
    )
}



