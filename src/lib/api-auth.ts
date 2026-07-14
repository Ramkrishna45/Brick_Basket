import { auth } from "@/lib/auth";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";

export interface ApiUser {
  id: string;
  email: string;
  role: string;
  name?: string;
  phone?: string;
}

/**
 * Unified auth helper for both web (NextAuth session cookie)
 * and mobile (Bearer JWT token) requests.
 *
 * Route Handlers call this to identify the current user
 * regardless of platform.
 */
export async function getApiUser(request?: Request): Promise<ApiUser | null> {
  // Strategy 1: NextAuth session (web app — cookie-based)
  try {
    const session = await auth();
    if (session?.user?.id) {
      return {
        id: session.user.id,
        email: session.user.email ?? "",
        role: (session.user as { role?: string }).role ?? "customer",
        name: session.user.name ?? undefined,
        phone: (session.user as { phone?: string }).phone ?? undefined,
      };
    }
  } catch {
    // Session check failed — fall through to Bearer token
  }

  // Strategy 2: Bearer JWT token (mobile app)
  if (request) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.slice(7);
        const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
        if (!secret) return null;

        const decoded = jwt.verify(token, secret, {
          algorithms: ["HS256"], // Only accept HS256, reject alg:none attacks
        }) as ApiUser;
        
        // IDOR / Role spoofing fix: Fetch authoritative role from DB
        const dbUser = await prisma.user.findUnique({ 
          where: { id: decoded.id },
          select: { id: true, email: true, role: true, name: true, phone: true }
        });
        
        if (!dbUser) return null; // Token valid but user deleted

        return {
          id: dbUser.id,
          email: dbUser.email,
          role: dbUser.role, // Use DB role, not JWT role
          name: dbUser.name ?? undefined,
          phone: dbUser.phone ?? undefined,
        };
      } catch {
        return null; // Invalid or expired token
      }
    }
  }

  return null; // Unauthenticated
}

/**
 * Generate a JWT token for mobile app login.
 * Called by the /api/auth/login route handler.
 */
export function generateApiToken(user: ApiUser): string {
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
  if (!secret) throw new Error("No auth secret configured");

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone,
    },
    secret,
    {
      expiresIn: "7d",      // Reduced from 30d for security
      algorithm: "HS256",   // Explicit algorithm prevents confusion attacks
    }
  );
}
