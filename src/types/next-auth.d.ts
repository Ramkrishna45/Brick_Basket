import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    phone?: string;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      phone?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    phone?: string;
  }
}
