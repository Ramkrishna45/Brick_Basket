import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { payments: true }
  });
  
  for (const p of projects) {
    console.log(`\nProject: ${p.name} (Total Value: ${p.totalValue})`);
    console.log("Milestones:");
    if (p.payments.length > 0) {
      p.payments.forEach(m => {
        console.log(`  - ${m.name}: Target=${m.amount}, Paid=${m.paidAmount}, Status=${m.status}`);
      });
    } else {
      console.log("  No payment milestones.");
    }
  }
}
main().finally(() => prisma.$disconnect());
