import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Words} from '../components/Words';
import {C, display, sans} from '../theme';
import {EASE_IO, map, useLayout, useScene} from '../lib';
import {cue} from '../timeline';
import {M} from '../moments';

const TABS = ['Upload file', 'Paste text', 'No CV yet'];

/** 2 — "No CV. No idea where to begin? That's exactly where we start." → clicks the real "No CV yet" tab. */
export const NoCv: React.FC = () => {
  const {abs} = useScene();
  const {portrait} = useLayout();
  const a = cue('02a-nocv');
  const b = cue('02b-noidea');
  const c = cue('02c-start');

  // "No CV." slams in, then steps back when the question arrives
  const slam = map(abs, [a.from - 3, a.from + 16]);
  const back = map(abs, [b.from - 4, b.from + 14], [0, 1], EASE_IO);
  const groupOut = map(abs, [c.from - 8, c.from + 8], [0, 1], EASE_IO);

  // segmented control + click
  const uiIn = map(abs, [c.from + c.dur - 14, c.from + c.dur + 12]);
  const click = M.clickNoCv;
  const pressed = map(abs, [click - 3, click]) * (1 - map(abs, [click + 1, click + 8]));
  const moved = map(abs, [click, click + 14]);
  const tabW = portrait ? 290 : 270;
  const cursorP = map(abs, [click - 30, click - 2], [0, 1], EASE_IO);
  const ripple = map(abs, [click, click + 22]);

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      {/* No CV. / No idea where to begin? */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 1 - groupOut,
          transform: `translateY(${-70 * groupOut}px)`,
          filter: groupOut > 0.01 ? `blur(${groupOut * 16}px)` : undefined,
        }}
      >
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: portrait ? 230 : 280,
            letterSpacing: '-0.055em',
            color: C.paper,
            lineHeight: 1,
            opacity: map(slam, [0, 0.4]) * (1 - 0.6 * back),
            transform: `translateY(${-150 * back}px) scale(${(1.35 - 0.35 * slam) * (1 - 0.45 * back)})`,
            filter: slam < 0.99 ? `blur(${(1 - slam) * 30}px)` : undefined,
            textShadow: `0 0 80px rgba(226,73,47,${0.35 * slam})`,
          }}
        >
          No CV<span style={{color: C.ember}}>.</span>
        </div>
        <div style={{position: 'absolute', top: '54%'}}>
          <Words
            f={abs}
            at={b.from - 2}
            stagger={3}
            size={portrait ? 84 : 104}
            align="center"
            color="rgba(247,244,238,0.92)"
            segs={portrait ? [{text: 'No idea where', br: true}, {text: 'to begin?'}] : [{text: 'No idea where to begin?'}]}
          />
        </div>
      </AbsoluteFill>

      {/* That's exactly where we start. */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: `translateY(${portrait ? -120 : -90}px)`}}>
        <Words
          f={abs}
          at={c.from - 2}
          stagger={3}
          size={portrait ? 92 : 112}
          align="center"
          segs={
            portrait
              ? [{text: "That's exactly", br: true}, {text: 'where we'}, {text: 'start.', serif: true, color: C.ember}]
              : [{text: "That's exactly where we"}, {text: 'start.', serif: true, color: C.ember}]
          }
        />
      </AbsoluteFill>

      {/* the real upload card's tab row */}
      <div
        style={{
          position: 'absolute',
          top: portrait ? '58%' : '60%',
          opacity: uiIn,
          transform: `translateY(${(1 - uiIn) * 60}px) scale(${0.94 + 0.06 * uiIn})`,
          filter: uiIn < 0.99 ? `blur(${(1 - uiIn) * 12}px)` : undefined,
        }}
      >
        <div
          style={{
            display: 'flex',
            position: 'relative',
            padding: 8,
            borderRadius: 22,
            background: C.paper2,
            boxShadow: '0 40px 90px -30px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.5) inset',
            fontFamily: sans,
            transform: `scale(${1 - 0.03 * pressed})`,
          }}
        >
          {/* active pill */}
          <div
            style={{
              position: 'absolute',
              top: 8,
              bottom: 8,
              left: 8 + tabW * 2 * moved,
              width: tabW,
              borderRadius: 15,
              background: moved > 0.5 ? C.ember : '#fff',
              boxShadow: moved > 0.5 ? `0 10px 40px -6px ${C.emberGlow}` : '0 2px 6px rgba(22,19,15,0.12)',
            }}
          />
          {TABS.map((tab, i) => {
            const active = i === 2 ? moved > 0.5 : i === 0 && moved <= 0.5;
            return (
              <div
                key={tab}
                style={{
                  position: 'relative',
                  width: tabW,
                  textAlign: 'center',
                  padding: '22px 0',
                  fontSize: 30,
                  fontWeight: 600,
                  color: active && i === 2 ? '#fff' : active ? C.ink : C.ink3,
                }}
              >
                {tab}
              </div>
            );
          })}
          {/* click ripple */}
          <div
            style={{
              position: 'absolute',
              left: 8 + tabW * 2.5 - 60,
              top: '50%',
              width: 120,
              height: 120,
              marginTop: -60,
              borderRadius: '50%',
              border: `3px solid ${C.ember}`,
              opacity: ripple > 0 ? (1 - ripple) * 0.9 : 0,
              transform: `scale(${0.3 + ripple * 2.4})`,
            }}
          />
        </div>
        {/* pointer */}
        <svg
          width={46}
          height={56}
          viewBox="0 0 24 30"
          style={{
            position: 'absolute',
            left: 8 + tabW * 2.5 - 6 + (1 - cursorP) * 260,
            top: 54 + (1 - cursorP) * 190,
            opacity: map(abs, [click - 34, click - 24]) * (1 - map(abs, [click + 30, click + 40])),
            transform: `scale(${1 - 0.15 * pressed})`,
            filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.5))',
          }}
        >
          <path d="M2 2 L2 24 L8 18.5 L12.5 28 L16.5 26.2 L12 17 L20 17 Z" fill="#fff" stroke={C.ink} strokeWidth={1.6} strokeLinejoin="round" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
