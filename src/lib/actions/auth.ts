"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { z } from "zod";

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

    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });
    if (existing) return { error: "Email already registered" };

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
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
