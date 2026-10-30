import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Words} from '../components/Words';
import {C} from '../theme';
import {EASE_IO, map, useLayout, useScene} from '../lib';
import {cue} from '../timeline';

/** 1 — "Every career starts with a blank page." A lone sheet floats in the dark. */
export const Blank: React.FC = () => {
  const {abs, t} = useScene();
  const {portrait} = useLayout();
  const vo = cue('01-blank');

  const rise = map(t, [-6, 70]);
  const w = portrait ? 520 : 470;
  const h = w * 1.414;
  const sweep = map(t, [30, 95], [-0.6, 1.6], EASE_IO);
  const cursorOn = Math.floor(t / 16) % 2 === 0 ? 1 : 0.12;

  const page = (
    <div style={{perspective: 1800, width: w, height: h, position: 'relative'}}>
      {/* contact shadow */}
      <div
        style={{
          position: 'absolute',
          left: '8%',
          right: '8%',
          bottom: -70,
          height: 60,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.75) 0%, transparent 70%)',
          opacity: rise,
          transform: `translateY(${Math.sin(t / 34) * 6}px)`,
        }}
      />
      <div
        style={{
          width: w,
          height: h,
          borderRadius: 10,
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(155deg, #fffdf8 0%, ${C.paper} 55%, #e6dfd2 100%)`,
          boxShadow: `0 60px 120px -30px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.4) inset, 0 0 120px -20px rgba(226,73,47,${0.25 * rise})`,
          transform: [
            `translateY(${(1 - rise) * 220 + Math.sin(t / 34) * 10}px)`,
            `rotateX(${14 + (1 - rise) * 40}deg)`,
            `rotateY(${-20 + (1 - rise) * -18 + t * 0.05}deg)`,
            `rotateZ(${3 + (1 - rise) * 5}deg)`,
          ].join(' '),
          filter: rise < 0.98 ? `blur(${(1 - rise) * 18}px)` : undefined,
          opacity: map(rise, [0, 0.3]),
        }}
      >
        {/* light sweep */}
        <div
          style={{
            position: 'absolute',
            inset: '-50%',
            background: 'linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.85) 50%, transparent 58%)',
            transform: `translateX(${sweep * 100}%)`,
            mixBlendMode: 'soft-light',
          }}
        />
        {/* blinking caret, waiting for the first word */}
        <div
          style={{
            position: 'absolute',
            left: 54,
            top: 62,
            width: 5,
            height: 40,
            borderRadius: 3,
            background: C.ember,
            opacity: cursorOn * map(t, [40, 50]),
            boxShadow: `0 0 18px ${C.emberGlow}`,
          }}
        />
      </div>
    </div>
  );

  const caption = (
    <Words
      f={abs}
      at={vo.from - 2}
      stagger={4}
      size={portrait ? 92 : 96}
      align={portrait ? 'center' : 'left'}
      segs={[{text: 'Every career starts', br: true}, {text: 'with a'}, {text: 'blank page.', serif: true, color: C.ember}]}
    />
  );

  return portrait ? (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 150, flexDirection: 'column'}}>
      {page}
      {caption}
    </AbsoluteFill>
  ) : (
    <AbsoluteFill style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 170, paddingLeft: 40}}>
      <div style={{width: 760}}>{caption}</div>
      {page}
    </AbsoluteFill>
  );
};
