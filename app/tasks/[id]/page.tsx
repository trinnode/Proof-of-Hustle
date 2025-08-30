'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useTaskData } from '@/hooks/useContract'
import { TASK_CATEGORIES, TASK_STATUS, TASK_CATEGORY_OPTIONS } from '@/lib/constants'
import { getIPFSUrl } from '@/lib/ipfs'
import { useAccount } from 'wagmi'
import { ArrowLeft, Calendar, Clock, ExternalLink, FileText, User, Zap } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export default function TaskDetailPage() {
  const params = useParams()
  const taskId = params.id as string
  const { address } = useAccount()
  
  const { data: taskData, isLoading, error } = useTaskData(BigInt(taskId))

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3">Loading task details...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !taskData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Task Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The requested task could not be found or doesn't exist.
            </p>
            <Button asChild variant="outline">
              <Link href="/tasks">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tasks
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const [worker, client, timestamp, deadline, status, category, difficultyWeight, ipfsCid] = taskData
  const categoryInfo = TASK_CATEGORY_OPTIONS.find(cat => cat.value === category)
  const isExpired = Date.now() > Number(deadline) * 1000
  const isClient = address?.toLowerCase() === client.toLowerCase()
  const isWorker = address?.toLowerCase() === worker.toLowerCase()

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return isExpired ? 'destructive' : 'secondary'
      case 1: return 'default'
      case 2: return 'destructive'
      case 3: return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusText = (status: number) => {
    if (status === 0 && isExpired) return 'Expired'
    return TASK_STATUS[status as keyof typeof TASK_STATUS]
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="outline" className="mb-4">
          <Link href="/tasks">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tasks
          </Link>
        </Button>
        
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold">Task #{taskId}</h1>
          <Badge variant={getStatusColor(status)}>
            {getStatusText(status)}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Detailed view of this blockchain-verified task
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Task Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="text-2xl">{categoryInfo?.icon}</div>
                <div>
                  <div>{categoryInfo?.label} Task</div>
                  <CardDescription>{categoryInfo?.description}</CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Worker</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{worker}</span>
                    {isWorker && <Badge variant="outline" className="text-xs">You</Badge>}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Client</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{client}</span>
                    {isClient && <Badge variant="outline" className="text-xs">You</Badge>}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Difficulty Weight</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <Badge variant="outline">{difficultyWeight.toString()}</Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {formatDistanceToNow(new Date(Number(timestamp) * 1000), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Deadline</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className={`text-sm ${isExpired ? 'text-destructive font-medium' : ''}`}>
                      {formatDistanceToNow(new Date(Number(deadline) * 1000), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>

              {ipfsCid && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Proof of Work</label>
                  <div className="mt-2">
                    <Button asChild variant="outline">
                      <a 
                        href={getIPFSUrl(ipfsCid)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Files on IPFS
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          {isClient && status === 0 && !isExpired && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Client Actions</CardTitle>
                <CardDescription>
                  You can approve this task to build the worker's reputation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full">
                  <Link href={`/tasks/${taskId}/approve`}>
                    <Zap className="w-4 h-4 mr-2" />
                    Approve Task
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/tasks/${taskId}/signature`}>
                    <FileText className="w-4 h-4 mr-2" />
                    Sign Approval (Mobile)
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Task Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Blockchain Record</label>
                <p className="text-sm mt-1">
                  This task is permanently recorded on Lisk Sepolia testnet and cannot be modified or deleted.
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Reputation Impact</label>
                <p className="text-sm mt-1">
                  Approval will add <Badge variant="outline">{difficultyWeight.toString()}</Badge> points to the worker's reputation.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Verification</label>
                <p className="text-sm mt-1">
                  All task data and approvals are cryptographically verifiable on the blockchain.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}