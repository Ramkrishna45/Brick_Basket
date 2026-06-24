"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Building2, Camera, CreditCard, FileText, ArrowRight, MapPin, Calendar, User, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/states";
import { useCurrentUser } from "@/lib/auth-client";
import { CONSTRUCTION_STAGES } from "@/lib/constants";
import { getMyProjectAction } from "@/lib/actions/projects";
import { getProgressUpdatesAction } from "@/lib/actions/progress";
import { getPaymentSummaryAction } from "@/lib/actions/payments";
import { getDocumentsAction } from "@/lib/actions/documents";

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }),
};

export default function DashboardPage() {
  const { user } = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [updates, setUpdates] = useState<any[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<any>(null);
  const [docCount, setDocCount] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const pRes = await getMyProjectAction();
        if (pRes.success && pRes.data) {
          setProject(pRes.data);
          const [uRes, payRes, docRes] = await Promise.all([
            getProgressUpdatesAction(pRes.data.id),
            getPaymentSummaryAction(pRes.data.id),
            getDocumentsAction(pRes.data.id),
          ]);
          if (uRes.success && uRes.data) setUpdates(uRes.data);
          if (payRes.success && payRes.data) setPaymentSummary(payRes.data);
          if (docRes.success && docRes.data) setDocCount(docRes.data.length);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Building2 className="h-12 w-12 text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-700">No project assigned yet</h2>
        <p className="text-slate-500 mt-2 text-center max-w-sm">We are preparing your project workspace. Please check back later or contact support.</p>
      </div>
    );
  }

  const currentStageLabel = CONSTRUCTION_STAGES.find((s) => s.key === project.currentStage)?.label || project.currentStage || "Not Started";
  const completionPercentage = project.completionPercentage || 0;
  const nextPaymentAmount = paymentSummary?.nextDue?.amount || 0;
  const nextPaymentDate = paymentSummary?.nextDue?.dueDate || "No pending dues";
  const engineerName = project.engineer?.name || "Unassigned";
  const startDate = project.startDate ? new Date(project.startDate).toLocaleDateString() : "TBD";
  const expectedCompletion = project.expectedCompletion ? new Date(project.expectedCompletion).toLocaleDateString() : "TBD";

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
        <h1 className="text-2xl font-bold text-slate-900">
          Good morning, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1">Here&apos;s your project status at a glance</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Project Status",
            value: <StatusBadge status={project.status || "planning"} />,
            icon: Building2,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
            sub: `Active since ${startDate}`,
          },
          {
            title: "Current Phase",
            value: currentStageLabel,
            icon: TrendingUp,
            iconBg: "bg-amber-50",
            iconColor: "text-amber-600",
            sub: `${completionPercentage}% complete`,
            showProgress: true,
          },
          {
            title: "Next Payment",
            value: nextPaymentAmount > 0 ? formatINR(nextPaymentAmount) : "All paid",
            icon: CreditCard,
            iconBg: "bg-red-50",
            iconColor: "text-red-500",
            sub: nextPaymentAmount > 0 ? `Due: ${nextPaymentDate}` : "No upcoming payments",
            urgent: nextPaymentAmount > 0,
          },
          {
            title: "Documents",
            value: `${docCount} Available`,
            icon: FileText,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
            sub: "All categories",
          },
        ].map((stat, i) => (
          <motion.div key={stat.title} custom={i + 1} variants={fadeUp} initial="hidden" animate="visible">
            <Card className="border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconBg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                  </div>
                  {stat.urgent && <Badge className="bg-red-50 text-red-600 border-red-200 text-xs">Due Soon</Badge>}
                </div>
                <div className="text-xs text-slate-500 mb-1">{stat.title}</div>
                <div className="text-lg font-bold text-slate-900 mb-1">{stat.value}</div>
                {stat.showProgress && <Progress value={completionPercentage} className="h-1.5 mb-1" />}
                <div className="text-xs text-slate-400">{stat.sub}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Project Overview */}
      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Project Overview</CardTitle>
              <Button render={<Link href="/project" />} variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 gap-1 text-xs h-7">
                View Details <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{project.name}</h3>
                <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                  <MapPin className="h-3.5 w-3.5" />{project.siteAddress}, {project.city}
                </div>
              </div>
              <StatusBadge status={project.status || "planning"} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              {[
                { icon: Calendar, label: "Started", value: startDate },
                { icon: Clock, label: "Expected", value: expectedCompletion },
                { icon: User, label: "Engineer", value: engineerName },
                { icon: TrendingUp, label: "Current Stage", value: currentStageLabel },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                    <Icon className="h-3 w-3" />{label}
                  </div>
                  <div className="font-medium text-slate-900 text-xs">{value}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 font-medium">Overall Completion</span>
                <span className="font-bold text-amber-600">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2.5" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Updates + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Updates */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-2">
          <Card className="border-slate-200 h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Camera className="h-4 w-4 text-amber-600" /> Recent Updates
                </CardTitle>
                <Button render={<Link href="/progress" />} variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 gap-1 text-xs h-7">
                  View All <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {updates.length === 0 ? (
                <div className="text-center p-6 text-sm text-slate-500">No updates yet</div>
              ) : (
                updates.slice(0, 3).map((update) => (
                  <div key={update.id} className="flex gap-3 p-3 rounded-lg bg-slate-50 hover:bg-amber-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-medium text-slate-900 truncate">{update.title}</span>
                        <StatusBadge status={update.stage} />
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{update.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                        <span>{update.date}</span>
                        <span>by {update.uploadedBy?.name || "Engineer"}</span>
                        <span className="flex items-center gap-1">
                          <Camera className="h-3 w-3" />{(update.photos || []).length} photos
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Links */}
        <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="border-slate-200 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { href: "/project", icon: Building2, label: "Project Timeline", sub: "View stages", color: "text-blue-600", bg: "bg-blue-50" },
                { href: "/progress", icon: Camera, label: "Progress Updates", sub: `${updates.length} updates`, color: "text-amber-600", bg: "bg-amber-50" },
                { href: "/documents", icon: FileText, label: "My Documents", sub: `${docCount} files`, color: "text-violet-600", bg: "bg-violet-50" },
                { href: "/payments", icon: CreditCard, label: "Payment Status", sub: nextPaymentAmount > 0 ? `Next due: ${nextPaymentDate}` : "All paid", color: "text-emerald-600", bg: "bg-emerald-50" },
              ].map(({ href, icon: Icon, label, sub, color, bg }) => (
                <Link key={href} href={href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg} flex-shrink-0`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900">{label}</div>
                    <div className="text-xs text-slate-400">{sub}</div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
