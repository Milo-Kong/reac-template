
import { useState } from 'react';
import './index.less'
import { motion } from "framer-motion";

export default function PhoneMenu() {
  const [open,setOpen] = useState(false)

  function onOpen(){
    setOpen(!open)
  }
  return(
    <div className='menuView'>
      <div className='menuButton' onClick={onOpen}>
        <motion.div
          className='menuLine'
          animate={open ? 'open' : 'close'}
          variants={{
            open:{
              transform: 'rotate(35deg)',
              width:'5rem'
            },
            close:{
              transform: 'rotate(0deg)',
              width:'4rem'
            }
          }}
        />
        <motion.div
          className='menuLine'
          animate={open ? 'open' : 'close'}
          variants={{
            open:{
              opacity:0
            },
            close:{
              opacity:1
            }
          }}
        />
        <motion.div
          className='menuLine'
          animate={open ? 'open' : 'close'}
          variants={{
            open:{
              transform: 'rotate(-35deg)',
              width:'5rem'
            },
            close:{
              transform: 'rotate(0deg)',
              width:'4rem'
            }
          }}/>
      </div>
      <motion.div
        className='phomeContent'
        animate={open ? 'open' : 'close'}
        variants={{
          open:{
            scale:1,
            opacity:1
          },
          close:{
            scale:0,
            opacity:0
          }
        }}
      >
        {
          [1,2,3,4,5].map((item:any,index:number)=>{
            return <motion.div className='menuItemView' key={item}
              variants={{
                open:{
                  opacity:1,
                  y:0,
                  transition:{
                    delay:0.1 * (index + 1)
                  }
                },
                close:{
                  opacity:0,
                  y:50
                }
              }}
            >
              <div className='itemIcon'/>
              <span className='itemTitle'>Item {item}</span>
            </motion.div>
          })
        }
      </motion.div>
    </div>
  )
}