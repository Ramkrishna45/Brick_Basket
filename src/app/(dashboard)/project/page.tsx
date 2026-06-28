"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { MapPin, Calendar, User, CheckCircle2, Circle, Clock, ChevronDown, ChevronUp, Camera, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/states";
import { cn } from "@/lib/utils";
import { getMyProjectAction } from "@/lib/actions/projects";

export default function ProjectPage() {
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getMyProjectAction();
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
  }, []);

  if (loading) return (
    <div className="space-y-5">
      <Skeleton className="h-32 rounded-xl" />
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Building2 className="h-12 w-12 text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No project assigned yet</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-center max-w-sm">We are preparing your project workspace. Please check back later or contact support.</p>
      </div>
    );
  }

  const completionPercentage = project.completionPercentage || 0;
  const startDate = project.startDate ? new Date(project.startDate).toLocaleDateString() : "TBD";
  const expectedCompletion = project.expectedCompletion ? new Date(project.expectedCompletion).toLocaleDateString() : "TBD";
  const engineerName = project.staff && project.staff.length > 0 ? project.staff.map((s: any) => s.name).join(", ") : "Unassigned";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Project</h1>

      {/* Project header card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{project.name}</h2>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm mt-1">
                  <MapPin className="h-4 w-4 text-amber-500" />
                  {project.siteAddress}, {project.city}
                </div>
              </div>
              <StatusBadge status={project.status || "planning"} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              {[
                { icon: Calendar, label: "Start Date", value: startDate },
                { icon: Clock, label: "Est. Completion", value: expectedCompletion },
                { icon: User, label: "Engineer", value: engineerName },
                { icon: MapPin, label: "Plot Size", value: project.plotSize || "N/A" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
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
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Started: {startDate}</span><span>{completionPercentage}% done</span><span>Target: {expectedCompletion}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Timeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <Card className="border-slate-200 dark:border-slate-800">
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
                    <motion.div
                      key={milestone.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="relative flex gap-4 z-10"
                    >
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
                        <button
                          onClick={() => setExpanded(isExpanded ? null : milestone.id)}
                          className="flex items-center justify-between w-full text-left py-1.5"
                        >
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={cn("font-semibold text-sm",
                                milestone.status === "completed" ? "text-slate-700 dark:text-slate-300"
                                  : milestone.status === "in_progress" ? "text-amber-700 dark:text-amber-400"
                                  : "text-slate-400"
                              )}>
                                {milestone.title}
                              </span>
                              {milestone.status === "in_progress" && (
                                <Badge className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 text-xs py-0">Active</Badge>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {milestone.completedDate ? `Completed: ${new Date(milestone.completedDate).toLocaleDateString()}`
                                : milestone.startDate ? `Started: ${new Date(milestone.startDate).toLocaleDateString()}`
                                : "Upcoming"}
                            </div>
                          </div>
                          {milestone.notes && (
                            isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
                          )}
                        </button>

                        {isExpanded && milestone.notes && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="overflow-hidden"
                          >
                            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-100 rounded-lg p-3 mt-1">
                              <div className="text-xs font-medium text-amber-800 dark:text-amber-300 mb-1">Engineer Notes</div>
                              <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">{milestone.notes}</p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
