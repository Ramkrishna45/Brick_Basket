"use server";

import { auth } from "@/lib/auth";
import * as uploadService from "@/lib/services/upload.service";

export async function uploadFileAction(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const file = formData.get("file") as File;
    if (!file) {
      return { error: "No file provided" };
    }

    const url = await uploadService.uploadFile(file);
    return { success: true, url };
  } catch (error: any) {
    console.error("Upload error:", error);
    return { error: error.message || "Failed to upload file to cloud storage" };
  }
}
