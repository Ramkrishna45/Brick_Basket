"use server";

import { auth } from "@/lib/auth";
import { z } from "zod";
import * as progressService from "@/lib/services/progress.service";

const createProgressSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  stage: z.string().min(1),
  completionPercentage: z.number().min(0).max(100),
  photos: z.array(z.string()).optional(),
  projectId: z.string().min(1),
});

export async function getProgressUpdatesAction(projectId: string, stage?: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const data = await progressService.getProgressUpdates(projectId, stage);
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch progress updates." };
  }
}

export async function createProgressUpdateAction(data: z.infer<typeof createProgressSchema>) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) return { error: "Unauthorized" };

    const result = await progressService.createProgressUpdate(
      data,
      session.user.id,
      (session.user as any).role || ""
    );

    return { success: true, data: result };
  } catch (error: any) {
    return { error: error.message || "Failed to create progress update." };
  }
}
