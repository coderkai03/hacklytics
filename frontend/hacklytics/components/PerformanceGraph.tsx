"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

type PerformanceData = {
  date: string
  views: number
  revenue: number
}

export default function PerformanceGraph({ timeRange }: { timeRange: string }) {
  const [data, setData] = useState<PerformanceData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`)
      const result = await response.json()
      setData(result)
    }

    fetchData()
  }, [timeRange])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="views" stroke="#3b82f6" />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f59e0b" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

