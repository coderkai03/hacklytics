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
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
        Welcome to Your Dashboard
      </h1>
      <Card className="p-12 bg-white shadow-lg rounded-xl border border-sky-100">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Upload Your First Video
          </h2>
          <div className="max-w-md mx-auto">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer bg-sky-50 hover:bg-sky-100/50 border-sky-200 transition-all duration-300 ease-out group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 mb-4 text-sky-500 group-hover:scale-110 transition-transform duration-300" />
                <p className="mb-2 text-sm text-gray-600">
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
            <div className="mt-6 flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-3 border-sky-500 border-t-transparent"></div>
              <p className="text-sm text-gray-600 mt-3">
                Processing your video...
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
