'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export function PrintCertificateButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 w-fit cursor-pointer print:hidden"
    >
      <Printer className="w-4 h-4" />
      <span>Print Certificate</span>
    </button>
  );
}
