import { getApiUser } from "@/lib/api-auth";
import {
  created,
  unauthorized,
  forbidden,
  notFound,
  badRequest,
  serverError,
  withCors,
  handleCors,
} from "@/lib/api-utils";
import { recordPayment } from "@/lib/services/payment.service";
import { getProjectById } from "@/lib/services/project.service";

export async function OPTIONS(req: Request) {
  return handleCors(req);
}

// POST /api/projects/[id]/payments — Record a payment (waterfall distribution)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized(), req);

    if (
      user.role !== "admin" &&
      user.role !== "engineer" &&
      user.role !== "contractor"
    ) {
      return withCors(forbidden(), req);
    }

    const { id } = await params;

    // Staff assignment check: engineers/contractors must be assigned to this project
    if (user.role === 'engineer' || user.role === 'contractor') {
      const project = await getProjectById(id);
      if (!project) return withCors(notFound('Project not found'), req);
      if (!project.staff.some((s: any) => s.id === user.id)) {
        return withCors(forbidden('You are not assigned to this project'), req);
      }
    }

    const body = await req.json();

    if (!body.amount || !body.method) {
      return withCors(badRequest("amount and method are required"), req);
    }

    const data = await recordPayment(
      {
        projectId: id,
        amount: body.amount,
        method: body.method,
        transactionId: body.transactionId,
        notes: body.notes,
      },
      user.id
    );

    return withCors(created(data), req);
  } catch (error) {
    return withCors(serverError((error as Error).message), req);
  }
}
