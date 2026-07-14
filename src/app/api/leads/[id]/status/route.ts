import { getApiUser } from "@/lib/api-auth";
import {
  success,
  unauthorized,
  forbidden,
  badRequest,
  serverError,
  withCors,
  handleCors,
} from "@/lib/api-utils";
import { updateLeadStatus } from "@/lib/services/lead.service";

export async function OPTIONS() {
  return handleCors();
}

// PATCH /api/leads/[id]/status — Admin: update lead status
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized());
    if (user.role !== "admin") return withCors(forbidden());

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) return withCors(badRequest("Status is required"));

    const data = await updateLeadStatus(user.role, id, status);
    return withCors(success(data));
  } catch (error) {
    return withCors(serverError((error as Error).message));
  }
}
