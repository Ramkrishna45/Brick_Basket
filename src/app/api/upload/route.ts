import { getApiUser } from "@/lib/api-auth";
import {
  success,
  unauthorized,
  badRequest,
  serverError,
  withCors,
  handleCors,
} from "@/lib/api-utils";
import { uploadFile } from "@/lib/services/upload.service";

export async function OPTIONS(req: Request) {
  return handleCors(req);
}

// Whitelist of allowed MIME types for uploads
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
]);

// 10MB max file size
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

// POST /api/upload — Upload a file to Supabase Storage
export async function POST(req: Request) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized(), req);

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return withCors(badRequest("No file provided"), req);

    // ── Security checks ───────────────────────────────────
    // 1. File type whitelist
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return withCors(
        badRequest(`File type '${file.type}' is not allowed. Only images and PDFs are accepted.`),
        req
      );
    }

    // 2. File size limit
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return withCors(badRequest("File size exceeds 10MB limit."), req);
    }

    // 3. Verify file name is reasonable (no path traversal)
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100);
    const safeFile = new File([await file.arrayBuffer()], safeName, { type: file.type });

    const url = await uploadFile(safeFile);
    return withCors(success({ url }), req);
  } catch (error) {
    return withCors(serverError((error as Error).message), req);
  }
}
