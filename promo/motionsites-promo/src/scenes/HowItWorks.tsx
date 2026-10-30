import {Check, ClipboardPaste, Copy, LayoutTemplate} from 'lucide-react';
import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ACCENT_GRADIENT, COLORS, COPY, DEMO, TIMING} from '../config';
import {BrowserFrame} from '../components/BrowserFrame';
import {BuildHero} from '../components/MockHeroes';
import {SceneWrap} from '../components/SceneWrap';
import {clamp, easeInOut, hasStaticFile, progress, useLayout} from '../lib';

const ICONS = {template: LayoutTemplate, copy: Copy, paste: ClipboardPaste} as const;
const STEP_START = [6, 30, 54];

const Chip: React.FC<{label: string; frame: number; delay: number; u: number; active?: boolean}> = ({label, frame, delay, u, active}) => {
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: {damping: 12, mass: 0.5}});
  const on = active ? progress(frame, delay + 18, delay + 26) : 0;
  return (
    <div
      style={{
        padding: `${8 * u}px ${16 * u}px`,
        borderRadius: 999,
        fontSize: 22 * u,
        fontWeight: 600,
        color: on > 0.5 ? '#fff' : COLORS.textMuted,
        background: on > 0 ? `linear-gradient(100deg, rgba(139,92,246,${on}), rgba(34,211,238,${on}))` : COLORS.surface,
        border: `${1.5 * u}px solid ${on > 0.5 ? 'transparent' : COLORS.border}`,
        transform: `scale(${p})`,
        boxShadow: on > 0 ? `0 0 ${24 * u * on}px ${COLORS.glow}` : undefined,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </div>
  );
};

const StepDetail: React.FC<{index: number; frame: number; u: number}> = ({index, frame, u}) => {
  const {fps} = useVideoConfig();
  const s = STEP_START[index];
  if (index === 0) {
    return (
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 10 * u}}>
        {COPY.how.chips.map((c, i) => (
          <Chip key={c} label={c} frame={frame} delay={s + 10 + i * 4} u={u} active={i === 0} />
        ))}
      </div>
    );
  }
  if (index === 1) {
    const copied = spring({frame: frame - (s + 24), fps, config: {damping: 11, mass: 0.5}});
    const chars = Math.floor(interpolate(frame, [s + 6, s + 22], [0, COPY.how.promptSnippet.length], clamp));
    return (
      <div style={{position: 'relative'}}>
        <div
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
            fontSize: 19 * u,
            lineHeight: 1.45,
            color: '#C9C9D6',
            background: 'rgba(0,0,0,0.35)',
            border: `${1 * u}px solid ${COLORS.border}`,
            borderRadius: 12 * u,
            padding: `${12 * u}px ${14 * u}px`,
            minHeight: 58 * u,
          }}
        >
          {COPY.how.promptSnippet.slice(0, chars)}
        </div>
        <div
          style={{
            position: 'absolute',
            right: -8 * u,
            top: -18 * u,
            display: 'flex',
            alignItems: 'center',
            gap: 6 * u,
            padding: `${6 * u}px ${12 * u}px`,
            borderRadius: 999,
            background: ACCENT_GRADIENT,
            color: '#fff',
            fontSize: 18 * u,
            fontWeight: 700,
            transform: `scale(${copied})`,
          }}
        >
          <Check size={18 * u} strokeWidth={3} /> Copied
        </div>
      </div>
    );
  }
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 10 * u}}>
      {COPY.how.tools.map((t, i) => (
        <Chip key={t} label={t} frame={frame} delay={s + 10 + i * 5} u={u} />
      ))}
    </div>
  );
};

const Steps: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {vertical, u} = useLayout();
  const exit = progress(frame, TIMING.howBrowserAt - 12, TIMING.howBrowserAt + 6, easeInOut);
  const cardW = (vertical ? 860 : 470) * u;
  const connector = (vertical ? 56 : 70) * u;

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1 - exit,
        transform: `translateY(${-exit * 80 * u}px) scale(${1 - exit * 0.08})`,
        filter: `blur(${exit * 10}px)`,
      }}
    >
      <div style={{display: 'flex', flexDirection: vertical ? 'column' : 'row', alignItems: 'center'}}>
        {COPY.how.steps.map((step, i) => {
          const p = spring({frame: frame - STEP_START[i], fps, config: {damping: 200}});
          const Icon = ICONS[step.icon];
          const lineP = i < 2 ? progress(frame, STEP_START[i] + 14, STEP_START[i + 1] + 4) : 0;
          return (
            <React.Fragment key={step.title}>
              <div
                style={{
                  width: cardW,
                  minHeight: (vertical ? 230 : 290) * u,
                  boxSizing: 'border-box',
                  padding: 30 * u,
                  borderRadius: 26 * u,
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
                  border: `${1.5 * u}px solid ${COLORS.border}`,
                  boxShadow: `0 ${30 * u}px ${80 * u}px rgba(0,0,0,0.45)`,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 50 * u}px)`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 22 * u,
                }}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: 16 * u}}>
                  <div
                    style={{
                      width: 64 * u,
                      height: 64 * u,
                      borderRadius: 18 * u,
                      background: ACCENT_GRADIENT,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 0 ${30 * u}px ${COLORS.glow}`,
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={32 * u} color="#fff" strokeWidth={2.2} />
                  </div>
                  <div>
                    <div style={{fontSize: 18 * u, fontWeight: 700, color: COLORS.textMuted, letterSpacing: '0.18em'}}>
                      STEP 0{i + 1}
                    </div>
                    <div style={{fontSize: 34 * u, fontWeight: 700, color: COLORS.text, letterSpacing: '-0.03em', lineHeight: 1.1}}>
                      {step.title}
                    </div>
                  </div>
                </div>
                <StepDetail index={i} frame={frame} u={u} />
              </div>
              {i < 2 && (
                <div
                  style={{
                    width: vertical ? 3 * u : connector,
                    height: vertical ? connector : 3 * u,
                    position: 'relative',
                    background: COLORS.border,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: vertical ? '100%' : `${lineP * 100}%`,
                      height: vertical ? `${lineP * 100}%` : '100%',
                      background: ACCENT_GRADIENT,
                      boxShadow: `0 0 ${12 * u}px ${COLORS.accentTo}`,
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const BrowserReveal: React.FC = () => {
  const frame = useCurrentFrame(); // 0 = TIMING.howBrowserAt
  const {fps} = useVideoConfig();
  const {vertical, u} = useLayout();
  const p = spring({frame, fps, config: {damping: 200, mass: 1.1}});
  const w = (vertical ? 940 : 1320) * u;
  const h = vertical ? 1300 * u : w * 0.6;

  /* ───────────── SCREEN RECORDING SLOT ─────────────
   * Drop your recording at public/demo.mp4 and it replaces the animated mock
   * below automatically. If the file is missing, the mock is shown instead.
   */
  const useDemo = hasStaticFile(DEMO.file);

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <BrowserFrame
        width={w}
        height={h}
        url={COPY.how.browserUrl}
        glow={p}
        style={{
          opacity: p,
          transform: `perspective(${2000 * u}px) translateY(${(1 - p) * 220 * u}px) rotateX(${(1 - p) * 16}deg) scale(${interpolate(p, [0, 1], [0.88, 1])})`,
        }}
      >
        {useDemo ? (
          <OffthreadVideo
            src={staticFile(DEMO.file)}
            startFrom={Math.round(DEMO.startFromSeconds * fps)}
            muted
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        ) : (
          <BuildHero
            frame={frame - 8}
            width={w}
            height={h}
            fps={fps}
            headline={COPY.how.mockHeadline}
            sub={COPY.how.mockSub}
            cta={COPY.how.mockCta}
          />
        )}
      </BrowserFrame>
    </AbsoluteFill>
  );
};

/** 14–22s: three steps with connectors, then a mock browser where a hero animates in. */
export const HowItWorks: React.FC = () => {
  const frame = useCurrentFrame();
  const {vertical, u} = useLayout();
  const label = progress(frame, 0, 14) * (1 - progress(frame, TIMING.howBrowserAt - 12, TIMING.howBrowserAt));
  return (
    <SceneWrap>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: (vertical ? 200 : 90) * u}}>
        <div
          style={{
            fontSize: 22 * u,
            fontWeight: 700,
            letterSpacing: '0.3em',
            color: COLORS.textMuted,
            opacity: label,
          }}
        >
          HOW IT WORKS
        </div>
      </AbsoluteFill>
      <Steps />
      <Sequence from={TIMING.howBrowserAt} layout="none">
        <BrowserReveal />
      </Sequence>
    </SceneWrap>
  );
};
