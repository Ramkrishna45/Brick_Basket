import { getApiUser } from "@/lib/api-auth";
import {
  success,
  unauthorized,
  serverError,
  withCors,
  handleCors,
} from "@/lib/api-utils";
import { getMyEnquiries } from "@/lib/services/lead.service";

export async function OPTIONS() {
  return handleCors();
}

// GET /api/leads/mine — Customer: get enquiries matching logged-in user's email
export async function GET(req: Request) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized());

    const data = await getMyEnquiries(user.email);
    return withCors(success(data));
  } catch (error) {
    return withCors(serverError((error as Error).message));
  }
}
