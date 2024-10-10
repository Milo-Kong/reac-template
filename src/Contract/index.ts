import { GasInfo, RefreshConfig, formatBalance } from '@/Common';
import { BigNumberish, Contract, MaxUint256, TransactionResponse, formatUnits, parseUnits } from 'ethers';
import {useQuery,useMutation} from 'react-query'
import { DOVART_CONTRACT_ADDRESSSES, TEST_CONTRACT_ADDRESSSES, USDT_ADDRESSSES } from '@/Contract/addresses';
import { useAccount, useNetwork } from 'wagmi';
import { AddressMap } from './addresses';
import { useDOVARTContract, useDynamicContract, useTestContract, useTokenContract } from '@/hooks/useContract';
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { TransLoadingConfirm, TransLoadingError, TransLoadingPending, TransLoadingSuccess } from '@/Components/TransactionLoading';
import { publicClient } from '@/provider/Web3ModalProvider';
import TestContact_ABI from '@/ABI/TestContact.json'
import { Abi, parseAbi } from 'viem';
import dayjs from 'dayjs';

interface Transaction {
  title: string,
  func: Function,
  args: any[],
  value?:any,
  gasLimit?: boolean,
  onSuccess?: Function,
  onError?: Function,
}

export function useSendTransaction() {
  const {chain = { id : 56 }} = useNetwork()
  const {open} = useWeb3Modal()
  const {address} = useAccount()

  function sendTransaction(params: Transaction) {
    return new Promise(() => {
      if (!address){
        open && open()
        return
      }
      TransLoadingConfirm(params.title)
      params.func(...params.args, {
        value:params.value || 0
      })
        .then(async (response: TransactionResponse) => {
          TransLoadingPending(response.hash,chain.id)
          const result:any = await response.wait();
          console.log('result===',result)
          if (result.status == 1){
            TransLoadingSuccess( response.hash,chain.id)
            params.onSuccess && params.onSuccess()
          }else {
            TransLoadingError('Please check the error message in the blockchain explorer',response.hash,chain.id)
            params.onError && params.onError('Please check the error message in the blockchain explorer')
          }
        })
        .catch((err: any) => {
          console.log('err',err)
          TransLoadingError( err.info?.error?.data?.message || err.reason || err.message, err.transactionHash,chain.id)
          params.onError && params.onError(err.info?.error?.data?.message || err.reason || err.message)
        })
    })
  }

  return useMutation((params: Transaction) => sendTransaction(params))
}


export function useMutilCallTest(){
  const {address} = useAccount()
  const {chain} = useNetwork()
  const testContract = useTestContract(TEST_CONTRACT_ADDRESSSES)
  async function fetchData(){
    if (!address || !chain?.id || !testContract){
      return
    }
    const begin = dayjs().valueOf()

    const abc = await publicClient.multicall({
      contracts:[
        {
          address:TEST_CONTRACT_ADDRESSSES[chain?.id],
          abi:TestContact_ABI as Abi,
          functionName:'dayID',
          args:[]
        },
        {
          address:TEST_CONTRACT_ADDRESSSES[chain?.id],
          abi:TestContact_ABI as Abi,
          functionName:'balance',
          args:[address]
        },
        {
          address:TEST_CONTRACT_ADDRESSSES[chain?.id],
          abi:TestContact_ABI as Abi,
          functionName:'income',
          args:[address]
        },
        {
          address:TEST_CONTRACT_ADDRESSSES[chain?.id],
          abi:TestContact_ABI as Abi,
          functionName:'getAPrice',
          args:[]
        },
      ]
    })
    const end = dayjs().valueOf()
    console.log('mutilcall 耗时',(end - begin)/1000,'秒')
    console.log('=====',abc)


    const beginCustom = dayjs().valueOf()
    console.log('beginCustom=====',beginCustom)

    const dayID = await testContract.dayID()
    const balance = await testContract.balance(address)
    const income = await testContract.income(address)
    const getAPrice = await testContract.getAPrice()
    const endCustom = dayjs().valueOf()
    console.log('endCustom=====',endCustom)

    console.log('普通合约请求 耗时',(endCustom - beginCustom)/1000,'秒')


    return {
    }
  }
  return useQuery(["useMutilCallTest"], fetchData, {
    enabled:!!chain?.id && !!address && !!testContract,
    refetchInterval: RefreshConfig.refreshInterval,
  })
}

export function useNumberOfTokens(){
  const {address} = useAccount()
  const {chain} = useNetwork()
  const DOVARTContract = useDOVARTContract(DOVART_CONTRACT_ADDRESSSES)
  async function fetchData(){
    if (!address || !DOVARTContract){
      return
    }
    // nftContranct.estimateGas.price([1])
    const numberOfTokens = await DOVARTContract.numberOfTokens()
    console.log('numberOfTokens==',numberOfTokens.toString())
    return {
      numberOfTokens:numberOfTokens.toString()
    }
  }
  return useQuery(["useNumberOfTokens"], fetchData, {
    enabled:!!chain?.id && !!address && !!DOVARTContract,
    refetchInterval: RefreshConfig.shortRefreshInterval,
  })
}

export function useMyNFTList(){
  const {address} = useAccount()
  const {chain} = useNetwork()
  const DOVARTContract = useDOVARTContract(DOVART_CONTRACT_ADDRESSSES)
  async function fetchData(){
    if (!address || !DOVARTContract){
      return
    }
    const numberOfTokens = await DOVARTContract.numberOfTokens()
    const array = new Array(Number(numberOfTokens.toString())).fill('')
    let myList:any[] = []

    for (let index = 0; index < array.length; index++) {
      const ownerOf:string = await DOVARTContract.ownerOf(index+1)
      if (ownerOf.toUpperCase() == address.toUpperCase())[
        myList.push(index+1)
      ]
    }
    return {
      myList
    }
  }
  return useQuery(["useMyNFTList"], fetchData, {
    enabled:!!chain?.id && !!address && !!DOVARTContract,
    refetchInterval: RefreshConfig.shortRefreshInterval,
  })
}