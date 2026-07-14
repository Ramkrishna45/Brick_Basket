import { getApiUser } from "@/lib/api-auth";
import {
  success,
  unauthorized,
  forbidden,
  notFound,
  badRequest,
  serverError,
  withCors,
  handleCors,
} from "@/lib/api-utils";
import { getProjectById, updateProject } from "@/lib/services/project.service";

export async function OPTIONS(req: Request) {
  return handleCors(req);
}

// GET /api/projects/[id] — Get project by ID (authenticated)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized(), req);

    const { id } = await params;
    const data = await getProjectById(id);
    if (!data) return withCors(notFound("Project not found"), req);

    // IDOR fix: customers can only see their own project
    if (user.role === "customer" && data.customerId !== user.id) {
      return withCors(forbidden("You do not have access to this project"), req);
    }
    // Staff can only see assigned projects
    if ((user.role === "engineer" || user.role === "contractor") && 
        !data.staff.some(s => s.id === user.id)) {
      return withCors(forbidden("You are not assigned to this project"), req);
    }

    return withCors(success(data), req);
  } catch (error) {
    return withCors(serverError((error as Error).message), req);
  }
}

// PUT /api/projects/[id] — Admin: update project
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized(), req);
    if (user.role !== "admin") return withCors(forbidden(), req);

    const { id } = await params;
    const body = await req.json();
    const data = await updateProject(id, body);
    return withCors(success(data), req);
  } catch (error) {
    const message = (error as Error).message;
    if (message === "Invalid data") return withCors(badRequest(message), req);
    if (message === "Project not found") return withCors(notFound(message), req);
    return withCors(serverError(message), req);
  }
}
