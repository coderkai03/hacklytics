"use client";

import { useState } from "react";
import { Upload, RefreshCcw } from "lucide-react";
import VideoAnalysis from "@/components/VideoAnalysis";
import { analyzeVideo, VideoAnalysisResult } from "@/services/videoService";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VideoAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);
      
      // Analyze the video
      const result = await analyzeVideo(file);
      setAnalysisResult(result);
      setVideoUploaded(true);
      
    } catch (error) {
      console.error('Upload/analysis failed:', error);
      setError('Failed to analyze video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetState = () => {
    setVideoUploaded(false);
    setAnalysisResult(null);
    setError(null);
  };

  if (videoUploaded && analysisResult) {
    return (
      <div>
                <div className="flex justify-center mt-2">
          <Button
            onClick={resetState}
            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <RefreshCcw className="w-5 h-5" />
            Upload Another File
          </Button>
        </div>
        <VideoAnalysis analysisResult={analysisResult} />

      </div>
    );
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
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-200 border-t-sky-500"></div>
                  <div className="mt-4 space-y-2 text-center">
                    <p className="text-base font-medium text-gray-800">
                      Processing Your Video
                    </p>
                    <p className="text-sm text-gray-600">
                      This might take a few moments...
                    </p>
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <p className="mt-4 text-red-600 text-sm">
                  {error}
                </p>
              )}
            </div>
          </div>
          <input
            type="file"
            className="hidden"
            accept="video/*"
            onChange={(event) => {
              if (event.target.files) {
                const file = event.target.files[0];
                handleFileUpload(file);
              }
            }}
            disabled={isUploading}
          />
        </label>
      </div>
    </div>
  );
}
