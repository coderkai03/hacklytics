"use client"

import type React from "react"

import { useState } from "react"
import { Upload, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import type { ContentType, UploadGoals } from "@/types"

type PreUploadFormProps = {
  onSubmit: (contentType: ContentType, goals: UploadGoals, file: File) => void
}

export default function PreUploadForm({ onSubmit }: PreUploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [contentType, setContentType] = useState<ContentType>("tiktok")
  const [goals, setGoals] = useState<UploadGoals>({
    views: 10000,
    revenue: 100,
    engagement: 50,
  })
  const [thumbnail, setThumbnail] = useState<string>("")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)

    // Generate video thumbnail
    const video = document.createElement("video")
    video.preload = "metadata"
    video.src = URL.createObjectURL(selectedFile)

    video.onloadedmetadata = () => {
      video.currentTime = 1 // Seek to 1 second
    }

    video.onseeked = () => {
      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext("2d")
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

      setThumbnail(canvas.toDataURL())
      URL.revokeObjectURL(video.src)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    onSubmit(contentType, goals, file)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Video</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-center">
                {thumbnail ? (
                  <img
                    src={thumbnail || "/placeholder.svg"}
                    alt="Video thumbnail"
                    className="max-w-md rounded-lg shadow-lg"
                  />
                ) : (
                  <label
                    htmlFor="video-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">MP4, MOV up to 800MB</p>
                    </div>
                    <Input
                      id="video-upload"
                      type="file"
                      className="hidden"
                      accept="video/*"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Content Type</Label>
                  <RadioGroup
                    value={contentType}
                    onValueChange={(value) => setContentType(value as ContentType)}
                    className="grid grid-cols-3 gap-4 mt-2"
                  >
                    <Label
                      htmlFor="tiktok"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                    >
                      <RadioGroupItem value="tiktok" id="tiktok" className="sr-only" />
                      <TrendingUp className="mb-3 h-6 w-6" />
                      TikTok
                    </Label>
                    <Label
                      htmlFor="youtube_shorts"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                    >
                      <RadioGroupItem value="youtube_shorts" id="youtube_shorts" className="sr-only" />
                      <TrendingUp className="mb-3 h-6 w-6" />
                      YouTube Shorts
                    </Label>
                    <Label
                      htmlFor="instagram_reels"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                    >
                      <RadioGroupItem value="instagram_reels" id="instagram_reels" className="sr-only" />
                      <TrendingUp className="mb-3 h-6 w-6" />
                      Instagram Reels
                    </Label>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Goals</Label>
                  <div className="grid gap-4 mt-2">
                    <div className="space-y-2">
                      <Label>Target Views</Label>
                      <Slider
                        value={[goals.views]}
                        onValueChange={(value) => setGoals({ ...goals, views: value[0] })}
                        min={1000}
                        max={1000000}
                        step={1000}
                      />
                      <div className="text-sm text-muted-foreground">{goals.views.toLocaleString()} views</div>
                    </div>

                    <div className="space-y-2">
                      <Label>Target Revenue ($)</Label>
                      <Slider
                        value={[goals.revenue]}
                        onValueChange={(value) => setGoals({ ...goals, revenue: value[0] })}
                        min={0}
                        max={10000}
                        step={50}
                      />
                      <div className="text-sm text-muted-foreground">${goals.revenue.toLocaleString()}</div>
                    </div>

                    <div className="space-y-2">
                      <Label>Target Engagement Rate (%)</Label>
                      <Slider
                        value={[goals.engagement]}
                        onValueChange={(value) => setGoals({ ...goals, engagement: value[0] })}
                        min={0}
                        max={100}
                        step={1}
                      />
                      <div className="text-sm text-muted-foreground">{goals.engagement}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={!file}>
          Start Analysis
        </Button>
      </div>
    </form>
  )
}

