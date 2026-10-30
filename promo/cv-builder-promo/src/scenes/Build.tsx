import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CvDoc, DOC_H, DOC_W, SECTION_COUNT} from '../components/CvDoc';
import {Words} from '../components/Words';
import {C, sans} from '../theme';
import {EASE_IN, EASE_IO, map, pop, useLayout, useScene} from '../lib';
import {cue} from '../timeline';
import {M} from '../moments';

const CHIPS = [
  {label: 'Target role', text: 'Junior Marketing Assistant', to: 0},
  {label: 'Work', text: 'Barista · trained 3 new starters', to: 2},
  {label: 'Education', text: 'BSc Psychology, Leeds', to: 3},
  {label: 'Clubs', text: 'Hiking society treasurer', to: 4},
  {label: 'Proud of', text: 'Raised £1,200 for a food bank', to: 4},
];

/** 5 — "Our AI turns your real answers into a polished, professional CV, in seconds." */
export const Build: React.FC = () => {
  const {abs, t} = useScene();
  const {portrait} = useLayout();
  const vo = cue('05-build');

  const scale = portrait ? 1.3 : 1.08;
  const docIn = map(t, [-10, 40]);
  const scan = map(abs, [M.scanStart, M.scanStart + M.scanLen], [0, 1], EASE_IO);
  const reveal = (i: number) => map(scan, [Math.max(0.001, i / SECTION_COUNT - 0.05), (i + 1) / SECTION_COUNT + 0.02]);
  const beamOn = map(abs, [M.scanStart - 6, M.scanStart + 4]) * (1 - map(abs, [M.scanStart + M.scanLen - 4, M.scanStart + M.scanLen + 10]));

  // doc geometry on screen (for chip flight targets)
  const docCx = portrait ? 0 : 330;
  const docCy = portrait ? 210 : 0;

  const chips = CHIPS.map((chip, i) => {
    const appear = map(abs, [vo.from + 4 + i * 5, vo.from + 26 + i * 5]);
    const flyAt = M.scanStart - 18 + i * 6;
    const fly = map(abs, [flyAt, flyAt + 22], [0, 1], EASE_IN);
    const homeX = portrait ? 0 : -470;
    const homeY = portrait ? -640 + i * 0 : -230 + i * 112;
    const row = portrait ? {x: ((i % 2) - 0.5) * 470 + (i === 4 ? 235 : 0), y: -700 + Math.floor(i / 2) * 104} : {x: homeX, y: homeY};
    const targetX = docCx;
    const targetY = docCy + (-DOC_H / 2 + 80 + chip.to * 125) * scale;
    const x = row.x + (targetX - row.x) * fly;
    const y = row.y + (targetY - row.y) * fly;
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${x}px, ${y + (1 - appear) * 40}px) scale(${1 - 0.6 * fly}) rotate(${(1 - appear) * -4}deg)`,
          opacity: appear * (1 - map(fly, [0.7, 1])),
          filter: appear < 0.99 || fly > 0.5 ? `blur(${(1 - appear) * 10 + map(fly, [0.5, 1]) * 8}px)` : undefined,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '18px 26px',
          borderRadius: 18,
          background: 'rgba(247,244,238,0.08)',
          border: '1px solid rgba(247,244,238,0.18)',
          backdropFilter: 'blur(6px)',
          fontFamily: sans,
          whiteSpace: 'nowrap',
          boxShadow: `0 20px 50px -20px rgba(0,0,0,0.8), 0 0 ${30 * fly}px rgba(226,73,47,${0.6 * fly})`,
        }}
      >
        <span style={{fontSize: 17, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.ember}}>{chip.label}</span>
        <span style={{fontSize: 27, color: C.paper, fontWeight: 500}}>{chip.text}</span>
      </div>
    );
  });

  const seconds = (
    <div
      style={{
        position: 'absolute',
        left: portrait ? 0 : 150,
        right: portrait ? 0 : undefined,
        top: portrait ? 230 : '50%',
        transform: portrait ? undefined : 'translateY(-50%)',
      }}
    >
      <Words
        f={abs}
        at={M.inSeconds - 40}
        stagger={4}
        size={portrait ? 92 : 100}
        align={portrait ? 'center' : 'left'}
        segs={[{text: 'A polished,', br: true}, {text: 'professional CV.', br: true}]}
      />
      <Words
        f={abs}
        at={M.inSeconds}
        stagger={4}
        size={portrait ? 130 : 150}
        align={portrait ? 'center' : 'left'}
        segs={[{text: 'In seconds.', serif: true, color: C.ember}]}
        style={{marginTop: 10}}
      />
    </div>
  );

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      {seconds}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: DOC_W,
          height: DOC_H,
          marginLeft: -DOC_W / 2,
          marginTop: -DOC_H / 2,
          perspective: 2400,
          transform: `translate(${docCx}px, ${docCy}px) scale(${scale})`,
        }}
      >
        <div
          style={{
            position: 'relative',
            transform: `translateY(${(1 - docIn) * 160}px) rotateY(${portrait ? 0 : -16 + t * 0.03}deg) rotateX(${6 + (1 - docIn) * 24}deg)`,
            opacity: docIn,
            filter: docIn < 0.98 ? `blur(${(1 - docIn) * 14}px)` : undefined,
            boxShadow: `0 80px 160px -40px rgba(0,0,0,0.9), 0 0 ${160 * beamOn}px -40px rgba(226,73,47,0.8)`,
            borderRadius: 14,
          }}
        >
          <CvDoc reveal={reveal} badge={pop(abs, M.inSeconds + 6, 20)} />
          {/* ghost skeleton before the scan writes the page */}
          <div style={{position: 'absolute', inset: 0, padding: 52, opacity: 1 - map(scan, [0, 0.9])}}>
            {[0.6, 0.35, 0, 0.9, 0.8, 0, 0.7, 0.9, 0.5, 0, 0.85, 0.6, 0, 0.9, 0.75, 0.4].map((w, i) => (
              <div key={i} style={{height: 12, width: `${w * 100}%`, background: 'rgba(22,19,15,0.06)', borderRadius: 6, marginBottom: w ? 20 : 34}} />
            ))}
          </div>
          {/* AI scan beam */}
          <div
            style={{
              position: 'absolute',
              left: -30,
              right: -30,
              top: scan * DOC_H - 2,
              height: 4,
              borderRadius: 2,
              background: `linear-gradient(90deg, transparent, ${C.ember} 15%, #ffb38f 50%, ${C.ember} 85%, transparent)`,
              boxShadow: `0 0 30px 6px rgba(226,73,47,0.75), 0 0 90px 20px rgba(226,73,47,0.35)`,
              opacity: beamOn,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: Math.max(0, scan * DOC_H - 140),
              height: Math.min(140, scan * DOC_H),
              background: 'linear-gradient(180deg, transparent, rgba(226,73,47,0.12))',
              opacity: beamOn,
              borderRadius: 14,
            }}
          />
        </div>
      </div>
      {chips}
    </AbsoluteFill>
  );
};
