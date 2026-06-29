"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Upload, Image as ImageIcon, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { toast } from "sonner";
import { getStaffAssignedProjectsAction, createProgressUpdateAction } from "@/lib/actions/staff-projects";
import { uploadFileAction } from "@/lib/actions/upload";
import { CONSTRUCTION_STAGES } from "@/lib/constants";

export default function StaffProgressUploadPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [stage, setStage] = useState("");
  const [completionPercentage, setCompletionPercentage] = useState([0]);

  useEffect(() => {
    async function load() {
      const res = await getStaffAssignedProjectsAction();
      if (res.success && res.data) {
        setProjects(res.data);
        if (res.data.length > 0) {
          setProjectId(res.data[0].id);
          setStage(res.data[0].currentStage);
          setCompletionPercentage([res.data[0].completionPercentage]);
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  // Update dependent fields when project changes
  useEffect(() => {
    const selected = projects.find(p => p.id === projectId);
    if (selected) {
      setStage(selected.currentStage);
      setCompletionPercentage([selected.completionPercentage]);
    }
  }, [projectId, projects]);

  const handleSubmit = async () => {
    if (!projectId || !title || !description || !stage) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    let imageUrl = "https://images.unsplash.com/photo-1541888081622-19e0789d970a?q=80&w=600";
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      const uploadRes = await uploadFileAction(formData);
      if (uploadRes.error) {
        toast.error(uploadRes.error);
        setIsSubmitting(false);
        return;
      }
      if (uploadRes.url) {
        imageUrl = uploadRes.url;
      }
    }
    const res = await createProgressUpdateAction({
      projectId,
      title,
      description,
      stage,
      completionPercentage: completionPercentage[0],
      images: [imageUrl],
    });
    
    if (res.error) {
      toast.error(res.error);
      setIsSubmitting(false);
      return;
    }
    
    toast.success("Progress update published successfully!");
    
    // Reset form partially
    setTitle("");
    setDescription("");
    setImageFile(null);
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[600px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Upload Progress</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Submit daily site updates, photos, and progress notes.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <CardTitle className="text-lg">New Progress Report</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="project">Select Project <span className="text-red-500">*</span></Label>
              <Select value={projectId} onValueChange={(val) => setProjectId(val || "")}>
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select a project">
                    {(val: string | null) => {
                      if (!val) return null;
                      const p = projects.find((proj) => proj.id === val);
                      return p ? `${p.name} (${p.customer?.name || "Unassigned"})` : val;
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {projects.map(p => {
                    const text = `${p.name} (${p.customer?.name || "Unassigned"})`;
                    return (
                      <SelectItem key={p.id} value={p.id} label={text}>
                        {text}
                      </SelectItem>
                    );
                  })}
                  {projects.length === 0 && (
                    <SelectItem value="none" disabled>No assigned projects</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="stage">Current Stage <span className="text-red-500">*</span></Label>
                <Select value={stage} onValueChange={(val) => setStage(val || "")}>
                  <SelectTrigger id="stage">
                    <SelectValue placeholder="Select construction stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONSTRUCTION_STAGES.map(s => (
                      <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Overall Completion</Label>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-500">{completionPercentage[0]}%</span>
                </div>
                <div className="pt-2">
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={completionPercentage[0]}
                    onChange={(e) => setCompletionPercentage([parseInt(e.target.value)])}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Update Title <span className="text-red-500">*</span></Label>
              <Input 
                id="title" 
                placeholder="e.g. Ground floor north wall completed" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Notes <span className="text-red-500">*</span></Label>
              <Textarea 
                id="description" 
                placeholder="Describe the work done today, materials used, any issues faced, or next steps..."
                className="min-h-[120px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="space-y-2">
              <Label>Photos & Videos</Label>
              <div 
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:bg-slate-900 transition-colors cursor-pointer group relative overflow-hidden"
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                <input 
                  type="file" 
                  id="photo-upload" 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/heic"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImageFile(file);
                  }}
                />
                
                {imageFile ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
                    <span className="font-medium text-emerald-700">{imageFile.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Click to replace</span>
                  </div>
                ) : (
                  <>
                    <div className="bg-amber-100 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="h-6 w-6 text-amber-600 dark:text-amber-500" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Click to upload photos</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">PNG, JPG, HEIC up to 10MB each</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" type="button" className="text-xs pointer-events-none">
                        <ImageIcon className="h-3 w-3 mr-2" /> Browse Files
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Customer will be notified automatically
              </div>
              <Button 
                onClick={handleSubmit} 
                className="bg-amber-600 hover:bg-amber-700 text-white min-w-[120px]"
                disabled={isSubmitting || projects.length === 0}
              >
                {isSubmitting ? "Publishing..." : "Publish Update"}
              </Button>
            </div>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
