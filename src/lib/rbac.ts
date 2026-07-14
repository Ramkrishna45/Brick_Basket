import { auth } from "@/lib/auth";

/**
 * Validates if the current user has the required roles.
 * Useful for Server Actions and API Routes.
 */
export async function requireRole(allowedRoles: string[]) {
  const session = await auth();
  if (!session || !session.user) {
    return { authorized: false, error: "Unauthorized" as const, user: null };
  }

  const role = (session.user as { role?: string }).role;
  if (!role || !allowedRoles.includes(role)) {
    return { authorized: false, error: "Forbidden" as const, user: null };
  }

  return { authorized: true, error: null, user: session.user };
}
