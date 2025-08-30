'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useTaskData, useProofOfHustleContract } from '@/hooks/useContract'
import { TASK_CATEGORIES, TASK_CATEGORY_OPTIONS, TASK_STATUS  } from '@/lib/constants'
import { getIPFSUrl } from '@/lib/ipfs'
import { toast } from 'sonner'
import { ArrowLeft, CheckCircle, ExternalLink, FileText, User, Zap } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export default function ApproveTaskPage() {
  const params = useParams()
  const taskId = params.id as string
  const { address } = useAccount()
  const [isApproving, setIsApproving] = useState(false)
  
  const { data: taskData, isLoading } = useTaskData(BigInt(taskId))
  const { approveTask, isPending, isConfirming } = useProofOfHustleContract()

  const handleApprove = async () => {
    try {
      setIsApproving(true)
      await approveTask(BigInt(taskId))
      toast.success('Task approved successfully! Worker\'s reputation has been updated.')
    } catch (error) {
      console.error('Error approving task:', error)
      toast.error('Failed to approve task. Please try again.')
    } finally {
      setIsApproving(false)
    }
  }

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

  if (!taskData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Task Not Found</h3>
            <p className="text-muted-foreground">
              The requested task could not be found.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const [worker, client, timestamp, deadline, status, category, difficultyWeight, ipfsCid] = taskData
  const categoryInfo = TASK_CATEGORY_OPTIONS.find(cat => cat.value === category)
  const isExpired = Date.now() > Number(deadline) * 1000
  const isClient = address?.toLowerCase() === client.toLowerCase()

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Not Authorized</h3>
            <p className="text-muted-foreground">
              Only the client can approve this task.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status !== 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Task Already Processed</h3>
            <p className="text-muted-foreground">
              This task has already been {TASK_STATUS[status as keyof typeof TASK_STATUS].toLowerCase()}.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="outline" className="mb-4">
          <Link href={`/tasks/${taskId}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Task
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">
          Approve Task #{taskId}
        </h1>
        <p className="text-muted-foreground">
          Review the completed work and approve to build the worker's reputation
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Task Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="text-2xl">{categoryInfo?.icon}</div>
              <div>
                <div>Work Review</div>
                <CardDescription>{categoryInfo?.label} - {categoryInfo?.description}</CardDescription>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Worker</label>
                <p className="font-mono text-sm mt-1">{worker}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Difficulty</label>
                <Badge variant="outline" className="mt-1">{difficultyWeight.toString()}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="text-sm mt-1">
                  {formatDistanceToNow(new Date(Number(timestamp) * 1000), { addSuffix: true })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Deadline</label>
                <p className={`text-sm mt-1 ${isExpired ? 'text-destructive font-medium' : ''}`}>
                  {formatDistanceToNow(new Date(Number(deadline) * 1000), { addSuffix: true })}
                </p>
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
                      Review Work Files
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Approval Action */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Approve This Task
            </CardTitle>
            <CardDescription>
              By approving, you confirm the worker completed the task satisfactorily
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-green-800 dark:text-green-200">
                Reputation Impact
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                This approval will add <strong>{difficultyWeight.toString()} points</strong> to the worker's 
                permanent reputation score. This action cannot be undone.
              </p>
            </div>

            <Button 
              onClick={handleApprove}
              disabled={isApproving || isPending || isConfirming || isExpired}
              className="w-full"
              size="lg"
            >
              {isApproving || isPending || isConfirming ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  {isApproving ? 'Approving...' : isPending ? 'Confirming...' : 'Processing...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Approve Task
                </div>
              )}
            </Button>

            <div className="text-center">
              <Button asChild variant="link" size="sm">
                <Link href={`/tasks/${taskId}/signature`}>
                  Prefer mobile signature? Click here
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}