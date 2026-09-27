import { createClient } from "@supabase/supabase-js";

export async function getPresignedUploadUrl(fileName: string, contentType: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // MUST use Service Role Key to bypass RLS for secure uploads
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. You must add it to your .env file to generate secure upload URLs."
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const timestamp = Date.now();
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, "");
  const uniqueName = `${timestamp}-${cleanFileName}`;

  const { data, error } = await supabase.storage
    .from("uploads")
    .createSignedUploadUrl(uniqueName);

  if (error || !data) {
    console.error("Supabase signed URL error:", error);
    throw new Error("Failed to generate secure upload URL");
  }

  // Also pre-compute the future public URL so the client knows where it will live
  const {
    data: { publicUrl },
  } = supabase.storage.from("uploads").getPublicUrl(uniqueName);

  return {
    signedUrl: data.signedUrl,
    token: data.token, // Some clients need the token separately
    path: data.path,
    publicUrl,
  };
}
