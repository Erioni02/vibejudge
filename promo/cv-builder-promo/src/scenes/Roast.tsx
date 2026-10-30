import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, display, sans, serif} from '../theme';
import {EASE_IO, map, pop, useLayout, useScene} from '../lib';
import {M} from '../moments';

const SCORE = 91;

/** 7 — "Then let it roast, score, and sharpen every line." */
export const Roast: React.FC = () => {
  const {abs, t} = useScene();
  const {portrait} = useLayout();

  const dialIn = map(t, [-6, 26]);
  const fill = map(abs, [M.score, M.score + 40], [0, 1], EASE_IO);
  const value = Math.round(SCORE * fill);
  const r = 170;
  const circ = 2 * Math.PI * r;
  const cardIn = map(abs, [M.roast - 10, M.roast + 18]);
  const strike = map(abs, [M.sharpen, M.sharpen + 12]);
  const rewrite = map(abs, [M.sharpen + 10, M.sharpen + 26]);
  const words = [
    {w: 'Roast', at: M.roast},
    {w: 'Score', at: M.score},
    {w: 'Sharpen', at: M.sharpen},
  ];

  const dial = (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: dialIn, transform: `scale(${0.85 + 0.15 * dialIn})`}}>
      <div style={{position: 'relative', width: 420, height: 420}}>
        <svg width={420} height={420} viewBox="0 0 420 420" style={{transform: 'rotate(-90deg)'}}>
          <defs>
            <linearGradient id="dialGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff9a6e" />
              <stop offset="100%" stopColor={C.ember} />
            </linearGradient>
          </defs>
          <circle cx={210} cy={210} r={r} fill="none" stroke="rgba(247,244,238,0.1)" strokeWidth={22} />
          <circle
            cx={210}
            cy={210}
            r={r}
            fill="none"
            stroke="url(#dialGrad)"
            strokeWidth={22}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - (SCORE / 100) * fill)}
            style={{filter: `drop-shadow(0 0 ${18 * fill}px rgba(226,73,47,0.8))`}}
          />
        </svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontFamily: display, fontWeight: 700, fontSize: 150, color: C.paper, letterSpacing: '-0.05em', lineHeight: 1}}>{value}</div>
          <div style={{fontFamily: sans, fontSize: 24, color: 'rgba(247,244,238,0.6)', marginTop: 6}}>out of 100</div>
        </div>
      </div>
      <div style={{display: 'flex', gap: 34, marginTop: 44}}>
        {words.map(({w, at}) => {
          const on = map(abs, [at - 2, at + 10]);
          const p = pop(abs, at - 2, 16);
          return (
            <div
              key={w}
              style={{
                fontFamily: display,
                fontWeight: 700,
                fontSize: 52,
                letterSpacing: '-0.03em',
                color: on > 0.5 ? C.paper : 'rgba(247,244,238,0.18)',
                transform: `scale(${1 + 0.12 * (p - on)})`,
                textShadow: `0 0 ${30 * on}px rgba(226,73,47,${0.8 * on})`,
              }}
            >
              {w}
              <span style={{color: C.ember}}>.</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const card = (
    <div
      style={{
        width: portrait ? 900 : 780,
        borderRadius: 28,
        padding: '40px 46px',
        boxSizing: 'border-box',
        background: C.paper,
        fontFamily: sans,
        color: C.ink2,
        opacity: cardIn,
        transform: `translateY(${(1 - cardIn) * 80}px) rotate(${1.5 - 0.5 * cardIn}deg) rotateY(${Math.sin(t / 40) * 2}deg)`,
        filter: cardIn < 0.98 ? `blur(${(1 - cardIn) * 14}px)` : undefined,
        boxShadow: '0 80px 140px -40px rgba(0,0,0,0.9), 0 0 140px -60px rgba(226,73,47,0.8)',
      }}
    >
      <div style={{fontSize: 18, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.ember}}>The roast</div>
      <div style={{fontFamily: serif, fontStyle: 'italic', fontSize: 52, lineHeight: 1.12, color: C.ink, marginTop: 14}}>
        “Your bullet points are responsibilities wearing a tie.”
      </div>
      <div
        style={{
          marginTop: 26,
          borderLeft: `4px solid ${C.moss}`,
          background: C.mossSoft,
          color: C.moss,
          borderRadius: 10,
          padding: '14px 20px',
          fontSize: 24,
          fontWeight: 500,
        }}
      >
        Fix: lead each bullet with the result, then the number.
      </div>
      <div style={{marginTop: 26, fontSize: 26, lineHeight: 1.45, position: 'relative', minHeight: 80}}>
        <div style={{position: 'relative', display: 'inline-block', color: C.ink3, opacity: 1 - rewrite}}>
          Responsible for training new staff
          <div style={{position: 'absolute', left: 0, top: '52%', height: 3, width: `${strike * 100}%`, background: C.ember, borderRadius: 2}} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            color: C.ink,
            fontWeight: 600,
            opacity: rewrite,
            transform: `translateY(${(1 - rewrite) * 14}px)`,
            filter: rewrite < 0.98 ? `blur(${(1 - rewrite) * 8}px)` : undefined,
          }}
        >
          <span style={{color: C.ember}}>✦</span> Trained 3 new starters on opening, till and service
        </div>
      </div>
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: portrait ? 'column' : 'row',
        gap: portrait ? 90 : 120,
      }}
    >
      {dial}
      {card}
    </AbsoluteFill>
  );
};
