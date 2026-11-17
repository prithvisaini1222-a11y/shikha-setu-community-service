import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'aarav.learner@shikshasetu.org' } });
  console.log('Learner user:', user?.name, user?.id);
  const learner = await prisma.learner.findFirst({ where: { userId: user?.id } });
  console.log('Learner profile:', learner?.displayName, 'Current ClassLevel:', learner?.classLevel);

  for (const c of [6, 7, 8, 9, 10]) {
    const classData = await prisma.class.findUnique({
      where: { classNumber: c },
      include: { subjects: { include: { chapters: true } } }
    });
    console.log(`Class ${c}: ${classData?.subjects?.length} subjects: ${classData?.subjects?.map(s => `${s.name} (${s.chapters.length} ch)`).join(', ')}`);
  }
  await prisma.$disconnect();
}

main().catch(console.error);
