"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Video = {
  id: number
  title: string
  views: string
  hookScore: number
  retention: string
}

export default function VideoList() {
  const [videos, setVideos] = useState<Video[]>([])

  useEffect(() => {
    const fetchVideos = async () => {
      const response = await fetch("/api/videos")
      const result = await response.json()
      setVideos(result)
    }

    fetchVideos()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Videos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Hook Score</TableHead>
              <TableHead>Retention</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell className="font-medium">{video.title}</TableCell>
                <TableCell>{video.views}</TableCell>
                <TableCell>{video.hookScore}</TableCell>
                <TableCell>{video.retention}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

