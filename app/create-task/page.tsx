'use client'

import { CreateTaskForm } from '@/components/tasks/CreateTaskForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { InfoIcon, Zap } from 'lucide-react'

export default function CreateTaskPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 justify-center">
          <Zap className="w-8 h-8 text-primary" />
          Create New Task
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Submit your completed work for client approval and permanently add it to your professional record
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> Only create tasks for work you've already completed. 
            Your client will need to approve the task to build your reputation.
          </AlertDescription>
        </Alert>

        <CreateTaskForm />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What happens next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium">Task Created</p>
                <p className="text-sm text-muted-foreground">Your task is recorded on the blockchain with proof of work</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium">Client Notification</p>
                <p className="text-sm text-muted-foreground">Share the task link with your client for approval</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium">Reputation Boost</p>
                <p className="text-sm text-muted-foreground">Once approved, your Hustle Score increases permanently</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}