import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { NexoraLogo, NexoraOfficialLogo } from '../../components/ui/NexoraLogo';
import { BrandWatermark } from '../../components/ui/BrandWatermark';
import { Button } from '../../components/ui/Button';
import {
  Clock,
  Coffee,
  Play,
  CheckCircle2,
  ShieldCheck,
  Building2,
  FileText,
  DollarSign,
  Bell,
  Users,
  ArrowRight,
  Sparkles,
  Calendar,
  Lock,
  ChevronRight,
  Award,
  Layers,
  Zap,
  Check,
  TrendingUp,
  Camera,
  Moon,
  Sun,
  Laptop,
  BarChart3,
  IndianRupee,
  Briefcase,
  PieChart,
  UserCheck,
  ShieldAlert,
  ArrowUpRight,
  Sliders,
  FolderOpen,
  Menu,
  X,
  Code2,
  Globe,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
} from 'lucide-react';

export const LandingPage = () => {
  const { user, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive Live Punch Simulation State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [demoPunchedIn, setDemoPunchedIn] = useState(true);
  const [demoOnBreak, setDemoOnBreak] = useState(false);
  const [demoBreakType, setDemoBreakType] = useState('TEA_BREAK');
  const [demoSeconds, setDemoSeconds] = useState(15480); // 4h 18m
  const [demoBreakSeconds, setDemoBreakSeconds] = useState(0);

  // Switchable Dashboard Preview Role
  const [activePreviewRole, setActivePreviewRole] = useState('ADMIN');

  // Interactive Payroll Calculator Demo State
  const [demoGrossSalary, setDemoGrossSalary] = useState(85000);

  // Clock Ticking
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (demoPunchedIn && !demoOnBreak) {
        setDemoSeconds((prev) => prev + 1);
      } else if (demoOnBreak) {
        setDemoBreakSeconds((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [demoPunchedIn, demoOnBreak]);

  const formatTimer = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Statutory Calculations for Demo
  const calcBasic = demoGrossSalary * 0.5;
  const calcEPF = Math.min(calcBasic, 15000) * 0.12;
  const calcESIC = demoGrossSalary <= 21000 ? demoGrossSalary * 0.0075 : 0;
  const calcPT = 200;
  const calcTDS = demoGrossSalary > 75000 ? demoGrossSalary * 0.08 : demoGrossSalary * 0.03;
  const totalDeductions = calcEPF + calcESIC + calcPT + calcTDS;
  const netTakeHome = demoGrossSalary - totalDeductions;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#060D1F] text-slate-900 dark:text-[#F8FAFC] selection:bg-[#2563EB] selection:text-white font-sans antialiased overflow-x-hidden transition-colors duration-300 relative">
      {/* Official Nexora Technologies Company Logo Ambient Watermark */}
      <BrandWatermark />

      {/* Dynamic Animated Ambient Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#2563EB]/15 rounded-full blur-[130px] animate-blob" />
        <div className="absolute top-1/3 -right-40 w-[32rem] h-[32rem] bg-[#06B6D4]/12 rounded-full blur-[150px] animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-1/3 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[140px] animate-blob animation-delay-4000" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* 1. FLOATING NAVIGATION BAR */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-[#060D1F]/85 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="shrink-0 flex items-center">
            <NexoraLogo size="md" to="/" showTagline={false} />
          </div>

          {/* Quick Nav Anchors */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            <a href="#features" className="whitespace-nowrap shrink-0 hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors py-1">Features</a>
            <a href="#attendance" className="whitespace-nowrap shrink-0 hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors py-1">Attendance</a>
            <a href="#leaves" className="whitespace-nowrap shrink-0 hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors py-1">Leave Quotas</a>
            <a href="#payroll" className="whitespace-nowrap shrink-0 hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors py-1">Payroll</a>
            <a href="#preview" className="whitespace-nowrap shrink-0 hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors py-1">Preview</a>
            <a href="#security" className="whitespace-nowrap shrink-0 hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors py-1">Security</a>
          </nav>

          {/* Action CTAs & Auth Links */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#111C32] dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition-colors cursor-pointer shrink-0"
              title="Toggle theme"
              aria-label="Toggle color theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {user ? (
              <Link
                to={isAdmin ? '/admin' : '/employee'}
                className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] hover:from-[#1D4ED8] hover:to-[#0891B2] text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-lg shadow-[#2563EB]/25 flex items-center space-x-1.5 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap shrink-0"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] hover:from-[#1D4ED8] hover:to-[#0891B2] text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-lg shadow-[#2563EB]/25 flex items-center space-x-1.5 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap shrink-0"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#111C32] dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition-colors cursor-pointer shrink-0"
              title="Toggle mobile menu"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#060D1F]/95 backdrop-blur-xl px-4 py-4 space-y-3 transition-all duration-200">
            <div className="flex flex-col space-y-1 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors"
              >
                Features
              </a>
              <a
                href="#attendance"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors"
              >
                Attendance
              </a>
              <a
                href="#leaves"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors"
              >
                Leave Quotas
              </a>
              <a
                href="#payroll"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors"
              >
                Payroll
              </a>
              <a
                href="#preview"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors"
              >
                Preview
              </a>
              <a
                href="#security"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors"
              >
                Security
              </a>
              <a
                href="#developer"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors"
              >
                Lead Developer
              </a>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <Link
                to={user ? (isAdmin ? '/admin' : '/employee') : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] hover:from-[#1D4ED8] hover:to-[#0891B2] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-[#2563EB]/25 flex items-center justify-center space-x-1.5 transition-all"
              >
                <span>{user ? 'Dashboard' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. ANIMATED HERO SECTION */}
      <section className="relative z-10 pt-16 pb-20 md:pt-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill Announcement */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-[#2563EB]/30 bg-[#2563EB]/10 text-[#06B6D4] text-xs sm:text-sm font-bold mb-8 backdrop-blur-md animate-float-slow shadow-lg shadow-[#2563EB]/10">
            <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-ping" />
            <span>Nexora Workforce 2.0</span>
            <span className="text-slate-400 dark:text-slate-500">&bull;</span>
            <span className="text-slate-700 dark:text-slate-200">The Future of Workforce Management</span>
          </div>

          {/* Hero Heading (Required Copy) */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.15]">
            Empower Your People.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#06B6D4] animate-gradient-x block sm:inline">
              Transform Your Workplace.
            </span>
          </h1>

          {/* Hero Description (Required Copy) */}
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-[#94A3B8] max-w-3xl mx-auto font-normal leading-relaxed">
            Experience the next generation of workforce management with Nexora Workforce — an intelligent platform designed to simplify HR operations, streamline attendance, automate payroll, and empower teams.
          </p>

          {/* Hero Buttons (Required Copy) */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#interactive-demo"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-[#2563EB] to-[#06B6D4] hover:from-[#1D4ED8] hover:to-[#0891B2] shadow-xl shadow-[#2563EB]/30 flex items-center justify-center space-x-2.5 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <span>Explore Nexora Workforce</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </a>

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-[#111C32] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 flex items-center justify-center space-x-2 transition-all shadow-sm"
            >
              <Lock className="w-4 h-4 text-[#06B6D4]" />
              <span>Access Dashboard</span>
            </Link>
          </div>

          {/* Key Enterprise Stat Counters */}
          <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            <div className="p-3">
              <p className="text-3xl sm:text-4xl font-extrabold font-mono text-[#2563EB] dark:text-[#38BDF8]">100%</p>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8] font-bold uppercase tracking-wider mt-1">EPF & ESIC Compliant</p>
            </div>
            <div className="p-3">
              <p className="text-3xl sm:text-4xl font-extrabold font-mono text-[#06B6D4]">10 Quotas</p>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8] font-bold uppercase tracking-wider mt-1">Leave Balance Ledgers</p>
            </div>
            <div className="p-3">
              <p className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-500">0.00 Drift</p>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8] font-bold uppercase tracking-wider mt-1">Attendance Precision</p>
            </div>
            <div className="p-3">
              <p className="text-3xl sm:text-4xl font-extrabold font-mono text-purple-500">3-Tier</p>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8] font-bold uppercase tracking-wider mt-1">RBAC & Audit Trail</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE DASHBOARD PREVIEW (LIVE ATTENDANCE SIMULATOR) */}
      <section id="interactive-demo" className="relative z-10 py-16 bg-slate-100/70 dark:bg-[#0B1426]/70 border-y border-slate-200 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#2563EB] dark:text-[#06B6D4]">
              Real-Time Interactive Engine
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Live Multi-Session Punch & Break Simulator
            </h2>
            <p className="text-sm text-slate-600 dark:text-[#94A3B8] mt-2">
              Test Nexora's active attendance session tracking engine directly in your browser. Click the buttons below to simulate shift punches and break recording in real-time.
            </p>
          </div>

          {/* Interactive Widget Box */}
          <div className="relative rounded-3xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#06B6D4]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Widget Header */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-white/10 gap-4">
              <div className="flex items-center space-x-3">
                <span className="flex h-3 w-3 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${demoOnBreak ? 'bg-amber-400' : demoPunchedIn ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${demoOnBreak ? 'bg-amber-500' : demoPunchedIn ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                </span>
                <span className="font-extrabold tracking-wider uppercase text-xs text-slate-700 dark:text-slate-200">
                  {demoOnBreak ? `Break Active (${demoBreakType.replace('_', ' ')})` : demoPunchedIn ? 'Punched In (Session #1 Active)' : 'Punched Out / Shift Inactive'}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/60 self-start sm:self-auto">
                <Calendar className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#06B6D4]" />
                <span>{currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-6">
              {/* Clock & Active Counter */}
              <div className="lg:col-span-4 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                  System Wall Clock
                </span>
                <h3 className="text-4xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </h3>

                <div className="pt-2">
                  {demoOnBreak ? (
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-600 dark:text-amber-300 font-mono text-xs">
                      <Coffee className="w-4 h-4 animate-bounce text-amber-500" />
                      <span className="font-bold">Break Duration: {formatTimer(demoBreakSeconds)}</span>
                    </div>
                  ) : demoPunchedIn ? (
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 font-mono text-xs">
                      <Clock className="w-4 h-4 animate-spin text-emerald-500" />
                      <span className="font-bold">Active Productive Time: {formatTimer(demoSeconds)}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-400">Shift inactive. Click Punch In to begin.</p>
                  )}
                </div>
              </div>

              {/* KPI Mini Stat Boxes */}
              <div className="lg:col-span-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl p-3 text-center">
                    <span className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Productive</span>
                    <p className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {Math.floor(demoSeconds / 3600)}h {Math.floor((demoSeconds % 3600) / 60)}m
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl p-3 text-center">
                    <span className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Break Total</span>
                    <p className="text-base font-black font-mono text-amber-600 dark:text-amber-400 mt-0.5">
                      {Math.floor(demoBreakSeconds / 60)}m
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl p-3 text-center">
                    <span className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Sessions</span>
                    <p className="text-base font-black font-mono text-[#2563EB] dark:text-[#38BDF8] mt-0.5">
                      {demoPunchedIn ? '1' : '0'}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl p-3 text-center">
                    <span className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Status</span>
                    <p className="text-xs font-bold text-[#06B6D4] mt-1">
                      {demoOnBreak ? 'ON BREAK' : demoPunchedIn ? 'PRESENT' : 'OFFLINE'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Controls Simulation */}
              <div className="lg:col-span-3 flex flex-col gap-2">
                {demoOnBreak ? (
                  <button
                    onClick={() => setDemoOnBreak(false)}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Resume Productive Work</span>
                  </button>
                ) : demoPunchedIn ? (
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setDemoBreakType('TEA_BREAK');
                          setDemoOnBreak(true);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-xs py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Coffee className="w-3.5 h-3.5 text-amber-500" />
                        <span>Tea Break</span>
                      </button>
                      <button
                        onClick={() => {
                          setDemoBreakType('LUNCH_BREAK');
                          setDemoOnBreak(true);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-xs py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Coffee className="w-3.5 h-3.5 text-orange-500" />
                        <span>Lunch</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setDemoPunchedIn(false)}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-rose-600/25 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Clock Out Shift</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setDemoPunchedIn(true);
                      setDemoSeconds(10);
                    }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Punch In Now</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PLATFORM FEATURES GRID */}
      <section id="features" className="relative z-10 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#2563EB] dark:text-[#06B6D4]">
              Comprehensive Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              Everything Your Enterprise Needs to Scale
            </h2>
            <p className="text-base text-slate-600 dark:text-[#94A3B8] mt-3">
              Nexora Workforce consolidates 6 disjointed HR systems into one cohesive, cloud-native enterprise platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: 'High-Precision Attendance',
                desc: 'Multi-session check-ins with automatic duration computation, incomplete session alerts, and granular break tracking.',
                tag: 'Precision Engine',
                color: 'blue',
              },
              {
                icon: Calendar,
                title: '10 Corporate Leave Types',
                desc: 'Dedicated annual, sick, casual, maternity, paternity, compensatory off, and bereavement balances with carried-forward rules.',
                tag: 'Leave Ledger',
                color: 'cyan',
              },
              {
                icon: IndianRupee,
                title: 'Indian Statutory Payroll',
                desc: 'Automated EPF (12% capped at ₹1,800), ESIC (0.75%), Professional Tax (slab ₹200), and TDS deduction computations.',
                tag: 'Statutory Payroll',
                color: 'emerald',
              },
              {
                icon: Users,
                title: 'Complete Employee Lifecycle',
                desc: 'From onboarding and department assignment to position changes, document storage, and verified profile updates.',
                tag: 'Core HR',
                color: 'indigo',
              },
              {
                icon: ShieldAlert,
                title: 'Tamper-Evident Audit Logs',
                desc: 'Every check-in correction, leave approval, role alteration, and salary modification is recorded with immutable audit metadata.',
                tag: 'Compliance',
                color: 'purple',
              },
              {
                icon: Bell,
                title: 'Company-Wide Broadcasts',
                desc: 'Targeted announcements by department or organization-wide with urgent priority flags and unread tracking.',
                tag: 'Communications',
                color: 'amber',
              },
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="group relative bg-white dark:bg-[#111C32] rounded-2xl border border-slate-200 dark:border-slate-800 p-7 shadow-sm hover:shadow-xl hover:border-[#2563EB]/40 dark:hover:border-[#06B6D4]/40 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 text-[#2563EB] dark:text-[#06B6D4] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {feat.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-[#94A3B8] leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. WORKFORCE MANAGEMENT SHOWCASE */}
      <section className="relative z-10 py-16 bg-slate-100/70 dark:bg-[#0B1426]/70 border-y border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#2563EB] dark:text-[#06B6D4]">
                Enterprise Directory
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Centralized Workforce & Department Intelligence
              </h2>
              <p className="text-sm text-slate-600 dark:text-[#94A3B8] mt-3 leading-relaxed">
                Empower your administrators with live headcount analytics across departments like Engineering, Finance, Operations, Marketing, and Human Resources. Manage positions, compensation tiers, and active status effortlessly.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  'Automated employee code generation (e.g. EMP-1001)',
                  'Department hierarchy with head count & payroll distribution',
                  'Admin-moderated profile photo update workflows',
                  'Document management for tax proofs, IDs, and contracts',
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-2.5 text-xs text-slate-700 dark:text-slate-200 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Card Mockup */}
            <div className="rounded-2xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#2563EB]/20 text-[#2563EB] dark:text-[#06B6D4] font-black flex items-center justify-center text-sm">
                    JD
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">John Doe (EMP-1001)</h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Senior Systems Architect &bull; Engineering</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Department</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Engineering (18 Members)</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Base Compensation</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">₹85,000 / month</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Paid Leave Balance</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">18 Available</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Monthly Attendance</span>
                  <p className="font-bold text-[#2563EB] dark:text-[#38BDF8] mt-0.5">96.8% Present</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ATTENDANCE MANAGEMENT SHOWCASE */}
      <section id="attendance" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#2563EB] dark:text-[#06B6D4]">
              High-Precision Time Tracking
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Multi-Session Attendance & Policy Engine
            </h2>
            <p className="text-sm text-slate-600 dark:text-[#94A3B8] mt-2">
              Configure grace periods, half-day thresholds, paid vs unpaid breaks, and automated overtime calculations with complete audit transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#111C32] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Multi-Session Check-Ins</h3>
              <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-2 leading-relaxed">
                Employees can check in and out multiple times daily. The engine aggregates exact working minutes, flags incomplete sessions, and computes total office presence.
              </p>
            </div>

            <div className="bg-white dark:bg-[#111C32] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
                <Coffee className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Configurable Break Policies</h3>
              <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-2 leading-relaxed">
                Distinguish paid breaks (tea, personal) from unpaid breaks (lunch). Custom thresholds trigger automatic deduction from gross hours if exceeded.
              </p>
            </div>

            <div className="bg-white dark:bg-[#111C32] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Admin Attendance Corrections</h3>
              <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-2 leading-relaxed">
                Administrators can amend missed punch-ins or system outages with documented mandatory reason notes and permanent audit logging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LEAVE MANAGEMENT SHOWCASE */}
      <section id="leaves" className="relative z-10 py-16 bg-slate-100/70 dark:bg-[#0B1426]/70 border-y border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#2563EB] dark:text-[#06B6D4]">
              Corporate Leave Infrastructure
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              10 Enterprise Leave Quotas with Carry-Forward
            </h2>
            <p className="text-sm text-slate-600 dark:text-[#94A3B8] mt-2">
              Say goodbye to messy spreadsheets. Nexora Workforce maintains a double-entry leave ledger for every employee across all 10 corporate leave categories.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {[
              { code: 'ANNUAL_LEAVE', name: 'Annual Leave', days: '18 Days', type: 'Paid / Carryforward' },
              { code: 'SICK_LEAVE', name: 'Sick Leave', days: '12 Days', type: 'Paid / Medical' },
              { code: 'CASUAL_LEAVE', name: 'Casual Leave', days: '12 Days', type: 'Paid / Personal' },
              { code: 'MATERNITY_LEAVE', name: 'Maternity Leave', days: '180 Days', type: 'Paid Statutory' },
              { code: 'PATERNITY_LEAVE', name: 'Paternity Leave', days: '15 Days', type: 'Paid Statutory' },
              { code: 'COMPENSATORY_OFF', name: 'Compensatory Off', days: 'Earned', type: 'Weekend Work' },
              { code: 'BEREAVEMENT_LEAVE', name: 'Bereavement', days: '5 Days', type: 'Compassionate' },
              { code: 'MARRIAGE_LEAVE', name: 'Marriage Leave', days: '5 Days', type: 'Special Event' },
              { code: 'OPTIONAL_HOLIDAY', name: 'Optional Holiday', days: '2 Days', type: 'Floating Choice' },
              { code: 'UNPAID_LEAVE', name: 'Loss of Pay (LOP)', days: 'Flexible', type: 'Salary Adjusted' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#111C32] rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-center hover:border-[#2563EB] transition-colors"
              >
                <span className="text-[10px] font-bold text-[#2563EB] dark:text-[#06B6D4] block uppercase">
                  {item.type}
                </span>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white mt-1 truncate">
                  {item.name}
                </h4>
                <p className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                  {item.days}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. PAYROLL ANALYTICS SHOWCASE (WITH INTERACTIVE SALARY CALCULATOR) */}
      <section id="payroll" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-5">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#2563EB] dark:text-[#06B6D4]">
                Automated Indian Compliance
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Zero-Drift Indian Statutory Payroll
              </h2>
              <p className="text-sm text-slate-600 dark:text-[#94A3B8] mt-3 leading-relaxed">
                Nexora's payroll engine executes exact statutory calculations out of the box. Eliminate manual slip preparation and human errors with automated PDF payslip generation and locking.
              </p>

              <div className="mt-6 space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Employee Provident Fund (EPF)</span>
                  <span className="font-mono font-bold text-[#2563EB]">12% (₹1,800 Cap)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Employee State Insurance (ESIC)</span>
                  <span className="font-mono font-bold text-[#06B6D4]">0.75% (&le; ₹21,000)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Professional Tax (PT)</span>
                  <span className="font-mono font-bold text-amber-500">₹200 Standard</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Calculator */}
            <div className="lg:col-span-7 bg-white dark:bg-[#111C32] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-emerald-500" />
                  <span>Interactive Statutory Breakdown Simulator</span>
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  Live Preview
                </span>
              </div>

              {/* Slider Input */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Gross Monthly CTC
                  </label>
                  <span className="text-xl font-extrabold font-mono text-[#2563EB] dark:text-[#38BDF8]">
                    ₹{demoGrossSalary.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="250000"
                  step="5000"
                  value={demoGrossSalary}
                  onChange={(e) => setDemoGrossSalary(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
                />
              </div>

              {/* Breakdown Grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Basic (50%)</span>
                  <p className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200 mt-1">₹{calcBasic.toLocaleString()}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">EPF Deduction</span>
                  <p className="font-mono font-bold text-xs text-rose-500 mt-1">-₹{calcEPF.toLocaleString()}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">TDS & PT</span>
                  <p className="font-mono font-bold text-xs text-rose-500 mt-1">-₹{(calcTDS + calcPT).toLocaleString()}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Net Take-Home</span>
                  <p className="font-mono font-black text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 mt-1">₹{Math.round(netTakeHome).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. ENTERPRISE SECURITY SECTION */}
      <section id="security" className="relative z-10 py-16 bg-slate-100/70 dark:bg-[#0B1426]/70 border-y border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#2563EB] dark:text-[#06B6D4]">
              Zero-Trust Architecture
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Bank-Grade Enterprise Security & Compliance
            </h2>
            <p className="text-sm text-slate-600 dark:text-[#94A3B8] mt-2">
              Protect your organization's sensitive personnel records with multi-layered cryptography, strict role boundaries, and continuous audit logging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: Lock,
                title: '256-Bit Cryptography',
                desc: 'Argon2/bcrypt password hashing with salted rounds and secure JWT token expiration.',
              },
              {
                icon: ShieldCheck,
                title: '3-Tier RBAC',
                desc: 'Strict authorization separation across Super Admin, Department Admin, and Employee roles.',
              },
              {
                icon: FileText,
                title: 'Immutable Audit Trail',
                desc: 'Tracks every IP address, user agent, record creation, modification, and deletion event.',
              },
              {
                icon: Award,
                title: 'Statutory Compliance',
                desc: 'Built in compliance with Indian Labor Laws, EPF Act, ESI Act, and statutory leave standards.',
              },
            ].map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <div key={idx} className="bg-white dark:bg-[#111C32] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-center shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 text-[#2563EB] dark:text-[#06B6D4] flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{sec.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">{sec.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. ADMIN AND EMPLOYEE DASHBOARD PREVIEW */}
      <section id="preview" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#2563EB] dark:text-[#06B6D4]">
              Tailored Experiences
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Purpose-Built for Both Admins and Employees
            </h2>
            <p className="text-sm text-slate-600 dark:text-[#94A3B8] mt-2">
              Toggle between views below to see how Nexora adapts to administrative intelligence and employee self-service.
            </p>

            {/* Toggle Switch */}
            <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-200 dark:bg-[#111C32] border border-slate-300 dark:border-slate-700 mt-6">
              <button
                onClick={() => setActivePreviewRole('ADMIN')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activePreviewRole === 'ADMIN'
                    ? 'bg-[#2563EB] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Admin Command Center
              </button>
              <button
                onClick={() => setActivePreviewRole('EMPLOYEE')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activePreviewRole === 'EMPLOYEE'
                    ? 'bg-[#06B6D4] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Employee Self-Service Portal
              </button>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="rounded-3xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl transition-all">
            {activePreviewRole === 'ADMIN' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Admin Dashboard Overview</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total Workforce, Active Shifts, Leave Approvals, and Payroll Trends</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                    SUPER_ADMIN & ADMIN
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Total Employees</span>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">56</p>
                    <span className="text-[11px] text-emerald-500 font-semibold">+4 this quarter</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">On-Duty Today</span>
                    <p className="text-2xl font-black text-[#2563EB] dark:text-[#38BDF8] mt-1">51 / 56</p>
                    <span className="text-[11px] text-emerald-500 font-semibold">91% Attendance</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Pending Leaves</span>
                    <p className="text-2xl font-black text-amber-500 mt-1">3 Requests</p>
                    <span className="text-[11px] text-slate-400 font-semibold">Requires Approval</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Monthly Payroll</span>
                    <p className="text-2xl font-black text-emerald-500 mt-1">₹42.8L</p>
                    <span className="text-[11px] text-slate-400 font-semibold">Locked & Verified</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Employee Self-Service Workspace</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Live Attendance Punch, Available Leaves, Monthly Salary Slip, and Company Holidays</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                    EMPLOYEE ROLE
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Active Status</span>
                    <p className="text-base font-extrabold text-emerald-500 mt-1">Punched In</p>
                    <span className="text-[11px] text-slate-400 font-semibold">Shift started at 09:15 AM</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Annual Leave Left</span>
                    <p className="text-2xl font-black text-[#06B6D4] mt-1">16.5 Days</p>
                    <span className="text-[11px] text-emerald-500 font-semibold">1.5 Used this Year</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Latest Payslip</span>
                    <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">₹78,450 Net</p>
                    <span className="text-[11px] text-[#2563EB] font-semibold cursor-pointer">Download PDF</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Upcoming Holiday</span>
                    <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">Independence Day</p>
                    <span className="text-[11px] text-slate-400 font-semibold">Next Friday</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 11. LEAD DEVELOPER & ARCHITECT SHOWCASE */}
      <section id="developer" className="relative z-10 py-20 bg-slate-100/70 dark:bg-[#0B1426]/70 border-t border-slate-200 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-[#2563EB]/30 bg-[#2563EB]/10 text-[#06B6D4] text-xs font-bold mb-4 backdrop-blur-md">
              <Code2 className="w-3.5 h-3.5" />
              <span>Full Stack Engineering & Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Lead Developer & Architect
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#94A3B8] mt-2">
              Nexora Workforce was designed, engineered, and brought to life from the ground up with high precision, modern full-stack standards, and rock-solid reliability.
            </p>
          </div>

          <div className="relative rounded-3xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-2xl overflow-hidden">
            {/* Glowing ambient backgrounds */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#06B6D4]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Profile Card & Avatar */}
              <div className="lg:col-span-4 flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] p-1 shadow-xl shadow-[#2563EB]/25 mb-4 group">
                  <div className="w-full h-full rounded-[14px] bg-[#060D1F] overflow-hidden">
                    <img
                      src="/developer-photo.jpg"
                      alt="Mohammed Zakki Adnaan P - Lead Developer & Architect"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-[#111C32] flex items-center justify-center" title="Available for Development">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Mohammed Zakki Adnaan P
                </h3>
                <p className="text-xs font-bold text-[#2563EB] dark:text-[#06B6D4] uppercase tracking-wider mt-1">
                  Python Full Stack & React.js Developer
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Islamiah College (Autonomous), Vaniyambadi
                </p>

                {/* Social & Portfolio Links */}
                <div className="flex items-center gap-2.5 mt-5">
                  <a
                    href="https://dev-zakki.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:text-[#2563EB] dark:hover:text-[#06B6D4] border border-slate-200 dark:border-slate-600 transition-colors shadow-sm"
                    title="Developer Portfolio"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                  <a
                    href="https://github.com/Zakki-05"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:text-[#2563EB] dark:hover:text-[#06B6D4] border border-slate-200 dark:border-slate-600 transition-colors shadow-sm"
                    title="GitHub Profile"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/mohammed-zakki-adnan-p/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:text-[#2563EB] dark:hover:text-[#06B6D4] border border-slate-200 dark:border-slate-600 transition-colors shadow-sm"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="mailto:zakkiadnan05@gmail.com"
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:text-[#2563EB] dark:hover:text-[#06B6D4] border border-slate-200 dark:border-slate-600 transition-colors shadow-sm"
                    title="Email Developer"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Bio & Project Architectural Highlights */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Full-Stack Engineering & System Architecture</span>
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-[#94A3B8] mt-2 leading-relaxed">
                    Designed and engineered the complete Nexora Workforce management ecosystem with an idempotent multi-session attendance engine, automated statutory Indian payroll (EPF & ESIC calculations), granular 10-quota leave balance ledgers, and secure role-based access control.
                  </p>
                </div>

                {/* Tech Stack Badges */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2.5">
                    Core Technical Stack
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {['React.js', 'FastAPI', 'Python', 'PostgreSQL', 'MySQL', 'Tailwind CSS', 'Vite', 'RESTful APIs', 'JWT & RBAC', 'Docker'].map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/70"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Architectural Highlights Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
                    <p className="text-xl font-extrabold text-[#2563EB] dark:text-[#38BDF8]">19</p>
                    <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-0.5">Database Models</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
                    <p className="text-xl font-extrabold text-[#06B6D4]">10</p>
                    <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-0.5">Leave Ledgers</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
                    <p className="text-xl font-extrabold text-emerald-500">100%</p>
                    <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-0.5">Idempotent Shifts</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
                    <p className="text-xl font-extrabold text-purple-500">Dual</p>
                    <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-0.5">EPF & ESIC</p>
                  </div>
                </div>

                {/* Portfolio CTA Button */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href="https://dev-zakki.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#2563EB] to-[#06B6D4] hover:from-[#1D4ED8] hover:to-[#0891B2] shadow-lg shadow-[#2563EB]/25 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <span>View Developer Portfolio</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href="https://github.com/Zakki-05/Nexora_Technologies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-all shadow-sm"
                  >
                    <Github className="w-4 h-4" />
                    <span>View GitHub Repository</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FINAL CALL-TO-ACTION */}
      <section className="relative z-10 py-20 bg-gradient-to-br from-[#060D1F] via-[#0B1426] to-[#111C32] text-white border-t border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#2563EB20,transparent_50%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111C32] border border-[#2563EB]/40 text-[#06B6D4] text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for the Modern Enterprise</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Transform Your Workplace with Nexora?
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join forward-thinking companies running high-precision attendance, corporate leave management, and statutory Indian payroll on Nexora Workforce.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-[#2563EB] to-[#06B6D4] hover:from-[#1D4ED8] hover:to-[#0891B2] shadow-xl shadow-[#2563EB]/30 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <span>Access Nexora Workforce</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 13. PROFESSIONAL FOOTER WITH OFFICIAL COMPANY LOGO & DEVELOPER CREDITS */}
      <footer className="relative z-10 py-12 bg-white dark:bg-[#060D1F] border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-500 dark:text-[#94A3B8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <NexoraOfficialLogo className="h-8" to="/" />
              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
              <span className="italic font-medium">Empowering People, Driving Innovation.</span>
            </div>

            <div className="flex items-center gap-6 font-semibold flex-wrap justify-center">
              <a href="#features" className="hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors">Features</a>
              <a href="#attendance" className="hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors">Attendance</a>
              <a href="#payroll" className="hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors">Payroll</a>
              <a href="#developer" className="hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors">Developer</a>
              <Link to="/login" className="hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors">Sign In</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              &copy; {new Date().getFullYear()} Nexora Technologies Inc. All rights reserved.
            </div>

            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium flex-wrap justify-center sm:justify-end">
              <span>Engineered by</span>
              <a
                href="https://dev-zakki.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#2563EB] dark:text-[#06B6D4] hover:underline inline-flex items-center gap-1.5"
              >
                <img
                  src="/developer-photo.jpg"
                  alt="Mohammed Zakki Adnaan P"
                  className="w-5 h-5 rounded-full object-cover object-top border border-[#2563EB]/40 inline-block shadow-sm"
                />
                <span>Mohammed Zakki Adnaan P</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-400 dark:text-slate-600">&bull;</span>
              <a
                href="https://github.com/Zakki-05"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900 dark:hover:text-white transition-colors"
                title="GitHub Profile"
              >
                GitHub
              </a>
              <span className="text-slate-400 dark:text-slate-600">&bull;</span>
              <a
                href="https://www.linkedin.com/in/mohammed-zakki-adnan-p/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900 dark:hover:text-white transition-colors"
                title="LinkedIn Profile"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
