import React from 'react'
import { TestDefaultBlocks } from '@/components/ui/test-customized-blocks'

export default function DefaultBlocksPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Default shadcn Blocks
          </h1>
          <p className="text-lg text-muted-foreground">
            Beautiful default components with proper rounded corners
          </p>
        </div>
        <TestDefaultBlocks />
      </div>
    </div>
  )
}