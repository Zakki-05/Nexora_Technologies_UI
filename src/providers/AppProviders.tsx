'use client';

import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    if ('serviceWorker' in navigator && !window.location.hostname.includes('localhost')) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.error('[Nexora PWA] SW registration failed:', err));
    }

    const handleBackButton = () => {
      if (window.history.length > 1) {
        window.history.back();
      }
    };
    document.addEventListener('ionBackButton', handleBackButton);
    return () => document.removeEventListener('ionBackButton', handleBackButton);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: 'text-xs font-medium',
              style: {
                borderRadius: '0.75rem',
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid #1e293b',
              },
              success: {
                iconTheme: { primary: '#10b981', secondary: '#0f172a' },
              },
              error: {
                iconTheme: { primary: '#f43f5e', secondary: '#0f172a' },
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
