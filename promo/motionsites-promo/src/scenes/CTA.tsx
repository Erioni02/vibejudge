import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ACCENT_GRADIENT, COLORS, COPY, STYLE} from '../config';
import {SceneWrap} from '../components/SceneWrap';
import {WordReveal} from '../components/WordReveal';
import {clamp, loopSin, useLayout} from '../lib';

/** 27–30s: headline, big URL, affiliate slot, and an always-readable disclosure. */
export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {vertical, u} = useLayout();

  const url = spring({frame: frame - 18, fps, config: {damping: 13, mass: 0.7}});
  const aff = spring({frame: frame - 30, fps, config: {damping: 200}});
  const disclosure = interpolate(frame, [0, 6], [0, 1], clamp);
  const sheen = interpolate(frame, [30, 75], [-30, 130], clamp);

  return (
    <SceneWrap fadeOut={false}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            width: 1300 * u,
            height: 600 * u,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.42) 0%, rgba(34,211,238,0.14) 45%, transparent 70%)',
            filter: `blur(${30 * u}px)`,
            opacity: url * (0.85 + 0.15 * loopSin(frame, 45)),
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: `0 ${70 * u}px`,
          gap: (vertical ? 56 : 40) * u,
        }}
      >
        <WordReveal
          words={COPY.cta.headline.split(' ')}
          start={0}
          stagger={3}
          fontSize={(vertical ? 84 : 74) * u}
          weight={700}
          color={COLORS.text}
          style={{maxWidth: vertical ? 880 * u : undefined}}
        />
        <div
          style={{
            fontSize: (vertical ? 132 : 168) * u,
            fontWeight: 800,
            letterSpacing: STYLE.headlineTracking,
            lineHeight: 1,
            backgroundImage: `linear-gradient(100deg, transparent ${sheen - 15}%, rgba(255,255,255,0.85) ${sheen}%, transparent ${sheen + 15}%), ${ACCENT_GRADIENT}`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            transform: `scale(${interpolate(url, [0, 1], [0.75, 1])})`,
            opacity: Math.min(1, url * 1.4),
            filter: `drop-shadow(0 0 ${30 * u}px rgba(139,92,246,0.45))`,
            paddingBottom: 12 * u,
          }}
        >
          {COPY.cta.url}
        </div>
        <div
          style={{
            padding: `${16 * u}px ${34 * u}px`,
            borderRadius: 999,
            border: `${2 * u}px solid rgba(255,255,255,0.18)`,
            background: 'rgba(255,255,255,0.06)',
            fontSize: (vertical ? 40 : 36) * u,
            fontWeight: 600,
            color: COLORS.text,
            letterSpacing: '-0.01em',
            opacity: aff,
            transform: `translateY(${(1 - aff) * 24 * u}px)`,
            textAlign: 'center',
          }}
        >
          {COPY.cta.affiliate}
        </div>
      </AbsoluteFill>

      {/* Disclosure — high contrast, never animated away. */}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: (vertical ? 200 : 56) * u,
        }}
      >
        <div
          style={{
            fontSize: (vertical ? 32 : 28) * u,
            fontWeight: 500,
            color: '#D4D4DE',
            background: 'rgba(0,0,0,0.55)',
            padding: `${8 * u}px ${18 * u}px`,
            borderRadius: 10 * u,
            opacity: disclosure,
          }}
        >
          {COPY.cta.disclosure}
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};
