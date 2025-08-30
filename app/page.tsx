'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Shield, Zap, Globe, CheckCircle, Star, TrendingUp, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HomePage() {
  const features = [
    {
      icon: Shield,
      title: 'Immutable Reputation',
      description: 'Your work history is permanently recorded on blockchain - no platform can delete it'
    },
    {
      icon: Zap,
      title: 'Instant Verification',
      description: 'Cryptographic proof of completed work that anyone can verify'
    },
    {
      icon: Globe,
      title: 'Platform Independent',
      description: 'Your reputation travels with you across any platform or service'
    }
  ]

  const stats = [
    { label: 'Tasks Completed', value: '10,247', icon: CheckCircle },
    { label: 'Active Workers', value: '1,834', icon: Star },
    { label: 'Total Reputation', value: '2.4M', icon: TrendingUp }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24 lg:py-32 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Your Work, Your Reputation,
              <br />
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">Forever</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-4xl mx-auto px-4">
              Build an <strong>immutable professional reputation</strong> on the blockchain. 
              No platform can delete it, no company can control it.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Button asChild size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto">
                <Link href="/create-task">
                  <Zap className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                  Start Building Reputation
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto">
                <Link href="/dashboard">
                  View Dashboard
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <div className="p-2 sm:p-3 rounded-full bg-primary/10">
                        <stat.icon className="w-6 sm:w-8 h-6 sm:h-8 text-primary" />
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{stat.value}</div>
                    <div className="text-sm sm:text-base text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              Why Proof of Hustle?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Traditional platforms control your reputation. We give it back to you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary group">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm sm:text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Three simple steps to build your permanent reputation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                step: '01',
                title: 'Create Task',
                description: 'Upload your completed work and set client details. Pay a small fee to prevent spam.',
                icon: FileText
              },
              {
                step: '02', 
                title: 'Client Approves',
                description: 'Client reviews your work and approves it directly or via mobile signature.',
                icon: CheckCircle
              },
              {
                step: '03',
                title: 'Reputation Grows',
                description: 'Your Hustle Score increases permanently. This record can never be deleted.',
                icon: TrendingUp
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <Card className="text-center h-full hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div className="mx-auto mb-3 sm:mb-4 relative">
                      <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300">
                        {step.step}
                      </div>
                    </div>
                    <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
                      <step.icon className="w-4 sm:w-5 h-4 sm:h-5" />
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm sm:text-base leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
                
                {index < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 lg:w-8 h-6 lg:h-8 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
              Ready to Own Your Reputation?
            </h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90 max-w-3xl mx-auto px-4 leading-relaxed">
              Join the future of work where your professional record is truly yours. 
              Start building your immutable reputation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Button asChild size="lg" variant="secondary" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto">
                <Link href="/create-task">
                  <Zap className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                  Create Your First Task
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto border-white text-white hover:bg-white hover:text-purple-600">
                <Link href="/reputation">
                  View Reputation System
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}