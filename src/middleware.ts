import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextRequest, NextResponse } from "next/server";

export default NextAuth(authConfig).auth((req: any) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Public routes — always accessible
  const publicRoutes = ["/", "/services", "/plans", "/about", "/contact", "/enquiry", "/faqs", "/how-it-works", "/portfolio"];
  const authRoutes = ["/login", "/signup", "/forgot-password"];

  if (publicRoutes.some((r) => pathname === r)) {
    return NextResponse.next();
  }

  // Auth pages — redirect to dashboard if already logged in
  if (authRoutes.some((r) => pathname.startsWith(r))) {
    if (isAuthenticated) {
      const redirectTo = userRole === "admin" ? "/admin" : "/dashboard";
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
    return NextResponse.next();
  }

  // Admin routes — require admin role
  if (pathname.startsWith("/admin") || pathname.startsWith("/leads") || pathname.startsWith("/projects") || pathname.startsWith("/uploads") || pathname.startsWith("/admin-") || pathname.startsWith("/reports") || pathname.startsWith("/staff")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (userRole !== "admin" && userRole !== "engineer") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Dashboard routes — require any authenticated user
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/project") || pathname.startsWith("/progress") || pathname.startsWith("/documents") || pathname.startsWith("/payments") || pathname.startsWith("/photos") || pathname.startsWith("/messages") || pathname.startsWith("/settings")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // API routes — pass through
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|uploads/).*)"],
};
