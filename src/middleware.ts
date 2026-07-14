import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── In-Memory Rate Limiter ────────────────────────────────────────────────
// For production, replace with Redis (e.g., Upstash) via @upstash/ratelimit

interface RateLimitEntry {
  count: number;
  firstRequest: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMITS: Record<string, { maxRequests: number; windowMs: number }> = {
  // Strict limits on auth endpoints to prevent brute force
  "/api/auth/login": { maxRequests: 10, windowMs: 60 * 1000 },        // 10 per minute
  "/api/auth/signup": { maxRequests: 5, windowMs: 60 * 1000 },         // 5 per minute
  "/api/auth/send-otp": { maxRequests: 5, windowMs: 60 * 1000 },       // 5 per minute
  "/api/auth/verify-otp": { maxRequests: 10, windowMs: 60 * 1000 },    // 10 per minute
  "/api/auth/reset-password": { maxRequests: 5, windowMs: 60 * 1000 }, // 5 per minute
  // Prevent spam on contact form
  "/api/leads": { maxRequests: 3, windowMs: 60 * 60 * 1000 },          // 3 per hour

  // General API limit
  "/api/": { maxRequests: 120, windowMs: 60 * 1000 },                  // 120 per minute
};

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(ip: string, path: string): { allowed: boolean; remaining: number } {
  // Find the most specific rate limit rule
  const ruleKey = Object.keys(RATE_LIMITS).find((key) => path.startsWith(key)) ?? "/api/";
  const rule = RATE_LIMITS[ruleKey];
  if (!rule) return { allowed: true, remaining: 999 };

  const storeKey = `${ip}:${ruleKey}`;
  const now = Date.now();
  const entry = rateLimitStore.get(storeKey);

  if (!entry || now - entry.firstRequest > rule.windowMs) {
    // New window
    rateLimitStore.set(storeKey, { count: 1, firstRequest: now });
    return { allowed: true, remaining: rule.maxRequests - 1 };
  }

  if (entry.count >= rule.maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: rule.maxRequests - entry.count };
}

// Cleanup old entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    // Remove entries older than 2 minutes (beyond any window)
    if (now - entry.firstRequest > 2 * 60 * 1000) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

// ─── Middleware ────────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to API routes
  if (pathname.startsWith("/api/")) {
    const ip = getClientIP(request);
    const { allowed, remaining } = checkRateLimit(ip, pathname);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": "10",
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // Add rate limit headers to successful responses
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
