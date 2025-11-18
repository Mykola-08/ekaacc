import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Sparkles, Heart, Shield, Zap } from 'lucide-react'

export default function DefaultBlocksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/20 to-blue-50/20">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            shadcn/ui Components Showcase
          </h1>
          <p className="text-lg text-muted-foreground">
            Beautiful components with enhanced styling and proper rounded corners
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/50 backdrop-blur-sm border-purple-100 hover:shadow-lg hover:shadow-purple-100 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Premium Design</CardTitle>
              <CardDescription>Beautiful gradient backgrounds and glassmorphism effects</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-purple-100 hover:shadow-lg hover:shadow-purple-100 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">User Experience</CardTitle>
              <CardDescription>Enhanced user experience with smooth animations</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={75} className="mb-2" />
              <Badge variant="outline" className="border-purple-200 text-purple-700">
                75% Complete
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-purple-100 hover:shadow-lg hover:shadow-purple-100 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Security First</CardTitle>
              <CardDescription>Built with security and privacy in mind</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Secure
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Private
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-purple-100 hover:shadow-lg hover:shadow-purple-100 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Performance</CardTitle>
              <CardDescription>Optimized for speed and efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-purple-200 hover:bg-purple-50">
                View Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}