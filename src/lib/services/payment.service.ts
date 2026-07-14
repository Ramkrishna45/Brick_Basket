import { prisma } from "@/lib/db";

// ── Get Payment Milestones ──────────────────────────────────────────

export async function getPaymentMilestones(projectId: string) {
  const milestones = await prisma.paymentMilestone.findMany({
    where: { projectId },
    orderBy: { dueDate: "asc" },
    include: {
      markedPaidBy: {
        select: { id: true, name: true, role: true },
      },
    },
  });

  return milestones.map((m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
  }));
}

// ── Get Payment Transactions ────────────────────────────────────────

export async function getPaymentTransactions(projectId: string) {
  const transactions = await prisma.paymentTransaction.findMany({
    where: { projectId },
    orderBy: { date: "desc" },
    include: {
      recordedBy: {
        select: { id: true, name: true, role: true },
      },
    },
  });

  return transactions.map((t) => ({
    ...t,
    date: t.date.toISOString(),
  }));
}

// ── Get Payment Summary ─────────────────────────────────────────────

export async function getPaymentSummary(projectId: string) {
  const milestones = await prisma.paymentMilestone.findMany({
    where: { projectId },
    orderBy: { dueDate: "asc" },
  });

  const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
  const paidAmount = milestones.reduce((sum, m) => sum + m.paidAmount, 0);
  const dueAmount = totalAmount - paidAmount;

  // Find the next pending/partial/overdue milestone
  const nextDue = milestones.find(
    (m) => m.status === "pending" || m.status === "partial" || m.status === "overdue"
  );

  return {
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
  };
}

// ── Record Payment (Waterfall Distribution) ─────────────────────────

export async function recordPayment(
  data: {
    projectId: string;
    amount: number;
    method: string;
    transactionId?: string;
    notes?: string;
  },
  recordedById: string
) {
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
        recordedById,
      },
    });

    // 2. Fetch all milestones ordered by dueDate to distribute the payment sequentially
    const milestones = await tx.paymentMilestone.findMany({
      where: { projectId: data.projectId },
      orderBy: { dueDate: "asc" },
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
          markedPaidById: recordedById,
        },
      });

      remainingAmount -= amountToApply;
    }

    // 4. Update the project's amountPaid cache
    const updatedMilestones = await tx.paymentMilestone.findMany({
      where: { projectId: data.projectId },
    });
    const totalPaid = updatedMilestones.reduce(
      (sum, m) => sum + m.paidAmount,
      0
    );

    await tx.project.update({
      where: { id: data.projectId },
      data: { amountPaid: totalPaid },
    });

    return transaction;
  });

  return result;
}
