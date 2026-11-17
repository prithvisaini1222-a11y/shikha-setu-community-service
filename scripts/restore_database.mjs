import { startPgServer } from './pg-server.mjs';
import { execSync } from 'node:child_process';

async function restore() {
  console.log('--- RESTORING CLEAN PGLITE DATABASE ---');
  const { port, server } = await startPgServer(5432);
  const dbUrl = `postgresql://postgres:postgres@127.0.0.1:${port}/shikshasetu?schema=public`;
  process.env.DATABASE_URL = dbUrl;

  console.log(`\n1. Pushing Prisma schema to ${dbUrl}...`);
  execSync('npx prisma db push --skip-generate', {
    env: { ...process.env, DATABASE_URL: dbUrl },
    stdio: 'inherit'
  });

  console.log('\n2. Seeding production-style demo data (Users, Aarav, Care Homes)...');
  execSync('node --experimental-strip-types prisma/seed.ts', {
    env: { ...process.env, DATABASE_URL: dbUrl },
    stdio: 'inherit'
  });

  console.log('\n3. Ensuring all Classes 6–10 have complete curriculum...');
  execSync('node scripts/ensure_all_classes_subjects.mjs', {
    env: { ...process.env, DATABASE_URL: dbUrl },
    stdio: 'inherit'
  });

  console.log('\n4. Importing Magnet Brains Class 6 curriculum & video dataset...');
  execSync('node scripts/import-class6.mjs', {
    env: { ...process.env, DATABASE_URL: dbUrl },
    stdio: 'inherit'
  });

  console.log('\n5. Ensuring Sanskrit for Classes 7–10...');
  execSync('node scripts/ensure_sanskrit_all_classes.mjs', {
    env: { ...process.env, DATABASE_URL: dbUrl },
    stdio: 'inherit'
  });

  console.log('\n✓ DATABASE RESTORATION COMPLETE AND HEALTHY!');
  server.close();
  process.exit(0);
}

restore().catch((err) => {
  console.error('Restoration failed:', err);
  process.exit(1);
});
