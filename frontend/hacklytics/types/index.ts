export type ContentType = "tiktok" | "youtube_shorts" | "instagram_reels"

export type UploadGoals = {
  views: number
  revenue: number
  engagement: number
}

export type HookAnalysis = {
  score: number
  timing: {
    start: number
    end: number
  }
  alternatives: string[]
}

export type ContentInsights = {
  retention: {
    graph: number[]
    averageRate: number
  }
  engagement: {
    predicted: number
    current: number
  }
  improvements: string[]
}

export type RevenueProjections = {
  expectedViews: number
  monetizationOptions: {
    type: string
    potential: number
  }[]
  roi: {
    cost: number
    expectedRevenue: number
    breakEvenPoint: number
  }
}

export type VideoAnalysis = {
  id: string
  status: "analyzing" | "completed" | "failed"
  progress: number
  hook: HookAnalysis
  insights: ContentInsights
  revenue: RevenueProjections
}

