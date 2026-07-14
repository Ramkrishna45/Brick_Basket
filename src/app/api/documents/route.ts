import { getApiUser } from "@/lib/api-auth";
import {
  success,
  created,
  unauthorized,
  forbidden,
  badRequest,
  serverError,
  withCors,
  handleCors,
} from "@/lib/api-utils";
import {
  getAllDocuments,
  uploadDocument,
} from "@/lib/services/document.service";

export async function OPTIONS() {
  return handleCors();
}

// GET /api/documents — Admin: get all documents with project info
export async function GET(req: Request) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized());
    if (user.role !== "admin") return withCors(forbidden());

    const data = await getAllDocuments(user.role);
    return withCors(success(data));
  } catch (error) {
    return withCors(serverError((error as Error).message));
  }
}

// POST /api/documents — Admin: create a document record
export async function POST(req: Request) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized());
    if (user.role !== "admin") return withCors(forbidden());

    const body = await req.json();
    const data = await uploadDocument(user.role, user.name ?? "Admin", body);
    return withCors(created(data));
  } catch (error) {
    const message = (error as Error).message;
    if (message === "Invalid data") return withCors(badRequest(message));
    return withCors(serverError(message));
  }
}
