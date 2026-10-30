import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, COPY, STYLE} from '../config';
import {GenericWireframe} from '../components/GenericWireframe';
import {SceneWrap} from '../components/SceneWrap';
import {progress, useLayout} from '../lib';

const DIM_AT = 64;

/** 3–8s: a generic template card appears, then dims. "Generic prompts. Generic design." */
export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {vertical, u} = useLayout();

  const enter = spring({frame: frame - 2, fps, config: {damping: 200}});
  const dim = progress(frame, DIM_AT, DIM_AT + 30);
  const cardW = (vertical ? 860 : 900) * u;
  const cardH = cardW * 0.62;

  const lineStyle = (i: number): React.CSSProperties => {
    const p = spring({frame: frame - 26 - i * 14, fps, config: {damping: 200}});
    return {
      opacity: p,
      transform: `translateY(${(1 - p) * 40 * u}px)`,
      filter: `blur(${(1 - p) * 8}px)`,
    };
  };

  return (
    <SceneWrap>
      <AbsoluteFill
        style={{
          flexDirection: vertical ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: (vertical ? 110 : 120) * u,
        }}
      >
        <div
          style={{
            opacity: enter * interpolate(dim, [0, 1], [1, 0.32]),
            transform: `perspective(${1600 * u}px) rotateY(${vertical ? 0 : interpolate(enter, [0, 1], [-18, -8])}deg) translateY(${(1 - enter) * 60 * u}px) scale(${interpolate(dim, [0, 1], [1, 0.94])})`,
            filter: `grayscale(1) blur(${dim * 2}px)`,
          }}
        >
          <GenericWireframe width={cardW} height={cardH} draw={progress(frame, 0, 40)} />
          <div
            style={{
              marginTop: 18 * u,
              textAlign: 'center',
              color: COLORS.generic,
              fontSize: 22 * u,
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              opacity: progress(frame, 20, 40),
            }}
          >
            template_v1_final.html
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: vertical ? 'center' : 'flex-start',
            textAlign: vertical ? 'center' : 'left',
          }}
        >
          {COPY.problem.lines.map((line, i) => (
            <div
              key={line}
              style={{
                fontSize: (vertical ? 104 : 92) * u,
                fontWeight: 800,
                letterSpacing: STYLE.headlineTracking,
                lineHeight: 1.06,
                color: i === 0 ? COLORS.text : COLORS.textMuted,
                ...lineStyle(i),
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};
