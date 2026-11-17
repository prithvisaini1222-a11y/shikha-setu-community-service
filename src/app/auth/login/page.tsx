'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginAction } from '@/actions/auth';
import { EducationPhotoSlideshow } from '@/components/auth/EducationPhotoSlideshow';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Leaf,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Calculator,
  FlaskConical,
  GraduationCap,
  Building2,
  HeartHandshake,
  Shield,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || searchParams.get('returnUrl');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginState, setLoginState] = useState<'idle' | 'signing-in' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginState !== 'idle') return;

    setError(null);
    setLoginState('signing-in');

    const fd = new FormData();
    fd.append('email', email);
    fd.append('password', password);

    try {
      const res = await loginAction(fd);
      if (res?.error) {
        setLoginState('idle');
        setError(res.error);
        return;
      }

      // Success state animation
      setLoginState('success');

      // Polished 1.2s education-focused login success transition
      setTimeout(() => {
        let destination = '/dashboard';
        if (redirectUrl && redirectUrl !== '/') {
          destination = redirectUrl;
        } else if (res?.role === 'learner') {
          destination = '/dashboard/learner?welcome=true';
        } else if (res?.role) {
          destination = `/dashboard/${res.role}`;
        }
        router.push(destination);
        router.refresh();
      }, 1200);
    } catch (err: any) {
      if (err?.message === 'NEXT_REDIRECT') return;
      setLoginState('idle');
      setError('Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-[#F8F7F2] text-[#25352B] flex items-center justify-center p-4 sm:p-6 lg:p-10 selection:bg-[#EEF7F0] selection:text-[#4F9D69] relative">
      {/* POLISHED EDUCATION-FOCUSED LOGIN SUCCESS OVERLAY (Requirement 3) */}
      {loginState === 'success' && (
        <div className="fixed inset-0 z-50 bg-[#F8F7F2]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
          <div className="max-w-sm w-full bg-white p-8 rounded-3xl border border-[#E2E8E0] shadow-xl flex flex-col items-center space-y-5 animate-in zoom-in-95 duration-400">
            {/* ShikshaSetu Leaf Logo Motion */}
            <div className="w-16 h-16 rounded-2xl bg-[#4F9D69] text-white flex items-center justify-center shadow-md animate-soft-pulse">
              <Leaf className="w-8 h-8 fill-current" />
            </div>

            {/* Subtle Educational Elements Entering */}
            <div className="flex items-center gap-2.5 text-[#4F9D69]">
              <span className="px-2.5 py-1 rounded-xl bg-[#EEF7F0] border border-[#78B98A]/30 animate-float-gentle text-xs font-bold inline-flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#4F9D69]" />
                <span>Books</span>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-[#EEF7F0] border border-[#78B98A]/30 animate-float-gentle-alt text-xs font-bold inline-flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-[#4F9D69]" />
                <span>π & ∑</span>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-[#EEF7F0] border border-[#78B98A]/30 animate-float-gentle text-xs font-bold inline-flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-[#4F9D69]" />
                <span>Science</span>
              </span>
            </div>

            {/* Typography */}
            <div className="space-y-1">
              <h3 className="text-xl font-black text-[#25352B] tracking-tight">
                Welcome to ShikshaSetu
              </h3>
              <p className="text-xs text-[#647067] font-medium">
                Your learning space is being prepared...
              </p>
            </div>

            {/* Smooth Progress Bar */}
            <div className="w-48 bg-[#EEF2ED] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#4F9D69] h-full rounded-full w-full animate-pulse transition-all duration-1000" />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white border border-[#E2E8E0] shadow-sm overflow-hidden min-h-[620px]">
        {/* LEFT COLUMN: BRANDING & VISUAL */}
        <div className="lg:col-span-6 bg-gradient-to-b from-[#F2F7F3] via-[#FAFBF9] to-[#EEF7F0] p-8 sm:p-10 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E2E8E0]">
          {/* Brand Header */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#4F9D69] text-white flex items-center justify-center shadow-xs group-hover:bg-[#3E8555] transition-transform group-hover:scale-105">
                <Leaf className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-[#25352B]">
                  Shiksha<span className="text-[#4F9D69]">Setu</span>
                </span>
                <span className="block text-[10px] font-semibold text-[#647067] tracking-wider uppercase">
                  Connect • Teach • Give
                </span>
              </div>
            </Link>

            <div className="space-y-2 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#4F9D69] text-xs font-semibold border border-[#E2E8E0] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#4F9D69]" />
                <span>Verified Education Network</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#25352B] tracking-tight leading-tight">
                Learn. Teach. Give. <br />
                <span className="text-[#4F9D69]">Make an Impact.</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#647067] leading-relaxed max-w-md">
                Connecting children, volunteer educators, verified care institutions, and donors through a transparent, high-trust ecosystem.
              </p>
            </div>
          </div>

          {/* Education Photo Slideshow Card */}
          <div className="my-6 py-2">
            <div className="h-64 sm:h-72 w-full rounded-2xl border border-[#E2E8E0] overflow-hidden shadow-2xs relative bg-[#FAFBF9]">
              <EducationPhotoSlideshow className="w-full h-full" />
            </div>
          </div>

          {/* Trust Safeguards */}
          <div className="pt-4 border-t border-[#E2E8E0]/70 flex flex-wrap items-center gap-4 text-[11px] text-[#647067]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4F9D69]" />
              <span>Verified Institutions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4F9D69]" />
              <span>Child-Safe UI</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4F9D69]" />
              <span>80G Tax-Exempt</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN CARD */}
        <div className="lg:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-[#25352B] tracking-tight">
                Sign In
              </h2>
              <p className="text-xs sm:text-sm text-[#647067]">
                {redirectUrl
                  ? 'Sign in to continue to your requested learning destination.'
                  : 'Enter your credentials to access your personal workspace.'}
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#25352B]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8E9990] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.org"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8E0] focus:border-[#4F9D69] focus:ring-2 focus:ring-[#EEF7F0] outline-none text-xs sm:text-sm text-[#25352B] transition-all bg-[#FAFBF9] focus:bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#25352B]">
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-[#4F9D69] hover:underline font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8E9990] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E2E8E0] focus:border-[#4F9D69] focus:ring-2 focus:ring-[#EEF7F0] outline-none text-xs sm:text-sm text-[#25352B] transition-all bg-[#FAFBF9] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-[#8E9990] hover:text-[#25352B] cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Primary CTA: Sign In */}
              <button
                type="submit"
                disabled={loginState !== 'idle'}
                className={`w-full py-3 px-6 rounded-xl font-semibold text-xs sm:text-sm shadow-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  loginState === 'signing-in'
                    ? 'bg-[#4F9D69] text-white opacity-90 cursor-wait'
                    : 'bg-[#4F9D69] hover:bg-[#3E8555] text-white btn-primary-lift'
                }`}
              >
                {loginState === 'signing-in' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Role Fill for Demonstrations & Testing */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#647067]">Quick Role Access (Demo Credentials):</span>
                  <span className="text-[10px] text-[#2E7D4E] font-bold bg-[#EEF7F0] px-2 py-0.5 rounded-full">
                    Real Auth
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('aarav.learner@shikshasetu.org');
                      setPassword('demo1234');
                    }}
                    className="py-1.5 px-2 rounded-lg bg-white border border-[#E2E8E0] hover:border-[#78B98A] text-[#25352B] font-medium text-left truncate cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#4F9D69] shrink-0" />
                    <span>Learner</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('priya.volunteer@shikshasetu.org');
                      setPassword('demo1234');
                    }}
                    className="py-1.5 px-2 rounded-lg bg-white border border-[#E2E8E0] hover:border-[#78B98A] text-[#25352B] font-medium text-left truncate cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-[#4F9D69] shrink-0" />
                    <span>Volunteer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('ashakiran@shikshasetu.org');
                      setPassword('demo1234');
                    }}
                    className="py-1.5 px-2 rounded-lg bg-white border border-[#E2E8E0] hover:border-[#78B98A] text-[#25352B] font-medium text-left truncate cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#4F9D69] shrink-0" />
                    <span>Institution</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('rajesh.donor@shikshasetu.org');
                      setPassword('demo1234');
                    }}
                    className="py-1.5 px-2 rounded-lg bg-white border border-[#E2E8E0] hover:border-[#78B98A] text-[#25352B] font-medium text-left truncate cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <HeartHandshake className="w-3.5 h-3.5 text-[#4F9D69] shrink-0" />
                    <span>Donor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('admin@shikshasetu.org');
                      setPassword('demo1234');
                    }}
                    className="py-1.5 px-2 rounded-lg bg-white border border-[#E2E8E0] hover:border-[#78B98A] text-[#25352B] font-medium text-left truncate cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#4F9D69] shrink-0" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Bottom Link: Don't have an account? Create account */}
            <div className="pt-4 border-t border-[#E2E8E0]/60 text-center text-xs text-[#647067]">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="font-bold text-[#4F9D69] hover:underline"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8F7F2]">
          <div className="w-8 h-8 border-2 border-[#4F9D69] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
