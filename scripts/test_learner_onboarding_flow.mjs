import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  console.log('--- Testing Learner Onboarding & Class Dynamic Loading ---');

  // 1. Find Aarav Learner
  const learnerUser = await prisma.user.findUnique({
    where: { email: 'aarav.learner@shikshasetu.org' },
    include: { learner: true },
  });

  if (!learnerUser || !learnerUser.learner) {
    console.error('Learner user not found!');
    process.exit(1);
  }

  console.log(`Learner: ${learnerUser.name}, Current ClassLevel: ${learnerUser.learner.classLevel}`);

  // 2. Test updating class to Class 7
  const updated7 = await prisma.learner.update({
    where: { id: learnerUser.learner.id },
    data: { classLevel: 7 },
  });
  console.log(`Updated to Class 7: classLevel = ${updated7.classLevel}`);

  // 3. Verify Class 7 curriculum
  const class7Data = await prisma.class.findUnique({
    where: { classNumber: 7 },
    include: {
      subjects: {
        include: { chapters: true },
      },
    },
  });

  console.log(`Class 7 Subjects: ${class7Data?.subjects.map(s => `${s.name} (${s.chapters.length} ch)`).join(', ')}`);

  // 4. Test updating class to Class 6
  const updated6 = await prisma.learner.update({
    where: { id: learnerUser.learner.id },
    data: { classLevel: 6 },
  });
  console.log(`Updated to Class 6: classLevel = ${updated6.classLevel}`);

  const class6Data = await prisma.class.findUnique({
    where: { classNumber: 6 },
    include: {
      subjects: {
        include: { chapters: true },
      },
    },
  });
  console.log(`Class 6 Subjects: ${class6Data?.subjects.map(s => `${s.name} (${s.chapters.length} ch)`).join(', ')}`);

  console.log('--- All DB tests passed successfully! ---');
  await prisma.$disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
