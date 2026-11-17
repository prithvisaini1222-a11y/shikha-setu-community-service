import React from 'react';
import Link from 'next/link';
import { Compass, Home, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 bg-[#F8FAF8]">
      <div className="max-w-md w-full bg-white p-8 rounded-[16px] border border-[#E2E8E0] shadow-xs text-center">
        <div className="w-12 h-12 rounded-full bg-[#FEF9ED] border border-[#FDE5A9] flex items-center justify-center text-[#8C6013] mx-auto mb-4">
          <Compass className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-[#18261E]">404 - Page Not Found</h1>
        <p className="text-xs text-[#4E5C53] mt-1.5 leading-relaxed">
          The educational lesson, need, or resource you were looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-4 py-2 rounded-[10px] bg-[#2E7D4E] text-white text-xs font-semibold hover:bg-[#24663F] flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/learn"
            className="w-full sm:w-auto px-4 py-2 rounded-[10px] border border-[#E2E8E0] bg-[#F4F7F4] text-[#4E5C53] text-xs font-semibold hover:bg-white hover:text-[#18261E] flex items-center justify-center gap-1.5 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Learning Hub</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
