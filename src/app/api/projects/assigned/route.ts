import { getApiUser } from "@/lib/api-auth";
import {
  success,
  unauthorized,
  forbidden,
  serverError,
  withCors,
  handleCors,
} from "@/lib/api-utils";
import { getStaffAssignedProjects } from "@/lib/services/project.service";

export async function OPTIONS() {
  return handleCors();
}

// GET /api/projects/assigned — Staff: get assigned projects
export async function GET(req: Request) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized());

    if (
      user.role !== "engineer" &&
      user.role !== "contractor" &&
      user.role !== "admin"
    ) {
      return withCors(forbidden());
    }

    const data = await getStaffAssignedProjects(user.id);
    return withCors(success(data));
  } catch (error) {
    return withCors(serverError((error as Error).message));
  }
}
