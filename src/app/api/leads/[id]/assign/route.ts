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
import { assignLead } from "@/lib/services/lead.service";

export async function OPTIONS() {
  return handleCors();
}

// PATCH /api/leads/[id]/assign — Admin: assign lead to a staff member
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
    const { userId } = body;

    if (!userId) return withCors(badRequest("userId is required"));

    const data = await assignLead(user.role, id, userId);
    return withCors(success(data));
  } catch (error) {
    return withCors(serverError((error as Error).message));
  }
}
