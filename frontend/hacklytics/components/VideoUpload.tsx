"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function VideoUpload() {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append("video", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        alert("Video uploaded successfully!")
        setFile(null)
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      console.error("Error uploading video:", error)
      alert("Failed to upload video. Please try again.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Video</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">MP4, MOV, or AVI (MAX. 800MB)</p>
            </div>
            <Input id="dropzone-file" type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
          </label>
        </div>
        {file && <p className="mt-2 text-sm text-gray-500">Selected file: {file.name}</p>}
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpload} disabled={!file}>
          Upload and Analyze
        </Button>
      </CardFooter>
    </Card>
  )
}

