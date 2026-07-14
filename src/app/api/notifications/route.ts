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
import {
  getNotifications,
  sendNotification,
} from "@/lib/services/notification.service";

export async function OPTIONS() {
  return handleCors();
}

// GET /api/notifications — Get current user's notifications
export async function GET(req: Request) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized());

    const data = await getNotifications(user.id);
    return withCors(success(data));
  } catch (error) {
    return withCors(serverError((error as Error).message));
  }
}

// POST /api/notifications — Admin: send notification
export async function POST(req: Request) {
  try {
    const user = await getApiUser(req);
    if (!user) return withCors(unauthorized());
    if (user.role !== "admin") return withCors(forbidden());

    const body = await req.json();
    const { title, message, type, userId } = body;

    if (!title || !message) {
      return withCors(badRequest("title and message are required"));
    }

    const data = await sendNotification(user.role, {
      title,
      message,
      type,
      userId,
    });
    return withCors(created(data));
  } catch (error) {
    return withCors(serverError((error as Error).message));
  }
}
