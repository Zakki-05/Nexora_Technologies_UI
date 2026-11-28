'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { AIChat } from '@/components/ai/AIChat';

export default function NexoraAIWorkspacePage() {
  return (
    <DashboardShell>
      <div className="h-[calc(100vh-8.5rem)] min-h-[520px]">
        <AIChat />
      </div>
    </DashboardShell>
  );
}
