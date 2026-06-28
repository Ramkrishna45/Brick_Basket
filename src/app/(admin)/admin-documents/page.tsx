"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  FileText, Upload, Plus, Trash2, Download, Eye, 
  Search, Filter, CheckCircle2, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import { getAllProjectsAction } from "@/lib/actions/projects";
import { getAllDocumentsAction, uploadDocumentAction, deleteDocumentAction } from "@/lib/actions/documents";
import { uploadFileAction } from "@/lib/actions/upload";

const CATEGORIES = [
  { value: "agreement", label: "Agreements" },
  { value: "plan", label: "Plans" },
  { value: "receipt", label: "Receipts" },
  { value: "certificate", label: "Certificates" },
  { value: "government", label: "Government" },
  { value: "other", label: "Other" },
];

export default function AdminDocumentsPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [projectId, setProjectId] = useState("");

  const loadData = async () => {
    setLoading(true);
    const [pRes, dRes] = await Promise.all([
      getAllProjectsAction(),
      getAllDocumentsAction()
    ]);
    
    if (pRes.success) setProjects(pRes.data || []);
    if (dRes.success) setDocuments(dRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpload = async () => {
    if (!file || !name || !category || !projectId) {
      toast.error("Please fill in all required fields and select a file");
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const uploadRes = await uploadFileAction(formData);
      if (uploadRes.error) {
        toast.error(uploadRes.error);
        setIsUploading(false);
        return;
      }

      if (uploadRes.url) {
        const docRes = await uploadDocumentAction({
          name,
          category,
          projectId,
          url: uploadRes.url,
          fileType: file.name.split('.').pop() || "unknown",
          fileSize: (file.size / (1024 * 1024)).toFixed(2) + " MB"
        });

        if (docRes.error) {
          toast.error(docRes.error);
        } else {
          toast.success("Document uploaded successfully");
          setIsUploadOpen(false);
          setFile(null);
          setName("");
          setCategory("");
          setProjectId("");
          loadData();
        }
      }
    } catch (e) {
      toast.error("An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    
    const res = await deleteDocumentAction(id);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Document deleted");
      loadData();
    }
  };

  const filteredDocs = documents.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                          d.project?.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || d.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Document Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all project documents and files</p>
        </div>
        
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger render={
            <Button className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          } />
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Project <span className="text-red-500">*</span></Label>
                <Select value={projectId} onValueChange={(val) => setProjectId(val || "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name} ({p.customer?.name})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Document Name <span className="text-red-500">*</span></Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Final Floor Plan" />
              </div>

              <div className="space-y-2">
                <Label>Category <span className="text-red-500">*</span></Label>
                <Select value={category} onValueChange={(val) => setCategory(val || "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>File <span className="text-red-500">*</span></Label>
                <div 
                  className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('doc-upload')?.click()}
                >
                  <input 
                    type="file" 
                    id="doc-upload" 
                    className="hidden" 
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setFile(f);
                    }}
                  />
                  {file ? (
                    <div className="flex flex-col items-center">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
                      <span className="font-medium text-emerald-700">{file.name}</span>
                      <span className="text-xs text-slate-500 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                  ) : (
                    <>
                      <div className="bg-amber-100 p-3 rounded-full mb-3">
                        <Upload className="h-6 w-6 text-amber-600" />
                      </div>
                      <h3 className="font-medium text-slate-900 text-sm">Click to select file</h3>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsUploadOpen(false)} disabled={isUploading}>Cancel</Button>
              <Button onClick={handleUpload} className="bg-amber-600 hover:bg-amber-700 text-white" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search documents or projects..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val || "")}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Document</th>
                  <th className="px-6 py-4 font-medium">Project</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Details</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <FileText className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                      <p>No documents found matching your criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc, i) => (
                    <motion.tr 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      key={doc.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{doc.name}</p>
                            <p className="text-xs text-slate-500 uppercase">{doc.fileType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{doc.project?.name}</p>
                        <p className="text-xs text-slate-500">{doc.project?.customer?.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="bg-white capitalize">{doc.category}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-900">{new Date(doc.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-slate-500">{doc.fileSize} • by {doc.uploadedBy}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button render={<a href={doc.url} target="_blank" rel="noopener noreferrer" />} variant="ghost" size="icon" className="h-8 w-8 hover:text-amber-600" title="Preview">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button render={<a href={doc.url} download />} variant="ghost" size="icon" className="h-8 w-8 hover:text-amber-600" title="Download">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleDelete(doc.id)} variant="ghost" size="icon" className="h-8 w-8 hover:text-red-600 hover:bg-red-50" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
