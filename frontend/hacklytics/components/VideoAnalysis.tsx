import { Share2, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ContentRoadmap from "@/components/ContentRoadmap";

export default function VideoAnalysis() {
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
          onClick={() => window.location.reload()}
          className="hover:bg-sky-50 transition-all duration-300 border-sky-200 hover:border-sky-300 rounded-xl px-6"
        >
          <Sparkles className="w-4 h-4 mr-2 text-sky-500" />
          Analyze New Video
        </Button>
      </div>

      {/* Video Preview and Quick Stats */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
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
              {/* Video Player */}
            </div>
          </Card>
        </div>

        <Card className="p-8 rounded-2xl border-sky-100/50 bg-gradient-to-br from-white to-sky-50/30 hover:shadow-xl transition-all duration-500">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">
            Quick Stats
          </h3>
          <div className="space-y-8">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">
                Hook Score
              </div>
              <div className="flex items-baseline gap-3">
                <div className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-sky-500 bg-clip-text text-transparent">
                  8.5
                </div>
                <div className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  Top 10%
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">
                Predicted Views
              </div>
              <div className="flex items-baseline gap-3">
                <div className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-sky-500 bg-clip-text text-transparent">
                  125.4K
                </div>
                <div className="text-sm text-gray-600">
                  78% likely to hit target
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Hook Analysis and Improvement Suggestions */}
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <Card className="p-8 rounded-2xl border-sky-100/50 bg-gradient-to-br from-white to-sky-50/30 hover:shadow-xl transition-all duration-500">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">
            Hook Analysis
          </h3>
          <div className="space-y-8">
            <div>
              <div className="font-medium text-gray-900 mb-3">
                Optimal Hook Duration
              </div>
              <div className="text-3xl font-bold text-sky-600 mb-2">
                0:00 - 3:24
              </div>
              <div className="text-sm text-gray-500">
                First 3.4 seconds are crucial
              </div>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-3">Key Moments</div>
              <div className="space-y-3">
                {[
                  { time: "0:00", desc: "Strong opening line" },
                  { time: "0:02", desc: "Visual hook peaks" },
                  { time: "0:03", desc: "Audience retention spike" },
                ].map((moment, i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-center bg-sky-50/50 p-3 rounded-lg"
                  >
                    <code className="text-sm font-mono bg-sky-100 px-2 py-1 rounded text-sky-700">
                      {moment.time}
                    </code>
                    <span className="text-gray-700">{moment.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 rounded-2xl border-sky-100/50 bg-gradient-to-br from-white to-sky-50/30 hover:shadow-xl transition-all duration-500">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">
            Improvement Suggestions
          </h3>
          <div className="space-y-4">
            {[
              {
                title: "Add Pattern Interrupt",
                description:
                  "Include a sudden movement or sound at 0:01 to grab attention",
                impact: "High Impact",
              },
              {
                title: "Strengthen Opening Line",
                description:
                  'Start with "The secret that nobody tells you about..."',
                impact: "Medium Impact",
              },
              {
                title: "Visual Enhancement",
                description: "Add text overlay highlighting key message",
                impact: "High Impact",
              },
            ].map((suggestion, i) => (
              <div
                key={i}
                className="p-4 bg-white rounded-xl hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="font-medium text-gray-900 mb-1">
                      {suggestion.title}
                    </div>
                    <p className="text-sm text-gray-600">
                      {suggestion.description}
                    </p>
                  </div>
                  <span
                    className={`text-sm whitespace-nowrap ${
                      suggestion.impact === "High Impact"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-blue-50 text-blue-600"
                    } px-3 py-1 rounded-full font-medium`}
                  >
                    {suggestion.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Content Strategy */}
      <ContentRoadmap />
    </div>
  );
}
