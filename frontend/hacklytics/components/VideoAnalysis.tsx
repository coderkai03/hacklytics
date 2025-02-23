import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Video,
  Volume2,
  BarChart,
} from "lucide-react";
import { VideoAnalysisResult } from "@/services/videoService";

// Remove unused interface
// interface VideoMetrics {
//   videoUrl: string;
//   predictedViews: number;
//   videoLength: number;
//   estimatedRevenue: number;
// }

interface VideoAnalysisProps {
  analysisResult: VideoAnalysisResult;
}

export default function VideoAnalysis({ analysisResult }: VideoAnalysisProps) {
  const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
  const formatCurrency = (num: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);

  // Calculate financial metrics based on video length and predicted views
  const calculateFinancialMetrics = () => {
    const views = analysisResult.prediction.predicted_views;
    const rpm = analysisResult.features_used.duration >= 480 ? 7.5 : 3.5; // $7.50 RPM for 8+ min, $3.50 for shorter
    const estimatedRevenue = (views / 1000) * rpm;

    let revenuePotential: "low" | "medium" | "high";
    if (estimatedRevenue < 1000) revenuePotential = "low";
    else if (estimatedRevenue < 5000) revenuePotential = "medium";
    else revenuePotential = "high";

    return {
      rpm,
      estimatedRevenue,
      revenuePotential,
    };
  };

  const getMetricStatus = (value: number, threshold: number) => {
    return value >= threshold ? (
      <TrendingUp className="w-5 h-5 text-green-500" />
    ) : (
      <TrendingDown className="w-5 h-5 text-red-500" />
    );
  };

  const financialMetrics = calculateFinancialMetrics();

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
          Video Analysis Results
        </h1>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign className="w-16 h-16 text-sky-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
            Estimated Revenue
            {getMetricStatus(financialMetrics.estimatedRevenue, 1000)}
          </h3>
          <p className="text-3xl font-bold text-sky-600">
            {formatCurrency(financialMetrics.estimatedRevenue)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Revenue Potential: {financialMetrics.revenuePotential.toUpperCase()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BarChart className="w-16 h-16 text-sky-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
            Average RPM
            {getMetricStatus(financialMetrics.rpm, 5)}
          </h3>
          <p className="text-3xl font-bold text-sky-600">
            {formatCurrency(financialMetrics.rpm)}
          </p>
          <p className="text-sm text-gray-500 mt-2">Per 1,000 Views</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="w-16 h-16 text-sky-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
            Predicted Views
            {getMetricStatus(analysisResult.prediction.predicted_views, 100000)}
          </h3>
          <p className="text-3xl font-bold text-sky-600">
            {formatNumber(analysisResult.prediction.predicted_views)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Range:{" "}
            {formatNumber(analysisResult.prediction.confidence_range.low)} -{" "}
            {formatNumber(analysisResult.prediction.confidence_range.high)}
          </p>
        </div>
      </div>

      {/* Content Analysis */}
      <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Video className="w-6 h-6 text-sky-600" />
          Content Analysis
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-sky-50 rounded-lg">
            <h4 className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Duration
            </h4>
            <p className="text-lg font-semibold">
              {analysisResult.features_used.duration.toFixed(1)}s
            </p>
          </div>
          <div className="p-4 bg-sky-50 rounded-lg">
            <h4 className="text-sm text-gray-500 flex items-center gap-1">
              <Users className="w-4 h-4" />
              Faces Detected
            </h4>
            <p className="text-lg font-semibold">
              {analysisResult.features_used.total_faces}
            </p>
          </div>
          <div className="p-4 bg-sky-50 rounded-lg">
            <h4 className="text-sm text-gray-500">Text Coverage</h4>
            <p className="text-lg font-semibold">
              {analysisResult.features_used.text_percentage}%
            </p>
          </div>
          <div className="p-4 bg-sky-50 rounded-lg">
            <h4 className="text-sm text-gray-500">Engagement Score</h4>
            <p className="text-lg font-semibold">
              {(analysisResult.features_used.engagement_score * 100).toFixed(1)}
              %
            </p>
          </div>
        </div>
      </div>

      {/* Audio Analysis */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Volume2 className="w-6 h-6 text-sky-600" />
          Audio Quality
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-sky-50 rounded-lg">
            <h4 className="text-sm text-gray-500">Quality Score</h4>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold">
                {(
                  analysisResult.features_used.audio_quality_score * 100
                ).toFixed(1)}
                %
              </p>
              {getMetricStatus(
                analysisResult.features_used.audio_quality_score,
                0.7
              )}
            </div>
          </div>
          <div className="p-4 bg-sky-50 rounded-lg">
            <h4 className="text-sm text-gray-500">Dynamics Score</h4>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold">
                {(
                  analysisResult.features_used.audio_dynamics_score * 100
                ).toFixed(1)}
                %
              </p>
              {getMetricStatus(
                analysisResult.features_used.audio_dynamics_score,
                0.7
              )}
            </div>
          </div>
          <div className="p-4 bg-sky-50 rounded-lg">
            <h4 className="text-sm text-gray-500">Clarity Score</h4>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold">
                {(
                  analysisResult.features_used.audio_clarity_score * 100
                ).toFixed(1)}
                %
              </p>
              {getMetricStatus(
                analysisResult.features_used.audio_clarity_score,
                0.7
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
