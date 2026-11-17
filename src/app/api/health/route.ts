import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const institutionCount = await prisma.institution.count();
    return NextResponse.json({
      status: 'ok',
      platform: 'ShikshaSetu',
      institutionCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error?.message }, { status: 500 });
  }
}
