# Proof of Hustle - Frontend Application

A modern, futuristic Next.js frontend for the Proof of Hustle smart contract. Build your immutable professional reputation on the blockchain.

## 🚀 Features

- **Modern Web3 Integration**: Latest Wagmi v2, Viem, and ConnectKit
- **Beautiful UI**: Futuristic design with shadcn/ui components and Tailwind CSS
- **Complete Task Management**: Create, view, and approve tasks
- **IPFS Integration**: Upload and store proof of work files
- **Mobile Signatures**: EIP-712 signature support for gas-free approvals
- **Reputation Dashboard**: Track your permanent professional record
- **Responsive Design**: Works perfectly on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **Web3**: Wagmi v2, Viem, ConnectKit
- **Storage**: IPFS via Pinata
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Network**: Lisk Sepolia Testnet

## 📋 Prerequisites

Before you start, make sure you have:

1. **Node.js 18+** installed on your computer
2. **Git** installed
3. A **MetaMask** or compatible wallet
4. Some **Lisk Sepolia ETH** for testing (get from faucet)
5. **Pinata account** for IPFS storage (free tier available)

## 🔧 Setup Instructions

### Step 1: Clone and Install

```bash
# Clone the repository (after uploading to GitHub)
git clone https://github.com/yourusername/proof-of-hustle-frontend.git
cd proof-of-hustle-frontend

# Install dependencies
npm install
```

### Step 2: Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your configuration:

```env
# Your deployed smart contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Replace with your actual contract address

# Pinata IPFS credentials (get from https://pinata.cloud)
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token

# Optional: WalletConnect Project ID (get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Step 3: Update Contract Address

In `lib/constants.ts`, update the contract address:

```typescript
export const PROOF_OF_HUSTLE_ADDRESS = "0x..." // Your actual deployed address
```

### Step 4: Run Locally

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment to Vercel

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub:**
```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/proof-of-hustle-frontend.git
git push -u origin main
```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard:
     - `NEXT_PUBLIC_CONTRACT_ADDRESS`
     - `NEXT_PUBLIC_PINATA_API_KEY`
     - `NEXT_PUBLIC_PINATA_SECRET_KEY`
     - `NEXT_PUBLIC_PINATA_JWT`
   - Click "Deploy"

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts and add environment variables when asked
```

## 🔑 Getting Required Credentials

### Pinata (IPFS Storage)

1. Go to [pinata.cloud](https://pinata.cloud) and create a free account
2. Navigate to "API Keys" in your dashboard
3. Create a new API key with full permissions
4. Copy the API Key, Secret, and JWT token to your `.env.local`

### WalletConnect (Optional)

1. Go to [cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Create a new project
3. Copy the Project ID to your `.env.local`

### Lisk Sepolia ETH

1. Add Lisk Sepolia network to MetaMask:
   - Network Name: Lisk Sepolia
   - RPC URL: https://rpc.sepolia-api.lisk.com
   - Chain ID: 4202
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia-blockscout.lisk.com

2. Get test ETH from a Lisk Sepolia faucet

## 🧪 Testing the Application

### Local Testing

1. **Connect Wallet**: Click "Connect Wallet" and connect MetaMask
2. **Create Task**: 
   - Go to "Create Task"
   - Fill in client address (use a different address you control)
   - Upload some test files
   - Set difficulty and deadline
   - Submit (costs 0.001 ETH + gas)

3. **Approve Task**:
   - Switch to client address in MetaMask
   - Go to "Dashboard" → "My Requests"
   - Click "Approve" on the task
   - Or use mobile signature approval

4. **Check Reputation**:
   - Switch back to worker address
   - Go to "Reputation" tab
   - See your updated Hustle Score

### Production Testing

After deploying to Vercel:

1. Visit your deployed URL
2. Test all functionality with real wallet addresses
3. Verify IPFS uploads work correctly
4. Test mobile signature flow


**Built with ❤️ for the decentralized future of work**

For questions or support, please open an issue on GitHub.