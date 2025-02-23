import Link from "next/link";
import { ArrowRight, Sparkles, Zap, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "AI-Powered Analysis",
      description:
        "Get real-time hook strength scoring and content optimization suggestions powered by advanced AI",
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "60% Faster Creation",
      description:
        "Reduce your content creation time with data-driven insights and automated recommendations",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-primary" />,
      title: "2.5x Revenue Potential",
      description:
        "Maximize your earnings through optimized content and strategic monetization insights",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
            Create Better Content with <span className="text-primary">AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your short-form videos with AI-powered analytics. Get
            instant insights, optimize your hooks, and maximize engagement
            across TikTok, YouTube Shorts, and Instagram Reels.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg">
                Try Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Supercharge Your Content Creation
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
            Trusted by Content Creators
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">40%</div>
              <div className="text-gray-600">Better Retention</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">124+</div>
              <div className="text-gray-600">Videos Analyzed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1.2M+</div>
              <div className="text-gray-600">Views Generated</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Optimize Your Content?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join creators who are using AI to make better content, faster.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100"
            >
              Try Free Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
