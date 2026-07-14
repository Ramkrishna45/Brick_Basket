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
  getProgressUpdates,
  createProgressUpdate,
} from "@/lib/services/progress.service";
import { getProjectById } from "@/lib/services/project.service";

export async function OPTIONS(req: Request) {
  return handleCors(req);
}

// GET /api/projects/[id]/progress?stage=xxx — Get progress updates
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

    const data = await getProgressUpdates(id, stage);
    return withCors(success(data), req);
  } catch (error) {
    return withCors(serverError((error as Error).message), req);
  }
}

// POST /api/projects/[id]/progress — Create a progress update
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized(), req);

    const { id } = await params;
    const body = await req.json();

    // Inject projectId from the URL path
    const payload = { ...body, projectId: id };

    const data = await createProgressUpdate(payload, user.id, user.role);
    return withCors(created(data), req);
  } catch (error) {
    const message = (error as Error).message;
    if (message.startsWith("Forbidden")) return withCors(forbidden(message), req);
    if (message === "Invalid data") return withCors(badRequest(message), req);
    if (message === "Project not found")
      return withCors(badRequest("Project not found"), req);
    return withCors(serverError(message), req);
  }
}
