"use client";

import Link from "next/link";
import { ArrowRight, Brain, Target, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { motion } from "framer-motion";

export default function LandingPage() {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "Viral Prediction",
      description:
        "Get instant AI analysis of your video's viral potential and understand what makes content spread",
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Content Enhancement",
      description:
        "Receive actionable suggestions to improve your hook, pacing, and engagement factors",
    },
    {
      icon: <LineChart className="h-8 w-8 text-primary" />,
      title: "Trend Analysis",
      description:
        "Understand which elements of your content resonate most with your target audience",
    },
  ];

  const stats = [
    {
      value: "90%",
      label: "Prediction Accuracy",
      subtext: "AI-powered viral potential analysis",
    },
    {
      value: "10+",
      label: "Data Points",
      subtext: "Analyzed per video upload",
    },
    {
      value: "24/7",
      label: "Instant Analysis",
      subtext: "Get results in seconds",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-100/80 via-sky-50/50 to-white" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c708_1px,transparent_1px),linear-gradient(to_bottom,#0284c708_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6 px-4 py-1.5 bg-sky-100 rounded-full text-sm font-medium text-sky-600"
          >
            Predict Your Content&apos;s Viral Potential
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-7xl font-bold tracking-tight mb-8"
          >
            <span className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
              Will Your Video
            </span>
            <span className="bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 bg-clip-text text-transparent">
              {" "}
              Go Viral?
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto"
          >
            Upload your short-form video and our AI will analyze its viral
            potential, hook strength, and give you specific ways to make it
            better.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col gap-4 items-center"
          >
            <Link href="/dashboard">
              <RainbowButton className="text-white font-medium text-lg">
                Try Now - It&apos;s Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </RainbowButton>
            </Link>
            <div className="text-sm text-gray-500 flex items-center gap-4">
              <span>•</span>
              <span>No credit card required</span>
              <span>•</span>
              <span>Instant analysis</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 bg-gradient-to-b from-sky-50 to-white relative border-t border-sky-100">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c708_1px,transparent_1px),linear-gradient(to_bottom,#0284c708_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-b from-gray-900 to-gray-800 bg-clip-text text-transparent">
              Know Before You Post
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stop guessing what works. Get data-driven insights for your
              content.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="h-full"
              >
                <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-b from-white/80 to-sky-50/50 hover:shadow-[0_8px_30px_rgb(14_165_233_/_0.2)] hover:-translate-y-2 rounded-2xl backdrop-blur-sm relative overflow-hidden group h-full flex flex-col">
                  <div className="mb-6 p-4 bg-sky-100/80 rounded-2xl w-fit group-hover:bg-sky-200/80 transition-colors duration-500 group-hover:rotate-6 transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-4 bg-sky-50/50 relative border-t border-sky-100">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c708_1px,transparent_1px),linear-gradient(to_bottom,#0284c708_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-20 bg-gradient-to-b from-gray-900 to-gray-800 bg-clip-text text-transparent">
            Trusted by Content Creators
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-8 bg-white/80 rounded-2xl border border-sky-100 backdrop-blur-sm hover:shadow-[0_8px_30px_rgb(14_165_233_/_0.2)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-5xl font-bold text-sky-500 mb-4">
                  {stat.value}
                </div>
                <div className="text-xl font-semibold text-gray-900 mb-2">
                  {stat.label}
                </div>
                <div className="text-gray-600">{stat.subtext}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-100/80 via-sky-50/50 to-white" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c708_1px,transparent_1px),linear-gradient(to_bottom,#0284c708_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8 bg-gradient-to-b from-gray-900 to-gray-800 bg-clip-text text-transparent">
            Ready to Create Better Content?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Join creators making better content, faster with AI-powered
            analytics.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-sky-500 hover:bg-sky-600 h-14 px-8 text-lg group transition-all duration-300 text-white"
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
