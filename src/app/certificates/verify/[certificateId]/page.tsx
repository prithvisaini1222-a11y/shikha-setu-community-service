import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { ShieldCheck, ArrowLeft, X } from 'lucide-react';
import { PrintCertificateButton } from '@/components/certificates/PrintCertificateButton';

export const dynamic = 'force-dynamic';

export default async function CertificateVerifyPage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = await params;

  const certificate = await prisma.certificate.findFirst({
    where: {
      OR: [
        { certificateNumber: certificateId },
        { verificationCode: certificateId },
        { id: certificateId },
      ],
    },
    include: {
      volunteer: true,
      institution: true,
      session: true,
    },
  });

  if (!certificate) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-[#F8FAF8]">
        <div className="max-w-md w-full bg-white p-8 rounded-[16px] border border-[#E2E8E0] text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto">
            <X className="w-6 h-6 text-[#991B1B]" />
          </div>
          <h2 className="text-xl font-bold text-[#18261E]">Certificate Not Found</h2>
          <p className="text-xs text-[#4E5C53]">
            Certificate ID &ldquo;{certificateId}&rdquo; does not match any verified record in the ShikshaSetu registry.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D4E] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D4E] hover:underline mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Home
            </Link>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EBF5EE] text-[#1B4D2F]">
                Authentic Verified Record
              </span>
              <span className="text-xs font-mono text-[#4E5C53] font-semibold">{certificate.certificateNumber}</span>
            </div>
          </div>

          <PrintCertificateButton />
        </div>

        {/* Official Certificate Frame */}
        <div className="bg-white border-4 border-double border-[#E2E8E0] p-8 sm:p-14 rounded-[18px] shadow-sm space-y-8 text-center relative overflow-hidden">
          {/* Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <span className="text-9xl font-black text-[#18261E]">श</span>
          </div>

          {/* Certificate Header */}
          <div className="space-y-2 border-b border-[#E2E8E0] pb-6">
            <div className="w-12 h-12 rounded-[10px] bg-[#2E7D4E] text-white font-bold text-xl flex items-center justify-center mx-auto shadow-xs">
              श
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18261E] uppercase">
              ShikshaSetu Volunteer Service Certificate
            </h2>
            <p className="text-xs font-semibold text-[#4E5C53] uppercase tracking-widest">
              Recognized Community Teaching Contribution
            </p>
          </div>

          {/* Recipient */}
          <div className="space-y-3 max-w-2xl mx-auto">
            <p className="text-xs text-[#4E5C53] uppercase tracking-wider font-semibold">
              This certificate is proudly awarded to
            </p>
            <h3 className="text-3xl sm:text-4xl font-serif italic font-bold text-[#18261E]">
              {certificate.volunteer.fullName}
            </h3>
            <p className="text-sm text-[#4E5C53] leading-relaxed pt-2">
              in recognition of dedicated voluntary teaching and academic support delivered for students at{' '}
              <strong className="text-[#18261E]">{certificate.institution.orgName}</strong> ({certificate.institution.city}, {certificate.institution.state}).
            </p>
          </div>

          {/* Contribution Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-[12px] bg-[#F4F7F4] border border-[#E2E8E0] text-xs text-left max-w-2xl mx-auto">
            <div>
              <span className="text-[#4E5C53] block text-[11px]">Contribution:</span>
              <strong className="text-[#18261E]">{certificate.contributionType}</strong>
            </div>
            <div>
              <span className="text-[#4E5C53] block text-[11px]">Verified Hours:</span>
              <strong className="text-[#2E7D4E] font-bold">{certificate.hoursContributed} Hours</strong>
            </div>
            <div>
              <span className="text-[#4E5C53] block text-[11px]">Sessions:</span>
              <strong className="text-[#18261E]">{certificate.sessionsCount} Sessions</strong>
            </div>
            <div>
              <span className="text-[#4E5C53] block text-[11px]">Date:</span>
              <strong className="text-[#18261E]">{new Date(certificate.issueDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</strong>
            </div>
          </div>

          {/* Sign-offs & Verification Seal */}
          <div className="pt-8 border-t border-[#E2E8E0] flex flex-col sm:flex-row items-center justify-between gap-6 max-w-2xl mx-auto">
            <div className="text-left space-y-0.5">
              <div className="font-serif italic font-bold text-[#18261E] text-base">Gayatri Devi</div>
              <div className="text-[11px] text-[#4E5C53] font-medium">Superintendent</div>
              <div className="text-[11px] text-[#2E7D4E] font-semibold">{certificate.institution.orgName}</div>
            </div>

            {/* Official Verification Seal */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#2E7D4E] flex flex-col items-center justify-center p-2 text-[#1B4D2F] font-bold text-[9px] uppercase tracking-wider text-center bg-[#EBF5EE]">
                <ShieldCheck className="w-5 h-5 text-[#2E7D4E] mb-0.5" />
                <span>OFFICIALLY VERIFIED</span>
              </div>
              <span className="text-[10px] font-mono text-[#9CA3AF] mt-1">
                {certificate.verificationCode}
              </span>
            </div>

            <div className="text-right space-y-0.5">
              <div className="font-serif italic font-bold text-[#18261E] text-base">Dr. Anita Roy</div>
              <div className="text-[11px] text-[#4E5C53] font-medium">Directorate Admin</div>
              <div className="text-[11px] text-[#2E7D4E] font-semibold">ShikshaSetu Central</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
