import { createRoot } from "react-dom/client";
import { TRANSACTION_LOADING_ELEMENT_ID } from "@/Common/define";
import { useState } from "react";
import { formatAccount } from "@/Common";
import { ChainID, getScanLink, getScanName } from "@/Contract/chains";
import Lottie from 'react-lottie';
import styles from './index.less'
import { useMedia } from "use-media";

import loading_confirm from '@/assets/lottlie/loading_confirm.json'
import loading_error from '@/assets/lottlie/loading_error.json'
import loading_pending from '@/assets/lottlie/loading_pending.json'
import loading_success from '@/assets/lottlie/loading_success.json'
import close_icon from '@/assets/svg/close.svg'

let showTransactionLoading:(props:TransactionLoadingProps)=>void
let hiddenTransactionLoading:()=>void


export enum TransLoadingType {
  confirm=0,
  pending=1,
  error=2,
  success=3
}

const LoadingConfig:any = {
  [TransLoadingType.confirm]:{
    icon:loading_confirm,
    color:"#FF8D3A",
    title: "Wait for transaction confirmation",
  },
  [TransLoadingType.pending]:{
    icon:loading_pending,
    color:"#62DCF7",
    title: "Transaction in progress",
  },
  [TransLoadingType.error]:{
    icon:loading_error,
    color:"#CF3E34",
    title: "Transaction failed",
  },
  [TransLoadingType.success]:{
    icon:loading_success,
    color:"#7FF89F",
    title: "Transaction successful",
  }
}

interface TransactionLoadingProps {
  type:TransLoadingType,
  message?:string,
  hash?:string,
  chainID?:ChainID
}
function TransactionLoading() {
  const [visible,setVisible] = useState(false)
  const [loadingAnimated,setLoadingAimated] = useState('animate__flipInX')
  const isMobile = useMedia({ maxWidth: '768px' })
  const [props,setProps] = useState<TransactionLoadingProps>()

  showTransactionLoading = (props:TransactionLoadingProps)=>{
    setLoadingAimated('animate__flipInX')
    setProps(props)
    setVisible(true)
  }
  hiddenTransactionLoading = onClose
  function onClose(){
    setLoadingAimated('animate__flipOutX')
    setTimeout(() => {
      setVisible(false)
    }, 500);
  }
  if(!visible){
      return null;
  }
  return(
    props && <div className={`${styles.loadingView} animate__animated ${loadingAnimated} animate__faster`}>
      <img className={styles.close} onClick={onClose} src={close_icon}/>
      <div className={styles.rowView}>
        <Lottie options={{
          loop: true,
          autoplay: true,
          animationData: LoadingConfig[props.type].icon,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
          }
        }} style={{width:isMobile?50:100,height:isMobile?50:100}}/>
        <span className={styles.title} style={{color:LoadingConfig[props.type].color}}>
          {LoadingConfig[props.type].title}
        </span>
      </div>
      <div className={styles.msgView}>
        {(props.type===TransLoadingType.confirm || props.type===TransLoadingType.error) && <span className={styles.msgDes}>
          {props.message}
        </span>}
        {(props.type===TransLoadingType.pending || props.type===TransLoadingType.success) && <span className={styles.msgDes}>
            Transaction Hash: {formatAccount(props.hash || props.message)}
          </span>}
        {(props.type!==TransLoadingType.confirm) && <span className={styles.msgViewon}
          onClick={()=>{
            window.open(getScanLink(props.chainID || 1,props.hash || props.message,"transaction"))
          }}>
          ViewOn {getScanName(props.chainID || 1)}
        </span>}
      </div>
    </div>
  )
}

export function TransactionLoadingInit(){
  const rootElement = document.getElementById('root')
  const tLoadingElement = document.createElement('div');
  if (rootElement && tLoadingElement){
    tLoadingElement.className = styles.transLoadingElement
    tLoadingElement.id = TRANSACTION_LOADING_ELEMENT_ID

    rootElement.appendChild(tLoadingElement)
    const rootDomNode = createRoot(tLoadingElement)
    rootDomNode.render(<TransactionLoading/>)
  }
}
export function TransLoadingConfirm(message:string){
  showTransactionLoading({type:TransLoadingType.confirm,message})
}
export function TransLoadingPending(hash:string,chainID:ChainID){
  showTransactionLoading({type:TransLoadingType.pending,hash,chainID})
}
export function TransLoadingSuccess(hash:string,chainID:ChainID){
  showTransactionLoading({type:TransLoadingType.success,hash,chainID})
}
export function TransLoadingError(message:string,hash:string,chainID:ChainID){
  showTransactionLoading({type:TransLoadingType.error,message,hash,chainID})
}