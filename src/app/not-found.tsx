import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#060D1F] p-6">
      <div className="max-w-md w-full bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-xl">
        <p className="text-xs font-extrabold uppercase tracking-widest text-[#2563EB] mb-2">404 — Not Found</p>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Page Not Found</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          The requested Nexora Workforce page could not be found or has moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/login"
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
