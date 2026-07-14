import { getApiUser } from "@/lib/api-auth";
import {
  success,
  unauthorized,
  serverError,
  withCors,
  handleCors,
} from "@/lib/api-utils";
import { markAllRead } from "@/lib/services/notification.service";

export async function OPTIONS() {
  return handleCors();
}

// PATCH /api/notifications/read-all — Mark all notifications as read
export async function PATCH(req: Request) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized());

    const data = await markAllRead(user.id);
    return withCors(success(data));
  } catch (error) {
    return withCors(serverError((error as Error).message));
  }
}
