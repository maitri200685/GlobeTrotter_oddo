import React from 'react';
import { LandingPage } from '@/pages/public/LandingPage';

interface AuthGlassLayoutProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export const AuthGlassLayout: React.FC<AuthGlassLayoutProps> = ({
  children,
  maxWidth = 'max-w-xl',
}) => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden">
      {/* Layer 1: Existing Homepage as background (kept fixed & blurred, not interactive) */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {/* Scroll-lock LandingPage viewport, apply blur directly to its wrapper */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{
            filter: 'blur(12px) saturate(105%)',
            WebkitFilter: 'blur(12px) saturate(105%)',
            transform: 'scale(1.05)',
          }}
        >
          <div
            className="relative"
            style={{ height: '100vh', overflow: 'hidden' }}
          >
            <LandingPage />
          </div>
        </div>

        {/* Layer 2: Soft dark overlay for contrast + readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at top, rgba(18,16,28,0.55) 0%, rgba(18,16,28,0.72) 50%, rgba(12,10,20,0.82) 100%)',
          }}
        />
        {/* Subtle warm tint overlay that matches terracotta brand */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(224,90,71,0.18) 0%, rgba(251,191,36,0.08) 50%, rgba(20,184,166,0.08) 100%)',
          }}
        />
        {/* Noise texture to add depth */}
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              'url("data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;200&quot; height=&quot;200&quot;><filter id=&quot;n&quot;><feTurbulence type=&quot;fractalNoise&quot; baseFrequency=&quot;0.9&quot; numOctaves=&quot;2&quot; stitchTiles=&quot;stitch&quot;/></filter><rect width=&quot;100%25&quot; height=&quot;100%25&quot; filter=&quot;url(%23n)&quot;/></svg>")',
          }}
        />
      </div>

      {/* Layer 3: Foreground Auth Form (sharp, fully interactive) */}
      <div className="relative z-10 w-full">
        <div className={`w-full ${maxWidth} mx-auto px-4 sm:px-6 py-8`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthGlassLayout;
