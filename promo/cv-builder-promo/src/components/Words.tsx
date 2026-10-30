import React from 'react';
import {C, display, serif} from '../theme';
import {map} from '../lib';

export type Seg = {text: string; serif?: boolean; color?: string; br?: boolean};

/**
 * Masked word-by-word reveal: each word rises out of its own clip box while
 * de-blurring. `out` (optional) lifts the whole line away again.
 */
export const Words: React.FC<{
  segs: Seg[];
  f: number;
  at: number;
  stagger?: number;
  size: number;
  weight?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
  lineHeight?: number;
  tracking?: string;
  serifScale?: number;
  out?: number;
  style?: React.CSSProperties;
}> = ({
  segs,
  f,
  at,
  stagger = 3,
  size,
  weight = 600,
  color = C.paper,
  align = 'left',
  lineHeight = 1.04,
  tracking = '-0.035em',
  serifScale = 1.12,
  out,
  style,
}) => {
  let i = 0;
  const lifted = out === undefined ? 0 : map(f, [out, out + 16]);
  return (
    <div
      style={{
        fontFamily: display,
        fontSize: size,
        fontWeight: weight,
        color,
        lineHeight,
        letterSpacing: tracking,
        textAlign: align,
        opacity: 1 - lifted,
        transform: `translateY(${-40 * lifted}px)`,
        filter: lifted > 0.01 ? `blur(${lifted * 14}px)` : undefined,
        ...style,
      }}
    >
      {segs.map((seg, s) => (
        <React.Fragment key={s}>
          {seg.text.split(' ').map((word, w) => {
            const start = at + i++ * stagger;
            const p = map(f, [start, start + 22]);
            return (
              <span
                key={w}
                style={{
                  display: 'inline-block',
                  overflow: 'hidden',
                  verticalAlign: 'bottom',
                  padding: '0.06em 0.09em 0.14em',
                  margin: '-0.06em -0.09em -0.14em',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    transform: `translateY(${(1 - p) * 105}%) rotate(${(1 - p) * 4}deg)`,
                    filter: p < 0.99 ? `blur(${(1 - p) * 10}px)` : undefined,
                    opacity: map(p, [0, 0.4]),
                    fontFamily: seg.serif ? serif : undefined,
                    fontStyle: seg.serif ? 'italic' : undefined,
                    fontWeight: seg.serif ? 400 : undefined,
                    fontSize: seg.serif ? `${serifScale}em` : undefined,
                    letterSpacing: seg.serif ? '-0.01em' : undefined,
                    color: seg.color,
                  }}
                >
                  {word}
                </span>
                {' '}
              </span>
            );
          })}
          {seg.br ? <br /> : null}
        </React.Fragment>
      ))}
    </div>
  );
};
