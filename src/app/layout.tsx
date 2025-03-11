import { TempoInit } from "./tempo-init";
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { FitnessBackground } from "@/components/ui/fitness-background";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "PulseCoach - Client Management for Fitness Professionals",
  description:
    "A comprehensive platform for fitness coaches to track client progress, manage workout plans, and analyze performance data.",
  keywords:
    "fitness coach, client management, workout tracking, fitness progress, personal trainer software",
  openGraph: {
    title: "PulseCoach - Client Management for Fitness Professionals",
    description:
      "Track client progress, manage workout plans, and analyze performance data with our comprehensive fitness coaching platform.",
    url: "https://pulsecoach.com",
    siteName: "PulseCoach",
    images: [
      {
        url: "https://i.imgur.com/xFQGdgC.png",
        width: 1200,
        height: 630,
        alt: "PulseCoach Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PulseCoach - Client Management for Fitness Professionals",
    description:
      "Track client progress, manage workout plans, and analyze performance data with our comprehensive fitness coaching platform.",
    images: ["https://i.imgur.com/xFQGdgC.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={`${inter.variable} ${montserrat.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <FitnessBackground />
          {children}
          <TempoInit />
        </ThemeProvider>
      </body>
    </html>
  );
}
