'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { TaskCard } from './TaskCard'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTasksByWorker, useTasksByClient, useTaskData } from '@/hooks/useContract'
import { Task } from '@/lib/types'
import { AlertCircle, Briefcase, User } from 'lucide-react'
import Link from 'next/link'

export default function TaskList() {
  const { address } = useAccount()
  const [workerTasks, setWorkerTasks] = useState<Task[]>([])
  const [clientTasks, setClientTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const { data: workerTaskIds } = useTasksByWorker(address as `0x${string}`, 0, 50)
  const { data: clientTaskIds } = useTasksByClient(address as `0x${string}`, 0, 50)

  // This is a simplified version - in production you'd want to batch these calls
  useEffect(() => {
    const fetchTasks = async () => {
      if (!address) return
      
      setLoading(true)
      try {
        // In a real implementation, you'd batch fetch all task details
        // For now, we'll show the structure
        setWorkerTasks([])
        setClientTasks([])
      } catch (error) {
        console.error('Error fetching tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [address, workerTaskIds, clientTaskIds])

  if (!address) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-muted-foreground text-center">
            Please connect your wallet to view your tasks and reputation
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3">Loading your tasks...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="worker" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="worker" className="flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          My Work ({workerTaskIds?.[1]?.toString() || '0'})
        </TabsTrigger>
        <TabsTrigger value="client" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          My Requests ({clientTaskIds?.[1]?.toString() || '0'})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="worker" className="space-y-4">
        {workerTasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Tasks Yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Start building your reputation by creating your first task
              </p>
              <Button asChild>
                <Link href="/create-task">Create Your First Task</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {workerTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                userAddress={address}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="client" className="space-y-4">
        {clientTasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <User className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Requests</h3>
              <p className="text-muted-foreground text-center">
                Tasks where you're the client will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {clientTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                userAddress={address}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}