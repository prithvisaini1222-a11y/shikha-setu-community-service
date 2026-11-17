import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testFetch() {
  const user = await prisma.user.findUnique({ where: { email: 'aarav.learner@shikshasetu.org' } });
  const cookie = 'shikshasetu_session_uid=' + user.id;

  // 1. Normal Dashboard
  const res = await fetch('http://localhost:3000/dashboard/learner', {
    headers: { Cookie: cookie }
  });

  const html = await res.text();
  console.log('Status:', res.status);
  console.log('Contains "What do you want to learn today?":', html.includes('What do you want to learn today?'));
  console.log('Contains "Class 8":', html.includes('Class 8'));
  console.log('Contains "Mathematics":', html.includes('Mathematics'));
  console.log('Contains "Science":', html.includes('Science'));
  console.log('Contains "Social Science":', html.includes('Social Science'));
  console.log('Contains "English":', html.includes('English'));
  console.log('Contains "Hindi":', html.includes('Hindi'));
  console.log('Contains "Computer":', html.includes('Computer'));
  console.log('Contains "Change Class":', html.includes('Change Class'));

  // 2. Welcome / Onboarding Flow
  const resWelcome = await fetch('http://localhost:3000/dashboard/learner?welcome=true', {
    headers: { Cookie: cookie }
  });
  const htmlWelcome = await resWelcome.text();
  console.log('\nWelcome Flow Status:', resWelcome.status);
  console.log('Welcome Flow Contains "Choose Your Class":', htmlWelcome.includes('Choose Your Class'));
  console.log('Welcome Flow Contains "Middle School Foundation":', htmlWelcome.includes('Middle School Foundation'));
  console.log('Welcome Flow Contains "Board Preparation":', htmlWelcome.includes('Board Preparation'));

  await prisma.$disconnect();
}

testFetch().catch(console.error);
