import { getApiUser } from "@/lib/api-auth";
import { changePassword } from "@/lib/services/auth.service";
import { success, unauthorized, badRequest, serverError, withCors, handleCors } from "@/lib/api-utils";

export async function OPTIONS() {
  return handleCors();
}

export async function PUT(req: Request) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized());

    const body = await req.json();
    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      return withCors(badRequest("Missing required fields: oldPassword, newPassword"));
    }

    const result = await changePassword(user.id, oldPassword, newPassword);
    return withCors(success(result));
  } catch (error) {
    const message = (error as Error).message;
    if (
      message === "User not found" ||
      message === "Incorrect current password." ||
      message === "This account uses Google login. Password cannot be changed here."
    ) {
      return withCors(badRequest(message));
    }
    return withCors(serverError(message));
  }
}
