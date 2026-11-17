import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code') || searchParams.get('id');

  if (!code) {
    return NextResponse.json({ error: 'Missing code or id query parameter' }, { status: 400 });
  }

  const certificate = await prisma.certificate.findFirst({
    where: {
      OR: [
        { certificateNumber: code },
        { verificationCode: code },
        { id: code },
      ],
    },
    include: {
      volunteer: { select: { fullName: true } },
      institution: { select: { orgName: true, city: true, state: true } },
    },
  });

  if (!certificate) {
    return NextResponse.json({ valid: false, error: 'Certificate not found' }, { status: 404 });
  }

  return NextResponse.json({
    valid: certificate.status === 'VALID',
    certificateNumber: certificate.certificateNumber,
    volunteerName: certificate.volunteer.fullName,
    institutionName: certificate.institution.orgName,
    contributionType: certificate.contributionType,
    hoursContributed: certificate.hoursContributed,
    issueDate: certificate.issueDate,
    status: certificate.status,
  });
}
