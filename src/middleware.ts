import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Fallback if env vars are missing (e.g. during build or local dev without redis)
const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = hasRedis 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// Create limiters for different endpoint groups
const authLimiter = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  prefix: "rl:auth",
}) : null;

const signupLimiter = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "3600 s"), // 3 per hour to prevent bcrypt DoS
  prefix: "rl:signup",
}) : null;

const leadLimiter = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "3600 s"), // 3 per HOUR for contact forms
  prefix: "rl:lead",
}) : null;

const generalLimiter = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(120, "60 s"),
  prefix: "rl:general",
}) : null;

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function getLimiter(pathname: string) {
  if (pathname.startsWith("/api/auth/signup") || pathname.startsWith("/api/auth/send-otp")) return signupLimiter;
  if (pathname.startsWith("/api/auth/")) return authLimiter;
  if (pathname === "/api/leads" || pathname === "/api/leads/") return leadLimiter;
  return generalLimiter;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/api/")) return NextResponse.next();

  // Skip rate limiting if Upstash is not configured
  if (!redis || !hasRedis) return NextResponse.next();

  const ip = getClientIP(request);
  const limiter = getLimiter(pathname);
  
  if (!limiter) return NextResponse.next();

  const { success, remaining, limit, reset } = await limiter.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Remaining", remaining.toString());
  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
