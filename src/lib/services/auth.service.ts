import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { sendEmail } from "@/lib/mail";
import { randomInt } from "crypto";

// ── Validation Schemas ──────────────────────────────────────────────

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
});

// ── Sign Up ─────────────────────────────────────────────────────────

export async function signUp(data: { name: string; email: string; phone: string; password: string }) {
  const parsed = signUpSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  const email = parsed.data.email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email },
  });
  if (existing) throw new Error("Email already registered");

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  // Generate 6 digit OTP for new user verification
  const otpCode = randomInt(100000, 1000000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      phone: parsed.data.phone,
      passwordHash,
      role: "customer",
    },
  });

  await prisma.verificationToken.deleteMany({
    where: { identifier: email }
  });

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: otpCode,
      expires: otpExpiry,
    }
  });

  // Send Welcome & OTP Email
  const html = `
    <h2>Welcome to Brick Basket, ${user.name}!</h2>
    <p>Please verify your email address to complete your registration.</p>
    <p>Your One-Time Password (OTP) is:</p>
    <h1 style="font-size: 32px; letter-spacing: 5px; color: #d97706;">${otpCode}</h1>
    <p>This code will expire in 10 minutes.</p>
  `;

  await sendEmail({
    to: email,
    subject: "Verify Your Email - Brick Basket",
    html,
  });

  return { requireOtp: true };
}

// ── Verify Signup OTP ───────────────────────────────────────────────

export async function verifySignupOtp(emailRaw: string, otp: string) {
  const email = emailRaw.toLowerCase();
  
  const token = await prisma.verificationToken.findFirst({
    where: { identifier: email, token: otp },
  });

  if (!token) {
    throw new Error("Invalid or expired OTP.");
  }

  if (new Date() > token.expires) {
    throw new Error("OTP has expired. Please request a new one.");
  }

  // OTP is valid. Clear it out.
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  return { verified: true };
}

// ── Send OTP ────────────────────────────────────────────────────────

export async function sendOtp(emailRaw: string) {
  const email = emailRaw.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Don't reveal if user exists or not for security, just pretend success
    return { sent: true };
  }

  // Generate 6 digit OTP
  const otpCode = randomInt(100000, 1000000).toString();
  // Expiry 10 minutes from now
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.verificationToken.deleteMany({
    where: { identifier: email }
  });

  await prisma.verificationToken.create({
    data: { identifier: email, token: otpCode, expires: otpExpiry },
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

  return { sent: true };
}

// ── Verify OTP ──────────────────────────────────────────────────────

export async function verifyOtp(emailRaw: string, otp: string) {
  const email = emailRaw.toLowerCase();
  
  const token = await prisma.verificationToken.findFirst({
    where: { identifier: email, token: otp },
  });

  if (!token) {
    throw new Error("Invalid or expired OTP.");
  }

  if (new Date() > token.expires) {
    throw new Error("OTP has expired. Please request a new one.");
  }

  // OTP is valid. For the reset flow we return success.
  // The next step is resetting the password.
  return { verified: true };
}

// ── Reset Password ──────────────────────────────────────────────────

export async function resetPassword(emailRaw: string, otp: string, newPassword: string) {
  const email = emailRaw.toLowerCase();
  // Verify OTP again just to be secure before changing password
  await verifyOtp(email, otp);

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: {
      passwordHash,
    },
  });

  // Clear OTP after successful reset
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  return { reset: true };
}

// ── Change Password (Logged-in User) ────────────────────────────────

export async function changePassword(userId: string, oldPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.passwordHash) {
    throw new Error("This account uses Google login. Password cannot be changed here.");
  }

  const isValid = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!isValid) {
    throw new Error("Incorrect current password.");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  return { changed: true };
}

// ── Login With Credentials (Mobile) ─────────────────────────────────

export async function loginWithCredentials(email: string, password: string) {
  const normalizedEmail = email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  if (!user.passwordHash) {
    throw new Error("This account uses Google login. Please use Google Sign-In.");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid email or password.");
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone,
  };
}
