"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Phone, Mail, UserCheck, UserX, MoreVertical, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge, EmptyState } from "@/components/shared/states";
import { toast } from "sonner";
import { getLeadsAction, updateLeadStatusAction } from "@/lib/actions/leads";
import { CreateProjectForm } from "@/components/admin/CreateProjectForm";
import { format } from "date-fns";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "converted", label: "Converted" },
  { value: "rejected", label: "Rejected" },
];

export default function LeadsPage() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [convertLead, setConvertLead] = useState<any | null>(null);

  async function load() {
    setLoading(true);
    const res = await getLeadsAction();
    if (res.success && res.data) {
      setLeads(res.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = leads
    .filter((l) => status === "all" || l.status === status)
    .filter((l) =>
      search === "" ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      (l.city && l.city.toLowerCase().includes(search.toLowerCase())) ||
      (l.phone && l.phone.includes(search))
    );

  async function updateStatus(id: string, newStatus: string) {
    const res = await updateLeadStatusAction(id, newStatus);
    if (res.success) {
      setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status: newStatus } : l));
      toast.success(`Lead status updated to ${newStatus}`);
    } else {
      toast.error("Failed to update status");
    }
  }

  if (loading) {
    return <div className="space-y-5"><Skeleton className="h-8 w-48" /><Skeleton className="h-12 rounded-lg" /><Skeleton className="h-96 rounded-xl" /></div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Leads & Enquiries</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{leads.filter(l => l.status === "new").length} new leads requiring action</p>
        </div>
        <Badge className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200">{filtered.length} leads</Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input className="pl-9 bg-white dark:bg-slate-950" placeholder="Search by name, city, phone..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={status} onValueChange={(v) => setStatus((v as string) ?? "all")}>
          <SelectTrigger className="w-full sm:w-44 bg-white dark:bg-slate-950">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No leads found" description="No leads match your current filters." action={{ label: "Clear filters", onClick: () => { setStatus("all"); setSearch(""); } }} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-900">
                  {["Name", "Phone", "City", "Budget", "Type", "Status", "Date", "Actions"].map((h) => (
                    <TableHead key={h} className="font-semibold text-slate-700 dark:text-slate-300 text-xs">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((lead, i) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-amber-50 dark:bg-amber-950/40/50 transition-colors"
                  >
                    <TableCell>
                      <div className="font-medium text-slate-900 dark:text-slate-100 text-sm">{lead.name}</div>
                      <div className="text-xs text-slate-400">{lead.email}</div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 dark:text-slate-400">{lead.phone}</TableCell>
                    <TableCell className="text-sm text-slate-600 dark:text-slate-400">{lead.city}</TableCell>
                    <TableCell className="text-xs text-slate-600 dark:text-slate-400">{lead.budgetRange}</TableCell>
                    <TableCell className="text-xs text-slate-600 dark:text-slate-400 capitalize">{(lead.homeType || "N/A").replace(/_/g, " ")}</TableCell>
                    <TableCell><StatusBadge status={lead.status} /></TableCell>
                    <TableCell className="text-xs text-slate-400">{lead.createdAt ? format(new Date(lead.createdAt), "MMM d, yyyy") : "N/A"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:bg-slate-900">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { window.open(`tel:${lead.phone}`); toast.success(`Calling ${lead.name}...`); }}>
                            <Phone className="h-3.5 w-3.5 mr-2" />Call
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(`mailto:${lead.email}`)}>
                            <Mail className="h-3.5 w-3.5 mr-2" />Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => updateStatus(lead.id, "contacted")}>
                            Mark as Contacted
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(lead.id, "qualified")}>
                            Mark as Qualified
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setConvertLead(lead)} className="text-emerald-600">
                            <UserCheck className="h-3.5 w-3.5 mr-2" />Convert to Customer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(lead.id, "rejected")} className="text-red-600">
                            <UserX className="h-3.5 w-3.5 mr-2" />Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((lead, i) => (
              <motion.div key={lead.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{lead.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{lead.city} · {lead.budgetRange}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={lead.status} />
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:bg-slate-900">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { window.open(`tel:${lead.phone}`); toast.success(`Calling ${lead.name}...`); }}>
                            <Phone className="h-3.5 w-3.5 mr-2" />Call
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(`mailto:${lead.email}`)}>
                            <Mail className="h-3.5 w-3.5 mr-2" />Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => updateStatus(lead.id, "contacted")}>
                            Mark as Contacted
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(lead.id, "qualified")}>
                            Mark as Qualified
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setConvertLead(lead)} className="text-emerald-600">
                            <UserCheck className="h-3.5 w-3.5 mr-2" />Convert to Customer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(lead.id, "rejected")} className="text-red-600">
                            <UserX className="h-3.5 w-3.5 mr-2" />Reject
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span>{lead.phone}</span> · <span className="capitalize">{(lead.homeType || "N/A").replace(/_/g, " ")}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs gap-1" onClick={() => toast.success(`Calling ${lead.name}...`)}>
                    <Phone className="h-3 w-3" /> Call
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs gap-1" onClick={() => updateStatus(lead.id, "contacted")}>
                    <UserCheck className="h-3 w-3" /> Contacted
                  </Button>
                  <Button size="sm" className="flex-1 h-8 text-xs bg-amber-600 hover:bg-amber-700" onClick={() => updateStatus(lead.id, "qualified")}>
                    Qualify
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Convert to Project Dialog */}
      <Dialog open={!!convertLead} onOpenChange={(open) => !open && setConvertLead(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Convert Lead to Project</DialogTitle>
          </DialogHeader>
          {convertLead && (
            <CreateProjectForm
              leadId={convertLead.id}
              defaultValues={{
                customerName: convertLead.name,
                customerEmail: convertLead.email,
                customerPhone: convertLead.phone,
                city: convertLead.city,
                plotSize: convertLead.plotSize || "",
                builtUpArea: convertLead.builtUpArea || "",
              }}
              onSuccess={() => {
                setConvertLead(null);
                load();
              }}
              onCancel={() => setConvertLead(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
