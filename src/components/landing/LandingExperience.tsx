'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Bot,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  Coffee,
  FileSpreadsheet,
  IndianRupee,
  Lock,
  Play,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
} from 'lucide-react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { IntelligenceCoreWrapper } from '@/components/three/scenes/IntelligenceCoreWrapper';
import { NextLogo } from '@/components/layout/NextLogo';

gsap.registerPlugin(ScrollTrigger);

const STORY_STEPS = [
  {
    step: '01',
    title: 'Workforce Complexity',
    desc: 'Unify distributed employees, multi-shift attendance, leave ledgers, and statutory payroll in one system.',
  },
  {
    step: '02',
    title: 'Connected Platform',
    desc: 'Role-scoped FastAPI services and PostgreSQL keep HR, Finance, and Employee self-service synchronized.',
  },
  {
    step: '03',
    title: 'Intelligent Automation',
    desc: 'Atomic leave reservations, LOP deduction sync, and multi-session break tracking run reliably.',
  },
  {
    step: '04',
    title: 'Nexora AI & Mobile',
    desc: 'Authorized Nexora Copilot answers workforce questions while PWA & Capacitor deliver native speed.',
  },
];

const FAQ_ITEMS = [
  {
    q: 'How does Nexora Workforce protect employee and payroll data?',
    a: 'All routes enforce JWT authentication, role-based access control (SUPER_ADMIN, ADMIN, HR_MANAGER, FINANCE_MANAGER, AUDITOR, EMPLOYEE), and organization scoping on FastAPI and PostgreSQL.',
  },
  {
    q: 'Can Nexora AI Copilot access another employee’s private records?',
    a: 'No. Nexora Copilot executes only typed, permission-checked backend tools scoped to the authenticated user and organization, never raw AI-generated SQL.',
  },
  {
    q: 'Does Nexora Workforce support mobile installation?',
    a: 'Yes. It is installable as a Progressive Web App (PWA) on desktop/mobile and packages cleanly via Capacitor for Android and iOS.',
  },
];

export function LandingExperience() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive Demo State (explicitly labeled Demo Preview)
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.nexora-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 86%',
              once: true,
            },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

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

  return (
    <div ref={rootRef} className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] overflow-x-hidden">
      <LandingNavbar />

      {/* 1. Cinematic 3D Hero */}
      <section className="relative pt-10 pb-20 lg:pt-16 lg:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nexora Workforce 3.0 &middot; Enterprise EMS</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08]">
              The Future of Workforce Management{' '}
              <span className="bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#22D3EE] bg-clip-text text-transparent">
                Starts Here.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
              Manage your people, attendance, payroll, performance and workplace intelligence through
              one connected enterprise platform.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white text-sm font-semibold shadow-lg shadow-blue-500/25 hover:opacity-95 transition-opacity"
              >
                <span>Explore Nexora Workforce</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#showcase"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-semibold hover:bg-[var(--surface-elevated)] transition-colors"
              >
                <span>Experience the Platform</span>
              </a>

              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold text-[var(--primary)] hover:underline"
              >
                <span>Sign In</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70 p-2 shadow-2xl">
              <IntelligenceCoreWrapper showQualityToggle />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Scroll Storytelling Strip */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[var(--border)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STORY_STEPS.map((item) => (
            <div
              key={item.step}
              className="nexora-reveal rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2"
            >
              <span className="font-mono text-xs font-bold text-[var(--accent)]">{item.step}</span>
              <h2 className="font-display text-base font-bold">{item.title}</h2>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Interactive Product Showcase (Demo Preview) */}
      <section id="showcase" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="nexora-reveal text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)]">
            Interactive Demo Preview
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Live Attendance &amp; Indian Statutory Payroll
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Test our multi-session shift timer and statutory EPF/ESIC/PT/TDS breakdown using
            client-side demonstration values.
          </p>
        </div>

        <div className="nexora-reveal grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interactive Attendance Card */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold">Multi-Session Attendance</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Demo Shift &middot; 09:30 – 18:30 IST</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  !demoPunchedIn
                    ? 'bg-slate-500/15 text-slate-400'
                    : demoOnBreak
                    ? 'bg-amber-500/15 text-amber-500'
                    : 'bg-emerald-500/15 text-emerald-500'
                }`}
              >
                {!demoPunchedIn ? 'Checked Out' : demoOnBreak ? 'On Break' : 'Checked In'}
              </span>
            </div>

            <div className="py-6 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] text-center">
              <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                Active Work Duration
              </p>
              <p className="font-mono text-4xl font-bold tabular-nums">{formatTimer(demoSeconds)}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setDemoPunchedIn((p) => !p);
                  setDemoOnBreak(false);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#3B82F6] text-white text-xs font-semibold"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{demoPunchedIn ? 'Demo Punch Out' : 'Demo Punch In'}</span>
              </button>
              <button
                type="button"
                disabled={!demoPunchedIn}
                onClick={() => setDemoOnBreak((b) => !b)}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-xs font-semibold disabled:opacity-40"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>{demoOnBreak ? 'Resume Work' : 'Start Break'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Payroll Card */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 text-violet-500 flex items-center justify-center">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold">Indian Statutory Payroll</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Interactive Gross-to-Net Preview</p>
                </div>
              </div>
              <span className="font-mono text-sm font-bold tabular-nums text-[var(--primary)]">
                ₹{demoGrossSalary.toLocaleString('en-IN')}
              </span>
            </div>

            <div>
              <label htmlFor="demo-salary-range" className="text-xs text-[var(--text-secondary)] block mb-2">
                Adjust Monthly Gross Salary
              </label>
              <input
                id="demo-salary-range"
                type="range"
                min={18000}
                max={200000}
                step={1000}
                value={demoGrossSalary}
                onChange={(e) => setDemoGrossSalary(Number(e.target.value))}
                className="w-full accent-[#3B82F6]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[var(--surface-elevated)]">
                <span className="text-[var(--text-secondary)]">Basic (50%)</span>
                <p className="font-mono font-bold tabular-nums mt-0.5">₹{calcBasic.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-elevated)]">
                <span className="text-[var(--text-secondary)]">EPF (12% capped)</span>
                <p className="font-mono font-bold tabular-nums mt-0.5">₹{Math.round(calcEPF).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-elevated)]">
                <span className="text-[var(--text-secondary)]">ESIC + PT + TDS</span>
                <p className="font-mono font-bold tabular-nums mt-0.5">
                  ₹{Math.round(calcESIC + calcPT + calcTDS).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Net Take-Home</span>
                <p className="font-mono font-bold tabular-nums text-emerald-600 dark:text-emerald-300 mt-0.5">
                  ₹{Math.round(netTakeHome).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Asymmetric Bento Grid Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[var(--border)]">
        <div className="nexora-reveal max-w-2xl mb-12 space-y-2">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Everything Your Organization Runs On
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Built directly on FastAPI, PostgreSQL, and Role-Based Access Control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="nexora-reveal md:col-span-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3 hover:border-blue-500/40 transition-colors">
            <Users className="w-6 h-6 text-[#3B82F6]" />
            <h3 className="font-display text-lg font-bold">Employee Directory &amp; Org Chart</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Manage employee profiles, onboarding status, department hierarchies, and document
              repositories with role-scoped visibility.
            </p>
          </div>

          <div className="nexora-reveal md:col-span-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3 hover:border-violet-500/40 transition-colors">
            <CalendarDays className="w-6 h-6 text-[#8B5CF6]" />
            <h3 className="font-display text-lg font-bold">10 Corporate Leave Ledgers</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Atomic pending reservation, holiday/weekend exclusion, half-day requests, and full
              approval/cancellation audit trails.
            </p>
          </div>

          <div id="nexora-ai" className="nexora-reveal md:col-span-4 rounded-3xl border border-blue-500/30 bg-gradient-to-br from-[#0B1120] to-[#111827] text-white p-6 space-y-3">
            <div className="inline-flex items-center gap-2 text-cyan-300 text-xs font-semibold">
              <Bot className="w-5 h-5" />
              <span>Nexora AI Copilot</span>
            </div>
            <h3 className="font-display text-xl font-bold">
              RBAC-Enforced Workforce Intelligence &amp; RAG
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              Stream natural-language answers grounded in your authorized workforce tools and
              pgvector-indexed HR policies—supporting Gemini, OpenAI, Claude, Groq, DeepSeek, and Ollama.
            </p>
          </div>

          <div className="nexora-reveal md:col-span-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3">
            <Building2 className="w-6 h-6 text-[#22D3EE]" />
            <h3 className="font-display text-lg font-bold">Departments &amp; Expenses</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Department headcounts, expense claim approvals, and multi-format CSV/Excel/PDF exports.
            </p>
          </div>

          <div id="security" className="nexora-reveal md:col-span-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3">
            <ShieldCheck className="w-6 h-6 text-[#10B981]" />
            <h3 className="font-display text-lg font-bold">Enterprise Security &amp; Audit Logs</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Argon2 password hashing, JWT refresh token rotation, strict CORS/CSP headers, and
              immutable system &amp; AI audit logs.
            </p>
          </div>

          <div className="nexora-reveal md:col-span-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3">
            <Smartphone className="w-6 h-6 text-[#3B82F6]" />
            <h3 className="font-display text-lg font-bold">PWA &amp; Capacitor Mobile Ready</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Install directly from Chrome/Safari or package with Capacitor for Android and iOS
              with bottom navigation and safe-area support.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FAQ */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-[var(--border)]">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={item.q}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left text-sm font-semibold"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="px-5 pb-4 text-xs text-[var(--text-secondary)] leading-relaxed">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Premium Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <NextLogo size="sm" href="/" showTagline={false} />
          <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              Role-Based Access Control
            </span>
            <span className="inline-flex items-center gap-1">
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-500" />
              Statutory Payroll Ready
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />
              Nexora Technologies
            </span>
          </div>
          <Link href="/login" className="text-xs font-semibold text-[var(--primary)] hover:underline">
            Sign in to Nexora EMS &rarr;
          </Link>
        </div>
      </footer>
    </div>
  );
}
