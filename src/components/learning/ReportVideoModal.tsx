'use client';

import React, { useState } from 'react';
import { reportVideoAction } from '@/actions/learning';
import { Button } from '@/components/ui/atoms';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

interface ReportVideoModalProps {
  videoId: string;
  videoTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportVideoModal({
  videoId,
  videoTitle,
  isOpen,
  onClose,
}: ReportVideoModalProps) {
  const [reason, setReason] = useState('Wrong topic');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await reportVideoAction({ videoId, reason, details });
      if (res.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          onClose();
        }, 1800);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const reportReasons = [
    'Wrong topic / Not matching chapter',
    'Wrong class level',
    'Inappropriate for school children',
    'Misleading or clickbait title',
    'Poor audio or video quality',
    'Other reason',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs modal-backdrop-anim">
      <div className="bg-white rounded-[18px] border border-[#E2E8E0] shadow-xl w-full max-w-md p-6 modal-dialog-anim relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#4E5C53] hover:text-[#18261E] hover:bg-[#F8FAF8] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EBF5EE] text-[#1B4D2F] mx-auto flex items-center justify-center animate-check-pop">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#18261E]">Report Submitted</h3>
            <p className="text-xs text-[#4E5C53] max-w-xs mx-auto">
              Thank you for keeping ShikshaSetu safe. Our admin moderation team will review this video.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-[#991B1B]">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-base font-bold text-[#18261E]">Report this Video</h3>
            </div>

            <p className="text-xs text-[#4E5C53]">
              Reporting: <strong className="text-[#18261E] font-semibold truncate block">{videoTitle}</strong>
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#18261E] block">Reason for Report</label>
              <div className="space-y-1.5">
                {reportReasons.map((r) => (
                  <label
                    key={r}
                    className={`flex items-center gap-2.5 p-2.5 rounded-[10px] border text-xs cursor-pointer transition-all ${
                      reason === r
                        ? 'border-[#2E7D4E] bg-[#EBF5EE] text-[#1B4D2F] font-medium'
                        : 'border-[#E2E8E0] hover:bg-[#F4F7F4] text-[#18261E]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r}
                      checked={reason === r}
                      onChange={(e) => setReason(e.target.value)}
                      className="accent-[#2E7D4E]"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#18261E] block">Additional Details (Optional)</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain what is incorrect or inappropriate..."
                rows={3}
                className="w-full text-xs p-3 rounded-[10px] border border-[#E2E8E0] focus:outline-none focus:border-[#2E7D4E] bg-[#F4F7F4]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                isLoading={loading}
                className="bg-[#D97706] hover:bg-[#B45309] text-white"
              >
                Submit Report
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
