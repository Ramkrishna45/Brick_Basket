"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast.success("OTP sent to your email!");
    setStep(2);
  }

  function handleOtpChange(i: number, val: string) {
    if (val.length > 1) return;
    const next = [...otp]; next[i] = val;
    setOtp(next);
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (otp.join("").length < 6) { toast.error("Please enter the complete OTP"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setStep(3);
  }

  async function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setStep(4);
    toast.success("Password reset successfully!");
  }

  return (
    <div>
      {step < 4 && (
        <>
          <Link href="/login" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-amber-600 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
          {/* Step dots */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className={cn("h-2 rounded-full transition-all", s === step ? "w-8 bg-amber-600" : s < step ? "w-2 bg-amber-400" : "w-2 bg-slate-200")} />
            ))}
          </div>
        </>
      )}

      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Forgot Password?</h1>
          <p className="text-slate-500 mb-8">Enter your email and we&apos;ll send you an OTP</p>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fp-email">Email Address</Label>
              <Input id="fp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5" placeholder="you@example.com" required />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 gap-2 h-11">
              {loading ? <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : <>Send OTP <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Enter OTP</h1>
          <p className="text-slate-500 mb-8">We sent a 6-digit code to <strong>{email}</strong></p>
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="flex gap-3 justify-center">
              {otp.map((digit, i) => (
                <Input key={i} id={`otp-${i}`} maxLength={1} value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-12 h-12 text-center text-lg font-bold p-0 focus:border-amber-500" />
              ))}
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 gap-2 h-11">
              {loading ? <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : <>Verify OTP <ArrowRight className="h-4 w-4" /></>}
            </Button>
            <p className="text-center text-sm text-slate-500">
              Didn&apos;t receive it?{" "}
              <button type="button" className="text-amber-600 font-medium hover:underline" onClick={() => toast.info("OTP resent!")}>Resend OTP</button>
            </p>
          </form>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">New Password</h1>
          <p className="text-slate-500 mb-8">Create a strong new password</p>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5" placeholder="Min 8 characters" required minLength={8} />
            </div>
            <div>
              <Label htmlFor="confirm-new-password">Confirm New Password</Label>
              <Input id="confirm-new-password" type="password" className="mt-1.5" placeholder="Re-enter password" required />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 gap-2 h-11">
              {loading ? <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : "Reset Password"}
            </Button>
          </form>
        </motion.div>
      )}

      {step === 4 && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Password Reset!</h1>
          <p className="text-slate-500 mb-6">Your password has been reset successfully.</p>
          <Button render={<Link href="/login" />} className="bg-amber-600 hover:bg-amber-700 gap-2">
            Back to Login <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
