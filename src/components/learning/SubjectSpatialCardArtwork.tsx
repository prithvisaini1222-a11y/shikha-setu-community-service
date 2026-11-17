'use client';

import React from 'react';

interface SubjectArtworkProps {
  subjectName: string;
  className?: string;
}

export function SubjectSpatialCardArtwork({ subjectName, className = '' }: SubjectArtworkProps) {
  const norm = subjectName.toLowerCase();

  if (norm.includes('math')) {
    return <MathematicsArtwork className={className} />;
  }
  if (norm.includes('soc') || norm.includes('sst')) {
    return <SocialScienceArtwork className={className} />;
  }
  if (norm.includes('sci')) {
    return <ScienceArtwork className={className} />;
  }
  if (norm.includes('eng')) {
    return <EnglishArtwork className={className} />;
  }
  if (norm.includes('hin')) {
    return <HindiArtwork className={className} />;
  }
  if (norm.includes('san')) {
    return <SanskritArtwork className={className} />;
  }
  return <MathematicsArtwork className={className} />;
}

/**
 * 1. MATHEMATICS ARTWORK DIORAMA
 * Reference: Frame 00:00 & 00:01
 * - Bold green title "MATHEMATICS", subtitle "Explore numbers, patterns and problem solving"
 * - Triangle with vertices A, B, C
 * - Coordinate axes with parabola
 * - Ruler with tick marks & red paper airplane
 * - Formulas: f = x^2 / 3t^2, √(L^3 / 3t^2)
 * - 3D geometric shapes & organic green accents
 */
function MathematicsArtwork({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full object-cover select-none pointer-events-none ${className}`}
    >
      <defs>
        <linearGradient id="math-bg" x1="0" y1="0" x2="900" y2="520" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5F9F4" />
          <stop offset="50%" stopColor="#EEF5EC" />
          <stop offset="100%" stopColor="#E4EFE1" />
        </linearGradient>
        <linearGradient id="math-pedestal" x1="150" y1="0" x2="750" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#81C784" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#4CAF50" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#81C784" stopOpacity="0.2" />
        </linearGradient>
        <filter id="math-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#2E7D32" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Diorama Background */}
      <rect width="900" height="520" rx="32" fill="url(#math-bg)" />

      {/* Base Pedestal Oval Shadow */}
      <ellipse cx="450" cy="470" rx="380" ry="32" fill="url(#math-pedestal)" />

      {/* Top Left Organic Soft Green Glow Circles */}
      <path
        d="M -30 -20 Q 180 -40 220 90 Q 260 220 90 240 Q -40 260 -70 110 Z"
        fill="#A7CE9B"
        opacity="0.55"
      />
      <circle cx="180" cy="150" r="36" fill="#588B4B" opacity="0.35" />
      <circle cx="310" cy="85" r="22" fill="#A7CE9B" opacity="0.45" />

      {/* Top Left: Triangle with Vertices A, B, C */}
      <g transform="translate(130, 60)" filter="url(#math-shadow)">
        <polygon points="50,25 150,95 25,130" stroke="#2D5A27" strokeWidth="3" fill="#DCECD3" fillOpacity="0.8" />
        <circle cx="50" cy="25" r="5" fill="#2D5A27" />
        <circle cx="150" cy="95" r="5" fill="#2D5A27" />
        <circle cx="25" cy="130" r="5" fill="#2D5A27" />
        <text x="44" y="12" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="#1B4D2F">A</text>
        <text x="162" y="102" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="#1B4D2F">B</text>
        <text x="5" y="146" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="#1B4D2F">C</text>
        <path d="M 45 45 A 20 20 0 0 1 58 52" stroke="#2D5A27" strokeWidth="2" fill="none" />
      </g>

      {/* Top Right: Coordinate Graph with Parabola */}
      <g transform="translate(620, 50)">
        <circle cx="120" cy="90" r="85" fill="#C8E6C9" opacity="0.4" />
        <line x1="80" y1="160" x2="80" y2="20" stroke="#388E3C" strokeWidth="2.5" />
        <line x1="15" y1="110" x2="180" y2="110" stroke="#388E3C" strokeWidth="2.5" />
        <text x="72" y="20" fontFamily="sans-serif" fontSize="15" fontWeight="bold" fill="#2E7D32">y</text>
        <text x="185" y="115" fontFamily="sans-serif" fontSize="15" fontWeight="bold" fill="#2E7D32">x</text>
        <text x="60" y="130" fontFamily="sans-serif" fontSize="13" fill="#388E3C">0</text>
        {/* Parabola Curve */}
        <path d="M 25 35 Q 80 145 135 35" stroke="#1B5E20" strokeWidth="3" fill="none" />
      </g>

      {/* Bottom Left: Coordinate Grid & Ruler */}
      <g transform="translate(90, 310)">
        <line x1="10" y1="10" x2="190" y2="10" stroke="#CFE4C8" strokeWidth="1.5" />
        <line x1="10" y1="50" x2="190" y2="50" stroke="#CFE4C8" strokeWidth="1.5" />
        <line x1="10" y1="90" x2="190" y2="90" stroke="#CFE4C8" strokeWidth="1.5" />
        <line x1="10" y1="130" x2="190" y2="130" stroke="#CFE4C8" strokeWidth="1.5" />

        <line x1="40" y1="0" x2="40" y2="145" stroke="#2D5A27" strokeWidth="2.5" />
        <line x1="10" y1="120" x2="190" y2="120" stroke="#2D5A27" strokeWidth="2.5" />

        {/* Ruler on Bottom */}
        <line x1="20" y1="150" x2="180" y2="150" stroke="#2D5A27" strokeWidth="2" />
        {[30, 50, 70, 90, 110, 130, 150, 170].map((rx) => (
          <line key={rx} x1={rx} y1="145" x2={rx} y2="150" stroke="#2D5A27" strokeWidth="2" />
        ))}
      </g>

      {/* Paper Airplane Flying Across Bottom Left to Center */}
      <g transform="translate(300, 350) rotate(-18)" filter="url(#math-shadow)">
        <polygon points="0,0 55,20 20,32" fill="#E57373" />
        <polygon points="55,20 20,32 25,45" fill="#C62828" />
        <path d="M -30 15 Q -10 20 0 0" stroke="#C62828" strokeWidth="2" strokeDasharray="4 4" fill="none" />
      </g>

      {/* Bottom Right: Mathematical Formulas & Geometric Solid */}
      <g transform="translate(650, 320)">
        <text x="0" y="30" fontFamily="serif" fontStyle="italic" fontSize="28" fontWeight="bold" fill="#1B5E20">
          f = x² / 3t²
        </text>
        <text x="20" y="75" fontFamily="serif" fontStyle="italic" fontSize="24" fontWeight="bold" fill="#2E7D32">
          √(L³ / 3t²)
        </text>
        {/* Geometric Prism */}
        <polygon points="120,60 170,30 210,60 160,90" stroke="#2E7D32" strokeWidth="2" fill="#E8F5E9" opacity="0.8" />
        <line x1="120" y1="60" x2="120" y2="110" stroke="#2E7D32" strokeWidth="2" />
        <line x1="160" y1="90" x2="160" y2="140" stroke="#2E7D32" strokeWidth="2" />
        <line x1="210" y1="60" x2="210" y2="110" stroke="#2E7D32" strokeWidth="2" />
        <polygon points="120,110 160,140 210,110" stroke="#2E7D32" strokeWidth="2" fill="#C8E6C9" opacity="0.6" />
      </g>

      {/* CENTER HERO TYPOGRAPHY: Directly matching reference video */}
      <g transform="translate(450, 235)" textAnchor="middle">
        <text
          x="0"
          y="0"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="48"
          fontWeight="900"
          letterSpacing="4"
          fill="#1B5E20"
        >
          MATHEMATICS
        </text>
        <text
          x="0"
          y="38"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="17"
          fontWeight="600"
          fill="#3E6B47"
          letterSpacing="0.5"
        >
          Explore numbers, patterns and problem solving
        </text>
      </g>
    </svg>
  );
}

/**
 * 2. SCIENCE ARTWORK DIORAMA
 * Reference: Frame 00:02
 * - Bold blue title "SCIENCE", subtitle "Discover how the world works"
 * - High-detail microscope with lens and stage
 * - Atoms with orbiting electron rings and nucleus spheres
 * - Saturn with glowing rings
 * - Plant sprout with green leaves
 * - Benzene rings and chemical formulas
 */
function ScienceArtwork({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full object-cover select-none pointer-events-none ${className}`}
    >
      <defs>
        <linearGradient id="sci-bg" x1="0" y1="0" x2="900" y2="520" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F0F8FF" />
          <stop offset="50%" stopColor="#E6F2FC" />
          <stop offset="100%" stopColor="#D9ECFA" />
        </linearGradient>
        <linearGradient id="sci-pedestal" x1="150" y1="0" x2="750" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#42A5F5" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#1E88E5" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#42A5F5" stopOpacity="0.2" />
        </linearGradient>
        <filter id="sci-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0D47A1" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Diorama Background */}
      <rect width="900" height="520" rx="32" fill="url(#sci-bg)" />

      {/* Base Pedestal Oval Shadow */}
      <ellipse cx="450" cy="470" rx="380" ry="32" fill="url(#sci-pedestal)" />

      {/* Top Left: Microscope */}
      <g transform="translate(130, 45)" filter="url(#sci-shadow)">
        {/* Eyepiece */}
        <rect x="55" y="10" width="18" height="38" rx="3" fill="#263238" />
        {/* Body Tube */}
        <path d="M 58 48 L 40 120 L 72 120 Z" fill="#37474F" />
        {/* Objective lens */}
        <rect x="42" y="120" width="16" height="22" rx="2" fill="#1976D2" />
        {/* Curved Arm */}
        <path d="M 64 60 C 105 70 105 155 55 165" stroke="#263238" strokeWidth="14" strokeLinecap="round" fill="none" />
        {/* Stage with slide clips */}
        <rect x="25" y="138" width="60" height="10" rx="2" fill="#212121" />
        <rect x="35" y="134" width="40" height="4" rx="1" fill="#90CAF9" />
        {/* Heavy Base */}
        <path d="M 30 170 L 95 170 L 105 186 L 20 186 Z" fill="#263238" />
      </g>

      {/* Top Center: Atom with Electron Orbitals */}
      <g transform="translate(350, 50)">
        <ellipse cx="60" cy="60" rx="55" ry="18" stroke="#1E88E5" strokeWidth="2.5" transform="rotate(30 60 60)" fill="none" />
        <ellipse cx="60" cy="60" rx="55" ry="18" stroke="#1E88E5" strokeWidth="2.5" transform="rotate(-30 60 60)" fill="none" />
        <ellipse cx="60" cy="60" rx="55" ry="18" stroke="#1E88E5" strokeWidth="2.5" transform="rotate(90 60 60)" fill="none" />
        {/* Nucleus */}
        <circle cx="56" cy="56" r="10" fill="#E53935" />
        <circle cx="65" cy="64" r="9" fill="#1E88E5" />
        <circle cx="62" cy="54" r="8" fill="#43A047" />
        {/* Orbiting electrons */}
        <circle cx="108" cy="40" r="4" fill="#0288D1" />
        <circle cx="18" cy="80" r="4" fill="#0288D1" />
        <circle cx="60" cy="5" r="4" fill="#0288D1" />
      </g>

      {/* Top Right: Saturn Planet with Glowing Rings */}
      <g transform="translate(700, 50)" filter="url(#sci-shadow)">
        <circle cx="65" cy="65" r="46" fill="#78909C" />
        <ellipse cx="65" cy="65" rx="85" ry="22" stroke="#B0BEC5" strokeWidth="8" transform="rotate(-25 65 65)" fill="none" />
        <ellipse cx="65" cy="65" rx="72" ry="18" stroke="#CFD8DC" strokeWidth="4" transform="rotate(-25 65 65)" fill="none" />
        <circle cx="25" cy="35" r="6" fill="#90CAF9" />
      </g>

      {/* Bottom Left: Sprouting Plant / Nature */}
      <g transform="translate(130, 310)" filter="url(#sci-shadow)">
        <path d="M 45 130 Q 40 65 80 35 Q 95 80 45 130 Z" fill="#43A047" />
        <path d="M 45 130 Q 15 75 10 45 Q 35 85 45 130 Z" fill="#81C784" />
        <path d="M 45 130 Q 45 35 45 20" stroke="#2E7D32" strokeWidth="3.5" fill="none" />
      </g>

      {/* Bottom Center-Right: Chemical Benzene Rings & DNA */}
      <g transform="translate(620, 310)">
        <polygon points="35,12 70,12 88,42 70,72 35,72 17,42" stroke="#37474F" strokeWidth="3" fill="#E3F2FD" opacity="0.7" />
        <polygon points="70,12 105,12 123,42 105,72 70,72 52,42" stroke="#37474F" strokeWidth="3" fill="#E3F2FD" opacity="0.7" />
        <circle cx="35" cy="12" r="5" fill="#1E88E5" />
        <circle cx="70" cy="12" r="5" fill="#43A047" />
        <circle cx="88" cy="42" r="5" fill="#E53935" />
        <circle cx="123" cy="42" r="5" fill="#1E88E5" />
        <circle cx="105" cy="72" r="5" fill="#FDD835" />
      </g>

      {/* CENTER HERO TYPOGRAPHY */}
      <g transform="translate(450, 235)" textAnchor="middle">
        <text
          x="0"
          y="0"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="50"
          fontWeight="900"
          letterSpacing="4"
          fill="#0D47A1"
        >
          SCIENCE
        </text>
        <text
          x="0"
          y="38"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="17"
          fontWeight="600"
          fill="#1E88E5"
          letterSpacing="0.5"
        >
          Discover how the world works
        </text>
      </g>
    </svg>
  );
}

/**
 * 3. SOCIAL SCIENCE ARTWORK DIORAMA
 * Reference: Frame 00:03 & 00:04
 * - Bold terracotta title "SOCIAL SCIENCE", subtitle "Explore people, places and the past"
 * - 3D Earth Globe with brass stand
 * - World map relief silhouette
 * - Ancient monuments (Taj Mahal dome, stone pillars)
 * - Layered landscape terrain with river
 * - Open book of historical records
 */
function SocialScienceArtwork({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full object-cover select-none pointer-events-none ${className}`}
    >
      <defs>
        <linearGradient id="sst-bg" x1="0" y1="0" x2="900" y2="520" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF9F5" />
          <stop offset="50%" stopColor="#FBF2EB" />
          <stop offset="100%" stopColor="#F5E6DC" />
        </linearGradient>
        <linearGradient id="sst-pedestal" x1="150" y1="0" x2="750" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF8A65" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#D84315" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF8A65" stopOpacity="0.2" />
        </linearGradient>
        <filter id="sst-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#BF360C" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Diorama Background */}
      <rect width="900" height="520" rx="32" fill="url(#sst-bg)" />

      {/* Base Pedestal Oval Shadow */}
      <ellipse cx="450" cy="470" rx="380" ry="32" fill="url(#sst-pedestal)" />

      {/* Top Left: World Map Silhouette */}
      <g transform="translate(110, 45)" opacity="0.4">
        <path d="M 60 40 Q 90 20 130 50 Q 150 80 110 110 Q 70 110 60 40 Z" fill="#A1887F" />
        <path d="M 180 30 Q 260 20 300 70 Q 280 120 220 100 Q 170 80 180 30 Z" fill="#A1887F" />
        <path d="M 280 80 Q 360 70 380 120 Q 320 150 260 110 Z" fill="#A1887F" />
        <path d="M 100 120 Q 140 140 120 190 Q 90 180 100 120 Z" fill="#A1887F" />
      </g>

      {/* Top Right: 3D Earth Globe with Brass Stand */}
      <g transform="translate(680, 45)" filter="url(#sst-shadow)">
        <circle cx="65" cy="65" r="50" fill="#81D4FA" />
        {/* Continents on Globe */}
        <path d="M 40 50 Q 65 40 80 60 Q 65 90 45 75 Z" fill="#66BB6A" />
        <path d="M 70 75 Q 90 65 95 90 Q 80 105 70 75 Z" fill="#66BB6A" />
        {/* Latitude & Longitude lines */}
        <ellipse cx="65" cy="65" rx="25" ry="50" stroke="#0288D1" strokeWidth="2" fill="none" />
        <line x1="15" y1="65" x2="115" y2="65" stroke="#0288D1" strokeWidth="2" />
        {/* Brass Stand */}
        <path d="M 65 115 L 65 140 L 40 140 L 90 140" stroke="#5D4037" strokeWidth="5" strokeLinecap="round" />
      </g>

      {/* Bottom Left: Open Historical Book */}
      <g transform="translate(120, 310)" filter="url(#sst-shadow)">
        <path d="M 10 75 Q 55 60 100 70 Q 145 60 190 75 L 190 105 Q 145 90 100 100 Q 55 90 10 105 Z" fill="#FFFFFF" stroke="#8D6E63" strokeWidth="2.5" />
        <line x1="100" y1="70" x2="100" y2="100" stroke="#8D6E63" strokeWidth="2.5" />
        <line x1="25" y1="82" x2="85" y2="78" stroke="#BCAAA4" strokeWidth="2" />
        <line x1="25" y1="90" x2="85" y2="86" stroke="#BCAAA4" strokeWidth="2" />
        <line x1="115" y1="78" x2="175" y2="82" stroke="#BCAAA4" strokeWidth="2" />
        <line x1="115" y1="86" x2="175" y2="90" stroke="#BCAAA4" strokeWidth="2" />
      </g>

      {/* Bottom Right: Historical Monuments & Landscape */}
      <g transform="translate(630, 290)" filter="url(#sst-shadow)">
        {/* Green Hills & Blue River */}
        <path d="M 20 135 Q 90 90 160 115 Q 205 70 250 135 Z" fill="#81C784" />
        <path d="M 40 135 Q 110 120 180 135 Z" fill="#4FC3F7" />
        {/* Temple / Monument Pillars & Dome */}
        <rect x="80" y="45" width="14" height="70" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="2" />
        <rect x="110" y="45" width="14" height="70" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="2" />
        <rect x="140" y="45" width="14" height="70" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="2" />
        <path d="M 70 45 L 165 45 L 117 12 Z" fill="#BCAAA4" stroke="#8D6E63" strokeWidth="2.5" />
        <rect x="65" y="112" width="105" height="15" rx="3" fill="#8D6E63" />
      </g>

      {/* CENTER HERO TYPOGRAPHY */}
      <g transform="translate(450, 235)" textAnchor="middle">
        <text
          x="0"
          y="0"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="48"
          fontWeight="900"
          letterSpacing="4"
          fill="#BF360C"
        >
          SOCIAL SCIENCE
        </text>
        <text
          x="0"
          y="38"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="17"
          fontWeight="600"
          fill="#D84315"
          letterSpacing="0.5"
        >
          Explore people, places and the past
        </text>
      </g>
    </svg>
  );
}

/**
 * 4. ENGLISH ARTWORK DIORAMA
 * Reference: Frame 00:05 & 00:06
 * - Bold royal purple title "ENGLISH", subtitle "Read, write and discover stories"
 * - Large open book with dynamic fanning pages
 * - Floating 3D alphabet letters (A, B, C, Th, D, e, W)
 * - Feather quill pen with ink nib
 */
function EnglishArtwork({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full object-cover select-none pointer-events-none ${className}`}
    >
      <defs>
        <linearGradient id="eng-bg" x1="0" y1="0" x2="900" y2="520" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FAF5FF" />
          <stop offset="50%" stopColor="#F3E8FF" />
          <stop offset="100%" stopColor="#E9D5FF" />
        </linearGradient>
        <linearGradient id="eng-pedestal" x1="150" y1="0" x2="750" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BA68C8" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#7B1FA2" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#BA68C8" stopOpacity="0.2" />
        </linearGradient>
        <filter id="eng-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#4A148C" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Diorama Background */}
      <rect width="900" height="520" rx="32" fill="url(#eng-bg)" />

      {/* Base Pedestal Oval Shadow */}
      <ellipse cx="450" cy="470" rx="380" ry="32" fill="url(#eng-pedestal)" />

      {/* Floating Letters Left */}
      <g filter="url(#eng-shadow)">
        <text x="140" y="90" fontFamily="serif" fontSize="38" fontWeight="bold" fill="#7E57C2" transform="rotate(-15 140 90)">A</text>
        <text x="230" y="125" fontFamily="serif" fontSize="28" fontWeight="bold" fill="#5E35B1" transform="rotate(10 230 125)">B</text>
        <text x="100" y="180" fontFamily="serif" fontSize="32" fontWeight="bold" fill="#4527A0" transform="rotate(-8 100 180)">Th</text>
        <text x="160" y="215" fontFamily="serif" fontSize="42" fontWeight="bold" fill="#311B92">D</text>
      </g>

      {/* Floating Letters Right */}
      <g filter="url(#eng-shadow)">
        <text x="730" y="100" fontFamily="serif" fontSize="36" fontWeight="bold" fill="#7E57C2" transform="rotate(12 730 100)">e</text>
        <text x="790" y="155" fontFamily="serif" fontSize="30" fontWeight="bold" fill="#5E35B1" transform="rotate(-18 790 155)">K</text>
        <text x="700" y="210" fontFamily="serif" fontSize="40" fontWeight="bold" fill="#311B92" transform="rotate(8 700 210)">W</text>
      </g>

      {/* Bottom Center: Large Open Book with Fanning Pages */}
      <g transform="translate(300, 290)" filter="url(#eng-shadow)">
        {/* Cover Spine */}
        <path d="M 150 160 L 20 130 A 10 10 0 0 1 10 120 L 10 40 A 10 10 0 0 1 20 30 L 150 50 Z" fill="#5E35B1" />
        <path d="M 150 160 L 280 130 A 10 10 0 0 0 290 120 L 290 40 A 10 10 0 0 0 280 30 L 150 50 Z" fill="#4527A0" />

        {/* Fanning Page Layers */}
        <path d="M 150 145 L 25 115 L 25 35 L 150 55 Z" fill="#EDE7F6" stroke="#D1C4E9" strokeWidth="1" />
        <path d="M 150 145 L 275 115 L 275 35 L 150 55 Z" fill="#EDE7F6" stroke="#D1C4E9" strokeWidth="1" />
        <path d="M 150 135 L 30 105 L 30 25 L 150 45 Z" fill="#FFFFFF" stroke="#B39DDB" strokeWidth="1.5" />
        <path d="M 150 135 L 270 105 L 270 25 L 150 45 Z" fill="#FFFFFF" stroke="#B39DDB" strokeWidth="1.5" />

        {/* Text Lines on Left & Right Pages */}
        <line x1="50" y1="48" x2="130" y2="54" stroke="#9575CD" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="64" x2="130" y2="70" stroke="#9575CD" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="80" x2="115" y2="85" stroke="#9575CD" strokeWidth="2.5" strokeLinecap="round" />

        <line x1="170" y1="54" x2="250" y2="48" stroke="#9575CD" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="170" y1="70" x2="250" y2="64" stroke="#9575CD" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="170" y1="85" x2="235" y2="80" stroke="#9575CD" strokeWidth="2.5" strokeLinecap="round" />

        {/* Bookmark Ribbon */}
        <path d="M 150 45 L 150 155 L 160 145 L 170 155 L 170 45 Z" fill="#4CAF50" />
      </g>

      {/* Feather Quill Pen Right of Book */}
      <g transform="translate(640, 290) rotate(22)" filter="url(#eng-shadow)">
        <path d="M 45 10 C 28 32 12 65 18 115 L 12 130 L 25 125 C 50 115 60 85 55 32 Z" fill="#7E57C2" stroke="#4527A0" strokeWidth="2" />
        <line x1="18" y1="115" x2="48" y2="22" stroke="#EDE7F6" strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="12,130 6,145 20,137" fill="#212121" />
      </g>

      {/* CENTER HERO TYPOGRAPHY */}
      <g transform="translate(450, 235)" textAnchor="middle">
        <text
          x="0"
          y="0"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="50"
          fontWeight="900"
          letterSpacing="4"
          fill="#4A148C"
        >
          ENGLISH
        </text>
        <text
          x="0"
          y="38"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="17"
          fontWeight="600"
          fill="#6A1B9A"
          letterSpacing="0.5"
        >
          Read, write and discover stories
        </text>
      </g>
    </svg>
  );
}

/**
 * 5. HINDI ARTWORK DIORAMA
 * Reference: Frame 00:07 & 00:08
 * - Bold saffron title "हिन्दी" & "HINDI", subtitle "भाषा, साहित्य और रचनात्मक लेखन"
 * - Ancient manuscript parchment with wooden dowels
 * - Floating Devanagari calligraphy (अ, क, स, भा, थ, घ, न, रा)
 * - Peacock feather with turquoise eye & inkpot
 */
function HindiArtwork({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full object-cover select-none pointer-events-none ${className}`}
    >
      <defs>
        <linearGradient id="hin-bg" x1="0" y1="0" x2="900" y2="520" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFBF5" />
          <stop offset="50%" stopColor="#FFF3E0" />
          <stop offset="100%" stopColor="#FFE0B2" />
        </linearGradient>
        <linearGradient id="hin-pedestal" x1="150" y1="0" x2="750" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFB74D" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#F57C00" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFB74D" stopOpacity="0.2" />
        </linearGradient>
        <filter id="hin-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#E65100" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Diorama Background */}
      <rect width="900" height="520" rx="32" fill="url(#hin-bg)" />

      {/* Base Pedestal Oval Shadow */}
      <ellipse cx="450" cy="470" rx="380" ry="32" fill="url(#hin-pedestal)" />

      {/* Floating Devanagari Letters Left */}
      <g filter="url(#hin-shadow)">
        <text x="130" y="95" fontFamily="sans-serif" fontSize="46" fontWeight="bold" fill="#D84315" transform="rotate(-10 130 95)">अ</text>
        <text x="230" y="125" fontFamily="sans-serif" fontSize="40" fontWeight="bold" fill="#BF360C" transform="rotate(8 230 125)">क</text>
        <text x="100" y="200" fontFamily="sans-serif" fontSize="42" fontWeight="bold" fill="#E64A19">भा</text>
        <text x="180" y="235" fontFamily="sans-serif" fontSize="44" fontWeight="bold" fill="#D84315">थ</text>
      </g>

      {/* Floating Devanagari Letters Right */}
      <g filter="url(#hin-shadow)">
        <text x="730" y="95" fontFamily="sans-serif" fontSize="42" fontWeight="bold" fill="#D84315" transform="rotate(12 730 95)">घ</text>
        <text x="790" y="145" fontFamily="sans-serif" fontSize="40" fontWeight="bold" fill="#BF360C" transform="rotate(-15 790 145)">स</text>
        <text x="700" y="200" fontFamily="sans-serif" fontSize="42" fontWeight="bold" fill="#E64A19">न</text>
      </g>

      {/* Center Parchment Manuscript Scroll */}
      <g transform="translate(300, 290)" filter="url(#hin-shadow)">
        <rect x="20" y="20" width="280" height="140" rx="8" fill="#FFF8E1" stroke="#FFB300" strokeWidth="2.5" />
        {/* Wooden Roll Ends */}
        <rect x="10" y="10" width="18" height="160" rx="5" fill="#8D6E63" stroke="#5D4037" strokeWidth="2" />
        <rect x="292" y="10" width="18" height="160" rx="5" fill="#8D6E63" stroke="#5D4037" strokeWidth="2" />

        {/* Text Lines */}
        <line x1="45" y1="45" x2="270" y2="45" stroke="#FFA000" strokeWidth="2" strokeLinecap="round" />
        <line x1="45" y1="65" x2="270" y2="65" stroke="#FFA000" strokeWidth="2" strokeLinecap="round" />
        <line x1="45" y1="85" x2="245" y2="85" stroke="#FFA000" strokeWidth="2" strokeLinecap="round" />
        <line x1="45" y1="105" x2="255" y2="105" stroke="#FFA000" strokeWidth="2" strokeLinecap="round" />
        <line x1="45" y1="125" x2="210" y2="125" stroke="#FFA000" strokeWidth="2" strokeLinecap="round" />

        <text x="150" y="90" fontFamily="serif" fontSize="32" fontWeight="bold" fill="#D84315" textAnchor="middle">साहित्य</text>
      </g>

      {/* Peacock Feather on Right */}
      <g transform="translate(650, 290) rotate(18)" filter="url(#hin-shadow)">
        <path d="M 28 0 C 12 22 2 48 12 80 C 28 95 50 90 55 68 C 60 38 42 16 28 0 Z" fill="#00796B" stroke="#004D40" strokeWidth="2" />
        <path d="M 26 28 C 18 42 10 56 18 70 C 28 78 40 74 42 62 C 45 46 35 36 26 28 Z" fill="#0288D1" />
        <circle cx="30" cy="54" r="8" fill="#FFB300" />
        <line x1="25" y1="80" x2="14" y2="120" stroke="#004D40" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* CENTER HERO TYPOGRAPHY */}
      <g transform="translate(450, 235)" textAnchor="middle">
        <text
          x="0"
          y="0"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="48"
          fontWeight="900"
          letterSpacing="4"
          fill="#D84315"
        >
          हिन्दी • HINDI
        </text>
        <text
          x="0"
          y="38"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="17"
          fontWeight="600"
          fill="#E64A19"
          letterSpacing="0.5"
        >
          भाषा, साहित्य और रचनात्मक लेखन
        </text>
      </g>
    </svg>
  );
}

/**
 * 6. SANSKRIT ARTWORK DIORAMA
 * Reference: Frame 00:08 & 00:09
 * - Bold golden-brown title "संस्कृत" & "SANSKRIT", subtitle "Explore classical language and knowledge"
 * - Sanskrit Shloka: "धृतिः क्षमा दमोऽस्तेयं..."
 * - Palm-leaf manuscript with red silk binding
 * - Sacred lotus motif & Vedic seal
 */
function SanskritArtwork({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full object-cover select-none pointer-events-none ${className}`}
    >
      <defs>
        <linearGradient id="san-bg" x1="0" y1="0" x2="900" y2="520" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFDF7" />
          <stop offset="50%" stopColor="#FEF9E7" />
          <stop offset="100%" stopColor="#FDF0CD" />
        </linearGradient>
        <linearGradient id="san-pedestal" x1="150" y1="0" x2="750" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#B45309" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.2" />
        </linearGradient>
        <filter id="san-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#78350F" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Diorama Background */}
      <rect width="900" height="520" rx="32" fill="url(#san-bg)" />

      {/* Base Pedestal Oval Shadow */}
      <ellipse cx="450" cy="470" rx="380" ry="32" fill="url(#san-pedestal)" />

      {/* Sanskrit Shloka on Top Center */}
      <g transform="translate(450, 75)" textAnchor="middle" filter="url(#san-shadow)">
        <text x="0" y="0" fontFamily="serif" fontSize="22" fontWeight="bold" fill="#92400E">
          धृतिः क्षमा दमोऽस्तेयं शौचमिन्द्रियनिग्रहः ।
        </text>
        <text x="0" y="30" fontFamily="serif" fontSize="22" fontWeight="bold" fill="#92400E">
          धीर्विद्या सत्यमक्रोधो दशकं धर्मलक्षणम् ॥
        </text>
      </g>

      {/* Classical Calligraphy Left & Right */}
      <text x="130" y="90" fontFamily="serif" fontSize="42" fontWeight="bold" fill="#B45309" transform="rotate(-8 130 90)">संस्कृत</text>
      <text x="750" y="90" fontFamily="serif" fontSize="38" fontWeight="bold" fill="#B45309" transform="rotate(8 750 90)">ज्ञानम्</text>

      {/* Center Classical Palm-Leaf Manuscript (Taalapatra) */}
      <g transform="translate(290, 290)" filter="url(#san-shadow)">
        {/* Layered Palm Leaves */}
        <rect x="10" y="10" width="300" height="42" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
        <rect x="20" y="42" width="300" height="42" rx="4" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
        <rect x="10" y="74" width="300" height="42" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />

        {/* Binding Cord Holes */}
        <circle cx="50" cy="30" r="4.5" fill="#78350F" />
        <circle cx="50" cy="62" r="4.5" fill="#78350F" />
        <circle cx="50" cy="94" r="4.5" fill="#78350F" />
        <circle cx="270" cy="30" r="4.5" fill="#78350F" />
        <circle cx="270" cy="62" r="4.5" fill="#78350F" />
        <circle cx="270" cy="94" r="4.5" fill="#78350F" />

        {/* Red Silk Cord */}
        <line x1="50" y1="10" x2="50" y2="120" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
        <line x1="270" y1="10" x2="270" y2="120" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />

        {/* Manuscript Verses */}
        <text x="160" y="36" fontFamily="serif" fontSize="15" fontWeight="bold" fill="#78350F" textAnchor="middle">विद्या ददाति विनयं विनयाद्याति पात्रताम्</text>
        <text x="160" y="68" fontFamily="serif" fontSize="15" fontWeight="bold" fill="#78350F" textAnchor="middle">पात्रत्वाद्धनमाप्नोति धनाद्धर्मं ततः सुखम्</text>
        <text x="160" y="100" fontFamily="serif" fontSize="15" fontWeight="bold" fill="#78350F" textAnchor="middle">ॐ असतो मा सद्गमय तमसो मा ज्योतिर्गमय</text>
      </g>

      {/* Classical Lotus Motif Bottom Center */}
      <g transform="translate(450, 440)" opacity="0.6">
        <path d="M 0 0 C -20 -15 -25 -35 0 -45 C 25 -35 20 -15 0 0 Z" fill="#F59E0B" />
        <path d="M -5 -5 C -30 -10 -45 -25 -25 -40 C -10 -25 -5 -10 -5 -5 Z" fill="#D97706" />
        <path d="M 5 -5 C 30 -10 45 -25 25 -40 C 10 -25 5 -10 5 -5 Z" fill="#D97706" />
      </g>

      {/* CENTER HERO TYPOGRAPHY */}
      <g transform="translate(450, 235)" textAnchor="middle">
        <text
          x="0"
          y="0"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="48"
          fontWeight="900"
          letterSpacing="4"
          fill="#78350F"
        >
          संस्कृत • SANSKRIT
        </text>
        <text
          x="0"
          y="38"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="17"
          fontWeight="600"
          fill="#B45309"
          letterSpacing="0.5"
        >
          Explore classical language and knowledge
        </text>
      </g>
    </svg>
  );
}
