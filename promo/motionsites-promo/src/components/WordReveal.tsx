import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {STYLE} from '../config';

/** Staggered word-by-word spring reveal (rise + unblur). */
export const WordReveal: React.FC<{
  words: readonly string[];
  start?: number;
  stagger?: number;
  fontSize: number;
  weight?: number;
  color?: string;
  style?: React.CSSProperties;
  /** Optional per-word style override (e.g. glitch / grey-out). */
  wordStyle?: (index: number) => React.CSSProperties | undefined;
}> = ({words, start = 0, stagger = 5, fontSize, weight = 700, color = '#fff', style, wordStyle}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: fontSize * 0.26,
        rowGap: fontSize * 0.02,
        fontSize,
        fontWeight: weight,
        letterSpacing: STYLE.headlineTracking,
        lineHeight: 1.04,
        color,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const p = spring({frame: frame - start - i * stagger, fps, config: {damping: 200, mass: 0.7}});
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: p,
              transform: `translateY(${(1 - p) * fontSize * 0.45}px)`,
              filter: `blur(${(1 - p) * 10}px)`,
              ...wordStyle?.(i),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
