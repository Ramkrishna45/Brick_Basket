import { getApiUser } from "@/lib/api-auth";
import {
  success,
  created,
  unauthorized,
  forbidden,
  notFound,
  badRequest,
  serverError,
  withCors,
  handleCors,
} from "@/lib/api-utils";
import {
  getProjectProgress,
  createProgressUpdate,
} from "@/lib/services/progress.service";
import { getProjectById } from "@/lib/services/project.service";
import { checkProjectAccess } from "@/lib/rbac";

export async function OPTIONS(req: Request) {
  return handleCors(req);
}

// GET /api/projects/[id]/progress?stage=xxx
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized(), req);

    const { id } = await params;

    // IDOR fix: verify ownership before returning progress
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
    const stage = searchParams.get("stage") ?? undefined;

    const data = await getProjectProgress(id);
    return withCors(success(data), req);
  } catch (error) {
    return withCors(serverError((error as Error).message), req);
  }
}

// POST /api/projects/[id]/progress
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized(), req);

    const { id } = await params;

    // RBAC + IDOR fix
    const project = await getProjectById(id);
    if (!project) return withCors(notFound('Project not found'), req);
    
    // Only admins and assigned staff can create progress updates
    const access = checkProjectAccess(user.id, user.role, project);
    if (!access.authorized || user.role === 'customer') {
      return withCors(forbidden("You are not authorized to update this project"), req);
    }

    const body = await req.json();
    const payload = { ...body, projectId: id };

    // Removed the 3rd argument to match the updated service signature
    const data = await createProgressUpdate(payload, user.id);
    return withCors(created(data), req);
  } catch (error) {
    const message = (error as Error).message;
    if (message.startsWith("Forbidden")) return withCors(forbidden(message), req);
    if (message === "Invalid data") return withCors(badRequest(message), req);
    if (message === "Project not found") return withCors(badRequest("Project not found"), req);
    return withCors(serverError(message), req);
  }
}
