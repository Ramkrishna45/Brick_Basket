import { auth } from "@/lib/auth";
import { User } from "next-auth";

// We extend the base User type to guarantee id and role exist for our internal logic
type AuthUser = User & { id: string; role: string };

type RoleResult = 
  | { authorized: false; error: string; user: null }
  | { authorized: true; error: null; user: AuthUser };

export async function requireRole(allowedRoles: string[]): Promise<RoleResult> {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { authorized: false, error: "Unauthorized", user: null };
  }

  const role = (session.user as { role?: string }).role;
  if (!role || !allowedRoles.includes(role)) {
    return { authorized: false, error: "Forbidden", user: null };
  }

  return { 
    authorized: true, 
    error: null, 
    user: session.user as AuthUser 
  };
}

/**
 * Validates if the user has access to a specific project.
 * Uses a pre-fetched project to prevent double DB queries.
 */
export function checkProjectAccess(
  userId: string,
  userRole: string,
  projectData: { customerId: string; staff: { id: string }[] } | null
) {
  if (!projectData) return { authorized: false, error: "Project not found" };
  
  // Admins always have access
  if (userRole === "admin") return { authorized: true };

  // Customers only access their own
  if (userRole === "customer" && projectData.customerId !== userId) {
    return { authorized: false, error: "Forbidden: Not your project" };
  }

  // Staff only access assigned
  if ((userRole === "engineer" || userRole === "contractor")) {
    const isAssigned = projectData.staff.some(s => s.id === userId);
    if (!isAssigned) {
      return { authorized: false, error: "Forbidden: Not assigned to this project" };
    }
  }

  return { authorized: true };
}
