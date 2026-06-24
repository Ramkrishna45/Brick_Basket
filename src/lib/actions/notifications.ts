"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// ── Get Notifications ───────────────────────────────────────────────

export async function getNotificationsAction() {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const userId = session.user?.id;
    if (!userId) return { error: "Unauthorized" };

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const data = notifications.map((n) => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
    }));

    return { success: true, data };
  } catch {
    return { error: "Failed to fetch notifications." };
  }
}

// ── Mark Notification as Read ───────────────────────────────────────

export async function markNotificationReadAction(id: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const userId = session.user?.id;
    if (!userId) return { error: "Unauthorized" };

    // Ensure the notification belongs to the current user
    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!notification) return { error: "Notification not found" };

    await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return { success: true };
  } catch {
    return { error: "Failed to mark notification as read." };
  }
}

// ── Mark All Notifications as Read ──────────────────────────────────

export async function markAllReadAction() {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const userId = session.user?.id;
    if (!userId) return { error: "Unauthorized" };

    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    return { success: true };
  } catch {
    return { error: "Failed to mark all notifications as read." };
  }
}
