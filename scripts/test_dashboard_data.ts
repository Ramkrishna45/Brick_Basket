import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  // 1. Monthly Enquiries (last 6 months)
  const recentLeads = await prisma.lead.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true }
  });

  // 2. Monthly Revenue (last 6 months)
  const recentTransactions = await prisma.paymentTransaction.findMany({
    where: { date: { gte: sixMonthsAgo } },
    select: { amount: true, date: true }
  });

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Initialize the last 6 months with 0
  const monthlyEnquiriesMap = new Map();
  const revenueByMonthMap = new Map();
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const m = monthNames[d.getMonth()];
    monthlyEnquiriesMap.set(m, 0);
    revenueByMonthMap.set(m, 0);
  }

  recentLeads.forEach(lead => {
    const m = monthNames[lead.createdAt.getMonth()];
    if (monthlyEnquiriesMap.has(m)) {
      monthlyEnquiriesMap.set(m, monthlyEnquiriesMap.get(m) + 1);
    }
  });

  recentTransactions.forEach(tx => {
    const m = monthNames[tx.date.getMonth()];
    if (revenueByMonthMap.has(m)) {
      revenueByMonthMap.set(m, revenueByMonthMap.get(m) + tx.amount);
    }
  });

  const monthlyEnquiries = Array.from(monthlyEnquiriesMap, ([month, count]) => ({ month, count }));
  const revenueByMonth = Array.from(revenueByMonthMap, ([month, amount]) => ({ month, amount }));

  // 3. Recent Activity (Top 5 across multiple models)
  const [topLeads, topTx, topUpdates, topDocs] = await Promise.all([
    prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.paymentTransaction.findMany({ orderBy: { date: 'desc' }, take: 5, include: { project: { select: { name: true } } } }),
    prisma.progressUpdate.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { project: { select: { name: true } } } }),
    prisma.document.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { project: { select: { name: true } } } })
  ]);

  let activities: any[] = [];
  
  topLeads.forEach(l => {
    activities.push({
      action: "New enquiry received",
      project: `${l.name}${l.city ? ', ' + l.city : ''}`,
      dateObj: l.createdAt,
      color: "bg-blue-500"
    });
  });

  topTx.forEach(t => {
    activities.push({
      action: "Payment received",
      project: `${t.project?.name || 'Unknown'} — ₹${t.amount.toLocaleString('en-IN')}`,
      dateObj: t.date,
      color: "bg-emerald-500"
    });
  });

  topUpdates.forEach(u => {
    activities.push({
      action: "Progress update uploaded",
      project: `${u.project?.name || 'Unknown'} → ${u.stage}`,
      dateObj: u.createdAt,
      color: "bg-amber-500"
    });
  });

  topDocs.forEach(d => {
    activities.push({
      action: "Document uploaded",
      project: `${d.project?.name || 'Unknown'} — ${d.name}`,
      dateObj: d.createdAt,
      color: "bg-orange-500"
    });
  });

  activities.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
  const recentActivity = activities.slice(0, 5).map(a => {
    // Basic timeago
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

  console.log("monthlyEnquiries", monthlyEnquiries);
  console.log("revenueByMonth", revenueByMonth);
  console.log("recentActivity", recentActivity);
}

main().finally(() => prisma.$disconnect());
