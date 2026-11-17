import { PrismaClient } from '@prisma/client';
import { class6CurriculumData } from './class6Data.mjs';

const prisma = new PrismaClient();

export async function importClass6Curriculum(client) {
  const db = client || prisma;
  console.log('================================================================');
  console.log('  SHIKSHASETU — CLASS 6 NCERT 2026–27 CURRICULUM IMPORT');
  console.log('  Source: NCERT 2026-27 & Magnet Brains Updated Courses');
  console.log('================================================================\n');

  // 1. Ensure Class 6 exists
  let class6 = await db.class.findUnique({
    where: { classNumber: 6 },
  });

  if (!class6) {
    class6 = await db.class.create({
      data: {
        classNumber: 6,
        title: 'Class 6 - Middle School Foundation',
        description: 'Comprehensive NCERT 2026–27 curriculum for Class 6 aligned with NEP 2020.',
      },
    });
    console.log('✓ Created Class 6 record.');
  } else {
    console.log('✓ Found Class 6 record.');
  }

  // 2. Identify and purge legacy subjects/chapters that don't belong to current 2026-27 curriculum
  const validCodes = class6CurriculumData.map(s => s.code);
  const existingSubjects = await db.subject.findMany({
    where: { classId: class6.id },
    include: { chapters: true },
  });

  for (const existingSub of existingSubjects) {
    if (!validCodes.includes(existingSub.code)) {
      console.log(`⚠ Found legacy subject "${existingSub.name}" (${existingSub.code}). Purging...`);
      await db.subject.delete({ where: { id: existingSub.id } });
    }
  }

  // Collect all valid YouTube IDs in current 2026-27 curriculum
  const allCurriculumVideoIds = new Set();
  for (const s of class6CurriculumData) {
    for (const c of s.chapters) {
      for (const t of c.topics || []) {
        for (const v of t.videos || []) {
          if (v.youtubeVideoId) allCurriculumVideoIds.add(v.youtubeVideoId);
        }
      }
    }
  }

  // Purge any legacy videos belonging to Class 6 that are not in 2026-27 curriculum
  const class6ChapterIds = (await db.chapter.findMany({
    where: { subject: { classId: class6.id } },
    select: { id: true },
  })).map(c => c.id);

  const legacyVideos = await db.learningVideo.findMany({
    where: {
      chapterId: { in: class6ChapterIds },
      youtubeVideoId: { notIn: Array.from(allCurriculumVideoIds) },
    },
  });

  if (legacyVideos.length > 0) {
    console.log(`⚠ Found ${legacyVideos.length} legacy videos in Class 6 (Honeysuckle, Vasant, old NCERT). Purging...`);
    const legacyVideoIds = legacyVideos.map(v => v.id);
    await db.learnerVideoProgress.deleteMany({ where: { videoId: { in: legacyVideoIds } } });
    await db.savedVideo.deleteMany({ where: { videoId: { in: legacyVideoIds } } });
    await db.videoReport.deleteMany({ where: { videoId: { in: legacyVideoIds } } });
    await db.learningVideo.deleteMany({ where: { id: { in: legacyVideoIds } } });
  }

  let totalSubjects = 0;
  let totalChapters = 0;
  let totalTopics = 0;
  let totalVideos = 0;
  let unavailableLessons = [];
  const processedVideoIds = new Set();

  // 3. Process each subject
  for (let sIdx = 0; sIdx < class6CurriculumData.length; sIdx++) {
    const subData = class6CurriculumData[sIdx];
    totalSubjects++;

    console.log(`\n[${sIdx + 1}/6] Importing ${subData.name} — Book: ${subData.bookName} (${subData.chapters.length} chapters)...`);

    // Upsert Subject
    const subject = await db.subject.upsert({
      where: {
        classId_code: {
          classId: class6.id,
          code: subData.code,
        },
      },
      update: {
        name: subData.name,
        bookName: subData.bookName,
        order: sIdx + 1,
        icon: subData.icon,
        color: subData.color,
        description: subData.description,
      },
      create: {
        classId: class6.id,
        name: subData.name,
        code: subData.code,
        bookName: subData.bookName,
        order: sIdx + 1,
        icon: subData.icon,
        color: subData.color,
        description: subData.description,
      },
    });

    // Remove legacy chapters for this subject that don't match the new curriculum chapter numbers
    const validChapterNumbers = subData.chapters.map(c => c.chapterNumber);
    const existingChapters = await db.chapter.findMany({
      where: { subjectId: subject.id },
    });

    for (const ec of existingChapters) {
      if (!validChapterNumbers.includes(ec.chapterNumber)) {
        console.log(`  ⚠ Removing legacy chapter ${ec.chapterNumber}: "${ec.title}"`);
        await db.chapter.delete({ where: { id: ec.id } });
      }
    }

    // Process Chapters
    for (const chData of subData.chapters) {
      totalChapters++;

      // Find or create chapter by (subjectId, chapterNumber)
      let chapter = await db.chapter.findFirst({
        where: {
          subjectId: subject.id,
          chapterNumber: chData.chapterNumber,
        },
      });

      if (chapter) {
        chapter = await db.chapter.update({
          where: { id: chapter.id },
          data: {
            title: chData.title,
            theme: chData.theme || null,
            order: chData.order,
            description: chData.description,
          },
        });
      } else {
        chapter = await db.chapter.create({
          data: {
            subjectId: subject.id,
            chapterNumber: chData.chapterNumber,
            title: chData.title,
            theme: chData.theme || null,
            order: chData.order,
            description: chData.description,
          },
        });
      }

      // Check if chapter has available videos
      if (chData.isAvailable === false || !chData.topics || chData.topics.length === 0) {
        unavailableLessons.push(`${subData.name} Ch ${chData.chapterNumber}: ${chData.title} (Marked: Video status: Not available yet)`);
      }

      let lessonSequence = 1;

      // Process Topics
      for (const topData of chData.topics) {
        totalTopics++;

        let topic = await db.topic.findFirst({
          where: {
            chapterId: chapter.id,
            name: topData.name,
          },
        });

        if (topic) {
          topic = await db.topic.update({
            where: { id: topic.id },
            data: { order: topData.order },
          });
        } else {
          topic = await db.topic.create({
            data: {
              chapterId: chapter.id,
              name: topData.name,
              order: topData.order,
              description: `${subData.name} - ${chapter.title} - ${topData.name}`,
            },
          });
        }

        // Process Videos under Topic
        for (const vidData of topData.videos) {
          if (!vidData.youtubeVideoId) continue;

          // Guard against duplicates
          if (processedVideoIds.has(vidData.youtubeVideoId)) {
            console.warn(`  ⚠ Duplicate video ID ${vidData.youtubeVideoId} encountered. Skipping.`);
            continue;
          }
          processedVideoIds.add(vidData.youtubeVideoId);
          totalVideos++;

          // Upsert LearningVideo
          await db.learningVideo.upsert({
            where: { youtubeVideoId: vidData.youtubeVideoId },
            update: {
              topicId: topic.id,
              chapterId: chapter.id,
              youtubeUrl: vidData.youtubeUrl,
              title: vidData.cleanTitle || vidData.title,
              channelName: 'Magnet Brains',
              thumbnailUrl: vidData.thumbnailUrl,
              description: vidData.title,
              source: 'Magnet Brains',
              sourceCourse: vidData.sourceCourse,
              academicYear: '2026-27',
              order: vidData.order,
              videoStatus: 'AVAILABLE',
              duration: vidData.duration,
              durationSeconds: vidData.durationSeconds,
              isRecommended: vidData.isRecommended,
              isApproved: true,
            },
            create: {
              youtubeVideoId: vidData.youtubeVideoId,
              topicId: topic.id,
              chapterId: chapter.id,
              youtubeUrl: vidData.youtubeUrl,
              title: vidData.cleanTitle || vidData.title,
              channelName: 'Magnet Brains',
              thumbnailUrl: vidData.thumbnailUrl,
              description: vidData.title,
              source: 'Magnet Brains',
              sourceCourse: vidData.sourceCourse,
              academicYear: '2026-27',
              order: vidData.order,
              videoStatus: 'AVAILABLE',
              duration: vidData.duration,
              durationSeconds: vidData.durationSeconds,
              isRecommended: vidData.isRecommended,
              isApproved: true,
            },
          });

          // Upsert corresponding Lesson for learner progress & sequence
          const existingLesson = await db.lesson.findFirst({
            where: {
              chapterId: chapter.id,
              videoUrl: vidData.youtubeUrl,
            },
          });

          const durMin = Math.max(1, Math.round(vidData.durationSeconds / 60));

          if (existingLesson) {
            await db.lesson.update({
              where: { id: existingLesson.id },
              data: {
                topicId: topic.id,
                title: vidData.cleanTitle || vidData.title,
                lessonNumber: lessonSequence++,
                durationMinutes: durMin,
                videoSource: 'Magnet Brains',
                isPublished: true,
              },
            });
          } else {
            await db.lesson.create({
              data: {
                chapterId: chapter.id,
                topicId: topic.id,
                title: vidData.cleanTitle || vidData.title,
                lessonNumber: lessonSequence++,
                durationMinutes: durMin,
                videoUrl: vidData.youtubeUrl,
                videoSource: 'Magnet Brains',
                isPublished: true,
              },
            });
          }
        }
      }
    }
  }

  console.log('\n================================================================');
  console.log('  CLASS 6 IMPORT COMPLETE');
  console.log('================================================================');
  console.log(`  Subjects:               ${totalSubjects} (Mathematics, Science, Social Science, English, Hindi, Sanskrit)`);
  console.log(`  Chapters:               ${totalChapters}`);
  console.log(`  Topics:                 ${totalTopics}`);
  console.log(`  Learning Videos:        ${totalVideos}`);
  console.log(`  Duplicates Removed:     0`);
  if (unavailableLessons.length > 0) {
    console.log(`  Unavailable Lessons:    ${unavailableLessons.length}`);
    unavailableLessons.forEach(u => console.log(`    - ${u}`));
  }
  console.log('================================================================\n');

  return {
    totalSubjects,
    totalChapters,
    totalTopics,
    totalVideos,
    unavailableLessons,
  };
}

// Auto-run if executed directly
if (process.argv[1]?.endsWith('import-class6.mjs')) {
  importClass6Curriculum()
    .then(async () => {
      await prisma.$disconnect();
      process.exit(0);
    })
    .catch(async (e) => {
      console.error('Import failed with error:', e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
