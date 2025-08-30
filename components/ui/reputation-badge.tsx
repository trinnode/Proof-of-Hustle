'use client'

import { Badge } from './badge'
import { REPUTATION_LEVELS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface ReputationBadgeProps {
  score: number
  className?: string
}

export function ReputationBadge({ score, className }: ReputationBadgeProps) {
  const level = REPUTATION_LEVELS.find(l => score >= l.min && score < l.max) || REPUTATION_LEVELS[0]
  
  return (
    <Badge 
      className={cn(
        "text-white font-medium px-3 py-1",
        level.color,
        className
      )}
    >
      {level.label}
    </Badge>
  )
}