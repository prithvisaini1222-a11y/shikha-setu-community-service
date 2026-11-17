'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { createDonationAction } from '@/actions/donation';
import { Badge, ProgressBar, Button } from '@/components/ui/atoms';
import { HeartHandshake, CheckCircle2, Package, Loader2, ShieldCheck, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SponsorNeedModalProps {
  need: any;
  buttonLabel?: string;
}

export function SponsorNeedModal({ need, buttonLabel = 'Support this Need' }: SponsorNeedModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(Math.min(5, Math.max(1, need.requiredQuantity - need.fulfilledQuantity)));
  const [itemDescription, setItemDescription] = useState(`Sets of ${need.title}`);
  const [notes, setNotes] = useState('');
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<any>(null);

  const remaining = Math.max(0, need.requiredQuantity - need.fulfilledQuantity);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const fd = new FormData();
      fd.append('needId', need.id);
      fd.append('quantity', String(quantity));
      fd.append('itemDescription', itemDescription);
      fd.append('notes', notes);

      const res = await createDonationAction(fd);
      setResult(res);
      if (res.success) {
        confetti({ particleCount: 60, spread: 60 });
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-[10px] bg-[#4B749F] hover:bg-[#5880d3] text-white font-semibold text-xs shadow-xs transition-all duration-200 hover:-translate-y-px hover:shadow-sm active:scale-[0.975] flex items-center gap-1.5 cursor-pointer"
      >
        <HeartHandshake className="w-3.5 h-3.5" />
        <span>{buttonLabel}</span>
      </button>

      {/* Requirement 11: Standardized Modal Animation */}
      {isOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18261E]/40 backdrop-blur-xs modal-backdrop-anim"
        >
          <div className="bg-white rounded-[16px] border border-[#E2E8E0] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-xl relative max-h-[90vh] overflow-y-auto modal-dialog-anim">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EBF5EE] text-[#1B4D2F] mb-1.5">
                  Direct CCI Support
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#18261E] leading-snug">{need.title}</h3>
                <p className="text-xs text-[#4E5C53] mt-0.5">
                  Recipient: <strong className="text-[#18261E]">{need.institution?.orgName}</strong> ({need.institution?.city})
                </p>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setResult(null);
                }}
                className="text-[#98A2B3] hover:text-[#18261E] p-1.5 rounded-[8px] hover:bg-[#F8FAF8] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {result?.success ? (
              /* Requirement 20: Success Checkmark & Animation */
              <div className="p-5 rounded-[12px] bg-[#EBF5EE] border border-[#C6E6CD] text-[#18261E] space-y-3 animate-check-pop">
                <div className="flex items-center gap-2 text-[#1B4D2F] font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#2E7D4E] animate-check-pop" />
                  <span>Sponsorship Pledged Successfully!</span>
                </div>
                <p className="text-xs leading-relaxed text-[#4E5C53]">
                  Your tracking code is{' '}
                  <strong className="font-mono text-[#18261E] bg-white px-2 py-0.5 rounded border border-[#C6E6CD]">
                    {result.trackingNumber}
                  </strong>
                  . Please dispatch the items to the care home superintendent.
                </p>

                <div className="p-3.5 rounded-[10px] bg-white border border-[#E2E8E0] text-xs space-y-1">
                  <div className="font-semibold text-[#18261E]">Delivery Destination:</div>
                  <div className="text-[#4E5C53]">{need.institution?.orgName}</div>
                  <div className="text-[#4E5C53]">{need.location}</div>
                  <div className="text-[11px] text-[#2E7D4E] font-medium flex items-center gap-1 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D4E]" />
                    Verified Superintendent will audit on receipt
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsOpen(false);
                      setResult(null);
                    }}
                    className="bg-[#2E7D4E] hover:bg-[#24663F] text-white"
                  >
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {result?.error && (
                  <div className="p-3 rounded-[10px] bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs">
                    {result.error}
                  </div>
                )}

                <div className="p-4 rounded-[12px] bg-[#F4F7F4] border border-[#E2E8E0] space-y-2">
                  <div className="flex justify-between text-xs text-[#4E5C53]">
                    <span>Current Need Fulfillment</span>
                    <strong className="text-[#18261E]">
                      {need.fulfilledQuantity} / {need.requiredQuantity}
                    </strong>
                  </div>
                  <ProgressBar value={need.fulfilledQuantity} max={need.requiredQuantity} color="bg-[#2E7D4E]" />
                  <span className="text-[11px] text-[#4E5C53] block">
                    Remaining required to complete: <strong>{remaining} units</strong>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18261E] mb-1.5">
                    Units You Wish to Sponsor
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={remaining > 0 ? remaining : 100}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs border border-[#E2E8E0] rounded-[10px] bg-white text-[#18261E] focus:outline-none focus:border-[#2E7D4E] focus:ring-2 focus:ring-[#2E7D4E]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18261E] mb-1.5">
                    Item / Material Description
                  </label>
                  <input
                    type="text"
                    required
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-[#E2E8E0] rounded-[10px] bg-white text-[#18261E] focus:outline-none focus:border-[#2E7D4E] focus:ring-2 focus:ring-[#2E7D4E]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18261E] mb-1.5">
                    Delivery Notes / Courier Details (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Will be shipped via India Post / Courier directly to the care home superintendent."
                    className="w-full px-3.5 py-2 text-xs border border-[#E2E8E0] rounded-[10px] bg-white text-[#18261E] focus:outline-none focus:border-[#2E7D4E] focus:ring-2 focus:ring-[#2E7D4E]/20 transition-all"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  {/* Requirement 30: Button loading without jumping width */}
                  <Button
                    type="submit"
                    size="sm"
                    isLoading={isPending}
                    loadingText="Pledging Sponsorship..."
                    className="bg-[#2E7D4E] hover:bg-[#24663F] text-white font-semibold min-w-[170px]"
                    leftIcon={<Package className="w-3.5 h-3.5" />}
                  >
                    Confirm & Pledge {quantity} Units
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
