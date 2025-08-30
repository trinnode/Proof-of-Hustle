'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TASK_CATEGORIES, TASK_STATUS, TASK_CATEGORY_OPTIONS } from '@/lib/constants'
import { Task, TaskStatus } from '@/lib/types'
import { Calendar, Clock, ExternalLink, User, Zap } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface TaskCardProps {
  task: Task
  showActions?: boolean
  userAddress?: string
}

export function TaskCard({ task, showActions = true, userAddress }: TaskCardProps) {
  const category = TASK_CATEGORY_OPTIONS.find(cat => cat.value === parseInt(task.category.toString()))
  const isExpired = Date.now() > task.deadline * 1000
  const isClient = userAddress?.toLowerCase() === task.client.toLowerCase()
  const isWorker = userAddress?.toLowerCase() === task.worker.toLowerCase()

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.Pending:
        return isExpired ? 'destructive' : 'secondary'
      case TaskStatus.Approved:
        return 'default'
      case TaskStatus.Disputed:
        return 'destructive'
      case TaskStatus.Expired:
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusText = (status: TaskStatus) => {
    if (status === TaskStatus.Pending && isExpired) {
      return 'Expired'
    }
    return TASK_STATUS[status]
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{category?.icon}</div>
            <div>
              <h3 className="font-semibold text-lg">Task #{task.id}</h3>
              <p className="text-sm text-muted-foreground">{category?.label}</p>
            </div>
          </div>
          <Badge variant={getStatusColor(task.status)}>
            {getStatusText(task.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Worker:</span>
            <span className="font-mono text-xs">
              {task.worker.slice(0, 6)}...{task.worker.slice(-4)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Client:</span>
            <span className="font-mono text-xs">
              {task.client.slice(0, 6)}...{task.client.slice(-4)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Difficulty:</span>
            <Badge variant="outline">{task.difficultyWeight}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Created:</span>
            <span>{formatDistanceToNow(new Date(task.timestamp * 1000), { addSuffix: true })}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Deadline:</span>
          <span className={isExpired ? 'text-destructive font-medium' : ''}>
            {formatDistanceToNow(new Date(task.deadline * 1000), { addSuffix: true })}
          </span>
        </div>

        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/tasks/${task.id}`}>
                <ExternalLink className="w-4 h-4 mr-2" />
                View Details
              </Link>
            </Button>
            
            {isClient && task.status === TaskStatus.Pending && !isExpired && (
              <Button asChild size="sm" className="flex-1">
                <Link href={`/tasks/${task.id}/approve`}>
                  Approve Task
                </Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}