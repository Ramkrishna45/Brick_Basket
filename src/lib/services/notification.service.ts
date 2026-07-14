import { prisma } from "@/lib/db";

// ── Get Notifications ───────────────────────────────────────────────

export async function getNotifications(userId: string) {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return notifications.map((n) => ({
    ...n,
    createdAt: n.createdAt.toISOString(),
  }));
}

// ── Mark Notification as Read ───────────────────────────────────────

export async function markNotificationRead(id: string, userId: string) {
  // Ensure the notification belongs to the current user
  const notification = await prisma.notification.findFirst({
    where: { id, userId },
  });
  if (!notification) throw new Error("Notification not found");

  await prisma.notification.update({
    where: { id },
    data: { read: true },
  });

  return { success: true };
}

// ── Mark All Notifications as Read ──────────────────────────────────

export async function markAllRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });

  return { success: true };
}

// ── Admin: Send Notification ────────────────────────────────────────

export async function sendNotification(
  userRole: string,
  data: {
    title: string;
    message: string;
    type?: string;
    userId?: string; // If null/empty/all, send to all customers
  }
) {
  if (userRole !== "admin") throw new Error("Forbidden");

  if (data.userId && data.userId !== "all") {
    // Send to specific user
    await prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type || "info",
        userId: data.userId,
      },
    });
  } else {
    // Send to all customers
    const customers = await prisma.user.findMany({
      where: { role: "customer" },
      select: { id: true },
    });

    const notifications = customers.map((c) => ({
      title: data.title,
      message: data.message,
      type: data.type || "info",
      userId: c.id,
    }));

    if (notifications.length > 0) {
      await prisma.notification.createMany({
        data: notifications,
      });
    }
  }

  return { success: true };
}
