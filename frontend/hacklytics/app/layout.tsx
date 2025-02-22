import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import Navigation from "@/components/Navigation"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CreatorAI Analytics Engine",
  description: "AI-powered platform for content creators to optimize short-form video content",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="container mx-auto px-4 py-6">{children}</main>
          <Toaster />
        </div>
      </body>
    </html>
  )
}

