import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const milestones = await prisma.paymentMilestone.findMany({
    where: { status: "paid" },
    include: { project: true }
  });
  
  console.log(`Found ${milestones.length} paid milestones.`);
  milestones.forEach(m => {
    if (m.paidAmount === 0 && m.amount > 0) {
      console.log(`BUG? Project: ${m.project.name} | Milestone: ${m.name} | Target: ${m.amount} | Paid: ${m.paidAmount} | Status: ${m.status}`);
    }
  });
}
main().finally(() => prisma.$disconnect());
