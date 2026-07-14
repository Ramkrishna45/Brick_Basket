"use server";

import { auth } from "@/lib/auth";
import * as paymentService from "@/lib/services/payment.service";

export async function getPaymentMilestonesAction(projectId: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const data = await paymentService.getPaymentMilestones(projectId);
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch payment milestones." };
  }
}

export async function getPaymentTransactionsAction(projectId: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const data = await paymentService.getPaymentTransactions(projectId);
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch payment transactions." };
  }
}

export async function getPaymentSummaryAction(projectId: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

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
    const session = await auth();
    if (!session) return { error: "Unauthorized" };
    
    const userRole = (session.user as any).role;
    if (userRole !== "admin" && userRole !== "engineer" && userRole !== "contractor") {
      return { error: "Forbidden" };
    }

    const userId = (session.user as any).id;
    const result = await paymentService.recordPayment(data, userId);

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Failed to record project payment:", error);
    return { error: error.message || "Failed to record payment." };
  }
}
