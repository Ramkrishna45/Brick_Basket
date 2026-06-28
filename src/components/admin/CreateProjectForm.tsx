"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { createProjectAction } from "@/lib/actions/projects";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  siteAddress: z.string().min(1, "Site address is required"),
  city: z.string().min(1, "City is required"),
  plotSize: z.string().min(1, "Plot size is required"),
  builtUpArea: z.string().min(1, "Built-up area is required"),
  totalValue: z.number().min(0, "Total value must be positive"),
  startDate: z.string().min(1, "Start date is required"),
  expectedCompletion: z.string().min(1, "Expected completion is required"),
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(10, "Valid phone is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateProjectFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateProjectForm({ onSuccess, onCancel }: CreateProjectFormProps) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      siteAddress: "",
      city: "",
      plotSize: "",
      builtUpArea: "",
      totalValue: 0,
      startDate: "",
      expectedCompletion: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setLoading(true);
    const res = await createProjectAction(data);
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Project created successfully!");
      if (onSuccess) onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 text-sm font-semibold text-slate-900 dark:text-slate-100 border-b pb-2">
          Project Details
        </div>
        
        <div className="md:col-span-2 space-y-2">
          <Label>Project Name</Label>
          <Input placeholder="e.g. Sharma Villa" {...register("name")} />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Site Address</Label>
          <Input placeholder="123 Main St" {...register("siteAddress")} />
          {errors.siteAddress && <p className="text-xs text-red-500">{errors.siteAddress.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>City</Label>
          <Input placeholder="Bangalore" {...register("city")} />
          {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Plot Size (sq.ft)</Label>
          <Input placeholder="2400" {...register("plotSize")} />
          {errors.plotSize && <p className="text-xs text-red-500">{errors.plotSize.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Built-up Area (sq.ft)</Label>
          <Input placeholder="1800" {...register("builtUpArea")} />
          {errors.builtUpArea && <p className="text-xs text-red-500">{errors.builtUpArea.message}</p>}
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label>Total Cost (₹)</Label>
          <Input type="number" placeholder="5000000" {...register("totalValue", { valueAsNumber: true })} />
          {errors.totalValue && <p className="text-xs text-red-500">{errors.totalValue.message}</p>}
        </div>

        <div className="md:col-span-2 text-sm font-semibold text-slate-900 dark:text-slate-100 border-b pb-2 mt-4">
          Timeline
        </div>

        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input type="date" {...register("startDate")} />
          {errors.startDate && <p className="text-xs text-red-500">{errors.startDate.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Expected Completion</Label>
          <Input type="date" {...register("expectedCompletion")} />
          {errors.expectedCompletion && <p className="text-xs text-red-500">{errors.expectedCompletion.message}</p>}
        </div>

        <div className="md:col-span-2 text-sm font-semibold text-slate-900 dark:text-slate-100 border-b pb-2 mt-4">
          Customer Details
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label>Customer Name</Label>
          <Input placeholder="Full Name" {...register("customerName")} />
          {errors.customerName && <p className="text-xs text-red-500">{errors.customerName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Email Address</Label>
          <Input type="email" placeholder="customer@example.com" {...register("customerEmail")} />
          {errors.customerEmail && <p className="text-xs text-red-500">{errors.customerEmail.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input placeholder="+91 9876543210" {...register("customerPhone")} />
          {errors.customerPhone && <p className="text-xs text-red-500">{errors.customerPhone.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white" disabled={loading}>
          {loading ? "Creating..." : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
