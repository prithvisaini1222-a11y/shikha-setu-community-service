import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  const vid = await prisma.learningVideo.findFirst();
  console.log('Sample LearningVideo from DB:');
  console.log(vid);
}

test().finally(() => prisma.$disconnect());

