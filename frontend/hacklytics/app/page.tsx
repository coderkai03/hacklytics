import Link from "next/link";
import { ArrowRight, Brain, Target, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "Smart Analysis",
      description:
        "Get instant insights on hook strength, audience engagement, and viral potential for your short-form videos",
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Content Optimization",
      description:
        "Optimize your content strategy with AI-powered recommendations and real-time performance tracking",
    },
    {
      icon: <LineChart className="h-8 w-8 text-primary" />,
      title: "Revenue Growth",
      description:
        "Maximize your earnings potential with data-driven insights and strategic monetization guidance",
    },
  ];

  const stats = [
    {
      value: "60%",
      label: "Time Saved",
      subtext: "Create content faster with AI",
    },
    {
      value: "40%",
      label: "Better Retention",
      subtext: "Keep viewers watching longer",
    },
    {
      value: "2.5x",
      label: "Revenue Potential",
      subtext: "Increase your earning power",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-white">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-blue-950/50 to-[#020617]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <div className="inline-block mb-6 px-4 py-1.5 bg-white/10 rounded-full text-sm font-medium text-blue-400">
            The Future of Content Creation
          </div>
          <h1 className="text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Create Better Content with{" "}
            <span className="text-blue-400">AI Analytics</span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Transform your short-form videos with AI-powered analytics. Get
            instant insights, optimize your hooks, and maximize engagement
            across platforms.
          </p>
          <div className="flex flex-col gap-4 items-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 h-14 px-8 text-lg group transition-all duration-300 w-[280px]"
              >
                Try Now - It&apos;s Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <div className="text-sm text-gray-500 flex items-center gap-4">
              <span>•</span>
              <span>No credit card required</span>
              <span>•</span>
              <span>Instant analysis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 bg-blue-950/30 relative border-t border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-b from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              Supercharge Your Content Creation
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get the insights you need to create viral content consistently
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-8 hover:shadow-2xl transition-all duration-300 border-white/10 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] shadow-[0_0_45px_-5px_rgba(59,130,246,0.1)] hover:shadow-[0_0_45px_-5px_rgba(59,130,246,0.2)]"
              >
                <div className="mb-6 p-3 bg-blue-500/10 rounded-xl w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white/90">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-4 bg-blue-950/20 relative border-t border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-20 bg-gradient-to-b from-white via-white/90 to-white/70 bg-clip-text text-transparent">
            Trusted by Content Creators
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-8 bg-white/[0.02] rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/[0.04] transition-all duration-300 shadow-[0_0_45px_-5px_rgba(59,130,246,0.1)] hover:shadow-[0_0_45px_-5px_rgba(59,130,246,0.2)]"
              >
                <div className="text-5xl font-bold text-blue-400 mb-4">
                  {stat.value}
                </div>
                <div className="text-xl font-semibold text-white/90 mb-2">
                  {stat.label}
                </div>
                <div className="text-gray-400">{stat.subtext}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-blue-950/50 to-[#020617]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Ready to Create Better Content?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Join creators making better content, faster with AI-powered
            analytics.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 h-14 px-8 text-lg group transition-all duration-300"
            >
              Start Free Analysis
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
