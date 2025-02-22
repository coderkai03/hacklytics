import { NextResponse } from "next/server"

export async function GET() {
  // Here you would fetch real video data from your database
  // For this example, we'll return mock data
  const mockVideos = [
    { id: 1, title: "How to Make Viral TikToks", views: "1.2M", hookScore: 8.5, retention: "85%" },
    { id: 2, title: "5 Instagram Reels Hacks", views: "890K", hookScore: 7.8, retention: "79%" },
    { id: 3, title: "YouTube Shorts Success Story", views: "650K", hookScore: 9.2, retention: "92%" },
  ]

  return NextResponse.json(mockVideos)
}

