'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Please provide the recovery token sent to your email.');
      return;
    }
    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setError(null);
    startTransition(() => {
      setTimeout(() => {
        setIsSuccess(true);
        confetti({
          particleCount: 50,
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
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-[#25352B] tracking-tight">
            Set New Password
          </h1>
          <p className="text-xs text-[#647067] leading-relaxed">
            Create a secure new password for your verified ShikshaSetu account.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#DC2626] flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="space-y-4 py-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 rounded-xl bg-[#EEF7F0] border border-[#78B98A]/30 text-xs text-[#1B4D2F] space-y-1.5 text-left">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#4F9D69]" />
                <span>Password Successfully Updated</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#4E5C53]">
                Your account credentials have been securely updated. You can now sign in using your new credentials.
              </p>
            </div>

            <Link
              href="/auth/login"
              className="w-full py-2.5 rounded-xl bg-[#4F9D69] hover:bg-[#3E8555] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In to Your Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-[#25352B] mb-1.5">
                Recovery Token / Verification Code
              </label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter 6-digit code or reset token"
                className="w-full px-3.5 py-2 text-xs border border-[#E2E8E0] rounded-xl focus:outline-none focus:border-[#4F9D69] focus:bg-white bg-[#FAFBF9] text-[#25352B] transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#25352B] mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-3.5 pr-10 py-2 text-xs border border-[#E2E8E0] rounded-xl focus:outline-none focus:border-[#4F9D69] focus:bg-white bg-[#FAFBF9] text-[#25352B] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E9990] hover:text-[#25352B] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#25352B] mb-1.5">
                Confirm New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className="w-full px-3.5 py-2 text-xs border border-[#E2E8E0] rounded-xl focus:outline-none focus:border-[#4F9D69] focus:bg-white bg-[#FAFBF9] text-[#25352B] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 rounded-xl bg-[#4F9D69] hover:bg-[#3E8555] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isPending ? 'Updating Credentials...' : 'Set New Password'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div className="pt-2">
          <Link
            href="/auth/login"
            className="text-xs font-semibold text-[#4F9D69] hover:underline"
          >
            Cancel and Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

