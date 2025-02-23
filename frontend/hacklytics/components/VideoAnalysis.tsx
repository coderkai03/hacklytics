import { Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ContentRoadmap from "@/components/ContentRoadmap";

export default function VideoAnalysis() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Video Analysis</h1>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Upload New Video
        </Button>
      </div>

      {/* Video Preview and Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Video Preview</h2>
            <div className="space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          <div className="aspect-video bg-muted rounded-lg">
            {/* Video Player will go here */}
          </div>
        </div>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500">Hook Score</div>
              <div className="text-3xl font-bold text-primary">8.5</div>
              <div className="text-sm text-green-600">Top 10%</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Predicted Views</div>
              <div className="text-3xl font-bold">125.4K</div>
              <div className="text-sm text-gray-500">
                78% likely to hit target
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Analysis Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Hook Analysis</h3>
          <div className="space-y-4">
            <div>
              <div className="font-medium mb-2">Optimal Hook Duration</div>
              <div className="text-2xl font-bold text-primary">0:00 - 3:24</div>
              <div className="text-sm text-gray-500">
                First 3.4 seconds are crucial
              </div>
            </div>
            <div>
              <div className="font-medium mb-2">Key Moments</div>
              <div className="space-y-2">
                {[
                  { time: "0:00", desc: "Strong opening line" },
                  { time: "0:02", desc: "Visual hook peaks" },
                  { time: "0:03", desc: "Audience retention spike" },
                ].map((moment, i) => (
                  <div key={i} className="flex gap-4">
                    <code className="text-sm">{moment.time}</code>
                    <span className="text-gray-600">{moment.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">
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
              <div key={i} className="flex justify-between items-start">
                <div>
                  <div className="font-medium mb-1">{suggestion.title}</div>
                  <p className="text-sm text-gray-600">
                    {suggestion.description}
                  </p>
                </div>
                <span
                  className={`text-sm ${
                    suggestion.impact === "High Impact"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-blue-50 text-blue-600"
                  } px-2 py-1 rounded`}
                >
                  {suggestion.impact}
                </span>
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
