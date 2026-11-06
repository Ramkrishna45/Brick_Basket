import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;

        let user = null;
        try {
          user = await prisma.user.findUnique({
            where: { email },
          });
        } catch (err) {
          console.error("DB lookup error during authorize:", err);
        }

        // --- Demo / Bootstrap Provisioning ---
        // Ensure admin@brickbasket.in always works seamlessly
        if (email === "admin@brickbasket.in" && password === "demo123") {
          try {
            const passwordHash = await bcrypt.hash("demo123", 10);
            user = await prisma.user.upsert({
              where: { email: "admin@brickbasket.in" },
              update: {
                passwordHash,
                role: "admin",
                emailVerified: new Date(),
              },
              create: {
                name: "Ananya Reddy",
                email: "admin@brickbasket.in",
                phone: "+91 98765 43210",
                passwordHash,
                role: "admin",
                emailVerified: new Date(),
              },
            });
          } catch (upsertErr) {
            console.error("Error upserting admin user:", upsertErr);
            // In case DB is unreachable, return memory fallback so admin is not locked out
            return {
              id: "usr-admin-001",
              name: "Ananya Reddy",
              email: "admin@brickbasket.in",
              role: "admin",
              phone: "+91 98765 43210",
            };
          }
        }

        // Ensure engineer demo user works
        if (!user && email === "arjun@brickbasket.in" && password === "demo123") {
          try {
            const passwordHash = await bcrypt.hash("demo123", 10);
            user = await prisma.user.upsert({
              where: { email: "arjun@brickbasket.in" },
              update: { emailVerified: new Date() },
              create: {
                name: "Arjun Nair",
                email: "arjun@brickbasket.in",
                phone: "+91 97654 32100",
                passwordHash,
                role: "engineer",
                emailVerified: new Date(),
              },
            });
          } catch {
            return {
              id: "usr-eng-001",
              name: "Arjun Nair",
              email: "arjun@brickbasket.in",
              role: "engineer",
              phone: "+91 97654 32100",
            };
          }
        }

        // Ensure customer demo user works
        if (!user && (email === "customer@example.com" || email === "vikram@example.com") && password === "demo123") {
          try {
            const passwordHash = await bcrypt.hash("demo123", 10);
            user = await prisma.user.upsert({
              where: { email: "customer@example.com" },
              update: { emailVerified: new Date() },
              create: {
                name: "Vikram Patel",
                email: "customer@example.com",
                phone: "+91 99887 76655",
                passwordHash,
                role: "customer",
                emailVerified: new Date(),
              },
            });
          } catch {
            return {
              id: "usr-cust-001",
              name: "Vikram Patel",
              email: "customer@example.com",
              role: "customer",
              phone: "+91 99887 76655",
            };
          }
        }

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        // Auto-verify staff/admin accounts or ensure verification is set
        if (!user.emailVerified) {
          if (user.role === "admin" || user.role === "engineer" || user.role === "contractor" || email === "admin@brickbasket.in") {
            await prisma.user.update({
              where: { id: user.id },
              data: { emailVerified: new Date() },
            }).catch(() => {});
          } else {
            throw new Error('Please verify your email before logging in.');
          }
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone ?? undefined,
          image: user.avatar ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session, account }) {
      // First run the base jwt from auth.config
      let nextToken = token;
      if (authConfig.callbacks?.jwt) {
        nextToken = await (authConfig.callbacks.jwt as any)({ token, user, trigger, session, account });
      }
      
      // If user just logged in via Google (account.provider === "google"), 
      // fetch real role/phone from DB because Google provider only returns name/email/image
      if (account?.provider === "google" && user && user.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { role: true, phone: true }
          });
          if (dbUser) {
            nextToken.role = dbUser.role;
            nextToken.phone = dbUser.phone ?? "";
          }
        } catch (dbErr) {
          console.error("Error fetching Google user role from DB:", dbErr);
        }
      }
      return nextToken;
    }
  }
});
