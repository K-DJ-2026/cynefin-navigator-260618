import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.project.upsert({
    where: { id: "seed-cynefin-kickoff" },
    update: {
      workflowState: {
        upsert: {
          update: {},
          create: {
            currentStep: "situation"
          }
        }
      }
    },
    create: {
      id: "seed-cynefin-kickoff",
      name: "Cynefin Navigator Kickoff",
      description: "A starter project for validating the local MVP foundation.",
      status: "draft",
      workflowState: {
        create: {
          currentStep: "situation"
        }
      }
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
