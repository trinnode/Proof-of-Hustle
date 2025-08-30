import { http, createConfig } from 'wagmi'
import { liskSepolia } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id'

export const config = createConfig({
  chains: [liskSepolia],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'Proof of Hustle',
      appLogoUrl: 'https://proof-of-hustle.vercel.app/logo.png',
    }),
    walletConnect({ projectId }),
  ],
  transports: {
    [liskSepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}