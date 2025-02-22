"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { ContentInsights as ContentInsightsType } from "@/types"

type ContentInsightsProps = {
  insights: ContentInsightsType
}

export default function ContentInsights({ insights }: ContentInsightsProps) {
  const retentionData = insights.retention.graph.map((value, index) => ({
    second: index,
    retention: value,
  }))

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Viewer Retention</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retentionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="second" label={{ value: "Time (seconds)", position: "bottom" }} />
                <YAxis label={{ value: "Retention %", angle: -90, position: "left" }} />
                <Tooltip />
                <Line type="monotone" dataKey="retention" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Average retention rate: {insights.retention.averageRate}%
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Engagement Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold">{insights.engagement.predicted}%</div>
              <div className="text-sm text-muted-foreground">Predicted Engagement</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{insights.engagement.current}%</div>
              <div className="text-sm text-muted-foreground">Current Engagement</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Improvement Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {insights.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

