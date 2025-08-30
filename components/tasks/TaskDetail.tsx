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
import { ArrowLeft, Calendar, Clock, ExternalLink, FileText, User, Zap, Shield } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export default function TaskDetailPage() {
  const params = useParams()
  const taskId = params.id as string
  const { address } = useAccount()
  
  const { data: taskData, isLoading, error } = useTaskData(BigInt(taskId))

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-8 sm:py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-sm sm:text-base">Loading task details...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !taskData) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
            <FileText className="w-10 sm:w-12 h-10 sm:h-12 text-muted-foreground mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">Task Not Found</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 text-center">
              The requested task could not be found or doesn't exist.
            </p>
            <Button asChild variant="outline" size="sm">
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
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <Button asChild variant="outline" size="sm" className="mb-3 sm:mb-4">
          <Link href="/tasks">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Back to Tasks</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Task #{taskId}</h1>
          <Badge variant={getStatusColor(status)} className="w-fit">
            {getStatusText(status)}
          </Badge>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground">
          Detailed view of this blockchain-verified task
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Task Details */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="text-2xl sm:text-3xl">{categoryInfo?.icon}</div>
                <div className="flex-1">
                  <div className="text-lg sm:text-xl">{categoryInfo?.label} Task</div>
                  <CardDescription className="text-sm sm:text-base mt-1">
                    {categoryInfo?.description}
                  </CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Task Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">Worker</label>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-mono text-xs sm:text-sm break-all">{worker}</span>
                    {isWorker && <Badge variant="outline" className="text-xs flex-shrink-0">You</Badge>}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">Client</label>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-mono text-xs sm:text-sm break-all">{client}</span>
                    {isClient && <Badge variant="outline" className="text-xs flex-shrink-0">You</Badge>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">Difficulty Weight</label>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <Badge variant="outline" className="text-xs sm:text-sm">{difficultyWeight.toString()}</Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">Created</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs sm:text-sm">
                      {formatDistanceToNow(new Date(Number(timestamp) * 1000), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">Deadline</label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className={`text-xs sm:text-sm ${isExpired ? 'text-destructive font-medium' : ''}`}>
                      {formatDistanceToNow(new Date(Number(deadline) * 1000), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Proof of Work */}
              {ipfsCid && (
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">Proof of Work</label>
                  <div>
                    <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                      <a 
                        href={getIPFSUrl(ipfsCid)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View Files on IPFS</span>
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Client Actions */}
          {isClient && status === 0 && !isExpired && (
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Client Actions</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  You can approve this task to build the worker's reputation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <Button asChild className="w-full" size="sm">
                  <Link href={`/tasks/${taskId}/approve`}>
                    <Zap className="w-4 h-4 mr-2" />
                    <span>Approve Task</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full" size="sm">
                  <Link href={`/tasks/${taskId}/signature`}>
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Sign Approval (Mobile)</span>
                    <span className="sm:hidden">Mobile Sign</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Task Information */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Shield className="w-4 sm:w-5 h-4 sm:h-5" />
                Task Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Blockchain Record</label>
                <p className="text-xs sm:text-sm mt-1 leading-relaxed">
                  This task is permanently recorded on Lisk Sepolia testnet and cannot be modified or deleted.
                </p>
              </div>
              
              <div>
                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Reputation Impact</label>
                <p className="text-xs sm:text-sm mt-1 flex items-center gap-2 flex-wrap">
                  <span>Approval will add</span>
                  <Badge variant="outline" className="text-xs">{difficultyWeight.toString()}</Badge>
                  <span>points to the worker's reputation.</span>
                </p>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Verification</label>
                <p className="text-xs sm:text-sm mt-1 leading-relaxed">
                  All task data and approvals are cryptographically verifiable on the blockchain.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Quick Actions */}
          <div className="xl:hidden">
            {isClient && status === 0 && !isExpired ? (
              <div className="flex gap-2">
                <Button asChild className="flex-1" size="sm">
                  <Link href={`/tasks/${taskId}/approve`}>
                    <Zap className="w-4 h-4 mr-1" />
                    Approve
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1" size="sm">
                  <Link href={`/tasks/${taskId}/signature`}>
                    <FileText className="w-4 h-4 mr-1" />
                    Sign
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center text-xs sm:text-sm text-muted-foreground">
                {status === 1 ? '✅ Task approved' : 
                 status === 2 ? '⚠️ Task disputed' :
                 status === 3 ? '❌ Task expired' :
                 isExpired ? '⏰ Task expired' : 
                 '⏳ Awaiting approval'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}