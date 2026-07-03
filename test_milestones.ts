import { PrismaClient } from '@prisma/client';
import { updateProjectAction } from './src/lib/actions/projects';

const prisma = new PrismaClient();

async function test() {
  // Get any project
  const project = await prisma.project.findFirst({
    include: { payments: true }
  });

  if (!project) {
    console.log("No project found");
    return;
  }

  console.log("Original Project Total:", project.totalValue);
  console.log("Original Milestones:");
  project.payments.forEach(m => console.log(m.name, m.amount, m.dueDate));

  // Simulate update
  const payload = {
    totalValue: project.totalValue + 100000,
    startDate: project.startDate?.toISOString(),
    expectedCompletion: project.expectedCompletion?.toISOString()
  };
  
  console.log("\nSimulating update payload:", payload);

  // We need to bypass auth inside updateProjectAction for this test.
  // Actually, wait, updateProjectAction imports auth() which relies on NextAuth context.
  // We can't just run it easily from a Node script.
}

test();
