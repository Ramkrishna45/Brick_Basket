"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Plus, Search, User, MapPin, Calendar, Users as UsersIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CreateProjectForm } from "@/components/admin/CreateProjectForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input as FormInput } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/states";
import { CONSTRUCTION_STAGES } from "@/lib/constants";
import { toast } from "sonner";
import { getAllProjectsAction, updateProjectAction } from "@/lib/actions/projects";
import { getAllStaffAction } from "@/lib/actions/staff";
import { format } from "date-fns";

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  
  // Assign Staff Dialog State
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  const [assigningProject, setAssigningProject] = useState<any>(null);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [isUpdatingStaff, setIsUpdatingStaff] = useState(false);

  async function loadData() {
    const [projRes, staffRes] = await Promise.all([
      getAllProjectsAction(),
      getAllStaffAction(),
    ]);
    if (projRes.success && projRes.data) {
      setProjects(projRes.data);
    }
    if (staffRes.success && staffRes.data) {
      setStaffList(staffRes.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = projects.filter((p) => {
    const customerName = p.customer?.name || "";
    return (
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      (p.city && p.city.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const openAssignStaff = (project: any) => {
    setAssigningProject(project);
    setSelectedStaffIds(project.staff?.map((s: any) => s.id) || []);
    setStaffDialogOpen(true);
  };

  const handleToggleStaff = (staffId: string) => {
    setSelectedStaffIds((prev) => 
      prev.includes(staffId) ? prev.filter((id) => id !== staffId) : [...prev, staffId]
    );
  };

  const handleSaveStaffAssignment = async () => {
    if (!assigningProject) return;
    setIsUpdatingStaff(true);
    const res = await updateProjectAction(assigningProject.id, { staffIds: selectedStaffIds });
    if (res.success) {
      toast.success("Staff assignment updated! Notifications sent.");
      setStaffDialogOpen(false);
      loadData();
    } else {
      toast.error(res.error || "Failed to assign staff");
    }
    setIsUpdatingStaff(false);
  };

  if (loading) {
    return <div className="space-y-5"><Skeleton className="h-8 w-48" /><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}</div></div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Projects</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="bg-amber-600 hover:bg-amber-700 text-white gap-2"><Plus className="h-4 w-4" /> New Project</Button>} />
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="py-2">
              <CreateProjectForm 
                onSuccess={() => {
                  setOpen(false);
                  loadData();
                }}
                onCancel={() => setOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input className="pl-9 bg-white dark:bg-slate-950" placeholder="Search by project, customer, city..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((project: any, i: number) => {
          const stageLabel = CONSTRUCTION_STAGES.find((s) => s.key === project.currentStage)?.label || project.currentStage;
          const expectedCompletionDate = project.expectedCompletion ? format(new Date(project.expectedCompletion), "MMM d, yyyy") : "TBD";
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{project.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <User className="h-3 w-3" />{project.customer?.name || "Unassigned"}
                  </div>
                </div>
                <StatusBadge status={project.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <MapPin className="h-3 w-3 text-amber-500" />{project.city}
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <UsersIcon className="h-3 w-3 text-amber-500" />
                  <span className="truncate max-w-[120px]">
                    {project.staff && project.staff.length > 0 ? project.staff.map((s: any) => s.name).join(", ") : "No staff"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Calendar className="h-3 w-3 text-amber-500" />Due: {expectedCompletionDate}
                </div>
                <div>
                  <Badge className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 text-xs py-0">{stageLabel}</Badge>
                </div>
              </div>

              <div className="mb-3 flex-1">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                  <span>Progress</span><span className="font-semibold text-amber-600 dark:text-amber-500">{project.completionPercentage}%</span>
                </div>
                <Progress value={project.completionPercentage} className="h-2" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Value: <span className="font-semibold text-slate-900 dark:text-slate-100">{formatINR(project.totalValue)}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs hover:border-amber-400 hover:text-amber-700 dark:text-amber-400" onClick={() => openAssignStaff(project)}>
                    Assign Staff
                  </Button>
                  <Button variant="default" size="sm" className="h-7 text-xs bg-slate-900 text-white" render={<Link href={`/projects/${project.id}`} />}>
                      View Details
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Assign Staff Dialog */}
      <Dialog open={staffDialogOpen} onOpenChange={setStaffDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Staff to Project</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Select engineers or contractors to assign to <strong className="text-slate-900 dark:text-slate-100">{assigningProject?.name}</strong>.
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 border rounded-md p-2">
              {staffList.map((staff) => (
                <label key={staff.id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 dark:bg-slate-900 rounded-md cursor-pointer border border-transparent hover:border-slate-100 dark:border-slate-800 transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-amber-600 dark:text-amber-500 rounded border-slate-300 dark:border-slate-700 focus:ring-amber-500" 
                    checked={selectedStaffIds.includes(staff.id)}
                    onChange={() => handleToggleStaff(staff.id)}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{staff.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{staff.role} • {staff.email}</span>
                  </div>
                </label>
              ))}
              {staffList.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No staff members available.</p>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-6">
              <Button variant="outline" onClick={() => setStaffDialogOpen(false)}>Cancel</Button>
              <Button 
                className="bg-amber-600 hover:bg-amber-700 text-white" 
                onClick={handleSaveStaffAssignment}
                disabled={isUpdatingStaff}
              >
                {isUpdatingStaff ? "Saving..." : "Save Assignments"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
