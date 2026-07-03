"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { z } from "zod";

import { sendEmail } from "@/lib/mail";
import { auth } from "@/lib/auth";

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
});

export async function signUpAction(data: z.infer<typeof signUpSchema>) {
  try {
    const parsed = signUpSchema.safeParse(data);
    if (!parsed.success) return { error: "Invalid data" };

    const email = parsed.data.email.toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) return { error: "Email already registered" };

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email,
        phone: parsed.data.phone,
        passwordHash,
        role: "customer",
      },
    });

    return { success: true, userId: user.id };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}

// ============================================
// Login OTP 
// ============================================

export async function verifyCredentialsAndSendOtpAction(emailRaw: string, password: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const email = emailRaw.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !user.passwordHash) {
      return { error: "Invalid credentials. Please try again." };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return { error: "Invalid credentials. Please try again." };
    }

    // Generate 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Expiry 10 minutes from now
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: { otpCode, otpExpiry },
    });

    const html = `
      <h2>Login Verification</h2>
      <p>Hello ${user.name},</p>
      <p>Your One-Time Password to securely log in is:</p>
      <h1 style="font-size: 32px; letter-spacing: 5px; color: #d97706;">${otpCode}</h1>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not request this, please secure your account.</p>
    `;

    const res = await sendEmail({
      to: email,
      subject: "Your Login OTP - Brick Basket",
      html,
    });

    if (res.error) {
       console.error("Failed to send OTP email:", res.error);
       return { error: "Failed to send OTP to your email." };
    }

    return { success: true };
  } catch (error) {
    console.error("Error verifying credentials:", error);
    return { error: "Failed to process request." };
  }
}

// ============================================
// OTP & Password Reset
// ============================================

export async function sendOtpAction(emailRaw: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const email = emailRaw.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if user exists or not for security, just pretend success
      return { success: true };
    }

    // Generate 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Expiry 10 minutes from now
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: { otpCode, otpExpiry },
    });

    const html = `
      <h2>Password Reset OTP</h2>
      <p>Hello ${user.name},</p>
      <p>Your One-Time Password for password reset is:</p>
      <h1 style="font-size: 32px; letter-spacing: 5px; color: #d97706;">${otpCode}</h1>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await sendEmail({
      to: email,
      subject: "Password Reset - Brick Basket",
      html,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { error: "Failed to send OTP. Please try again." };
  }
}

export async function verifyOtpAction(emailRaw: string, otp: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const email = emailRaw.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !user.otpCode || !user.otpExpiry) {
      return { error: "Invalid or expired OTP." };
    }

    if (user.otpCode !== otp) {
      return { error: "Incorrect OTP." };
    }

    if (new Date() > user.otpExpiry) {
      return { error: "OTP has expired. Please request a new one." };
    }

    // OTP is valid. Clear it out so it can't be used again immediately,
    // though for a reset flow we might just leave it or use a separate verified flag.
    // For simplicity, we just return success. The next step is resetting the password.
    
    return { success: true };
  } catch (error) {
    return { error: "Failed to verify OTP." };
  }
}

export async function resetPasswordAction(emailRaw: string, otp: string, newPassword: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const email = emailRaw.toLowerCase();
    // Verify OTP again just to be secure before changing password
    const verify = await verifyOtpAction(email, otp);
    if (verify.error) return verify;

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { 
        passwordHash,
        otpCode: null, // Clear OTP after successful reset
        otpExpiry: null
      },
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to reset password." };
  }
}

// ============================================
// Logged in User Change Password
// ============================================

export async function changePasswordAction(oldPassword: string, newPassword: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "Unauthorized" };
    }

    const email = session.user.email;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return { error: "User not found" };
    }

    if (!user.passwordHash) {
      return { error: "This account uses Google login. Password cannot be changed here." };
    }

    const isValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isValid) {
      return { error: "Incorrect current password." };
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    return { success: true };
  } catch (error) {
    console.error("Change password error:", error);
    return { error: "Failed to change password." };
  }
}
