'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { NextLogo } from '@/components/layout/NextLogo';
import type { AxiosError } from 'axios';
import type { ApiErrorShape } from '@/types/api';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Sparkles,
  Zap,
  Clock,
  Layers,
  CheckCircle2,
} from 'lucide-react';

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
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

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

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] dark:bg-[#060D1F] text-slate-900 dark:text-[#F8FAFC] transition-colors duration-300">
      {/* Left Enterprise Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-gradient-to-br from-[#060D1F] via-[#0B1426] to-[#111C32] border-r border-slate-800/80 overflow-hidden select-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#2563EB]/20 rounded-full blur-[100px] animate-blob pointer-events-none" />
        <div className="absolute bottom-0 -right-24 w-96 h-96 bg-[#06B6D4]/15 rounded-full blur-[120px] animate-blob animation-delay-2000 pointer-events-none" />

        <div aria-hidden="true" className="absolute -bottom-20 -right-20 w-96 h-96 opacity-[0.07] pointer-events-none">
          <Image src="/nexora-mark.png" alt="" width={384} height={384} className="w-full h-full object-contain" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <NextLogo size="lg" href="/" />
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#2563EB]/15 text-[#06B6D4] border border-[#2563EB]/30">
            Enterprise 3.0
          </span>
        </div>

        <div className="relative z-10 my-auto py-12 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111C32] border border-[#2563EB]/40 text-[#06B6D4] text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
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

          <div className="mt-8 space-y-3.5">
            {[
              { icon: Clock, text: 'Multi-session attendance & live break tracking' },
              { icon: Zap, text: 'Automated EPF, ESIC, PT, TDS & LOP Indian payroll' },
              { icon: Layers, text: 'Multi-tenant organization isolation & RBAC audit trail' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 border border-[#2563EB]/30 flex items-center justify-center text-[#06B6D4]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} Nexora Technologies Inc.</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            PostgreSQL 19 &bull; FastAPI
          </span>
        </div>
      </div>

      {/* Right Sign-In Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-14">
        <div className="flex items-center justify-between">
          <div className="lg:hidden">
            <NextLogo size="md" href="/" />
          </div>
          <div className="hidden lg:block text-xs text-slate-500 dark:text-slate-400">
            Enterprise Workforce Portal
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link href="/" className="text-xs font-semibold text-[#2563EB] dark:text-[#06B6D4] hover:underline">
              Back to Home
            </Link>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto my-auto py-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Sign In to Nexora EMS
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Enter your corporate email, username, or employee code to access your portal.
          </p>

          {errorMsg && (
            <div
              role="alert"
              className="mt-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium"
            >
              {errorMsg}
            </div>
          )}

          {coldStartNotice && (
            <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-300 text-xs font-medium">
              Waking up the Nexora API server on Render. Please wait a few seconds...
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2"
              >
                Email, Username, or Employee Code
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="text"
                  autoComplete="username"
                  placeholder="name@nexora.tech or EMP-1001"
                  {...register('email')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111C32] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-rose-500">{errors.email.message}</p>}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111C32] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-rose-500">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0891B2] hover:from-[#1D4ED8] hover:to-[#0E7490] text-white font-bold text-sm shadow-lg shadow-[#2563EB]/25 disabled:opacity-60 transition-all"
            >
              {isSubmitting ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In to Nexora EMS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Role-based access control with rotating JWT tokens</span>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          Powered by Nexora Technologies &bull; Enterprise Workforce Management
        </div>
      </div>
    </div>
  );
}
