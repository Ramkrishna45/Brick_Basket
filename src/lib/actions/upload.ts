"use server";

import { auth } from "@/lib/auth";
import * as uploadService from "@/lib/services/upload.service";

export async function uploadFileAction(fileName: string, contentType: string) {
  try {
    const session = await auth();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const data = await uploadService.getPresignedUploadUrl(fileName, contentType);
    return { success: true, data };
  } catch (error: any) {
    console.error("Upload URL generation error:", error);
    return { error: error.message || "Failed to generate upload URL" };
  }
}
