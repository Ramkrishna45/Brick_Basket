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
      recentLeads,
      recentTransactions,
      recentUpdates,
      recentDocs,
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
      prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
      prisma.paymentTransaction.findMany({ orderBy: { date: "desc" }, take: 100, include: { project: { select: { name: true } } } }),
      prisma.progressUpdate.findMany({ orderBy: { createdAt: "desc" }, take: 10, include: { project: { select: { name: true } } } }),
      prisma.document.findMany({ orderBy: { createdAt: "desc" }, take: 10, include: { project: { select: { name: true } } } }),
    ]);

    const totalRevenue = payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = payments
      .filter((p) => p.status === "pending" || p.status === "overdue")
      .reduce((sum, p) => sum + p.amount, 0);

    // ── Generate Last 6 Months Labels ──
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyEnquiriesMap = new Map<string, number>();
    const revenueByMonthMap = new Map<string, number>();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const m = monthNames[d.getMonth()];
      monthlyEnquiriesMap.set(m, 0);
      revenueByMonthMap.set(m, 0);
    }

    // ── Calculate Monthly Enquiries ──
    recentLeads.forEach(lead => {
      const m = monthNames[lead.createdAt.getMonth()];
      if (monthlyEnquiriesMap.has(m)) {
        monthlyEnquiriesMap.set(m, monthlyEnquiriesMap.get(m)! + 1);
      }
    });

    // ── Calculate Monthly Revenue ──
    recentTransactions.forEach(tx => {
      const m = monthNames[tx.date.getMonth()];
      if (revenueByMonthMap.has(m)) {
        revenueByMonthMap.set(m, revenueByMonthMap.get(m)! + tx.amount);
      }
    });

    const monthlyEnquiries = Array.from(monthlyEnquiriesMap, ([month, count]) => ({ month, count }));
    const revenueByMonth = Array.from(revenueByMonthMap, ([month, amount]) => ({ month, amount }));

    // ── Compile Recent Activity ──
    let activities: any[] = [];
    
    recentLeads.slice(0, 5).forEach(l => {
      activities.push({
        action: "New enquiry received",
        project: `${l.name}${l.city ? ', ' + l.city : ''}`,
        dateObj: l.createdAt,
        color: "bg-blue-500"
      });
    });

    recentTransactions.slice(0, 5).forEach(t => {
      activities.push({
        action: "Payment received",
        project: `${t.project?.name || 'Unknown'} — ₹${t.amount.toLocaleString('en-IN')}`,
        dateObj: t.date,
        color: "bg-emerald-500"
      });
    });

    recentUpdates.slice(0, 5).forEach(u => {
      activities.push({
        action: "Progress update uploaded",
        project: `${u.project?.name || 'Unknown'} → ${u.stage}`,
        dateObj: u.createdAt,
        color: "bg-amber-500"
      });
    });

    recentDocs.slice(0, 5).forEach(d => {
      activities.push({
        action: "Document uploaded",
        project: `${d.project?.name || 'Unknown'} — ${d.name}`,
        dateObj: d.createdAt,
        color: "bg-orange-500"
      });
    });

    activities.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
    const recentActivity = activities.slice(0, 10).map(a => {
      const diffMs = Date.now() - a.dateObj.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      let timeStr = "";
      if (diffMins < 60) timeStr = `${diffMins}m ago`;
      else if (diffHours < 24) timeStr = `${diffHours}h ago`;
      else timeStr = `${diffDays}d ago`;

      return {
        action: a.action,
        project: a.project,
        time: timeStr,
        color: a.color
      };
    });

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
        monthlyEnquiries,
        revenueByMonth,
        recentActivity,
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
