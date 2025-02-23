import { Share2, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface VideoMetrics {
  videoUrl: string;
  predictedViews: number;
  videoLength: number;
  estimatedRevenue: number;
}

interface VideoAnalysisProps {
  initialData?: VideoMetrics;
}

export default function VideoAnalysis({ initialData }: VideoAnalysisProps) {
  const [metrics, setMetrics] = useState<VideoMetrics | null>(initialData || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialData) {
      fetchVideoMetrics();
    }
  }, [initialData]);

  const fetchVideoMetrics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze-video');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 space-y-8 mt-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Video Analysis
          </h1>
          <p className="text-gray-500 mt-2">Powered by AI insights</p>
        </div>
        <Button
          variant="outline"
          onClick={fetchVideoMetrics}
          className="hover:bg-sky-50 transition-all duration-300 border-sky-200 hover:border-sky-300 rounded-xl px-6"
        >
          <Sparkles className="w-4 h-4 mr-2 text-sky-500" />
          {loading ? 'Analyzing...' : 'Analyze New Video'}
        </Button>
      </div>

      {/* Video Preview and Metrics */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-8 hover:shadow-xl transition-all duration-500 border border-sky-100/50 rounded-2xl bg-gradient-to-b from-white to-sky-50/30">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Video Preview
            </h2>
            <div className="space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-sky-50 transition-all duration-300 rounded-xl"
              >
                <Share2 className="h-4 w-4 mr-2 text-sky-500" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-sky-50 transition-all duration-300 rounded-xl"
              >
                <Download className="h-4 w-4 mr-2 text-sky-500" />
                Download
              </Button>
            </div>
          </div>
          <div className="aspect-video bg-sky-50 rounded-xl overflow-hidden transition-all duration-500 hover:scale-[1.01] shadow-lg">
            {metrics?.videoUrl && (
              <video 
                src={metrics.videoUrl} 
                controls 
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </Card>

        {/* Metrics Cards */}
        <div className="space-y-8">
          <Card className="p-8 rounded-2xl border-sky-100/50 bg-gradient-to-br from-white to-sky-50/30 hover:shadow-xl transition-all duration-500">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">
              Predicted Views
            </h3>
            <div className="space-y-4">
              <div className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-sky-500 bg-clip-text text-transparent">
                {loading ? 'Calculating...' : metrics?.predictedViews?.toLocaleString() || '---'}
              </div>
              <div className="text-sm text-gray-600">
                Based on current trending patterns and video metrics
              </div>
            </div>
          </Card>

          <Card className="p-8 rounded-2xl border-sky-100/50 bg-gradient-to-br from-white to-sky-50/30 hover:shadow-xl transition-all duration-500">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">
              Estimated Revenue
            </h3>
            <div className="space-y-4">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                {loading ? 'Calculating...' : `$${metrics?.estimatedRevenue?.toFixed(2) || '---'}`}
              </div>
              <div className="text-sm text-gray-600">
                Based on video length ({metrics?.videoLength || '---'} min) and predicted views
              </div>
              <div className="text-xs text-gray-500">
                {metrics?.videoLength && metrics.videoLength >= 8 ? '2 ads per view (mid-rolls)' : '1 ad per view'}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
