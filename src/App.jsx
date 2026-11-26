import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  // Mobile Android & iOS hardware back button handling
  useEffect(() => {
    const handleBackButton = () => {
      // If there's navigation history, step back
      if (window.history.length > 1) {
        window.history.back();
      }
    };

    document.addEventListener('ionBackButton', handleBackButton);
    window.addEventListener('popstate', handleBackButton);

    return () => {
      document.removeEventListener('ionBackButton', handleBackButton);
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
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
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#0f172a',
                },
              },
              error: {
                iconTheme: {
                  primary: '#f43f5e',
                  secondary: '#0f172a',
                },
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
