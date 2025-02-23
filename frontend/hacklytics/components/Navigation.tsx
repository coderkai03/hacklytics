"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm mt-4">
      <div className="relative border border-sky-100/50 mx-4 rounded-full bg-white/70">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/50 to-transparent rounded-full" />

        <nav className="relative mx-auto">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center space-x-3 text-xl font-bold group"
              >
                <div className="relative w-8 h-8 transform group-hover:rotate-12 transition-transform duration-300 bg-transparent">
                  <Image
                    src="/favicon.svg"
                    alt="ViralAI Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </div>
                <span className="bg-gradient-to-r from-sky-500 via-sky-400 to-sky-600 bg-clip-text text-transparent">
                  ViralAI
                </span>
              </Link>

              {/* CTA Buttons */}
              {pathname === "/" && (
                <div className="hidden sm:flex items-center space-x-3">
                  <Button
                    variant="outline"
                    className="px-4 h-9 border-sky-200 hover:bg-sky-50 text-gray-600 rounded-full"
                  >
                    Log in
                  </Button>
                  <Button className="px-4 h-9 bg-sky-500 hover:bg-sky-600 text-white group rounded-full shadow-lg shadow-sky-200/50 hover:shadow-sky-300/50 transition-all duration-300">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
