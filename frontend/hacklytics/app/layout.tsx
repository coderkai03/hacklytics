import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CreatorAI - AI-Powered Content Analytics",
  description: "Transform your content with AI-powered insights",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: { url: "/logo.svg" },
    shortcut: { url: "/logo.svg" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link rel="shortcut icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
