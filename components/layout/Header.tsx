'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet'
import { 
  Zap, 
  Menu, 
  Wallet, 
  Moon, 
  Sun, 
  Monitor,
  ChevronDown,
  User,
  LogOut
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'

export function Header() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { theme, setTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Create Task', href: '/create-task' },
    { name: 'Browse Tasks', href: '/tasks' },
    { name: 'Reputation', href: '/reputation' }
  ]

  const handleConnect = async (connectorId: string) => {
    try {
      const connector = connectors.find(c => c.id === connectorId || c.name.toLowerCase().includes(connectorId.toLowerCase()))
      if (connector) {
        await connect({ connector })
        toast.success('Wallet connected successfully!')
      } else {
        toast.error('Connector not found')
      }
    } catch (error) {
      console.error('Connection error:', error)
      toast.error('Failed to connect wallet')
    }
  }

  const handleDisconnect = () => {
    disconnect()
    toast.success('Wallet disconnected')
  }

  // Map connector names to display info
  const getWalletInfo = (connectorId: string) => {
    const walletMap: Record<string, { name: string; icon: string }> = {
      'metamask': { name: 'MetaMask', icon: '🦊' },
      'walletconnect': { name: 'WalletConnect', icon: '🔗' },
      'coinbase': { name: 'Coinbase Wallet', icon: '🔵' },
      'rainbow': { name: 'Rainbow', icon: '🌈' },
      'injected': { name: 'Browser Wallet', icon: '🌐' }
    }
    
    // Try to find a match
    const key = Object.keys(walletMap).find(k => 
      connectorId.toLowerCase().includes(k) || 
      k.includes(connectorId.toLowerCase())
    )
    
    return key ? walletMap[key] : { name: connectorId, icon: '👛' }
  }

  const themeOptions = [
    { name: 'Light', value: 'light', icon: Sun },
    { name: 'Dark', value: 'dark', icon: Moon },
    { name: 'System', value: 'system', icon: Monitor }
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="relative">
              <Zap className="w-8 h-8 text-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Proof of Hustle
              </h1>
              <p className="text-xs text-muted-foreground leading-none">
                Your reputation, forever
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 px-0">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {themeOptions.map((option) => (
                  <DropdownMenuItem 
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <option.icon className="w-4 h-4" />
                    {option.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wallet Connection */}
            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="hidden sm:inline font-mono text-sm">
                      {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-destructive cursor-pointer"
                    onClick={handleDisconnect}
                  >
                    <LogOut className="w-4 h-4" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {connectors.map((connector) => {
                    const walletInfo = getWalletInfo(connector.id)
                    return (
                      <DropdownMenuItem 
                        key={connector.id}
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => handleConnect(connector.id)}
                        disabled={isPending}
                      >
                        <span className="text-lg">{walletInfo.icon}</span>
                        <span>{walletInfo.name}</span>
                        {isPending && <span className="text-xs text-muted-foreground">Connecting...</span>}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 px-0">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {themeOptions.map((option) => (
                  <DropdownMenuItem 
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <option.icon className="w-4 h-4" />
                    {option.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="px-2">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-primary" />
                    Proof of Hustle
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  {/* Mobile Navigation */}
                  <nav className="space-y-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>

                  <div className="border-t pt-4">
                    {isConnected ? (
                      <div className="space-y-3">
                        <div className="px-3 py-2 bg-muted rounded-md">
                          <div className="text-sm font-medium mb-1">Connected Wallet</div>
                          <div className="font-mono text-xs text-muted-foreground">
                            {address}
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          asChild
                        >
                          <Link href="/dashboard">
                            <User className="w-4 h-4 mr-2" />
                            Dashboard
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-destructive"
                          onClick={handleDisconnect}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-sm font-medium px-3 mb-2">Connect Wallet</div>
                        {connectors.map((connector) => {
                          const walletInfo = getWalletInfo(connector.id)
                          return (
                            <Button
                              key={connector.id}
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => handleConnect(connector.id)}
                              disabled={isPending}
                            >
                              <span className="mr-3">{walletInfo.icon}</span>
                              <span>{walletInfo.name}</span>
                              {isPending && <span className="ml-auto text-xs">...</span>}
                            </Button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}