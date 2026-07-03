"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpAction, verifySignupOtpAction } from "@/lib/actions/auth";

type FormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  otp?: string;
};

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const password = watch("password");

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      if (step === 1) {
        const result = await signUpAction({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
        });

        if ("error" in result && result.error) {
          toast.error(result.error);
          return;
        }

        if (result.requireOtp) {
          toast.success("Account created! Please verify your email.");
          setStep(2);
        } else {
          // Fallback if no OTP required (legacy)
          await signIn("credentials", {
            email: data.email,
            password: data.password,
            callbackUrl: "/dashboard",
          });
        }
      } else {
        // Step 2: Verify OTP
        const verifyResult = await verifySignupOtpAction(data.email, data.otp || "");
        if (verifyResult.error) {
          toast.error(verifyResult.error);
          return;
        }
        
        toast.success("Email verified successfully!");
        
        // Auto sign-in after successful verification
        const signInResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.error) {
          toast.success("Please log in with your credentials.");
          router.push("/login");
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Create Account</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Start tracking your home construction</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className={step === 2 ? "hidden" : "space-y-4"}>
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" className="mt-1.5"
              {...register("name", { required: "Name is required", minLength: { value: 2, message: "Min 2 characters" } })}
              placeholder="Enter your full name" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" className="mt-1.5"
              {...register("email", { required: "Email is required", pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" } })}
              placeholder="you@example.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" className="mt-1.5"
              {...register("phone", { required: "Phone is required", pattern: { value: /^[6-9]\d{9}$/, message: "Enter valid 10-digit number" } })}
              placeholder="9876543210" />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1.5">
              <Input id="password" type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
                placeholder="Create a password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative mt-1.5">
              <Input id="confirmPassword" type={showPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Confirm password",
                  validate: (val) => val === password || "Passwords do not match",
                })}
                placeholder="Confirm your password" />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
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
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 gap-2 h-11 mt-4">
          {loading ? <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : 
           <>{step === 1 ? "Create Account" : "Verify & Log In"} <ArrowRight className="h-4 w-4" /></>}
        </Button>

        <div className="flex items-start gap-2 pt-1">
          <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            By creating an account, you agree to our{" "}
            <Link href="#" className="text-amber-600 dark:text-amber-500 hover:underline">Terms</Link> and{" "}
            <Link href="#" className="text-amber-600 dark:text-amber-500 hover:underline">Privacy Policy</Link>.
          </p>
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 gap-2 h-11">
          {loading ? <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : <>Create Account <ArrowRight className="h-4 w-4" /></>}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          <span className="text-xs text-slate-400 uppercase tracking-wider">Or continue with</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
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
        Already have an account?{" "}
        <Link href="/login" className="text-amber-600 dark:text-amber-500 font-medium hover:text-amber-700 dark:text-amber-400">Sign in</Link>
      </p>
    </div>
  );
}
