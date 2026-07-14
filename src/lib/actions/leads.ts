"use server";

import { auth } from "@/lib/auth";
import { z } from "zod";
import * as leadService from "@/lib/services/lead.service";

const enquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  city: z.string().min(2),
  plotSize: z.string().optional(),
  builtUpArea: z.string().optional(),
  budgetRange: z.string().optional(),
  homeType: z.string().optional(),
  servicesNeeded: z.array(z.string()).optional(),
  timeline: z.string().optional(),
  preferredContact: z.string().optional(),
  notes: z.string().optional(),
});

export async function submitEnquiryAction(formData: z.infer<typeof enquirySchema>) {
  try {
    const result = await leadService.submitEnquiry(formData);
    return { success: true, data: result };
  } catch (error: any) {
    return { error: error.message || "Failed to submit enquiry. Please try again." };
  }
}

export async function getLeadsAction(status?: string, search?: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const data = await leadService.getLeads((session.user as any).role || "", status, search);
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch leads." };
  }
}

export async function updateLeadStatusAction(id: string, status: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const data = await leadService.updateLeadStatus((session.user as any).role || "", id, status);
    return { success: true, data };
  } catch (error: any) {
    console.error("Update lead error:", error);
    return { error: error.message || "Failed to update lead status." };
  }
}

export async function assignLeadAction(id: string, userId: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const data = await leadService.assignLead((session.user as any).role || "", id, userId);
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message || "Failed to assign lead." };
  }
}
