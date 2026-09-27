import { getApiUser } from "@/lib/api-auth";
import {
  success,
  unauthorized,
  badRequest,
  serverError,
  withCors,
  handleCors,
} from "@/lib/api-utils";
import { getPresignedUploadUrl } from "@/lib/services/upload.service";

export async function OPTIONS(req: Request) {
  return handleCors(req);
}

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
]);

// POST /api/upload -> Request Pre-signed URL
export async function POST(req: Request) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized(), req);

    const body = await req.json();
    const { fileName, contentType } = body;

    if (!fileName || !contentType) {
      return withCors(badRequest("fileName and contentType are required"), req);
    }

    if (!ALLOWED_MIME_TYPES.has(contentType)) {
      return withCors(
        badRequest(`File type '${contentType}' is not allowed.`),
        req
      );
    }

    const data = await getPresignedUploadUrl(fileName, contentType);
    
    return withCors(success(data), req);
  } catch (error) {
    return withCors(serverError((error as Error).message), req);
  }
}
