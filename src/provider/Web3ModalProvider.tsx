import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { arbitrum, bsc, bscTestnet, optimism } from 'viem/chains'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { createPublicClient, createWalletClient, custom, http } from 'viem'

// https://cloud.walletconnect.com/app 申请
const projectId = '43adb2e2b831b897755cdf605794c361'

/**使用 web3modal 定义的链 */
const chains = [bsc]
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata: {
    name: 'My Website',
    description: 'My Website description',
    url: 'https://mywebsite.com',
    icons: ['https://avatars.mywebsite.com/']
  }
})
export const publicClient = createPublicClient({
  batch: {
    multicall: true,
  },
  chain:bsc,
  transport:http()
})

// 没有插件会报错
// export const walletClient = createWalletClient({
//   chain: bsc,
//   transport: custom(window.ethereum!)
// })

// /**自定义链 */
// const { chains, publicClient,webSocketPublicClient } = configureChains(
//   [MATCH_Chain],
//   [publicProvider()],
// )
// const wagmiConfig = createConfig({
//   autoConnect: true,
//   publicClient,
//   webSocketPublicClient,
//   connectors:[
//     new WalletConnectConnector({options:{projectId,showQrModal:false}}),
//     new InjectedConnector({ options: { shimDisconnect: true,name:'abc' } }),
//     new CoinbaseWalletConnector({ options: { appName: 'Wallets' } })
//   ]
// })

const connectorImages ={
  // coinbaseWallet: '/images/twitter.png',
  // browserWallet:'/images/twitter.png',
  // injected:'/images/star_2.png',
}

const customWallets = [
  {
    id: 'OKX',
    name: 'OKX Wallet',
    homepage: 'www.mycustomwallet.com', // Optional
    image_url: '/images/star_2.png', // Optional
    mobile_link: 'mobile_link', // Optional - Deeplink or universal
    desktop_link: 'desktop_link', // Optional - Deeplink
    webapp_link: 'webapp_link', // Optional
    app_store: 'app_store', // Optional
    play_store: 'play_store', // Optional
    injected: [
      {
        namespace: 'eip155',
        injected_id: 'isPLC'
      },
    ]
  },
  {
    id: 'TokenPocket',
    name: 'TokenPocket',
    homepage: 'www.mycustomwallet.com', // Optional
    image_url: '/images/star_2.png', // Optional
    mobile_link: 'mobile_link', // Optional - Deeplink or universal
    desktop_link: 'desktop_link', // Optional - Deeplink
    webapp_link: 'webapp_link', // Optional
    app_store: 'app_store', // Optional
    play_store: 'play_store', // Optional
    injected: [
      {
        namespace: 'eip155',
        injected_id: 'isTokenPocket'
      }
    ]
  },
  {
    id: 'TrustWallet',
    name: 'TrustWallet',
    homepage: 'www.mycustomwallet.com', // Optional
    image_url: '/images/star_2.png', // Optional
    mobile_link: 'mobile_link', // Optional - Deeplink or universal
    desktop_link: 'desktop_link', // Optional - Deeplink
    webapp_link: 'webapp_link', // Optional
    app_store: 'app_store', // Optional
    play_store: 'play_store', // Optional
    injected: [
      {
        namespace: 'eip155',
        injected_id: 'isTrustWallet'
      }
    ]
  },
  {
    id: 'Bitget Wallet',
    name: 'Bitget Wallet',
    homepage: 'www.mycustomwallet.com', // Optional
    image_url: '/images/star_2.png', // Optional
    mobile_link: 'mobile_link', // Optional - Deeplink or universal
    desktop_link: 'desktop_link', // Optional - Deeplink
    webapp_link: 'webapp_link', // Optional
    app_store: 'app_store', // Optional
    play_store: 'play_store', // Optional
    injected: [
      {
        namespace: 'eip155',
        injected_id: 'isBitKeep'
      }
    ]
  }
]

// https://explorer.walletconnect.com/?type=wallet
// 默认显示的钱包
const featuredWalletIds: any = [
  "38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662",// gitget
  "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709",// okx
  "20459438007b75f4f4acb98bf29aa3b800550309646d375da5fd4aac6c2a2c66",// tp
  "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96"//metamask
]

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  // customWallets,
  featuredWalletIds:featuredWalletIds,
  // themeMode: 'light',
  // themeVariables: {
  //   '--w3m-color-mix': '#ECB91A',
  //   '--w3m-color-mix-strength': 20
  // }
})

export default function Web3ModalProvider({ children }:any){
  return <WagmiConfig config={wagmiConfig}>
    {children}
  </WagmiConfig>
}