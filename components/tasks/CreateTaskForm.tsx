'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { FileUpload } from '@/components/ui/file-upload'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { TASK_CATEGORY_OPTIONS, TASK_CREATION_FEE } from '@/lib/constants'
import { uploadToIPFS } from '@/lib/ipfs'
import { useProofOfHustleContract } from '@/hooks/useContract'
import { toast } from 'sonner'
import { Calendar, Clock, DollarSign, FileText, Zap } from 'lucide-react'

const createTaskSchema = z.object({
  clientAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  category: z.number().min(0).max(5),
  difficultyWeight: z.number().min(1).max(1000),
  deadline: z.string().min(1, 'Deadline is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
})

type CreateTaskFormData = z.infer<typeof createTaskSchema>

export function CreateTaskForm() {
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { createTask, isPending, isConfirming, isConfirmed, error } = useProofOfHustleContract()

  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      category: 0,
      difficultyWeight: 100,
      deadline: '',
      description: '',
      clientAddress: ''
    }
  })

  const onSubmit = async (data: CreateTaskFormData) => {
    if (files.length === 0) {
      toast.error('Please upload at least one file as proof of work')
      return
    }

    try {
      setIsUploading(true)
      
      // Upload files to IPFS
      const uploadResult = await uploadToIPFS(files, data.description)
      
      // Calculate deadline timestamp
      const deadlineTimestamp = Math.floor(new Date(data.deadline).getTime() / 1000)
      
      // Create task on blockchain
      await createTask(
        data.clientAddress as `0x${string}`,
        uploadResult.ipfsHash,
        data.category,
        data.difficultyWeight,
        deadlineTimestamp
      )

      toast.success('Task created successfully!')
      form.reset()
      setFiles([])
      
    } catch (error) {
      console.error('Error creating task:', error)
      toast.error('Failed to create task. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const selectedCategory = TASK_CATEGORY_OPTIONS.find(cat => cat.value === form.watch('category'))
  const difficultyWeight = form.watch('difficultyWeight')

  const getDifficultyLabel = (weight: number) => {
    if (weight <= 100) return 'Simple'
    if (weight <= 300) return 'Moderate'
    if (weight <= 600) return 'Complex'
    if (weight <= 800) return 'Advanced'
    return 'Expert'
  }

  const isLoading = isPending || isConfirming || isUploading

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center gap-2 justify-center text-2xl">
          <Zap className="w-6 h-6 text-primary" />
          Create New Task
        </CardTitle>
        <CardDescription>
          Submit your completed work for client approval and build your reputation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="clientAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Client Address
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="0x..." 
                      {...field}
                      className="font-mono"
                    />
                  </FormControl>
                  <FormDescription>
                    The Ethereum address of your client who will approve this task
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Category</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select work category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TASK_CATEGORY_OPTIONS.map((category) => (
                        <SelectItem key={category.value} value={category.value.toString()}>
                          <div className="flex items-center gap-2">
                            <span>{category.icon}</span>
                            <div>
                              <div className="font-medium">{category.label}</div>
                              <div className="text-xs text-muted-foreground">{category.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedCategory && (
                    <FormDescription>
                      {selectedCategory.icon} {selectedCategory.description}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficultyWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Difficulty Weight: {field.value} ({getDifficultyLabel(field.value)})
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={1000}
                      step={10}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    Higher difficulty = more reputation gain. Be honest about complexity.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Client Response Deadline
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="datetime-local" 
                      {...field}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </FormControl>
                  <FormDescription>
                    When should the client respond by? Tasks expire if not approved in time.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Work Description
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the work you completed for this client..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide details about what you delivered to help with verification
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label className="text-sm font-medium mb-2 block">Proof of Work Files</label>
              <FileUpload 
                onFilesChange={setFiles}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Upload screenshots, documents, or any files that prove you completed the work
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Fee Summary
              </h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Task Creation Fee:</span>
                  <span>{TASK_CREATION_FEE} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span>Gas Fees:</span>
                  <span>~$2-10 (varies)</span>
                </div>
                <div className="border-t pt-2 mt-2 font-medium flex justify-between">
                  <span>Total:</span>
                  <span>{TASK_CREATION_FEE} ETH + Gas</span>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || files.length === 0}
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  {isUploading ? 'Uploading files...' : isPending ? 'Creating task...' : 'Confirming...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Create Task ({TASK_CREATION_FEE} ETH)
                </div>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}