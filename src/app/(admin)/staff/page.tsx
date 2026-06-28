"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Plus, Search, Mail, Phone, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getAllStaffAction, createStaffAction, updateStaffAction, deleteStaffAction } from "@/lib/actions/staff";

export default function StaffPage() {
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New staff form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "engineer"
  });

  // Edit staff form state
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    phone: "",
    role: ""
  });

  async function load() {
    setLoading(true);
    const res = await getAllStaffAction();
    if (res.success && res.data) {
      setStaff(res.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreateStaff() {
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }
    setIsSubmitting(true);
    const res = await createStaffAction(formData);
    if (res.success) {
      toast.success("Staff member created and credentials emailed!");
      setOpen(false);
      setFormData({ name: "", email: "", phone: "", role: "engineer" });
      load();
    } else {
      toast.error(res.error || "Failed to create staff");
    }
    setIsSubmitting(false);
  }

  function openEdit(s: any) {
    setEditData({
      id: s.id,
      name: s.name,
      phone: s.phone || "",
      role: s.role,
    });
    setEditOpen(true);
  }

  async function handleUpdateStaff() {
    if (!editData.name) {
      toast.error("Name is required");
      return;
    }
    setIsSubmitting(true);
    const res = await updateStaffAction(editData.id, {
      name: editData.name,
      phone: editData.phone,
      role: editData.role,
    });
    
    if (res.success) {
      toast.success("Staff member updated!");
      setEditOpen(false);
      load();
    } else {
      toast.error(res.error || "Failed to update staff");
    }
    setIsSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
    
    const res = await deleteStaffAction(id);
    if (res.success) {
      toast.success("Staff member deleted");
      load();
    } else {
      toast.error(res.error || "Failed to delete staff");
    }
  }

  const filtered = staff.filter(
    (s) =>
      search === "" ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Staff Management</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={
            <Button className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
              <Plus className="h-4 w-4" /> Add Staff Member
            </Button>
          } />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="e.g. rahul@brickbasket.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(val) => setFormData({ ...formData, role: val || "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineer">Engineer</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-amber-600 hover:bg-amber-700"
                  onClick={handleCreateStaff}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Staff"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Staff Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                placeholder="e.g. Rahul Sharma"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                placeholder="e.g. +91 9876543210"
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={editData.role}
                onValueChange={(val) => setEditData({ ...editData, role: val || "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineer">Engineer</SelectItem>
                  <SelectItem value="contractor">Contractor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={handleUpdateStaff}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          className="pl-9 bg-white dark:bg-slate-950"
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{s.name}</h3>
                    <Badge variant="outline" className="mt-1 bg-slate-50 dark:bg-slate-900 capitalize">
                      {s.role}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button onClick={() => openEdit(s)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-amber-600 dark:text-amber-500">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleDelete(s.id)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="truncate">{s.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{s.phone || "No phone added"}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Assigned Projects:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-full">
                    {s._count?.assignedProjects || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            No staff members found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
