import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  const projects = await prisma.project.findMany({
    include: { payments: true }
  });

  for (const p of projects) {
    console.log(`Project: ${p.name} (Total Value: ${p.totalValue})`);
    console.log(`Milestones:`);
    p.payments.forEach(m => console.log(` - [${m.status}] ${m.name}: ${m.amount} (Due: ${m.dueDate})`));
    console.log("---");
  }
}

test()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
