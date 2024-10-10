import styles from './styles.less'
import commonStyles from '../../Common/common.less'
import { autoWidthVW, formatAccount } from '@/Common';
import useTranslationLanguage from '@/hooks/useTranslationLanguage';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { connect,disconnect } from '@wagmi/core'
import { bsc } from 'viem/chains';
import { useAccount } from 'wagmi';
import { Drawer } from 'antd';
import { useState } from 'react';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { SafeConnector } from 'wagmi/connectors/safe'


export default function ConnectWallet() {
  const {open,close} = useWeb3Modal()
  const {address} = useAccount()
  function onConnect(){
    open && open()
    // 切换链
    // open({view: 'Account' | 'Connect' | 'Networks'})
  }
  async function onCustomWallet(){
    const connectInfo = await connect({
      connector:new InjectedConnector({
        chains: [bsc],
        options:{}
      })
    })
    console.log('链接钱包成功',connectInfo)
    // 重要，不使用open方法链接钱包的，刷新后不会自动连接，需加上这句话
    localStorage.setItem('wagmi.injected.shimDisconnect', "1")
  }
  async function onMetamask(){
    const connectInfo = await connect({
      connector:new MetaMaskConnector({
        chains: [bsc],
        options:{}
      })
    })
    console.log('链接钱包成功',connectInfo)
    // 重要，不使用open方法链接钱包的，刷新后不会自动连接，需加上这句话
    localStorage.setItem('wagmi.injected.shimDisconnect', "1")
  }

  /**
   *  const {open} = useWeb3Modal()
      const {switchNetwork} = useSwitchNetwork()
      切换网络  switchNetwork（chain.id）
   */

  const {t} = useTranslationLanguage()
  return <div className={`${commonStyles.row} ${styles.walletView}`} onClick={onConnect}>
    <img className={styles.walletIcon} src='/images/walleticon.png'/>
    <span className={styles.address}>{address ? formatAccount(address) : 'Connect Wallet'}</span>
  </div>
}