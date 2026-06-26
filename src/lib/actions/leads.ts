"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { sendEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

// ── Public: Submit Enquiry ──────────────────────────────────────────

const enquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  city: z.string().min(2),
  plotSize: z.string().optional(),
  builtUpArea: z.string().optional(),
  budgetRange: z.string().optional(),
  homeType: z.string().optional(),
  servicesNeeded: z.array(z.string()).optional(),
  timeline: z.string().optional(),
  preferredContact: z.string().optional(),
  notes: z.string().optional(),
});

export async function submitEnquiryAction(
  formData: z.infer<typeof enquirySchema>
) {
  try {
    const parsed = enquirySchema.safeParse(formData);
    if (!parsed.success) return { error: "Invalid data. Please check your inputs." };

    const lead = await prisma.lead.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        city: parsed.data.city,
        plotSize: parsed.data.plotSize ?? null,
        builtUpArea: parsed.data.builtUpArea ?? null,
        budgetRange: parsed.data.budgetRange ?? null,
        homeType: parsed.data.homeType ?? null,
        servicesNeeded: JSON.stringify(parsed.data.servicesNeeded ?? []),
        timeline: parsed.data.timeline ?? null,
        preferredContact: parsed.data.preferredContact ?? "phone",
        notes: parsed.data.notes ?? null,
        status: "new",
      },
    });

    // Notify Admin
    await sendEmail({
      to: "admin@brickbasket.com", // You can change this to the real admin email later
      subject: `New Enquiry from ${lead.name}`,
      html: `
        <h2>New Enquiry Received!</h2>
        <p><strong>Name:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Phone:</strong> ${lead.phone}</p>
        <p><strong>City:</strong> ${lead.city}</p>
        <p><strong>Home Type:</strong> ${lead.homeType || "Not specified"}</p>
        <p>Log in to the Admin Dashboard to view more details.</p>
      `,
    });

    return { success: true, data: { id: lead.id } };
  } catch {
    return { error: "Failed to submit enquiry. Please try again." };
  }
}

// ── Admin: Get Leads ────────────────────────────────────────────────

export async function getLeadsAction(status?: string, search?: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };
    if ((session.user as { role?: string }).role !== "admin")
      return { error: "Forbidden" };

    const where: Record<string, unknown> = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { city: { contains: search } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        assignedTo: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const data = leads.map((lead) => ({
      ...lead,
      servicesNeeded: JSON.parse(lead.servicesNeeded) as string[],
      createdAt: lead.createdAt.toISOString(),
      lastContactedAt: lead.lastContactedAt?.toISOString() ?? null,
    }));

    return { success: true, data };
  } catch {
    return { error: "Failed to fetch leads." };
  }
}

// ── Admin: Update Lead Status ───────────────────────────────────────

export async function updateLeadStatusAction(id: string, status: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };
    if ((session.user as { role?: string }).role !== "admin")
      return { error: "Forbidden" };

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        status,
        lastContactedAt: new Date(),
      },
    });

    // If converted, create user and project
    if (status === "converted") {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({ where: { email: lead.email } });
      
      let customerId = existingUser?.id;

      if (!existingUser) {
        // Generate random password
        const randomPassword = Math.random().toString(36).slice(-8) + "Aa1@";
        const passwordHash = await bcrypt.hash(randomPassword, 10);

        const newUser = await prisma.user.create({
          data: {
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            role: "customer",
            passwordHash,
          },
        });
        customerId = newUser.id;

        // Email credentials to customer
        await sendEmail({
          to: lead.email,
          subject: "Welcome to Brick Basket!",
          html: `
            <h2>Welcome to Brick Basket!</h2>
            <p>Hi ${lead.name},</p>
            <p>Your account has been successfully created. You can now log in to track your project progress, view documents, and more.</p>
            <p><strong>Login URL:</strong> https://brick-basket.vercel.app/login</p>
            <p><strong>Email:</strong> ${lead.email}</p>
            <p><strong>Password:</strong> ${randomPassword}</p>
            <p>We recommend changing your password after logging in.</p>
            <p>Best regards,<br/>The Brick Basket Team</p>
          `,
        });
      }

      if (customerId) {
        // Create an empty project for this lead
        await prisma.project.create({
          data: {
            name: `${lead.name}'s Residence`,
            customerId: customerId,
            siteAddress: `TBD (${lead.city})`,
            city: lead.city,
            plotSize: lead.plotSize || "TBD",
            builtUpArea: lead.builtUpArea || "TBD",
            status: "not_started",
            currentStage: "planning",
          },
        });
      }
    }

    return { success: true, data: { id: lead.id, status: lead.status } };
  } catch (err: any) {
    console.error("Update lead error:", err);
    return { error: "Failed to update lead status." };
  }
}

// ── Admin: Assign Lead ──────────────────────────────────────────────

export async function assignLeadAction(id: string, userId: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };
    if ((session.user as { role?: string }).role !== "admin")
      return { error: "Forbidden" };

    const lead = await prisma.lead.update({
      where: { id },
      data: { assignedToId: userId },
      include: {
        assignedTo: { select: { id: true, name: true } },
      },
    });

    return {
      success: true,
      data: { id: lead.id, assignedTo: lead.assignedTo },
    };
  } catch {
    return { error: "Failed to assign lead." };
  }
}
