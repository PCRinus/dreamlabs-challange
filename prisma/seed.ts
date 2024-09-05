import { PrismaClient, Project } from '@prisma/client';
import { v5 as uuidv5 } from 'uuid';

const prisma = new PrismaClient();

const UUID_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341' as const;

const seed = async () => {
  const projectNames = ['Project 1', 'Project 2'];
  const projects: Project[] = projectNames.map((name) => ({
    id: uuidv5(name, UUID_NAMESPACE),
    name,
  }));

  await prisma.project.createMany({
    data: projects,
  });

  const customerNames = ['Bob', 'Alice', 'Charlie', 'David', 'Eve'];
  const customers = customerNames.map((name) => {
    return {
      id: uuidv5(name, UUID_NAMESPACE),
      name,
    };
  });
  await prisma.customer.createMany({
    data: customers,
  });
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
