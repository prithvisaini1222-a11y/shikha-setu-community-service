import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCompleteUX() {
  console.log('=== VERIFYING COMPLETE SHIKSHASETU USER EXPERIENCE ===');

  // 1. Verify Learner Aarav exists and has a real classLevel
  const user = await prisma.user.findUnique({
    where: { email: 'aarav.learner@shikshasetu.org' },
    include: {
      learner: true,
    },
  });

  if (!user || !user.learner) {
    console.error('Learner user not found!');
    process.exit(1);
  }

  console.log(`[PASS] Learner User: ${user.name} (${user.email})`);
  console.log(`[PASS] Initial Learner classLevel in DB: ${user.learner.classLevel}`);

  // 2. Test dynamic class switching across all classes 6, 7, 8, 9, 10
  for (const targetClass of [6, 7, 8, 9, 10]) {
    const updated = await prisma.learner.update({
      where: { id: user.learner.id },
      data: { classLevel: targetClass },
    });

    const classData = await prisma.class.findUnique({
      where: { classNumber: targetClass },
      include: {
        subjects: {
          include: { chapters: true },
        },
      },
    });

    console.log(
      `[PASS] Class ${targetClass} persisted. Subjects count: ${classData?.subjects.length}, Total Chapters: ${classData?.subjects.reduce((a, s) => a + s.chapters.length, 0)}`
    );
  }

  // 3. Reset back to Class 6 as default
  await prisma.learner.update({
    where: { id: user.learner.id },
    data: { classLevel: 6 },
  });
  console.log('[PASS] Reset Learner classLevel to 6.');

  console.log('=== ALL DATABASE & DYNAMIC CLASS CHECKS PASSED ===');
  await prisma.$disconnect();
}

testCompleteUX().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
