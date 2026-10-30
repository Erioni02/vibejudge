import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, COPY, STYLE, TIMING} from '../config';
import {BrowserFrame} from '../components/BrowserFrame';
import {AgencyHero, FintechHero, PortfolioHero, SaasHero, SpaceHero} from '../components/MockHeroes';
import {SceneWrap} from '../components/SceneWrap';
import {clamp, useLayout} from '../lib';

const HEROES = [
  {label: 'Fintech', url: 'ledger.app', C: FintechHero},
  {label: 'Space', url: 'orbit.io', C: SpaceHero},
  {label: 'Agency', url: 'noise.studio', C: AgencyHero},
  {label: 'Portfolio', url: 'studio.design', C: PortfolioHero},
  {label: 'SaaS', url: 'flow.dev', C: SaasHero},
];

/** 22–27s: rhythmic montage of mock heroes sliding past, with overlay copy. */
export const Proof: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {vertical, u, width, height} = useLayout();

  const cardW = (vertical ? 960 : 1040) * u;
  const cardH = cardW * 0.62;
  const gap = 70 * u;
  const step = cardW + gap;

  // Snap to the next card on every beat (spring) plus a gentle constant drift.
  let pos = 0;
  for (let b = 1; b < HEROES.length; b++) {
    pos += spring({frame: frame - b * TIMING.proofBeat, fps, config: {damping: 18, mass: 0.6, stiffness: 140}});
  }
  pos += interpolate(frame, [0, 150], [-0.06, 0.06]);
  const enter = spring({frame, fps, config: {damping: 200}});

  const centerY = vertical ? height * 0.47 : height * 0.43;

  return (
    <SceneWrap>
      <AbsoluteFill>
        {HEROES.map(({label, url, C}, i) => {
          const d = i - pos; // distance from focus, in cards
          const focus = Math.max(0, 1 - Math.abs(d));
          const x = width / 2 + d * step - cardW / 2;
          const scale = interpolate(focus, [0, 1], [0.8, 1]) * interpolate(enter, [0, 1], [0.9, 1]);
          const contentW = cardW;
          const contentH = cardH - 44 * (cardW / 1000);
          return (
            <div
              key={label}
              style={{
                position: 'absolute',
                left: x,
                top: centerY - cardH / 2,
                transform: `scale(${scale}) rotateY(${-d * 8}deg)`,
                opacity: enter * interpolate(Math.abs(d), [0, 1.2, 2.2], [1, 0.45, 0], clamp),
                filter: `brightness(${interpolate(focus, [0, 1], [0.55, 1])})`,
              }}
            >
              <BrowserFrame width={cardW} height={cardH} url={url} glow={focus}>
                <C frame={frame + i * 37} width={contentW} height={contentH} fps={fps} />
              </BrowserFrame>
              <div
                style={{
                  marginTop: 20 * u,
                  textAlign: 'center',
                  fontSize: 22 * u,
                  fontWeight: 700,
                  letterSpacing: '0.24em',
                  color: COLORS.textMuted,
                  opacity: focus,
                }}
              >
                {label.toUpperCase()}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: (vertical ? 250 : 70) * u,
          paddingLeft: 60 * u,
          paddingRight: 60 * u,
        }}
      >
        {COPY.proof.overlay.map((line, i) => {
          const p = spring({frame: frame - 8 - i * 26, fps, config: {damping: 200}});
          return (
            <div
              key={line}
              style={{
                fontSize: (vertical ? 58 : 54) * u,
                fontWeight: 800,
                letterSpacing: STYLE.headlineTracking,
                lineHeight: 1.1,
                textAlign: 'center',
                color: i === 0 ? COLORS.text : 'transparent',
                backgroundImage: i === 1 ? 'linear-gradient(100deg, #C4B5FD, #67E8F9)' : undefined,
                WebkitBackgroundClip: i === 1 ? 'text' : undefined,
                backgroundClip: i === 1 ? 'text' : undefined,
                opacity: p,
                transform: `translateY(${(1 - p) * 30 * u}px)`,
                textShadow: i === 0 ? '0 4px 30px rgba(0,0,0,0.9)' : undefined,
              }}
            >
              {/* wrap only between sentences, never mid-sentence */}
              {line.split(/(?<=\.)\s+/).map((sentence, j) => (
                <span key={j} style={{display: 'inline-block', whiteSpace: 'nowrap', marginLeft: j ? '0.25em' : 0}}>
                  {sentence}
                </span>
              ))}
            </div>
          );
        })}
      </AbsoluteFill>
    </SceneWrap>
  );
};
