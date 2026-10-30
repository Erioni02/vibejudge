import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {map, useLayout} from '../lib';
import {TL, TRANSITION} from '../timeline';

/** Warm night stage: deep ink base with slow-moving ember auroras. */
export const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const meet = TL.scenes.meet;
  // the brand reveal gets a brighter stage
  const lift = map(f, [meet.from - 10, meet.from + 20]) * (1 - map(f, [meet.from + meet.dur - 10, meet.from + meet.dur + 20]));
  const s = f / 30;
  const blob = (x: number, y: number, r: number, color: string) =>
    `radial-gradient(circle at ${x}% ${y}%, ${color} 0%, transparent ${r}%)`;
  return (
    <AbsoluteFill
      style={{
        background: [
          blob(18 + 8 * Math.sin(s * 0.21), 78 + 6 * Math.cos(s * 0.17), 46, `rgba(226,73,47,${0.2 + 0.12 * lift})`),
          blob(84 + 6 * Math.cos(s * 0.19), 16 + 7 * Math.sin(s * 0.23), 40, `rgba(168,112,28,${0.16 + 0.08 * lift})`),
          blob(55 + 10 * Math.sin(s * 0.11), 50, 34 + 18 * lift, `rgba(226,73,47,${0.05 + 0.2 * lift})`),
          `radial-gradient(ellipse at 50% 42%, #231913 0%, ${C.night} 72%)`,
        ].join(','),
      }}
    />
  );
};

/** Drifting out-of-focus dust: small sharp motes plus a few big soft orbs. */
export const Bokeh: React.FC = () => {
  const f = useCurrentFrame();
  const {W, H} = useLayout();
  const motes = Array.from({length: 46}, (_, i) => {
    const big = i < 9;
    const size = big ? 60 + random(`s${i}`) * 120 : 3 + random(`s${i}`) * 7;
    const speed = (big ? 0.12 : 0.35) + random(`v${i}`) * 0.5;
    const x = random(`x${i}`) * W + Math.sin(f / 70 + i) * 24;
    const span = H + 300;
    const y = ((random(`y${i}`) * span - f * speed) % span + span) % span - 150;
    const tw = 0.55 + 0.45 * Math.sin(f / (18 + random(`t${i}`) * 30) + i * 3);
    const warm = random(`c${i}`) > 0.55;
    const alpha = (big ? 0.05 : 0.5) * tw;
    const color = warm ? `rgba(240,120,80,${alpha})` : `rgba(247,244,238,${alpha})`;
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
      />
    );
  });
  return <AbsoluteFill>{motes}</AbsoluteFill>;
};

/** Film grain + vignette, lighter once the paper end card has taken over. */
export const Finish: React.FC = () => {
  const f = useCurrentFrame();
  const onPaper = map(f, [TL.scenes.cta.from, TL.scenes.cta.from + 24]);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 48%, transparent 52%, rgba(0,0,0,${0.62 - 0.5 * onPaper}) 100%)`,
        }}
      />
      <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.085 - 0.03 * onPaper, mixBlendMode: 'overlay'}}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 12} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

/** A warm anamorphic flare that sweeps across each cut. */
export const LightLeaks: React.FC = () => {
  const f = useCurrentFrame();
  const {W} = useLayout();
  const cuts = Object.entries(TL.scenes)
    .filter(([id]) => id !== 'blank' && id !== 'cta')
    .map(([, s]) => s.from);
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none'}}>
      {cuts.map((at, i) => {
        const p = map(f, [at - TRANSITION - 4, at + TRANSITION + 8], [0, 1], (x) => x);
        if (p <= 0 || p >= 1) return null;
        const a = Math.sin(p * Math.PI);
        const x = -0.3 * W + p * 1.6 * W;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute',
                left: x - W * 0.35,
                top: '-10%',
                width: W * 0.7,
                height: '120%',
                background: `radial-gradient(ellipse at 50% 50%, rgba(255,150,90,${0.5 * a}) 0%, rgba(226,73,47,${0.22 * a}) 35%, transparent 70%)`,
                transform: 'rotate(12deg)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '47%',
                height: '6%',
                background: `radial-gradient(ellipse ${W * 0.5}px 50% at ${x}px 50%, rgba(255,190,150,${0.35 * a}) 0%, transparent 100%)`,
              }}
            />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
