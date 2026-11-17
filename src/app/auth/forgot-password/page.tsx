'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid registered email address.');
      return;
    }

    setError(null);
    startTransition(() => {
      setTimeout(() => {
        setIsSubmitted(true);
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      }, 500);
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#F8F7F2]">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#EEF7F0] border border-[#78B98A]/30 flex items-center justify-center text-[#4F9D69] mx-auto">
          <Mail className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-[#25352B] tracking-tight">
            Account Recovery
          </h1>
          <p className="text-xs text-[#647067] leading-relaxed">
            Enter your registered email address to receive secure access recovery instructions.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#DC2626] flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isSubmitted ? (
          <div className="space-y-4 py-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 rounded-xl bg-[#EEF7F0] border border-[#78B98A]/30 text-xs text-[#1B4D2F] space-y-1.5 text-left">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#4F9D69]" />
                <span>Verification Link Dispatched</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#4E5C53]">
                If an account exists for <strong className="text-[#25352B]">{email}</strong>, a secure one-time password reset token has been dispatched.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/auth/reset-password"
                className="w-full py-2.5 rounded-xl bg-[#4F9D69] hover:bg-[#3E8555] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Reset Token & New Password</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                className="text-xs text-[#647067] hover:text-[#25352B] py-1 transition-colors"
              >
                Try different email address
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-[#25352B] mb-1.5">
                Registered Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.org or personal email"
                className="w-full px-3.5 py-2 text-xs border border-[#E2E8E0] rounded-xl focus:outline-none focus:border-[#4F9D69] focus:bg-white bg-[#FAFBF9] text-[#25352B] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 rounded-xl bg-[#4F9D69] hover:bg-[#3E8555] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isPending ? 'Verifying...' : 'Request Recovery Link'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Institutional Safeguards Info */}
        <div className="bg-[#FAFBF9] p-3.5 rounded-xl text-left border border-[#E2E8E0] text-[11px] text-[#647067] space-y-1.5">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4F9D69] shrink-0 mt-0.5" />
            <span><strong className="text-[#25352B]">Institutional Learners:</strong> Student credentials are managed directly in person by your care home superintendent.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4F9D69] shrink-0 mt-0.5" />
            <span><strong className="text-[#25352B]">Volunteers & Donors:</strong> Multi-factor verification link valid for 30 minutes.</span>
          </div>
        </div>

        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F9D69] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Sign In</span>
        </Link>
      </div>
    </div>
  );
}
