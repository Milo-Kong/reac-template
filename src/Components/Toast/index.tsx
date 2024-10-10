import { createRoot } from "react-dom/client";
import { TOAST_ELEMENT_ID } from "@/Common/define";
import { useState } from "react";
import { useSpring, animated } from "react-spring";
import './index.less'

enum ToastType {
  success,
  warning,
  error,
  info
}
enum ToastAnimated {
  in,
  out
}
interface ToastPorps {
  type:ToastType,
  msg:string,
  duration?:number,
  eleKey:string,
  animation?:ToastAnimated
}
const ToastColors:Record<ToastType,string> = {
  [ToastType.success]:'#009c82',
  [ToastType.warning]:'#f5cb22',
  [ToastType.error]:'#EA3323',
  [ToastType.info]:'#0394f5',
}

function ToastChildren({item}:{item:ToastPorps}){
  const animated_type: any = useSpring({
    from:{ transform:item.animation == ToastAnimated.in ? 'translateY(-20px)' :'translateY(0px)',opacity:item.animation == ToastAnimated.in ? 0 : 1},
    to:{ transform: item.animation == ToastAnimated.in ? 'translateY(0px)' : 'translateY(-20px)',opacity:item.animation == ToastAnimated.in ? 1 : 0},
    config:{
      duration:250
    }
  })
  return <animated.div className={'toastView'} style={
    {
      ...animated_type
    }
  }>
    <div className={'leftLine'} style={{background:ToastColors[item.type]}}/>
    <span className={'title'} style={{color:ToastColors[item.type]}}>{item.msg}</span>
  </animated.div>
}


let showToast:(props:ToastPorps)=>void
function ToastView(){
  const [toastList,setToastList] = useState<ToastPorps[]>([])
  function removeToast(eleKey:string){
    setToastList((pre:ToastPorps[])=>{
      let tempList:ToastPorps[] = []
      pre.map((item:ToastPorps)=>{
        if (item.eleKey == eleKey){
          tempList.push({...item,animation:ToastAnimated.out})
        }else {
          tempList.push(item)
        }
      })
      return tempList
    })
    setTimeout(() => {
      setToastList((pre:ToastPorps[])=>{
        return pre.filter((item:ToastPorps)=>item.eleKey != eleKey)
      })
    }, 300);
  }

  showToast = (props:ToastPorps)=>{
    setToastList((pre:ToastPorps[])=>{
      const timeout = setTimeout(() => {
        clearTimeout(timeout)
        removeToast(props.eleKey)
      }, props.duration || 3000);
      return [...pre,{...props,animation:ToastAnimated.in}]
    })
  }


  return <div style={{
    display:'flex',
    flexDirection:'column'
  }}>
    {
      toastList.map((item:ToastPorps)=>{
        return <ToastChildren item={item} key={item.eleKey}/>
      })
    }
  </div>
}
function getKey(){
  return (Math.random()*100000).toFixed()
}



export function ToastInit(){
  const rootElement = document.getElementById('root')
  const toastElement = document.createElement('div');
  if (rootElement && toastElement){
    toastElement.className ='toastElement'
    toastElement.id = TOAST_ELEMENT_ID

    rootElement.appendChild(toastElement)
    const rootDomNode = createRoot(toastElement)
    rootDomNode.render(<ToastView/>)
  }
}
export function ToastSuccess(msg:string,config?:ToastPorps){
  showToast({type:ToastType.success,msg,eleKey:getKey(),...config})
}
export function ToastInfo(msg:string,config?:ToastPorps){
  showToast({type:ToastType.info,msg,eleKey:getKey(),...config})
}
export function ToastWarning(msg:string,config?:ToastPorps){
  showToast({type:ToastType.warning,msg,eleKey:getKey(),...config})
}
export function ToastError(msg:string,config?:ToastPorps){
  showToast({type:ToastType.error,msg,eleKey:getKey(),...config})
}
