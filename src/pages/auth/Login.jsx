import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { NexoraLogo, NexoraOfficialLogo } from '../../components/ui/NexoraLogo';
import { Button } from '../../components/ui/Button';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Sun,
  Moon,
  CheckCircle2,
  Sparkles,
  Zap,
  Clock,
  Layers,
} from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setErrorMsg('');
    setLoading(true);
    try {
      const user = await login(email, password);
      const role = String(user.role || '').toUpperCase();
      if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/employee');
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      setErrorMsg(
        typeof detail === 'string'
          ? detail
          : 'Invalid email, username, or password. Please verify your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] dark:bg-[#060D1F] text-slate-900 dark:text-[#F8FAFC] transition-colors duration-300">
      {/* LEFT PANEL: Enterprise Brand Showcase (Visible on lg and above) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-gradient-to-br from-[#060D1F] via-[#0B1426] to-[#111C32] border-r border-slate-800/80 overflow-hidden select-none">
        {/* Animated Glow Blobs & Grid */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#2563EB]/20 rounded-full blur-[100px] animate-blob pointer-events-none" />
        <div className="absolute bottom-0 -right-24 w-96 h-96 bg-[#06B6D4]/15 rounded-full blur-[120px] animate-blob animation-delay-2000 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

        {/* Ambient Brand Emblem in Left Panel Background */}
        <div aria-hidden="true" className="absolute -bottom-20 -right-20 w-96 h-96 opacity-[0.07] pointer-events-none select-none">
          <img src="/nexora-mark.png" alt="" className="w-full h-full object-contain filter drop-shadow-2xl" />
        </div>

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <NexoraOfficialLogo className="h-9 sm:h-10" to="/" />
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#2563EB]/15 text-[#06B6D4] border border-[#2563EB]/30">
            Enterprise 2.0
          </span>
        </div>

        {/* Center Copy & Value Props */}
        <div className="relative z-10 my-auto py-12 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111C32] border border-[#2563EB]/40 text-[#06B6D4] text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#06B6D4] animate-pulse" />
            <span>The Future of Workforce Management</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Empowering People.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#06B6D4]">
              Driving Innovation.
            </span>
          </h2>

          <p className="mt-5 text-sm xl:text-base text-slate-300 leading-relaxed">
            Welcome to Nexora Workforce — the unified enterprise portal designed for high-precision multi-session attendance, 10 corporate leave balance ledgers, and exact Indian statutory payroll.
          </p>

          {/* Key Enterprise Highlights */}
          <div className="mt-8 space-y-3.5">
            {[
              { title: 'Intelligent Attendance & Live Breaks', desc: 'Real-time multi-session clock with automatic break ledger tracking' },
              { title: 'Indian Statutory Payroll Engine', desc: 'Automated EPF 12%, ESIC, Professional Tax, TDS, and Loss-of-Pay math' },
              { title: '10 Corporate Leave Types', desc: 'Exact carryover, quota rules, and admin approval workflows' },
              { title: 'Enterprise RBAC & Audit Trail', desc: 'Secure SUPER_ADMIN, ADMIN, and EMPLOYEE separation' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-0.5 p-1 rounded-lg bg-[#2563EB]/20 text-[#06B6D4] border border-[#2563EB]/30 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Status Footer */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} Nexora Technologies Inc.</span>
          <span className="flex items-center gap-1.5 text-[#06B6D4]">
            <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
            <span>Bank-grade 256-bit JWT Security</span>
          </span>
        </div>
      </div>

      {/* RIGHT PANEL: Modern Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative">
        {/* Top Navbar with Theme Toggle & Home link */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="lg:hidden">
            <NexoraLogo size="md" to="/" />
          </div>
          <div className="hidden sm:block text-xs text-slate-500 dark:text-[#94A3B8]">
            Need help? Contact <a href="mailto:zakkiadnan05@gmail.com" className="font-semibold text-[#2563EB] dark:text-[#06B6D4] hover:underline">zakkiadnan05@gmail.com</a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition-colors"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <Link
              to="/"
              className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] dark:text-[#06B6D4] dark:hover:text-[#22D3EE] px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Main Login Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-8 relative z-10">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Sign In to Nexora EMS
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#94A3B8] mt-1.5">
              Enter your corporate email, username, or employee code to access your portal
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs flex items-start gap-2.5 animate-fadeIn">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
              <div className="flex-1 font-medium">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Username / Employee Code Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Email, Username, or Employee Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter your email, username, or employee code"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#111C32] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Password Input with Visibility Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white dark:bg-[#111C32] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              <span>Sign In to Nexora EMS</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Secure Messaging */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80 text-center">
            <div className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-[#94A3B8]">
              <ShieldCheck className="w-4 h-4 text-[#2563EB] dark:text-[#06B6D4]" />
              <span>Role-based access control with secure JWT tokens</span>
            </div>
          </div>
        </div>

        {/* Footer with Official Company Logo at Bottom */}
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-500 relative z-10">
          <div className="flex items-center gap-2.5">
            <NexoraOfficialLogo className="h-6" to="/" />
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <span className="text-[11px]">The Future of Workforce Management</span>
          </div>
          <div className="text-[11px]">
            &copy; {new Date().getFullYear()} Nexora Technologies Inc.
          </div>
        </div>
      </div>
    </div>
  );
};
