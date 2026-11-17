import { prisma } from './src/lib/db/prisma.ts';

async function checkQuestions() {
  const classes = await prisma.class.findMany({
    include: {
      subjects: {
        include: {
          chapters: {
            include: {
              questions: true,
              quizzes: true,
            }
          }
        }
      }
    }
  });

  for (const c of classes) {
    let qCount = 0;
    let quizCount = 0;
    for (const s of c.subjects) {
      for (const ch of s.chapters) {
        qCount += ch.questions.length;
        quizCount += ch.quizzes.length;
      }
    }
    console.log(`Class ${c.classNumber}: ${c.subjects.length} subjects, ${qCount} questions, ${quizCount} quizzes`);
  }

  await prisma.$disconnect();
}

checkQuestions();

