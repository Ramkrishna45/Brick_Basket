import { createClient } from "@supabase/supabase-js";

// ── Upload File to Supabase Storage ─────────────────────────────────

export async function uploadFile(file: File): Promise<string> {
  if (!file) throw new Error("No file provided");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase storage is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables."
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const timestamp = Date.now();
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
  const filename = `${timestamp}-${cleanFileName}`;

  const { error } = await supabase.storage
    .from("uploads")
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Supabase storage error:", error);
    throw new Error(`Supabase Storage Error: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("uploads").getPublicUrl(filename);

  return publicUrl;
}
