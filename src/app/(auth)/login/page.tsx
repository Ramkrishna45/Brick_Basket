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
import { verifyCredentialsAndSendOtpAction } from "@/lib/actions/auth";

type FormData = { email: string; password: string; otp?: string };

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      if (step === 1) {
        const res = await verifyCredentialsAndSendOtpAction(data.email, data.password);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("OTP sent to your email!");
          setStep(2);
        }
      } else {
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          otp: data.otp,
          redirect: false,
        });

        if (result?.error) {
          toast.error("Invalid OTP. Please try again.");
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
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Demo login removed as per request

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Welcome back</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Sign in to track your construction project</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className={step === 2 ? "hidden" : "space-y-4"}>
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
        </div>

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <Label htmlFor="otp">One-Time Password (OTP)</Label>
              <Input id="otp" type="text" className="mt-1.5 tracking-[0.2em] font-mono text-center text-lg"
                {...register("otp", { required: "OTP is required", minLength: { value: 6, message: "Enter the 6-digit code" } })}
                placeholder="123456" maxLength={6} />
              {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>}
              <p className="text-xs text-slate-500 mt-2 text-center">We've sent a 6-digit code to your email.</p>
            </div>
            <button type="button" onClick={() => setStep(1)} className="text-xs text-amber-600 w-full text-center hover:underline">
              Back to login
            </button>
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 gap-2 h-11">
          {loading ? <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : 
           <>{step === 1 ? "Continue" : "Verify & Sign In"} <ArrowRight className="h-4 w-4" /></>}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-slate-400 uppercase tracking-wider">Or continue with</span>
          <Separator className="flex-1" />
        </div>
        <div className="mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full h-11 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
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
