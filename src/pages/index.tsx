import { useState } from 'react';
import './index.less'
import { motion, AnimatePresence } from "framer-motion"

import 'rc-texty/assets/index.css'
import TextyAnim from 'rc-texty'
import { isBitget, isCoin98, isCoinbaseWallet, isGate, isMetaMask, isOkxWallet, isTokenPocket, isTrustWallet } from '@/Contract/customWallets/common';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function HomePage() {

  const {address} = useAccount()
  console.log('address===',address)



  async function onDisConnectWallet(){
  }

  async function onConnectMetaMask(){
    if (isMetaMask()){
      let accounts = await window.ethereum.request({  method: "eth_requestAccounts" })
      console.log('accounts===',accounts)
      // 刷新后可以自动获取钱包地址
      localStorage.setItem('wagmi.injected.shimDisconnect', "1")
      // 链接钱包后，useAccount 不会自动获取地址

    }else {
      console.error('当前没有安装 MetaMask ！！！')
    }
  }
  async function onConnectOKXWallet(){
    if (isOkxWallet()){
      let accounts = await window.okexchain.request({ method: 'eth_requestAccounts' });
      console.log('accounts===',accounts)
      localStorage.setItem('wagmi.injected.shimDisconnect', "1")
      // 链接钱包后，useAccount 不会自动获取地址
    }else {
      console.error('当前没有安装 OKXWallet ！！！')
    }
  }


  async function switchChains(){
    try {
      await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xf00" }],
      });
  } catch (switchError:any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
          try {
              await ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                      {
                          chainId: "0xf00",
                          chainName: "...",
                          rpcUrls: ["https://..."] /* ... */,
                      },
                  ],
              });
          } catch (addError) {
              // handle "add" error
          }
      }
      // handle other "switch" errors
  }
  }
  return (
    <div className='mainView'>
      <div className='mainContent'>
        <div className='button'>{address}</div>

        <div className='button' onClick={onDisConnectWallet}>断开钱包链接</div>
        <div className='button' onClick={onConnectMetaMask}>MetaMask</div>
        <div className='button' onClick={onConnectOKXWallet}>OkxWallet</div>
      </div>
    </div>
  );
}
export async function clientLoader() {
  const data = await fetch('/api/data');
  return [1,2,3];
}