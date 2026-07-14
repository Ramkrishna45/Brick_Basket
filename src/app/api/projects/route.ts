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
import { getAllProjects, createProject } from "@/lib/services/project.service";

export async function OPTIONS() {
  return handleCors();
}

// GET /api/projects — Admin: get all projects
export async function GET(req: Request) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized());
    if (user.role !== "admin") return withCors(forbidden());

    const data = await getAllProjects();
    return withCors(success(data));
  } catch (error) {
    return withCors(serverError((error as Error).message));
  }
}

// POST /api/projects — Admin: create a new project
export async function POST(req: Request) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized());
    if (user.role !== "admin") return withCors(forbidden());

    const body = await req.json();
    const data = await createProject(body);
    return withCors(created(data));
  } catch (error) {
    const message = (error as Error).message;
    if (message === "Invalid data") return withCors(badRequest(message));
    return withCors(serverError(message));
  }
}
