import React from "react";
import { Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const VideoAnalysis = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Top Section */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Video Preview - Takes up 2 columns */}
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
            {/* Video Player Component Here */}
          </div>
        </div>

        {/* Quick Stats */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6">Quick Stats</h3>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Hook Score</span>
                <span className="text-sm bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                  Top 10%
                </span>
              </div>
              <div className="text-4xl font-bold text-primary">8.5</div>
            </div>

            <div>
              <div className="text-muted-foreground mb-2">Predicted Views</div>
              <div className="text-4xl font-bold">125.4K</div>
              <div className="text-sm text-muted-foreground">
                78% likely to hit target
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Analysis Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Hook Analysis */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Hook Analysis</h3>
          <div className="space-y-4">
            <div>
              <div className="font-medium mb-2">Optimal Hook Duration</div>
              <div className="text-2xl font-bold text-primary">0:00 - 3:24</div>
              <div className="text-sm text-muted-foreground">
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
                    <span className="text-muted-foreground">{moment.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Improvement Suggestions */}
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
                impactColor: "bg-blue-100 text-blue-700",
              },
              {
                title: "Strengthen Opening Line",
                description:
                  'Start with "The secret that nobody tells you about..."',
                impact: "Medium Impact",
                impactColor: "bg-blue-50 text-blue-600",
              },
              {
                title: "Visual Enhancement",
                description: "Add text overlay highlighting key message",
                impact: "High Impact",
                impactColor: "bg-blue-100 text-blue-700",
              },
            ].map((suggestion, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <div className="font-medium mb-1">{suggestion.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {suggestion.description}
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${suggestion.impactColor}`}
                >
                  {suggestion.impact}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VideoAnalysis;
