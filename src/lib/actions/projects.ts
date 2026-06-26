"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

// ── Default construction milestones ─────────────────────────────────

const DEFAULT_MILESTONES = [
  { stage: "planning", title: "Planning & Design", description: "Architectural plans, approvals, and permits" },
  { stage: "foundation", title: "Foundation", description: "Excavation, PCC, footings, and plinth beam" },
  { stage: "columns", title: "Columns & Structure", description: "Column casting and structural framework" },
  { stage: "walls", title: "Walls & Brickwork", description: "Brick/block walls and masonry work" },
  { stage: "slab", title: "Slab & Roofing", description: "Roof slab casting and curing" },
  { stage: "plumbing", title: "Plumbing & Sanitary", description: "Water supply, drainage, and sanitary fittings" },
  { stage: "electrical", title: "Electrical & Wiring", description: "Wiring, switchboards, and electrical fittings" },
  { stage: "finishing", title: "Finishing & Interiors", description: "Plastering, painting, flooring, and fixtures" },
  { stage: "handover", title: "Final Handover", description: "Quality check, documentation, and key handover" },
];

// ── Customer: Get My Project (single — backward compat) ────────────

export async function getMyProjectAction() {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const userId = session.user?.id;
    if (!userId) return { error: "Unauthorized" };

    const project = await prisma.project.findFirst({
      where: { customerId: userId },
      include: {
        milestones: { orderBy: { createdAt: "asc" } },
        engineer: { select: { id: true, name: true, phone: true } },
      },
    });

    if (!project) return { success: true, data: null };

    return {
      success: true,
      data: {
        ...project,
        startDate: project.startDate?.toISOString() ?? null,
        expectedCompletion: project.expectedCompletion?.toISOString() ?? null,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        milestones: project.milestones.map((m) => ({
          ...m,
          startDate: m.startDate?.toISOString() ?? null,
          completedDate: m.completedDate?.toISOString() ?? null,
          createdAt: m.createdAt.toISOString(),
        })),
      },
    };
  } catch {
    return { error: "Failed to fetch project." };
  }
}

// ── Customer: Get All My Projects ───────────────────────────────────

export async function getMyProjectsAction() {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const userId = session.user?.id;
    if (!userId) return { error: "Unauthorized" };

    const projects = await prisma.project.findMany({
      where: { customerId: userId },
      include: {
        milestones: { orderBy: { createdAt: "asc" } },
        engineer: { select: { id: true, name: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: projects.map((project) => ({
        ...project,
        startDate: project.startDate?.toISOString() ?? null,
        expectedCompletion: project.expectedCompletion?.toISOString() ?? null,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        milestones: project.milestones.map((m) => ({
          ...m,
          startDate: m.startDate?.toISOString() ?? null,
          completedDate: m.completedDate?.toISOString() ?? null,
          createdAt: m.createdAt.toISOString(),
        })),
      })),
    };
  } catch {
    return { error: "Failed to fetch projects." };
  }
}

// ── Customer: Get My Enquiries ──────────────────────────────────────

export async function getMyEnquiriesAction() {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const email = session.user?.email;
    if (!email) return { error: "Unauthorized" };

    const leads = await prisma.lead.findMany({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: leads.map((l) => ({
        ...l,
        createdAt: l.createdAt.toISOString(),
        lastContactedAt: l.lastContactedAt?.toISOString() ?? null,
      })),
    };
  } catch {
    return { error: "Failed to fetch enquiries." };
  }
}

// ── Admin: Get All Projects ─────────────────────────────────────────

export async function getAllProjectsAction() {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };
    if ((session.user as { role?: string }).role !== "admin")
      return { error: "Forbidden" };

    const projects = await prisma.project.findMany({
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true } },
        engineer: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const data = projects.map((p) => ({
      ...p,
      startDate: p.startDate?.toISOString() ?? null,
      expectedCompletion: p.expectedCompletion?.toISOString() ?? null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return { success: true, data };
  } catch {
    return { error: "Failed to fetch projects." };
  }
}

// ── Admin: Create Project ───────────────────────────────────────────

const createProjectSchema = z.object({
  name: z.string().min(2),
  siteAddress: z.string().min(2),
  city: z.string().min(2),
  plotSize: z.string().min(1),
  builtUpArea: z.string().min(1),
  customerId: z.string().min(1),
  engineerId: z.string().optional(),
  planName: z.string().optional(),
  totalValue: z.number().optional(),
  startDate: z.string().optional(),
  expectedCompletion: z.string().optional(),
});

export async function createProjectAction(
  data: z.infer<typeof createProjectSchema>
) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };
    if ((session.user as { role?: string }).role !== "admin")
      return { error: "Forbidden" };

    const parsed = createProjectSchema.safeParse(data);
    if (!parsed.success) return { error: "Invalid data" };

    const project = await prisma.project.create({
      data: {
        name: parsed.data.name,
        siteAddress: parsed.data.siteAddress,
        city: parsed.data.city,
        plotSize: parsed.data.plotSize,
        builtUpArea: parsed.data.builtUpArea,
        customerId: parsed.data.customerId,
        engineerId: parsed.data.engineerId ?? null,
        planName: parsed.data.planName ?? null,
        totalValue: parsed.data.totalValue ?? 0,
        startDate: parsed.data.startDate
          ? new Date(parsed.data.startDate)
          : null,
        expectedCompletion: parsed.data.expectedCompletion
          ? new Date(parsed.data.expectedCompletion)
          : null,
        milestones: {
          create: DEFAULT_MILESTONES.map((m) => ({
            stage: m.stage,
            title: m.title,
            description: m.description,
            status: "upcoming",
          })),
        },
      },
      include: { milestones: true },
    });

    return { success: true, data: { id: project.id } };
  } catch {
    return { error: "Failed to create project." };
  }
}

// ── Admin: Update Project ───────────────────────────────────────────

const updateProjectSchema = z.object({
  name: z.string().optional(),
  siteAddress: z.string().optional(),
  city: z.string().optional(),
  plotSize: z.string().optional(),
  builtUpArea: z.string().optional(),
  currentStage: z.string().optional(),
  status: z.string().optional(),
  completionPercentage: z.number().optional(),
  totalValue: z.number().optional(),
  amountPaid: z.number().optional(),
  planName: z.string().optional(),
  engineerId: z.string().optional(),
  startDate: z.string().optional(),
  expectedCompletion: z.string().optional(),
});

export async function updateProjectAction(
  id: string,
  data: z.infer<typeof updateProjectSchema>
) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };
    if ((session.user as { role?: string }).role !== "admin")
      return { error: "Forbidden" };

    const parsed = updateProjectSchema.safeParse(data);
    if (!parsed.success) return { error: "Invalid data" };

    const updateData: Record<string, unknown> = {};

    // Copy only provided fields
    for (const [key, value] of Object.entries(parsed.data)) {
      if (value !== undefined) {
        if (key === "startDate" || key === "expectedCompletion") {
          updateData[key] = new Date(value as string);
        } else {
          updateData[key] = value;
        }
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return { success: true, data: { id: project.id } };
  } catch {
    return { error: "Failed to update project." };
  }
}

// ── Get Project By ID ───────────────────────────────────────────────

export async function getProjectByIdAction(id: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true } },
        engineer: { select: { id: true, name: true, phone: true } },
        milestones: { orderBy: { createdAt: "asc" } },
        progressUpdates: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: { uploadedBy: { select: { id: true, name: true } } },
        },
        documents: { orderBy: { createdAt: "desc" } },
        payments: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!project) return { error: "Project not found" };

    return {
      success: true,
      data: {
        ...project,
        startDate: project.startDate?.toISOString() ?? null,
        expectedCompletion: project.expectedCompletion?.toISOString() ?? null,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        milestones: project.milestones.map((m) => ({
          ...m,
          startDate: m.startDate?.toISOString() ?? null,
          completedDate: m.completedDate?.toISOString() ?? null,
          createdAt: m.createdAt.toISOString(),
        })),
        progressUpdates: project.progressUpdates.map((u) => ({
          ...u,
          photos: JSON.parse(u.photos) as string[],
          createdAt: u.createdAt.toISOString(),
        })),
        documents: project.documents.map((d) => ({
          ...d,
          createdAt: d.createdAt.toISOString(),
        })),
        payments: project.payments.map((p) => ({
          ...p,
          createdAt: p.createdAt.toISOString(),
        })),
      },
    };
  } catch {
    return { error: "Failed to fetch project." };
  }
}
