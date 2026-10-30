import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Words} from '../components/Words';
import {C, display, sans} from '../theme';
import {EASE_IO, map, pop, useLayout, useScene} from '../lib';
import {M} from '../moments';

const BADGES = ['100% free', 'No sign-up', 'No CV needed'];

/** 8 — paper wipe into the brand's own light world; "Your first CV starts here." + vibejudge.app */
export const Cta: React.FC = () => {
  const {abs, t} = useScene();
  const {portrait, W, H} = useLayout();

  const wipe = map(abs, [M.wipe, M.wipe + 30], [0, 1], EASE_IO);
  const radius = wipe * Math.hypot(W, H) * 0.56;
  const brand = map(t, [10, 34]);
  const url = map(abs, [M.url - 34, M.url - 10]);
  const urlPop = pop(abs, M.url, 20);
  const glint = map(abs, [M.url + 4, M.url + 34], [-0.2, 1.2], EASE_IO);

  return (
    <AbsoluteFill>
      {/* the paper world */}
      <AbsoluteFill
        style={{
          clipPath: `circle(${radius}px at 50% 50%)`,
          background: `radial-gradient(ellipse at 72% 18%, ${C.emberSoft} 0%, transparent 46%), radial-gradient(ellipse at 20% 90%, ${C.amberSoft} 0%, transparent 40%), ${C.paper}`,
        }}
      >
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', transform: `scale(${1.04 - 0.04 * map(t, [0, 90])})`}}>
          {/* logo lockup */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              opacity: brand,
              transform: `translateY(${(1 - brand) * 24}px)`,
              marginBottom: portrait ? 70 : 46,
            }}
          >
            <Img src={staticFile('cv.png')} style={{width: 64, height: 64}} />
            <div style={{fontFamily: display, fontWeight: 600, fontSize: 54, letterSpacing: '-0.03em', color: C.ink}}>VibeJudge</div>
          </div>

          <Words
            f={abs}
            at={M.wipe + 20}
            stagger={4}
            size={portrait ? 132 : 150}
            weight={700}
            color={C.ink}
            align="center"
            lineHeight={0.98}
            tracking="-0.045em"
            serifScale={1.16}
            segs={[{text: 'Your first CV', br: true}, {text: 'starts here.', serif: true, color: C.ember}]}
          />

          {/* badges */}
          <div style={{display: 'flex', gap: 18, marginTop: portrait ? 70 : 52, flexWrap: 'wrap', justifyContent: 'center', maxWidth: portrait ? 900 : undefined}}>
            {BADGES.map((b, i) => {
              const p = pop(abs, M.badges + i * 9, 18);
              return (
                <div
                  key={b}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 26px',
                    borderRadius: 999,
                    background: '#fff',
                    border: `1px solid ${C.line}`,
                    boxShadow: '0 10px 30px -18px rgba(22,19,15,0.35)',
                    fontFamily: sans,
                    fontWeight: 600,
                    fontSize: 28,
                    color: C.ink,
                    transform: `scale(${p})`,
                    opacity: Math.min(1, p * 2),
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: C.mossSoft,
                      color: C.moss,
                      fontSize: 18,
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                    }}
                  >
                    ✓
                  </span>
                  {b}
                </div>
              );
            })}
          </div>

          {/* URL pill */}
          <div
            style={{
              marginTop: portrait ? 80 : 58,
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              gap: 26,
              padding: '24px 26px 24px 46px',
              borderRadius: 999,
              background: C.ink,
              opacity: url,
              transform: `translateY(${(1 - url) * 40}px) scale(${0.96 + 0.04 * url + 0.05 * (urlPop - map(abs, [M.url, M.url + 20]))})`,
              boxShadow: `0 30px 60px -24px rgba(22,19,15,0.6), 0 0 0 ${10 * map(abs, [M.url, M.url + 8]) * (1 - map(abs, [M.url + 8, M.url + 30]))}px rgba(226,73,47,0.25)`,
            }}
          >
            <div style={{fontFamily: display, fontWeight: 600, fontSize: 60, letterSpacing: '-0.025em', color: C.paper}}>
              vibejudge<span style={{color: C.ember}}>.app</span>
            </div>
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                background: C.ember,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width={36} height={36} viewBox="0 0 24 24">
                <path d="M5 12 H19 M13 6 L19 12 L13 18" fill="none" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(100deg, transparent ${glint * 100 - 10}%, rgba(255,255,255,0.28) ${glint * 100}%, transparent ${glint * 100 + 10}%)`,
              }}
            />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* glowing edge of the wipe */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: radius * 2,
          height: radius * 2,
          marginLeft: -radius,
          marginTop: -radius,
          borderRadius: '50%',
          border: `4px solid rgba(255,170,130,${0.9 * (1 - wipe)})`,
          boxShadow: `0 0 60px 16px rgba(226,73,47,${0.55 * (1 - wipe)}), inset 0 0 60px 10px rgba(226,73,47,${0.4 * (1 - wipe)})`,
          opacity: wipe > 0 && wipe < 1 ? 1 : 0,
        }}
      />
    </AbsoluteFill>
  );
};
