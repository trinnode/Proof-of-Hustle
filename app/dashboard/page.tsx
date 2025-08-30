'use client'

import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { TaskList } from '@/components/tasks/TaskList'
// import { ReputationDashboard } from '@/components/reputation/ReputationDashboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, BarChart3, Briefcase, Plus, Zap } from 'lucide-react'
import Link from 'next/link'
import dynamic from "next/dynamic"

const TaskList = dynamic(
  () => 
    import('@/components/tasks/TaskList'), 
  {ssr: false}
)

const ReputationDashboard = dynamic(
  () =>
    import("@/components/reputation/ReputationDashboard"),
  { ssr: false }
)



export default function DashboardPage() {
  const { address, isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Connect your wallet to access your dashboard and start building your reputation
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Zap className="w-8 h-8 text-primary" />
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your tasks, track your reputation, and build your professional record
        </p>
      </div>

      <div className="mb-6">
        <Button asChild size="lg" className="mb-4">
          <Link href="/create-task">
            <Plus className="w-4 h-4 mr-2" />
            Create New Task
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="reputation" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Reputation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <TaskList />
        </TabsContent>

        <TabsContent value="reputation">
          <ReputationDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}