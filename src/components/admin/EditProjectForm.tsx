"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { updateProjectAction } from "@/lib/actions/projects";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const editFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  siteAddress: z.string().min(1, "Site address is required"),
  city: z.string().min(1, "City is required"),
  plotSize: z.string().min(1, "Plot size is required"),
  builtUpArea: z.string().min(1, "Built-up area is required"),
  totalValue: z.number().min(0, "Total value must be positive"),
  startDate: z.string().min(1, "Start date is required"),
  expectedCompletion: z.string().min(1, "Expected completion is required"),
});

type EditFormValues = z.infer<typeof editFormSchema>;

interface EditProjectFormProps {
  project: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditProjectForm({ project, onSuccess, onCancel }: EditProjectFormProps) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: project.name || "",
      siteAddress: project.siteAddress || "",
      city: project.city || "",
      plotSize: project.plotSize || "",
      builtUpArea: project.builtUpArea || "",
      totalValue: project.totalValue || 0,
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : "",
      expectedCompletion: project.expectedCompletion ? new Date(project.expectedCompletion).toISOString().split('T')[0] : "",
    },
  });

  async function onSubmit(data: EditFormValues) {
    setLoading(true);
    const res = await updateProjectAction(project.id, data);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Project updated successfully!");
      if (onSuccess) onSuccess();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Project Name</Label>
          <Input id="name" {...register("name")} placeholder="e.g., The Sapphire Villa" />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="totalValue">Total Cost (₹)</Label>
          <Input 
            id="totalValue" 
            type="number" 
            {...register("totalValue", { valueAsNumber: true })} 
            placeholder="e.g., 5000000" 
          />
          {errors.totalValue && <p className="text-red-500 text-xs">{errors.totalValue.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register("city")} placeholder="e.g., Mumbai" />
          {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="siteAddress">Site Address</Label>
          <Input id="siteAddress" {...register("siteAddress")} placeholder="Full address" />
          {errors.siteAddress && <p className="text-red-500 text-xs">{errors.siteAddress.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="plotSize">Plot Size</Label>
          <Input id="plotSize" {...register("plotSize")} placeholder="e.g., 2000 sq ft" />
          {errors.plotSize && <p className="text-red-500 text-xs">{errors.plotSize.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="builtUpArea">Built-Up Area</Label>
          <Input id="builtUpArea" {...register("builtUpArea")} placeholder="e.g., 1800 sq ft" />
          {errors.builtUpArea && <p className="text-red-500 text-xs">{errors.builtUpArea.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="startDate">Start Date</Label>
          <Input id="startDate" type="date" {...register("startDate")} />
          {errors.startDate && <p className="text-red-500 text-xs">{errors.startDate.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="expectedCompletion">Expected Completion</Label>
          <Input id="expectedCompletion" type="date" {...register("expectedCompletion")} />
          {errors.expectedCompletion && <p className="text-red-500 text-xs">{errors.expectedCompletion.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700 text-white min-w-[120px]">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
