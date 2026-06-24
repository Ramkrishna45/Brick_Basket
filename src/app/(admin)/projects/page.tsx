"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Plus, Search, User, MapPin, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input as FormInput } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/states";
import { CONSTRUCTION_STAGES } from "@/lib/constants";
import { toast } from "sonner";
import { getAllProjectsAction } from "@/lib/actions/projects";
import { format } from "date-fns";

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

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

  const filtered = projects.filter((p) => {
    const customerName = p.customer?.name || "";
    return (
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      (p.city && p.city.toLowerCase().includes(search.toLowerCase()))
    );
  });

  if (loading) {
    return <div className="space-y-5"><Skeleton className="h-8 w-48" /><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}</div></div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Plus className="h-4 w-4" /> New Project
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              {[
                { id: "pname", label: "Project Name", placeholder: "e.g. Patel Residence" },
                { id: "customer", label: "Customer Name", placeholder: "e.g. Vikram Patel" },
                { id: "address", label: "Site Address", placeholder: "Full address" },
                { id: "city", label: "City", placeholder: "e.g. Bengaluru" },
                { id: "plot", label: "Plot Size", placeholder: "e.g. 2,400 sq.ft" },
                { id: "area", label: "Built-up Area", placeholder: "e.g. 1,800 sq.ft" },
              ].map(({ id, label, placeholder }) => (
                <div key={id}>
                  <Label htmlFor={id}>{label}</Label>
                  <FormInput id={id} className="mt-1" placeholder={placeholder} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Assign Engineer</Label>
                  <Select>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select engineer" /></SelectTrigger>
                    <SelectContent>
                      {["Arjun Nair", "Ravi Kumar", "Priya Sharma"].map((e) => (
                        <SelectItem key={e} value={e}>{e}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <FormInput id="start-date" type="date" className="mt-1" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button className="bg-amber-600 hover:bg-amber-700" onClick={() => { setOpen(false); toast.success("Project created successfully!"); }}>
                  Create Project
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input className="pl-9 bg-white" placeholder="Search by project, customer, city..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{project.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <User className="h-3 w-3" />{project.customer?.name || "Unassigned"}
                  </div>
                </div>
                <StatusBadge status={project.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="h-3 w-3 text-amber-500" />{project.city}
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <User className="h-3 w-3 text-amber-500" />{project.engineer?.name || "Unassigned"}
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="h-3 w-3 text-amber-500" />Due: {expectedCompletionDate}
                </div>
                <div>
                  <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-xs py-0">{stageLabel}</Badge>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Progress</span><span className="font-semibold text-amber-600">{project.completionPercentage}%</span>
                </div>
                <Progress value={project.completionPercentage} className="h-2" />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Value: <span className="font-semibold text-slate-900">{formatINR(project.totalValue)}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-7 text-xs hover:text-amber-600" onClick={() => toast.info("Project detail view coming soon!")}>
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs hover:border-amber-400 hover:text-amber-700" onClick={() => toast.info("Edit project coming soon!")}>
                    Edit
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
