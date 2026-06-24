"use client";

import { useSession } from "next-auth/react";

export function useCurrentUser() {
  const { data: session, status } = useSession();

  return {
    user: session?.user
      ? {
          id: session.user.id,
          name: session.user.name ?? "",
          email: session.user.email ?? "",
          phone: (session.user as { phone?: string }).phone ?? "",
          role: ((session.user as { role?: string }).role ?? "customer") as
            | "customer"
            | "engineer"
            | "admin"
            | "contractor",
          avatar: session.user.image ?? undefined,
        }
      : null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}
