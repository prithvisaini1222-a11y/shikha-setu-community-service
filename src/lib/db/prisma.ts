import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';

if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost:5432')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('localhost:5432', '127.0.0.1:5432');
}

function resolveDatabaseUrl(): string | undefined {
  let url = process.env.DATABASE_URL;
  if (!url) {
    try {
      const sessionPath = path.resolve(process.cwd(), '.dev-session.json');
      if (fs.existsSync(sessionPath)) {
        const session = JSON.parse(fs.readFileSync(sessionPath, 'utf8'));
        if (session.databaseUrl) {
          url = session.databaseUrl;
        }
      }
    } catch {}
  }
  if (url && url.includes('localhost:5432')) {
    url = url.replace('localhost:5432', '127.0.0.1:5432');
  }
  return url;
}

const activeDbUrl = resolveDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaDbUrl: string | undefined;
};

if (globalForPrisma.prisma && globalForPrisma.prismaDbUrl !== activeDbUrl) {
  try {
    globalForPrisma.prisma.$disconnect();
  } catch {}
  globalForPrisma.prisma = undefined;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'],
    ...(activeDbUrl ? { datasourceUrl: activeDbUrl } : {}),
  });

globalForPrisma.prisma = prisma;
globalForPrisma.prismaDbUrl = activeDbUrl;
