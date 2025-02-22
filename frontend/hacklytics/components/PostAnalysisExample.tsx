"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Download, Share2 } from "lucide-react"

const mockRetentionData = Array.from({ length: 60 }, (_, i) => ({
  second: i,
  retention: Math.max(0, 100 - i * 1.2 + Math.sin(i * 0.5) * 10),
}))

const mockHeatmapData = Array.from({ length: 60 }, (_, i) => ({
  second: i,
  engagement: Math.max(0, 80 - i * 0.8 + Math.cos(i * 0.3) * 15),
}))

export default function PostAnalysisExample() {
  const [activeTab, setActiveTab] = useState("hook")

  return (
    <div className="max-w-7xl mx-auto">
      {/* Video Preview Section */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Video Preview</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="text-sm font-medium mb-2">Hook Score</div>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-primary">8.5</div>
                  <Badge className="bg-green-500">Top 10%</Badge>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Predicted Views</div>
                <div className="text-2xl font-bold">125.4K</div>
                <Progress value={78} className="mt-2" />
                <div className="text-sm text-muted-foreground mt-1">78% likely to hit target</div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Revenue Potential</div>
                <div className="text-2xl font-bold">$1,240</div>
                <div className="text-sm text-green-500 mt-1">+45% vs. your average</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto">
          <TabsTrigger value="hook">Hook Analysis</TabsTrigger>
          <TabsTrigger value="insights">Content Insights</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="hook">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hook Timing Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm font-medium mb-2">Optimal Hook Duration</div>
                    <div className="text-3xl font-bold text-primary">0:00 - 3:24</div>
                    <div className="text-sm text-muted-foreground mt-1">First 3.4 seconds are crucial</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Key Moments</div>
                    <div className="space-y-2">
                      {[
                        { time: "0:00", desc: "Strong opening line" },
                        { time: "0:02", desc: "Visual hook peaks" },
                        { time: "0:03", desc: "Audience retention spike" },
                      ].map((moment, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Badge variant="outline">{moment.time}</Badge>
                          <span className="text-sm">{moment.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hook Improvement Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Add Pattern Interrupt",
                      desc: "Include a sudden movement or sound at 0:01 to grab attention",
                      impact: "High",
                    },
                    {
                      title: "Strengthen Opening Line",
                      desc: 'Start with "The secret that nobody tells you about..."',
                      impact: "Medium",
                    },
                    {
                      title: "Visual Enhancement",
                      desc: "Add text overlay highlighting key message",
                      impact: "High",
                    },
                  ].map((suggestion, i) => (
                    <div key={i} className="p-4 bg-muted rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{suggestion.title}</div>
                        <Badge variant={suggestion.impact === "High" ? "default" : "secondary"}>
                          {suggestion.impact} Impact
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{suggestion.desc}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Viewer Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockRetentionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="second" label={{ value: "Time (seconds)", position: "bottom" }} />
                      <YAxis label={{ value: "Retention %", angle: -90, position: "left" }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="retention" stroke="#2563eb" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockHeatmapData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="second" label={{ value: "Time (seconds)", position: "bottom" }} />
                      <YAxis label={{ value: "Engagement %", angle: -90, position: "left" }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="engagement" stroke="#f59e0b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Content Optimization Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Pacing",
                      suggestion: "Increase speaking speed by 10% in middle section",
                      timing: "1:23 - 2:45",
                    },
                    {
                      title: "Visual Elements",
                      suggestion: "Add text overlays for key statistics",
                      timing: "0:45, 1:15, 2:30",
                    },
                    {
                      title: "Call to Action",
                      suggestion: "Move CTA earlier to maintain engagement",
                      timing: "Shift to 2:15",
                    },
                    {
                      title: "Audio Quality",
                      suggestion: "Reduce background noise in latter half",
                      timing: "2:00 onwards",
                    },
                    {
                      title: "Transitions",
                      suggestion: "Add smoother transitions between segments",
                      timing: "1:00, 2:00",
                    },
                    {
                      title: "Engagement Hooks",
                      suggestion: "Include question prompts for audience",
                      timing: "Every 30s",
                    },
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-muted rounded-lg">
                      <div className="font-medium mb-2">{item.title}</div>
                      <div className="text-sm text-muted-foreground mb-2">{item.suggestion}</div>
                      <Badge variant="outline">{item.timing}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="text-sm font-medium mb-2">Estimated 30-Day Revenue</div>
                    <div className="text-4xl font-bold text-primary">$1,240</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">+45% vs Average</Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium mb-1">Platform Ads</div>
                        <div className="text-2xl font-bold">$480</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">Sponsorships</div>
                        <div className="text-2xl font-bold">$760</div>
                      </div>
                    </div>
                    <Progress value={75} className="mt-2" />
                    <div className="text-sm text-muted-foreground">75% confidence in forecast</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monetization Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      type: "Brand Partnership",
                      potential: "$2,000 - $3,500",
                      match: "92%",
                      brands: "Nike, Adidas, Under Armour",
                    },
                    {
                      type: "Affiliate Marketing",
                      potential: "$800 - $1,200",
                      match: "88%",
                      products: "Fitness Equipment, Supplements",
                    },
                    {
                      type: "Creator Fund",
                      potential: "$400 - $600",
                      match: "95%",
                      platform: "TikTok, Instagram",
                    },
                  ].map((opp, i) => (
                    <div key={i} className="p-4 bg-muted rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{opp.type}</div>
                        <Badge variant="secondary">{opp.match} Match</Badge>
                      </div>
                      <div className="text-2xl font-bold mb-1">{opp.potential}</div>
                      <div className="text-sm text-muted-foreground">{opp.brands || opp.products || opp.platform}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>ROI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Production Cost",
                      value: "$200",
                      detail: "Equipment, editing, music",
                    },
                    {
                      label: "Marketing Budget",
                      value: "$150",
                      detail: "Promotion, boosting",
                    },
                    {
                      label: "Expected Revenue",
                      value: "$1,240",
                      detail: "30-day projection",
                    },
                    {
                      label: "ROI",
                      value: "254%",
                      detail: "Break-even in 12 days",
                    },
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-muted rounded-lg">
                      <div className="text-sm font-medium mb-1">{item.label}</div>
                      <div className="text-2xl font-bold mb-1">{item.value}</div>
                      <div className="text-sm text-muted-foreground">{item.detail}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

