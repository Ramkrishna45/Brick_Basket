"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  MapPin, Calendar, User, CheckCircle2, Circle, Clock, ChevronDown, ChevronUp, 
  Building2, Phone, Mail, FileText, IndianRupee, Image as ImageIcon, Camera, Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/states";
import { cn } from "@/lib/utils";
import { getProjectByIdAction } from "@/lib/actions/projects";
import { format } from "date-fns";
import { toast } from "sonner";
import { RecordPaymentModal } from "@/components/admin/RecordPaymentModal";

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export function ProjectDetailsView({ projectId, role }: { projectId: string; role: "admin" | "staff" }) {
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getProjectByIdAction(projectId);
        if (res.success && res.data) {
          setProject(res.data);
        }
      } catch (err) {
        console.error("Failed to load project", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [projectId]);

  // Payment handling is now done via RecordPaymentModal

  if (loading) return (
    <div className="space-y-5">
      <Skeleton className="h-40 rounded-xl" />
      <Skeleton className="h-12 rounded-xl" />
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Building2 className="h-12 w-12 text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Project Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-center max-w-sm">The project you are looking for does not exist or you don't have access.</p>
      </div>
    );
  }

  const completionPercentage = project.completionPercentage || 0;
  const startDate = project.startDate ? format(new Date(project.startDate), "MMM d, yyyy") : "TBD";
  const expectedCompletion = project.expectedCompletion ? format(new Date(project.expectedCompletion), "MMM d, yyyy") : "TBD";
  const engineerName = project.staff && project.staff.length > 0 ? project.staff.map((s: any) => s.name).join(", ") : "Unassigned";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Project Details</h1>
        {role === "admin" && (
          <Badge variant="outline" className="text-xs">Admin View</Badge>
        )}
      </div>

      {/* Project header card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{project.name}</h2>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm mt-1">
                  <MapPin className="h-4 w-4 text-amber-500" />
                  {project.siteAddress}, {project.city}
                </div>
              </div>
              <StatusBadge status={project.status || "planning"} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { icon: Calendar, label: "Start Date", value: startDate },
                { icon: Clock, label: "Est. Completion", value: expectedCompletion },
                { icon: User, label: "Engineer", value: engineerName },
                { icon: IndianRupee, label: "Total Cost", value: project.totalValue ? `₹${project.totalValue.toLocaleString("en-IN")}` : "N/A" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Icon className="h-3 w-3" />{label}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</div>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700 dark:text-slate-300">Overall Completion</span>
                <span className="font-bold text-amber-600 dark:text-amber-500">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-3 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs for detailed sections */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-12">
          <TabsTrigger value="overview" className="h-full">Overview & Timeline</TabsTrigger>
          <TabsTrigger value="progress" className="h-full">Progress Updates</TabsTrigger>
          <TabsTrigger value="payments" className="h-full">Payments</TabsTrigger>
          <TabsTrigger value="documents" className="h-full">Documents</TabsTrigger>
        </TabsList>
        
        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              {/* Customer Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Client Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{project.clientName || project.customer?.name || "N/A"}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Client / Owner</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2"><Phone className="h-3 w-3 text-slate-400" /> {project.mobileNumber || project.customer?.phone || "N/A"}</div>
                    <div className="flex items-center gap-2"><Mail className="h-3 w-3 text-slate-400" /> {project.customer?.email || "N/A"}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Technical Specs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between border-b pb-2"><span className="text-slate-500 dark:text-slate-400">Plot Size</span><span className="font-medium">{project.plotSize || "N/A"}</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-slate-500 dark:text-slate-400">Built-up Area</span><span className="font-medium">{project.builtUpArea || "N/A"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Plan Name</span><span className="font-medium">{project.planName || "Custom Plan"}</span></div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline */}
            <div className="md:col-span-2">
              <Card className="h-full border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Construction Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-slate-200 dark:bg-slate-800 z-0" />

                    <div className="space-y-3">
                      {(project.milestones || []).map((milestone: any, i: number) => {
                        const isExpanded = expanded === milestone.id;
                        return (
                          <motion.div key={milestone.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="relative flex gap-4 z-10">
                            {/* Status indicator */}
                            <div className="flex-shrink-0 flex items-start pt-2">
                              {milestone.status === "completed" ? (
                                <div className="h-10 w-10 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center">
                                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                </div>
                              ) : milestone.status === "in_progress" ? (
                                <div className="h-10 w-10 rounded-full bg-amber-100 border-2 border-amber-500 flex items-center justify-center relative">
                                  <div className="h-3 w-3 bg-amber-500 rounded-full animate-pulse" />
                                </div>
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center">
                                  <Circle className="h-4 w-4 text-slate-300" />
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className={cn("flex-1 pb-3", i < project.milestones.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : "")}>
                              <button onClick={() => setExpanded(isExpanded ? null : milestone.id)} className="flex items-center justify-between w-full text-left py-1.5 focus:outline-none">
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={cn("font-semibold text-sm", milestone.status === "completed" ? "text-slate-700 dark:text-slate-300" : milestone.status === "in_progress" ? "text-amber-700 dark:text-amber-400" : "text-slate-400")}>
                                      {milestone.title}
                                    </span>
                                    {milestone.status === "in_progress" && <Badge className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 text-xs py-0">Active</Badge>}
                                  </div>
                                  <div className="text-xs text-slate-400 mt-0.5">
                                    {milestone.completedDate ? `Completed: ${format(new Date(milestone.completedDate), "MMM d, yyyy")}` : milestone.startDate ? `Started: ${format(new Date(milestone.startDate), "MMM d, yyyy")}` : "Upcoming"}
                                  </div>
                                </div>
                                {milestone.notes && (isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />)}
                              </button>
                              {isExpanded && milestone.notes && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="overflow-hidden">
                                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-100 rounded-lg p-3 mt-1">
                                    <div className="text-xs font-medium text-amber-800 dark:text-amber-300 mb-1">Notes</div>
                                    <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">{milestone.notes}</p>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                      {project.milestones?.length === 0 && (
                         <div className="text-sm text-slate-500 dark:text-slate-400 pl-14 py-4">No construction milestones created yet.</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* PROGRESS UPDATES TAB */}
        <TabsContent value="progress" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Progress Updates</CardTitle>
              <CardDescription>Daily and weekly site photos and updates.</CardDescription>
            </CardHeader>
            <CardContent>
              {(!project.progressUpdates || project.progressUpdates.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Camera className="h-10 w-10 text-slate-300 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No progress updates available.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {project.progressUpdates.map((update: any) => (
                    <div key={update.id} className="border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100">{update.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <span>{format(new Date(update.createdAt), "MMM d, yyyy h:mm a")}</span>
                            <span>•</span>
                            <span>By: {update.uploadedBy?.name || "Unknown"}</span>
                            <span>•</span>
                            <Badge variant="secondary" className="text-[10px] py-0">{update.stage}</Badge>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                          +{update.completionPercentage}% Done
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{update.description}</p>
                      {update.photos && update.photos.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {update.photos.map((photo: string, i: number) => (
                            <div key={i} className="aspect-square bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden relative group">
                              {/* Using standard img to avoid Next Image domain errors since urls can be from anywhere or fake */}
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={photo} alt={`Progress ${i}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PAYMENTS TAB */}
        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Payment Schedule</CardTitle>
                <CardDescription>Milestone based payment structure.</CardDescription>
              </div>
              {role === "admin" || role === "staff" ? (
                <RecordPaymentModal 
                  projectId={project.id}
                  maxAmount={(project.payments || []).reduce((s:number, m:any) => s + m.amount, 0) - (project.payments || []).reduce((s:number, m:any) => s + (m.paidAmount || 0), 0)}
                  onSuccess={() => {
                    getProjectByIdAction(projectId).then(pRes => {
                      if (pRes.success && pRes.data) setProject(pRes.data);
                    });
                  }}
                />
              ) : null}
            </CardHeader>
            <CardContent>
              {(!project.payments || project.payments.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <IndianRupee className="h-10 w-10 text-slate-300 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No payments scheduled yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900 border-b">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">Milestone</th>
                        <th className="px-4 py-3 text-right">Target Amount</th>
                        <th className="px-4 py-3 text-right">Paid Amount</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3">Paid On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.payments.map((payment: any, i: number) => (
                        <tr key={payment.id} className="border-b last:border-0 hover:bg-slate-50 dark:bg-slate-900">
                          <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{payment.name}</td>
                          <td className="px-4 py-3 text-slate-900 dark:text-slate-100 font-semibold text-right">{formatINR(payment.amount)}</td>
                          <td className="px-4 py-3 font-semibold text-emerald-600 text-right">{formatINR(payment.paidAmount || 0)}</td>
                          <td className="px-4 py-3 text-center">
                            <StatusBadge status={payment.status} />
                          </td>
                          <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                            {payment.paidDate ? format(new Date(payment.paidDate), "MMM d, yyyy") : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* DOCUMENTS TAB */}
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Documents</CardTitle>
              <CardDescription>Contracts, approvals, and plans.</CardDescription>
            </CardHeader>
            <CardContent>
              {(!project.documents || project.documents.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-10 w-10 text-slate-300 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No documents uploaded yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {project.documents.map((doc: any) => (
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" key={doc.id} className="flex items-center gap-3 p-3 border rounded-lg hover:border-amber-400 hover:shadow-sm transition-all bg-white dark:bg-slate-950 cursor-pointer group">
                      <div className="h-10 w-10 bg-amber-50 dark:bg-amber-950/40 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-500 flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate" title={doc.name}>{doc.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span className="uppercase">{doc.fileType}</span>
                          <span>•</span>
                          <span>{doc.fileSize}</span>
                        </div>
                      </div>
                      <Download className="h-4 w-4 text-slate-300 group-hover:text-amber-600 dark:text-amber-500 transition-colors" />
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
