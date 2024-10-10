import { useQuery } from 'react-query';
import { fetchBalance } from '@wagmi/core';
import { ApprovalState, RefreshConfig, formatBalance } from '@/Common';
import { useContext, useState, useEffect, useCallback } from 'react';
import { AddressMap } from './../Contract/addresses';
import { Address, useAccount, useContractRead, useNetwork, useContractWrite } from "wagmi";
import ERC_20_ABI from '../ABI/ERC20.json'
import {BigNumberish, MaxInt256, TransactionResponse, ethers, formatUnits, parseUnits} from 'ethers'
import walletTokens from '@/Contract/walletTokens';
import { useProvider, useTokenContract } from './useContract';
import { TransLoadingConfirm, TransLoadingError, TransLoadingPending, TransLoadingSuccess } from '@/Components/TransactionLoading';

export function useTokenAllowance(tokenAddress:AddressMap,contractAddress:AddressMap){
  // const {chain} = useNetwork()
  // const {address} = useAccount()
  // return useContractRead({
  //   address: tokenAddress[chain?.id as keyof AddressMap] as Address,
  //   abi: ERC_20_ABI,
  //   functionName: 'allowance',
  //   args:[address,contractAddress[chain?.id as keyof AddressMap]]
  // })
  const {chain} = useNetwork()
  const {address} = useAccount()
  const tokenAddresses = tokenAddress[chain?.id as keyof AddressMap]
  const contractAddresses = contractAddress[chain?.id as keyof AddressMap]

  const tokenContract = useTokenContract(tokenAddress)

  async function fetchData(){
    if (tokenContract){
      const allowance = await tokenContract.allowance(address, contractAddresses);
      return allowance
    }
  }
  return useQuery(["useTokenAllowance"+tokenAddresses+contractAddresses], fetchData, {
    enabled:!!address && !!tokenAddress && !!contractAddress && !!tokenContract && !!chain?.id,
  })
}

export function useApprove(tokenAddressMap: AddressMap, spenderAddressMap: AddressMap,approveSuccess?:()=>void,cost?:string | number): [ApprovalState, () => Promise<void>] {
  const {address} = useAccount()
  const {chain} = useNetwork()
  const tokenContract = useTokenContract(tokenAddressMap)
  const {data:allowanceData,refetch}:any = useTokenAllowance(tokenAddressMap, spenderAddressMap);
  const [approvalState, setApproveState] = useState(ApprovalState.UNKNOWN);
  console.log('allowanceData====',allowanceData,tokenAddressMap)
  useEffect(() => {
    if (allowanceData == undefined || allowanceData == null){
      setApproveState(ApprovalState.UNKNOWN);
    }else {
      const allowance = Number(formatUnits(allowanceData || 0))
      if (allowance == 0 || allowance < Number(cost)) {
        setApproveState(ApprovalState.NOT_APPROVED);
      } else {
        setApproveState(ApprovalState.APPROVED);
      }
    }
  }, [allowanceData,cost])

  const approve = useCallback(async (): Promise<void> => {
    if (!address || !chain?.id){
      return
    }
    const contractAddress = spenderAddressMap[chain.id];
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily');
      return;
    }
    if (!contractAddress) {
      console.error("Contract doesn't exist on current network. Please switch networks.")
      return
    }
    if (!tokenContract){
      console.error("Token doesn't exist on current network. Please switch networks.")
      return
    }
    // setApproveState(ApprovalState.PENDING);
    TransLoadingConfirm('Approve')
    tokenContract.approve(contractAddress, MaxInt256)
    .then(async (response: TransactionResponse) => {
        TransLoadingPending(response.hash,chain.id)
        await response.wait();
        TransLoadingSuccess(response.hash,chain.id)
        setApproveState(ApprovalState.APPROVED);
        refetch && refetch()
        approveSuccess && approveSuccess()
    })
    .catch((err: any) => {
      console.log('err==',err)
        setApproveState(ApprovalState.NOT_APPROVED);
        TransLoadingError(err.data?.message || err.message,err.transactionHash,chain.id)
    })
  }, [approvalState, tokenAddressMap, spenderAddressMap, cost, tokenContract]);
  return [approvalState, approve];
}

export function useWalletInfo(){
  const { address } = useAccount()
  const {chain} = useNetwork()
  const provider = useProvider()

  async function fetchData(){
    if (!address || !chain?.id || !provider){
      return
    }
    const walletBalance:any = {}
    try {
      let callContextArr:any = []
      walletTokens.forEach((item: any, index: number) => {
        const coinContract = new ethers.Contract(item.address[chain.id], ERC_20_ABI, provider);
        callContextArr.push(coinContract.balanceOf(address))
      })

      const multicallResult = await Promise.all(callContextArr)
      multicallResult.map((item:bigint,index:number)=>{
        walletBalance[walletTokens[index].name] = formatBalance(formatUnits(item))
      })
      walletBalance["nativeCurrency"] = formatBalance(formatUnits(await provider.getBalance(address)))
    } catch (error) {
      console.log('useWalletInfo error',error)
    }
    console.log('walletBalance==',walletBalance)

    return walletBalance
  }
  return useQuery(["useWalletInfo"],fetchData,{
    enabled:!!chain?.id && !!address && !!provider,
    refetchInterval: RefreshConfig.shortRefreshInterval,
  })
}
