import { Calendar, Target, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ContentRoadmap() {
  return (
    <Card className="p-8 rounded-2xl border-sky-100/50 bg-gradient-to-br from-white to-sky-50/30 hover:shadow-xl transition-all duration-500">
      <h2 className="text-2xl font-semibold text-gray-900 mb-8">
        Content Strategy
      </h2>

      <div className="space-y-8">
        {/* Best Time to Post */}
        <div className="flex items-start gap-6 p-6 bg-white rounded-xl hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-sky-100/80 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-sky-500" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Best Time to Post
            </h3>
            <div className="text-lg font-semibold text-sky-600 mb-1">
              Today at 7:00 PM EST
            </div>
            <p className="text-sm text-gray-500">
              Expected engagement peak: +22%
            </p>
          </div>
        </div>

        {/* Target Audience Match */}
        <div className="flex items-start gap-6 p-6 bg-white rounded-xl hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-sky-100/80 flex items-center justify-center">
            <Target className="w-6 h-6 text-sky-500" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Target Audience Match
            </h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-600">
                    Primary: Tech enthusiasts
                  </span>
                  <span className="text-sm font-semibold text-sky-600">
                    85% match
                  </span>
                </div>
                <div className="h-2 bg-sky-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full"
                    style={{ width: "85%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-600">
                    Secondary: Early adopters
                  </span>
                  <span className="text-sm font-semibold text-sky-600">
                    72% match
                  </span>
                </div>
                <div className="h-2 bg-sky-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full"
                    style={{ width: "72%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Topics */}
        <div className="flex items-start gap-6 p-6 bg-white rounded-xl hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-sky-100/80 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-sky-500" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Trending Topics</h3>
            <div className="flex flex-wrap gap-2">
              {["AITechnology", "ContentCreation", "CreatorEconomy"].map(
                (tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-sm font-medium hover:bg-sky-100 transition-colors duration-300"
                  >
                    #{tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
