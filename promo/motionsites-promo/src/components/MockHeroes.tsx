/**
 * Abstract mock hero sections, built only from CSS shapes.
 * These are generic illustrations — NOT reproductions of real MotionSites designs.
 * All take (frame, width) and size themselves from width (k = width / 1000).
 */
import React from 'react';
import {interpolate, random, spring} from 'remotion';
import {ACCENT_GRADIENT, COLORS, STYLE} from '../config';
import {clamp, loopCos, loopSin} from '../lib';

type HeroProps = {frame: number; width: number; height: number; fps?: number};

const fill: React.CSSProperties = {position: 'absolute', inset: 0, overflow: 'hidden'};
const bar = (w: number, h: number, bg: string, extra?: React.CSSProperties): React.CSSProperties => ({
  width: w,
  height: h,
  borderRadius: h / 2,
  background: bg,
  ...extra,
});

/** Looping gradient mesh used by several heroes. */
const Mesh: React.FC<{frame: number; k: number; colors: string[]; period?: number}> = ({frame, k, colors, period = 180}) => (
  <div style={{...fill}}>
    {colors.map((c, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          width: 620 * k,
          height: 620 * k,
          left: `${20 + i * 28 + loopSin(frame, period, 1, i * 0.3) * 10}%`,
          top: `${-10 + (i % 2) * 40 + loopCos(frame, period, 1, i * 0.3) * 12}%`,
          transform: 'translate(-50%, -20%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${c} 0%, transparent 62%)`,
          filter: `blur(${30 * k}px)`,
        }}
      />
    ))}
  </div>
);

/** Main "built from one prompt" hero, used in the how-it-works browser. Elements build in. */
export const BuildHero: React.FC<HeroProps & {headline: string; sub: string; cta: string}> = ({
  frame,
  width,
  fps = 30,
  headline,
  sub,
  cta,
}) => {
  const k = width / 1000;
  const sp = (d: number) => spring({frame: frame - d, fps, config: {damping: 200}});
  const nav = sp(4);
  const h = sp(12);
  const s = sp(20);
  const b = spring({frame: frame - 28, fps, config: {damping: 12, mass: 0.6}});
  const pulse = 1 + 0.03 * Math.max(0, loopSin(frame, 40));
  const bg = interpolate(frame, [0, 18], [0, 1], clamp);

  return (
    <div style={{...fill, background: '#07060F'}}>
      <div style={{...fill, opacity: bg}}>
        <Mesh frame={frame} k={k} colors={['rgba(139,92,246,0.8)', 'rgba(34,211,238,0.55)', 'rgba(236,72,153,0.35)']} />
        {/* orbit ring */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '58%',
            width: 760 * k,
            height: 760 * k,
            marginLeft: -380 * k,
            marginTop: -380 * k,
            borderRadius: '50%',
            border: `${1.5 * k}px solid rgba(255,255,255,0.12)`,
            transform: `rotate(${frame * 0.6}deg) scaleY(0.32)`,
          }}
        />
      </div>
      {/* nav */}
      <div
        style={{
          position: 'absolute',
          top: 22 * k,
          left: 32 * k,
          right: 32 * k,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: nav,
          transform: `translateY(${(1 - nav) * -16 * k}px)`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 10 * k}}>
          <div style={{width: 22 * k, height: 22 * k, borderRadius: 7 * k, background: ACCENT_GRADIENT}} />
          <div style={bar(70 * k, 9 * k, 'rgba(255,255,255,0.7)')} />
        </div>
        <div style={{display: 'flex', gap: 22 * k}}>
          {[50, 60, 44].map((w, i) => (
            <div key={i} style={bar(w * k, 7 * k, 'rgba(255,255,255,0.35)')} />
          ))}
        </div>
      </div>
      {/* content */}
      <div
        style={{
          ...fill,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: `0 ${60 * k}px`,
        }}
      >
        <div
          style={{
            fontSize: 64 * k,
            fontWeight: 800,
            letterSpacing: STYLE.headlineTracking,
            lineHeight: 1.02,
            color: '#fff',
            opacity: h,
            transform: `translateY(${(1 - h) * 30 * k}px)`,
            filter: `blur(${(1 - h) * 8}px)`,
            maxWidth: 760 * k,
          }}
        >
          {headline}
        </div>
        <div
          style={{
            marginTop: 18 * k,
            fontSize: 22 * k,
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 500,
            opacity: s,
            transform: `translateY(${(1 - s) * 20 * k}px)`,
          }}
        >
          {sub}
        </div>
        <div
          style={{
            marginTop: 34 * k,
            padding: `${14 * k}px ${30 * k}px`,
            borderRadius: 999,
            background: ACCENT_GRADIENT,
            color: '#fff',
            fontWeight: 700,
            fontSize: 20 * k,
            transform: `scale(${b * pulse})`,
            boxShadow: `0 0 ${40 * k}px rgba(139,92,246,0.7)`,
          }}
        >
          {cta}
        </div>
      </div>
    </div>
  );
};

/** Fintech: deep teal, flowing chart line, glass cards. */
export const FintechHero: React.FC<HeroProps> = ({frame, width, height}) => {
  const k = width / 1000;
  const pts = new Array(24).fill(0).map((_, i) => {
    const x = (i / 23) * width;
    const y = height * 0.72 - (i / 23) * height * 0.32 + Math.sin(i * 0.9 + frame * 0.12) * 18 * k;
    return `${x},${y}`;
  });
  return (
    <div style={{...fill, background: 'linear-gradient(160deg,#03211F,#020B10)'}}>
      <Mesh frame={frame} k={k} colors={['rgba(16,185,129,0.5)', 'rgba(34,211,238,0.35)']} period={120} />
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="fin" x1="0" x2="1">
            <stop offset="0" stopColor="#10B981" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <polyline points={pts.join(' ')} fill="none" stroke="url(#fin)" strokeWidth={4 * k} />
      </svg>
      <div style={{position: 'absolute', left: 60 * k, top: 110 * k}}>
        <div style={bar(380 * k, 34 * k, '#E6FFFA', {borderRadius: 8 * k})} />
        <div style={bar(280 * k, 34 * k, '#E6FFFA', {borderRadius: 8 * k, marginTop: 12 * k})} />
        <div style={bar(200 * k, 12 * k, 'rgba(230,255,250,0.4)', {marginTop: 24 * k})} />
        <div style={bar(150 * k, 44 * k, '#10B981', {marginTop: 30 * k})} />
      </div>
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            right: (60 + i * 70) * k,
            top: (120 + i * 140) * k + loopSin(frame, 90, 1, i * 0.5) * 8 * k,
            width: 230 * k,
            height: 120 * k,
            borderRadius: 16 * k,
            background: 'rgba(255,255,255,0.07)',
            border: `${1 * k}px solid rgba(255,255,255,0.15)`,
            backdropFilter: 'blur(10px)',
            padding: 18 * k,
          }}
        >
          <div style={bar(90 * k, 8 * k, 'rgba(255,255,255,0.4)')} />
          <div style={bar(140 * k, 22 * k, 'rgba(255,255,255,0.85)', {marginTop: 14 * k, borderRadius: 6 * k})} />
        </div>
      ))}
    </div>
  );
};

/** Space: starfield, glowing planet with ring. */
export const SpaceHero: React.FC<HeroProps> = ({frame, width, height}) => {
  const k = width / 1000;
  return (
    <div style={{...fill, background: 'radial-gradient(ellipse at 70% 60%, #1B1240, #04030A 70%)'}}>
      {new Array(70).fill(0).map((_, i) => {
        const x = ((random(`sx${i}`) * width - frame * (0.4 + random(`sz${i}`)) * k) % width + width) % width;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: random(`sy${i}`) * height,
              width: 2.5 * k,
              height: 2.5 * k,
              borderRadius: '50%',
              background: '#fff',
              opacity: 0.3 + 0.7 * random(`so${i}`),
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          right: 90 * k,
          top: height / 2 - 170 * k,
          width: 340 * k,
          height: 340 * k,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #C4B5FD, #7C3AED 45%, #1E1B4B 80%)',
          boxShadow: `0 0 ${120 * k}px rgba(139,92,246,0.7)`,
          transform: `rotate(${frame * 0.3}deg)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 10 * k,
          top: height / 2 - 40 * k,
          width: 500 * k,
          height: 80 * k,
          borderRadius: '50%',
          border: `${3 * k}px solid rgba(196,181,253,0.6)`,
          transform: 'rotate(-14deg)',
        }}
      />
      <div style={{position: 'absolute', left: 60 * k, top: height / 2 - 90 * k}}>
        <div style={{fontSize: 58 * k, fontWeight: 800, color: '#fff', letterSpacing: STYLE.headlineTracking, lineHeight: 1}}>
          Beyond
          <br />
          the edge.
        </div>
        <div style={bar(220 * k, 10 * k, 'rgba(255,255,255,0.4)', {marginTop: 22 * k})} />
        <div style={bar(140 * k, 42 * k, 'rgba(255,255,255,0.95)', {marginTop: 26 * k})} />
      </div>
    </div>
  );
};

/** Agency: bold editorial type, marquee band, loud color blocks. */
export const AgencyHero: React.FC<HeroProps> = ({frame, width, height}) => {
  const k = width / 1000;
  const shift = (frame * 3 * k) % (440 * k);
  return (
    <div style={{...fill, background: '#F2EFE8'}}>
      <div
        style={{
          position: 'absolute',
          left: 50 * k,
          top: 70 * k,
          fontSize: 120 * k,
          fontWeight: 800,
          lineHeight: 0.9,
          letterSpacing: '-0.06em',
          color: '#111',
        }}
      >
        WE MAKE
        <br />
        <span style={{color: '#FF4D2E'}}>NOISE.</span>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 60 * k,
          top: 80 * k,
          width: 200 * k,
          height: 200 * k,
          background: '#111',
          borderRadius: '50%',
          transform: `rotate(${frame * 2}deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{width: 60 * k, height: 60 * k, background: '#FF4D2E', borderRadius: 10 * k}} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 50 * k,
          height: 80 * k,
          background: '#111',
          transform: 'rotate(-3deg)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{display: 'flex', gap: 40 * k, transform: `translateX(${-shift}px)`, whiteSpace: 'nowrap'}}>
          {new Array(8).fill(0).map((_, i) => (
            <span key={i} style={{color: '#F2EFE8', fontSize: 40 * k, fontWeight: 800, letterSpacing: '-0.03em'}}>
              BRAND ✦ MOTION ✦
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

/** Portfolio: soft neutral, floating image tiles, name lockup. */
export const PortfolioHero: React.FC<HeroProps> = ({frame, width, height}) => {
  const k = width / 1000;
  const tiles = [
    {x: 560, y: 60, w: 180, h: 230, c: 'linear-gradient(135deg,#F59E0B,#EF4444)'},
    {x: 760, y: 120, w: 190, h: 150, c: 'linear-gradient(135deg,#6366F1,#22D3EE)'},
    {x: 600, y: 310, w: 230, h: 170, c: 'linear-gradient(135deg,#10B981,#84CC16)'},
    {x: 850, y: 290, w: 120, h: 200, c: 'linear-gradient(135deg,#EC4899,#8B5CF6)'},
  ];
  return (
    <div style={{...fill, background: 'linear-gradient(180deg,#18161D,#0E0D12)'}}>
      {tiles.map((t, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: t.x * k,
            top: t.y * k + loopSin(frame, 100, 1, i * 0.25) * 12 * k,
            width: t.w * k,
            height: t.h * k,
            borderRadius: 14 * k,
            background: t.c,
            boxShadow: `0 ${20 * k}px ${40 * k}px rgba(0,0,0,0.5)`,
          }}
        />
      ))}
      <div style={{position: 'absolute', left: 60 * k, top: height / 2 - 100 * k}}>
        <div style={bar(110 * k, 10 * k, 'rgba(255,255,255,0.4)')} />
        <div
          style={{
            marginTop: 20 * k,
            fontSize: 72 * k,
            fontWeight: 800,
            letterSpacing: STYLE.headlineTracking,
            color: '#fff',
            lineHeight: 0.95,
          }}
        >
          Studio
          <br />
          <span style={{fontWeight: 400, fontStyle: 'italic', color: '#D4D4D8'}}>Portfolio</span>
        </div>
        <div style={bar(170 * k, 10 * k, 'rgba(255,255,255,0.3)', {marginTop: 26 * k})} />
      </div>
    </div>
  );
};

/** SaaS: aurora gradient, centered headline, floating dashboard panel. */
export const SaasHero: React.FC<HeroProps> = ({frame, width, height}) => {
  const k = width / 1000;
  return (
    <div style={{...fill, background: '#06070F'}}>
      <Mesh frame={frame} k={k} colors={['rgba(59,130,246,0.6)', 'rgba(139,92,246,0.6)', 'rgba(34,211,238,0.4)']} period={150} />
      <div style={{position: 'absolute', top: 60 * k, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={bar(120 * k, 22 * k, 'rgba(255,255,255,0.1)', {border: `${1 * k}px solid rgba(255,255,255,0.2)`})} />
        <div style={bar(520 * k, 38 * k, 'rgba(255,255,255,0.95)', {marginTop: 22 * k, borderRadius: 10 * k})} />
        <div style={bar(380 * k, 38 * k, 'rgba(255,255,255,0.95)', {marginTop: 12 * k, borderRadius: 10 * k})} />
        <div style={{display: 'flex', gap: 14 * k, marginTop: 26 * k}}>
          <div style={bar(130 * k, 40 * k, ACCENT_GRADIENT)} />
          <div style={bar(130 * k, 40 * k, 'rgba(255,255,255,0.1)')} />
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: width / 2 - 340 * k,
          top: 330 * k + loopSin(frame, 120) * 6 * k,
          width: 680 * k,
          height: height,
          borderRadius: 16 * k,
          background: 'rgba(255,255,255,0.06)',
          border: `${1 * k}px solid rgba(255,255,255,0.14)`,
          padding: 20 * k,
          display: 'flex',
          gap: 16 * k,
        }}
      >
        {[0.5, 0.8, 0.35, 0.95, 0.6, 0.75, 0.45].map((v, i) => {
          const hgt = (40 + 90 * v * (0.85 + 0.15 * loopSin(frame, 60, 1, i * 0.15))) * k;
          return <div key={i} style={{alignSelf: 'flex-start', marginTop: 130 * k - hgt, width: 60 * k, height: hgt, borderRadius: 6 * k, background: i === 3 ? ACCENT_GRADIENT : 'rgba(255,255,255,0.18)'}} />;
        })}
      </div>
    </div>
  );
};

export const GENERIC_GREY = COLORS.generic;
