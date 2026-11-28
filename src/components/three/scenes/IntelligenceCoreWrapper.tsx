'use client';

import React, { Component, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Scene3DSkeleton } from '@/components/feedback/NexoraSkeletons';
import { StaticOrbitalFallback } from '@/components/three/scenes/StaticOrbitalFallback';
import { useGraphicsQuality } from '@/components/three/quality/useGraphicsQuality';

const DynamicCoreCanvas = dynamic(
  () => import('@/components/three/scenes/NexoraIntelligenceCore'),
  {
    ssr: false,
    loading: () => <Scene3DSkeleton />,
  }
);

class WebGLErrorBoundary extends Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export function IntelligenceCoreWrapper({
  compact = false,
  showQualityToggle = false,
}: {
  compact?: boolean;
  showQualityToggle?: boolean;
}) {
  const { quality, setQualityOverride } = useGraphicsQuality();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(true);
  const [tabHidden, setTabHidden] = useState(false);

  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const paused = !inView || tabHidden;

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${
        compact ? 'h-[260px] sm:h-[300px]' : 'h-[360px] sm:h-[440px] lg:h-[500px]'
      }`}
    >
      {quality === 'static' ? (
        <StaticOrbitalFallback compact={compact} />
      ) : (
        <WebGLErrorBoundary fallback={<StaticOrbitalFallback compact={compact} />}>
          <DynamicCoreCanvas quality={quality} paused={paused} />
        </WebGLErrorBoundary>
      )}

      {showQualityToggle && (
        <div className="absolute bottom-3 right-3 z-10">
          <button
            type="button"
            onClick={() => setQualityOverride(quality === 'static' ? 'auto' : 'static')}
            className="px-2.5 py-1 rounded-full text-[10px] font-medium border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {quality === 'static' ? 'Enable 3D Core' : `3D: ${quality.toUpperCase()} · Reduce Effects`}
          </button>
        </div>
      )}
    </div>
  );
}
