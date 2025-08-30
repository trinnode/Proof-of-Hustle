'use client'

import { CreateTaskForm } from '@/components/tasks/CreateTaskForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { InfoIcon, Zap } from 'lucide-react'

export default function CreateTaskPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 justify-center">
          <Zap className="w-6 sm:w-8 h-6 sm:h-8 text-primary" />
          <span>Create New Task</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
          Submit your completed work for client approval and permanently add it to your professional record
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Important Notice */}
        <Alert className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
          <InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Important:</strong> Only create tasks for work you've already completed. 
            Your client will need to approve the task to build your reputation.
          </AlertDescription>
        </Alert>

        {/* Form Card */}
        <Card>
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">Task Details</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Provide information about your completed work
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateTaskForm />
          </CardContent>
        </Card>

        {/* Process Flow */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">What happens next?</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Follow this simple process to build your reputation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="space-y-4 sm:space-y-5">
              {[
                {
                  step: '1',
                  title: 'Task Created',
                  description: 'Your task is recorded on the blockchain with proof of work',
                  color: 'bg-blue-500'
                },
                {
                  step: '2',
                  title: 'Client Notification',
                  description: 'Share the task link with your client for approval',
                  color: 'bg-purple-500'
                },
                {
                  step: '3',
                  title: 'Reputation Boost',
                  description: 'Once approved, your Hustle Score increases permanently',
                  color: 'bg-green-500'
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full ${item.color} flex items-center justify-center text-white font-bold text-sm sm:text-base mt-0.5 flex-shrink-0`}>
                    {item.step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base mb-1">{item.title}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border border-purple-100 dark:border-purple-800">
              <h4 className="font-semibold text-sm sm:text-base mb-2 text-purple-800 dark:text-purple-200">
                💡 Pro Tip
              </h4>
              <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 leading-relaxed">
                Higher difficulty weights give you more reputation points. Choose the appropriate level 
                that reflects the complexity and value of your completed work.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}