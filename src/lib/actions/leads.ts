"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

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

    return { success: true, data: { id: lead.id, status: lead.status } };
  } catch {
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
