import { prisma } from "@/lib/db";

export async function getDashboardStats() {
  try {
    // 1. Basic counts
    const [
      totalUsers,
      activeProjects,
      completedProjects,
      onHoldProjects,
      newLeads,
      projects,
      todayUpdates,
    ] = await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.project.count({ where: { status: "in_progress" } }).catch(() => 0),
      prisma.project.count({ where: { status: "completed" } }).catch(() => 0),
      prisma.project.count({ where: { status: "on_hold" } }).catch(() => 0),
      prisma.lead.count({ where: { status: "new" } }).catch(() => 0),
      prisma.project.findMany({
        select: { totalValue: true, amountPaid: true },
      }).catch(() => []),
      prisma.progressUpdate.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }).catch(() => 0),
    ]);

    // Financial calculations
    const totalRevenue = projects.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
    const totalValue = projects.reduce((sum, p) => sum + (p.totalValue || 0), 0);
    const pendingPayments = Math.max(0, totalValue - totalRevenue);

    // 2. Monthly buckets for past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const leadsPast6Months = await prisma.lead.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    }).catch(() => []);

    const txPast6Months = await prisma.paymentTransaction.findMany({
      where: { date: { gte: sixMonthsAgo } },
      select: { amount: true, date: true },
    }).catch(() => []);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyEnquiries = [];
    const revenueByMonth = [];

    for (let i = 0; i < 6; i++) {
      const d = new Date(sixMonthsAgo);
      d.setMonth(d.getMonth() + i);
      const mIdx = d.getMonth();
      const yr = d.getFullYear();
      const label = `${monthNames[mIdx]}`;

      const lCount = leadsPast6Months.filter(l => {
        const ld = new Date(l.createdAt);
        return ld.getMonth() === mIdx && ld.getFullYear() === yr;
      }).length;

      const rSum = txPast6Months.filter(t => {
        const td = new Date(t.date);
        return td.getMonth() === mIdx && td.getFullYear() === yr;
      }).reduce((sum, t) => sum + (t.amount || 0), 0);

      monthlyEnquiries.push({ month: label, count: lCount });
      revenueByMonth.push({ month: label, amount: rSum });
    }

    // 3. Recent activity from progress updates and leads
    const recentUpdates = await prisma.progressUpdate.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { project: { select: { name: true } } },
    }).catch(() => []);

    const recentActivity = recentUpdates.map(u => ({
      action: u.title || `Stage update: ${u.stage}`,
      project: u.project?.name || "Project",
      time: u.date || "Recent",
      color: "bg-amber-500",
    }));

    return {
      users: {
        total: totalUsers,
      },
      projects: {
        active: activeProjects,
        completed: completedProjects,
        onHold: onHoldProjects,
        total: activeProjects + completedProjects + onHoldProjects,
      },
      leads: {
        new: newLeads,
      },
      financials: {
        totalRevenue,
        pendingPayments,
      },
      todayUpdates,
      monthlyEnquiries,
      revenueByMonth,
      recentActivity,
    };
  } catch (err) {
    console.error("Error in getDashboardStats:", err);
    return {
      users: { total: 0 },
      projects: { active: 0, completed: 0, onHold: 0, total: 0 },
      leads: { new: 0 },
      financials: { totalRevenue: 0, pendingPayments: 0 },
      todayUpdates: 0,
      monthlyEnquiries: [],
      revenueByMonth: [],
      recentActivity: [],
    };
  }
}

export async function getStaffList() {
  return await prisma.user.findMany({
    where: { role: { in: ['admin', 'engineer', 'contractor'] } },
    select: { id: true, name: true, role: true, email: true, phone: true }
  });
}
