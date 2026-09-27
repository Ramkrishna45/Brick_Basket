"use server";

import * as progressService from "@/lib/services/progress.service";
import { getProjectById } from "@/lib/services/project.service";
import { requireRole, checkProjectAccess } from "@/lib/rbac";

export async function getProgressUpdatesAction(projectId: string) {
  try {
    const { authorized, user, error } = await requireRole(["admin", "engineer", "contractor", "customer"]);
    if (!authorized) return { error };

    const project = await getProjectById(projectId);
    const access = checkProjectAccess(user.id, (user as any).role, project);
    if (!access.authorized) return { error: access.error };

    const data = await progressService.getProjectProgress(projectId);
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch progress updates." };
  }
}

export async function createProgressUpdateAction(data: {
  projectId: string;
  stage: any;
  completionPercentage: number;
  notes?: string;
  photos?: string[];
}) {
  try {
    const { authorized, user, error } = await requireRole(["admin", "engineer", "contractor"]);
    if (!authorized) return { error };

    const project = await getProjectById(data.projectId);
    const access = checkProjectAccess(user.id, (user as any).role, project);
    if (!access.authorized) return { error: access.error };

    const result = await progressService.createProgressUpdate(data, user.id);
    return { success: true, data: result };
  } catch (error: any) {
    return { error: error.message || "Failed to create progress update." };
  }
}
