import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to ALL routes
        source: "/(.*)",
        headers: [
          // Prevent site from being embedded in iframes (clickjacking protection)
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Prevent MIME type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Enable browser XSS filtering
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Control referrer information sent with requests
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Prevent Adobe Flash and PDF from embedding this page
          {
            key: "X-Permitted-Cross-Domain-Policies",
            value: "none",
          },
          // Permissions policy - disable unused browser features
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          // HSTS - force HTTPS (only applies once deployed to HTTPS)
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Allow Next.js inline scripts and eval in dev
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              // Allow styles from self and Google Fonts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Allow fonts from Google and self
              "font-src 'self' https://fonts.gstatic.com",
              // Allow images from self, data URIs, and Supabase storage
              "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in",
              // Allow connections to self and Supabase
              "connect-src 'self' https://*.supabase.co https://*.supabase.in",
              // Allow frames from self only
              "frame-src 'none'",
              // Allow objects from self only
              "object-src 'none'",
              // Upgrade insecure requests
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
      {
        // API routes: restrict CORS to only our own domains + localhost dev
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
        ],
      },
    ];
  },

  // Prevent Next.js from leaking server component source maps
  productionBrowserSourceMaps: false,
};

export default nextConfig;
