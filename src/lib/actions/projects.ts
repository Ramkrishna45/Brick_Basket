"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/mail";

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
        staff: { select: { id: true, name: true, phone: true, role: true } },
        documents: { orderBy: { createdAt: "desc" } },
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
        milestones: project.milestones.map((m: any) => ({
          ...m,
          startDate: m.startDate?.toISOString() ?? null,
          completedDate: m.completedDate?.toISOString() ?? null,
          createdAt: m.createdAt.toISOString(),
        })),
        documents: project.documents?.map((d: any) => ({
          ...d,
          createdAt: d.createdAt.toISOString(),
        })) || [],
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
        staff: { select: { id: true, name: true, phone: true, role: true } },
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
        milestones: project.milestones.map((m: any) => ({
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
        staff: { select: { id: true, name: true, role: true } },
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



const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  siteAddress: z.string().min(1, "Site address is required"),
  city: z.string().min(1, "City is required"),
  plotSize: z.string().min(1, "Plot size is required"),
  builtUpArea: z.string().min(1, "Built-up area is required"),
  totalValue: z.number().min(0),
  startDate: z.string().min(1, "Start date is required"),
  expectedCompletion: z.string().min(1, "Expected completion is required"),
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(10, "Valid phone is required"),
  leadId: z.string().optional(),
});

export async function createProjectAction(data: z.infer<typeof createProjectSchema>) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "admin") {
      return { error: "Unauthorized" };
    }

    const parsed = createProjectSchema.safeParse(data);
    if (!parsed.success) return { error: "Invalid data" };

    const {
      name, siteAddress, city, plotSize, builtUpArea, totalValue,
      startDate, expectedCompletion, customerName, customerEmail, customerPhone, leadId
    } = parsed.data;

    const email = customerEmail.toLowerCase();
    
    // 1. Get or Create Customer
    let customer = await prisma.user.findUnique({ where: { email } });
    if (!customer) {
      // Generate a random password for new customer
      const randomPassword = Math.random().toString(36).slice(-8);
      // In a real app, hash the password and send it via email
      // Here we just use a basic hash representation for demo
      const bcrypt = require("bcryptjs");
      const passwordHash = await bcrypt.hash(randomPassword, 10);
      
      customer = await prisma.user.create({
        data: {
          name: customerName,
          email,
          phone: customerPhone,
          passwordHash,
          role: "customer"
        }
      });
      
      // Send welcome email with credentials
      await sendEmail({
        to: customerEmail,
        subject: "Welcome to Brick Basket - Your Construction Portal",
        html: `
          <h2>Welcome to Brick Basket, ${customerName}!</h2>
          <p>Your customer account has been created. You can now track your construction project online.</p>
          <p><strong>Login URL:</strong> <a href="${process.env.NEXTAUTH_URL}/login">${process.env.NEXTAUTH_URL}/login</a></p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Password:</strong> ${randomPassword}</p>
          <br/>
          <p>Please change your password after logging in.</p>
          <p>Best regards,<br/>The Brick Basket Team</p>
        `
      });
    }

    // 2. Create Project
    const sDate = new Date(startDate);
    const cDate = new Date(expectedCompletion);
    
    // @ts-ignore - bypassing TS error for missing clientName/mobileNumber in un-generated client
    const project = await prisma.project.create({
      data: {
        name,
        siteAddress,
        city,
        plotSize,
        builtUpArea,
        totalValue,
        startDate: sDate,
        expectedCompletion: cDate,
        currentStage: "planning",
        status: "not_started",
        customerId: customer.id,
        clientName: customerName,
        mobileNumber: customerPhone,
      }
    });

    // 3. Create Default Construction Milestones
    await prisma.projectMilestone.createMany({
      data: DEFAULT_MILESTONES.map((m) => ({
        projectId: project.id,
        stage: m.stage,
        title: m.title,
        description: m.description,
        status: "upcoming"
      }))
    });

    // 4. Create Payment Milestones Automatically
    // 10% Advance, 20% Foundation, 20% Walls, 20% Slab, 20% Finishing, 10% Handover
    const durationMs = cDate.getTime() - sDate.getTime();
    
    const paymentStages = [
      { name: "Advance / Booking", percent: 0.10, timeOffset: 0 },
      { name: "Foundation & Plinth", percent: 0.20, timeOffset: 0.15 },
      { name: "Columns & Brickwork", percent: 0.20, timeOffset: 0.35 },
      { name: "Roof Slab Casting", percent: 0.20, timeOffset: 0.60 },
      { name: "Plastering & Finishing", percent: 0.20, timeOffset: 0.85 },
      { name: "Final Handover", percent: 0.10, timeOffset: 1.0 },
    ];

    await prisma.paymentMilestone.createMany({
      data: paymentStages.map((stage) => {
        const dueDate = new Date(sDate.getTime() + durationMs * stage.timeOffset);
        return {
          projectId: project.id,
          name: stage.name,
          amount: totalValue * stage.percent,
          dueDate: dueDate.toISOString(),
          status: "pending",
          description: `Payment for ${stage.name} stage`
        };
      })
    });

    if (leadId) {
      await prisma.lead.update({
        where: { id: leadId },
        data: { status: "converted" }
      });
      revalidatePath("/admin/leads");
    }

    revalidatePath("/admin/projects");
    return { success: true, data: { id: project.id } };
  } catch (error: any) {
    console.error("Create project error:", error);
    return { error: error.message || "Failed to create project." };
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
  staffIds: z.array(z.string()).optional(),
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
        } else if (key === "staffIds") {
          updateData["staff"] = { set: (value as string[]).map((id) => ({ id })) };
        } else {
          updateData[key] = value;
        }
      }
    }

    // Fetch current project to check staff changes and get old dates for milestone recalculation
    const currentProj = await prisma.project.findUnique({
      where: { id },
      include: { staff: true, payments: true, milestones: true }
    });

    let existingStaffIds: string[] = [];
    if (currentProj && parsed.data.staffIds) {
      existingStaffIds = currentProj.staff.map(s => s.id);
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: { staff: true, customer: true }
    });

    // --- RECALCULATE OR GENERATE MILESTONES ---
    if (parsed.data.totalValue !== undefined || parsed.data.startDate !== undefined || parsed.data.expectedCompletion !== undefined) {
      if (currentProj && project.startDate && project.expectedCompletion) {
        
        const paymentStages = [
          { name: "Advance / Booking", percent: 0.10, timeOffset: 0 },
          { name: "Foundation & Plinth", percent: 0.20, timeOffset: 0.15 },
          { name: "Columns & Brickwork", percent: 0.20, timeOffset: 0.35 },
          { name: "Roof Slab Casting", percent: 0.20, timeOffset: 0.60 },
          { name: "Plastering & Finishing", percent: 0.20, timeOffset: 0.85 },
          { name: "Final Handover", percent: 0.10, timeOffset: 1.0 },
        ];

        // 1. Generate Construction Milestones if missing
        if (currentProj.milestones.length === 0) {
          await prisma.projectMilestone.createMany({
            data: DEFAULT_MILESTONES.map((m) => ({
              projectId: project.id,
              stage: m.stage,
              title: m.title,
              description: m.description,
              status: "upcoming"
            }))
          });
        }

        // 2. Generate Payment Milestones if missing, otherwise recalculate
        if (currentProj.payments.length === 0 && project.totalValue > 0) {
          const durationMs = project.expectedCompletion.getTime() - project.startDate.getTime();
          
          await prisma.paymentMilestone.createMany({
            data: paymentStages.map((stage) => {
              const dueDate = new Date(project.startDate!.getTime() + durationMs * stage.timeOffset);
              return {
                projectId: project.id,
                name: stage.name,
                amount: project.totalValue * stage.percent,
                dueDate: dueDate.toISOString(),
                status: "pending",
                description: `Payment for ${stage.name} stage`
              };
            })
          });
        } else if (currentProj.payments.length > 0) {
          const lockedMilestones = currentProj.payments.filter(m => m.status === "paid" || m.status === "partial");
          const unlockedMilestones = currentProj.payments.filter(m => m.status !== "paid" && m.status !== "partial");

          const lockedAmount = lockedMilestones.reduce((sum, m) => sum + m.amount, 0);
          let remainingValue = project.totalValue - lockedAmount;
          if (remainingValue < 0) remainingValue = 0; // Prevent negative milestone amounts

          const oldStartDate = currentProj.startDate || project.startDate;
          const oldExpectedCompletion = currentProj.expectedCompletion || project.expectedCompletion;
          let oldDurationMs = oldExpectedCompletion.getTime() - oldStartDate.getTime();
          if (oldDurationMs <= 0) oldDurationMs = 1; // prevent division by zero

          const newDurationMs = project.expectedCompletion.getTime() - project.startDate.getTime();
          const unlockedAmountSum = unlockedMilestones.reduce((sum, m) => sum + m.amount, 0);

          let unlockedPercentSum = 0;
          if (unlockedAmountSum === 0) {
            for (const um of unlockedMilestones) {
              const stage = paymentStages.find(s => s.name === um.name);
              if (stage) unlockedPercentSum += stage.percent;
            }
          }

          for (const um of unlockedMilestones) {
              let newAmount = 0;
              if (unlockedAmountSum > 0) {
                newAmount = remainingValue * (um.amount / unlockedAmountSum);
              } else {
                const stage = paymentStages.find(s => s.name === um.name);
                if (stage && unlockedPercentSum > 0) {
                  newAmount = remainingValue * (stage.percent / unlockedPercentSum);
                } else {
                  newAmount = remainingValue / unlockedMilestones.length;
                }
              }

              // Recalculate date dynamically based on original time offset
              const oldDueDate = new Date(um.dueDate);
              const timeOffset = (oldDueDate.getTime() - oldStartDate.getTime()) / oldDurationMs;
              const clampedOffset = Math.max(0, Math.min(1, timeOffset));
              const newDueDate = new Date(project.startDate.getTime() + newDurationMs * clampedOffset);

              await prisma.paymentMilestone.update({
                where: { id: um.id },
                data: {
                  amount: newAmount,
                  dueDate: newDueDate.toISOString()
                }
              });
          }
        }
      }
    }
    // --- END RECALCULATION ---

    // Send emails to newly added staff
    if (parsed.data.staffIds) {
      const newStaff = project.staff.filter(s => !existingStaffIds.includes(s.id));
      for (const staffMember of newStaff) {
        await sendEmail({
          to: staffMember.email,
          subject: "You've been assigned to a new project",
          html: `
            <h2>Hello ${staffMember.name},</h2>
            <p>You have been assigned to the project: <strong>${project.name}</strong>.</p>
            <p>Customer: ${project.customer.name}</p>
            <p>Site Address: ${project.siteAddress}</p>
            <br/>
            <p>Please login to the staff portal to view more details.</p>
            <p><a href="${process.env.NEXTAUTH_URL}/login">${process.env.NEXTAUTH_URL}/login</a></p>
            <br/>
            <p>Best regards,<br/>The Brick Basket Team</p>
          `
        });
      }
    }

    revalidatePath("/admin/projects");
    revalidatePath("/staff/dashboard");
    revalidatePath("/staff/progress");
    revalidatePath("/staff/documents");
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
        staff: { select: { id: true, name: true, phone: true, role: true } },
        milestones: { orderBy: { createdAt: "asc" } },
        progressUpdates: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: { uploadedBy: { select: { id: true, name: true } } },
        },
        documents: { orderBy: { createdAt: "desc" } },
        payments: { orderBy: { dueDate: "asc" } },
        paymentTransactions: { 
          orderBy: { date: "desc" },
          include: { recordedBy: { select: { name: true } } }
        },
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
        paymentTransactions: project.paymentTransactions.map((t) => ({
          ...t,
          date: t.date.toISOString(),
        })),
      },
    };
  } catch {
    return { error: "Failed to fetch project." };
  }
}
