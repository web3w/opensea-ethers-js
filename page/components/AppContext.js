import React, {createContext, useEffect} from "react";
import {ProviderNames, Web3Wallets} from 'web3-wallets';
import {ElementSDK} from "../../src/index";
import {ExSchemaName} from "../../src/types/elementTypes";

const wallet = new Web3Wallets(ProviderNames.Metamask)
const eleSDK = new ElementSDK({
    chainId: wallet.walletProvider.chainId,
    address: wallet.walletProvider.address,
    exSchema: ExSchemaName.ElementExV3,
})

export const Context = createContext({wallet, eleSDK});
export const AppContext = ({children}) => {

    useEffect(() => {
        // setLoading(true);
        console.log("AppContext: wallet change")
    }, [wallet])
    return (<Context.Provider value={{wallet, eleSDK}}>
        {children}
    </Context.Provider>)
}
