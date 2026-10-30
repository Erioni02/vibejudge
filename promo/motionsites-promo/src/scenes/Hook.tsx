import React from 'react';
import {AbsoluteFill, interpolate, interpolateColors, random, useCurrentFrame} from 'remotion';
import {COLORS, COPY} from '../config';
import {GenericWireframe} from '../components/GenericWireframe';
import {SceneWrap} from '../components/SceneWrap';
import {WordReveal} from '../components/WordReveal';
import {progress, useLayout} from '../lib';

const STAGGER = 6;
const GLITCH_START = 50;
const GLITCH_END = 62;

/** 0–3s: "Most AI-built websites look the same." — last words glitch into flat grey. */
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {vertical, u, width} = useLayout();
  const {words, glitchLastWords} = COPY.hook;
  const firstGlitched = words.length - glitchLastWords;

  const grey = progress(frame, GLITCH_START + 4, GLITCH_END + 4);
  const glitching = frame >= GLITCH_START && frame < GLITCH_END;
  const wire = progress(frame, GLITCH_START, 86);

  const wireW = (vertical ? 920 : 1300) * u;
  const wireH = wireW * (vertical ? 1.25 : 0.56);

  return (
    <SceneWrap>
      {/* flat generic wireframe that appears behind the text */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <GenericWireframe
          width={wireW}
          height={wireH}
          draw={wire}
          style={{
            opacity: interpolate(wire, [0, 1], [0, 0.55]),
            transform: `scale(${interpolate(wire, [0, 1], [1.06, 1])})`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: `0 ${vertical ? 80 * u : width * 0.1}px`,
        }}
      >
        <WordReveal
          words={words}
          start={4}
          stagger={STAGGER}
          fontSize={(vertical ? 112 : 108) * u}
          weight={800}
          style={{maxWidth: vertical ? 900 * u : 1500 * u, textShadow: `0 0 ${40 * u}px rgba(0,0,0,0.8)`}}
          wordStyle={(i) => {
            if (i < firstGlitched) return undefined;
            const jx = glitching ? (random(`gx${frame}-${i}`) - 0.5) * 26 * u : 0;
            const jy = glitching ? (random(`gy${frame}-${i}`) - 0.5) * 8 * u : 0;
            const split = glitching ? 6 * u : 0;
            return {
              color: interpolateColors(grey, [0, 1], [COLORS.text, COLORS.generic]),
              fontWeight: grey > 0.5 ? 500 : 800,
              translate: `${jx}px ${jy}px`,
              textShadow: split
                ? `${split}px 0 rgba(34,211,238,0.85), ${-split}px 0 rgba(139,92,246,0.85)`
                : undefined,
              clipPath: glitching && random(`gc${frame}-${i}`) > 0.6 ? `inset(${random(`gi${frame}`) * 40}% 0 ${random(`gj${frame}`) * 30}% 0)` : undefined,
            };
          }}
        />
      </AbsoluteFill>
    </SceneWrap>
  );
};
