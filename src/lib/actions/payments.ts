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
    const paidAmount = milestones
      .filter((m) => m.status === "paid")
      .reduce((sum, m) => sum + m.amount, 0);
    const dueAmount = totalAmount - paidAmount;

    // Find the next pending/overdue milestone
    const nextDue = milestones.find(
      (m) => m.status === "pending" || m.status === "overdue"
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

// ── Admin: Record Payment ───────────────────────────────────────────

export async function recordPaymentAction(milestoneId: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };
    if ((session.user as { role?: string }).role !== "admin")
      return { error: "Forbidden" };

    const now = new Date();
    const paidDate = now.toISOString().split("T")[0];

    const milestone = await prisma.paymentMilestone.update({
      where: { id: milestoneId },
      data: {
        status: "paid",
        paidDate,
      },
    });

    // Also update the project's amountPaid
    const allMilestones = await prisma.paymentMilestone.findMany({
      where: { projectId: milestone.projectId },
    });
    const totalPaid = allMilestones
      .filter((m) => m.status === "paid")
      .reduce((sum, m) => sum + m.amount, 0);

    await prisma.project.update({
      where: { id: milestone.projectId },
      data: { amountPaid: totalPaid },
    });

    return {
      success: true,
      data: { id: milestone.id, status: milestone.status, paidDate },
    };
  } catch {
    return { error: "Failed to record payment." };
  }
}
