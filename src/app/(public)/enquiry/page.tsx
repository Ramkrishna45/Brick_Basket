"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CheckCircle2, ArrowRight, ArrowLeft, Phone, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BUDGET_RANGES, HOME_TYPES, TIMELINE_OPTIONS, SERVICES_LIST } from "@/lib/constants";
import { submitEnquiryAction } from "@/lib/actions/leads";

type Step1 = { name: string; phone: string; email: string; city: string };
type Step2 = { plotSize: string; builtUpArea: string; budgetRange: string; homeType: string; timeline: string };

export default function EnquiryPage() {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1 | null>(null);
  const [step2Data, setStep2Data] = useState<Step2 | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [contact, setContact] = useState("phone");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const form1 = useForm<Step1>();
  const form2 = useForm<Step2>();

  const steps = ["Personal Details", "Home Requirements", "Preferences"];

  async function handleStep1(data: Step1) {
    setStep1Data(data);
    setStep(2);
  }

  async function handleStep2(data: Step2) {
    setStep2Data(data);
    setStep(3);
  }

  async function handleSubmit() {
    if (!step1Data || !step2Data) return;
    
    setLoading(true);
    
    const res = await submitEnquiryAction({
      name: step1Data.name,
      phone: step1Data.phone,
      email: step1Data.email,
      city: step1Data.city,
      plotSize: step2Data.plotSize,
      builtUpArea: step2Data.builtUpArea,
      budgetRange: step2Data.budgetRange,
      homeType: step2Data.homeType,
      timeline: step2Data.timeline,
      servicesNeeded: selected,
      preferredContact: contact,
      notes: notes,
    });
    
    setLoading(false);
    
    if (res.success) {
      setSubmitted(true);
      toast.success("Enquiry submitted! We'll contact you within 24 hours.");
    } else {
      toast.error(res.error || "Failed to submit enquiry.");
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 px-4 bg-slate-50 dark:bg-slate-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-center max-w-md"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">Enquiry Submitted!</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-2">
            Thank you, <strong>{step1Data?.name}</strong>! We&apos;ve received your enquiry.
          </p>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Our team will contact you on <strong>{step1Data?.phone}</strong> within 24 hours.
          </p>
          <Badge className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 text-sm py-1.5 px-4">
            Reference ID: BRK-{Date.now().toString().slice(-6)}
          </Badge>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <Badge className="mb-3 bg-amber-600/20 text-amber-300 border-amber-600/30">Free Consultation</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Tell Us About Your Dream Home</h1>
          <p className="text-slate-400">We&apos;ll get back to you within 24 hours with a tailored plan.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all",
                  i + 1 < step ? "bg-emerald-500 border-emerald-500 text-white"
                    : i + 1 === step ? "bg-amber-600 border-amber-600 text-white"
                    : "bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-400"
                )}>
                  {i + 1 < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span className={cn("text-xs mt-1.5 font-medium hidden sm:block",
                  i + 1 === step ? "text-amber-700 dark:text-amber-400" : i + 1 < step ? "text-emerald-600" : "text-slate-400"
                )}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn("flex-1 h-0.5 mx-2 transition-colors",
                  i + 1 < step ? "bg-emerald-400" : "bg-slate-200 dark:bg-slate-800"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <motion.div
          key={step}
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -30, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm"
        >
          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={form1.handleSubmit(handleStep1)} className="space-y-5">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Personal Details</h2>
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" {...form1.register("name", { required: "Name is required" })}
                  placeholder="e.g. Vikram Patel" className="mt-1.5" />
                {form1.formState.errors.name && <p className="text-red-500 text-xs mt-1">{form1.formState.errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="flex mt-1.5">
                  <span className="flex items-center px-3 bg-slate-100 dark:bg-slate-900 border border-r-0 border-slate-300 dark:border-slate-700 rounded-l-md text-sm text-slate-600 dark:text-slate-400">+91</span>
                  <Input id="phone" {...form1.register("phone", { required: "Phone is required", pattern: { value: /^[6-9]\d{9}$/, message: "Enter valid 10-digit number" } })}
                    placeholder="98765 43210" className="rounded-l-none" />
                </div>
                {form1.formState.errors.phone && <p className="text-red-500 text-xs mt-1">{form1.formState.errors.phone.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" {...form1.register("email", { required: "Email is required", pattern: { value: /\S+@\S+\.\S+/, message: "Enter valid email" } })}
                  placeholder="you@example.com" className="mt-1.5" />
                {form1.formState.errors.email && <p className="text-red-500 text-xs mt-1">{form1.formState.errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="city">City / Location *</Label>
                <Input id="city" {...form1.register("city", { required: "City is required" })}
                  placeholder="e.g. Bengaluru" className="mt-1.5" />
                {form1.formState.errors.city && <p className="text-red-500 text-xs mt-1">{form1.formState.errors.city.message}</p>}
              </div>
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 gap-2 mt-2">
                Next Step <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={form2.handleSubmit(handleStep2)} className="space-y-5">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Home Requirements</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plotSize">Plot Size</Label>
                  <Input id="plotSize" {...form2.register("plotSize")} placeholder="e.g. 2,400 sq.ft" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="builtUpArea">Built-up Area</Label>
                  <Input id="builtUpArea" {...form2.register("builtUpArea")} placeholder="e.g. 1,800 sq.ft" className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label>Budget Range *</Label>
                <Select onValueChange={(v) => { if (v) form2.setValue("budgetRange", v as string); }}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select your budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUDGET_RANGES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Type of Home *</Label>
                <Select onValueChange={(v) => { if (v) form2.setValue("homeType", v as string); }}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select home type" />
                  </SelectTrigger>
                  <SelectContent>
                    {HOME_TYPES.map((h) => <SelectItem key={h.value} value={h.value}>{h.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>When do you want to start? *</Label>
                <Select onValueChange={(v) => { if (v) form2.setValue("timeline", v as string); }}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMELINE_OPTIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 mt-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 gap-2">
                  Next Step <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Preferences</h2>
              <div>
                <Label className="mb-3 block">Services Needed</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SERVICES_LIST.map((s) => (
                    <label key={s.id} className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors text-sm",
                      selected.includes(s.id) ? "border-amber-400 bg-amber-50 dark:bg-amber-950/40" : "border-slate-200 dark:border-slate-800 hover:border-amber-300"
                    )}>
                      <Checkbox
                        checked={selected.includes(s.id)}
                        onCheckedChange={(c) => setSelected(c ? [...selected, s.id] : selected.filter((i) => i !== s.id))}
                        className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                      />
                      <span className="text-slate-700 dark:text-slate-300">{s.title}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-3 block">Preferred Contact Method</Label>
                <div className="flex gap-3">
                  {[
                    { value: "phone", icon: Phone, label: "Phone Call" },
                    { value: "email", icon: Mail, label: "Email" },
                    { value: "whatsapp", icon: MessageSquare, label: "WhatsApp" },
                  ].map(({ value, icon: Icon, label }) => (
                    <button key={value} type="button" onClick={() => setContact(value)}
                      className={cn("flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all",
                        contact === value ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400" : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-amber-300"
                      )}>
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific requirements, questions, or preferences..." className="mt-1.5 resize-none" rows={3} />
              </div>
              <div className="flex gap-3 mt-2">
                <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button onClick={handleSubmit} disabled={loading} className="flex-1 bg-amber-600 hover:bg-amber-700 gap-2">
                  {loading ? (
                    <><span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Submitting...</>
                  ) : (
                    <>Submit Enquiry <ArrowRight className="h-4 w-4" /></>
                  )}
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        <p className="text-center text-xs text-slate-400 mt-6">
          🔒 Your information is safe with us. We never share your data.
        </p>
      </div>
    </div>
  );
}
