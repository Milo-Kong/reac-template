import './index.less'
import React, { useState } from "react";
import { motion } from "framer-motion";
import { getLocale, setLocale } from 'umi';
import LocalsLanaugae from '@/locales';

const Language = React.memo(()=>{
  const [open,setOpen] = useState(false)
  const language = getLocale()

  function onChooseLanguage(lan:string){
    setLocale(lan,false)
    setOpen(!open)
  }

  return <div className='languageView'>
    <motion.div
      className='languageButton'
      whileTap={{scale:0.97,opacity:0.9}}
      whileHover={{scale:1.01,opacity:1}}
      onClick={()=>setOpen(!open)}
    >
      {LocalsLanaugae[language] && LocalsLanaugae[language].title}
    </motion.div>
    <motion.div
      animate={open ? 'open' : 'close'}
      className='languageShowView' variants={{
      open:{
        opacity:1,
        scaleX:1,
      },
      close:{
        opacity:0,
        scaleX:0
      }
    }}>
      {
        Object.keys(LocalsLanaugae).map((item:string,index:number)=>{
          return <motion.div
            key={'languageItem_' + item}
            className='languageShowItemView'
            onClick={()=>onChooseLanguage(item)}
            variants={{
              open:{
                opacity:1,
                x:0,
                transition:{
                  delay:0.1 * (index + 1)
                }
              },
              close:{
                opacity:0,
                x:-50
              }
            }}
          >
            {LocalsLanaugae[item].title}
          </motion.div>
        })
      }
    </motion.div>
  </div>
},(pre:any,nex:any)=>true)
export default Language