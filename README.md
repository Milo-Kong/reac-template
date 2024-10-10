# 加载SVG
```
import SmileUrl, { ReactComponent as SvgSmile } from '@/assets/svg/Aptos.svg'
<img src={SmileUrl} className='svg'/>
.svg {
  width:10rem;
  height:10rem;
  background-color: red;
}
```

# 根据地址生成头像
```
import multiavatar from '@multiavatar/multiavatar/esm'
let svgCode = multiavatar('Binx Bond')
<div className={'svg'} dangerouslySetInnerHTML={{ __html: SvgCode }}></div>
```

# loading 按钮
```
import LoadingButton, { LoadingButtonIcon, LoadingButtonOpacity, LoadingButtonRotate, LoadingButtonScale } from '@/Components/LoadingButton';

<LoadingButton loading={true}>loadingButton</LoadingButton>
<LoadingButtonScale loading={true}>loadingButton</LoadingButtonScale>
<LoadingButtonOpacity loading={true}>loadingButton</LoadingButtonOpacity>
<LoadingButtonRotate loading={true}>loadingButton</LoadingButtonRotate>
<div>
  {1==1 && <LoadingButtonIcon/>} loadingButton
</div>

```
# 数据请求时，页面文本显示
```
import LoadingRow from '@/Components/LoadingRow';
<LoadingRow width={20}/>
```
# toast 提示框 方法一
```
import { ToastError, ToastInfo, ToastSuccess, ToastWarning } from '@/Components/Toast';

ToastSuccess('success')
ToastError('error')
ToastInfo('info'),
ToastWarning('warning')
```

# toast  提示框  方法二（推荐）
```
根目录设置
import { ToastContainer, toast } from 'react-toastify';
<div>
  <button onClick={notify}>Notify!</button>
  <ToastContainer /> 放在最底部
</div>

const notifyInfo = () => toast.info("这是提示信息");
const notifySuccess = () => toast.success("这是成功信息");
const notifyError = () => toast.error("这是错误信息");
const notifyWarning = () => toast.warn("这是警告信息");
const notifyDefault = () => toast("这是默认信息");

```

# 发送交易时弹出loading
```
import { TransLoadingConfirm, TransLoadingError, TransLoadingPending, TransLoadingSuccess } from '@/Components/TransactionLoading';

TransLoadingConfirm('confirm')
TransLoadingPending('pending',56)
TransLoadingSuccess('hash',56)
TransLoadingError('error','hash',56)
```

# 倒计时
```
import Countdown, {zeroPad} from "react-countdown";
<Countdown date={time} renderer={renderer} />
const renderer = ({ days,hours, minutes, seconds, completed }:any) => {
  if (completed) {
  } else {
    return <span>{zeroPad(days,2)} {zeroPad(hours,2)}:{zeroPad(minutes,2)}:{zeroPad(seconds,2)}</span>
  }
};
```

# 添加新的合约 例如Abc.json
```
1.将Abc.json文件拷入 `src/ABI` 文件夹下
2.将地址写入 `Contract/addresses.ts`中
3.执行`yarn typechain:build`
4.`hooks/useContract.ts`中，导入Abc、Abc.json
import { Abc } from '@/ABI/typechain';
import ABC_ABI from "@/ABI/Abc.json";
底部创建合约对象
export const useAbcContract = createDynamicContract<Abc>(ABC_ABI);
5.使用
const contract = useAbcContract(ABC_ADDRESSSES);
```

# 从合约读取数据
```
目录：Contract/index.ts

export function useUserInfo(){
  const {address} = useAccount()
  const {chain} = useNetwork()
  const networkId = chain?.id

  // useN2RelationContract  目录：hooks/useContract.ts
  const N2RelationContract = useN2RelationContract(N2Relation_ADDRESSSES)

  async function fetchData(){

    if (!address || !N2RelationContract){
      return
    }

    const vip = await N2RelationContract.nftvip(address)
    return {
      vip:vipString,
    }
  }
  return useQuery(["useUserInfo" + address],fetchData,{
    refetchInterval: RefreshConfig.refreshInterval,
    enabled:!!address && !!N2RelationContract,
  })
}

使用
const userInfo = useUserInfo()
userInfo.isLoading   userInfo.data?.vip

{userInfo.isLoading ? <LoadingRow width={20}/> : <div>userInfo.data?.vip</div>}

```
# 调用合约方法
```
import { useSendTransaction } from '@/Contract'
import { useN2FTContract } from '@/hooks/useContract'
import { N2NFT_ADDRESSSES, USDT_ADDRESSSES } from '@/Contract/addresses'


const sendTransaction = useSendTransaction()
const N2FTContract = useN2FTContract(N2NFT_ADDRESSSES)

// 需要调合约方法扣除U的，需要判断是否授权了代币给合约
// 比如 购买NFT(需要扣除钱包的USDT),需要判断授权状态
// 代币地址，合约地址，扣除代币的数量
const [approveStatus,approved] = useApprove(USDT_ADDRESSSES,N2NFT_ADDRESSSES,price)

// 比如领取奖励，不需要扣除代币，则不需要判断授权状态

function onMint(){
   if (!N2FTContract){
      return
    }
    // 判断时候授权，如果没有，则重新授权
    if (approveStatus != ApprovalState.APPROVED){
      approved && approved()
      return
    }
    sendTransaction.mutate({
      title:'Mint',
      func:N2FTContract.Mint, // 合约方法名称
      args:[data.id],// 合约方法参数[args1,args2,...]，
      onSuccess:()=>{
        // 合约调用成功
      },
      onError:()=>{
        // 合约调用成功
      }
    })
}
```

# 顶部页面滚动进度条
```
import { motion, useScroll, useSpring } from "framer-motion"

const { scrollYProgress } = useScroll();
const scaleX = useSpring(scrollYProgress, {
  stiffness: 100,
  damping: 30,
  restDelta: 0.001
});
<motion.div className='progress' style={{ scaleX }} />
.progress {
  top: 0;
  left: 0;
  right: 0;
  height: 2rem;
  background: red;
  transform-origin: 0%;
  position: fixed;
}
```

# select 选择框
https://codesandbox.io/p/sandbox/framer-motion-variants-rj7ks0?file=%2Fsrc%2FApp.tsx%3A16%2C1
```
import Select, {SelectProps} from '@/Components/Select';
const titles1:any = [
  {
    title:'Item 1',
    key:'0'
  },
  {
    title:'Item 2',
    key:'1'
  },
]
const [selectInfo,setSelectInfo] = useState<SelectProps>()
<Select
  onSelect={(info:SelectProps)=>{
    console.log('Select info==',info)
    setSelectInfo(info)
  }}
  titles={titles}/>

```

# 手机端菜单按钮弹出菜单栏
https://codesandbox.io/p/sandbox/framer-motion-side-menu-mx2rw?file=%2Ftsconfig.json
```
<PhoneMenu/>
```

# graph 请求
```
import { GRAPH_XXX } from '@/API/graph'
import { useQuery as useApolloQuery } from '@apollo/client';

const { loading, error, data, refetch } = useApolloQuery(GRAPH_XXX,{
  variables:{
    orderBy:'blockNumber', // 参数1
    orderDirection:'asc' // 参数2
  },
  pollInterval:30 * 1000 // 30s 轮询
});

```

# 点击放大图片
```
import { PhotoProvider, PhotoView } from 'react-photo-view';

export default function MyComponent() {
  return (
    <PhotoProvider>
      <div className="foo">
        {images.map((item, index) => (
          <PhotoView key={index} src={item}>
            <img src={item} alt="" />
          </PhotoView>
        ))}
      </div>
    </PhotoProvider>
  );
}
```

# 可在任何 HTML 元素上提供滑动行为。支持鼠标和触摸事件。
```
import {useSlider} from 'react-use';
const ref = useRef(null);
const sliderInfo = useSlider(ref);

<div ref={ref} style={{ position: 'relative',width:'100%',height:50,background:'yellow' }}>
  <p style={{ textAlign: 'center', color: sliderInfo.isSliding ? 'red' : 'green' }}>
    {Math.round(sliderInfo.value * 100)}%
  </p>
</div>
```

# 获取组件高度
```
//@ts-ignore
import {ReactHeight} from 'react-height';

<ReactHeight onHeightReady={(height:number) => console.log(height)}>
  <div ref={ref} style={{ position: 'relative',width:'100%',height:50,background:'yellow' }}>

  </div>
</ReactHeight>

```

# emailjs  用于团队邮箱给用户邮箱发邮件
```
使用功能
1.用户在官网上填写邮箱及其他信息，点击提交按钮，会把用户填写的信息上传服务器（接口上传）
2.然后官网邮箱会给填写的邮箱地址发送回执邮件

步骤：
1.使用团队邮箱注册emailjs
2.创建 Email Services
3.创建 Email Templates，绑定团队邮箱，编辑团队给用户邮箱发送的邮箱格式，{{xxx}} ,xxx要和代码中的一一对应


import emailjs from '@emailjs/browser';

<form ref={form} onSubmit={sendEmail}>
  <label>Name</label>
  <input type="text" name="user_name" /> // user_name 和 Email Templates 对应
  <label>Email</label>
  <input type="email" name="user_email" /> // user_email 和 Email Templates 对应
  <label>Message</label>
  <textarea name="message" /> // message 和 Email Templates 对应
  <input type="submit" value="Send" />
</form>

const sendEmail = (e:any) => {
  e.preventDefault();
  emailjs.sendForm('service_801n5um', 'template_j9pfsyg', form.current, '0ZyprY1OYCKKMxhEx')
    .then((result) => {
        console.log(result.text);
    }, (error) => {
        console.log(error.text);
    });
};

```

# numeral 处理数字库
http://numeraljs.com/
```
// 每三位一个分割，保留4位小数
const a = numeral(10000).format('0,0.0000') // 10,000.0000
console.log('a=',a)

// 每三位一个分割
const b = numeral(10000).format('0,0') // 10,000
console.log('b=',b)

// 百分比转化
const c = numeral(0.87).format('0%') // 87%
console.log('c=',c)

// 百分比转化 四舍五入
const d = numeral(0.87456).format('0.00%') // 87.46%
console.log('d=',d)

```

# 监听合约事件
```

import { publicClient } from '@/provider/Web3ModalProvider';
import { parseAbiItem } from 'viem'

const isOn = useRef(false)

useEffect(()=>{
  if (isOn.current)return
  console.log('--------------')
  const unwatch = publicClient.watchEvent({
    address: '0x2F295157735f9D7C53b2bE8Ff58F47AC63666861',
    event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'), 
    onLogs: logs => console.log('Transfer',logs) // logs是数组 取第一个元素
  })
  const unwatch1 = publicClient.watchEvent({
    address: '0x2F295157735f9D7C53b2bE8Ff58F47AC63666861',
    event: parseAbiItem('event MintDOVArt(address account, uint256 _tokenID)'), 
    onLogs: logs => console.log('MintDOVArt==',logs)
  })

  isOn.current = true

  return ()=>{
    unwatch()
    unwatch1()
  }
},[])


logs = [
  {
    address: "0x2f295157735f9d7c53b2be8ff58f47ac63666861",
    args: {
      account: "0xa3b58e476c72f18C7dC6619a8c6C03076085abf1",
      _tokenID: 8n
    }
    blockHash: "0xb526fb8ccde4db45d2ef1b46edec2d4dde4ed9b042b9ca5f54ce6d61debe12d3"
    blockNumber: 35214122n
    data: 
    "0x000000000000000000000000a3b58e476c72f18c7dc6619a8c6c03076085abf10000000000000000000000000000000000000000000000000000000000000008"
    eventName: "MintDOVArt"
    logIndex: 222
    removed: false
    topics: ['0x31e6b373451b732d81abf79d72d2db64507a5fcc2c3cf77098d8c949c044cb93']
    transactionHash: "0xbe80012f60485eed7a7ac579c1fab859fa5c950ad44c34073e294f3fdbdf30e7"
    transactionIndex: 97
  }
]

```

# 监听合约事件
```
import { useWatchContractEvent } from 'wagmi'
import { abi } from './abi'

function App() {
  useWatchContractEvent({
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    abi,
    eventName: 'Transfer',
    onLogs(logs) {
      console.log('New logs!', logs)
    },
  })
}
```

# 监听合约事件
```
import { publicClient } from './client'
import { wagmiAbi } from './abi'

const unwatch = publicClient.watchContractEvent({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: wagmiAbi,
  eventName: 'Transfer',
  onLogs: logs => console.log(logs)
})

```

# 钱包签名
```
import { useSignMessage } from 'wagmi';
const { signMessage } = useSignMessage()
function signMsg(){
  signMessage({message:'hello world'})
}
```

# 切换链
```
import { useSwitchChain } from 'wagmi'
const { chains, switchChain } = useSwitchChain()
switchChain({ chainId: chain.id })

```

# 更换淘宝源
`npm config set registry https://registry.npmmirror.com/`

# 循环滚动
`react-fast-marquee`

# 骨架屏
```
import Skeletons, { SkeletonsText, SkeletonsImage } from '@/Components/Skeletons';
<Skeletons className='Skeletons'/>
<Skeletons className='SkeletonsAvatar'/>
<SkeletonsText className='SkeletonsText' count={4} textClassName={'SkeletonsTextSub'}/>
<SkeletonsImage className='SkeletonsImage'/>

.Skeletons {
  width: 100%;
  height:2rem;
}
.SkeletonsAvatar {
  width: 5rem;
  height:5rem;
  border-radius: 2.5rem;
  overflow: hidden;
}
.SkeletonsText {
  width:100rem
}
.SkeletonsTextSub {
  height: 3rem;
  margin: 0.5rem 0;
}
.SkeletonsImage {
  width: 300px;
  height: 200px;
}

```

# 高度从 0 到 auto 动画显示
```
const [height,setHeight] = useState(0)
const [show,setShow] = useState(false)

function onShow(){
   setShow(!show)
}
const ani = useSpring(
  {
    from: { height: show ? 0 : height, opacity:show?0 : 1},
    to: { height: show ? height :0, opacity:show?1 : 0},
    config:{
      duration:250
    }
  }
)
<animated.div className={`column aboutDesView`} style={ani}>
  <ReactHeight onHeightReady={(height:number) => setHeight(height)}>
    <div className='aboutDes'>{item.des}</div>
  </ReactHeight>
</animated.div>

```

# rc-texty 文字动画
https://motion.ant.design/components/texty-cn
```
import 'rc-texty/assets/index.css'
import TextyAnim from 'rc-texty'

<TextyAnim>text</TextyAnim>

```
# 数字从x 到 y 动画显示
`https://motion.ant.design/components/tween-one#components-tween-one-demo-children`


# framer-motion 动画库
```
import { motion, AnimatePresence } from "framer-motion"
const [isOpen, setIsOpen] = useState(false)
const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0.5, x: "-100%" },
}

<motion.div
  className='motionView'
  // 动画初始状态设置
  initial={{ x: 0, scale: 0.2 }}
  // 页面打开就会有动画，适合首屏显示，也适合点击按钮setState开始动画
  // animate 里面的值改变就会执行动画
  animate={{
    x: 70, // 左右动画
    y: 57, // 上下动画

    // scale: 0.8,// 缩放动画
    // rotate: 99,// 旋转动画

    scale: [1, 2, 2, 1, 1], // 关键帧动画
    rotate: [0, 0, 270, 270, 0],// 关键帧动画
    borderRadius: ["20%", "20%", "50%", "50%", "20%"],// 关键帧动画

  }}
  // 动画配置
  transition={{
    duration: 1, //动画时长 s
    ease:'easeInOut',
    x:{duration:3},// 为不同的动画设置不同的配置
    delay:4,// 延迟时间  s
    repeat:5,// 重复次数
    repeatType:'loop', // loop ：从头开始重复动画 reverse：在向前和向后播放之间交替 mirror: 开关from和to交替
  }}
  // 动画是否执行一次
  viewport={{ once: true }}
/>

<motion.div
  // 通过按钮控制动画
  className='motionView'
  animate={isOpen ? "open" : "closed"}
  variants={variants}
  onClick={()=>setIsOpen(!isOpen)}

  // 鼠标hover状态动画
  whileHover={{ scale: 1.5 }}
  // 鼠标点击状态动画
  whileTap={{scale:1.2}}
  // div将要显示在屏幕上的动画
  whileInView={{scale:0.7}}
/>

{/* 组件消失时的动画  exit 可定义组件消失的动画效果 */}
<AnimatePresence>
  {isOpen && <motion.div key='唯一的key' className='motionView'
    initial={{ opacity: 0, y: 200 }}
    animate={{ opacity: 1, y:0 }}
    exit={{ opacity: 0, y:200 }}
  />}
</AnimatePresence>
.motionView {
  width: 200px;
  height: 200px;
  border-radius: 20px;
  background: red;
  margin: 50px 0;
}
```

# 根据图片获取 blurDataURL
https://blurred.dev/



# lodash 处理 数组、字符串、对象、判空、类型转换、math计算

# react-loader-spinner 加载动画
https://mhnpd.github.io/react-loader-spinner/docs/intro

# react-reveal 动画入场效果
https://www.react-reveal.com/





# 链接钱包，先判断是否有插件或者应用程序，有的话直接连，没有的话通过walletconnect链接当前插件的钱包，
# 如果都没有则 通过 walletconnect 的二维码链接









# 实现功能
1. 钱包链接后自动获取钱包地址
2. 钱包链接后刷新页面自动连接
3. 切换链（增加链）
4. 扫码链接钱包逻辑












https://docs.walletconnect.com/

# metamask 开发文档
https://docs.metamask.io/wallet/quickstart/react/

# okx 开发文档
https://www.okx.com/cn/web3/build/docs/sdks/web-detect-okx-wallet

# bitget 开发文档
https://web3.bitget.com/zh-CN/docs/quick-start.html

# gate 开发文档
doc/Gate Wallet Integration Doc.pdf

# tp 开发文档
https://help.tokenpocket.pro/developer-cn/extension-wallet/guide/start

# TrustWallet 开发文档
https://developer.trustwallet.com/developer/develop-for-trust/browser-extension/evm