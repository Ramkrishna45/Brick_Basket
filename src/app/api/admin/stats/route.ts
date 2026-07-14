import { getApiUser } from "@/lib/api-auth";
import { getAdminStats } from "@/lib/services/admin.service";
import { success, unauthorized, forbidden, serverError, withCors, handleCors } from "@/lib/api-utils";

export async function OPTIONS(req: Request) {
  return handleCors(req);
}

export async function GET(req: Request) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized(), req);
    if (user.role !== "admin") return withCors(forbidden(), req);

    const data = await getAdminStats(user.role);
    return withCors(success(data), req);
  } catch (error) {
    const message = (error as Error).message;
    if (message === "Forbidden") {
      return withCors(forbidden(), req);
    }
    return withCors(serverError(message), req);
  }
}
