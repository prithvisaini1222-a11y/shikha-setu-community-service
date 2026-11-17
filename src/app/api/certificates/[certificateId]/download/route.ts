import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  try {
    const { certificateId } = await params;

    if (!certificateId) {
      return NextResponse.json({ error: 'Missing certificate ID' }, { status: 400 });
    }

    const certificate = await prisma.certificate.findFirst({
      where: {
        OR: [
          { certificateNumber: certificateId },
          { verificationCode: certificateId },
          { id: certificateId },
        ],
      },
    });

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    // Redirect to official certificate verification & printable view
    const targetUrl = new URL(`/certificates/verify/${certificate.certificateNumber}`, request.url);
    return NextResponse.redirect(targetUrl);
  } catch (error: any) {
    console.error('Certificate download error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
