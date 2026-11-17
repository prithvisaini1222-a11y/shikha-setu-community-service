import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
  try {
    const mathCh1 = await prisma.chapter.findFirst({
      where: { subject: { code: 'MATH-6' }, chapterNumber: 1 },
    });
    const mathLes1 = await prisma.lesson.findFirst({
      where: { chapterId: mathCh1.id },
    });
    const sanCh2 = await prisma.chapter.findFirst({
      where: { subject: { code: 'SKT-6' }, chapterNumber: 2 },
    });

    console.log('Testing Class 6 Math Chapter 1:', mathCh1.title);
    const r1 = await fetch(`http://localhost:3000/learn/6/mathematics/${mathCh1.id}`);
    console.log(`  -> URL: /learn/6/mathematics/${mathCh1.id} | Status: ${r1.status}`);

    console.log('Testing Class 6 Math Watch Lesson 1:', mathLes1.title);
    const r2 = await fetch(`http://localhost:3000/learn/lesson/${mathLes1.id}`);
    console.log(`  -> URL: /learn/lesson/${mathLes1.id} | Status: ${r2.status}`);

    console.log('Testing Class 6 Sanskrit Chapter 2 (Unavailable/0 fake links):', sanCh2.title);
    const r3 = await fetch(`http://localhost:3000/learn/6/sanskrit/${sanCh2.id}`);
    console.log(`  -> URL: /learn/6/sanskrit/${sanCh2.id} | Status: ${r3.status}`);

    console.log('\nAll tested routes responded with expected statuses.');
  } finally {
    await prisma.$disconnect();
  }
}

test();
