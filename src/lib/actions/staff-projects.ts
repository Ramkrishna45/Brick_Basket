"use server";

import { auth } from "@/lib/auth";
import * as projectService from "@/lib/services/project.service";
import * as progressService from "@/lib/services/progress.service";

export async function getStaffAssignedProjectsAction() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) return { error: "Unauthorized" };

    const userRole = (session.user as any).role;
    if (userRole !== "engineer" && userRole !== "contractor" && userRole !== "admin") {
      return { error: "Forbidden" };
    }

    const data = await projectService.getStaffAssignedProjects(session.user.id);
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to fetch assigned projects:", error);
    return { error: error.message || "Failed to fetch assigned projects." };
  }
}

export async function createProgressUpdateAction(data: {
  projectId: string;
  title: string;
  description: string;
  stage: string;
  completionPercentage: number;
  images: string[];
}) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) return { error: "Unauthorized" };

    const result = await progressService.createProgressUpdate(
      {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        stage: data.stage,
        completionPercentage: data.completionPercentage,
        photos: data.images,
      },
      session.user.id,
      (session.user as any).role || ""
    );

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Failed to create progress update:", error);
    return { error: error.message || "Failed to create progress update." };
  }
}
