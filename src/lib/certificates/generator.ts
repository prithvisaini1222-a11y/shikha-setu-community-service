import { prisma } from '@/lib/db/prisma';
import { CertificateStatus } from '@prisma/client';

export function generateCertificateId(): { certNumber: string; verificationCode: string } {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
  const year = new Date().getFullYear();

  return {
    certNumber: `CERT-SS-${year}-${randomDigits}`,
    verificationCode: `SS-VRF-${randomDigits}-${randomCode}`,
  };
}

export async function issueVolunteerCertificate({
  volunteerId,
  institutionId,
  sessionId,
  contributionType,
  hoursContributed,
  sessionsCount,
}: {
  volunteerId: string;
  institutionId: string;
  sessionId?: string;
  contributionType: string;
  hoursContributed: number;
  sessionsCount: number;
}) {
  const { certNumber, verificationCode } = generateCertificateId();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002';
  const qrCodeData = `${baseUrl}/certificates/verify/${certNumber}`;

  return prisma.certificate.create({
    data: {
      certificateNumber: certNumber,
      volunteerId,
      institutionId,
      sessionId,
      contributionType,
      hoursContributed,
      sessionsCount,
      verificationCode,
      qrCodeData,
      status: CertificateStatus.VALID,
    },
    include: {
      volunteer: { select: { fullName: true } },
      institution: { select: { orgName: true, city: true, state: true } },
    },
  });
}
