"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PreUploadForm from "./PreUploadForm"
import UploadProgress from "./UploadProgress"
import PostAnalysisDashboard from "./PostAnalysisDashboard"
import type { ContentType, UploadGoals, VideoAnalysis } from "@/types"

export default function UploadFlow() {
  const [step, setStep] = useState<"pre-upload" | "uploading" | "analysis">("pre-upload")
  const [videoData, setVideoData] = useState<VideoAnalysis | null>(null)

  const handlePreUploadSubmit = async (contentType: ContentType, goals: UploadGoals, file: File) => {
    setStep("uploading")

    // Create form data with metadata
    const formData = new FormData()
    formData.append("video", file)
    formData.append("contentType", contentType)
    formData.append("goals", JSON.stringify(goals))

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      setVideoData(data)
      setStep("analysis")
    } catch (error) {
      console.error("Upload error:", error)
      setStep("pre-upload")
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {step === "pre-upload" && (
          <motion.div
            key="pre-upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <PreUploadForm onSubmit={handlePreUploadSubmit} />
          </motion.div>
        )}

        {step === "uploading" && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <UploadProgress videoId={videoData?.id} />
          </motion.div>
        )}

        {step === "analysis" && videoData && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <PostAnalysisDashboard analysis={videoData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

