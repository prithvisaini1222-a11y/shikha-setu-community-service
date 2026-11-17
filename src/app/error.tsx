'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('ShikshaSetu Error Boundary caught error:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 bg-[#F8FAF8]">
      <div className="max-w-md w-full bg-white p-8 rounded-[16px] border border-[#E2E8E0] shadow-xs text-center">
        <div className="w-12 h-12 rounded-full bg-[#FEF2F2] border border-[#FCA5A5] flex items-center justify-center text-[#991B1B] mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-[#18261E]">Something went wrong</h1>
        <p className="text-xs text-[#4E5C53] mt-2 leading-relaxed">
          An unexpected issue occurred while loading this page. Our team has been notified.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-4 py-2 rounded-[10px] bg-[#2E7D4E] text-white text-xs font-semibold hover:bg-[#24663F] flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-4 py-2 rounded-[10px] border border-[#E2E8E0] bg-[#F4F7F4] text-[#4E5C53] text-xs font-semibold hover:bg-white hover:text-[#18261E] flex items-center justify-center gap-1.5 transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
