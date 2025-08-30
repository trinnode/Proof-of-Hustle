'use client'

import Link from 'next/link'
import { Zap, Github, Twitter, Globe } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Proof of Hustle
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your work, your reputation, forever. Build an immutable professional record on the blockchain.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link></li>
              <li><Link href="/create-task" className="text-muted-foreground hover:text-foreground">Create Task</Link></li>
              <li><Link href="/tasks" className="text-muted-foreground hover:text-foreground">Browse Tasks</Link></li>
              <li><Link href="/reputation" className="text-muted-foreground hover:text-foreground">Reputation</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="https://gist.github.com/trinnode/27cf802ac40622b34b4987a99e415088" className="text-muted-foreground hover:text-foreground">Documentation</Link></li>
              <li><Link href="https://gist.github.com/trinnode/27cf802ac40622b34b4987a99e415088#frequently-asked-questions" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
              <li><Link href="https://x.com/_trinnex" className="text-muted-foreground hover:text-foreground">Support</Link></li>
              <li><Link href="https://x.com/_trinnex" className="text-muted-foreground hover:text-foreground">Security</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <div className="flex gap-4">
              <Link href="https://discord.com/trinnex" className="text-muted-foreground hover:text-foreground">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="https://x.com/_trinnex" className="text-muted-foreground hover:text-foreground">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="https://x.com/_trinnex" className="text-muted-foreground hover:text-foreground">
                <Globe className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Proof of Hustle. Built for the Aleph Hackathon.<br />Your reputation, decentralized.</p>
        </div>
      </div>
    </footer>
  )
}