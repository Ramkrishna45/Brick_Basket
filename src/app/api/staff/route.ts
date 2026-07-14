import { getApiUser } from "@/lib/api-auth";
import { getAllStaff, createStaff } from "@/lib/services/staff.service";
import { success, created, unauthorized, forbidden, badRequest, serverError, withCors, handleCors } from "@/lib/api-utils";

export async function OPTIONS(req: Request) {
  return handleCors(req);
}

export async function GET(req: Request) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized(), req);
    if (user.role !== "admin") return withCors(forbidden(), req);

    const data = await getAllStaff(user.role);
    return withCors(success(data), req);
  } catch (error) {
    const message = (error as Error).message;
    if (message === "Forbidden") {
      return withCors(forbidden(), req);
    }
    return withCors(serverError(message), req);
  }
}

export async function POST(req: Request) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized(), req);
    if (user.role !== "admin") return withCors(forbidden(), req);

    const body = await req.json();
    const { name, email, phone, role } = body;

    if (!name || !email || !phone || !role) {
      return withCors(badRequest("Missing required fields: name, email, phone, role"), req);
    }

    const VALID_STAFF_ROLES = ['engineer', 'contractor', 'admin'];
    if (!VALID_STAFF_ROLES.includes(role)) {
      return withCors(badRequest('Invalid role. Must be engineer, contractor, or admin'), req);
    }

    const data = await createStaff(user.role, { name, email, phone, role });
    return withCors(created(data), req);
  } catch (error) {
    const message = (error as Error).message;
    if (message === "Forbidden") {
      return withCors(forbidden(), req);
    }
    if (message === "A user with this email already exists.") {
      return withCors(badRequest(message), req);
    }
    return withCors(serverError(message), req);
  }
}
