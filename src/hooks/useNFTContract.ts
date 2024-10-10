import { RefreshConfig } from './../Common/index';
import { useQuery } from 'react-query';
import { ApprovalState } from '@/Common';
import { AddressMap } from '../Contract/addresses';
import { Address, useAccount, useContractRead, useContractWrite, useNetwork } from "wagmi";
import ERC_721_ABI from '../ABI/ERC721.json'
import { useContext, useState, useEffect, useCallback } from 'react';
import { getContract } from '@wagmi/core'
import { parseUnits } from 'ethers';
import { TransLoadingConfirm, TransLoadingError, TransLoadingSuccess } from '@/Components/TransactionLoading';

export function useNFTAllowance(nftAddress:AddressMap,spender:string){
  const {chain = {id: 1}} = useNetwork()
  const {address} = useAccount()
  return useContractRead({
    address: nftAddress[chain.id as keyof AddressMap] as Address,
    abi: ERC_721_ABI,
    functionName: 'isApprovedForAll',
    args:[address,spender]
  })
}

export function useApprovalNFTForAll(tokenAddress: AddressMap, spender: string): [ApprovalState, () => Promise<void>] {
  const {chain = {id: 1}} = useNetwork()
  const {address} = useAccount()

  const {writeAsync } = useContractWrite({
    address: tokenAddress[chain.id as keyof AddressMap] as Address,
    abi: ERC_721_ABI,
    functionName: 'setApprovalForAll',
    args:[spender,true],
  })

  const currentAllowance = useNFTAllowance(tokenAddress, spender)
  const [approvalState, setApproveState] = useState(ApprovalState.UNKNOWN);

  useEffect(() => {
    if (!currentAllowance) {
        setApproveState(ApprovalState.NOT_APPROVED);
    } else {
        setApproveState(ApprovalState.APPROVED);
    }
  }, [currentAllowance])
  const approve = useCallback(async (): Promise<void> => {
    if (!address){
      return
    }
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily');
      return;
    }
    setApproveState(ApprovalState.PENDING);
    TransLoadingConfirm('Approve NFT')
    writeAsync({
    }).then((res:any)=>{
      TransLoadingSuccess(res.hash,chain.id)
      setApproveState(ApprovalState.APPROVED);
    }).catch((err:any)=>{
      setApproveState(ApprovalState.NOT_APPROVED);
      TransLoadingError(err.data?.message || err.message,err.transactionHash,chain.id)

    })
  }, [approvalState, spender]);

  return [approvalState, approve];
}

export function useNftApprove(nftId: number | string, nftContractAddress: AddressMap): [ApprovalState, () => Promise<void>] {
  const {address} = useAccount()
  const {chain = {id: 56}} = useNetwork()
  const {data: isApprove} = useIsApproveNFT(nftId, address || "", nftContractAddress);
  const [approvalState, setApproveState] = useState(ApprovalState.UNKNOWN);
  const {writeAsync } = useContractWrite({
    address: nftContractAddress[chain.id as keyof AddressMap] as Address,
    abi: ERC_721_ABI,
    functionName: 'approve',
    args:[address, parseUnits(nftId+'')]
  })

  useEffect(() => {
    if (!isApprove) {
      setApproveState(ApprovalState.NOT_APPROVED);
    } else {
      setApproveState(ApprovalState.APPROVED);
    }
  }, [isApprove])
  const approve = useCallback(async (): Promise<void> => {
    if (!address){
      return
    }
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily');
      return;
    }
    setApproveState(ApprovalState.PENDING);
    TransLoadingConfirm('Approve NFT')
    writeAsync({
    }).then((res:any)=>{
      TransLoadingSuccess(res.hash,chain.id)
      setApproveState(ApprovalState.APPROVED);
    }).catch((err:any)=>{
      setApproveState(ApprovalState.NOT_APPROVED);
      TransLoadingError(err.data?.message || err.message,err.transactionHash,chain.id)
    })
  }, [approvalState, nftId, address]);
  return [approvalState, approve];
}

export function useIsApproveNFT(nftId: string | number, spenderAddress: string, nftContractAddress: AddressMap){
  const {address} = useAccount();
  const {chain = {id: 1}} = useNetwork();
  const contract = getContract({
    address:nftContractAddress[chain.id as keyof AddressMap] as Address,
    abi:ERC_721_ABI,
  })
  async function fetchData() {
    if (!address || !spenderAddress || !contract) {
        return
    }
    try {
      const approveAddr = await contract.read.getApproved([parseUnits(nftId+'')]) as string
      return approveAddr.toUpperCase() === spenderAddress.toUpperCase()
    } catch (error:any) {
      console.error('useIsApproveNFT error',error)
    }
  }
  return useQuery(["useIsApproveNFT" + nftId + spenderAddress], fetchData, {
    enabled:!!chain.id && !!address,
    refetchInterval: RefreshConfig.refreshInterval,
  })
}