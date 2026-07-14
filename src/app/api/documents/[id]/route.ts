import { getApiUser } from "@/lib/api-auth";
import {
  success,
  unauthorized,
  forbidden,
  serverError,
  withCors,
  handleCors,
} from "@/lib/api-utils";
import { deleteDocument } from "@/lib/services/document.service";

export async function OPTIONS() {
  return handleCors();
}

// DELETE /api/documents/[id] — Admin: delete a document
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized());
    if (user.role !== "admin") return withCors(forbidden());

    const { id } = await params;
    const data = await deleteDocument(user.role, id);
    return withCors(success(data));
  } catch (error) {
    return withCors(serverError((error as Error).message));
  }
}
