'use client';

import React, { useState, useTransition } from 'react';
import { updateSessionStatusAction } from '@/actions/volunteer';
import { Badge, Button } from '@/components/ui/atoms';
import {
  Video,
  Users,
  CheckCircle2,
  GraduationCap,
  Mic,
  VideoOff,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VirtualClassroomRoomProps {
  session: any;
  isTeacherOrAdmin: boolean;
}

export function VirtualClassroomRoom({ session, isTeacherOrAdmin }: VirtualClassroomRoomProps) {
  const [inCall, setInCall] = useState(false);
  const [attendance, setAttendance] = useState(session.attendanceCount || 18);
  const [whiteboardNotes, setWhiteboardNotes] = useState(
    `# Live Class Session Notes\n\n- Topic: ${session.title}\n- Core Concepts: Linear Equations, Balance Method, Transposition\n- Today's Practice Problem: 4(x + 2) = 28\n  Step 1: Divide by 4 => x + 2 = 7\n  Step 2: Subtract 2 => x = 5`
  );
  const [feedback, setFeedback] = useState('');
  const [isCompleted, setIsCompleted] = useState(session.status === 'COMPLETED');
  const [isPending, startTransition] = useTransition();

  const handleFinishSession = () => {
    startTransition(async () => {
      await updateSessionStatusAction({
        sessionId: session.id,
        status: 'COMPLETED',
        attendanceCount: attendance,
        volunteerFeedback: feedback || 'Students engaged actively and solved all equations accurately.',
      });
      setIsCompleted(true);
      setInCall(false);
      confetti({ particleCount: 80, spread: 70 });
    });
  };

  return (
    <div className="bg-white rounded-[16px] border border-[#E2E8E0] shadow-xs overflow-hidden space-y-4">
      {/* Session Top Bar: Clean light style */}
      <div className="bg-[#F4F7F4] border-b border-[#E2E8E0] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF5EE] text-[#1B4D2F]">
              {session.status}
            </span>
            <span className="text-xs text-[#4E5C53] font-semibold">{session.subject} • Class {session.classLevel}</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#18261E]">{session.title}</h2>
          <p className="text-xs text-[#4E5C53] mt-0.5">
            Care Home: <strong className="text-[#18261E]">{session.institution?.orgName}</strong> ({session.institution?.city})
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!inCall && !isCompleted && (
            <Button
              onClick={() => setInCall(true)}
              size="sm"
              leftIcon={<Video className="w-4 h-4" />}
            >
              Enter Virtual Classroom
            </Button>
          )}

          {isCompleted && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-[#EBF5EE] text-[#1B4D2F] text-xs font-semibold border border-[#2E7D4E]/30">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D4E]" />
              <span>Conducted & Logged</span>
            </div>
          )}
        </div>
      </div>

      {/* Active Session Simulation Screen */}
      {inCall && !isCompleted && (
        <div className="p-4 sm:p-6 space-y-6">
          <div className="bg-[#18261E] rounded-[14px] p-6 text-white aspect-video max-h-96 flex flex-col justify-between relative shadow-inner">
            <div className="flex justify-between items-center text-xs">
              <span className="bg-[#EBF5EE] text-[#1B4D2F] px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D4E] animate-pulse" /> LIVE CLASSROOM
              </span>
              <span className="bg-white/10 backdrop-blur-xs border border-white/20 px-3 py-1 rounded-[8px] text-[11px] text-white/90">
                Connected: <strong>{attendance} Students</strong>
              </span>
            </div>

            {/* Virtual Classroom Centerpiece */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-[12px] bg-white/10 text-white flex items-center justify-center mx-auto border border-white/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">{session.title}</h3>
              <p className="text-xs text-white/70">Class {session.classLevel} Tutoring Room</p>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs">
              <div className="flex items-center gap-2">
                <button type="button" className="p-2 rounded-[8px] bg-white/10 hover:bg-white/20 text-white">
                  <Mic className="w-4 h-4" />
                </button>
                <button type="button" className="p-2 rounded-[8px] bg-white/10 hover:bg-white/20 text-white">
                  <Video className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInCall(false)}
                  className="px-3 py-1.5 rounded-[8px] bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                >
                  Minimize
                </button>
                <button
                  type="button"
                  onClick={handleFinishSession}
                  disabled={isPending}
                  className="px-4 py-1.5 rounded-[8px] bg-[#2E7D4E] hover:bg-[#24663F] text-white text-xs font-bold transition-all shadow-xs"
                >
                  {isPending ? 'Ending Session...' : 'End & Log Attendance'}
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Whiteboard & Session Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F4F7F4] p-4 rounded-[12px] border border-[#E2E8E0] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4E5C53] block">
                Session Whiteboard & Notes
              </span>
              <textarea
                rows={5}
                value={whiteboardNotes}
                onChange={(e) => setWhiteboardNotes(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#E2E8E0] rounded-[10px] text-xs font-mono text-[#18261E] focus:outline-none focus:border-[#2E7D4E]"
              />
            </div>

            <div className="bg-[#F4F7F4] p-4 rounded-[12px] border border-[#E2E8E0] space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4E5C53] block">
                Attendance & Teacher Feedback
              </span>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#4E5C53]">Students Attending:</span>
                <input
                  type="number"
                  value={attendance}
                  onChange={(e) => setAttendance(Number(e.target.value))}
                  className="w-20 px-2.5 py-1 bg-white border border-[#E2E8E0] rounded-[8px] text-center text-xs font-bold text-[#18261E] focus:outline-none focus:border-[#2E7D4E]"
                />
              </div>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Observation notes on learner progress..."
                className="w-full p-2.5 bg-white border border-[#E2E8E0] rounded-[10px] text-xs text-[#18261E] focus:outline-none focus:border-[#2E7D4E]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
