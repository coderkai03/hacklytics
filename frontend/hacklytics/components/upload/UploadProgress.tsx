"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type UploadProgressProps = {
  videoId?: string
}

export default function UploadProgress({ videoId }: UploadProgressProps) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<string>("Initializing...")

  useEffect(() => {
    if (!videoId) return

    const statuses = [
      "Processing video...",
      "Analyzing hook...",
      "Calculating retention...",
      "Generating insights...",
      "Preparing recommendations...",
    ]

    let currentStatus = 0
    const statusInterval = setInterval(() => {
      if (currentStatus < statuses.length) {
        setStatus(statuses[currentStatus])
        currentStatus++
      }
    }, 2000)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          clearInterval(statusInterval)
          return 100
        }
        return prev + 1
      })
    }, 100)

    return () => {
      clearInterval(progressInterval)
      clearInterval(statusInterval)
    }
  }, [videoId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyzing Your Video</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground">{status}</p>
        </div>
      </CardContent>
    </Card>
  )
}

