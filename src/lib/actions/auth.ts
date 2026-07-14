"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import * as authService from "@/lib/services/auth.service";

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
});

export async function signUpAction(data: z.infer<typeof signUpSchema>) {
  try {
    const result = await authService.signUp(data);
    return { success: true, requireOtp: result.requireOtp };
  } catch (err: any) {
    console.error("Signup error:", err);
    return { error: err.message || "Something went wrong. Please try again." };
  }
}

export async function verifySignupOtpAction(emailRaw: string, otp: string) {
  try {
    await authService.verifySignupOtp(emailRaw, otp);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to verify OTP." };
  }
}

export async function sendOtpAction(emailRaw: string): Promise<{ success?: boolean; error?: string }> {
  try {
    await authService.sendOtp(emailRaw);
    return { success: true };
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return { error: error.message || "Failed to send OTP. Please try again." };
  }
}

export async function verifyOtpAction(emailRaw: string, otp: string): Promise<{ success?: boolean; error?: string }> {
  try {
    await authService.verifyOtp(emailRaw, otp);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to verify OTP." };
  }
}

export async function resetPasswordAction(emailRaw: string, otp: string, newPassword: string): Promise<{ success?: boolean; error?: string }> {
  try {
    await authService.resetPassword(emailRaw, otp, newPassword);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to reset password." };
  }
}

export async function changePasswordAction(oldPassword: string, newPassword: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    await authService.changePassword(session.user.id, oldPassword, newPassword);
    return { success: true };
  } catch (error: any) {
    console.error("Change password error:", error);
    return { error: error.message || "Failed to change password." };
  }
}
