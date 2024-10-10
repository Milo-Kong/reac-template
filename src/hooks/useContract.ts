import { ERC721, ERC20, TestContact, DOVART } from '@/ABI/typechain';
import { useAccount,useNetwork } from 'wagmi';
import { Contract, InterfaceAbi, JsonRpcProvider, JsonRpcSigner, ethers} from "ethers"
import {useEffect, useMemo, useState} from "react";
import ERC20_ABI from "@/ABI/ERC20.json";
import ERC721_ABI from "@/ABI/ERC721.json";
import {AddressMap} from '@/Contract/addresses';
import { ChainID } from '@/Contract/chains';
import TestContact_ABI from "@/ABI/TestContact.json"
import { getBSCDefaultRPC } from './defaultRPC'
import DOVART_ABI from "@/ABI/DOVART.json";

const defRPC = getBSCDefaultRPC()
export function useProvider(){
  const [provider,setProvider] = useState<any>(null)
  const {address:account} = useAccount()
  useEffect(()=>{
    let p = null
    if (global.ethereum == null) {
      p = ethers.getDefaultProvider(defRPC)
      console.error("MetaMask not installed; using read-only defaults RPC:",defRPC)
    } else {
      p = new ethers.BrowserProvider(global.ethereum)
    }
    setProvider(p)
  },[account])
  return provider
}
export function useSigner(){
  const provider = useProvider()
  const [signer,setSigner] = useState<any>()
  const {address} = useAccount()
  useEffect(()=>{
    async function getSigner(){
      let sign:any = null
      if (global.ethereum == null) {
        sign = new JsonRpcSigner(provider,String(address))
      }else {
        sign = await provider.getSigner();
      }
      setSigner(sign)
    }
    if (provider && address){
      getSigner()
    }
  },[provider,address])
  return signer
}

export function getContract(address: string, abi: any,other?:any) {
  if (!address || !abi) {
      return null;
  }
  return new ethers.Contract(address, abi, other);
}

export function getTokenContract(address: string,provider:any) {
    return getContract(address, ERC20_ABI,provider);
}

export function getNFTContract(address: string,provider:any) {
  return getContract(address, ERC721_ABI,provider);
}

export function useContract(address: string, ABI: any, withSignerIfPossible = true): Contract | null {
  const {address:account} = useAccount()
  const provider = useProvider()
  const signer = useSigner()
  return useMemo(() => {
      if (!address || !ABI || !signer) return null
      try {
          return getContract(address, ABI, withSignerIfPossible ? signer : provider)
      } catch (error) {
          console.error('Failed to useContract', error)
          return null
      }
  }, [address, ABI, withSignerIfPossible, account,signer])
}

export function useTokenContract<TContract extends Contract>(tokenAddress: AddressMap){
  // const provider = useProvider()
  // const signer = useSigner()
  // const { chain } = useNetwork();
  // return useMemo(() => {
  //     const address = tokenAddress[chain?.id as keyof typeof tokenAddress];
  //     if (!address || !provider || !signer) return null
  //     try {
  //         return getTokenContract(address,signer) as TContract
  //     } catch (error) {
  //         console.error('Failed to useContract', error)
  //         return null
  //     }
  // }, [tokenAddress, chain?.id, signer, provider])


  const [contract,setContract] = useState<TContract | null>(null)
  const provider = useProvider();
  const signer = useSigner();
  const { chain } = useNetwork();
  useEffect(()=>{
    function getContract(){
      if (!chain?.id){
        return
      }
      const address = tokenAddress[chain.id];
      if (!address){
        setContract(null)
        return
      }
      const tract = getTokenContract(address,signer) as TContract
      setContract(tract)
    }
    if (provider && signer){
      getContract()
    }

  },[tokenAddress, chain?.id, signer, provider])

  return contract
}
export function useNFTContract<TContract extends Contract>(tokenAddress: AddressMap){
  const [contract,setContract] = useState<TContract | null>(null)
  const provider = useProvider();
  const signer = useSigner();
  const { chain } = useNetwork();

  useEffect(()=>{
    function getContract(){
      if (!chain?.id){
        return
      }
      const address = tokenAddress[chain.id];
      if (!address){
        setContract(null)
        return
      }
      const tract = getNFTContract(address,signer) as TContract
      setContract(tract)
    }
    if (provider && signer){
      getContract()
    }

  },[tokenAddress, chain?.id, signer, provider])
  return contract
}
export const useStaticContract = <TContract extends Contract = Contract>(ABI:InterfaceAbi,addressMap: AddressMap,networkId:ChainID,rpc:string) => {
  const [contract,setContract] = useState<TContract | null>(null)
  const provider = new JsonRpcProvider(rpc)
  useEffect(()=>{
    function getContract(){
      const address = addressMap[networkId as keyof typeof addressMap];
      if (!address){
        setContract(null)
        return
      }
      const tract = new Contract(address, ABI, provider) as TContract
      setContract(tract)
    }
    if (provider){
      getContract()
    }

  },[addressMap, rpc, networkId, provider])
  return contract
};

export function useDynamicContract<TContract extends any>(addressMap: AddressMap, ABI:InterfaceAbi, asSigner = true){
  const [contract,setContract] = useState<TContract | null>(null)
  const provider = useProvider();
  const signer = useSigner();
  const { chain } = useNetwork();

  useEffect(()=>{
    function getContract(){
      if (!chain?.id){
        return
      }
      const address = addressMap[chain.id];
      if (!address) {
        setContract(null)
        return
      }
      const providerOrSigner = asSigner && signer ? signer : provider;
      const tract = new Contract(address, ABI, providerOrSigner) as TContract;
      setContract(tract)
    }
    if (provider && signer){
      getContract()
    }

  },[addressMap, chain?.id, asSigner, signer, provider])
  return contract
}

export const createDynamicContract = <TContract extends any>(ABI: InterfaceAbi) => {
    return (addressMap: AddressMap, asSigner = true) => {
      const provider = useProvider();
      const signer = useSigner();
      const { chain } = useNetwork();
      return useMemo(() => {
        if (!chain?.id){
          return
        }
        const address = addressMap[chain.id];
        if (!address || !signer) return null;

        const providerOrSigner = asSigner && signer ? signer : provider;

        return new Contract(address, ABI, providerOrSigner) as TContract;
      }, [addressMap, chain?.id, asSigner, signer, provider]);
    };
};



export const useDynamicTokenContract = createDynamicContract<ERC20>(ERC20_ABI);
export const useDynamic721Contract = createDynamicContract<ERC721>(ERC721_ABI);

export const useTestContract = createDynamicContract<TestContact>(TestContact_ABI);

export const useDOVARTContract = createDynamicContract<DOVART>(DOVART_ABI);
