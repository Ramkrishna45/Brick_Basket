"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { IndianRupee, TrendingDown, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/states";
import { toast } from "sonner";
import { getAllProjectsAction } from "@/lib/actions/projects";

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function AdminPaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await getAllProjectsAction();
      if (res.success && res.data) {
        setProjects(res.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  const totalRevenue = projects.reduce((s, p) => s + (p.totalValue || 0), 0);
  const totalCollected = projects.reduce((s, p) => s + (p.amountPaid || 0), 0);
  const totalPending = totalRevenue - totalCollected;

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-56" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">Payment Tracking</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatINR(totalRevenue), icon: IndianRupee, color: "text-slate-700", bg: "bg-slate-50" },
          { label: "Collected", value: formatINR(totalCollected), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pending", value: formatINR(totalPending), icon: TrendingDown, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Overdue", value: formatINR(0), icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.bg} mb-3`}>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div className="text-xs text-slate-500 mb-0.5">{item.label}</div>
                <div className={`font-bold text-sm sm:text-base ${item.color}`}>{item.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  {["Customer", "Project", "Total Value", "Paid", "Remaining", "Progress", "Status", "Actions"].map((h) => (
                    <TableHead key={h} className="font-semibold text-slate-700 text-xs">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((p, i) => {
                  const paidPct = p.totalValue ? Math.round(((p.amountPaid || 0) / p.totalValue) * 100) : 0;
                  const remaining = (p.totalValue || 0) - (p.amountPaid || 0);
                  const payStatus = paidPct >= 100 ? "paid" : paidPct > 0 ? "pending" : "pending";
                  return (
                    <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                      className="border-b border-slate-100 hover:bg-amber-50/50 transition-colors">
                      <TableCell className="font-medium text-slate-900 text-sm">{p.customer?.name || "Unassigned"}</TableCell>
                      <TableCell className="text-sm text-slate-600">{p.name}</TableCell>
                      <TableCell className="font-semibold text-slate-900 text-sm">{formatINR(p.totalValue)}</TableCell>
                      <TableCell className="text-emerald-600 font-medium text-sm">{formatINR(p.amountPaid)}</TableCell>
                      <TableCell className="text-amber-600 font-medium text-sm">{formatINR(remaining)}</TableCell>
                      <TableCell>
                        <div className="w-24">
                          <Progress value={paidPct} className="h-2" />
                          <span className="text-xs text-slate-400 mt-0.5 block">{paidPct}%</span>
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={payStatus} /></TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-7 text-xs hover:text-amber-600" onClick={() => toast.success("Payment details view coming soon!")}>Details</Button>
                          <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => toast.success("Payment marked as received!")}>Mark Paid</Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile */}
          <div className="md:hidden divide-y divide-slate-100">
            {projects.map((p) => {
              const paidPct = p.totalValue ? Math.round(((p.amountPaid || 0) / p.totalValue) * 100) : 0;
              return (
                <div key={p.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-slate-900">{p.customer?.name || "Unassigned"}</div>
                      <div className="text-xs text-slate-400">{p.name}</div>
                    </div>
                    <StatusBadge status={paidPct > 0 ? "pending" : "pending"} />
                  </div>
                  <div className="flex justify-between text-sm">
                    <div><span className="text-slate-400 text-xs">Total: </span><span className="font-semibold">{formatINR(p.totalValue)}</span></div>
                    <div><span className="text-slate-400 text-xs">Paid: </span><span className="font-semibold text-emerald-600">{formatINR(p.amountPaid)}</span></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Payment Progress</span><span>{paidPct}%</span></div>
                    <Progress value={paidPct} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
