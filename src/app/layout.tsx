import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Brick Basket - Build Your Dream Home With Complete Transparency",
  description:
    "India's trusted home construction management platform. Track every brick, every day. Get daily photo updates, transparent payments, and complete project visibility.",
  keywords: [
    "home construction",
    "construction management",
    "house building",
    "construction tracking",
    "building contractor",
    "home builder",
    "construction progress",
  ],
  authors: [{ name: "Brick Basket" }],
  openGraph: {
    title: "Brick Basket - Build Your Dream Home With Complete Transparency",
    description:
      "Track your home construction progress daily with photos, documents, and payment tracking.",
    type: "website",
    siteName: "Brick Basket",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${inter.variable} ${jbMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <TooltipProvider>
            {children}
            <Toaster position="top-right" richColors />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
