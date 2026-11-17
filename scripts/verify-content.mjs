import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyContent() {
  console.log('=== HTML & CONTENT VERIFICATION ===\n');

  // 1. Fetch /learn/6 HTML
  const resLearn6 = await fetch('http://localhost:3000/learn/6');
  const htmlLearn6 = await resLearn6.text();

  const books = [
    'Ganita Prakash',
    'Curiosity',
    'Exploring Society',
    'Poorvi',
    'Malhar',
    'Deepakam',
  ];

  console.log('1. Checking Subject Book Titles on /learn/6:');
  for (const book of books) {
    if (htmlLearn6.includes(book)) {
      console.log(`   ✓ Found book: "${book}"`);
    } else {
      console.error(`   ❌ Missing book: "${book}"`);
    }
  }

  // 2. Fetch /learn/6/mathematics HTML
  const resMath = await fetch('http://localhost:3000/learn/6/mathematics');
  const htmlMath = await resMath.text();
  const mathChapters = [
    'Patterns in Mathematics',
    'Lines and Angles',
    'Number Play',
    'Data Handling and Presentation',
    'Prime Time',
    'Perimeter and Area',
    'Fractions',
    'Playing with Constructions',
    'Symmetry',
    'The Other Side of Zero',
  ];
  console.log('\n2. Checking Ganita Prakash 10 Chapters on /learn/6/mathematics:');
  let mathOk = true;
  for (const ch of mathChapters) {
    if (htmlMath.includes(ch)) {
      console.log(`   ✓ Found chapter: "${ch}"`);
    } else {
      console.error(`   ❌ Missing chapter: "${ch}"`);
      mathOk = false;
    }
  }

  // 3. Fetch /learn/6/social-science HTML
  const resSst = await fetch('http://localhost:3000/learn/6/social-science');
  const htmlSst = await resSst.text();
  const themes = [
    'THEME A — INDIA AND THE WORLD',
    'THEME B — TAPESTRY OF THE PAST',
    'THEME C — OUR CULTURAL HERITAGE',
    'THEME D — GOVERNANCE AND DEMOCRACY',
    'THEME E — ECONOMIC LIFE AROUND US',
  ];
  console.log('\n3. Checking Exploring Society Themes on /learn/6/social-science:');
  for (const th of themes) {
    if (htmlSst.includes(th)) {
      console.log(`   ✓ Found theme group: "${th}"`);
    } else {
      console.error(`   ❌ Missing theme: "${th}"`);
    }
  }

  // 4. Fetch /learn/6/sanskrit HTML
  const resSkt = await fetch('http://localhost:3000/learn/6/sanskrit');
  const htmlSkt = await resSkt.text();
  console.log('\n4. Checking Deepakam & Pending Notice on /learn/6/sanskrit:');
  if (htmlSkt.includes('Deepakam')) console.log('   ✓ Found book: "Deepakam"');
  if (htmlSkt.includes('Video status: Not available yet')) {
    console.log('   ✓ Found notice: "Video status: Not available yet" for pending Sanskrit chapter.');
  } else {
    console.error('   ❌ Missing "Video status: Not available yet" notice on Sanskrit page.');
  }

  // 5. Check Watch Page
  const firstLesson = await prisma.lesson.findFirst({
    where: { chapter: { subject: { code: 'MATH-6' } } },
    include: { chapter: true },
  });
  if (firstLesson) {
    const resLesson = await fetch(`http://localhost:3000/learn/lesson/${firstLesson.id}`);
    const htmlLesson = await resLesson.text();
    console.log(`\n5. Checking Lesson Player (/learn/lesson/${firstLesson.id}):`);
    if (htmlLesson.includes('youtube-nocookie.com/embed/')) {
      console.log('   ✓ Official YouTube nocookie embed iframe verified.');
    } else {
      console.error('   ❌ youtube-nocookie embed not found.');
    }
    if (htmlLesson.includes('Mark as Completed') || htmlLesson.includes('Lesson Completed')) {
      console.log('   ✓ Mark Completed button verified.');
    }
  }

  console.log('\n=== ALL HTML CHECKS COMPLETED ===');
  await prisma.$disconnect();
}

verifyContent().catch((e) => {
  console.error(e);
  process.exit(1);
});
