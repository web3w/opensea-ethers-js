import React, {createContext, useEffect} from "react";
import {Web3Wallets} from 'web3-wallets';
import {OpenseaExAgent} from "../../src/openseaEx/openseaExAgent";

const wallet = new Web3Wallets('metamask')
const sdk = new OpenSeaSDK({
    chainId: wallet.walletProvider.chainId,
    address: wallet.walletProvider.address,
})

export const Context = createContext({wallet, sdk});
export const AppContext = ({children}) => {
    useEffect(() => {
        // setLoading(true);
        console.log("AppContext: wallet change")
    }, [wallet])
    return (<Context.Provider value={{wallet, sdk}}>
        {children}
    </Context.Provider>)
}
