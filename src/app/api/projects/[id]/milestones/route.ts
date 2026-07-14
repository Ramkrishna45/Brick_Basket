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
import { getPaymentMilestones } from "@/lib/services/payment.service";
import { getProjectById } from "@/lib/services/project.service";

export async function OPTIONS(req: Request) {
  return handleCors(req);
}

// GET /api/projects/[id]/milestones — Get payment milestones
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized(), req);

    const { id } = await params;

    // IDOR fix: verify ownership before returning milestones
    const project = await getProjectById(id);
    if (!project) return withCors(notFound('Project not found'), req);
    if (user.role === 'customer' && project.customerId !== user.id) {
      return withCors(forbidden('You do not have access to this project'), req);
    }
    if ((user.role === 'engineer' || user.role === 'contractor') &&
        !project.staff.some((s: any) => s.id === user.id)) {
      return withCors(forbidden('You are not assigned to this project'), req);
    }

    const data = await getPaymentMilestones(id);
    return withCors(success(data), req);
  } catch (error) {
    return withCors(serverError((error as Error).message), req);
  }
}
