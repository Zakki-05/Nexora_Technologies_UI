'use client';

import React from 'react';

export default function AIWorkspaceError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-8 text-center space-y-3">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
        Unable to load Nexora Copilot
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
      >
        Retry
      </button>
    </div>
  );
}
