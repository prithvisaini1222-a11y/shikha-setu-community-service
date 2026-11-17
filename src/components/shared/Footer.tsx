'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, Award, Globe, Leaf } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#F0EFEA] mt-10 sm:mt-12 border-t border-[#E2E8E0] text-[#647067]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: ShikshaSetu Brand */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-[#4F9D69] text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:bg-[#3E8555] transition-colors">
                <Leaf className="w-4 h-4 fill-current" />
              </div>
              <span className="text-xl font-bold text-[#25352B] tracking-tight">
                Shiksha<span className="text-[#4F9D69]">Setu</span>
              </span>
            </Link>
            <p className="text-xs text-[#647067] leading-relaxed">
              Bridging grassroots classrooms with passionate mentors, authentic resources, and measurable social impact.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF7F0] text-[#4F9D69] text-[11px] font-bold border border-[#78B98A]/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>verified non-profit</span>
              </span>
            </div>
          </div>

          {/* Column 2: Ecosystem */}
          <div>
            <div className="text-xs font-bold uppercase text-[#25352B] tracking-wider mb-4">
              Ecosystem
            </div>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link className="text-[#647067] hover:text-[#4F9D69] transition-colors" href="/learn">
                  Learning Hub
                </Link>
              </li>
              <li>
                <Link className="text-[#647067] hover:text-[#4F9D69] transition-colors" href="/teach">
                  Teach For A Day
                </Link>
              </li>
              <li>
                <Link className="text-[#647067] hover:text-[#4F9D69] transition-colors" href="/needs">
                  Classroom Needs
                </Link>
              </li>
              <li>
                <Link className="text-[#647067] hover:text-[#4F9D69] transition-colors" href="/impact">
                  Impact Analytics
                </Link>
              </li>
              <li>
                <Link className="text-[#647067] hover:text-[#4F9D69] transition-colors" href="/career">
                  Career Exploration
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Ethics */}
          <div>
            <div className="text-xs font-bold uppercase text-[#25352B] tracking-wider mb-4">
              Trust & Ethics
            </div>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link className="text-[#647067] hover:text-[#4F9D69] transition-colors" href="/about">
                  Transparency Charter
                </Link>
              </li>
              <li>
                <Link className="text-[#647067] hover:text-[#4F9D69] transition-colors" href="/about">
                  School Verification
                </Link>
              </li>
              <li>
                <Link className="text-[#647067] hover:text-[#4F9D69] transition-colors" href="/about">
                  Child Safety Protocols
                </Link>
              </li>
              <li>
                <Link className="text-[#647067] hover:text-[#4F9D69] transition-colors" href="/certificates/verify/CERT-SS-2026-8942">
                  Digital Certificates
                </Link>
              </li>
              <li>
                <Link className="text-[#647067] hover:text-[#4F9D69] transition-colors font-medium text-[#4F9D69]" href="/contact">
                  Support & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Stay Connected */}
          <div>
            <div className="text-xs font-bold uppercase text-[#25352B] tracking-wider mb-4">
              Stay Connected
            </div>
            <p className="text-xs text-[#647067] mb-3">
              Subscribe for monthly grassroots updates and volunteer field dispatches.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex items-center gap-1.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-3 py-2 bg-white text-[#25352B] text-xs rounded-lg border border-[#E2E8E0] focus:border-[#4F9D69] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4F9D69] text-white text-xs font-bold rounded-lg hover:bg-[#3E8555] transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  Join
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-[#4F9D69] font-medium animate-in fade-in flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Thank you for subscribing to field dispatches!</span>
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#E2E8E0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#647067]">
          <p>© {new Date().getFullYear()} ShikshaSetu Foundation. Dedicated to educational equity.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4F9D69]" />
              ISO 9001 Certified
            </span>
            <span className="inline-flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-[#6E9AD6]" />
              GuideStar Platinum
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
