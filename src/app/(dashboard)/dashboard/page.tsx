"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Building2, Camera, CreditCard, FileText, ArrowRight, MapPin, Calendar,
  User, TrendingUp, Clock, Plus, Compass, CheckCircle2, Send, Star,
  ChevronDown, Sparkles, ArrowUpRight, Phone, Rocket, Eye, Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/states";
import { useCurrentUser } from "@/lib/auth-client";
import { CONSTRUCTION_STAGES, PLANS } from "@/lib/constants";
import { getMyProjectsAction, getMyEnquiriesAction } from "@/lib/actions/projects";
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

// ── Enquiry Status Badge ────────────────────────────────────────────

function EnquiryStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    new: { label: "Submitted", cls: "bg-blue-50 text-blue-700 border-blue-200" },
    contacted: { label: "Contacted", cls: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200" },
    qualified: { label: "Qualified", cls: "bg-violet-50 text-violet-700 border-violet-200" },
    converted: { label: "Converted", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    rejected: { label: "Closed", cls: "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800" },
  };
  const { label, cls } = map[status] || map.new;
  return <Badge className={`${cls} text-xs`}>{label}</Badge>;
}

// ── No-Project Welcome Dashboard ────────────────────────────────────

function WelcomeDashboard({ userName, enquiries }: { userName: string; enquiries: any[] }) {
  const howItWorks = [
    { step: 1, icon: Send, title: "Submit Enquiry", desc: "Tell us about your dream home" },
    { step: 2, icon: Compass, title: "Select Plan", desc: "Choose from Basic, Standard, or Premium" },
    { step: 3, icon: Building2, title: "Start Construction", desc: "We assign an engineer and begin work" },
    { step: 4, icon: Eye, title: "Track Daily", desc: "See daily photos and progress updates" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900/40 p-8 sm:p-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10">
            <Badge className="mb-4 bg-amber-500/20 text-amber-300 border-amber-500/30">
              <Sparkles className="h-3 w-3 mr-1" /> Welcome to Brick Basket
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Hello, {userName?.split(" ")[0]}! 👋
            </h1>
            <p className="text-slate-300 max-w-lg mb-6 leading-relaxed">
              You&apos;re one step away from building your dream home. Submit an enquiry to get started,
              or explore our construction plans to find the right fit for you.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button render={<Link href="/new-enquiry" />} className="bg-amber-600 hover:bg-amber-700 text-white gap-2 h-11 px-6 font-semibold">
                <Plus className="h-4 w-4" /> Start New Project
              </Button>
              <Button render={<Link href="/plans" />} variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white gap-2 h-11 px-6">
                <Compass className="h-4 w-4" /> Explore Plans
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">How It Works</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {howItWorks.map(({ step, icon: Icon, title, desc }, i) => (
            <motion.div key={step} custom={i + 2} variants={fadeUp} initial="hidden" animate="visible">
              <Card className="border-slate-200 dark:border-slate-800 hover:border-amber-300 hover:shadow-md transition-all h-full group">
                <CardContent className="p-5 text-center">
                  <div className="relative mx-auto mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40 mx-auto group-hover:bg-amber-100 transition-colors">
                      <Icon className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {step}
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Plans Section */}
      <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Our Construction Plans</h2>
          <Button render={<Link href="/plans" />} variant="ghost" size="sm" className="text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:text-amber-400 gap-1 text-xs h-7">
            View All Details <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.id} custom={i + 4} variants={fadeUp} initial="hidden" animate="visible">
              <Card className={`border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all relative h-full ${plan.isPopular ? "border-amber-400 shadow-md ring-1 ring-amber-200" : ""}`}>
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-amber-600 text-white border-0 shadow-md">
                      <Star className="h-3 w-3 mr-1" /> Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-500">{plan.price}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">/{plan.priceUnit}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{plan.description}</p>
                  <div className="space-y-1.5 mb-5">
                    {plan.features.slice(0, 6).map((f) => (
                      <div key={f.name} className="flex items-center gap-2 text-xs">
                        {f.included ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <div className="h-3.5 w-3.5 rounded-full border border-slate-200 dark:border-slate-800 flex-shrink-0" />
                        )}
                        <span className={f.included ? "text-slate-700 dark:text-slate-300" : "text-slate-400"}>{f.name}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    render={<Link href="/new-enquiry" />}
                    className={`w-full h-9 text-sm font-medium ${plan.isPopular ? "bg-amber-600 hover:bg-amber-700 text-white" : ""}`}
                    variant={plan.isPopular ? "default" : "outline"}
                  >
                    Choose {plan.name}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Why Choose Brick Basket */}
      <motion.div variants={fadeUp} custom={7} initial="hidden" animate="visible">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Why Choose Brick Basket?</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { icon: Camera, title: "Daily Photo Updates", desc: "See your home being built, every single day", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: FileText, title: "Online Documents", desc: "All agreements, plans, and receipts in one place", color: "text-violet-600", bg: "bg-violet-50" },
            { icon: CreditCard, title: "Payment Tracking", desc: "Track every rupee with milestone-based payments", color: "text-emerald-600", bg: "bg-emerald-50" },
            { icon: User, title: "Assigned Engineer", desc: "A dedicated engineer supervises your project", color: "text-amber-600 dark:text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/40" },
            { icon: Shield, title: "100% Transparent", desc: "No hidden costs, no surprises", color: "text-red-500", bg: "bg-red-50" },
            { icon: Phone, title: "Mobile-First", desc: "Track everything from your phone, anywhere", color: "text-cyan-600", bg: "bg-cyan-50" },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <Card key={title} className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg} mb-3`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Past Enquiries */}
      {enquiries.length > 0 && (
        <motion.div variants={fadeUp} custom={8} initial="hidden" animate="visible">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Your Enquiries</h2>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-0 divide-y divide-slate-100">
              {enquiries.map((enq: any) => (
                <div key={enq.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:bg-slate-900 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {enq.homeType ? enq.homeType.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) : "Home Construction"}
                      </span>
                      <EnquiryStatusBadge status={enq.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      {enq.city && <span>{enq.city}</span>}
                      {enq.budgetRange && <span>• {enq.budgetRange}</span>}
                      <span>• {new Date(enq.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-300 flex-shrink-0" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Bottom CTA */}
      <motion.div variants={fadeUp} custom={9} initial="hidden" animate="visible">
        <div className="rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-center">
          <Rocket className="h-8 w-8 text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">Ready to Build?</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-md mx-auto">
            Submit a free enquiry and our team will contact you within 24 hours with a personalized plan.
          </p>
          <Button render={<Link href="/new-enquiry" />} className="bg-amber-600 hover:bg-amber-700 text-white gap-2 h-10 px-6">
            <Send className="h-4 w-4" /> Get Free Consultation
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Project Selector (multi-project) ────────────────────────────────

function ProjectSelector({ projects, selected, onSelect }: { projects: any[]; selected: string; onSelect: (id: string) => void }) {
  if (projects.length <= 1) return null;

  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Project:</span>
      <div className="flex flex-wrap gap-2">
        {projects.map((p: any) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selected === p.id
                ? "bg-amber-600 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:bg-slate-800"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main Dashboard Page ─────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [updates, setUpdates] = useState<any[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<any>(null);
  const [docCount, setDocCount] = useState(0);
  const [enquiries, setEnquiries] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [pRes, eRes] = await Promise.all([
          getMyProjectsAction(),
          getMyEnquiriesAction(),
        ]);

        if (eRes.success && eRes.data) setEnquiries(eRes.data);

        if (pRes.success && pRes.data && pRes.data.length > 0) {
          setProjects(pRes.data);
          setSelectedProjectId(pRes.data[0].id);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Load project-specific data when selectedProjectId changes
  useEffect(() => {
    if (!selectedProjectId) return;

    async function loadProjectData() {
      try {
        const [uRes, payRes, docRes] = await Promise.all([
          getProgressUpdatesAction(selectedProjectId),
          getPaymentSummaryAction(selectedProjectId),
          getDocumentsAction(selectedProjectId),
        ]);
        if (uRes.success && uRes.data) setUpdates(uRes.data);
        else setUpdates([]);
        if (payRes.success && payRes.data) setPaymentSummary(payRes.data);
        else setPaymentSummary(null);
        if (docRes.success && docRes.data) setDocCount(docRes.data.length);
        else setDocCount(0);
      } catch (err) {
        console.error("Failed to load project data", err);
      }
    }
    loadProjectData();
  }, [selectedProjectId]);

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

  // ── No projects: show welcome dashboard ───────────────────────────
  if (projects.length === 0) {
    return <WelcomeDashboard userName={user?.name || "there"} enquiries={enquiries} />;
  }

  // ── Has projects: show project dashboard ──────────────────────────
  const project = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const currentStageLabel = CONSTRUCTION_STAGES.find((s) => s.key === project.currentStage)?.label || project.currentStage || "Not Started";
  const completionPercentage = project.completionPercentage || 0;
  const nextPaymentAmount = paymentSummary?.nextDue?.amount || 0;
  const nextPaymentDate = paymentSummary?.nextDue?.dueDate || "No pending dues";
  const engineerName = project.staff && project.staff.length > 0 ? project.staff.map((s: any) => s.name).join(", ") : "Unassigned";
  const startDate = project.startDate ? new Date(project.startDate).toLocaleDateString() : "TBD";
  const expectedCompletion = project.expectedCompletion ? new Date(project.expectedCompletion).toLocaleDateString() : "TBD";

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Good morning, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Here&apos;s your project status at a glance</p>
          </div>
          <Button render={<Link href="/new-enquiry" />} variant="outline" className="gap-2 border-amber-300 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:bg-amber-950/40 hidden sm:flex">
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </div>
      </motion.div>

      {/* Project Selector */}
      <ProjectSelector projects={projects} selected={selectedProjectId} onSelect={setSelectedProjectId} />

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
            iconBg: "bg-amber-50 dark:bg-amber-950/40",
            iconColor: "text-amber-600 dark:text-amber-500",
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
            <Card className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconBg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                  </div>
                  {stat.urgent && <Badge className="bg-red-50 text-red-600 border-red-200 text-xs">Due Soon</Badge>}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{stat.title}</div>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{stat.value}</div>
                {stat.showProgress && <Progress value={completionPercentage} className="h-1.5 mb-1" />}
                <div className="text-xs text-slate-400">{stat.sub}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Project Overview */}
      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Project Overview</CardTitle>
              <Button render={<Link href="/project" />} variant="ghost" size="sm" className="text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:text-amber-400 gap-1 text-xs h-7">
                View Details <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{project.name}</h3>
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm mt-1">
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
                <div key={label} className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                    <Icon className="h-3 w-3" />{label}
                  </div>
                  <div className="font-medium text-slate-900 dark:text-slate-100 text-xs">{value}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Overall Completion</span>
                <span className="font-bold text-amber-600 dark:text-amber-500">{completionPercentage}%</span>
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
          <Card className="border-slate-200 dark:border-slate-800 h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Camera className="h-4 w-4 text-amber-600 dark:text-amber-500" /> Recent Updates
                </CardTitle>
                <Button render={<Link href="/progress" />} variant="ghost" size="sm" className="text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:text-amber-400 gap-1 text-xs h-7">
                  View All <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {updates.length === 0 ? (
                <div className="text-center p-6 text-sm text-slate-500 dark:text-slate-400">No updates yet</div>
              ) : (
                updates.slice(0, 3).map((update) => (
                  <div key={update.id} className="flex gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-amber-50 dark:bg-amber-950/40 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{update.title}</span>
                        <StatusBadge status={update.stage} />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{update.description}</p>
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
          <Card className="border-slate-200 dark:border-slate-800 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { href: "/project", icon: Building2, label: "Project Timeline", sub: "View stages", color: "text-blue-600", bg: "bg-blue-50" },
                { href: "/progress", icon: Camera, label: "Progress Updates", sub: `${updates.length} updates`, color: "text-amber-600 dark:text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/40" },
                { href: "/documents", icon: FileText, label: "My Documents", sub: `${docCount} files`, color: "text-violet-600", bg: "bg-violet-50" },
                { href: "/payments", icon: CreditCard, label: "Payment Status", sub: nextPaymentAmount > 0 ? `Next due: ${nextPaymentDate}` : "All paid", color: "text-emerald-600", bg: "bg-emerald-50" },
                { href: "/new-enquiry", icon: Plus, label: "Start New Project", sub: "Submit a new enquiry", color: "text-amber-600 dark:text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/40" },
              ].map(({ href, icon: Icon, label, sub, color, bg }) => (
                <Link key={href + label} href={href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:bg-slate-900 transition-colors group">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg} flex-shrink-0`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{label}</div>
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
