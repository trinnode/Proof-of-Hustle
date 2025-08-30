export interface Task {
  id: string
  worker: string
  client: string
  timestamp: number
  deadline: number
  status: TaskStatus
  category: TaskCategory
  difficultyWeight: number
  ipfsCid: string
}

export interface Dispute {
  initiator: string
  createdAt: number
  resolvedAt: number
  status: DisputeStatus
  evidence: string
  resolver: string
}

export interface ReputationData {
  totalScore: bigint
  totalWeight: bigint
  taskCount: bigint
  disputeCount: bigint
  lastUpdated: bigint
}

export interface HustleScore {
  score: number
  reliability: number
  experience: number
}

export enum TaskStatus {
  Pending = 0,
  Approved = 1,
  Disputed = 2,
  Expired = 3
}

export enum TaskCategory {
  Development = 0,
  Design = 1,
  Writing = 2,
  Marketing = 3,
  Research = 4,
  Other = 5
}

export enum DisputeStatus {
  Pending = 0,
  WorkerWins = 1,
  ClientWins = 2
}

export interface CreateTaskForm {
  clientAddress: string
  category: TaskCategory
  difficultyWeight: number
  deadline: Date
  description: string
  files: File[]
}

export interface FileUploadResult {
  ipfsHash: string
  url: string
}