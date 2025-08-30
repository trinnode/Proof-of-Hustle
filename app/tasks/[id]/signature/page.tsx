'use client'

import { useParams } from 'next/navigation'
import { SignatureApproval } from '@/components/signature/SignatureApproval'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TaskSignaturePage() {
  const params = useParams()
  const taskId = params.id as string

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
          Mobile Signature Approval
        </h1>
        <p className="text-muted-foreground">
          Approve Task #{taskId} using your mobile wallet signature
        </p>
      </div>

      <SignatureApproval taskId={taskId} />
    </div>
  )
}