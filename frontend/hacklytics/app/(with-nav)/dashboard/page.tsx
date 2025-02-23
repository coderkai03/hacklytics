"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import VideoAnalysis from "@/components/VideoAnalysis";
import { uploadToS3 } from "@/utils/s3";
import { toast } from "@/components/ui/use-toast";

interface AnalysisData {
  videoUrl: string;
  predictedViews: number;
  videoLength: number;
  estimatedRevenue: number;
}

export default function DashboardPage() {
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 800 * 1024 * 1024) { // 800MB limit
      toast({
        title: "Error",
        description: "File size must be less than 800MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Upload to S3
      const videoUrl = await uploadToS3(file);
      
      // Get video analysis
      const response = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl }),
      });
      
      if (!response.ok) throw new Error('Analysis failed');
      
      const data = await response.json();
      setAnalysisData({ videoUrl, ...data });
      setVideoUploaded(true);
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Error",
        description: "Failed to upload and analyze video",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (videoUploaded && analysisData) {
    return <VideoAnalysis initialData={analysisData} />;
  }

  return (
    <div className="relative min-h-[80vh] flex items-center">
      {/* Background effects from landing page */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-100/80 via-sky-50/50 to-white -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c708_1px,transparent_1px),linear-gradient(to_bottom,#0284c708_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />

      <div className="w-full max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block mb-6 px-4 py-1.5 bg-sky-100 rounded-full text-sm font-medium text-sky-600">
            Let&apos;s Create Magic ✨
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
            Your Creative Journey Starts Here
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform your content with AI-powered insights. Upload your first
            video and watch the magic happen.
          </p>
        </div>

        <label className="block w-full cursor-pointer group">
          <div className="relative p-16 rounded-3xl bg-gradient-to-b from-white/80 to-sky-50/50 border-2 border-dashed border-sky-200 hover:border-sky-400 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(14_165_233_/_0.2)]">
            <div className="absolute inset-0 bg-grid-pattern opacity-50" />
            <div className="relative text-center">
              <div className="mb-8 mx-auto w-24 h-24 rounded-2xl bg-sky-100/80 flex items-center justify-center group-hover:scale-110 group-hover:bg-sky-200/80 transition-all duration-500">
                <Upload className="w-12 h-12 text-sky-500 group-hover:rotate-6 transition-transform" />
              </div>
              <h2 className="text-3xl font-semibold mb-4 text-gray-900">
                Drop Your Video Here
              </h2>
              <p className="text-lg text-gray-600 mb-3">
                <span className="font-medium text-sky-600">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-sm text-gray-500 tracking-wide">
                Supports MP4, MOV, or WebM • Up to 800MB
              </p>
              {isUploading && (
                <div className="mt-10 flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-3 border-sky-500 border-t-transparent"></div>
                  <p className="text-base text-gray-600 mt-4">
                    Uploading and analyzing your content...
                  </p>
                </div>
              )}
            </div>
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
    </div>
  );
}
