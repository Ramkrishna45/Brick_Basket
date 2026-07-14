import { NextResponse } from "next/server";

/**
 * Standard API response helpers for Route Handlers.
 * Ensures consistent JSON shape across all endpoints.
 */

export function success<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function created<T>(data: T) {
  return success(data, 201);
}

export function unauthorized(message = "Authentication required") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = "Insufficient permissions") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function badRequest(message = "Invalid request") {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFound(message = "Resource not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(message = "Internal server error") {
  return NextResponse.json({ error: message }, { status: 500 });
}

// Allowed origins for CORS.
// In production, only allow our own domain + Expo (for mobile app).
const ALLOWED_ORIGINS = process.env.NODE_ENV === "production"
  ? [
      "https://brickbasket.vercel.app",
      "https://www.brickbasket.vercel.app",
    ]
  : [
      "http://localhost:3000",
      "http://localhost:8081",
      "http://localhost:19006",
      // Expo Tunnel URLs match dynamically — allow in dev only
    ];

/**
 * CORS headers for mobile app access.
 * In production, restricted to known domains.
 * In dev, allows localhost and Expo dev server.
 */
export function corsHeaders(requestOrigin?: string) {
  const isDev = process.env.NODE_ENV !== "production";

  // Allow all origins in dev; check allowlist in production
  let allowedOrigin = "*";
  if (!isDev && requestOrigin) {
    allowedOrigin = ALLOWED_ORIGINS.includes(requestOrigin)
      ? requestOrigin
      : ALLOWED_ORIGINS[0]; // Default to primary domain
  }

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400", // Cache preflight for 24h
    ...(allowedOrigin !== "*" ? { "Vary": "Origin" } : {}),
  };
}

/**
 * Handle OPTIONS preflight requests for CORS.
 */
export function handleCors(request?: Request) {
  const origin = request?.headers.get("origin") ?? undefined;
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

/**
 * Wrap a NextResponse with CORS headers.
 */
export function withCors(response: NextResponse, request?: Request) {
  const origin = request?.headers.get("origin") ?? undefined;
  const headers = corsHeaders(origin);
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}
