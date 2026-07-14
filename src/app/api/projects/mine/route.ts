import { getApiUser } from "@/lib/api-auth";
import {
  success,
  unauthorized,
  serverError,
  withCors,
  handleCors,
} from "@/lib/api-utils";
import { getMyProjects, getMyEnquiries } from "@/lib/services/project.service";

export async function OPTIONS() {
  return handleCors();
}

// GET /api/projects/mine — Customer: get my projects + enquiries
export async function GET(req: Request) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized());

    const [projects, enquiries] = await Promise.all([
      getMyProjects(user.id),
      getMyEnquiries(user.email),
    ]);

    return withCors(success({ projects, enquiries }));
  } catch (error) {
    return withCors(serverError((error as Error).message));
  }
}
