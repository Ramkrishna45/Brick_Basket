import { prisma } from "@/lib/db";

export async function getDashboardStats() {
  const [
    totalUsers,
    totalProjects,
    totalLeads,
    totalRevenue,
    activeProjects,
    pendingLeads,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.lead.count(),
    prisma.paymentTransaction.aggregate({
      _sum: { amount: true },
    }).then(res => res._sum.amount || 0),
    prisma.project.count({
      where: { status: "in_progress" },
    }),
    prisma.lead.count({
      where: { status: "new" },
    }),
  ]);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0,0,0,0);

  // Grouping by raw SQL for exact monthly buckets
  const leadsRaw = await prisma.$queryRaw<{ month: Date, count: number }[]>`
    SELECT DATE_TRUNC('month', "createdAt") as month, COUNT(*)::int as count
    FROM "Lead"
    WHERE "createdAt" >= ${sixMonthsAgo}
    GROUP BY month
    ORDER BY month
  `;

  const revenueRaw = await prisma.$queryRaw<{ month: Date, revenue: number }[]>`
    SELECT DATE_TRUNC('month', "createdAt") as month, SUM("amount")::float as revenue
    FROM "PaymentTransaction"
    WHERE "createdAt" >= ${sixMonthsAgo}
    GROUP BY month
    ORDER BY month
  `;

  // Backfill gaps (0 count/revenue)
  const monthlyLeads = [];
  const monthlyRevenue = [];
  
  for (let i = 0; i <= 6; i++) {
    const d = new Date(sixMonthsAgo);
    d.setMonth(d.getMonth() + i);
    const monthName = d.toLocaleString('default', { month: 'short' });
    
    // Find matching lead data
    const leadMatch = leadsRaw.find(r => r.month.getTime() === d.getTime());
    monthlyLeads.push({
      month: monthName,
      count: leadMatch ? Number(leadMatch.count) : 0
    });

    // Find matching revenue data
    const revMatch = revenueRaw.find(r => r.month.getTime() === d.getTime());
    monthlyRevenue.push({
      month: monthName,
      revenue: revMatch ? Number(revMatch.revenue) : 0
    });
  }

  const recentLeads = await prisma.lead.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  const recentTransactions = await prisma.paymentTransaction.findMany({
    take: 5,
    orderBy: { date: "desc" },
    include: {
      project: { select: { clientName: true } }
    }
  });

  const projectsByStatus = await prisma.project.groupBy({
    by: ['status'],
    _count: true,
  });

  const formattedProjectsByStatus = projectsByStatus.map(item => ({
    name: item.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: item._count
  }));

  return {
    totalUsers,
    totalProjects,
    totalLeads,
    totalRevenue,
    activeProjects,
    pendingLeads,
    monthlyLeads,
    monthlyRevenue,
    recentLeads,
    recentTransactions,
    projectsByStatus: formattedProjectsByStatus,
  };
}

export async function getStaffList() {
  return await prisma.user.findMany({
    where: { role: { in: ['admin', 'engineer', 'contractor'] } },
    select: { id: true, name: true, role: true, email: true, phone: true }
  });
}
