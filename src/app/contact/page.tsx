'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  Building2,
  GraduationCap,
  HeartHandshake,
  ArrowRight,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('VOLUNTEER');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    startTransition(() => {
      // Record simulated response
      setTimeout(() => {
        setSubmitted(true);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }, 400);
    });
  };

  const contactChannels = [
    {
      title: 'Institutional Onboarding',
      icon: Building2,
      desc: 'For Child Care Institutions seeking verification, need publishing, or classroom connectivity.',
      email: 'institutions@shikshasetu.org',
      response: 'Within 24 business hours'
    },
    {
      title: 'Volunteer & Educator Desk',
      icon: GraduationCap,
      desc: 'Questions regarding online/offline teaching, scheduling, background verification, or certificates.',
      email: 'volunteer@shikshasetu.org',
      response: 'Within 12 business hours'
    },
    {
      title: 'Donor & CSR Partnerships',
      icon: HeartHandshake,
      desc: 'Corporate CSR partnerships, 80G tax receipts, textbook drives, and sponsored tablet kits.',
      email: 'giving@shikshasetu.org',
      response: 'Same-day assistance'
    },
    {
      title: 'Child Safety & Grievance',
      icon: ShieldCheck,
      desc: 'Direct confidential channel to our statutory POCSO & Child Protection Compliance Officer.',
      email: 'safety@shikshasetu.org',
      response: 'Immediate priority handling'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#25352B] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF7F0] text-[#4F9D69] text-xs font-bold border border-[#78B98A]/30">
            <MessageSquare className="w-3.5 h-3.5 text-[#4F9D69]" />
            <span>Support & Community Inquiries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#25352B]">
            We&apos;re here to assist your educational mission.
          </h1>
          <p className="text-sm sm:text-base text-[#647067] leading-relaxed">
            Whether you represent a Child Care Institution, want to volunteer your teaching skills, or need assistance with donations and receipts, our support team is available.
          </p>
        </div>

        {/* 2-Column Grid: Left Channels / Right Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Inquiries (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactChannels.map((c, idx) => {
                const Icon = c.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-[#E2E8E0] shadow-xs space-y-3 hover:border-[#78B98A] transition-all"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#EEF7F0] text-[#4F9D69] flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-[#25352B]">{c.title}</h3>
                      <p className="text-xs text-[#647067] leading-relaxed line-clamp-2">{c.desc}</p>
                    </div>
                    <div className="pt-2 border-t border-[#F0F3EF] flex flex-col gap-1 text-[11px]">
                      <span className="font-semibold text-[#4F9D69]">{c.email}</span>
                      <span className="text-[#8E9990] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {c.response}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Registered Secretariat Office Info */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8E0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F0F4EE] text-[#4F9D69] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-[#25352B]">National Secretariat & Coordination Desk</h4>
                  <p className="text-xs text-[#647067]">
                    ShikshaSetu Foundation, Institutional Area, Lodhi Road, New Delhi — 110003
                  </p>
                  <p className="text-[11px] text-[#8E9990]">Registered Non-Profit Under Section 8 • 80G Certified</p>
                </div>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="text-xs font-bold text-[#25352B] block">+91 (011) 2468-9800</span>
                <span className="text-[11px] text-[#4F9D69] font-medium">Mon–Sat • 9:30 AM – 6:30 PM IST</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8E0] shadow-xs">
            {submitted ? (
              <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-[#EEF7F0] text-[#4F9D69] flex items-center justify-center mx-auto shadow-xs border border-[#78B98A]/30">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#25352B]">Message Received</h3>
                  <p className="text-xs text-[#647067] max-w-xs mx-auto leading-relaxed">
                    Thank you, <strong className="text-[#25352B]">{name}</strong>. Your inquiry has been routed to our coordination desk. A representative will contact you at <strong className="text-[#25352B]">{email}</strong> shortly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setMessage('');
                    setSubject('');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#4F9D69] bg-[#EEF7F0] hover:bg-[#C8E6C9] transition-colors cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-[#E2E8E0] pb-3">
                  <h3 className="text-base font-bold text-[#25352B]">Send an Inquiry</h3>
                  <p className="text-xs text-[#647067]">Directly message our community support coordinators.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#25352B] mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Smt. Vandana Sharma"
                    className="w-full px-3.5 py-2 text-xs border border-[#E2E8E0] rounded-xl focus:outline-none focus:border-[#4F9D69] focus:bg-white bg-[#FAFBF9] text-[#25352B] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#25352B] mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.org"
                    className="w-full px-3.5 py-2 text-xs border border-[#E2E8E0] rounded-xl focus:outline-none focus:border-[#4F9D69] focus:bg-white bg-[#FAFBF9] text-[#25352B] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#25352B] mb-1">
                    Your Engagement Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-[#E2E8E0] rounded-xl focus:outline-none focus:border-[#4F9D69] focus:bg-white bg-[#FAFBF9] text-[#25352B] transition-colors"
                  >
                    <option value="VOLUNTEER">Volunteer Educator / Mentor</option>
                    <option value="INSTITUTION">Child Care Institution (CCI) Representative</option>
                    <option value="DONOR">Educational Donor / CSR Representative</option>
                    <option value="GENERAL">Student / General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#25352B] mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Inquiry regarding Weekend Teaching Sessions"
                    className="w-full px-3.5 py-2 text-xs border border-[#E2E8E0] rounded-xl focus:outline-none focus:border-[#4F9D69] focus:bg-white bg-[#FAFBF9] text-[#25352B] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#25352B] mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please specify how we can help your institution or volunteering journey..."
                    className="w-full px-3.5 py-2 text-xs border border-[#E2E8E0] rounded-xl focus:outline-none focus:border-[#4F9D69] focus:bg-white bg-[#FAFBF9] text-[#25352B] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-2.5 rounded-xl bg-[#4F9D69] hover:bg-[#3E8555] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isPending ? 'Transmitting...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

