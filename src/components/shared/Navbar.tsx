'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/actions/auth';
import { AuthSessionUser } from '@/lib/auth/session';
import { RouteProgressIndicator } from '@/components/ui/RouteProgressIndicator';
import {
  BookOpen,
  GraduationCap,
  HeartHandshake,
  Layers,
  BarChart3,
  Compass,
  Menu,
  X,
  LogOut,
  Bell,
  Shield,
  Building2,
  Sparkles,
  Calendar,
  MessageSquare,
  Leaf,
  ChevronDown,
  User,
  Settings,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { UserRole } from '@prisma/client';

interface NavbarProps {
  currentUser: AuthSessionUser | null;
}

export function Navbar({ currentUser }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Scroll listener for elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Role-specific navigation links strictly tailored to current persona
  const getNavLinks = () => {
    if (!currentUser) {
      return [
        { label: 'Learn', href: '/learn', icon: BookOpen },
        { label: 'Teach', href: '/teach', icon: GraduationCap },
        { label: 'Needs', href: '/needs', icon: Layers },
        { label: 'Impact', href: '/impact', icon: BarChart3 },
        { label: 'About', href: '/about', icon: ShieldCheck },
        { label: 'Contact', href: '/contact', icon: MessageSquare },
      ];
    }

    switch (currentUser.role) {
      case UserRole.LEARNER:
        return [
          { label: 'My Learning', href: '/dashboard/learner', icon: Layers },
          { label: 'Class Syllabus', href: `/learn/${currentUser.classLevel || 6}`, icon: BookOpen },
          { label: 'Practice', href: `/learn/${currentUser.classLevel || 6}`, icon: BarChart3 },
          { label: 'Ask a Doubt', href: '/dashboard/learner#doubts', icon: Sparkles },
          { label: 'Career', href: '/career', icon: Compass },
        ];

      case UserRole.VOLUNTEER:
        return [
          { label: 'Overview', href: '/dashboard/volunteer', icon: Building2 },
          { label: 'Opportunities', href: '/dashboard/volunteer', icon: Sparkles },
          { label: 'Teach for a Day', href: '/teach', icon: GraduationCap },
          { label: 'My Sessions', href: '/dashboard/volunteer', icon: Calendar },
          { label: 'Contributions', href: '/dashboard/volunteer', icon: Layers },
          { label: 'Certificates', href: '/dashboard/volunteer', icon: ShieldCheck },
        ];

      case UserRole.INSTITUTION:
        return [
          { label: 'Overview', href: '/dashboard/institution', icon: Building2 },
          { label: 'Needs', href: '/dashboard/institution', icon: Layers },
          { label: 'Volunteers', href: '/dashboard/institution', icon: GraduationCap },
          { label: 'Sessions', href: '/dashboard/institution', icon: Calendar },
          { label: 'Resources', href: '/dashboard/institution', icon: HeartHandshake },
          { label: 'Learning', href: '/dashboard/institution', icon: BookOpen },
          { label: 'Impact', href: '/dashboard/institution', icon: BarChart3 },
        ];

      case UserRole.DONOR:
        return [
          { label: 'Overview', href: '/dashboard/donor', icon: Building2 },
          { label: 'Explore Needs', href: '/needs', icon: Layers },
          { label: 'My Donations', href: '/dashboard/donor', icon: HeartHandshake },
          { label: 'Impact', href: '/dashboard/donor', icon: BarChart3 },
        ];

      case UserRole.ADMIN:
        return [
          { label: 'Overview', href: '/dashboard/admin', icon: Shield },
          { label: 'Verification', href: '/dashboard/admin', icon: ShieldCheck },
          { label: 'Content', href: '/dashboard/admin', icon: BookOpen },
          { label: 'Needs', href: '/dashboard/admin', icon: Layers },
          { label: 'Impact', href: '/dashboard/admin', icon: BarChart3 },
        ];

      default:
        return [
          { label: 'Learn', href: '/learn', icon: BookOpen },
          { label: 'Teach', href: '/teach', icon: GraduationCap },
          { label: 'Needs', href: '/needs', icon: Layers },
        ];
    }
  };

  const navLinks = getNavLinks();

  const getRoleDisplay = (user: AuthSessionUser) => {
    switch (user.role) {
      case UserRole.LEARNER:
        return `Learner • Class ${user.classLevel || 6}`;
      case UserRole.VOLUNTEER:
        return 'Volunteer Teacher';
      case UserRole.INSTITUTION:
        return 'Child Care Institution';
      case UserRole.DONOR:
        return 'Educational Donor';
      case UserRole.ADMIN:
        return 'System Administrator';
    }
  };

  return (
    <>
      <RouteProgressIndicator />
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-[#E2E8E0] shadow-2xs'
            : 'bg-[#F8F7F2]/90 backdrop-blur-sm border-b border-[#E2E8E0]/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-[#4F9D69] text-white flex items-center justify-center font-bold text-lg shadow-2xs group-hover:bg-[#3E8555] transition-transform group-hover:scale-105">
                  <Leaf className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-lg font-extrabold tracking-tight text-[#25352B] flex items-center">
                    Shiksha<span className="text-[#4F9D69]">Setu</span>
                  </span>
                  <span className="block text-[9px] font-semibold text-[#647067] tracking-wider uppercase">
                    Connect • Teach • Give
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Role-Based Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 relative ${
                      isActive
                        ? 'bg-[#EEF7F0] text-[#4F9D69] font-bold'
                        : 'text-[#647067] hover:text-[#25352B] hover:bg-[#EEF7F0]/40'
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 transition-colors ${
                        isActive ? 'text-[#4F9D69]' : 'text-[#8E9990]'
                      }`}
                    />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-[1px] left-3 right-3 h-[2px] bg-[#4F9D69] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Notifications & Profile Dropdown / Auth Buttons */}
            <div className="hidden md:flex items-center gap-2.5">
              {currentUser ? (
                <>
                  {/* Notifications Popover */}
                  <div className="relative" ref={notificationsRef}>
                    <button
                      type="button"
                      onClick={() => setNotificationsOpen(!notificationsOpen)}
                      className="p-2 text-[#647067] hover:text-[#25352B] hover:bg-[#EEF7F0] rounded-xl transition-all relative cursor-pointer active:scale-95"
                      title="Notifications"
                      aria-label="Notifications"
                    >
                      <Bell className="w-4 h-4" />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#4F9D69] rounded-full ring-2 ring-white" />
                    </button>

                    {notificationsOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-[#E2E8E0] shadow-xl p-4 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b border-[#E2E8E0] pb-2">
                          <span className="text-xs font-bold text-[#25352B] uppercase tracking-wider">
                            Notifications
                          </span>
                          <span className="text-[10px] text-[#4F9D69] font-bold bg-[#EEF7F0] px-2 py-0.5 rounded-full border border-[#78B98A]/30">
                            Live Feed
                          </span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] hover:bg-[#EEF7F0]/60 transition-colors">
                            <p className="font-bold text-[#25352B]">
                              {currentUser.role === UserRole.ADMIN
                                ? 'New Institution KYC Pending Audit'
                                : currentUser.role === UserRole.LEARNER
                                ? 'Class 8 Mathematics Quiz Available'
                                : currentUser.role === UserRole.VOLUNTEER
                                ? 'Sunday Teaching Session Confirmed'
                                : 'Verified Textbook Requirement Updated'}
                            </p>
                            <p className="text-[#647067] text-[11px] mt-0.5">
                              {currentUser.name} • Active workspace update
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Proper User Profile Dropdown (Requirement 7) */}
                  <div className="relative" ref={profileRef}>
                    <button
                      type="button"
                      onClick={() => setProfileOpen(!profileOpen)}
                      className={`flex items-center gap-2 py-1.5 px-3 rounded-xl border transition-all cursor-pointer ${
                        profileOpen
                          ? 'bg-[#EEF7F0] border-[#78B98A] text-[#25352B]'
                          : 'bg-white border-[#E2E8E0] hover:bg-[#FAFBF9] text-[#25352B]'
                      }`}
                      aria-label="User Profile"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#EEF7F0] text-[#4F9D69] flex items-center justify-center font-bold text-xs border border-[#78B98A]/30">
                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="text-left hidden lg:block">
                        <span className="text-xs font-bold text-[#25352B] block leading-tight">
                          {currentUser.name}
                        </span>
                        <span className="text-[10px] text-[#647067] block leading-tight">
                          {getRoleDisplay(currentUser)}
                        </span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-[#8E9990]" />
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#E2E8E0] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                        {/* Header: Name, Role, Verified Status */}
                        <div className="px-3 py-2.5 border-b border-[#E2E8E0] mb-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#25352B]">
                              {currentUser.name}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-[#4F9D69] bg-[#EEF7F0] px-2 py-0.5 rounded-full border border-[#78B98A]/30">
                              <CheckCircle2 className="w-3 h-3" />
                              Verified
                            </span>
                          </div>
                          <span className="text-[11px] text-[#647067] mt-0.5 block">
                            {getRoleDisplay(currentUser)}
                          </span>
                        </div>

                        {/* Menu Options (No Role Switching!) */}
                        <div className="space-y-0.5">
                          {currentUser.role === UserRole.LEARNER && (
                            <Link
                              href="/dashboard/learner?chooseClass=true"
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#4F9D69] bg-[#EEF7F0]/60 hover:bg-[#EEF7F0] transition-colors"
                            >
                              <GraduationCap className="w-4 h-4 text-[#4F9D69]" />
                              <span>Change Class</span>
                            </Link>
                          )}

                          <Link
                            href={`/dashboard/${currentUser.role.toLowerCase()}`}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#25352B] hover:bg-[#EEF7F0] hover:text-[#4F9D69] transition-colors"
                          >
                            <User className="w-4 h-4 text-[#8E9990]" />
                            <span>My Profile</span>
                          </Link>

                          <Link
                            href={`/dashboard/${currentUser.role.toLowerCase()}#settings`}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#25352B] hover:bg-[#EEF7F0] hover:text-[#4F9D69] transition-colors"
                          >
                            <Settings className="w-4 h-4 text-[#8E9990]" />
                            <span>Account Settings</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              setProfileOpen(false);
                              setNotificationsOpen(true);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#25352B] hover:bg-[#EEF7F0] hover:text-[#4F9D69] transition-colors cursor-pointer text-left"
                          >
                            <Bell className="w-4 h-4 text-[#8E9990]" />
                            <span>Notifications</span>
                          </button>

                          <Link
                            href="/about"
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#25352B] hover:bg-[#EEF7F0] hover:text-[#4F9D69] transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-[#8E9990]" />
                            <span>Privacy & Safeguards</span>
                          </Link>
                        </div>

                        {/* Logout Form */}
                        <div className="pt-1 mt-1 border-t border-[#E2E8E0]">
                          <form action={logoutAction}>
                            <button
                              type="submit"
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#D9534F] hover:bg-red-50 transition-colors cursor-pointer text-left"
                            >
                              <LogOut className="w-4 h-4 text-[#D9534F]" />
                              <span>Logout</span>
                            </button>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 text-xs font-bold text-[#25352B] hover:text-[#4F9D69] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-4 py-2 rounded-xl bg-[#4F9D69] hover:bg-[#3E8555] text-white font-bold text-xs shadow-2xs btn-primary-lift transition-all"
                  >
                    Join ShikshaSetu
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#647067] hover:text-[#25352B] rounded-lg focus:outline-none cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#E2E8E0] px-4 py-4 space-y-3 shadow-lg animate-in fade-in duration-200">
            {currentUser && (
              <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#25352B] block">
                    {currentUser.name}
                  </span>
                  <span className="text-[11px] text-[#647067] block">
                    {getRoleDisplay(currentUser)}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-[#4F9D69] bg-[#EEF7F0] px-2 py-0.5 rounded-full border border-[#78B98A]/30">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              </div>
            )}

            <div className="space-y-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      isActive ? 'bg-[#EEF7F0] text-[#4F9D69]' : 'text-[#647067] hover:bg-[#FAFBF9]'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#4F9D69]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#E2E8E0] flex flex-col gap-2">
              {currentUser ? (
                <>
                  {currentUser.role === UserRole.LEARNER && (
                    <Link
                      href="/dashboard/learner?chooseClass=true"
                      className="w-full text-center bg-[#EEF7F0] text-[#4F9D69] border border-[#78B98A]/40 py-2.5 rounded-xl text-xs font-bold"
                    >
                      Change Class
                    </Link>
                  )}
                  <Link
                    href={`/dashboard/${currentUser.role.toLowerCase()}`}
                    className="w-full text-center bg-[#4F9D69] text-white py-2.5 rounded-xl text-xs font-bold"
                  >
                    Open Workspace
                  </Link>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="w-full text-center py-2 text-xs font-bold text-[#D9534F] bg-red-50 rounded-xl cursor-pointer"
                    >
                      Log Out
                    </button>
                  </form>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/auth/login"
                    className="text-center py-2.5 border border-[#E2E8E0] rounded-xl text-xs font-bold text-[#25352B]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-center py-2.5 bg-[#4F9D69] text-white rounded-xl text-xs font-bold"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
