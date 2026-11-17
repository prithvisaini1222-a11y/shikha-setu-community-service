import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function inspect() {
  const classes = await prisma.class.findMany();
  console.log('Classes:', classes);

  for (const c of classes) {
    const subjects = await prisma.subject.findMany({
      where: { classId: c.id },
      include: {
        chapters: {
          select: { id: true, chapterNumber: true, title: true }
        }
      }
    });
    console.log(`\nClass ${c.classNumber} (${c.id}) has ${subjects.length} subjects:`);
    for (const s of subjects) {
      console.log(`  Subject: ${s.name} (${s.code}) id: ${s.id} - ${s.chapters.length} chapters`);
    }
  }

  // Check videos with honeysuckle / knowing our numbers
  const oldVideos = await prisma.learningVideo.findMany({
    where: {
      OR: [
        { title: { contains: 'Knowing' } },
        { title: { contains: 'Honeysuckle' } },
        { title: { contains: 'Vasant' } },
        { title: { contains: 'History' } }
      ]
    },
    select: { id: true, title: true, chapterId: true, topicId: true }
  });
  console.log('\nOld videos found:', oldVideos.length);
  for (const v of oldVideos.slice(0, 10)) {
    console.log('  Video:', v.title, 'chapterId:', v.chapterId, 'topicId:', v.topicId);
  }

  await prisma.$disconnect();
}

inspect();
