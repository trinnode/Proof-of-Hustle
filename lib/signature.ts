import { Address, Hex } from 'viem'

export interface ApprovalSignatureData {
  taskId: bigint
  client: Address
  nonce: bigint
  deadline: bigint
}

export const EIP712_DOMAIN = {
  name: 'ProofOfHustle',
  version: '2',
  chainId: 4202, // Lisk Sepolia
  verifyingContract: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address
}

export const EIP712_TYPES = {
  ApproveTask: [
    { name: 'taskId', type: 'uint256' },
    { name: 'client', type: 'address' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' }
  ]
}

export function createApprovalMessage(data: ApprovalSignatureData) {
  return {
    domain: EIP712_DOMAIN,
    types: EIP712_TYPES,
    primaryType: 'ApproveTask' as const,
    message: {
      taskId: data.taskId,
      client: data.client,
      nonce: data.nonce,
      deadline: data.deadline
    }
  }
}

export function generateSignatureDeadline(): bigint {
  // 24 hours from now
  return BigInt(Math.floor(Date.now() / 1000) + 86400)
}