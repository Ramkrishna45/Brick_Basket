import { prisma } from "@/lib/db";
import { z } from "zod";

const createProgressSchema = z.object({
  projectId: z.string(),
  title: z.string().optional().default("Update"),
  description: z.string().optional().default(""),
  stage: z.string(),
  completionPercentage: z.number().min(0).max(100),
  photos: z.array(z.string()).optional(),
  reason: z.string().optional(), // For backward progress
});

export async function getProjectProgress(projectId: string) {
  return await prisma.progressUpdate.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    include: {
      media: true,
      uploadedBy: { select: { name: true, role: true } },
    }
  });
}

export async function createProgressUpdate(data: any, userId: string) {
  const parsed = createProgressSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid progress data");
  }

  const { projectId, title, description, stage, completionPercentage, photos, reason } = parsed.data;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { completionPercentage: true },
  });

  if (!project) throw new Error("Project not found");

  if (completionPercentage < project.completionPercentage && !reason) {
    throw new Error("Progress regression requires a reason.");
  }

  // Create the progress update in a transaction
  return await prisma.$transaction(async (tx) => {
    // Generate simple date/time strings for the required fields
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toISOString().split("T")[1].substring(0, 5);

    const update = await tx.progressUpdate.create({
      data: {
        projectId,
        title,
        description,
        stage,
        completionPercentage,
        date: dateStr,
        time: timeStr,
        uploadedById: userId,
      },
    });

    if (photos && photos.length > 0) {
      await tx.media.createMany({
        data: photos.map((url) => ({
          url,
          entityType: "ProgressUpdate",
          entityId: update.id,
          projectId,
          fileType: "image",
          uploadedById: userId,
        })),
      });
    }

    // Update project overall completion
    await tx.project.update({
      where: { id: projectId },
      data: { completionPercentage },
    });

    // Record audit log for project timeline/financial audit trail
    await tx.auditLog.create({
      data: {
        action: "PROGRESS_UPDATE",
        details: JSON.stringify({
          message: `Project progress updated to ${completionPercentage}% (Stage: ${stage})`,
          previousPercentage: project.completionPercentage,
          newPercentage: completionPercentage,
          reason: reason || "Normal progression",
        }),
        userId: userId,
        entityType: "Project",
        entityId: projectId,
      }
    });

    return update;
  });
}