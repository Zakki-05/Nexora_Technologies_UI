import React from 'react';

/**
 * BrandWatermark provides subtle ambient depth in the background edges.
 * Note: Avoids central tilted logos so page cards, tables, and forms remain 100% clean and unobstructed.
 */
export const BrandWatermark = ({
  className = '',
  showEmblem = true,
}) => {
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none select-none z-0 overflow-hidden ${className}`}
    >
      {/* Ambient Corner Geometric Emblem Mark (at far bottom edge) */}
      {showEmblem && (
        <>
          {/* Bottom Right Corner Mark */}
          <div className="absolute -bottom-24 -right-24 md:-bottom-32 md:-right-32 w-80 h-80 md:w-[450px] md:h-[450px] opacity-[0.03] dark:opacity-[0.045] transition-opacity duration-300">
            <img
              src="/nexora-mark.png"
              alt=""
              className="w-full h-full object-contain filter drop-shadow-xl"
            />
          </div>

          {/* Top Left Subtle Accent Mark */}
          <div className="hidden xl:block absolute -top-24 left-72 w-64 h-64 opacity-[0.02] dark:opacity-[0.03] transition-opacity duration-300">
            <img
              src="/nexora-mark.png"
              alt=""
              className="w-full h-full object-contain filter"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BrandWatermark;
