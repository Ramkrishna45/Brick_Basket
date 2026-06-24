import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Brick Basket — Build Your Dream Home With Complete Transparency",
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
    title: "Brick Basket — Build Your Dream Home With Complete Transparency",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
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
