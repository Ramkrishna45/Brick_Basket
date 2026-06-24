"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Download, Eye, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileTypeIcon, EmptyState, StatusBadge } from "@/components/shared/states";
import { getMyProjectAction } from "@/lib/actions/projects";
import { getDocumentsAction } from "@/lib/actions/documents";

const CATEGORIES: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "agreement", label: "Agreements" },
  { value: "plan", label: "Plans" },
  { value: "receipt", label: "Receipts" },
  { value: "certificate", label: "Certificates" },
  { value: "government", label: "Government" },
];

export default function DocumentsPage() {
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const pRes = await getMyProjectAction();
        if (pRes.success && pRes.data) {
          const dRes = await getDocumentsAction(pRes.data.id);
          if (dRes.success && dRes.data) {
            setDocuments(dRes.data);
          }
        }
      } catch (err) {
        console.error("Failed to load documents", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = tab === "all" ? documents : documents.filter((d) => d.category === tab);

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 rounded-lg" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Documents</h1>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-white border border-slate-200 h-auto flex-wrap gap-1 p-1.5">
          {CATEGORIES.map((cat) => {
            const count = cat.value === "all" ? documents.length : documents.filter((d) => d.category === cat.value).length;
            return (
              <TabsTrigger key={cat.value} value={cat.value}
                className="data-[state=active]:bg-amber-600 data-[state=active]:text-white rounded-md px-3 py-1.5 text-sm">
                {cat.label} {count > 0 && <span className="ml-1.5 text-xs opacity-70">({count})</span>}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {CATEGORIES.map((cat) => (
          <TabsContent key={cat.value} value={cat.value} className="mt-4">
            {filtered.length === 0 ? (
              <EmptyState
                icon={<FileText className="h-8 w-8 text-slate-400" />}
                title="No documents yet"
                description="Documents in this category will appear here when uploaded by the team."
              />
            ) : (
              <div className="space-y-3">
                {filtered.map((doc: any, i: number) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-sm transition-all group"
                  >
                    <FileTypeIcon type={doc.fileType} className="h-11 w-11" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900 text-sm truncate">{doc.name}</div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 flex-wrap">
                        <span>{new Date(doc.uploadDate || doc.createdAt).toLocaleDateString()}</span>
                        <span>{doc.fileSize}</span>
                        <span>by {doc.uploadedBy || "System"}</span>
                      </div>
                    </div>
                    <StatusBadge status={doc.category} />
                    <div className="flex gap-2 flex-shrink-0">
                      <Button render={<a href={doc.url} target="_blank" rel="noopener noreferrer" />} variant="ghost" size="icon" className="h-8 w-8 hover:text-amber-600 hover:bg-amber-50" title="Preview">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button render={<a href={doc.url} download />} variant="ghost" size="icon" className="h-8 w-8 hover:text-amber-600 hover:bg-amber-50" title="Download">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
