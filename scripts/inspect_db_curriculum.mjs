import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const classes = await prisma.class.findMany({
    orderBy: { classNumber: 'asc' },
    include: {
      subjects: {
        include: {
          chapters: {
            include: {
              lessons: true,
              videos: true,
              topics: {
                include: { videos: true, lessons: true }
              }
            }
          }
        }
      }
    }
  });

  for (const c of classes) {
    console.log(`\n=== CLASS ${c.classNumber} ===`);
    for (const s of c.subjects) {
      const totalLessons = s.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
      const lessonsWithVid = s.chapters.reduce(
        (acc, ch) => acc + ch.lessons.filter(l => l.videoUrl).length,
        0
      );
      const totalVids = s.chapters.reduce(
        (acc, ch) => acc + ch.videos.length + ch.topics.reduce((tAcc, t) => tAcc + t.videos.length, 0),
        0
      );
      console.log(`  ${s.name} (${s.code}): ${s.chapters.length} chapters | ${totalLessons} lessons (${lessonsWithVid} with vid) | ${totalVids} LearningVideos`);
    }
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
