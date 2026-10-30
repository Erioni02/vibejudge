import React from 'react';
import {AbsoluteFill} from 'remotion';
import {LogoMark} from '../components/LogoMark';
import {C, display, sans} from '../theme';
import {EASE_IO, map, useLayout, useScene} from '../lib';
import {M} from '../moments';

/** 3 — "Meet the VibeJudge AI CV builder." Light burst, the mark draws itself, wordmark rises. */
export const Meet: React.FC = () => {
  const {abs, t} = useScene();
  const {portrait} = useLayout();

  const burst = map(abs, [M.logoBurst - 8, M.logoBurst + 26]);
  const draw = map(abs, [M.logoBurst + 2, M.logoBurst + 44], [0, 1], EASE_IO);
  const markIn = map(abs, [M.logoBurst, M.logoBurst + 20]);
  const glint = map(abs, [M.wordmark + 30, M.wordmark + 62], [-0.3, 1.3], EASE_IO);
  const label = map(abs, [M.builderLabel, M.builderLabel + 26]);
  const word = 'VibeJudge';
  const size = portrait ? 156 : 186;

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      {/* volumetric burst + slow rays */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255,170,120,${0.32 * burst}) 0%, rgba(226,73,47,${0.22 * burst}) 18%, transparent ${18 + 34 * burst}%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: 'repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,200,170,0.07) 0deg 3deg, transparent 3deg 14deg)',
          transform: `rotate(${t * 0.12}deg) scale(1.6)`,
          maskImage: 'radial-gradient(circle at 50% 50%, black 0%, transparent 46%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 0%, transparent 46%)',
          opacity: burst,
        }}
      />

      <div style={{display: 'flex', flexDirection: portrait ? 'column' : 'row', alignItems: 'center', gap: portrait ? 40 : 44}}>
        <div
          style={{
            opacity: markIn,
            transform: `scale(${0.8 + 0.2 * markIn})`,
            filter: `drop-shadow(0 0 30px rgba(226,73,47,${0.5 * draw}))`,
          }}
        >
          <LogoMark size={portrait ? 190 : 176} draw={draw} />
        </div>
        <div style={{position: 'relative', fontFamily: display, fontWeight: 700, fontSize: size, letterSpacing: '-0.045em', lineHeight: 1}}>
          <div style={{color: C.paper, display: 'flex'}}>
            {word.split('').map((ch, i) => {
              const p = map(abs, [M.wordmark + i * 2, M.wordmark + i * 2 + 24]);
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    opacity: map(p, [0, 0.5]),
                    transform: `translateY(${(1 - p) * 70}px)`,
                    filter: p < 0.99 ? `blur(${(1 - p) * 14}px)` : undefined,
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </div>
          {/* specular glint across the wordmark */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              color: 'transparent',
              backgroundImage: `linear-gradient(100deg, transparent ${glint * 100 - 12}%, rgba(255,214,190,0.95) ${glint * 100}%, transparent ${glint * 100 + 12}%)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            {word}
          </div>
        </div>
      </div>

      {/* — AI CV BUILDER — */}
      <div
        style={{
          position: 'absolute',
          top: portrait ? '64%' : '64%',
          display: 'flex',
          alignItems: 'center',
          gap: 30,
          opacity: label,
          transform: `translateY(${(1 - label) * 20}px)`,
        }}
      >
        <div style={{height: 2, width: 140 * label, background: `linear-gradient(90deg, transparent, ${C.ember})`}} />
        <div
          style={{
            fontFamily: sans,
            fontWeight: 600,
            fontSize: portrait ? 40 : 38,
            letterSpacing: `${0.6 - 0.24 * label}em`,
            color: C.paper,
            textTransform: 'uppercase',
          }}
        >
          AI <span style={{color: C.ember}}>CV</span> Builder
        </div>
        <div style={{height: 2, width: 140 * label, background: `linear-gradient(270deg, transparent, ${C.ember})`}} />
      </div>
    </AbsoluteFill>
  );
};
