'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { PROOF_OF_HUSTLE_ABI } from '@/lib/abi'
import { PROOF_OF_HUSTLE_ADDRESS } from '@/lib/constants'
import { Address } from 'viem'

export function useProofOfHustleContract() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })

  const createTask = async (
    client: Address,
    ipfsCid: string,
    category: number,
    difficultyWeight: number,
    deadline: number
  ) => {
    return writeContract({
      address: PROOF_OF_HUSTLE_ADDRESS as Address,
      abi: PROOF_OF_HUSTLE_ABI,
      functionName: 'createTask',
      args: [client, ipfsCid, category, difficultyWeight, deadline],
      value: BigInt('200000000000000') // 0.0002 ETH
    })
  }

  const approveTask = async (taskId: bigint) => {
    return writeContract({
      address: PROOF_OF_HUSTLE_ADDRESS as Address,
      abi: PROOF_OF_HUSTLE_ABI,
      functionName: 'approveTask',
      args: [taskId]
    })
  }

  const approveTaskWithSignature = async (
    taskId: bigint,
    deadline: bigint,
    signature: `0x${string}`
  ) => {
    return writeContract({
      address: PROOF_OF_HUSTLE_ADDRESS as Address,
      abi: PROOF_OF_HUSTLE_ABI,
      functionName: 'approveTaskWithSignature',
      args: [taskId, deadline, signature]
    })
  }

  const fileDispute = async (taskId: bigint, evidence: string) => {
    return writeContract({
      address: PROOF_OF_HUSTLE_ADDRESS as Address,
      abi: PROOF_OF_HUSTLE_ABI,
      functionName: 'fileDispute',
      args: [taskId, evidence],
      value: BigInt('500000000000000') // 0.0005 ETH
    })
  }

  return {
    createTask,
    approveTask,
    approveTaskWithSignature,
    fileDispute,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error
  }
}

export function useTaskData(taskId: bigint) {
  return useReadContract({
    address: PROOF_OF_HUSTLE_ADDRESS as Address,
    abi: PROOF_OF_HUSTLE_ABI,
    functionName: 'getTask',
    args: [taskId]
  })
}

export function useHustleScore(address: Address) {
  return useReadContract({
    address: PROOF_OF_HUSTLE_ADDRESS as Address,
    abi: PROOF_OF_HUSTLE_ABI,
    functionName: 'getHustleScore',
    args: [address]
  })
}

export function useReputationData(address: Address) {
  return useReadContract({
    address: PROOF_OF_HUSTLE_ADDRESS as Address,
    abi: PROOF_OF_HUSTLE_ABI,
    functionName: 'getReputationData',
    args: [address]
  })
}

export function useTasksByWorker(worker: Address, offset = 0, limit = 10) {
  return useReadContract({
    address: PROOF_OF_HUSTLE_ADDRESS as Address,
    abi: PROOF_OF_HUSTLE_ABI,
    functionName: 'getTasksByWorker',
    args: [worker, BigInt(offset), BigInt(limit)]
  })
}

export function useTasksByClient(client: Address, offset = 0, limit = 10) {
  return useReadContract({
    address: PROOF_OF_HUSTLE_ADDRESS as Address,
    abi: PROOF_OF_HUSTLE_ABI,
    functionName: 'getTasksByClient',
    args: [client, BigInt(offset), BigInt(limit)]
  })
}

export function useTotalTasks() {
  return useReadContract({
    address: PROOF_OF_HUSTLE_ADDRESS as Address,
    abi: PROOF_OF_HUSTLE_ABI,
    functionName: 'totalTasks'
  })
}