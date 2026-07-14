import { getApiUser } from "@/lib/api-auth";
import { updateStaff, deleteStaff } from "@/lib/services/staff.service";
import { success, unauthorized, forbidden, badRequest, serverError, withCors, handleCors } from "@/lib/api-utils";
import { NextRequest } from "next/server";

export async function OPTIONS(req: Request) {
  return handleCors(req);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized(), req);
    if (user.role !== "admin") return withCors(forbidden(), req);

    const { id } = await params;
    const body = await req.json();
    const { name, phone, role } = body;

    if (!name || !phone || !role) {
      return withCors(badRequest("Missing required fields: name, phone, role"), req);
    }

    const VALID_STAFF_ROLES = ['engineer', 'contractor', 'admin'];
    if (!VALID_STAFF_ROLES.includes(role)) {
      return withCors(badRequest('Invalid role. Must be engineer, contractor, or admin'), req);
    }

    const data = await updateStaff(user.role, id, { name, phone, role });
    return withCors(success(data), req);
  } catch (error) {
    const message = (error as Error).message;
    if (message === "Forbidden") {
      return withCors(forbidden(), req);
    }
    return withCors(serverError(message), req);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized(), req);
    if (user.role !== "admin") return withCors(forbidden(), req);

    const { id } = await params;

    const data = await deleteStaff(user.role, id);
    return withCors(success(data), req);
  } catch (error) {
    const message = (error as Error).message;
    if (message === "Forbidden") {
      return withCors(forbidden(), req);
    }
    return withCors(serverError(message), req);
  }
}
