import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Words} from '../components/Words';
import {C, display, sans} from '../theme';
import {EASE_IO, map, useLayout, useScene} from '../lib';
import {cue} from '../timeline';
import {M} from '../moments';

/** Questions and hints as written in components/home/cv-builder.tsx; answers from its placeholders. */
const QS = [
  {step: 1, title: 'What job are you going for?', hint: 'Be specific. “Junior data analyst” beats “anything in tech”.', answer: 'Junior Marketing Assistant'},
  {step: 3, title: 'Education', hint: 'School, college, university, courses, bootcamps.', answer: 'BSc Psychology, University of Leeds, 2021–2024. Grade: 2:1'},
  {
    step: 4,
    title: 'Any work experience?',
    hint: 'It all counts: part-time jobs, family business, freelancing.',
    answer: 'Barista at Costa: open the shop on weekends, trained 3 new starters',
  },
  {step: 5, title: 'Projects, volunteering, clubs', hint: 'Societies, sports teams, anything you organised.', answer: 'Treasurer of the uni hiking society (60 members)'},
  {step: 7, title: "One thing you're proud of", hint: 'A result, a challenge you handled. Real numbers only.', answer: 'Raised £1,200 for a local food bank with a charity quiz night'},
];

const TYPE_SPEED = 1.6; // characters per frame

/** 4 — "Just answer seven simple questions…" The builder card steps through the interview. */
export const Questions: React.FC = () => {
  const {abs, t} = useScene();
  const {portrait} = useLayout();
  const intro = cue('04a-seven');

  // which question is on the card (before the first cue: question 1, empty)
  const starts = M.questions;
  let idx = -1;
  starts.forEach((s, i) => {
    if (abs >= s) idx = i;
  });
  const shown = Math.max(idx, 0);
  const swapAt = idx >= 1 ? starts[idx] : -999;
  const swap = map(abs, [swapAt - 2, swapAt + 12], [0, 1], EASE_IO);
  const prevStep = idx >= 1 ? QS[idx - 1].step : 0;
  const curStep = idx >= 0 ? QS[shown].step : 0;
  const progress = (prevStep + (curStep - prevStep) * map(abs, [(idx >= 0 ? starts[idx] : 0) - 2, (idx >= 0 ? starts[idx] : 0) + 16])) / 7;

  const cardIn = map(abs, [M.cardIn, M.cardIn + 34]);
  const cardW = portrait ? 940 : 1000;
  const tilt = Math.sin(t / 50) * 2.2;

  const content = (i: number, phase: 'in' | 'out' | 'still') => {
    const q = QS[i];
    const typeFrom = starts[i] + 8;
    const chars = i <= idx ? Math.floor(Math.max(0, abs - typeFrom) * TYPE_SPEED) : 0;
    const typed = q.answer.slice(0, chars);
    const typing = chars > 0 && chars < q.answer.length;
    const caret = typing || Math.floor(abs / 15) % 2 === 0;
    const pressAt = (starts[i + 1] ?? -999) - 8;
    const x = phase === 'in' ? (1 - swap) * 90 : phase === 'out' ? -swap * 90 : 0;
    const o = phase === 'in' ? swap : phase === 'out' ? 1 - swap : 1;
    return (
      <div
        key={`${i}-${phase}`}
        style={{
          position: 'absolute',
          inset: 0,
          padding: portrait ? '30px 50px 44px' : '30px 56px 44px',
          transform: `translateX(${x}px)`,
          opacity: o,
          filter: o < 0.99 ? `blur(${(1 - o) * 8}px)` : undefined,
        }}
      >
        <div style={{fontSize: 22, color: C.ink3, fontWeight: 500}}>Step {q.step} of 7</div>
        <div style={{height: 7, borderRadius: 4, background: C.line, marginTop: 14, overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${progress * 100}%`, background: C.ember, borderRadius: 4}} />
        </div>
        <div style={{fontFamily: display, fontWeight: 600, fontSize: portrait ? 56 : 60, letterSpacing: '-0.03em', color: C.ink, marginTop: 34}}>
          {q.title}
        </div>
        <div style={{fontSize: 25, color: C.ink3, marginTop: 10}}>{q.hint}</div>
        <div
          style={{
            marginTop: 30,
            minHeight: 86,
            borderRadius: 16,
            border: `2px solid ${typed ? C.ember : C.line}`,
            background: '#fff',
            padding: '22px 26px',
            fontSize: 31,
            color: C.ink,
            lineHeight: 1.35,
            boxShadow: typed ? `0 0 0 6px ${C.emberSoft}` : undefined,
          }}
        >
          {typed || <span style={{color: '#b5ab9c'}}>e.g. Junior marketing assistant</span>}
          {i <= idx ? (
            <span
              style={{
                display: 'inline-block',
                width: 3,
                height: 34,
                marginLeft: 3,
                verticalAlign: 'middle',
                background: C.ember,
                opacity: caret ? 1 : 0,
              }}
            />
          ) : null}
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 30}}>
          <div
            style={{
              background: abs >= pressAt && abs < pressAt + 8 ? C.ember : C.ink,
              color: '#fff',
              borderRadius: 14,
              padding: '18px 34px',
              fontSize: 27,
              fontWeight: 600,
              transform: `scale(${abs >= pressAt && abs < pressAt + 6 ? 0.94 : 1})`,
            }}
          >
            {q.step === 7 ? 'Build my CV  ✦' : 'Next  →'}
          </div>
        </div>
      </div>
    );
  };

  // completed answers stack up behind the card
  const ghosts = Array.from({length: Math.min(Math.max(idx, 0), 3)}, (_, k) => k + 1 - (1 - swap));

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      {/* giant step numeral */}
      <div
        style={{
          position: 'absolute',
          left: portrait ? 0 : 70,
          right: portrait ? 0 : undefined,
          top: portrait ? 1350 : 300,
          textAlign: portrait ? 'center' : 'left',
          fontFamily: display,
          fontWeight: 800,
          fontSize: portrait ? 380 : 340,
          lineHeight: 1,
          letterSpacing: '-0.06em',
          color: 'transparent',
          WebkitTextStroke: '2px rgba(247,244,238,0.16)',
          opacity: cardIn,
          transform: `translateY(${(1 - swap) * 60}px)`,
        }}
      >
        0{curStep || 1}
        <span style={{fontSize: '0.2em', color: C.ember, WebkitTextStroke: '0px', letterSpacing: '-0.02em', marginLeft: 12}}>/07</span>
      </div>

      <div style={{position: 'absolute', top: portrait ? 300 : 110, width: '100%', paddingLeft: portrait ? 0 : 400, boxSizing: 'border-box'}}>
        <Words
          f={abs}
          at={intro.from}
          stagger={4}
          size={portrait ? 78 : 76}
          align="center"
          segs={[{text: 'Seven simple'}, {text: 'questions.', serif: true, color: C.ember}]}
        />
      </div>

      <div style={{perspective: 2200, marginTop: portrait ? 260 : 150, marginLeft: portrait ? 0 : 400}}>
        <div
          style={{
            position: 'relative',
            width: cardW,
            height: portrait ? 520 : 470,
            transform: `translateY(${(1 - cardIn) * 260}px) rotateX(${8 + (1 - cardIn) * 36}deg) rotateY(${tilt}deg)`,
            opacity: map(cardIn, [0, 0.4]),
            filter: cardIn < 0.98 ? `blur(${(1 - cardIn) * 16}px)` : undefined,
            transformStyle: 'preserve-3d',
          }}
        >
          {ghosts.map((depth, k) => (
            <div
              key={k}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 30,
                background: C.paper2,
                transform: `translateY(${-depth * 26}px) scale(${1 - depth * 0.05})`,
                opacity: 0.55 - depth * 0.14,
                boxShadow: '0 30px 60px -30px rgba(0,0,0,0.7)',
              }}
            />
          ))}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 30,
              background: C.paper,
              overflow: 'hidden',
              fontFamily: sans,
              boxShadow: '0 80px 140px -40px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.6) inset, 0 0 160px -60px rgba(226,73,47,0.6)',
            }}
          >
            {idx >= 1 && swap < 1 ? content(idx - 1, 'out') : null}
            {content(shown, idx >= 1 && swap < 1 ? 'in' : 'still')}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
