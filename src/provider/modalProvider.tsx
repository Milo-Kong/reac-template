import React, { createContext, ReactElement, useContext, useState } from "react";
import styled from "styled-components";
import { useMedia } from "use-media";

interface ModalConfig {
  style: object,
  onBgClick?: Function
}
const ModalContext = createContext({
  show: (modalRender: ReactElement, config?: ModalConfig) => { },
  hidden: () => { }
})
export function useModalContext() {
  return useContext(ModalContext)
}
export default function ModalProvider({ children }: any) {
  const [visible, setVisible] = useState(false)
  const [configs, setConfigs] = useState<ModalConfig>()

  const [modalRender, setModalRender] = useState<ReactElement>()
  return <ModalContext.Provider value={{
    show: (modalRender: ReactElement, config?: ModalConfig) => {
      setVisible(true)
      setModalRender(modalRender)
      if (config) {
        setConfigs(config || {})
      }
    },
    hidden: () => {
      setVisible(false)
      setModalRender(<div />)
    }
  }}>
    {children}
    <Modal onBgClick={configs?.onBgClick} style={configs?.style || {}} visible={visible} modalRender={modalRender} />
  </ModalContext.Provider>
}
function Modal({ visible, modalRender, style, onBgClick }: any) {
  const isMobile = useMedia({ maxWidth: '768px' })
  if (!visible) {
    return null
  }
  return <ModalView style={style} className="animate__animated animate__fadeIn animate__faster">
    <BgView onClick={onBgClick} />
    <ContentView className={isMobile ? "animate__animated animate__slideInUp animate__faster" : "animate__animated animate__fadeIn animate__faster"}>
      {modalRender}
    </ContentView>
  </ModalView>
}
const ContentView = styled.div`
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    justify-content:flex-end;
    align-items:center;
    display: flex;
    flex-direction: column;
  };
  width: fit-content;
`
const BgView = styled.div`
  cursor:pointer;
  position:fixed;
  top:0;
  bottom:0;
  left:0;
  right:0;
`
const ModalView = styled.div`
  position:fixed;
  top:0;
  bottom:0;
  left:0;
  right:0;
  z-index:101;
  display:flex;
  flex-direction:column;
  @media (max-width: 768px) {
    padding-left:0px;
    padding-top:0px;
    justify-content:flex-end;
    align-items:center;
  };
  justify-content:center;
  align-items:center;
  background-color:rgba(0,0,0,0.3);
`