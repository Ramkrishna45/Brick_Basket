"use server";
import { auth } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return { error: "Supabase storage is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables." };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
    const filename = `${timestamp}-${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return { error: "Failed to upload file to cloud storage: " + error.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from("uploads")
      .getPublicUrl(filename);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Failed to upload file" };
  }
}
