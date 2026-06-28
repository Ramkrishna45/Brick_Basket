"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type FormData = { email: string; password: string };

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials. Please try again.");
      } else {
        toast.success("Welcome back!");
        // Fetch session to determine role
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        const role = session?.user?.role;
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "engineer" || role === "contractor") {
          router.push("/staff/dashboard");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function quickLogin(email: string) {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password: "demo123",
        redirect: false,
      });

      if (result?.error) {
        toast.error("Demo login failed.");
      } else {
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        const role = session?.user?.role;
        toast.success(`Logged in as ${role}`);
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "engineer" || role === "contractor") {
          router.push("/staff/dashboard");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Welcome back</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Sign in to track your construction project</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" className="mt-1.5"
            {...register("email", { required: "Email is required", pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" } })}
            placeholder="you@example.com" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:text-amber-400">Forgot password?</Link>
          </div>
          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
              placeholder="Enter your password" />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 gap-2 h-11">
          {loading ? <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-slate-400">Quick Demo Login</span>
          <Separator className="flex-1" />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button variant="outline" onClick={() => quickLogin("customer@example.com")} disabled={loading}
            className="text-sm border-slate-300 dark:border-slate-700 hover:border-amber-400 hover:text-amber-700 dark:text-amber-400">
            👤 Customer Demo
          </Button>
          <Button variant="outline" onClick={() => quickLogin("admin@brickbasket.in")} disabled={loading}
            className="text-sm border-slate-300 dark:border-slate-700 hover:border-amber-400 hover:text-amber-700 dark:text-amber-400">
            🛡️ Admin Demo
          </Button>
          <Button variant="outline" onClick={() => quickLogin("arjun@brickbasket.in")} disabled={loading}
            className="text-sm border-slate-300 dark:border-slate-700 hover:border-amber-400 hover:text-amber-700 dark:text-amber-400">
            📐 Engineer Demo
          </Button>
          <Button variant="outline" onClick={() => quickLogin("ravi@brickbasket.in")} disabled={loading}
            className="text-sm border-slate-300 dark:border-slate-700 hover:border-amber-400 hover:text-amber-700 dark:text-amber-400">
            👷 Contractor Demo
          </Button>
        </div>
      </div>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-amber-600 dark:text-amber-500 font-medium hover:text-amber-700 dark:text-amber-400">Create one free</Link>
      </p>
    </div>
  );
}
