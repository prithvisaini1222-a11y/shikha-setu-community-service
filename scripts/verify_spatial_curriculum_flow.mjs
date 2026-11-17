import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- COMPREHENSIVE CURRICULUM FLOW VERIFICATION ---');

  const classes = [6, 7, 8, 9, 10];
  const requiredSubjects = [
    'Mathematics',
    'Science',
    'Social Science',
    'English',
    'Hindi',
    'Sanskrit',
  ];

  let totalErrors = 0;

  for (const classNum of classes) {
    console.log(`\nTesting Class ${classNum}:`);
    const cls = await prisma.class.findUnique({
      where: { classNumber: classNum },
      include: {
        subjects: {
          include: {
            chapters: {
              include: {
                lessons: true,
                videos: true,
                topics: {
                  include: { videos: true },
                },
              },
            },
          },
        },
      },
    });

    if (!cls) {
      console.error(`  ERROR: Class ${classNum} not found in database!`);
      totalErrors++;
      continue;
    }

    for (const reqSubj of requiredSubjects) {
      const subj = cls.subjects.find((s) =>
        s.name.toLowerCase().includes(reqSubj.toLowerCase())
      );

      if (!subj) {
        console.error(`  ERROR: Subject "${reqSubj}" not found in Class ${classNum}!`);
        totalErrors++;
        continue;
      }

      const chapterCount = subj.chapters.length;
      const totalLessons = subj.chapters.reduce(
        (acc, ch) => acc + ch.lessons.length,
        0
      );
      const totalVideos = subj.chapters.reduce(
        (acc, ch) =>
          acc + ch.videos.length + ch.topics.reduce((tAcc, t) => tAcc + t.videos.length, 0),
        0
      );
      const totalPlayableContent = totalLessons + totalVideos;

      if (chapterCount === 0) {
        console.error(
          `  ERROR: ${subj.name} (Class ${classNum}) has 0 chapters!`
        );
        totalErrors++;
      } else if (totalPlayableContent === 0) {
        console.warn(
          `  WARNING: ${subj.name} (Class ${classNum}) has ${chapterCount} chapters but 0 lessons/videos!`
        );
      } else {
        console.log(
          `  ✓ ${subj.name} (${subj.code}): ${chapterCount} chapters, ${totalLessons} lessons, ${totalVideos} videos (Book: ${subj.bookName || 'NCERT'})`
        );
      }
    }
  }

  console.log('\n--- TESTING HTTP SERVER ENDPOINTS ---');
  const testUrls = [
    'http://localhost:3000/learn',
    'http://localhost:3000/learn/6',
    'http://localhost:3000/learn/6/mathematics',
    'http://localhost:3000/learn/6/science',
    'http://localhost:3000/learn/7/mathematics',
    'http://localhost:3000/learn/8/science',
    'http://localhost:3000/learn/9/social-science',
    'http://localhost:3000/learn/10/sanskrit',
  ];

  for (const url of testUrls) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      const hasTitle =
        text.includes('Explore. Learn. Discover.') ||
        text.includes('Chapters & Lectures') ||
        text.includes('Subject Spatial Explorer') ||
        text.includes('Subject Progress');
      console.log(`  ${url} -> HTTP ${res.status} (Length: ${text.length}, Valid Content: ${hasTitle})`);
      if (res.status !== 200 || !hasTitle) {
        console.error(`  ERROR on ${url}: Status ${res.status}`);
        totalErrors++;
      }
    } catch (e) {
      console.error(`  ERROR accessing ${url}:`, e.message);
      totalErrors++;
    }
  }

  console.log(`\nVerification complete. Total issues found: ${totalErrors}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
