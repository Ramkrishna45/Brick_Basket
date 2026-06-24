"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// ── Admin: Get Dashboard Stats ──────────────────────────────────────

export async function getAdminStatsAction() {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };
    if ((session.user as { role?: string }).role !== "admin")
      return { error: "Forbidden" };

    // Run all aggregate queries in parallel
    const [
      totalUsers,
      totalProjects,
      activeProjects,
      completedProjects,
      onHoldProjects,
      totalLeads,
      newLeads,
      contactedLeads,
      convertedLeads,
      payments,
      todayUpdates,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.project.count({ where: { status: "in_progress" } }),
      prisma.project.count({ where: { status: "completed" } }),
      prisma.project.count({ where: { status: "on_hold" } }),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "new" } }),
      prisma.lead.count({ where: { status: "contacted" } }),
      prisma.lead.count({ where: { status: "converted" } }),
      prisma.paymentMilestone.findMany({
        select: { amount: true, status: true },
      }),
      prisma.progressUpdate.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    const totalRevenue = payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = payments
      .filter((p) => p.status === "pending" || p.status === "overdue")
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      success: true,
      data: {
        users: {
          total: totalUsers,
        },
        projects: {
          total: totalProjects,
          active: activeProjects,
          completed: completedProjects,
          onHold: onHoldProjects,
        },
        leads: {
          total: totalLeads,
          new: newLeads,
          contacted: contactedLeads,
          converted: convertedLeads,
        },
        financials: {
          totalRevenue,
          pendingPayments,
        },
        todayUpdates,
      },
    };
  } catch {
    return { error: "Failed to fetch admin stats." };
  }
}

// ── Admin: Get Staff (engineers + contractors) ──────────────────────

export async function getStaffAction() {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };
    if ((session.user as { role?: string }).role !== "admin")
      return { error: "Forbidden" };

    const staff = await prisma.user.findMany({
      where: {
        OR: [{ role: "engineer" }, { role: "contractor" }],
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
      orderBy: { name: "asc" },
    });

    const data = staff.map((s) => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
    }));

    return { success: true, data };
  } catch {
    return { error: "Failed to fetch staff." };
  }
}
