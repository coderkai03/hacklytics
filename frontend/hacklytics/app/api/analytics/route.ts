import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const timeRange = searchParams.get("timeRange")

  // Here you would fetch real analytics data based on the time range
  // For this example, we'll return mock data
  const mockData = [
    { date: "2023-05-01", views: 1000, revenue: 50 },
    { date: "2023-05-02", views: 1200, revenue: 60 },
    { date: "2023-05-03", views: 1500, revenue: 75 },
    { date: "2023-05-04", views: 1800, revenue: 90 },
    { date: "2023-05-05", views: 2000, revenue: 100 },
  ]

  return NextResponse.json(mockData)
}

