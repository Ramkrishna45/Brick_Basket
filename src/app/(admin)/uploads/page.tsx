"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Upload, ImageIcon, X, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CONSTRUCTION_STAGES } from "@/lib/constants";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getAllProjectsAction } from "@/lib/actions/projects";
import { createProgressUpdateAction } from "@/lib/actions/progress";
import { uploadFileAction } from "@/lib/actions/upload";

type FormData = { project: string; title: string; description: string; stage: string };

export default function UploadsPage() {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<any[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  useEffect(() => {
    async function load() {
      const res = await getAllProjectsAction();
      if (res.success && res.data) {
        setProjects(res.data);
      }
    }
    load();
  }, []);

  async function onSubmit(data: FormData) {
    setLoading(true);

    const uploadedUrls: string[] = [];
    for (const file of photoFiles) {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await uploadFileAction(formData);
      if (uploadRes.success && uploadRes.url) {
        uploadedUrls.push(uploadRes.url);
      } else {
        toast.error(`Failed to upload ${file.name}: ${uploadRes.error || 'Unknown error'}`);
      }
    }

    const res = await createProgressUpdateAction({
      projectId: data.project,
      title: data.title,
      description: data.description,
      stage: data.stage,
      completionPercentage: 10, // Default or require from user? Hardcoding to 10 for now
      photos: uploadedUrls,
    });
    
    setLoading(false);
    if (res.success) {
      toast.success("Progress update uploaded successfully!");
      setRecentUpdates((prev) => [{ id: res.data?.id, title: data.title, date: new Date().toLocaleDateString(), photos: uploadedUrls, stage: data.stage }, ...prev].slice(0, 3));
      reset();
      setPhotoFiles([]);
    } else {
      toast.error(res.error || "Failed to upload progress");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (files.length > 0) {
      setPhotoFiles((prev) => [...prev, ...files.slice(0, 10 - prev.length)]);
      toast.success(`${files.length} photo(s) added`);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setPhotoFiles((prev) => [...prev, ...files.slice(0, 10 - prev.length)]);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Upload Progress</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Update your project with today&apos;s progress photos and notes</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">New Progress Update</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <Label>Select Project *</Label>
                <Select onValueChange={(v) => { if (v) setValue("project", v as string); }}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Choose project..." />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} — {p.customer?.name || "Unassigned"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="up-title">Update Title *</Label>
                <Input id="up-title" className="mt-1.5"
                  {...register("title", { required: "Title is required" })}
                  placeholder="e.g. East wall brick work completed" />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <Label htmlFor="up-desc">Description</Label>
                <Textarea id="up-desc" className="mt-1.5 resize-none" rows={4}
                  {...register("description")}
                  placeholder="Describe today's work in detail — what was done, quality checks, materials used, workers present..." />
              </div>

              <div>
                <Label>Current Stage *</Label>
                <Select onValueChange={(v) => { if (v) setValue("stage", v as string); }}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select construction stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONSTRUCTION_STAGES.map((s) => (
                      <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Photo upload */}
              <div>
                <Label className="mb-1.5 block">Upload Photos</Label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
                    dragOver ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40" : "border-slate-300 dark:border-slate-700 hover:border-amber-400 bg-slate-50 dark:bg-slate-900"
                  )}
                  onClick={() => document.getElementById("photo-input")?.click()}
                >
                  <Upload className={cn("h-8 w-8 mx-auto mb-3", dragOver ? "text-amber-500" : "text-slate-400")} />
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {dragOver ? "Drop photos here" : "Click to upload or drag & drop"}
                  </p>
                  <p className="text-xs text-slate-400">Max 10 photos · JPG, PNG, HEIC · Max 5MB each</p>
                  <input id="photo-input" type="file" multiple accept="image/*" className="hidden" onChange={handleFileInput} />
                </div>

                {/* Photo previews */}
                  {photoFiles.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-4">
                      {photoFiles.map((f, i) => (
                        <div key={i} className="relative aspect-square rounded-md overflow-hidden bg-slate-200 dark:bg-slate-800 group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={URL.createObjectURL(f)} alt="preview" className="object-cover w-full h-full" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPhotoFiles((prev) => prev.filter((_, index) => index !== i));
                            }} className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                          <X className="h-2.5 w-2.5 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 h-11 gap-2">
                {loading ? (
                  <><span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Uploading...</>
                ) : (
                  <><Upload className="h-4 w-4" /> Submit Progress Update</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent uploads */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentUpdates.length === 0 ? (
              <div className="text-sm text-slate-500 dark:text-slate-400 py-2">No recent updates.</div>
            ) : (
              recentUpdates.map((u) => (
                <div key={u.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{u.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{u.date} · {u.photos.length} photos</div>
                  </div>
                  <Badge className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 text-xs capitalize">{u.stage}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
