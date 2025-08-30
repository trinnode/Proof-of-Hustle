'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from './button'
import { Wallet, LogOut, User } from 'lucide-react'
import { Badge } from './badge'

export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="flex items-center gap-2">
          <User className="w-3 h-3" />
          {address.slice(0, 6)}...{address.slice(-4)}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={() => disconnect()}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      {connectors.map((connector) => (
        <Button
          key={connector.uid}
          onClick={() => connect({ connector })}
          className="flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          Connect {connector.name}
        </Button>
      ))}
    </div>
  )
}