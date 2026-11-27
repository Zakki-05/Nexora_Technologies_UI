'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { NextLogo } from '@/components/layout/NextLogo';
import {
  Clock,
  Coffee,
  Play,
  ShieldCheck,
  Building2,
  FileText,
  Users,
  ArrowRight,
  Sparkles,
  Calendar,
  Moon,
  Sun,
  IndianRupee,
  Menu,
  X,
  CheckCircle2,
  Smartphone,
} from 'lucide-react';

export function LandingExperience() {
  const { user, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [demoPunchedIn, setDemoPunchedIn] = useState(true);
  const [demoOnBreak, setDemoOnBreak] = useState(false);
  const [demoSeconds, setDemoSeconds] = useState(15480);
  const [demoGrossSalary, setDemoGrossSalary] = useState(85000);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (demoPunchedIn && !demoOnBreak) {
        setDemoSeconds((prev) => prev + 1);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [demoPunchedIn, demoOnBreak]);

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const calcBasic = demoGrossSalary * 0.5;
  const calcEPF = Math.min(calcBasic, 15000) * 0.12;
  const calcESIC = demoGrossSalary <= 21000 ? demoGrossSalary * 0.0075 : 0;
  const calcPT = 200;
  const calcTDS = demoGrossSalary > 75000 ? demoGrossSalary * 0.08 : demoGrossSalary * 0.03;
  const netTakeHome = demoGrossSalary - (calcEPF + calcESIC + calcPT + calcTDS);

  const portalHref = user ? (isAdmin ? '/admin' : '/employee') : '/login';

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#060D1F] text-slate-900 dark:text-[#F8FAFC] transition-colors">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#060D1F]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <NextLogo size="md" href="/" showTagline />

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors">Features</a>
            <a href="#payroll" className="hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors">Indian Payroll</a>
            <a href="#security" className="hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors">Security</a>
            <a href="#mobile" className="hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors">Mobile &amp; PWA</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              href={portalHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0891B2] text-white text-sm font-bold shadow-md shadow-[#2563EB]/25 hover:opacity-95 transition"
            >
              <span>{user ? 'Open Dashboard' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((p) => !p)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-4 space-y-3 bg-white dark:bg-[#0B1426]">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold">Features</a>
            <a href="#payroll" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold">Indian Payroll</a>
            <a href="#security" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold">Security</a>
            <Link
              href={portalHref}
              className="block w-full text-center py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-bold"
            >
              {user ? 'Open Dashboard' : 'Sign In'}
            </Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-[#111C32] border border-blue-200 dark:border-[#2563EB]/40 text-[#2563EB] dark:text-[#06B6D4] text-xs font-bold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nexora Workforce 3.0 &bull; Next.js + FastAPI + PostgreSQL</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Enterprise Workforce Management.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
                Anywhere. On Any Device.
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Manage employee directories, multi-session attendance &amp; breaks, 10-ledger leave balances, expense reimbursements, and Indian statutory payroll in one unified SaaS platform.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={portalHref}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0891B2] text-white font-bold text-sm shadow-lg shadow-[#2563EB]/25"
              >
                <span>{user ? 'Go to Portal' : 'Sign In to Nexora EMS'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#payroll"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
              >
                Try Payroll Calculator
              </a>
            </div>
          </div>

          {/* Interactive Live Attendance Simulator */}
          <div className="bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#06B6D4]">
                  Interactive Attendance Engine Preview
                </p>
                <h2 className="text-lg font-bold mt-1">Live Shift &amp; Break Tracker</h2>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  demoPunchedIn
                    ? demoOnBreak
                      ? 'bg-amber-500/15 text-amber-500'
                      : 'bg-emerald-500/15 text-emerald-500'
                    : 'bg-slate-500/15 text-slate-400'
                }`}
              >
                {demoPunchedIn ? (demoOnBreak ? 'ON BREAK' : 'ACTIVE SHIFT') : 'CLOCKED OUT'}
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0B1426] border border-slate-200/80 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Worked Duration</p>
              <p className="text-4xl sm:text-5xl font-mono font-extrabold tracking-tight mt-2 text-slate-900 dark:text-white">
                {formatTimer(demoSeconds)}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setDemoPunchedIn((p) => !p);
                  setDemoOnBreak(false);
                }}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition"
              >
                <Play className="w-4 h-4" />
                {demoPunchedIn ? 'Punch Out' : 'Punch In'}
              </button>
              <button
                type="button"
                disabled={!demoPunchedIn}
                onClick={() => setDemoOnBreak((b) => !b)}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Coffee className="w-4 h-4 text-amber-500" />
                {demoOnBreak ? 'Resume Work' : 'Take Break'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-12">Complete Enterprise HR Suite</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: 'Employee Directory & Org Chart', desc: 'Centralized profiles, onboarding balances, Excel/CSV exports, and visual hierarchy.' },
              { icon: Clock, title: 'Multi-Session Attendance', desc: 'Real-time punch-in/out, break tracking, midnight crossing, and regularization approvals.' },
              { icon: Calendar, title: '10-Ledger Leave System', desc: 'Casual, Sick, Earned, Maternity, Paternity, weekend exclusion, and atomic balance ledgers.' },
              { icon: IndianRupee, title: 'Indian Statutory Payroll', desc: 'EPF 12%, ESIC 0.75%, Professional Tax, TDS, LOP, and ReportLab PDF payslips.' },
              { icon: FileText, title: 'Expense Claims & Documents', desc: 'Employee reimbursement submissions, admin approval amounts, and encrypted document vault.' },
              { icon: Building2, title: 'Multi-Tenant Organizations', desc: 'Tenant-scoped PostgreSQL architecture with role-based permissions and audit logs.' },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="p-6 rounded-2xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-[#2563EB] dark:text-[#06B6D4] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Payroll Calculator */}
      <section id="payroll" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-100/70 dark:bg-[#0B1426]/60">
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
          <h2 className="text-2xl font-extrabold mb-2">Interactive Indian Statutory Payroll Preview</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Slide monthly gross CTC to inspect EPF, ESIC, Professional Tax, and estimated take-home pay.
          </p>
          <div className="mb-6">
            <div className="flex justify-between text-sm font-bold mb-2">
              <span>Monthly Gross Salary</span>
              <span className="text-[#2563EB] dark:text-[#06B6D4]">₹{demoGrossSalary.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={15000}
              max={250000}
              step={5000}
              value={demoGrossSalary}
              onChange={(e) => setDemoGrossSalary(Number(e.target.value))}
              aria-label="Monthly Gross Salary"
              className="w-full accent-[#2563EB]"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1426]">
              <p className="text-xs text-slate-500">EPF (12%)</p>
              <p className="font-bold mt-1">₹{Math.round(calcEPF).toLocaleString('en-IN')}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1426]">
              <p className="text-xs text-slate-500">ESIC (0.75%)</p>
              <p className="font-bold mt-1">₹{Math.round(calcESIC).toLocaleString('en-IN')}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1426]">
              <p className="text-xs text-slate-500">PT + Est. TDS</p>
              <p className="font-bold mt-1">₹{Math.round(calcPT + calcTDS).toLocaleString('en-IN')}</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Est. Net Pay</p>
              <p className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                ₹{Math.round(netTakeHome).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Mobile Showcase */}
      <section id="security" className="py-16 px-4 sm:px-6 lg:px-8">
        <div id="mobile" className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-8 h-8 text-[#2563EB] mb-4" />
            <h3 className="text-xl font-extrabold mb-3">Enterprise Security Architecture</h3>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Argon2id password hashing &amp; rotating JWT refresh tokens</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Authoritative FastAPI RBAC &amp; rate-limited authentication</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> PostgreSQL parameterized queries &amp; strict CORS policies</li>
            </ul>
          </div>
          <div className="p-8 rounded-3xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800">
            <Smartphone className="w-8 h-8 text-[#06B6D4] mb-4" />
            <h3 className="text-xl font-extrabold mb-3">Installable PWA &amp; Mobile Ready</h3>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Standalone installable Progressive Web Application</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Ergonomic 1-thumb mobile bottom navigation &amp; safe areas</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Capacitor configuration ready for Android &amp; iOS wrappers</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        &copy; {new Date().getFullYear()} Nexora Technologies Inc. &bull; Nexora Workforce 3.0
      </footer>
    </div>
  );
}
