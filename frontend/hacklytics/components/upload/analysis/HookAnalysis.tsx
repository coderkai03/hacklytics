"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { HookAnalysis as HookAnalysisType } from "@/types"

type HookAnalysisProps = {
  hook: HookAnalysisType
}

export default function HookAnalysis({ hook }: HookAnalysisProps) {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Hook Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-muted stroke-current"
                  strokeWidth="10"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-primary stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  style={{
                    strokeDasharray: 251.2,
                    strokeDashoffset: 251.2 - (251.2 * hook.score) / 10,
                  }}
                />
                <text x="50" y="50" dominantBaseline="middle" textAnchor="middle" className="text-2xl font-bold">
                  {hook.score}/10
                </text>
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hook Timing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Optimal hook duration: {hook.timing.start}s - {hook.timing.end}s
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alternative Hook Ideas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {hook.alternatives.map((alt, index) => (
              <Badge key={index} variant="secondary">
                {alt}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

