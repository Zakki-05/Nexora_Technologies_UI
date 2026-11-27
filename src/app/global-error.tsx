'use client';

import React from 'react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-[#060D1F] text-white p-6 font-sans">
        <div className="max-w-md w-full bg-[#111C32] border border-slate-800 rounded-2xl p-8 text-center">
          <h1 className="text-xl font-bold mb-2">Application Recovery</h1>
          <p className="text-sm text-slate-400 mb-6">
            A critical rendering error occurred. Click below to reload Nexora Workforce.
          </p>
          <button
            type="button"
            onClick={reset}
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
