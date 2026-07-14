"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import * as documentService from "@/lib/services/document.service";
import { z } from "zod";

const uploadDocSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  fileType: z.string().min(1),
  fileSize: z.string().min(1),
  url: z.string().min(1),
  projectId: z.string().min(1),
});

export async function getDocumentsAction(projectId: string, category?: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const data = await documentService.getDocuments(projectId, category);
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch documents." };
  }
}

export async function uploadDocumentAction(data: z.infer<typeof uploadDocSchema>) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const result = await documentService.uploadDocument(
      (session.user as any).role || "",
      session.user?.name || "Admin",
      data
    );

    revalidatePath("/admin-documents");
    revalidatePath("/documents");
    revalidatePath(`/projects/${data.projectId}`);

    return { success: true, data: result };
  } catch (error: any) {
    return { error: error.message || "Failed to upload document." };
  }
}

export async function getAllDocumentsAction() {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const data = await documentService.getAllDocuments((session.user as any).role || "");
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch documents." };
  }
}

export async function deleteDocumentAction(id: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    await documentService.deleteDocument((session.user as any).role || "", id);

    revalidatePath("/admin-documents");
    revalidatePath("/documents");

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete document." };
  }
}
