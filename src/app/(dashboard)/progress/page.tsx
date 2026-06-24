"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Camera, User, Filter, ImageIcon, Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge, EmptyState } from "@/components/shared/states";
import { CONSTRUCTION_STAGES } from "@/lib/constants";
import { getMyProjectAction } from "@/lib/actions/projects";
import { getProgressUpdatesAction } from "@/lib/actions/progress";

export default function ProgressPage() {
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState<any[]>([]);
  const [stageFilter, setStageFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const pRes = await getMyProjectAction();
        if (pRes.success && pRes.data) {
          const uRes = await getProgressUpdatesAction(pRes.data.id);
          if (uRes.success && uRes.data) {
            setUpdates(uRes.data);
          }
        }
      } catch (err) {
        console.error("Failed to load progress updates", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = stageFilter === "all"
    ? updates
    : updates.filter((u) => u.stage === stageFilter);

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-56" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Daily Progress</h1>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <Select value={stageFilter} onValueChange={(v) => setStageFilter((v as string) ?? "all")}>
            <SelectTrigger className="w-48 bg-white">
              <SelectValue placeholder="Filter by stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {CONSTRUCTION_STAGES.map((s) => (
                <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {updates.length === 0 && stageFilter === "all" ? (
        <EmptyState
          icon={<Info className="h-8 w-8 text-slate-400" />}
          title="No progress updates yet"
          description="Progress updates will appear here once your engineer starts uploading them."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Camera className="h-8 w-8 text-slate-400" />}
          title="No updates for this stage"
          description="Progress updates for this construction stage will appear here once uploaded."
          action={{ label: "Show all updates", onClick: () => setStageFilter("all") }}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((update: any, i: number) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 mb-1">{update.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{update.description}</p>
                  </div>
                  <StatusBadge status={update.stage} />
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                  <span className="font-medium text-slate-600">{update.date}</span>
                  <span>{update.time}</span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />{update.uploadedBy?.name || "Engineer"}
                  </span>
                </div>
              </div>

              {/* Photos */}
              {update.photos && update.photos.length > 0 && (
                <div className="p-4 bg-slate-50">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {update.photos.map((url: string, j: number) => (
                      <div key={j} className="aspect-square rounded-lg overflow-hidden bg-slate-200 relative group cursor-pointer">
                        {url.startsWith("http") ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={url} alt="Progress" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center group-hover:from-amber-100 group-hover:to-amber-200 transition-all">
                            <ImageIcon className="h-5 w-5 text-slate-500 group-hover:text-amber-600 transition-colors" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
                    <Camera className="h-3 w-3" />
                    {update.photos.length} photo{update.photos.length !== 1 ? "s" : ""} uploaded
                  </div>
                </div>
              )}

              {/* Progress bar */}
              <div className="px-4 sm:px-5 py-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span>Project completion at this update</span>
                  <span className="font-semibold text-amber-600">{update.completionPercentage || 0}%</span>
                </div>
                <Progress value={update.completionPercentage || 0} className="h-1.5" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
