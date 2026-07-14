"use server";

import { auth } from "@/lib/auth";
import * as notificationService from "@/lib/services/notification.service";

export async function getNotificationsAction() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) return { error: "Unauthorized" };

    const data = await notificationService.getNotifications(session.user.id);
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch notifications." };
  }
}

export async function markNotificationReadAction(id: string) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) return { error: "Unauthorized" };

    await notificationService.markNotificationRead(id, session.user.id);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to mark notification as read." };
  }
}

export async function markAllReadAction() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) return { error: "Unauthorized" };

    await notificationService.markAllRead(session.user.id);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to mark all notifications as read." };
  }
}

export async function sendNotificationAction(data: {
  title: string;
  message: string;
  type?: string;
  userId?: string;
}) {
  try {
    const session = await auth();
    if (!session) return { error: "Forbidden" };

    await notificationService.sendNotification((session.user as any).role || "", data);
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Failed to send notification." };
  }
}
