"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Users, Building2, FileText, CreditCard, AlertCircle, Upload, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/lib/auth-client";
import { getAdminStatsAction } from "@/lib/actions/admin";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend,
} from "recharts";

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", notation: "compact", maximumFractionDigits: 1 }).format(n);
}

const PIE_COLORS = ["#f59e0b", "#10b981", "#f97316", "#6366f1"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }),
};

export default function AdminDashboardPage() {
  const { user } = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await getAdminStatsAction();
      if (res.success) setStats(res.data);
      setLoading(false);
    }
    load();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Skeleton className="h-64 rounded-xl" /><Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  const overviewStats = [
    { label: "Total Users", value: stats.users.total, icon: Users, iconBg: "bg-blue-50", iconColor: "text-blue-600", badge: null },
    { label: "Active Projects", value: stats.projects.active, icon: Building2, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", badge: null },
    { label: "New Enquiries", value: stats.leads.new, icon: FileText, iconBg: "bg-violet-50", iconColor: "text-violet-600", badge: { label: "New", cls: "bg-blue-50 text-blue-600 border-blue-200" } },
    { label: "Pending Payments", value: formatINR(stats.financials.pendingPayments), icon: CreditCard, iconBg: "bg-amber-50 dark:bg-amber-950/40", iconColor: "text-amber-600 dark:text-amber-500", badge: { label: "Action Needed", cls: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-500 border-amber-200" } },
    { label: "Total Revenue", value: formatINR(stats.financials.totalRevenue), icon: TrendingUp, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", badge: null },
    { label: "Today's Updates", value: stats.todayUpdates, icon: Upload, iconBg: "bg-teal-50", iconColor: "text-teal-600", badge: { label: "Today", cls: "bg-teal-50 text-teal-600 border-teal-200" } },
  ];

  const projectStatusBreakdown = [
    { status: "Active", count: stats.projects.active },
    { status: "Completed", count: stats.projects.completed },
    { status: "On Hold", count: stats.projects.onHold },
  ];

  // Placeholder data for charts that don't have real data yet
  const monthlyEnquiries = [
    { month: "Jan", count: 12 }, { month: "Feb", count: 19 }, { month: "Mar", count: 15 },
    { month: "Apr", count: 22 }, { month: "May", count: 28 }, { month: "Jun", count: 35 },
  ];
  
  const revenueByMonth = [
    { month: "Jan", amount: 450000 }, { month: "Feb", amount: 620000 }, { month: "Mar", amount: 550000 },
    { month: "Apr", amount: 800000 }, { month: "May", amount: 1100000 }, { month: "Jun", amount: 1450000 },
  ];

  return (
    <div className="space-y-6">
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {greeting}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here&apos;s what&apos;s happening on the platform today</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {overviewStats.map((stat, i) => (
          <motion.div key={stat.label} custom={i + 1} variants={fadeUp} initial="hidden" animate="visible">
            <Card className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconBg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                  </div>
                  {stat.badge && <Badge className={`text-xs py-0 ${stat.badge.cls}`}>{stat.badge.label}</Badge>}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Enquiries chart */}
        <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Monthly Enquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyEnquiries} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                  <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Enquiries" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Revenue chart */}
        <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Monthly Revenue</CardTitle>
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <TrendingUp className="h-3 w-3" /> +8% vs last month
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueByMonth} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v: number) => formatINR(v)} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} formatter={(v) => [typeof v === "number" ? formatINR(v) : v, "Revenue"]} />
                  <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} fill="url(#revenueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Project status pie */}
        <motion.div custom={9} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Project Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={projectStatusBreakdown} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={40} outerRadius={70}>
                      {projectStatusBreakdown.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 flex-1">
                  {projectStatusBreakdown.map((item, i) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-xs text-slate-600 dark:text-slate-400">{item.status}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent activity */}
        <motion.div custom={10} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { action: "Progress update uploaded", project: "Patel Residence", time: "2m ago", color: "bg-amber-500" },
                { action: "New enquiry received", project: "Suresh Menon, Bengaluru", time: "15m ago", color: "bg-blue-500" },
                { action: "Payment received", project: "Sharma Villa — ₹5,04,000", time: "1h ago", color: "bg-emerald-500" },
                { action: "Project stage updated", project: "Irfan Residence → Electrical", time: "2h ago", color: "bg-violet-500" },
                { action: "Document uploaded", project: "Begum Palace — Agreement", time: "3h ago", color: "bg-orange-500" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`h-2 w-2 rounded-full ${item.color} mt-1.5 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-900 dark:text-slate-100">{item.action}</div>
                    <div className="text-xs text-slate-400 truncate">{item.project}</div>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">{item.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
