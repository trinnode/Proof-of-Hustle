'use client'

import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ReputationBadge } from '@/components/ui/reputation-badge'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useHustleScore, useReputationData } from '@/hooks/useContract'
import { REPUTATION_LEVELS } from '@/lib/constants'
import { AlertCircle, Award, BarChart3, CheckCircle, Target, TrendingUp, Zap } from 'lucide-react'

export function ReputationDashboard() {
  const { address } = useAccount()
  
  const { data: hustleScore, isLoading: scoreLoading } = useHustleScore(address as `0x${string}`)
  const { data: reputationData, isLoading: dataLoading } = useReputationData(address as `0x${string}`)

  if (!address) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-muted-foreground text-center">
            Connect your wallet to view your reputation dashboard
          </p>
        </CardContent>
      </Card>
    )
  }

  if (scoreLoading || dataLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3">Loading reputation data...</span>
        </CardContent>
      </Card>
    )
  }

  const score = hustleScore ? Number(hustleScore[0]) : 0
  const reliability = hustleScore ? Number(hustleScore[1]) : 0
  const experience = hustleScore ? Number(hustleScore[2]) : 0
  
  const taskCount = reputationData ? Number(reputationData.taskCount) : 0
  const disputeCount = reputationData ? Number(reputationData.disputeCount) : 0

  const currentLevel = REPUTATION_LEVELS.find(l => score >= l.min && score < l.max) || REPUTATION_LEVELS[0]
  const nextLevel = REPUTATION_LEVELS.find(l => l.min > score)
  const progressToNext = nextLevel ? ((score - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100

  return (
    <div className="space-y-6">
      {/* Main Reputation Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-600/10" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Award className="w-8 h-8 text-primary" />
                Your Reputation
              </CardTitle>
              <CardDescription>
                Your permanent, blockchain-verified professional record
              </CardDescription>
            </div>
            <ReputationBadge score={score} className="text-lg px-4 py-2" />
          </div>
        </CardHeader>
        <CardContent className="relative space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {score.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Hustle Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {reliability}%
              </div>
              <div className="text-sm text-muted-foreground">Reliability</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {experience}
              </div>
              <div className="text-sm text-muted-foreground">Tasks Completed</div>
            </div>
          </div>

          {nextLevel && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to {nextLevel.label}</span>
                <span>{Math.round(progressToNext)}%</span>
              </div>
              <Progress value={progressToNext} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {(nextLevel.min - score).toLocaleString()} points to next level
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{taskCount}</div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{disputeCount}</div>
                <div className="text-sm text-muted-foreground">Disputes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {taskCount > 0 ? Math.round((score / taskCount) * 100) / 100 : 0}
                </div>
                <div className="text-sm text-muted-foreground">Avg Score/Task</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{currentLevel.label}</div>
                <div className="text-sm text-muted-foreground">Current Level</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reputation Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Reputation Breakdown
          </CardTitle>
          <CardDescription>
            How your reputation score is calculated
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Score Components</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Task Difficulty Average</span>
                  <Badge variant="outline">
                    {taskCount > 0 ? Math.round(score / taskCount) : 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Reliability Rate</span>
                  <Badge variant="outline">{reliability}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Experience Multiplier</span>
                  <Badge variant="outline">
                    {experience > 100 ? '2.0x' : experience > 50 ? '1.5x' : '1.0x'}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Level Progression</h4>
              <div className="space-y-2">
                {REPUTATION_LEVELS.slice(0, 4).map((level, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${score >= level.min ? 'bg-primary' : 'bg-muted'}`} />
                    <span className={`text-sm ${score >= level.min ? 'font-medium' : 'text-muted-foreground'}`}>
                      {level.label} ({level.min.toLocaleString()}+)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}