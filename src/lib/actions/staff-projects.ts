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
