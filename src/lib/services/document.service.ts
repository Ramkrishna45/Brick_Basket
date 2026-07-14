import { prisma } from "@/lib/db";
import { z } from "zod";

// ── Zod Schemas ─────────────────────────────────────────────────────

const uploadDocSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  fileType: z.string().min(1),
  fileSize: z.string().min(1),
  url: z.string().min(1),
  projectId: z.string().min(1),
});

// ── Get Documents (project-scoped) ──────────────────────────────────

export async function getDocuments(projectId: string, category?: string) {
  const where: Record<string, unknown> = { projectId };
  if (category && category !== "all") {
    where.category = category;
  }

  const documents = await prisma.document.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return documents.map((d) => ({
    ...d,
    createdAt: d.createdAt.toISOString(),
  }));
}

// ── Admin: Get All Documents ────────────────────────────────────────

export async function getAllDocuments(userRole: string) {
  if (userRole !== "admin") throw new Error("Forbidden");

  const documents = await prisma.document.findMany({
    include: {
      project: {
        select: { name: true, customer: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return documents.map((d) => ({
    ...d,
    createdAt: d.createdAt.toISOString(),
  }));
}

// ── Admin: Upload Document (create record) ──────────────────────────

export async function uploadDocument(
  userRole: string,
  userName: string,
  data: z.infer<typeof uploadDocSchema>
) {
  if (userRole !== "admin") throw new Error("Forbidden");

  const parsed = uploadDocSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  const now = new Date();
  const uploadDate = now.toISOString().split("T")[0];

  const doc = await prisma.document.create({
    data: {
      name: parsed.data.name,
      category: parsed.data.category,
      fileType: parsed.data.fileType,
      fileSize: parsed.data.fileSize,
      url: parsed.data.url,
      uploadDate,
      uploadedBy: userName ?? "Admin",
      projectId: parsed.data.projectId,
    },
  });

  return { id: doc.id };
}

// ── Admin: Delete Document ──────────────────────────────────────────

export async function deleteDocument(userRole: string, id: string) {
  if (userRole !== "admin") throw new Error("Forbidden");

  await prisma.document.delete({
    where: { id },
  });

  return { success: true };
}
