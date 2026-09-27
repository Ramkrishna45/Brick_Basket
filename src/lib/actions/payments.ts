"use server";

import { auth } from "@/lib/auth";
import * as paymentService from "@/lib/services/payment.service";
import { getProjectById } from "@/lib/services/project.service";
import { requireRole, checkProjectAccess } from "@/lib/rbac";

export async function getPaymentMilestonesAction(projectId: string) {
  try {
    const { authorized, user, error } = await requireRole(["admin", "engineer", "contractor", "customer"]);
    if (!authorized) return { error };

    const project = await getProjectById(projectId);
    const access = checkProjectAccess(user.id, (user as any).role, project);
    if (!access.authorized) return { error: access.error };

    const data = await paymentService.getPaymentMilestones(projectId);
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch payment milestones." };
  }
}

export async function getPaymentTransactionsAction(projectId: string) {
  try {
    const { authorized, user, error } = await requireRole(["admin", "engineer", "contractor", "customer"]);
    if (!authorized) return { error };

    const project = await getProjectById(projectId);
    const access = checkProjectAccess(user.id, (user as any).role, project);
    if (!access.authorized) return { error: access.error };

    const data = await paymentService.getPaymentTransactions(projectId);
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch payment transactions." };
  }
}

export async function getPaymentSummaryAction(projectId: string) {
  try {
    const { authorized, user, error } = await requireRole(["admin", "engineer", "contractor", "customer"]);
    if (!authorized) return { error };

    const project = await getProjectById(projectId);
    const access = checkProjectAccess(user.id, (user as any).role, project);
    if (!access.authorized) return { error: access.error };

    const data = await paymentService.getPaymentSummary(projectId);
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message || "Failed to calculate payment summary." };
  }
}

export async function recordProjectPaymentAction(data: {
  projectId: string;
  amount: number;
  method: string;
  transactionId?: string;
  notes?: string;
}) {
  try {
    const { authorized, user, error } = await requireRole(["admin", "engineer", "contractor"]);
    if (!authorized) return { error };

    if (!data.amount || data.amount <= 0) return { error: "Amount must be positive" };

    const project = await getProjectById(data.projectId);
    const access = checkProjectAccess(user.id, (user as any).role, project);
    if (!access.authorized) return { error: access.error };

    const result = await paymentService.recordPayment(data, user.id);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Failed to record project payment:", error);
    return { error: error.message || "Failed to record payment." };
  }
}
