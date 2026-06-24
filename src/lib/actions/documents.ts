"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

// ── Get Documents ───────────────────────────────────────────────────

export async function getDocumentsAction(
  projectId: string,
  category?: string
) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const where: Record<string, unknown> = { projectId };
    if (category && category !== "all") {
      where.category = category;
    }

    const documents = await prisma.document.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const data = documents.map((d) => ({
      ...d,
      createdAt: d.createdAt.toISOString(),
    }));

    return { success: true, data };
  } catch {
    return { error: "Failed to fetch documents." };
  }
}

// ── Admin: Upload Document (create record) ──────────────────────────

const uploadDocSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  fileType: z.string().min(1),
  fileSize: z.string().min(1),
  url: z.string().min(1),
  projectId: z.string().min(1),
});

export async function uploadDocumentAction(
  data: z.infer<typeof uploadDocSchema>
) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };
    if ((session.user as { role?: string }).role !== "admin")
      return { error: "Forbidden" };

    const parsed = uploadDocSchema.safeParse(data);
    if (!parsed.success) return { error: "Invalid data" };

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
        uploadedBy: session.user?.name ?? "Admin",
        projectId: parsed.data.projectId,
      },
    });

    return { success: true, data: { id: doc.id } };
  } catch {
    return { error: "Failed to upload document." };
  }
}
