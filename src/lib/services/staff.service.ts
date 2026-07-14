import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mail";

// ── Admin: Get All Staff ──────────────────────────────────────────

export async function getAllStaff(userRole: string) {
  if (userRole !== "admin") throw new Error("Forbidden");

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

  return staff;
}

// ── Admin: Create Staff ──────────────────────────────────────────

export async function createStaff(
  userRole: string,
  data: { name: string; email: string; phone: string; role: string }
) {
  if (userRole !== "admin") throw new Error("Forbidden");

  const email = data.email.toLowerCase();

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("A user with this email already exists.");
  }

  const randomPassword = Math.random().toString(36).slice(-8) + "St@1";
  const passwordHash = await bcrypt.hash(randomPassword, 10);

  const newUser = await prisma.user.create({
    data: {
      name: data.name,
      email,
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

  return { id: newUser.id };
}

// ── Admin: Update Staff ──────────────────────────────────────────

export async function updateStaff(
  userRole: string,
  id: string,
  data: { name: string; phone: string; role: string }
) {
  if (userRole !== "admin") throw new Error("Forbidden");

  await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      phone: data.phone,
      role: data.role,
    },
  });

  return { updated: true };
}

// ── Admin: Delete Staff ──────────────────────────────────────────

export async function deleteStaff(userRole: string, id: string) {
  if (userRole !== "admin") throw new Error("Forbidden");

  await prisma.user.delete({
    where: { id },
  });

  return { deleted: true };
}
