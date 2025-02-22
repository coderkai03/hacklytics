"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HookAnalysis from "./analysis/HookAnalysis"
import ContentInsights from "./analysis/ContentInsights"
import RevenueProjections from "./analysis/RevenueProjections"
import type { VideoAnalysis } from "@/types"

type PostAnalysisDashboardProps = {
  analysis: VideoAnalysis
}

export default function PostAnalysisDashboard({ analysis }: PostAnalysisDashboardProps) {
  return (
    <Tabs defaultValue="hook" className="space-y-6">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="hook">Hook Analysis</TabsTrigger>
        <TabsTrigger value="insights">Content Insights</TabsTrigger>
        <TabsTrigger value="revenue">Revenue Projections</TabsTrigger>
      </TabsList>

      <TabsContent value="hook">
        <HookAnalysis hook={analysis.hook} />
      </TabsContent>

      <TabsContent value="insights">
        <ContentInsights insights={analysis.insights} />
      </TabsContent>

      <TabsContent value="revenue">
        <RevenueProjections projections={analysis.revenue} />
      </TabsContent>
    </Tabs>
  )
}

