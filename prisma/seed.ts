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
  const customerIds = (
    await prisma.customer.createManyAndReturn({
      data: customers,
    })
  ).map((customer) => customer.id);

  await prisma.invoice.create({
    data: {
      amount: 1000,
      currency: 'RON',
      dueDate: new Date('2024-10-01'),
      type: 'INVOICE',
      customerId: customerIds[0],
    },
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
