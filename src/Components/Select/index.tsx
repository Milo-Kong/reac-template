import './index.less'
import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

export interface SelectProps {
  title:string,
  key:string
}
const Select = React.memo(({
  titles,
  onSelect
}:{
  titles:SelectProps[],
  onSelect:(params:SelectProps)=>void
})=>{
  const [open,setOpen] = useState(false)
  const [selectInfo,setSelectInfo] = useState<SelectProps>(titles[0])
  console.log('Select===')

  useEffect(()=>{
    if (titles){
      setSelectInfo(titles[0])
    }
  },[titles])
  function onChoose(params:SelectProps){
    setOpen(!open)
    setSelectInfo(params)
    onSelect && onSelect(params)
  }

  return <div className='selectView'>
    <motion.div
      className='selectButton'
      whileTap={{scale:0.97,opacity:0.9}}
      whileHover={{scale:1.01,opacity:1}}
      onClick={()=>setOpen(!open)}
    >
      {selectInfo?.title}
    </motion.div>
    <motion.div
      animate={open ? 'open' : 'close'}
      className='selectShowView' variants={{
      open:{
        opacity:1,
        scaleY:1,
      },
      close:{
        opacity:0,
        scaleY:0
      }
    }}>
      {
        titles && titles.map((item:SelectProps,index:number)=>{
          return <motion.div
            onClick={()=>onChoose(item)}
            transition={{delay:0.1 * (index + 1)}}
            variants={{
              open:{
                opacity:1,
                y:0
              },
              close:{
                opacity:0,
                y:40
              }
            }}
            className='selectShowItemView'
            key={'selectItemView' + index}>
            Item {item.title}
          </motion.div>
        })
      }
    </motion.div>
  </div>
},(pre:any,nex:any)=>JSON.stringify(pre.titles) == JSON.stringify(nex.titles))
export default Select