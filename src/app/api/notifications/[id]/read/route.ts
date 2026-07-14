import { getApiUser } from "@/lib/api-auth";
import {
  success,
  unauthorized,
  notFound,
  serverError,
  withCors,
  handleCors,
} from "@/lib/api-utils";
import { markNotificationRead } from "@/lib/services/notification.service";

export async function OPTIONS() {
  return handleCors();
}

// PATCH /api/notifications/[id]/read — Mark a single notification as read
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized());

    const { id } = await params;
    const data = await markNotificationRead(id, user.id);
    return withCors(success(data));
  } catch (error) {
    const message = (error as Error).message;
    if (message === "Notification not found") return withCors(notFound(message));
    return withCors(serverError(message));
  }
}
