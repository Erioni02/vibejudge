import React from 'react';
import {C, display, sans} from '../theme';
import {map} from '../lib';

export const DOC_W = 600;
export const DOC_H = 848;

const Row: React.FC<{left: string; right?: string}> = ({left, right}) => (
  <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: C.ink, marginBottom: 5}}>
    <span>{left}</span>
    {right ? <span style={{color: C.ink3, fontWeight: 500}}>{right}</span> : null}
  </div>
);

const Bullet: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{display: 'flex', gap: 9, marginTop: 3}}>
    <span style={{color: C.ember, fontWeight: 700}}>•</span>
    <span>{children}</span>
  </div>
);

/** Built only from the builder's own example answers (components/home/cv-builder.tsx). */
const SECTIONS: {title?: string; body: React.ReactNode}[] = [
  {
    body: (
      <div>
        <div style={{fontFamily: display, fontWeight: 700, fontSize: 44, letterSpacing: '-0.035em', color: C.ink, lineHeight: 1}}>
          Alex Rivera
        </div>
        <div style={{fontFamily: display, fontWeight: 600, fontSize: 19, color: C.ember, marginTop: 10}}>Junior Marketing Assistant</div>
        <div style={{fontSize: 12.5, color: C.ink3, marginTop: 8}}>alex@email.com · Leeds · linkedin.com/in/alexrivera</div>
        <div style={{height: 3, width: 56, background: C.ember, borderRadius: 2, marginTop: 16}} />
      </div>
    ),
  },
  {
    title: 'Profile',
    body: (
      <p style={{margin: 0}}>
        Psychology graduate with hands-on customer and team experience. Organised, numerate and calm under pressure, ready to bring
        curiosity and energy to a marketing team.
      </p>
    ),
  },
  {
    title: 'Experience',
    body: (
      <div>
        <Row left="Weekend Barista · Costa Coffee" right="2022 – Present" />
        <Bullet>Opened the shop on weekends and ran the till through rush hour</Bullet>
        <Bullet>Trained 3 new starters on opening, till and service routines</Bullet>
      </div>
    ),
  },
  {
    title: 'Education',
    body: (
      <div>
        <Row left="BSc Psychology · University of Leeds" right="2021 – 2024" />
        <div style={{color: C.ink3}}>Grade: 2:1 · Dissertation on social media and attention</div>
      </div>
    ),
  },
  {
    title: 'Projects & Activities',
    body: (
      <div>
        <Row left="Treasurer · Uni Hiking Society (60 members)" />
        <Bullet>Built the budgeting spreadsheet the whole society now uses</Bullet>
        <Bullet>Raised £1,200 for a local food bank with a charity quiz night</Bullet>
      </div>
    ),
  },
  {
    title: 'Skills',
    body: (
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 7}}>
        {['Excel', 'Canva', 'Google Analytics', 'Spanish (fluent)', 'Customer service', 'First aid'].map((s) => (
          <span key={s} style={{border: `1px solid ${C.line}`, background: C.paper, borderRadius: 999, padding: '4px 11px', fontSize: 12}}>
            {s}
          </span>
        ))}
      </div>
    ),
  },
];

export const SECTION_COUNT = SECTIONS.length;

/**
 * A one-page CV. `reveal(i)` gives 0→1 for section i (wipe + de-blur);
 * `focus` (optional) dims everything except one section.
 */
export const CvDoc: React.FC<{reveal: (i: number) => number; focus?: {index: number; amount: number}; badge?: number}> = ({
  reveal,
  focus,
  badge = 0,
}) => (
  <div
    style={{
      width: DOC_W,
      height: DOC_H,
      background: `linear-gradient(160deg, #fffdf9 0%, ${C.paper} 60%, ${C.paper2} 100%)`,
      borderRadius: 14,
      padding: '52px 52px',
      boxSizing: 'border-box',
      fontFamily: sans,
      fontSize: 13.5,
      lineHeight: 1.5,
      color: C.ink2,
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {SECTIONS.map((s, i) => {
      const r = reveal(i);
      const dim = focus && focus.index !== i ? 1 - 0.75 * focus.amount : 1;
      return (
        <div
          key={i}
          style={{
            marginBottom: i === 0 ? 30 : 20,
            clipPath: `inset(0 0 ${(1 - r) * 100}% 0)`,
            opacity: map(r, [0, 0.5]) * dim,
            filter: r < 0.99 ? `blur(${(1 - r) * 6}px)` : undefined,
            transform: `translateY(${(1 - r) * 10}px)`,
          }}
        >
          {s.title ? (
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: C.ink,
                borderBottom: `1px solid ${C.line}`,
                paddingBottom: 6,
                marginBottom: 9,
              }}
            >
              {s.title}
            </div>
          ) : null}
          {s.body}
        </div>
      );
    })}
    <div
      style={{
        position: 'absolute',
        top: 40,
        right: 40,
        transform: `scale(${badge})`,
        opacity: map(badge, [0, 0.3]),
        background: C.mossSoft,
        color: C.moss,
        fontWeight: 600,
        fontSize: 13,
        borderRadius: 999,
        padding: '6px 13px',
        border: `1px solid rgba(47,107,87,0.2)`,
      }}
    >
      ✦ New CV
    </div>
  </div>
);
