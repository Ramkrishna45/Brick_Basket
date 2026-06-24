"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CreditCard, Download, IndianRupee, Calendar, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/states";
import { toast } from "sonner";
import { getMyProjectAction } from "@/lib/actions/projects";
import { getPaymentMilestonesAction, getPaymentSummaryAction } from "@/lib/actions/payments";

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function PaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const pRes = await getMyProjectAction();
        if (pRes.success && pRes.data) {
          const [mRes, sRes] = await Promise.all([
            getPaymentMilestonesAction(pRes.data.id),
            getPaymentSummaryAction(pRes.data.id)
          ]);
          if (mRes.success && mRes.data) setMilestones(mRes.data);
          if (sRes.success && sRes.data) setSummary(sRes.data);
        }
      } catch (err) {
        console.error("Failed to load payments", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalAmount = summary?.totalAmount || 0;
  const paidAmount = summary?.paidAmount || 0;
  const dueAmount = summary?.dueAmount || 0;
  const nextDueAmount = summary?.nextDue?.amount || 0;
  const nextDueDate = summary?.nextDue?.dueDate ? new Date(summary.nextDue.dueDate).toLocaleDateString() : "No pending dues";
  const paidPct = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-40" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Payments</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Value", value: formatINR(totalAmount), icon: IndianRupee, color: "text-slate-600", bg: "bg-slate-50" },
          { label: "Amount Paid", value: formatINR(paidAmount), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Amount Due", value: formatINR(dueAmount), icon: CreditCard, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Next Due", value: nextDueAmount > 0 ? formatINR(nextDueAmount) : "All paid", icon: Calendar, color: "text-red-500", bg: "bg-red-50", sub: nextDueAmount > 0 ? nextDueDate : "No upcoming payments" },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.bg} mb-3`}>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div className="text-xs text-slate-500 mb-0.5">{item.label}</div>
                <div className={`font-bold text-sm sm:text-base ${item.color}`}>{item.value}</div>
                {item.sub && <div className="text-xs text-slate-400 mt-0.5">{item.sub}</div>}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Payment progress */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-slate-700">Payment Progress</span>
              <span className="font-bold text-emerald-600">{paidPct}% paid</span>
            </div>
            <Progress value={paidPct} className="h-3" />
            <div className="flex justify-between text-xs text-slate-400 mt-1.5">
              <span>Paid: {formatINR(paidAmount)}</span>
              <span>Remaining: {formatINR(dueAmount)}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Milestones Table (desktop) / Cards (mobile) */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Milestone Payments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Milestone</TableHead>
                    <TableHead className="font-semibold text-slate-700">Amount</TableHead>
                    <TableHead className="font-semibold text-slate-700">Due Date</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {milestones.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-slate-500 py-6">No milestones found.</TableCell>
                    </TableRow>
                  )}
                  {milestones.map((m) => (
                    <TableRow key={m.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="font-medium text-slate-900 text-sm">{m.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{m.description}</div>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900">{formatINR(m.amount)}</TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {m.paidDate ? `Paid: ${new Date(m.paidDate).toLocaleDateString()}` : new Date(m.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell><StatusBadge status={m.status} /></TableCell>
                      <TableCell className="text-right">
                        {m.status === "paid" && m.receiptUrl && (
                          <Button render={<a href={m.receiptUrl} download />} variant="ghost" size="sm" className="h-7 text-xs gap-1 hover:text-amber-600">
                            <><Download className="h-3 w-3" /> Receipt</>
                          </Button>
                        )}
                        {m.status === "pending" && (
                          <Button size="sm" onClick={() => toast.info("Payment gateway integration coming soon!")}
                            className="h-7 text-xs bg-amber-600 hover:bg-amber-700">
                            Pay Now
                          </Button>
                        )}
                        {m.status === "overdue" && (
                          <Button size="sm" onClick={() => toast.error("This payment is overdue. Please contact us.")}
                            className="h-7 text-xs bg-red-600 hover:bg-red-700">
                            Pay Overdue
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {milestones.length === 0 && (
                <div className="text-center text-slate-500 py-6">No milestones found.</div>
              )}
              {milestones.map((m) => (
                <div key={m.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{m.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{m.description}</div>
                    </div>
                    <StatusBadge status={m.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900">{formatINR(m.amount)}</div>
                    <div className="text-xs text-slate-500">{m.paidDate ? `Paid: ${new Date(m.paidDate).toLocaleDateString()}` : `Due: ${new Date(m.dueDate).toLocaleDateString()}`}</div>
                  </div>
                  {m.status === "pending" && (
                    <Button size="sm" onClick={() => toast.info("Payment gateway coming soon!")}
                      className="w-full h-8 text-xs bg-amber-600 hover:bg-amber-700">
                      Pay Now — {formatINR(m.amount)}
                    </Button>
                  )}
                  {m.status === "paid" && m.receiptUrl && (
                    <Button render={<a href={m.receiptUrl} download />} variant="ghost" size="sm" className="w-full h-8 text-xs gap-1 hover:text-amber-600">
                      <><Download className="h-3 w-3" /> Download Receipt</>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
