import { startPgServer } from './pg-server.mjs';
import { PrismaClient } from '@prisma/client';

async function test() {
  const s = await startPgServer(5432);
  const prisma = new PrismaClient({
    datasourceUrl: `postgresql://postgres:postgres@127.0.0.1:${s.port}/shikshasetu?schema=public&connection_limit=1&pgbouncer=true`
  });

  try {
    const count = await prisma.user.count();
    console.log('User count in DB:', count);
  } catch (err) {
    console.log('Query result:', err.message);
  }

  await prisma.$disconnect();
  s.server.close();
  process.exit(0);
}

test().catch(console.error);
