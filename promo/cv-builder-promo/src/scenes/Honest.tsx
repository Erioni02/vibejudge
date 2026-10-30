import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Words} from '../components/Words';
import {C, display, sans} from '../theme';
import {EASE_IO, map, useLayout, useScene} from '../lib';
import {cue} from '../timeline';
import {M} from '../moments';

/** A highlighter stroke that wipes across a phrase. */
const Mark: React.FC<{p: number; children: React.ReactNode}> = ({p, children}) => (
  <span
    style={{
      backgroundImage: `linear-gradient(90deg, rgba(226,73,47,0.26), rgba(226,73,47,0.26))`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${p * 100}% 88%`,
      backgroundPosition: '0 60%',
      borderRadius: 4,
      padding: '0 2px',
    }}
  >
    {children}
  </span>
);

/** 6 — "Nothing invented. Just your story, told brilliantly." Your words → your CV, facts highlighted in both. */
export const Honest: React.FC = () => {
  const {abs, t} = useScene();
  const {portrait} = useLayout();
  const vo = cue('06-honest');
  const [p1, p2] = vo.phrases;

  const cardsIn = (d: number) => map(t, [d - 8, d + 22]);
  const arrow = map(abs, [p1[0] - 6, p1[0] + 14], [0, 1], EASE_IO);
  const marks = [0, 1, 2].map((k) => map(abs, [M.marker + 6 + k * 9, M.marker + 22 + k * 9]));

  const card = (kind: 'answer' | 'cv', p: number) => (
    <div
      style={{
        width: portrait ? 860 : 700,
        borderRadius: 26,
        padding: '34px 40px',
        boxSizing: 'border-box',
        background: kind === 'cv' ? C.paper : 'rgba(247,244,238,0.07)',
        border: kind === 'cv' ? 'none' : '1px solid rgba(247,244,238,0.2)',
        color: kind === 'cv' ? C.ink2 : 'rgba(247,244,238,0.86)',
        fontFamily: sans,
        fontSize: 28,
        lineHeight: 1.5,
        opacity: p,
        transform: `translateY(${(1 - p) * 60}px) rotate(${kind === 'cv' ? 1.2 : -1.2}deg)`,
        filter: p < 0.98 ? `blur(${(1 - p) * 12}px)` : undefined,
        boxShadow: kind === 'cv' ? '0 60px 120px -40px rgba(0,0,0,0.9), 0 0 120px -50px rgba(226,73,47,0.7)' : '0 40px 80px -40px rgba(0,0,0,0.8)',
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: C.ember,
          marginBottom: 16,
        }}
      >
        {kind === 'cv' ? 'On your CV' : 'Your answer'}
      </div>
      {kind === 'answer' ? (
        <div style={{fontStyle: 'italic'}}>
          “barista at costa, <Mark p={marks[0]}>open the shop on weekends</Mark>, <Mark p={marks[1]}>trained 3 new starters</Mark>,{' '}
          <Mark p={marks[2]}>handle the till during rush hour</Mark>”
        </div>
      ) : (
        <div>
          <div style={{fontFamily: display, fontWeight: 600, fontSize: 32, color: C.ink, letterSpacing: '-0.02em', marginBottom: 10}}>
            Weekend Barista · Costa Coffee
          </div>
          <div>
            <span style={{color: C.ember, fontWeight: 700}}>•</span> <Mark p={marks[0]}>Opened the shop on weekends</Mark> and{' '}
            <Mark p={marks[2]}>ran the till through rush hour</Mark>
          </div>
          <div>
            <span style={{color: C.ember, fontWeight: 700}}>•</span> <Mark p={marks[1]}>Trained 3 new starters</Mark> on opening, till and service
          </div>
        </div>
      )}
    </div>
  );

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', top: portrait ? 230 : 110, width: '100%'}}>
        <Words f={abs} at={p1[0] - 2} stagger={4} size={portrait ? 104 : 96} align="center" segs={[{text: 'Nothing invented.'}]} />
        <Words
          f={abs}
          at={p2[0] - 2}
          stagger={4}
          size={portrait ? 84 : 84}
          align="center"
          color="rgba(247,244,238,0.9)"
          segs={
            portrait
              ? [{text: 'Just your story,', br: true}, {text: 'told brilliantly.', serif: true, color: C.ember}]
              : [{text: 'Just your story,'}, {text: 'told brilliantly.', serif: true, color: C.ember}]
          }
          style={{marginTop: 12}}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: portrait ? 'column' : 'row',
          alignItems: 'center',
          gap: portrait ? 40 : 50,
          marginTop: portrait ? 420 : 300,
        }}
      >
        {card('answer', cardsIn(0))}
        <svg width={portrait ? 60 : 80} height={portrait ? 80 : 60} viewBox="0 0 80 60" style={{transform: portrait ? 'rotate(90deg)' : undefined}}>
          <path
            d="M4 30 H70 M50 10 L72 30 L50 50"
            fill="none"
            stroke={C.ember}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - arrow}
            style={{filter: `drop-shadow(0 0 12px ${C.emberGlow})`}}
          />
        </svg>
        {card('cv', cardsIn(10))}
      </div>
    </AbsoluteFill>
  );
};
