import { getApiUser } from "@/lib/api-auth";
import {
  success,
  unauthorized,
  forbidden,
  notFound,
  serverError,
  withCors,
  handleCors,
} from "@/lib/api-utils";
import { getDocuments } from "@/lib/services/document.service";
import { getProjectById } from "@/lib/services/project.service";

export async function OPTIONS(req: Request) {
  return handleCors(req);
}

// GET /api/projects/[id]/documents — Get documents for a specific project
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized(), req);

    const { id } = await params;

    // IDOR fix: verify ownership before returning documents
    const project = await getProjectById(id);
    if (!project) return withCors(notFound('Project not found'), req);
    if (user.role === 'customer' && project.customerId !== user.id) {
      return withCors(forbidden('You do not have access to this project'), req);
    }
    if ((user.role === 'engineer' || user.role === 'contractor') &&
        !project.staff.some((s: any) => s.id === user.id)) {
      return withCors(forbidden('You are not assigned to this project'), req);
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") ?? undefined;

    const data = await getDocuments(id, category);
    return withCors(success(data), req);
  } catch (error) {
    return withCors(serverError((error as Error).message), req);
  }
}
