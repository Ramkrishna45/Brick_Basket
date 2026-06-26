"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mail";

// ── Admin: Get All Staff ──────────────────────────────────────────

export async function getAllStaffAction() {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "admin") {
      return { error: "Forbidden" };
    }

    const staff = await prisma.user.findMany({
      where: {
        role: { in: ["engineer", "contractor", "admin"] },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        _count: {
          select: { assignedProjects: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return { success: true, data: staff };
  } catch (error) {
    console.error("Failed to fetch staff:", error);
    return { error: "Failed to fetch staff members." };
  }
}

// ── Admin: Create Staff ──────────────────────────────────────────

export async function createStaffAction(data: { name: string; email: string; phone: string; role: string }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "admin") {
      return { error: "Forbidden" };
    }

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      return { error: "A user with this email already exists." };
    }

    const randomPassword = Math.random().toString(36).slice(-8) + "St@1";
    const passwordHash = await bcrypt.hash(randomPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        passwordHash,
      },
    });

    // Email credentials to the new staff member
    await sendEmail({
      to: data.email,
      subject: "Welcome to Brick Basket Staff Portal",
      html: `
        <h2>Welcome to the Team, ${data.name}!</h2>
        <p>Your staff account (${data.role}) has been created.</p>
        <p><strong>Login URL:</strong> https://brick-basket.vercel.app/login</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Password:</strong> ${randomPassword}</p>
        <p>Please log in and change your password as soon as possible.</p>
        <br/>
        <p>Best regards,<br/>Brick Basket Admin Team</p>
      `,
    });

    return { success: true, data: { id: newUser.id } };
  } catch (error) {
    console.error("Failed to create staff:", error);
    return { error: "Failed to create staff member." };
  }
}
