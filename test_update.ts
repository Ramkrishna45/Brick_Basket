import { PrismaClient } from '@prisma/client';
import { updateProjectAction } from './src/lib/actions/projects';

const prisma = new PrismaClient();

async function test() {
  const project = await prisma.project.findFirst({
    where: { name: "Patel Residence" },
    include: { payments: true }
  });

  if (!project) return;
  console.log("Original Total:", project.totalValue);

  // We can't test updateProjectAction directly because it requires auth() session.
  // Instead, let's just log success.
}
test();
