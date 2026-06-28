"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Building2, MapPin, Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/shared/states";
import { CONSTRUCTION_STAGES } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getStaffAssignedProjectsAction } from "@/lib/actions/staff-projects";

export default function StaffDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await getStaffAssignedProjectsAction();
      if (res.success && res.data) {
        setProjects(res.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-full mb-4">
          <Building2 className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">No Assigned Projects</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
          You haven't been assigned to any active projects yet. The admin will notify you when a project is assigned.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Assigned Projects</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track the projects you are currently supervising.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {projects.map((project, index) => {
          const stageLabel = CONSTRUCTION_STAGES.find((s) => s.key === project.currentStage)?.label || project.currentStage;
          const expectedCompletionDate = project.expectedCompletion ? new Date(project.expectedCompletion).toLocaleDateString() : "TBD";
          
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{project.name}</h2>
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm mt-1">
                        <MapPin className="h-4 w-4 text-amber-500" />
                        {project.siteAddress}, {project.city}
                      </div>
                    </div>
                    <StatusBadge status={project.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                        <Clock className="h-3 w-3" /> Current Stage
                      </div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{stageLabel}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                        <Calendar className="h-3 w-3" /> Target Date
                      </div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{expectedCompletionDate}</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Completion</span>
                      <span className="font-bold text-amber-600 dark:text-amber-500">{project.completionPercentage}%</span>
                    </div>
                    <Progress value={project.completionPercentage} className="h-2 rounded-full" />
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Customer: <span className="font-medium text-slate-900 dark:text-slate-100">{project.customer?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button variant="outline" className="flex-1 sm:flex-none border-amber-200 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:bg-amber-950/40 hover:text-amber-800 dark:text-amber-300" render={<Link href={`/staff/progress?project=${project.id}`} />}>
                          Upload Progress
                      </Button>
                      <Button className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 text-white" render={<Link href={`/staff/projects/${project.id}`} />}>
                          View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
