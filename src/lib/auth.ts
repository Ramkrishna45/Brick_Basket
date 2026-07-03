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
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.otp) return null;

        const email = (credentials.email as string).toLowerCase();
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        const otp = credentials.otp as string;
        if (!user.otpCode || !user.otpExpiry || user.otpCode !== otp || new Date() > user.otpExpiry) {
          throw new Error("Invalid or expired OTP");
        }

        // Clear OTP after successful verification
        await prisma.user.update({
          where: { email },
          data: { otpCode: null, otpExpiry: null },
        });

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
      if (user && user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { role: true, phone: true }
        });
        if (dbUser) {
          nextToken.role = dbUser.role;
          nextToken.phone = dbUser.phone ?? "";
        }
      }
      return nextToken;
    }
  }
});
