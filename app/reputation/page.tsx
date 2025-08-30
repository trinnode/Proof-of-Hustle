'use client'

// import { ReputationDashboard } from '@/components/reputation/ReputationDashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { REPUTATION_LEVELS } from '@/lib/constants'
import { Award, BarChart3, Info } from 'lucide-react'
import dynamic from "next/dynamic"

const ReputationDashboard = dynamic(
  () =>
    import("@/components/reputation/ReputationDashboard"),
  { ssr: false }
);

export default function ReputationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Award className="w-8 h-8 text-primary" />
          Reputation System
        </h1>
        <p className="text-muted-foreground">
          Your permanent, blockchain-verified professional record
        </p>
      </div>

      <div className="space-y-8">
        <ReputationDashboard />

        {/* Reputation System Explanation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                How Reputation Works
              </CardTitle>
              <CardDescription>
                Understanding your Hustle Score calculation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Score Components</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div>
                      <strong>Difficulty Weight:</strong> Higher complexity tasks give more points (1-1000)
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div>
                      <strong>Reliability:</strong> Fewer disputes = higher reliability percentage
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div>
                      <strong>Experience:</strong> Total number of completed tasks
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Reputation Benefits</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Permanent record that travels across platforms</li>
                  <li>• Cryptographically verifiable achievements</li>
                  <li>• No platform can delete or manipulate your history</li>
                  <li>• Build trust with new clients instantly</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Reputation Levels
              </CardTitle>
              <CardDescription>
                Progress through different reputation tiers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {REPUTATION_LEVELS.map((level, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className={`w-4 h-4 rounded-full ${level.color}`} />
                    <div className="flex-1">
                      <div className="font-medium">{level.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {level.min.toLocaleString()}+ points
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Info className="w-5 h-5" />
              Security & Permanence
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700 dark:text-blue-300">
            <ul className="space-y-2 text-sm">
              <li>• All reputation data is stored permanently on the Lisk blockchain</li>
              <li>• No single entity can modify or delete your work history</li>
              <li>• Cryptographic signatures ensure all approvals are authentic</li>
              <li>• Your reputation is tied to your wallet address forever</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}