"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, CreditCard, IndianRupee, ShieldCheck, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/states";
import { getPaymentMilestonesAction, getPaymentSummaryAction, getPaymentTransactionsAction } from "@/lib/actions/payments";
import { getProjectByIdAction } from "@/lib/actions/projects";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { RecordPaymentModal } from "@/components/admin/RecordPaymentModal";
import { Badge } from "@/components/ui/badge";

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function AdminProjectPaymentsPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  async function load() {
    setLoading(true);
    const [pRes, mRes, tRes, sRes] = await Promise.all([
      getProjectByIdAction(projectId),
      getPaymentMilestonesAction(projectId),
      getPaymentTransactionsAction(projectId),
      getPaymentSummaryAction(projectId),
    ]);
    if (pRes.success) setProject(pRes.data);
    if (mRes.success) setMilestones(mRes.data);
    if (tRes.success) setTransactions(tRes.data);
    if (sRes.success) setSummary(sRes.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [projectId]);

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button render={<Link href="/admin-payments" />} variant="outline" size="icon" className="h-8 w-8 shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Payments: {project.name}</h1>
            <div className="text-sm text-slate-500 dark:text-slate-400">Customer: {project.customer?.name}</div>
          </div>
        </div>
        
        {/* Record Payment Button */}
        <RecordPaymentModal 
          projectId={projectId}
          maxAmount={summary?.dueAmount || 0}
          onSuccess={load}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Total Value</div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatINR(summary?.totalAmount || 0)}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Amount Paid</div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-500">{formatINR(summary?.paidAmount || 0)}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-500">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Amount Due</div>
              <div className="text-lg font-bold text-amber-600 dark:text-amber-500">{formatINR(summary?.dueAmount || 0)}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg">Payment Milestones</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-900">
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Milestone</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">Target Amount</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">Paid Amount</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Dates</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {milestones.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-500 dark:text-slate-400 py-6">No milestones scheduled.</TableCell>
                  </TableRow>
                ) : (
                  milestones.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div className="font-medium text-slate-900 dark:text-slate-100">{m.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 max-w-md truncate">{m.description}</div>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900 dark:text-slate-100 text-right">{formatINR(m.amount)}</TableCell>
                      <TableCell className="font-semibold text-emerald-600 dark:text-emerald-500 text-right">{formatINR(m.paidAmount || 0)}</TableCell>
                      <TableCell className="text-center"><StatusBadge status={m.status} /></TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                        {m.paidDate ? (
                          <div className="text-emerald-600 font-medium">Paid: {new Date(m.paidDate).toLocaleDateString()}</div>
                        ) : (
                          `Due: ${new Date(m.dueDate).toLocaleDateString()}`
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" /> Payment History (Transactions)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-900">
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Date</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Amount</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Method</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Transaction ID</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Recorded By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-500 dark:text-slate-400 py-6">No payments recorded yet.</TableCell>
                  </TableRow>
                ) : (
                  transactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="text-sm">{new Date(t.date).toLocaleString()}</TableCell>
                      <TableCell className="font-bold text-emerald-600 dark:text-emerald-500">{formatINR(t.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase text-xs">{t.method.replace('_', ' ')}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-500 dark:text-slate-400">
                        {t.transactionId || "-"}
                      </TableCell>
                      <TableCell>
                        {t.recordedBy ? (
                          <div className="flex items-center gap-1 text-xs">
                            <ShieldCheck className="h-3 w-3 text-slate-400" />
                            <span>{t.recordedBy.name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
