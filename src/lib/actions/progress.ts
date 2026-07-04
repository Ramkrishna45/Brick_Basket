"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

// ── Get Progress Updates ────────────────────────────────────────────

export async function getProgressUpdatesAction(
  projectId: string,
  stage?: string
) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const where: Record<string, unknown> = { projectId };
    if (stage && stage !== "all") {
      where.stage = stage;
    }

    const updates = await prisma.progressUpdate.findMany({
      where,
      include: {
        uploadedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const data = updates.map((u) => ({
      ...u,
      photos: JSON.parse(u.photos) as string[],
      createdAt: u.createdAt.toISOString(),
    }));

    return { success: true, data };
  } catch {
    return { error: "Failed to fetch progress updates." };
  }
}

// ── Create Progress Update ──────────────────────────────────────────

const createProgressSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  stage: z.string().min(1),
  completionPercentage: z.number().min(0).max(100),
  photos: z.array(z.string()).optional(),
  projectId: z.string().min(1),
});

export async function createProgressUpdateAction(
  data: z.infer<typeof createProgressSchema>
) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const role = (session.user as { role?: string }).role;
    if (role !== "engineer" && role !== "admin")
      return { error: "Forbidden: only engineers and admins can post updates" };

    const parsed = createProgressSchema.safeParse(data);
    if (!parsed.success) return { error: "Invalid data" };

    const userId = session.user?.id;
    if (!userId) return { error: "Unauthorized" };

    const now = new Date();
    const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const timeStr = now.toTimeString().split(" ")[0]; // HH:MM:SS

    const update = await prisma.progressUpdate.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        stage: parsed.data.stage,
        completionPercentage: parsed.data.completionPercentage,
        photos: JSON.stringify(parsed.data.photos ?? []),
        date: dateStr,
        time: timeStr,
        projectId: parsed.data.projectId,
        uploadedById: userId,
      },
    });

    await prisma.project.update({
      where: { id: parsed.data.projectId },
      data: {
        currentStage: parsed.data.stage,
        completionPercentage: parsed.data.completionPercentage,
      },
    });

    return { success: true, data: { id: update.id } };
  } catch {
    return { error: "Failed to create progress update." };
  }
}
