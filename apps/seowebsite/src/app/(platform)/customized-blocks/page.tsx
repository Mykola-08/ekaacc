import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card'
import { Button } from '@/components/platform/ui/button'
import { Badge } from '@/components/platform/ui/badge'
import { Progress } from '@/components/platform/ui/progress'
import { Sparkles, Heart, Shield, Zap } from 'lucide-react'
import { PageContainer } from '@/components/platform/eka/page-container'
import { PageHeader } from '@/components/platform/eka/page-header'
import { SurfacePanel } from '@/components/platform/eka/surface-panel'

export default function DefaultBlocksPage() {
  return (
    <PageContainer>
      <PageHeader
        title="shadcn/ui Components Showcase"
        description="Reusable components with minimalist styling and consistent rounded corners"
      />
      <SurfacePanel className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/50 backdrop-blur-sm border-purple-100 hover:shadow-lg hover:shadow-purple-100 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Premium Design</CardTitle>
              <CardDescription>Beautiful gradient backgrounds and glassmorphism effects</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="default">
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-purple-100 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
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

          <Card className="bg-white/50 backdrop-blur-sm border-purple-100 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
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

          <Card className="bg-white/50 backdrop-blur-sm border-purple-100 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Performance</CardTitle>
              <CardDescription>Optimized for speed and efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </CardContent>
          </Card>
      </SurfacePanel>
    </PageContainer>
  )
}