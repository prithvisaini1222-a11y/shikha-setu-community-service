'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Layers,
  BarChart3,
  Sparkles,
  Compass,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Calendar,
  ShieldCheck,
  Video,
} from 'lucide-react';
import { logoutAction } from '@/actions/auth';

interface SidebarNavSubItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface LearnerCollapsibleSidebarProps {
  currentClass: number;
  studentName: string;
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function LearnerCollapsibleSidebar({
  currentClass,
  studentName,
  activeSection = 'my-learning',
  onSelectSection,
  isCollapsed,
  onToggleCollapse,
}: LearnerCollapsibleSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems: SidebarNavSubItem[] = [
    {
      label: 'My Learning',
      href: '/dashboard/learner',
      icon: Layers,
    },
    {
      label: 'Class Syllabus',
      href: `/learn/${currentClass}`,
      icon: BookOpen,
    },
    {
      label: 'Practice & Quizzes',
      href: '#practice',
      icon: BarChart3,
    },
    {
      label: 'Ask a Doubt',
      href: '#doubts',
      icon: Sparkles,
    },
    {
      label: 'Career Guidance',
      href: '/career',
      icon: Compass,
    },
  ];

  const handleItemClick = (item: SidebarNavSubItem) => {
    if (onSelectSection) {
      if (item.href === '/dashboard/learner') {
        onSelectSection('my-learning');
      } else if (item.href.startsWith('#')) {
        onSelectSection(item.href.replace('#', ''));
      }
    }
    setMobileOpen(false);
  };

  return (
    <>
      {/* 1. Mobile Menu Hamburger Button (Fixed on Mobile) */}
      <div className="lg:hidden fixed top-3.5 left-4 z-40">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-white border border-[#E2E8E0] text-[#18261E] shadow-sm hover:bg-[#F4F7F4] transition-colors cursor-pointer"
          type="button"
          aria-label="Toggle navigation drawer"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* 2. Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* 3. Main Desktop & Mobile Drawer Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-30 bg-white border-r border-[#E2E8E0] flex flex-col justify-between transition-all duration-300 ease-in-out select-none shadow-xs ${
          /* Desktop width */
          isCollapsed ? 'lg:w-[72px]' : 'lg:w-[250px]'
        } ${
          /* Mobile drawer state */
          mobileOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* TOP SECTION: Logo + Collapse Toggle Button */}
        <div>
          <div className="h-16 px-4 border-b border-[#E2E8E0]/80 flex items-center justify-between">
            {/* Logo / Brand Icon */}
            <Link
              href="/dashboard/learner"
              className="flex items-center gap-2.5 overflow-hidden group py-1"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] text-white flex items-center justify-center shrink-0 shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              {(!isCollapsed || mobileOpen) && (
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <span className="font-extrabold text-base tracking-tight text-[#18261E] block leading-none">
                    Shiksha<span className="text-[#2E7D32]">Setu</span>
                  </span>
                  <span className="text-[10px] font-semibold text-[#4E5C53] tracking-wider uppercase block mt-0.5">
                    Learner Hub
                  </span>
                </motion.div>
              )}
            </Link>

            {/* Desktop Collapse / Expand Toggle Button (CLICK ONLY — NO HOVER) */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg border border-[#E2E8E0] text-[#4E5C53] hover:text-[#18261E] hover:bg-[#F4F7F4] hover:border-[#C8E6C9] transition-all cursor-pointer shrink-0 active:scale-95"
              type="button"
              aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-[#2E7D32]" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-[#2E7D32]" />
              )}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-[#4E5C53] hover:bg-[#F4F7F4]"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Class Badge */}
          {(!isCollapsed || mobileOpen) ? (
            <div className="px-4 pt-4 pb-2">
              <div className="px-3 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-[#4E5C53] block">
                    Current Syllabus
                  </span>
                  <span className="text-xs font-bold text-[#18261E] block">
                    Class {currentClass} NCERT
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                  Active
                </span>
              </div>
            </div>
          ) : (
            <div className="px-2 pt-3 pb-1 flex justify-center">
              <div
                className="w-8 h-8 rounded-lg bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-xs font-extrabold flex items-center justify-center cursor-default"
                title={`Class ${currentClass} NCERT`}
              >
                {currentClass}
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-2 space-y-1 mt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/dashboard/learner'
                  ? pathname === '/dashboard/learner' && activeSection === 'my-learning'
                  : item.href.startsWith('#')
                  ? activeSection === item.href.replace('#', '')
                  : pathname === item.href;

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => isCollapsed && setHoveredItem(item.label)}
                  onMouseLeave={() => isCollapsed && setHoveredItem(null)}
                >
                  <Link
                    href={item.href}
                    onClick={() => handleItemClick(item)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#EEF7F0] text-[#18261E] font-bold border border-[#C8E6C9]'
                        : 'text-[#4E5C53] hover:bg-[#F8FAF8] hover:text-[#18261E]'
                    } ${isCollapsed && !mobileOpen ? 'justify-center px-0' : ''}`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-[#2E7D32]' : 'text-[#4E5C53]'
                      }`}
                    />
                    {(!isCollapsed || mobileOpen) && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </Link>

                  {/* Floating Tooltip in Collapsed State */}
                  {isCollapsed && !mobileOpen && hoveredItem === item.label && (
                    <div className="fixed left-[76px] z-50 px-2.5 py-1 rounded-md bg-[#18261E] text-white text-[11px] font-medium shadow-md whitespace-nowrap pointer-events-none transition-opacity duration-150 -translate-y-8">
                      {item.label}
                      <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[4px] border-r-[#18261E]" />
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM SECTION: Learner Profile & Logout */}
        <div className="p-2 border-t border-[#E2E8E0]/80 space-y-1">
          {/* Profile Badge */}
          <div
            className="relative"
            onMouseEnter={() => isCollapsed && setHoveredItem('Profile')}
            onMouseLeave={() => isCollapsed && setHoveredItem(null)}
          >
            <button
              type="button"
              onClick={() => onSelectSection && onSelectSection('profile')}
              className={`w-full text-left flex items-center gap-2.5 p-2 rounded-xl transition-all cursor-pointer ${
                activeSection === 'profile'
                  ? 'bg-[#EEF7F0] border border-[#C8E6C9]'
                  : 'bg-[#FAFBF9] border border-[#E2E8E0]/60 hover:border-[#C8E6C9]'
              } ${isCollapsed && !mobileOpen ? 'justify-center p-2' : ''}`}
            >
              <div className="w-8 h-8 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                {studentName.charAt(0)}
              </div>
              {(!isCollapsed || mobileOpen) && (
                <div className="overflow-hidden min-w-0 flex-1">
                  <span className="text-xs font-bold text-[#18261E] block truncate">
                    {studentName}
                  </span>
                  <span className="text-[10px] text-[#4E5C53] block truncate">
                    Class {currentClass} Learner
                  </span>
                </div>
              )}
            </button>

            {/* Tooltip for profile */}
            {isCollapsed && !mobileOpen && hoveredItem === 'Profile' && (
              <div className="fixed left-[76px] z-50 px-2.5 py-1 rounded-md bg-[#18261E] text-white text-[11px] font-medium shadow-md whitespace-nowrap pointer-events-none -translate-y-8">
                {studentName} (Class {currentClass})
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[4px] border-r-[#18261E]" />
              </div>
            )}
          </div>

          {/* Logout Action */}
          <div
            className="relative"
            onMouseEnter={() => isCollapsed && setHoveredItem('Logout')}
            onMouseLeave={() => isCollapsed && setHoveredItem(null)}
          >
            <form action={logoutAction}>
              <button
                type="submit"
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#C62828] hover:bg-[#FFEBEE] transition-colors cursor-pointer ${
                  isCollapsed && !mobileOpen ? 'justify-center px-0' : ''
                }`}
              >
                <LogOut className="w-4 h-4 shrink-0 text-[#C62828]" />
                {(!isCollapsed || mobileOpen) && <span>Logout</span>}
              </button>
            </form>

            {/* Tooltip for logout */}
            {isCollapsed && !mobileOpen && hoveredItem === 'Logout' && (
              <div className="fixed left-[76px] z-50 px-2.5 py-1 rounded-md bg-[#C62828] text-white text-[11px] font-medium shadow-md whitespace-nowrap pointer-events-none -translate-y-8">
                Logout
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[4px] border-r-[#C62828]" />
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
