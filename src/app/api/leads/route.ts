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
import { getLeads, submitEnquiry } from "@/lib/services/lead.service";

export async function OPTIONS() {
  return handleCors();
}

// GET /api/leads — Admin: list all leads (with optional status/search filters)
export async function GET(req: Request) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized());
    if (user.role !== "admin") return withCors(forbidden());

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") ?? undefined;
    const search = searchParams.get("search") ?? undefined;

    const data = await getLeads(user.role, status, search);
    return withCors(success(data));
  } catch (error) {
    return withCors(serverError((error as Error).message));
  }
}

// POST /api/leads — Public: submit an enquiry (no auth required)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await submitEnquiry(body);
    return withCors(created(data));
  } catch (error) {
    return withCors(badRequest((error as Error).message));
  }
}
