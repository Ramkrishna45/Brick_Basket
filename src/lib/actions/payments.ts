"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// ── Get Payment Milestones ──────────────────────────────────────────

export async function getPaymentMilestonesAction(projectId: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const milestones = await prisma.paymentMilestone.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
      include: {
        markedPaidBy: {
          select: { id: true, name: true, role: true }
        }
      }
    });

    const data = milestones.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    }));

    return { success: true, data };
  } catch {
    return { error: "Failed to fetch payment milestones." };
  }
}

// ── Get Payment Transactions ────────────────────────────────────────

export async function getPaymentTransactionsAction(projectId: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const transactions = await prisma.paymentTransaction.findMany({
      where: { projectId },
      orderBy: { date: "desc" },
      include: {
        recordedBy: {
          select: { id: true, name: true, role: true }
        }
      }
    });

    const data = transactions.map((t) => ({
      ...t,
      date: t.date.toISOString(),
    }));

    return { success: true, data };
  } catch {
    return { error: "Failed to fetch payment transactions." };
  }
}

// ── Get Payment Summary ─────────────────────────────────────────────

export async function getPaymentSummaryAction(projectId: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const milestones = await prisma.paymentMilestone.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
    });

    const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
    const paidAmount = milestones.reduce((sum, m) => sum + m.paidAmount, 0);
    const dueAmount = totalAmount - paidAmount;

    // Find the next pending/partial/overdue milestone
    const nextDue = milestones.find(
      (m) => m.status === "pending" || m.status === "partial" || m.status === "overdue"
    );

    return {
      success: true,
      data: {
        totalAmount,
        paidAmount,
        dueAmount,
        paidCount: milestones.filter((m) => m.status === "paid").length,
        totalCount: milestones.length,
        nextDue: nextDue
          ? {
              id: nextDue.id,
              name: nextDue.name,
              amount: nextDue.amount,
              dueDate: nextDue.dueDate,
            }
          : null,
      },
    };
  } catch {
    return { error: "Failed to calculate payment summary." };
  }
}

// ── Admin/Staff: Record Project Payment (Waterfall) ──────────────────────

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
    const now = new Date();
    const paidDateStr = now.toISOString().split("T")[0];

    // Use a transaction to ensure all updates happen together
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the PaymentTransaction record
      const transaction = await tx.paymentTransaction.create({
        data: {
          amount: data.amount,
          method: data.method,
          transactionId: data.transactionId || null,
          notes: data.notes || null,
          projectId: data.projectId,
          recordedById: userId,
        },
      });

      // 2. Fetch all milestones ordered by createdAt to distribute the payment
      const milestones = await tx.paymentMilestone.findMany({
        where: { projectId: data.projectId },
        orderBy: { createdAt: "asc" },
      });

      let remainingAmount = data.amount;

      // 3. Waterfall distribution
      for (const m of milestones) {
        if (remainingAmount <= 0) break;

        const unpaidOnMilestone = m.amount - m.paidAmount;
        if (unpaidOnMilestone <= 0) continue; // Already fully paid

        const amountToApply = Math.min(unpaidOnMilestone, remainingAmount);
        const newPaidAmount = m.paidAmount + amountToApply;
        const newStatus = newPaidAmount >= m.amount ? "paid" : "partial";
        
        await tx.paymentMilestone.update({
          where: { id: m.id },
          data: {
            paidAmount: newPaidAmount,
            status: newStatus,
            paidDate: newStatus === "paid" ? paidDateStr : m.paidDate,
            markedPaidById: userId,
          }
        });

        remainingAmount -= amountToApply;
      }

      // 4. Update the project's amountPaid cache
      const updatedMilestones = await tx.paymentMilestone.findMany({
        where: { projectId: data.projectId },
      });
      const totalPaid = updatedMilestones.reduce((sum, m) => sum + m.paidAmount, 0);

      await tx.project.update({
        where: { id: data.projectId },
        data: { amountPaid: totalPaid },
      });

      return transaction;
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Failed to record project payment:", error);
    return { error: "Failed to record payment." };
  }
}
