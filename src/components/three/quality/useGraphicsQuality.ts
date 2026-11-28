'use client';

import { useEffect, useState } from 'react';

export type GraphicsQuality = 'high' | 'balanced' | 'low' | 'static';

function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch {
    return false;
  }
}

export function useGraphicsQuality() {
  const [quality, setQuality] = useState<GraphicsQuality>('balanced');
  const [override, setOverrideState] = useState<GraphicsQuality | 'auto'>('auto');

  useEffect(() => {
    const saved = window.localStorage.getItem('nexora_3d_quality') as
      | GraphicsQuality
      | 'auto'
      | null;
    if (saved) setOverrideState(saved);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !detectWebGL()) {
      setQuality('static');
      return;
    }

    const cores = navigator.hardwareConcurrency || 4;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    const isSmallScreen = window.innerWidth < 768;

    if (cores >= 8 && mem >= 8 && !isSmallScreen) {
      setQuality('high');
    } else if (cores >= 4 && mem >= 4) {
      setQuality('balanced');
    } else {
      setQuality('low');
    }
  }, []);

  const effectiveQuality: GraphicsQuality = override === 'auto' ? quality : override;

  const setQualityOverride = (next: GraphicsQuality | 'auto') => {
    setOverrideState(next);
    window.localStorage.setItem('nexora_3d_quality', next);
  };

  return {
    quality: effectiveQuality,
    override,
    setQualityOverride,
  };
}
