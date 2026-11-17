import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const videoCount = await prisma.learningVideo.count();
  const lessonCount = await prisma.lesson.count();
  const chapterCount = await prisma.chapter.count();
  const subjectCount = await prisma.subject.count();
  const classCount = await prisma.class.count();
  console.log('Summary:', { classCount, subjectCount, chapterCount, lessonCount, videoCount });

  const videos = await prisma.learningVideo.findMany({
    select: {
      id: true,
      title: true,
      youtubeVideoId: true,
      source: true,
      sourceCourse: true,
      academicYear: true,
      topicId: true,
      chapterId: true,
      chapter: {
        select: {
          id: true,
          title: true,
          chapterNumber: true,
          subject: {
            select: {
              name: true,
              code: true,
              class: {
                select: { classNumber: true }
              }
            }
          }
        }
      }
    }
  });

  const byClass = {};
  let unassignedCount = 0;
  for (const v of videos) {
    const cls = v.chapter?.subject?.class?.classNumber;
    const sub = v.chapter?.subject?.name;
    if (!cls || !sub) {
      unassignedCount++;
      continue;
    }
    byClass[cls] = byClass[cls] || {};
    byClass[cls][sub] = (byClass[cls][sub] || 0) + 1;
  }
  console.log('Videos distribution by class & subject:');
  console.log(JSON.stringify(byClass, null, 2));
  console.log('Unassigned videos:', unassignedCount);

  // Check unique YouTube IDs
  const ytIds = new Set(videos.map(v => v.youtubeVideoId));
  console.log(`Total video records: ${videos.length}, Unique YouTube IDs: ${ytIds.size}`);

  // Let's also check Lesson records
  const lessons = await prisma.lesson.findMany({
    select: {
      id: true,
      title: true,
      videoUrl: true,
      videoSource: true,
      chapter: {
        select: {
          title: true,
          chapterNumber: true,
          subject: {
            select: {
              name: true,
              code: true,
              class: {
                select: { classNumber: true }
              }
            }
          }
        }
      }
    }
  });
  console.log('Total Lesson records:', lessons.length);
  const lessonsByClass = {};
  for (const l of lessons) {
    const cls = l.chapter?.subject?.class?.classNumber || 'Unassigned';
    const sub = l.chapter?.subject?.name || 'Unassigned';
    lessonsByClass[cls] = lessonsByClass[cls] || {};
    lessonsByClass[cls][sub] = (lessonsByClass[cls][sub] || 0) + 1;
  }
  console.log('Lessons distribution by class & subject:');
  console.log(JSON.stringify(lessonsByClass, null, 2));

  // Check if there are other sources or raw data files
}

main().catch(console.error).finally(() => prisma.$disconnect());

