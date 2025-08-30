// Smart Contract Configuration
export const PROOF_OF_HUSTLE_ADDRESS = "0x2Acbc84080d07A5f3D8BC0678F652dE7e07475fC" // Replace with your deployed contract address
export const LISK_SEPOLIA_CHAIN_ID = 4202

// IPFS Configuration
export const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY || ""
export const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY || ""
export const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || ""

// Task Categories
export const TASK_CATEGORIES = {
  0: "Development",
  1: "Design", 
  2: "Writing",
  3: "Marketing",
  4: "Research",
  5: "Other"
} as const

export const TASK_CATEGORY_OPTIONS = [
  { value: 0, label: "Development", icon: "💻", description: "Coding, apps, websites" },
  { value: 1, label: "Design", icon: "🎨", description: "Logos, graphics, UI/UX" },
  { value: 2, label: "Writing", icon: "✍️", description: "Articles, copywriting, blogs" },
  { value: 3, label: "Marketing", icon: "📈", description: "Social media, ads, SEO" },
  { value: 4, label: "Research", icon: "🔍", description: "Data analysis, market research" },
  { value: 5, label: "Other", icon: "⚡", description: "Anything else!" }
]

// Task Status
export const TASK_STATUS = {
  0: "Pending",
  1: "Approved", 
  2: "Disputed",
  3: "Expired"
} as const

// Dispute Status
export const DISPUTE_STATUS = {
  0: "Pending",
  1: "WorkerWins",
  2: "ClientWins"
} as const

// Fees
export const TASK_CREATION_FEE = "0.0002" // ETH
export const DISPUTE_FEE = "0.0005" // ETH

// Reputation Thresholds
export const REPUTATION_LEVELS = [
  { min: 0, max: 10000, label: "Newcomer", color: "bg-gray-500" },
  { min: 10000, max: 50000, label: "Rising", color: "bg-blue-500" },
  { min: 50000, max: 100000, label: "Skilled", color: "bg-green-500" },
  { min: 100000, max: 250000, label: "Expert", color: "bg-purple-500" },
  { min: 250000, max: 500000, label: "Master", color: "bg-orange-500" },
  { min: 500000, max: Infinity, label: "Legend", color: "bg-gradient-to-r from-yellow-400 to-orange-500" }
]