import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ACCENT_GRADIENT, COLORS, COPY, STYLE} from '../config';
import {SceneWrap} from '../components/SceneWrap';
import {clamp, loopSin, progress, useLayout} from '../lib';

/** Abstract logo mark — a gradient tile with motion arcs (not a real brand logo). */
const Mark: React.FC<{size: number; frame: number}> = ({size, frame}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: ACCENT_GRADIENT,
      boxShadow: `0 0 ${size * 0.9}px ${COLORS.glow}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 100 100">
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M 14 ${70 - i * 18} Q 50 ${30 - i * 18 + loopSin(frame, 60, 1, i * 0.2) * 6} 86 ${70 - i * 18}`}
          fill="none"
          stroke="#fff"
          strokeWidth={9}
          strokeLinecap="round"
          opacity={1 - i * 0.28}
        />
      ))}
    </svg>
  </div>
);

/** 8–14s: wordmark scales in with a glow + light sweep, subtext staggers in. */
export const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {vertical, u} = useLayout();

  const pop = spring({frame: frame - 6, fps, config: {damping: 14, mass: 0.9, stiffness: 120}});
  const settle = spring({frame: frame - 6, fps, config: {damping: 200}});
  const glow = interpolate(frame, [6, 30, 180], [0, 1, 0.75], clamp);
  const sweep = interpolate(frame, [24, 70], [-40, 140], clamp);
  const markSize = (vertical ? 150 : 130) * u;
  const wordSize = (vertical ? 150 : 170) * u;

  return (
    <SceneWrap>
      {/* glow */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            width: 1400 * u,
            height: 700 * u,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, rgba(139,92,246,0.5) 0%, rgba(34,211,238,0.18) 40%, transparent 70%)`,
            opacity: glow * (0.85 + 0.15 * loopSin(frame, 90)),
            filter: `blur(${30 * u}px)`,
            transform: `scale(${interpolate(settle, [0, 1], [0.6, 1])})`,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <div
          style={{
            display: 'flex',
            flexDirection: vertical ? 'column' : 'row',
            alignItems: 'center',
            gap: (vertical ? 40 : 36) * u,
            transform: `scale(${interpolate(pop, [0, 1], [0.7, 1])})`,
            opacity: settle,
            filter: `blur(${(1 - settle) * 16}px)`,
          }}
        >
          <Mark size={markSize} frame={frame} />
          <div
            style={{
              position: 'relative',
              fontSize: wordSize,
              fontWeight: 800,
              letterSpacing: STYLE.headlineTracking,
              lineHeight: 1,
              backgroundImage: `linear-gradient(100deg, transparent ${sweep - 20}%, rgba(255,255,255,0.9) ${sweep}%, transparent ${sweep + 20}%), linear-gradient(100deg, #FFFFFF 0%, #E9E3FF 45%, #A5F3FC 100%)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              paddingBottom: wordSize * 0.06,
            }}
          >
            {COPY.reveal.wordmark}
          </div>
        </div>

        <div style={{marginTop: (vertical ? 70 : 54) * u, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 * u}}>
          {COPY.reveal.sublines.map((line, i) => {
            const p = spring({frame: frame - 40 - i * 12, fps, config: {damping: 200}});
            return (
              <div
                key={line}
                style={{
                  fontSize: (vertical ? 52 : 50) * u,
                  fontWeight: i === 0 ? 600 : 500,
                  letterSpacing: '-0.02em',
                  color: i === 0 ? COLORS.text : COLORS.textMuted,
                  textAlign: 'center',
                  maxWidth: vertical ? 900 * u : undefined,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 30 * u}px)`,
                }}
              >
                {line}
              </div>
            );
          })}
          <div
            style={{
              marginTop: 26 * u,
              width: 320 * u * progress(frame, 70, 110),
              height: 3 * u,
              borderRadius: 3 * u,
              background: ACCENT_GRADIENT,
              boxShadow: `0 0 ${20 * u}px ${COLORS.glow}`,
            }}
          />
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};
