import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  try {
    const res = await prisma.$queryRawUnsafe('SELECT 1 as connected');
    console.log('Connected to DB:', res);

    // Let's add the columns via SQL safely if they don't exist yet!
    const statements = [
      `ALTER TABLE "Subject" ADD COLUMN IF NOT EXISTS "academicSession" TEXT DEFAULT '2026-27';`,
      `ALTER TABLE "Subject" ADD COLUMN IF NOT EXISTS "board" TEXT DEFAULT 'CBSE / NCERT';`,
      `ALTER TABLE "Subject" ADD COLUMN IF NOT EXISTS "medium" TEXT DEFAULT 'English / Hindi';`,
      `ALTER TABLE "Subject" ADD COLUMN IF NOT EXISTS "textbookEdition" TEXT DEFAULT '2026-27';`,

      `ALTER TABLE "Chapter" ADD COLUMN IF NOT EXISTS "academicSession" TEXT DEFAULT '2026-27';`,
      `ALTER TABLE "Chapter" ADD COLUMN IF NOT EXISTS "board" TEXT DEFAULT 'CBSE / NCERT';`,
      `ALTER TABLE "Chapter" ADD COLUMN IF NOT EXISTS "medium" TEXT DEFAULT 'English / Hindi';`,
      `ALTER TABLE "Chapter" ADD COLUMN IF NOT EXISTS "textbookName" TEXT DEFAULT 'NCERT';`,
      `ALTER TABLE "Chapter" ADD COLUMN IF NOT EXISTS "textbookEdition" TEXT DEFAULT '2026-27';`,
      `ALTER TABLE "Chapter" ADD COLUMN IF NOT EXISTS "officialSourceUrl" TEXT DEFAULT 'https://ncert.nic.in/textbook.php';`,
      `ALTER TABLE "Chapter" ADD COLUMN IF NOT EXISTS "syllabusStatus" TEXT DEFAULT 'CURRENT_2026_27';`,

      `ALTER TABLE "Topic" ADD COLUMN IF NOT EXISTS "officialSourceUrl" TEXT DEFAULT 'https://ncert.nic.in/textbook.php';`,
      `ALTER TABLE "Topic" ADD COLUMN IF NOT EXISTS "syllabusStatus" TEXT DEFAULT 'CURRENT_2026_27';`,

      `ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "lectureType" TEXT DEFAULT 'Concept Explanation';`,
      `ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "mappingStatus" TEXT DEFAULT 'VERIFIED';`,

      `ALTER TABLE "LearningVideo" ADD COLUMN IF NOT EXISTS "lectureType" TEXT DEFAULT 'Concept Explanation';`,
      `ALTER TABLE "LearningVideo" ADD COLUMN IF NOT EXISTS "mappingStatus" TEXT DEFAULT 'VERIFIED';`,
      `ALTER TABLE "LearningVideo" ADD COLUMN IF NOT EXISTS "mappingConfidence" DOUBLE PRECISION DEFAULT 100.0;`,
      `ALTER TABLE "LearningVideo" ADD COLUMN IF NOT EXISTS "textbookName" TEXT DEFAULT 'NCERT';`,
      `ALTER TABLE "LearningVideo" ADD COLUMN IF NOT EXISTS "textbookEdition" TEXT DEFAULT '2026-27';`,
      `ALTER TABLE "LearningVideo" ADD COLUMN IF NOT EXISTS "officialSourceUrl" TEXT DEFAULT 'https://ncert.nic.in/textbook.php';`,
      `ALTER TABLE "LearningVideo" ADD COLUMN IF NOT EXISTS "syllabusStatus" TEXT DEFAULT 'CURRENT_2026_27';`,
      `ALTER TABLE "LearningVideo" ADD COLUMN IF NOT EXISTS "playlistId" TEXT;`,
      `ALTER TABLE "LearningVideo" ADD COLUMN IF NOT EXISTS "playlistPosition" INTEGER;`
    ];

    for (const sql of statements) {
      await prisma.$executeRawUnsafe(sql);
    }
    console.log('All columns successfully added to database!');
  } catch (err) {
    console.error('Error applying columns:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();

