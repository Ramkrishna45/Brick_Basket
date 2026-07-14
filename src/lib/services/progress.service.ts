import { prisma } from "@/lib/db";
import { z } from "zod";

// ── Zod Schema ────────────────────────────────────────────────────────

const createProgressSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  stage: z.string().min(1),
  completionPercentage: z.number().min(0).max(100),
  photos: z.array(z.string()).optional(),
  projectId: z.string().min(1),
});

// ── Get Progress Updates ──────────────────────────────────────────────

export async function getProgressUpdates(projectId: string, stage?: string) {
  const where: Record<string, unknown> = { projectId };
  if (stage && stage !== "all") {
    where.stage = stage;
  }

  const updates = await prisma.progressUpdate.findMany({
    where,
    include: {
      uploadedBy: { select: { id: true, name: true } },
      media: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return updates.map((u) => {
    const photos = u.media?.filter(m => m.fileType === "image").map(m => m.url) || [];
    return {
      ...u,
      photos,
      createdAt: u.createdAt.toISOString(),
      media: undefined
    };
  });
}

// ── Create Progress Update ────────────────────────────────────────────
// Unified from progress.ts and staff-projects.ts variants.
// Both create a ProgressUpdate and sync the project's currentStage
// and completionPercentage.

export async function createProgressUpdate(
  data: z.infer<typeof createProgressSchema>,
  userId: string,
  userRole: string
) {
  // Role check: only engineers and admins can post updates
  if (userRole !== "engineer" && userRole !== "admin") {
    throw new Error("Forbidden: only engineers and admins can post updates");
  }

  const parsed = createProgressSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  // If staff (non-admin), verify they are assigned to the project
  if (userRole !== "admin") {
    const project = await prisma.project.findUnique({
      where: { id: parsed.data.projectId },
      include: { staff: true },
    });

    if (!project) throw new Error("Project not found");

    const isAssigned = project.staff.some((s) => s.id === userId);
    if (!isAssigned) throw new Error("Forbidden: not assigned to this project");
  }

  const now = new Date();
  const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const timeStr = now.toTimeString().split(" ")[0]; // HH:MM:SS

  const update = await prisma.progressUpdate.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      stage: parsed.data.stage,
      completionPercentage: parsed.data.completionPercentage,
      date: dateStr,
      time: timeStr,
      projectId: parsed.data.projectId,
      uploadedById: userId,
      media: {
        create: (parsed.data.photos ?? []).map((url) => ({
          url,
          fileType: "image",
          uploadedById: userId,
          projectId: parsed.data.projectId,
        }))
      }
    },
  });

  // Sync the project's current stage and completion percentage
  await prisma.project.update({
    where: { id: parsed.data.projectId },
    data: {
      currentStage: parsed.data.stage,
      completionPercentage: parsed.data.completionPercentage,
    },
  });

  return { id: update.id };
}
