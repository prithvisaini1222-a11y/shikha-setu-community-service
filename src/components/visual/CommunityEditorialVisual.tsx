'use client';

import React from 'react';

interface CommunityEditorialVisualProps {
  className?: string;
}

export function CommunityEditorialVisual({ className = '' }: CommunityEditorialVisualProps) {
  return (
    <div
      className={`relative w-full h-full select-none flex items-center justify-center p-2 sm:p-4 ${className}`}
      aria-label="Community Education Ecosystem: Learner, Volunteer, Institution, and Donor connected through open learning"
    >
      {/* Embedded scoped animation styles for calm, subtle motion */}
      <style>{`
        @keyframes gentle-drift {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        @keyframes gentle-drift-alt {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(3px);
          }
        }
        @keyframes flow-dash {
          to {
            stroke-dashoffset: -28;
          }
        }
        @keyframes soft-pulse-aura {
          0%, 100% {
            opacity: 0.45;
            transform: scale(1);
          }
          50% {
            opacity: 0.75;
            transform: scale(1.03);
          }
        }
        @keyframes pulse-dot {
          0%, 100% {
            r: 3;
            opacity: 0.6;
          }
          50% {
            r: 4.5;
            opacity: 1;
          }
        }
        .anim-book {
          animation: gentle-drift 6s ease-in-out infinite;
          transform-origin: center center;
        }
        .anim-learner {
          animation: gentle-drift 5.5s ease-in-out 0.4s infinite;
          transform-origin: 110px 85px;
        }
        .anim-teacher {
          animation: gentle-drift-alt 5.8s ease-in-out 0.8s infinite;
          transform-origin: 410px 85px;
        }
        .anim-donor {
          animation: gentle-drift-alt 6.2s ease-in-out 1.2s infinite;
          transform-origin: 110px 235px;
        }
        .anim-institution {
          animation: gentle-drift 5.6s ease-in-out 1.6s infinite;
          transform-origin: 410px 235px;
        }
        .anim-flow {
          stroke-dasharray: 4 6;
          animation: flow-dash 18s linear infinite;
        }
        .anim-pulse-aura {
          animation: soft-pulse-aura 4s ease-in-out infinite;
          transform-origin: 260px 160px;
        }
        @media (prefers-reduced-motion: reduce) {
          .anim-book, .anim-learner, .anim-teacher, .anim-donor, .anim-institution, .anim-flow, .anim-pulse-aura {
            animation: none !important;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 520 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-full max-h-full drop-shadow-xs"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle Ambient Radial Gradients */}
          <radialGradient id="grad-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EEF7F0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#EEF7F0" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="grad-book-glow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F7FAF8" />
            <stop offset="100%" stopColor="#EEF4F0" />
          </radialGradient>

          {/* Linear Gradients for Soft Paper & Silhouettes */}
          <linearGradient id="grad-page-left" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F5F8F5" />
          </linearGradient>

          <linearGradient id="grad-page-right" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#EDF3EE" />
          </linearGradient>

          <linearGradient id="grad-green-primary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F9D69" />
            <stop offset="100%" stopColor="#357A4C" />
          </linearGradient>

          <linearGradient id="grad-green-soft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78B98A" />
            <stop offset="100%" stopColor="#4F9D69" />
          </linearGradient>

          <linearGradient id="grad-blue-subtle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#85ADE0" />
            <stop offset="100%" stopColor="#5E8BC2" />
          </linearGradient>

          <linearGradient id="grad-flow-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78B98A" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#4F9D69" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#78B98A" stopOpacity="0.45" />
          </linearGradient>

          {/* Soft Filter Dropshadow */}
          <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#25352B" floodOpacity="0.06" />
          </filter>

          <filter id="card-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#25352B" floodOpacity="0.05" />
          </filter>
        </defs>

        {/* 1. AMBIENT BACKGROUND GLOWS */}
        <circle cx="260" cy="160" r="140" fill="url(#grad-center)" className="anim-pulse-aura" />
        <circle cx="110" cy="85" r="48" fill="#EEF7F0" fillOpacity="0.6" />
        <circle cx="410" cy="85" r="48" fill="#EEF7F0" fillOpacity="0.6" />
        <circle cx="110" cy="235" r="48" fill="#F4F8F4" fillOpacity="0.6" />
        <circle cx="410" cy="235" r="48" fill="#F0F5FA" fillOpacity="0.6" />

        {/* 2. SUBTLE CONNECTING FLOW LINES (LEARN → TEACH → SUPPORT → IMPACT) */}
        <g stroke="#78B98A" strokeWidth="1.25" strokeLinecap="round" opacity="0.8">
          {/* Learner ↔ Central Book */}
          <path
            d="M 138 100 C 180 120, 200 135, 230 148"
            fill="none"
            className="anim-flow"
          />
          {/* Teacher ↔ Central Book */}
          <path
            d="M 382 100 C 340 120, 320 135, 290 148"
            fill="none"
            className="anim-flow"
          />
          {/* Donor ↔ Central Book */}
          <path
            d="M 138 220 C 180 200, 200 185, 230 172"
            fill="none"
            className="anim-flow"
          />
          {/* Institution ↔ Central Book */}
          <path
            d="M 382 220 C 340 200, 320 185, 290 172"
            fill="none"
            className="anim-flow"
          />

          {/* Outer Peripheral Connections: Learner ↔ Donor, Teacher ↔ Institution */}
          <path
            d="M 110 118 C 104 155, 104 165, 110 202"
            fill="none"
            strokeDasharray="3 5"
            opacity="0.35"
          />
          <path
            d="M 410 118 C 416 155, 416 165, 410 202"
            fill="none"
            strokeDasharray="3 5"
            opacity="0.35"
          />

          {/* Gentle Overhead Cross-Arc (Learner ↔ Teacher via Knowledge) */}
          <path
            d="M 142 80 C 200 52, 320 52, 378 80"
            fill="none"
            strokeDasharray="3 6"
            opacity="0.25"
          />
          {/* Gentle Lower Cross-Arc (Donor ↔ Institution via Support) */}
          <path
            d="M 142 240 C 200 268, 320 268, 378 240"
            fill="none"
            strokeDasharray="3 6"
            opacity="0.25"
          />
        </g>

        {/* Junction Nodes / Floating Seed Particles */}
        <circle cx="185" cy="126" r="3" fill="#4F9D69" opacity="0.75" />
        <circle cx="335" cy="126" r="3" fill="#4F9D69" opacity="0.75" />
        <circle cx="185" cy="194" r="3" fill="#4F9D69" opacity="0.75" />
        <circle cx="335" cy="194" r="3" fill="#6E9AD6" opacity="0.75" />

        {/* 3. CENTRAL OPEN BOOK / LEARNING CORE */}
        <g className="anim-book" filter="url(#soft-shadow)">
          {/* Grounding Under-Shadow */}
          <ellipse cx="260" cy="204" rx="72" ry="12" fill="#25352B" fillOpacity="0.07" />

          {/* Hard Cover Base (Natural Forest Green) */}
          <path
            d="M 260 188 L 192 176 L 192 184 L 260 196 Z"
            fill="#1E3324"
          />
          <path
            d="M 260 188 L 328 176 L 328 184 L 260 196 Z"
            fill="#2D4C36"
          />

          {/* Stacked Paper Block (Layered Depth) */}
          <path
            d="M 260 185 L 194 173 L 194 180 L 260 192 Z"
            fill="#E5EAE3"
          />
          <path
            d="M 260 185 L 326 173 L 326 180 L 260 192 Z"
            fill="#ECEFEA"
          />

          {/* Left Open Page (Smooth Curvature) */}
          <path
            d="M 260 182 C 235 168, 204 167, 196 170 L 196 142 C 204 139, 235 140, 260 154 Z"
            fill="url(#grad-page-left)"
            stroke="#DCE5DC"
            strokeWidth="1"
          />

          {/* Right Open Page (Smooth Curvature) */}
          <path
            d="M 260 182 C 285 168, 316 167, 324 170 L 324 142 C 316 139, 285 140, 260 154 Z"
            fill="url(#grad-page-right)"
            stroke="#DCE5DC"
            strokeWidth="1"
          />

          {/* Central Book Spine Curvature */}
          <path
            d="M 260 154 L 260 182"
            stroke="#C8D4C8"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Delicate Content Lines on Left Page */}
          <g stroke="#CBD6CB" strokeWidth="1.5" strokeLinecap="round" opacity="0.75">
            <line x1="208" y1="149" x2="246" y2="159" />
            <line x1="208" y1="156" x2="243" y2="166" />
            <line x1="208" y1="163" x2="238" y2="173" />
          </g>

          {/* Delicate Content Lines on Right Page */}
          <g stroke="#CBD6CB" strokeWidth="1.5" strokeLinecap="round" opacity="0.75">
            <line x1="274" y1="159" x2="312" y2="149" />
            <line x1="277" y1="166" x2="312" y2="156" />
            <line x1="282" y1="173" x2="312" y2="163" />
          </g>

          {/* Bookmark Ribbon Dropping Gracefully */}
          <path
            d="M 260 154 C 262 165, 259 185, 263 206 L 268 203 L 273 206 C 270 188, 267 165, 264 154 Z"
            fill="url(#grad-green-primary)"
          />

          {/* Subtle Floating Knowledge Leaves (Growth & Learning) */}
          <g opacity="0.9">
            {/* Center Leaf */}
            <path
              d="M 260 126 C 255 131, 255 138, 260 142 C 265 138, 265 131, 260 126 Z"
              fill="url(#grad-green-soft)"
            />
            <path
              d="M 260 129 L 260 141"
              stroke="#FFFFFF"
              strokeWidth="0.75"
              strokeLinecap="round"
              opacity="0.8"
            />
            {/* Tiny accent leaf left */}
            <path
              d="M 246 132 C 242 135, 243 140, 247 143 C 250 140, 249 135, 246 132 Z"
              fill="#78B98A"
              opacity="0.7"
            />
            {/* Tiny accent leaf right */}
            <path
              d="M 274 132 C 271 135, 270 140, 273 143 C 278 140, 277 135, 274 132 Z"
              fill="#78B98A"
              opacity="0.7"
            />
          </g>
        </g>

        {/* 4. FOUR ABSTRACT COMMUNITY PILLARS (LEARNER • TEACHER • DONOR • INSTITUTION) */}

        {/* --- A. LEARNER (Top-Left) --- */}
        <g className="anim-learner" filter="url(#card-shadow)">
          {/* Base Pedestal / Circle Aura */}
          <circle cx="110" cy="85" r="32" fill="#FFFFFF" stroke="#E2E8E0" strokeWidth="1.25" />
          <circle cx="110" cy="85" r="26" fill="#F2F8F4" />

          {/* Abstract Minimalist Learner Silhouette (Reading/Growing) */}
          <g>
            {/* Head */}
            <circle cx="110" cy="72" r="6.5" fill="url(#grad-green-primary)" />
            {/* Body / Shoulders */}
            <path
              d="M 98 94 C 98 84, 122 84, 122 94 Z"
              fill="url(#grad-green-primary)"
            />
            {/* Minimal open notebook held in hands */}
            <path
              d="M 104 88 L 110 86 L 116 88 L 110 90 Z"
              fill="#FFFFFF"
              stroke="#25352B"
              strokeWidth="0.75"
            />
          </g>

          {/* Growth Sprout Badge Accent */}
          <circle cx="132" cy="70" r="7.5" fill="#EEF7F0" stroke="#78B98A" strokeWidth="1" />
          <path
            d="M 132 66 C 130 68, 130 71, 132 73 C 134 71, 134 68, 132 66 Z"
            fill="#4F9D69"
          />
        </g>

        {/* --- B. TEACHER / VOLUNTEER (Top-Right) --- */}
        <g className="anim-teacher" filter="url(#card-shadow)">
          {/* Base Pedestal / Circle Aura */}
          <circle cx="410" cy="85" r="32" fill="#FFFFFF" stroke="#E2E8E0" strokeWidth="1.25" />
          <circle cx="410" cy="85" r="26" fill="#F2F8F4" />

          {/* Abstract Minimalist Educator Silhouette (Guiding/Mentoring) */}
          <g>
            {/* Head */}
            <circle cx="410" cy="72" r="6.5" fill="#25352B" />
            {/* Minimal Educator Mortarboard / Knowledge Cap */}
            <path
              d="M 403 66 L 410 63.5 L 417 66 L 410 68.5 Z"
              fill="url(#grad-green-primary)"
            />
            <path
              d="M 416 67 L 416 71"
              stroke="url(#grad-green-primary)"
              strokeWidth="1"
              strokeLinecap="round"
            />
            {/* Body / Shoulders */}
            <path
              d="M 398 94 C 398 84, 422 84, 422 94 Z"
              fill="#25352B"
            />
            {/* Guiding Pointer Accent */}
            <line
              x1="416"
              y1="86"
              x2="425"
              y2="80"
              stroke="#4F9D69"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>

          {/* Lightbulb / Wisdom Accent */}
          <circle cx="432" cy="70" r="7.5" fill="#EEF7F0" stroke="#78B98A" strokeWidth="1" />
          <path
            d="M 432 66 C 430 66, 429 68, 430 70 L 434 70 C 435 68, 434 66, 432 66 Z"
            fill="#4F9D69"
          />
          <line x1="431" y1="72" x2="433" y2="72" stroke="#4F9D69" strokeWidth="1" />
        </g>

        {/* --- C. DONOR / SUPPORTER (Bottom-Left) --- */}
        <g className="anim-donor" filter="url(#card-shadow)">
          {/* Base Pedestal / Circle Aura */}
          <circle cx="110" cy="235" r="32" fill="#FFFFFF" stroke="#E2E8E0" strokeWidth="1.25" />
          <circle cx="110" cy="235" r="26" fill="#FAF8F3" />

          {/* Abstract Minimalist Supporter Silhouette (Giving/Empowering) */}
          <g>
            {/* Head */}
            <circle cx="110" cy="222" r="6.5" fill="#3A5C44" />
            {/* Body / Shoulders */}
            <path
              d="M 98 244 C 98 234, 122 234, 122 244 Z"
              fill="#3A5C44"
            />
            {/* Open Giving Hands Offering a Heart/Seed */}
            <path
              d="M 104 237 Q 110 240 116 237"
              stroke="#FFFFFF"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 110 231 C 108.5 229, 106 230, 106 232 C 106 234.5, 110 236.5, 110 237 C 110 236.5, 114 234.5, 114 232 C 114 230, 111.5 229, 110 231 Z"
              fill="#4F9D69"
            />
          </g>

          {/* Heart / Trust Badge Accent */}
          <circle cx="132" cy="220" r="7.5" fill="#EEF7F0" stroke="#78B98A" strokeWidth="1" />
          <path
            d="M 132 218 C 131 216.5, 129 217, 129 218.5 C 129 220.5, 132 222, 132 222.5 C 132 222, 135 220.5, 135 218.5 C 135 217, 133 216.5, 132 218 Z"
            fill="#4F9D69"
          />
        </g>

        {/* --- D. INSTITUTION / CARE HOME (Bottom-Right) --- */}
        <g className="anim-institution" filter="url(#card-shadow)">
          {/* Base Pedestal / Circle Aura */}
          <circle cx="410" cy="235" r="32" fill="#FFFFFF" stroke="#E2E8E0" strokeWidth="1.25" />
          <circle cx="410" cy="235" r="26" fill="#F0F5FA" />

          {/* Abstract Minimalist Shelter / Care Home Emblem */}
          <g>
            {/* Modern Clean Roofline */}
            <path
              d="M 397 228 L 410 218 L 423 228 Z"
              fill="url(#grad-blue-subtle)"
            />
            {/* Columns & Open Doorway (Sanctuary of Learning) */}
            <rect x="400" y="229" width="3.5" height="12" rx="1" fill="#5E8BC2" />
            <rect x="408.25" y="229" width="3.5" height="12" rx="1" fill="#5E8BC2" />
            <rect x="416.5" y="229" width="3.5" height="12" rx="1" fill="#5E8BC2" />
            {/* Base Line */}
            <path
              d="M 396 242 L 424 242"
              stroke="#5E8BC2"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>

          {/* Verified Shield Accent */}
          <circle cx="432" cy="220" r="7.5" fill="#F0F5FA" stroke="#85ADE0" strokeWidth="1" />
          <path
            d="M 432 216.5 L 435 218 C 435 221, 432 223.5, 432 223.5 C 432 223.5, 429 221, 429 218 Z"
            fill="#5E8BC2"
          />
        </g>
      </svg>
    </div>
  );
}
