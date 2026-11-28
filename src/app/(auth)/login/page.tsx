'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { AxiosError } from 'axios';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Laptop,
  Lock,
  Mail,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme, type ThemeMode } from '@/providers/ThemeProvider';
import { NextLogo } from '@/components/layout/NextLogo';
import { IntelligenceCoreWrapper } from '@/components/three/scenes/IntelligenceCoreWrapper';
import { API_BASE_URL } from '@/services/apiClient';
import type { ApiErrorShape } from '@/types/api';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Please enter your email, username, or employee code'),
  password: z.string().min(1, 'Please enter your password'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [coldStartNotice, setColdStartNotice] = useState(false);
  const { user, login, isAdmin } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Pre-warm Render backend container while user types credentials
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/health`, { method: 'GET', signal: controller.signal }).catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (user) {
      router.replace(isAdmin ? '/admin' : '/employee');
    }
  }, [user, isAdmin, router]);

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMsg('');
    setColdStartNotice(false);
    const coldTimer = window.setTimeout(() => setColdStartNotice(true), 3500);

    try {
      const loggedInUser = await login(values.email, values.password);
      const role = String(loggedInUser.role || '').toUpperCase();
      if (['ADMIN', 'SUPER_ADMIN', 'COMPANY_ADMIN', 'PLATFORM_SUPER_ADMIN'].includes(role)) {
        router.push('/admin');
      } else {
        router.push('/employee');
      }
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorShape>;
      const detail = axiosErr.response?.data?.message || axiosErr.response?.data?.detail;
      setErrorMsg(
        typeof detail === 'string' && detail.trim()
          ? detail
          : 'Invalid email, username, or password. Please verify your credentials and try again.'
      );
    } finally {
      window.clearTimeout(coldTimer);
      setColdStartNotice(false);
    }
  };

  const themeBtns: Array<{ mode: ThemeMode; label: string; icon: React.ReactNode }> = [
    { mode: 'light', label: 'Light theme', icon: <Sun className="w-3.5 h-3.5" /> },
    { mode: 'dark', label: 'Dark theme', icon: <Moon className="w-3.5 h-3.5" /> },
    { mode: 'system', label: 'System theme', icon: <Laptop className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen w-full flex bg-[var(--background)] text-[var(--text-primary)] transition-colors">
      {/* Left 3D Enterprise Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-10 bg-gradient-to-br from-[#05070D] via-[#0B1120] to-[#111827] text-white border-r border-slate-800/80 overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <NextLogo size="lg" href="/" />
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500/15 text-cyan-300 border border-blue-500/30">
            Workforce 3.0
          </span>
        </div>

        <div className="relative z-10 my-auto">
          <IntelligenceCoreWrapper compact />
          <div className="mt-4 space-y-3 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-blue-500/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Future of Workforce Management</span>
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight">
              Connected HR, Attendance, Payroll &amp; Nexora AI.
            </h1>
            <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Multi-session Attendance
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Indian Statutory Payroll
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                10 Corporate Leave Ledgers
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                RBAC Nexora Copilot
              </span>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Nexora Technologies. All rights reserved.
        </p>
      </div>

      {/* Right Login Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-14">
        <div className="flex items-center justify-between">
          <div className="lg:hidden">
            <NextLogo size="md" href="/" showTagline={false} />
          </div>
          <Link
            href="/"
            className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            &larr; Back to Home
          </Link>

          <div
            className="inline-flex items-center p-0.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]"
            role="group"
            aria-label="Theme switcher"
          >
            {themeBtns.map((b) => (
              <button
                key={b.mode}
                type="button"
                onClick={() => setTheme(b.mode)}
                aria-label={b.label}
                className={`p-1.5 rounded-lg transition-colors ${
                  theme === b.mode
                    ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {b.icon}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md mx-auto my-auto py-8 space-y-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)]">
              <ShieldCheck className="w-4 h-4" />
              <span>Secure Enterprise Sign-In</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">Welcome back</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Sign in with your corporate email, username, or employee code.
            </p>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-500 font-medium"
            >
              {errorMsg}
            </div>
          )}

          {coldStartNotice && (
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-600 dark:text-blue-300">
              Waking up the Nexora backend server... this first request may take a few seconds.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5"
              >
                Email, Username, or Employee Code
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email"
                  type="text"
                  autoComplete="username"
                  placeholder="e.g. admin@nexora.tech or EMP-1001"
                  {...register('email')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  {...register('password')}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white text-sm font-semibold shadow-lg shadow-blue-500/25 inline-flex items-center justify-center gap-2 disabled:opacity-60 hover:opacity-95 transition-opacity"
            >
              <span>{isSubmitting ? 'Signing in...' : 'Sign In to Nexora EMS'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-[var(--text-secondary)]">
          Protected by Argon2id &amp; JWT RBAC &middot; Nexora Technologies
        </p>
      </div>
    </div>
  );
}
