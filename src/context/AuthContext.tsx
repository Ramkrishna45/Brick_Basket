"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { type User, type UserRole, type AuthState } from "@/types";
import { MOCK_CUSTOMER, MOCK_ADMIN, MOCK_ENGINEER } from "@/lib/mock-data";

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Record<UserRole, User> = {
  customer: MOCK_CUSTOMER,
  admin: MOCK_ADMIN,
  engineer: MOCK_ENGINEER,
  contractor: {
    id: "cont-001",
    name: "Ravi Kumar",
    email: "ravi@brickbasket.in",
    phone: "+91 96543 21000",
    role: "contractor",
    createdAt: "2024-08-01",
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for stored auth on mount
    const stored = typeof window !== "undefined" ? localStorage.getItem("bb_auth") : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setState({ user: parsed, isAuthenticated: true, isLoading: false });
      } catch {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, _password: string, role?: UserRole) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1000));

    const userRole = role || (email.includes("admin") ? "admin" : "customer");
    const user = MOCK_USERS[userRole];

    localStorage.setItem("bb_auth", JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  const signup = useCallback(
    async (data: { name: string; email: string; phone: string; password: string }) => {
      setState((prev) => ({ ...prev, isLoading: true }));
      await new Promise((r) => setTimeout(r, 1000));

      const user: User = {
        id: `cust-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: "customer",
        createdAt: new Date().toISOString().split("T")[0],
      };

      localStorage.setItem("bb_auth", JSON.stringify(user));
      setState({ user, isAuthenticated: true, isLoading: false });
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("bb_auth");
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    const user = MOCK_USERS[role];
    localStorage.setItem("bb_auth", JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
