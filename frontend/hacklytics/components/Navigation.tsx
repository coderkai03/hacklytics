"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  ];

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
                className="flex items-center space-x-2 text-xl font-bold text-transparent bg-gradient-to-r from-sky-600 to-sky-500 bg-clip-text hover:opacity-80 transition-opacity -ml-2"
              >
                CreatorAI
              </Link>

              {/* Navigation Items and CTA Buttons */}
              <div className="flex items-center space-x-6">
                <div className="hidden sm:flex sm:space-x-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                        ${
                          pathname === item.href
                            ? "bg-sky-100/80 text-sky-600 shadow-sm shadow-sky-100"
                            : "text-gray-600 hover:bg-sky-50/80"
                        }
                      `}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Link>
                  ))}
                </div>

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
          </div>
        </nav>
      </div>
    </div>
  );
}
