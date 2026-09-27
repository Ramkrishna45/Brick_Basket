import { prisma } from "@/lib/db";
import { z } from "zod";
import { auditLog } from "@/lib/audit";

const CONSTRUCTION_STAGES = ["planning", "foundation", "columns", "walls", "slab", "plumbing", "electrical", "finishing", "handover"] as const;

const createProgressSchema = z.object({
  projectId: z.string(),
  stage: z.enum(CONSTRUCTION_STAGES),
  completionPercentage: z.number().min(0).max(100),
  notes: z.string().optional(),
  photos: z.array(z.string()).optional(),
  reason: z.string().optional(), // For backward progress
});

export async function getProjectProgress(projectId: string) {
  return await prisma.progressUpdate.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    include: {
      media: true,
      postedBy: { select: { name: true, role: true } },
    }
  });
}

export async function createProgressUpdate(data: any, userId: string) {
  const parsed = createProgressSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid progress data");
  }

  const { projectId, stage, completionPercentage, notes, photos, reason } = parsed.data;

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
    const update = await tx.progressUpdate.create({
      data: {
        projectId,
        stage,
        completionPercentage,
        notes,
        postedById: userId,
      },
    });

    if (photos && photos.length > 0) {
      await tx.media.createMany({
        data: photos.map((url) => ({
          url,
          entityType: "ProgressUpdate",
          entityId: update.id,
          projectId,
          uploadedBy: userId,
        })),
      });
    }

    // Sync project master data
    await tx.project.update({
      where: { id: projectId },
      data: {
        currentStage: stage,
        completionPercentage,
      },
    });

    // Audit log if there was a regression
    if (completionPercentage < project.completionPercentage) {
      // Create a mock audit log function or just insert if AuditLog exists
      // Assuming AuditLog model exists based on the master plan.
      try {
        await tx.auditLog.create({
          data: {
            userId,
            action: "PROGRESS_REGRESSION",
            entityType: "Project",
            entityId: projectId,
            details: JSON.stringify({ 
              old: project.completionPercentage, 
              new: completionPercentage, 
              reason 
            })
          }
        });
      } catch (e) {
        // Fallback if AuditLog isn't migrated yet
        console.warn("AuditLog failed. Model might not exist yet.", e);
      }
    }

    return update;
  });
}
