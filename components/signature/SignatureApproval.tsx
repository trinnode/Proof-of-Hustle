'use client'

import { useState } from 'react'
import { useAccount, useSignTypedData } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useProofOfHustleContract, useTaskData } from '@/hooks/useContract'
import { createApprovalMessage, generateSignatureDeadline } from '@/lib/signature'
import { TASK_CATEGORIES } from '@/lib/constants'
import { toast } from 'sonner'
import { CheckCircle, FileText, PenTool, Smartphone, Zap } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface SignatureApprovalProps {
  taskId: string
}

export function SignatureApproval({ taskId }: SignatureApprovalProps) {
  const { address } = useAccount()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [signatureData, setSignatureData] = useState<{
    signature: `0x${string}`
    deadline: bigint
  } | null>(null)

  const { data: taskData, isLoading: taskLoading } = useTaskData(BigInt(taskId))
  const { signTypedDataAsync } = useSignTypedData()
  const { approveTaskWithSignature, isPending, isConfirming } = useProofOfHustleContract()

  const handleSignApproval = async () => {
    if (!address || !taskData) return

    try {
      const deadline = generateSignatureDeadline()
      const nonce = BigInt(Date.now()) // In production, get from contract
      
      const message = createApprovalMessage({
        taskId: BigInt(taskId),
        client: address,
        nonce,
        deadline
      })

      const signature = await signTypedDataAsync(message)
      
      setSignatureData({ signature, deadline })
      toast.success('Signature created! You can now submit it to approve the task.')
      
    } catch (error) {
      console.error('Error signing approval:', error)
      toast.error('Failed to create signature. Please try again.')
    }
  }

  const handleSubmitSignature = async () => {
    if (!signatureData) return

    try {
      setIsSubmitting(true)
      await approveTaskWithSignature(
        BigInt(taskId),
        signatureData.deadline,
        signatureData.signature
      )
      toast.success('Task approved successfully!')
    } catch (error) {
      console.error('Error submitting signature:', error)
      toast.error('Failed to submit approval. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (taskLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3">Loading task details...</span>
        </CardContent>
      </Card>
    )
  }

  if (!taskData) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Task Not Found</h3>
          <p className="text-muted-foreground">
            The requested task could not be found.
          </p>
        </CardContent>
      </Card>
    )
  }

  const [worker, client, timestamp, deadline, status, category, difficultyWeight, ipfsCid] = taskData
  const isClient = address?.toLowerCase() === client.toLowerCase()

  if (!isClient) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Not Authorized</h3>
          <p className="text-muted-foreground">
            Only the client can approve this task.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Task Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Task #{taskId}
          </CardTitle>
          <CardDescription>
            Review the work and approve using your mobile signature
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Worker</label>
              <p className="font-mono text-sm">{worker}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Category</label>
              <p>{TASK_CATEGORIES[category as keyof typeof TASK_CATEGORIES]}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Difficulty</label>
              <Badge variant="outline">{difficultyWeight.toString()}</Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Deadline</label>
              <p className="text-sm">
                {formatDistanceToNow(new Date(Number(deadline) * 1000), { addSuffix: true })}
              </p>
            </div>
          </div>

          {ipfsCid && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Proof of Work</label>
              <Button asChild variant="outline" size="sm" className="mt-2">
                <a 
                  href={`https://gateway.pinata.cloud/ipfs/${ipfsCid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  View Files
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Signature Approval Flow */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Mobile Signature Approval
          </CardTitle>
          <CardDescription>
            Sign the approval on your mobile device - no gas fees required!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!signatureData ? (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  How it works:
                </h4>
                <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                  <li>Click "Sign Approval" to create a cryptographic signature</li>
                  <li>Your wallet will ask you to sign (no gas fees)</li>
                  <li>Submit the signature to approve the task</li>
                  <li>Worker's reputation updates instantly</li>
                </ol>
              </div>

              <Button 
                onClick={handleSignApproval}
                className="w-full"
                size="lg"
              >
                <PenTool className="w-4 h-4 mr-2" />
                Sign Approval
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-green-800 dark:text-green-200">
                    Signature Created Successfully!
                  </h4>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your approval signature is ready. Click submit to finalize the approval.
                </p>
              </div>

              <Button 
                onClick={handleSubmitSignature}
                disabled={isSubmitting || isPending || isConfirming}
                className="w-full"
                size="lg"
              >
                {isSubmitting || isPending || isConfirming ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    {isSubmitting ? 'Submitting...' : isPending ? 'Confirming...' : 'Processing...'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Submit Approval
                  </div>
                )}
              </Button>
            </div>
          )}

          <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
            <strong>Pro tip:</strong> Signature approvals are free for you! Someone else pays the small gas fee to submit your signature to the blockchain.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}