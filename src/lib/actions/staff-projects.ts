"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function getStaffAssignedProjectsAction() {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const userRole = (session.user as any).role;
    if (userRole !== "engineer" && userRole !== "contractor" && userRole !== "admin") {
      return { error: "Forbidden" };
    }

    const userId = session.user?.id;
    if (!userId) return { error: "Unauthorized" };

    const projects = await prisma.project.findMany({
      where: {
        staff: {
          some: { id: userId }
        }
      },
      include: {
        customer: { select: { name: true, phone: true } },
        milestones: { orderBy: { createdAt: "asc" } },
        progressUpdates: {
          orderBy: { createdAt: "desc" },
          take: 3,
        }
      },
      orderBy: { createdAt: "desc" },
    });

    const data = projects.map(p => ({
      ...p,
      startDate: p.startDate?.toISOString() ?? null,
      expectedCompletion: p.expectedCompletion?.toISOString() ?? null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      milestones: p.milestones.map((m: any) => ({
        ...m,
        startDate: m.startDate?.toISOString() ?? null,
        completedDate: m.completedDate?.toISOString() ?? null,
        createdAt: m.createdAt.toISOString(),
      })),
      progressUpdates: p.progressUpdates.map((u: any) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
      })),
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch assigned projects:", error);
    return { error: "Failed to fetch assigned projects." };
  }
}

export async function createProgressUpdateAction(data: { projectId: string; title: string; description: string; stage: string; completionPercentage: number; images: string[] }) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const userId = session.user?.id;
    if (!userId) return { error: "Unauthorized" };

    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
      include: { staff: true },
    });

    if (!project) return { error: "Project not found" };

    const isAssigned = project.staff.some(s => s.id === userId);
    if (!isAssigned) return { error: "Forbidden" };

    const update = await prisma.progressUpdate.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        stage: data.stage,
        photos: JSON.stringify(data.images),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        uploadedById: userId,
      }
    });

    await prisma.project.update({
      where: { id: data.projectId },
      data: {
        currentStage: data.stage,
        completionPercentage: data.completionPercentage,
      }
    });

    return { success: true, data: update };
  } catch (error) {
    console.error("Failed to create progress update:", error);
    return { error: "Failed to create progress update." };
  }
}

