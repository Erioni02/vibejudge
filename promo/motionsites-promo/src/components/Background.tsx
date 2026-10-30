import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {COLORS, STYLE, VIDEO} from '../config';
import {loopCos, loopSin, useLayout} from '../lib';

const PERIOD = VIDEO.durationInFrames; // everything completes whole cycles → clean loop

const PARTICLES = new Array(46).fill(0).map((_, i) => ({
  x: random(`px${i}`),
  y: random(`py${i}`),
  size: 1 + random(`ps${i}`) * 2.6,
  depth: 0.35 + random(`pd${i}`) * 0.65,
  cycles: 1 + Math.floor(random(`pc${i}`) * 2),
  twinkle: random(`pt${i}`),
}));

/**
 * Global cinematic background: slow gradient blobs (far layer),
 * drifting particles (near layer, parallax), vignette and film grain.
 */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, u} = useLayout();

  const blob = (cx: number, cy: number, r: number, color: string, phase: number, amp: number) => {
    const x = cx * width + loopSin(frame, PERIOD, 1, phase) * amp * u;
    const y = cy * height + loopCos(frame, PERIOD, 1, phase + 0.25) * amp * 0.7 * u;
    const size = r * u * (1 + 0.08 * loopSin(frame, PERIOD, 2, phase));
    return (
      <div
        style={{
          position: 'absolute',
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
          filter: `blur(${40 * u}px)`,
        }}
      />
    );
  };

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, overflow: 'hidden'}}>
      {/* Far layer — slow gradient blobs */}
      <AbsoluteFill style={{opacity: 0.55}}>
        {blob(0.2, 0.25, 1100, 'rgba(139,92,246,0.35)', 0, 140)}
        {blob(0.85, 0.75, 1200, 'rgba(34,211,238,0.22)', 0.4, 160)}
        {blob(0.6, 0.1, 800, 'rgba(99,102,241,0.25)', 0.7, 120)}
      </AbsoluteFill>

      {/* Near layer — particles drift up at depth-based speeds (parallax) */}
      <AbsoluteFill>
        {PARTICLES.map((p, i) => {
          const travel = (frame / PERIOD) * p.cycles; // whole cycles over the video
          const y = (((p.y - travel) % 1) + 1) % 1;
          const x = p.x + loopSin(frame, PERIOD, p.cycles, p.twinkle) * 0.01;
          const alpha = (0.25 + 0.5 * p.depth) * (0.6 + 0.4 * loopSin(frame, PERIOD, 6, p.twinkle));
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x * width,
                top: y * height,
                width: p.size * u * p.depth * 1.6,
                height: p.size * u * p.depth * 1.6,
                borderRadius: '50%',
                background: i % 3 === 0 ? COLORS.accentTo : i % 3 === 1 ? COLORS.accentFrom : '#fff',
                opacity: alpha,
                boxShadow: `0 0 ${8 * u}px ${i % 2 ? COLORS.accentTo : COLORS.accentFrom}`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Subtle grid floor for depth */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${COLORS.border} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.border} 1px, transparent 1px)`,
          backgroundSize: `${90 * u}px ${90 * u}px`,
          backgroundPosition: `0 ${(frame / PERIOD) * 90 * u * 4}px`,
          opacity: 0.25,
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 10%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 10%, transparent 70%)',
        }}
      />
    </AbsoluteFill>
  );
};

/** Vignette + animated film grain, rendered above all scenes. */
export const Finish: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 12; // changes every 2 frames, loops cleanly
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.65) 100%)'}}
      />
      <AbsoluteFill style={{opacity: STYLE.grain, mixBlendMode: 'overlay'}}>
        <svg width="100%" height="100%">
          <filter id={`grain-${seed}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
