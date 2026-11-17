'use client';

import React from 'react';
import { Calculator, FlaskConical, Globe, BookOpen, PenLine, Laptop } from 'lucide-react';

interface IllustrationProps {
  className?: string;
  animateHover?: boolean;
}

/**
 * Mathematics Illustration:
 * Protractor, compass, Cartesian parabola, Pi symbol, and isometric 3D cube.
 */
export function MathIllustration({ className = 'w-24 h-24', animateHover = true }: IllustrationProps) {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className} ${animateHover ? 'group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-300' : ''}`}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
        {/* Soft Background Radial */}
        <circle cx="60" cy="60" r="50" fill="#EEF7F0" />
        
        {/* Protractor / Grid Arc */}
        <path d="M28 75 A32 32 0 0 1 92 75 Z" fill="#D2EBD8" stroke="#4F9D69" strokeWidth="2.5" strokeLinejoin="round" />
        <line x1="60" y1="43" x2="60" y2="48" stroke="#4F9D69" strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="52" x2="46" y2="56" stroke="#4F9D69" strokeWidth="2" strokeLinecap="round" />
        <line x1="78" y1="52" x2="74" y2="56" stroke="#4F9D69" strokeWidth="2" strokeLinecap="round" />
        <circle cx="60" cy="75" r="3" fill="#25352B" />

        {/* Isometric Geometry Cube */}
        <g transform="translate(68, 22) scale(0.7)">
          <path d="M20 5 L35 14 L20 23 L5 14 Z" fill="#78B98A" stroke="#25352B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M5 14 L20 23 L20 40 L5 31 Z" fill="#4F9D69" stroke="#25352B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M35 14 L20 23 L20 40 L35 31 Z" fill="#3D7E53" stroke="#25352B" strokeWidth="2" strokeLinejoin="round" />
        </g>

        {/* Drawing Compass */}
        <g transform="translate(18, 26) rotate(-15 20 20)">
          <circle cx="20" cy="8" r="4.5" fill="#4F9D69" stroke="#25352B" strokeWidth="2" />
          <line x1="18" y1="12" x2="6" y2="52" stroke="#25352B" strokeWidth="3" strokeLinecap="round" />
          <line x1="22" y1="12" x2="34" y2="52" stroke="#25352B" strokeWidth="3" strokeLinecap="round" />
          <circle cx="6" cy="52" r="1.5" fill="#4F9D69" />
          <line x1="34" y1="52" x2="37" y2="56" stroke="#4F9D69" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Pi Symbol badge */}
        <g transform="translate(24, 76)">
          <circle cx="12" cy="12" r="11" fill="#FFFFFF" stroke="#4F9D69" strokeWidth="1.5" />
          <text x="7" y="17" fontFamily="serif" fontSize="15" fontWeight="bold" fill="#25352B">π</text>
        </g>

        {/* Function symbol badge */}
        <g transform="translate(80, 68)">
          <circle cx="12" cy="12" r="10" fill="#FFFFFF" stroke="#4F9D69" strokeWidth="1.5" />
          <text x="6" y="17" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill="#4F9D69">∑</text>
        </g>
      </svg>
    </div>
  );
}

/**
 * Science Illustration:
 * Erlenmeyer flask with bubbling liquid, atom orbit rings with electron, and DNA helix.
 */
export function ScienceIllustration({ className = 'w-24 h-24', animateHover = true }: IllustrationProps) {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className} ${animateHover ? 'group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-300' : ''}`}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
        {/* Soft Radial Background */}
        <circle cx="60" cy="60" r="50" fill="#EFF6FF" />

        {/* Atom Orbit Ring */}
        <ellipse cx="60" cy="56" rx="42" ry="16" transform="rotate(-25 60 56)" stroke="#93C5FD" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="94" cy="40" r="4" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
        <ellipse cx="60" cy="56" rx="42" ry="16" transform="rotate(35 60 56)" stroke="#93C5FD" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="26" cy="44" r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />

        {/* Erlenmeyer Laboratory Flask */}
        <path d="M52 24 L68 24 L68 38 L88 78 A8 8 0 0 1 81 89 L39 89 A8 8 0 0 1 32 78 L52 38 Z" fill="#FFFFFF" stroke="#1E3A8A" strokeWidth="2.5" strokeLinejoin="round" />
        
        {/* Flask Liquid */}
        <path d="M37 76 L83 76 L86 81 A6 6 0 0 1 81 87 L39 87 A6 6 0 0 1 34 81 Z" fill="#60A5FA" />
        <path d="M37 76 Q48 72 60 76 T83 76 L83 82 L37 82 Z" fill="#3B82F6" opacity="0.85" />

        {/* Bubbles */}
        <circle cx="56" cy="68" r="3" fill="#DBEAFE" />
        <circle cx="67" cy="60" r="2.5" fill="#DBEAFE" />
        <circle cx="58" cy="48" r="2" fill="#93C5FD" />
        <circle cx="63" cy="34" r="1.5" fill="#60A5FA" />

        {/* Flask Neck Rim */}
        <rect x="50" y="20" width="20" height="5" rx="2.5" fill="#DBEAFE" stroke="#1E3A8A" strokeWidth="2" />

        {/* Small DNA Helix accent */}
        <g transform="translate(16, 68) scale(0.65)">
          <path d="M6 0 Q18 10 6 20 Q-6 30 6 40" stroke="#3B82F6" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M18 0 Q6 10 18 20 Q30 30 18 40" stroke="#1D4ED8" strokeWidth="3" fill="none" strokeLinecap="round" />
          <line x1="6" y1="10" x2="18" y2="10" stroke="#93C5FD" strokeWidth="2.5" />
          <line x1="3" y1="20" x2="21" y2="20" stroke="#93C5FD" strokeWidth="2.5" />
          <line x1="6" y1="30" x2="18" y2="30" stroke="#93C5FD" strokeWidth="2.5" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Social Science Illustration:
 * Globe with continents and latitude lines, ancient historical pillar, and compass rose.
 */
export function SocialScienceIllustration({ className = 'w-24 h-24', animateHover = true }: IllustrationProps) {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className} ${animateHover ? 'group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-300' : ''}`}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
        {/* Soft Radial Background */}
        <circle cx="60" cy="60" r="50" fill="#FEF3C7" />

        {/* Globe Base & Stand */}
        <path d="M38 96 L82 96" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
        <path d="M60 86 L60 96" stroke="#92400E" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M28 54 A34 34 0 0 0 60 88 L60 84 A30 30 0 0 1 32 54 Z" fill="#B45309" />

        {/* Globe Sphere */}
        <circle cx="60" cy="50" r="28" fill="#FDE68A" stroke="#92400E" strokeWidth="2.5" />
        {/* Continents */}
        <path d="M48 34 Q56 30 62 38 Q68 44 60 48 Q54 52 50 44 Z" fill="#D97706" opacity="0.9" />
        <path d="M68 46 Q76 42 80 50 Q78 58 72 56 Q66 54 68 46 Z" fill="#D97706" opacity="0.9" />
        <path d="M42 56 Q48 54 52 62 Q50 70 44 68 Z" fill="#D97706" opacity="0.9" />

        {/* Latitude / Longitude arcs */}
        <ellipse cx="60" cy="50" rx="14" ry="28" stroke="#92400E" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
        <line x1="32" y1="50" x2="88" y2="50" stroke="#92400E" strokeWidth="1.5" strokeDasharray="3 2" />

        {/* Ancient Monument Pillar on side */}
        <g transform="translate(86, 20) scale(0.65)">
          <rect x="4" y="0" width="24" height="6" rx="2" fill="#92400E" />
          <rect x="8" y="6" width="4" height="38" fill="#D97706" />
          <rect x="14" y="6" width="4" height="38" fill="#FDE68A" />
          <rect x="20" y="6" width="4" height="38" fill="#D97706" />
          <rect x="4" y="44" width="24" height="6" rx="2" fill="#92400E" />
        </g>

        {/* Compass Rose Star */}
        <g transform="translate(18, 22) scale(0.7)">
          <polygon points="15,0 18,11 29,15 18,19 15,30 12,19 1,15 12,11" fill="#B45309" stroke="#78350F" strokeWidth="1" />
          <circle cx="15" cy="15" r="3" fill="#FEF3C7" />
        </g>
      </svg>
    </div>
  );
}

/**
 * English Literature & Grammar Illustration:
 * Hardcover open storybook, sprouting quill pen, floating letters (A, B, C).
 */
export function EnglishIllustration({ className = 'w-24 h-24', animateHover = true }: IllustrationProps) {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className} ${animateHover ? 'group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-300' : ''}`}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
        {/* Soft Radial Background */}
        <circle cx="60" cy="60" r="50" fill="#F5F3FF" />

        {/* Open Hardcover Book */}
        <g transform="translate(20, 42)">
          {/* Cover Spine Shadow */}
          <path d="M40 44 L5 38 A4 4 0 0 1 2 34 L2 6 A4 4 0 0 1 6 2 L40 8 Z" fill="#6D28D9" />
          <path d="M40 44 L75 38 A4 4 0 0 0 78 34 L78 6 A4 4 0 0 0 74 2 L40 8 Z" fill="#5B21B6" />

          {/* Left Page & Right Page */}
          <path d="M40 38 L8 32 L8 6 L40 10 Z" fill="#FFFFFF" stroke="#4C1D95" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M40 38 L72 32 L72 6 L40 10 Z" fill="#F3E8FF" stroke="#4C1D95" strokeWidth="1.5" strokeLinejoin="round" />

          {/* Text Lines */}
          <line x1="14" y1="14" x2="34" y2="16" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
          <line x1="14" y1="20" x2="34" y2="22" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
          <line x1="14" y1="26" x2="28" y2="28" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />

          <line x1="46" y1="16" x2="66" y2="14" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
          <line x1="46" y1="22" x2="66" y2="20" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
          <line x1="46" y1="28" x2="60" y2="26" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />

          {/* Red Bookmark Ribbon */}
          <path d="M40 10 L40 42 L44 38 L48 42 L48 10 Z" fill="#EF4444" />
        </g>

        {/* Feather Quill Pen */}
        <g transform="translate(68, 16) rotate(22 20 20)">
          <path d="M22 4 C16 10, 8 20, 10 38 L8 44 L14 42 C24 38, 30 26, 26 12 Z" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="2" />
          <line x1="10" y1="38" x2="24" y2="8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <path d="M7 45 L5 52 L11 48 Z" fill="#25352B" />
        </g>

        {/* Floating Letters */}
        <text x="24" y="32" fontFamily="serif" fontSize="18" fontWeight="bold" fill="#7C3AED">A</text>
        <text x="56" y="24" fontFamily="serif" fontSize="16" fontWeight="bold" fill="#8B5CF6">B</text>
        <text x="92" y="52" fontFamily="serif" fontSize="17" fontWeight="bold" fill="#6D28D9">C</text>
      </svg>
    </div>
  );
}

/**
 * Hindi Illustration:
 * Devanagari script (अ, क, ज्ञ), peacock feather motif, Diya / sacred manuscript scroll.
 */
export function HindiIllustration({ className = 'w-24 h-24', animateHover = true }: IllustrationProps) {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className} ${animateHover ? 'group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-300' : ''}`}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
        {/* Soft Radial Background */}
        <circle cx="60" cy="60" r="50" fill="#FEF2F2" />

        {/* Manuscript Parchment Scroll */}
        <g transform="translate(24, 38)">
          <rect x="6" y="4" width="60" height="42" rx="4" fill="#FFFBEB" stroke="#B45309" strokeWidth="2" />
          <line x1="12" y1="12" x2="60" y2="12" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="20" x2="60" y2="20" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="28" x2="52" y2="28" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="36" x2="44" y2="36" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />

          {/* Wooden Roll Ends */}
          <rect x="2" y="2" width="6" height="46" rx="3" fill="#B45309" />
          <rect x="64" y="2" width="6" height="46" rx="3" fill="#B45309" />
        </g>

        {/* Prominent Devanagari Akshar 'अ' */}
        <g transform="translate(34, 44)">
          <text x="0" y="32" fontFamily="sans-serif" fontSize="36" fontWeight="bold" fill="#DC2626">अ</text>
        </g>

        {/* Stylized Peacock Feather Motif */}
        <g transform="translate(74, 18) rotate(15)">
          <path d="M12 0 C6 10, 0 22, 6 36 C12 44, 22 42, 24 32 C26 18, 18 8, 12 0 Z" fill="#047857" stroke="#065F46" strokeWidth="1.5" />
          <path d="M11 12 C8 18, 4 25, 8 32 C12 36, 18 34, 19 28 C20 20, 15 16, 11 12 Z" fill="#0284C7" />
          <circle cx="13" cy="24" r="3.5" fill="#F59E0B" />
          <line x1="10" y1="36" x2="6" y2="52" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Floating Devanagari 'क' & 'ज्ञ' */}
        <text x="18" y="34" fontFamily="sans-serif" fontSize="18" fontWeight="bold" fill="#B91C1C">क</text>
        <text x="86" y="86" fontFamily="sans-serif" fontSize="20" fontWeight="bold" fill="#EA580C">ज्ञ</text>
      </svg>
    </div>
  );
}

/**
 * Computer & Digital Skills Illustration:
 * Modern laptop with code editor brackets </>, binary stream 0101, microchip with circuit traces.
 */
export function ComputerIllustration({ className = 'w-24 h-24', animateHover = true }: IllustrationProps) {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className} ${animateHover ? 'group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-300' : ''}`}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
        {/* Soft Radial Background */}
        <circle cx="60" cy="60" r="50" fill="#ECFDF5" />

        {/* Circuit Traces in Background */}
        <path d="M24 38 L38 38 L44 48 L64 48" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="38" r="3" fill="#10B981" />
        <circle cx="64" cy="48" r="2.5" fill="#10B981" />

        <path d="M96 74 L84 74 L78 66 L60 66" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" />
        <circle cx="96" cy="74" r="3" fill="#10B981" />

        {/* Laptop Display */}
        <rect x="28" y="32" width="64" height="42" rx="5" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
        {/* Screen Inner */}
        <rect x="32" y="36" width="56" height="34" rx="2" fill="#0F172A" />
        
        {/* Code editor syntax lines & brackets </> */}
        <text x="36" y="48" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#34D399">&lt;/&gt;</text>
        <line x1="56" y1="46" x2="82" y2="46" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
        <line x1="38" y1="55" x2="68" y2="55" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        <line x1="38" y1="62" x2="78" y2="62" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />

        {/* Laptop Base Keyboard */}
        <path d="M18 74 L102 74 L96 82 A4 4 0 0 1 92 85 L28 85 A4 4 0 0 1 24 82 Z" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
        <line x1="52" y1="76" x2="68" y2="76" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />

        {/* Microchip Badge */}
        <g transform="translate(82, 18) scale(0.7)">
          <rect x="4" y="4" width="22" height="22" rx="3" fill="#10B981" stroke="#065F46" strokeWidth="1.5" />
          <line x1="0" y1="10" x2="4" y2="10" stroke="#065F46" strokeWidth="2" />
          <line x1="0" y1="15" x2="4" y2="15" stroke="#065F46" strokeWidth="2" />
          <line x1="0" y1="20" x2="4" y2="20" stroke="#065F46" strokeWidth="2" />
          <line x1="26" y1="10" x2="30" y2="10" stroke="#065F46" strokeWidth="2" />
          <line x1="26" y1="15" x2="30" y2="15" stroke="#065F46" strokeWidth="2" />
          <line x1="26" y1="20" x2="30" y2="20" stroke="#065F46" strokeWidth="2" />
          <circle cx="15" cy="15" r="4" fill="#ECFDF5" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Class 6–10 Visual Card Educational Illustrations
 */
export function ClassVisualIllustration({ classNumber }: { classNumber: number }) {
  switch (classNumber) {
    case 6:
      return (
        <div className="w-20 h-20 relative">
          <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
            <circle cx="40" cy="40" r="36" fill="#EEF7F0" />
            <path d="M40 56 L40 32 Q40 24 30 20 Q32 30 40 32 Q48 30 50 20 Q40 24 40 32" fill="#4F9D69" stroke="#25352B" strokeWidth="1.5" />
            <circle cx="40" cy="60" r="14" fill="#D2EBD8" />
            <text x="35" y="64" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#25352B">6</text>
            <circle cx="22" cy="28" r="5" fill="#78B98A" />
            <circle cx="58" cy="30" r="4" fill="#6E9AD6" />
          </svg>
        </div>
      );
    case 7:
      return (
        <div className="w-20 h-20 relative">
          <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
            <circle cx="40" cy="40" r="36" fill="#EFF6FF" />
            <rect x="28" y="24" width="24" height="32" rx="4" fill="#FFFFFF" stroke="#1E3A8A" strokeWidth="1.5" />
            <line x1="34" y1="32" x2="46" y2="32" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
            <line x1="34" y1="38" x2="46" y2="38" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
            <line x1="34" y1="44" x2="42" y2="44" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
            <circle cx="56" cy="24" r="8" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.5" />
            <text x="53" y="28" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#1E3A8A">7</text>
          </svg>
        </div>
      );
    case 8:
      return (
        <div className="w-20 h-20 relative">
          <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
            <circle cx="40" cy="40" r="36" fill="#F5F3FF" />
            <ellipse cx="40" cy="40" rx="26" ry="10" transform="rotate(-30 40 40)" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="3 2" />
            <ellipse cx="40" cy="40" rx="26" ry="10" transform="rotate(30 40 40)" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="40" cy="40" r="9" fill="#7C3AED" />
            <text x="36" y="44" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill="#FFFFFF">8</text>
            <circle cx="58" cy="28" r="3.5" fill="#4F9D69" />
          </svg>
        </div>
      );
    case 9:
      return (
        <div className="w-20 h-20 relative">
          <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
            <circle cx="40" cy="40" r="36" fill="#FEF3C7" />
            <path d="M22 52 L58 52 L40 22 Z" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
            <line x1="40" y1="22" x2="40" y2="52" stroke="#92400E" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx="40" cy="38" r="8" fill="#D97706" />
            <text x="37" y="42" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#FFFFFF">9</text>
            <circle cx="22" cy="52" r="3" fill="#25352B" />
            <circle cx="58" cy="52" r="3" fill="#25352B" />
          </svg>
        </div>
      );
    case 10:
      return (
        <div className="w-20 h-20 relative">
          <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
            <circle cx="40" cy="40" r="36" fill="#FEF2F2" />
            <path d="M40 20 L66 30 L40 40 L14 30 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
            <path d="M24 35 L24 48 Q40 56 56 48 L56 35" fill="none" stroke="#991B1B" strokeWidth="1.5" />
            <circle cx="40" cy="58" r="10" fill="#FEE2E2" stroke="#DC2626" strokeWidth="1.5" />
            <text x="33" y="62" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#991B1B">10</text>
          </svg>
        </div>
      );
    default:
      return <MathIllustration className="w-20 h-20" />;
  }
}

/**
 * Animated Open Book Illustration:
 * Smoothly opens with flipping pages, ribbon bookmark, and subtle educational aura.
 */
export function AnimatedBookIllustration({ className = 'w-32 h-32' }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Background Soft Glow */}
      <div className="absolute inset-0 rounded-full bg-[#EEF7F0] blur-xl opacity-70 animate-pulse" />

      <svg
        viewBox="0 0 160 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md animate-book-open relative z-10"
      >
        {/* Book Spine / Shadow */}
        <path
          d="M80 96 C65 92, 35 90, 15 94 L15 32 C35 28, 65 30, 80 34 C95 30, 125 28, 145 32 L145 94 C125 90, 95 92, 80 96 Z"
          fill="#3E8555"
        />

        {/* Hardcover Edges */}
        <path
          d="M80 98 C64 94, 32 92, 12 96 L12 30 C32 26, 64 28, 80 32 C96 28, 128 26, 148 30 L148 96 C128 92, 96 94, 80 98 Z"
          fill="#25352B"
          opacity="0.15"
        />

        {/* Backing Cover */}
        <path
          d="M80 94 C65 90, 35 88, 16 92 L16 30 C35 26, 65 28, 80 32 Z"
          fill="#4F9D69"
        />
        <path
          d="M80 94 C95 90, 125 88, 144 92 L144 30 C125 26, 95 28, 80 32 Z"
          fill="#438E5C"
        />

        {/* Left Stacked Pages */}
        <path
          d="M80 92 C66 88, 38 86, 20 89 L20 28 C38 25, 66 27, 80 31 Z"
          fill="#E2EFE5"
        />
        {/* Left Top Page */}
        <path
          d="M80 90 C66 86, 38 84, 22 87 L22 26 C38 23, 66 25, 80 29 Z"
          fill="#FFFFFF"
          stroke="#D5E4D8"
          strokeWidth="1.2"
        />

        {/* Left Page Text Lines */}
        <line x1="30" y1="36" x2="68" y2="38" stroke="#78B98A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="44" x2="68" y2="46" stroke="#78B98A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="52" x2="60" y2="54" stroke="#78B98A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="60" x2="68" y2="62" stroke="#78B98A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="68" x2="52" y2="70" stroke="#78B98A" strokeWidth="2.5" strokeLinecap="round" />

        {/* Right Stacked Pages */}
        <path
          d="M80 92 C94 88, 122 86, 140 89 L140 28 C122 25, 94 27, 80 31 Z"
          fill="#E2EFE5"
        />
        {/* Right Top Page */}
        <path
          d="M80 90 C94 86, 122 84, 138 87 L138 26 C122 23, 94 25, 80 29 Z"
          fill="#FFFFFF"
          stroke="#D5E4D8"
          strokeWidth="1.2"
        />

        {/* Right Page Diagram & Lines */}
        <line x1="92" y1="38" x2="130" y2="36" stroke="#78B98A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="92" y1="46" x2="130" y2="44" stroke="#78B98A" strokeWidth="2.5" strokeLinecap="round" />
        {/* Mini Diagram on Right */}
        <rect x="92" y="52" width="22" height="18" rx="3" fill="#EEF7F0" stroke="#4F9D69" strokeWidth="1.5" />
        <circle cx="103" cy="61" r="5" fill="#78B98A" />
        <line x1="120" y1="56" x2="130" y2="56" stroke="#78B98A" strokeWidth="2" strokeLinecap="round" />
        <line x1="120" y1="64" x2="128" y2="64" stroke="#78B98A" strokeWidth="2" strokeLinecap="round" />

        {/* Central Spine Fold */}
        <path d="M80 29 L80 90" stroke="#3E8555" strokeWidth="2" strokeLinecap="round" />

        {/* Crimson Ribbon Bookmark */}
        <path
          d="M80 28 C82 45, 83 65, 86 85 L90 82 L94 86 C91 65, 87 45, 80 28 Z"
          fill="#EF4444"
          className="drop-shadow-xs"
        />
      </svg>
    </div>
  );
}

/**
 * Animated Educational Welcome Visual:
 * Features the opening book surrounded by floating science, maths, globe, pencil, and sparkles.
 */
export function EducationalWelcomeVisual() {
  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center select-none">
      {/* Central Opening Book */}
      <AnimatedBookIllustration className="w-44 h-44 sm:w-52 sm:h-52 z-20" />

      {/* 1. Science Elements Floating: Atom & Orbit */}
      <div className="absolute top-4 left-6 sm:left-4 z-30 animate-float-gentle">
        <div className="w-12 h-12 rounded-2xl bg-white border border-[#E2E8E0] shadow-sm flex items-center justify-center p-2 transform -rotate-6">
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
            <ellipse cx="20" cy="20" rx="14" ry="5" transform="rotate(-30 20 20)" stroke="#3B82F6" strokeWidth="1.8" />
            <ellipse cx="20" cy="20" rx="14" ry="5" transform="rotate(30 20 20)" stroke="#3B82F6" strokeWidth="1.8" />
            <circle cx="20" cy="20" r="3.5" fill="#2563EB" />
            <circle cx="28" cy="12" r="1.8" fill="#60A5FA" />
          </svg>
        </div>
      </div>

      {/* 2. Mini Beaker / Flask */}
      <div className="absolute bottom-6 left-8 sm:left-6 z-30 animate-float-gentle-alt">
        <div className="w-11 h-11 rounded-2xl bg-white border border-[#E2E8E0] shadow-sm flex items-center justify-center p-2 transform rotate-12">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <path d="M14 6 L18 6 L18 12 L24 24 A2 2 0 0 1 22 27 L10 27 A2 2 0 0 1 8 24 L14 12 Z" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.5" />
            <path d="M10 23 L22 23 L22 25 A1 1 0 0 1 21 26 L11 26 A1 1 0 0 1 10 25 Z" fill="#60A5FA" />
            <circle cx="16" cy="20" r="1.5" fill="#DBEAFE" />
          </svg>
        </div>
      </div>

      {/* 3. Maths Symbols: Pi & Sigma */}
      <div className="absolute top-6 right-8 sm:right-6 z-30 animate-float-gentle-alt">
        <div className="w-12 h-12 rounded-2xl bg-white border border-[#E2E8E0] shadow-sm flex items-center justify-center p-2 transform rotate-6">
          <span className="font-serif font-bold text-xl text-[#4F9D69]">π</span>
        </div>
      </div>

      {/* 4. Square Root & Division Symbol */}
      <div className="absolute top-28 -right-3 z-30 animate-float-gentle">
        <div className="w-9 h-9 rounded-xl bg-[#EEF7F0] border border-[#78B98A]/40 shadow-xs flex items-center justify-center">
          <span className="font-sans font-black text-sm text-[#4F9D69]">√x</span>
        </div>
      </div>

      {/* 5. Globe Element */}
      <div className="absolute bottom-8 right-6 sm:right-8 z-30 animate-float-gentle">
        <div className="w-12 h-12 rounded-2xl bg-white border border-[#E2E8E0] shadow-sm flex items-center justify-center p-2 transform -rotate-12">
          <svg viewBox="0 0 36 36" fill="none" className="w-full h-full">
            <circle cx="18" cy="18" r="13" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
            <path d="M12 14 Q16 11 19 15 Q22 19 17 21 Z" fill="#B45309" opacity="0.8" />
            <ellipse cx="18" cy="18" rx="6" ry="13" stroke="#D97706" strokeWidth="1" strokeDasharray="2 2" fill="none" />
          </svg>
        </div>
      </div>

      {/* 6. Drawing Pencil */}
      <div className="absolute top-2 -right-1 z-30 animate-float-gentle">
        <div className="w-11 h-11 rounded-2xl bg-white border border-[#E2E8E0] shadow-sm flex items-center justify-center p-2 transform -rotate-45">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect x="8" y="4" width="6" height="20" rx="1.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1.2" />
            <polygon points="8,24 14,24 11,29" fill="#FDE68A" stroke="#D97706" strokeWidth="1.2" />
            <polygon points="10,27 12,27 11,29" fill="#25352B" />
            <rect x="8" y="2" width="6" height="3" rx="1" fill="#EF4444" />
          </svg>
        </div>
      </div>

      {/* 7. Golden Sparkles & Educational Stars */}
      <div className="absolute top-12 left-28 z-10 animate-pulse text-[#F59E0B]">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
        </svg>
      </div>
      <div className="absolute bottom-16 left-24 z-10 animate-pulse text-[#4F9D69]">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
        </svg>
      </div>
      <div className="absolute top-24 right-20 z-10 animate-pulse text-[#3B82F6]">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Animated Learning Space Ready Visual:
 * Shown during the learning transition after selecting class.
 * Sequence: Book opens, subject icons glide into position, "Your learning space is ready!"
 */
export function LearningSpaceReadyVisual({ classNumber }: { classNumber: number }) {
  const miniSubjects = [
    { label: 'Maths', icon: Calculator, color: '#4F9D69', bg: '#EEF7F0', border: '#4F9D69' },
    { label: 'Science', icon: FlaskConical, color: '#3B82F6', bg: '#EFF6FF', border: '#3B82F6' },
    { label: 'SST', icon: Globe, color: '#D97706', bg: '#FEF3C7', border: '#D97706' },
    { label: 'English', icon: BookOpen, color: '#2E7D4E', bg: '#EEF7F0', border: '#4F9D69' },
    { label: 'Hindi', icon: PenLine, color: '#C05621', bg: '#FDF6EE', border: '#DD6B20' },
    { label: 'Computer', icon: Laptop, color: '#10B981', bg: '#ECFDF5', border: '#10B981' },
  ];

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center justify-center space-y-6 select-none animate-in fade-in zoom-in-95 duration-400">
      {/* Central Book & Class Badge */}
      <div className="relative flex items-center justify-center">
        <AnimatedBookIllustration className="w-36 h-36 sm:w-44 sm:h-44 z-10" />
        <div className="absolute -bottom-2 z-20 px-3.5 py-1 rounded-full bg-[#EEF7F0] border-2 border-[#4F9D69] text-xs font-black text-[#4F9D69] shadow-sm">
          Class {classNumber}
        </div>
      </div>

      {/* Mini Subject Cards Gliding Into Position */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5 w-full pt-2">
        {miniSubjects.map((subj, idx) => {
          const Icon = subj.icon;
          return (
            <div
              key={subj.label}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border shadow-2xs animate-card-slide-up"
              style={{
                borderColor: `${subj.border}40`,
                animationDelay: `${idx * 80 + 150}ms`,
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-1"
                style={{ backgroundColor: subj.bg }}
              >
                <Icon className="w-4 h-4" style={{ color: subj.color }} />
              </div>
              <span className="text-[10px] font-bold text-[#25352B]">{subj.label}</span>
            </div>
          );
        })}
      </div>

      {/* Confirmation & Status */}
      <div className="text-center space-y-1 pt-2">
        <h3 className="text-2xl sm:text-3xl font-black text-[#25352B] tracking-tight">
          Your learning space is ready!
        </h3>
        <p className="text-xs sm:text-sm text-[#647067]">
          Preparing Class {classNumber} syllabus, videos, and practice tests...
        </p>
      </div>

      {/* Smooth Progress Bar */}
      <div className="w-56 bg-[#E2E8E0] rounded-full h-1.5 overflow-hidden">
        <div className="bg-[#4F9D69] h-full rounded-full w-full animate-pulse transition-all duration-1000" />
      </div>
    </div>
  );
}
