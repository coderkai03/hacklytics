import { Calendar, Target, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ContentRoadmap() {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Content Strategy</h3>
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <Calendar className="h-5 w-5 text-primary mt-1" />
          <div>
            <h4 className="font-medium">Best Time to Post</h4>
            <p className="text-sm text-gray-600">
              Recommended: Today at 7:00 PM EST
              <br />
              Expected engagement peak: +22%
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Target className="h-5 w-5 text-primary mt-1" />
          <div>
            <h4 className="font-medium">Target Audience Match</h4>
            <p className="text-sm text-gray-600">
              Primary: Tech enthusiasts (85% match)
              <br />
              Secondary: Early adopters (72% match)
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <TrendingUp className="h-5 w-5 text-primary mt-1" />
          <div>
            <h4 className="font-medium">Trending Topics</h4>
            <p className="text-sm text-gray-600">
              Related trending hashtags:
              <br />
              #AITechnology #ContentCreation #CreatorEconomy
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
