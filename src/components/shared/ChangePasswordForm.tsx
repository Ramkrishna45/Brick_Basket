"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordAction } from "@/lib/actions/auth";

export function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    
    setLoading(true);
    const res = await changePasswordAction(oldPassword, newPassword);
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-amber-100 p-2 rounded-lg text-amber-700">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Change Password</h3>
          <p className="text-sm text-slate-500">Update your account password</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="old-password">Current Password</Label>
          <div className="relative mt-1.5">
            <Input 
              id="old-password" 
              type={showOld ? "text" : "password"} 
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="new-password">New Password</Label>
          <div className="relative mt-1.5">
            <Input 
              id="new-password" 
              type={showNew ? "text" : "password"} 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <div className="relative mt-1.5">
            <Input 
              id="confirm-password" 
              type={showNew ? "text" : "password"} 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white mt-2">
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}
