"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import VideoAnalysis from "@/components/VideoAnalysis";

export default function DashboardPage() {
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setVideoUploaded(true);
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  if (videoUploaded) {
    return <VideoAnalysis />;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to Your Dashboard</h1>
      <Card className="p-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">
            Upload Your First Video
          </h2>
          <div className="max-w-md mx-auto">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  MP4, MOV, or WebM (MAX. 800MB)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="video/*"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          </div>
          {isUploading && (
            <div className="mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Uploading video...</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
