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

export async function OPTIONS(req: Request) {
  return handleCors(req);
}

// GET /api/projects ?" Admin: get all projects
export async function GET(req: Request) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized(), req);
    if (user.role !== "admin") return withCors(forbidden(), req);

    // Backend service doesn't support pagination yet, just return all
    const data = await getAllProjects();
    return withCors(success(data), req);
  } catch (error) {
    return withCors(serverError((error as Error).message), req);
  }
}

// POST /api/projects ?" Admin: create a new project
export async function POST(req: Request) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized(), req);
    if (user.role !== "admin") return withCors(forbidden(), req);

    const body = await req.json();
    const data = await createProject(body);
    return withCors(created(data), req);
  } catch (error) {
    const message = (error as Error).message;
    if (message === "Invalid data") return withCors(badRequest(message), req);
    return withCors(serverError(message), req);
  }
}
