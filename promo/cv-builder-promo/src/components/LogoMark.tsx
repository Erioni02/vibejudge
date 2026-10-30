import React from 'react';
import {C, display} from '../theme';
import {map} from '../lib';

/**
 * The VibeJudge mark (public/cv.png) redrawn as strokes so it can draw itself on.
 * `draw` 0→1 traces the outlines; the "CV" letters fade in at the end.
 */
export const LogoMark: React.FC<{size: number; draw?: number; color?: string; accent?: string}> = ({
  size,
  draw = 1,
  color = C.paper,
  accent = C.ember,
}) => {
  const stroke = {fill: 'none', stroke: color, strokeWidth: 24, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  const part = (i: number, n: number) => {
    const p = map(draw, [(i / n) * 0.7, (i / n) * 0.7 + 0.45]);
    return {pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p};
  };
  const lines = [
    [205, 410],
    [248, 410],
    [297, 345],
    [342, 410],
    [387, 410],
    [435, 345],
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 512 512">
      <path d="M440 120 V40 a28 28 0 0 0 -28 -28 H100 a28 28 0 0 0 -28 28 V472 a28 28 0 0 0 28 28 H412 a28 28 0 0 0 28 -28 V150" {...stroke} {...part(0, 10)} />
      <line x1="232" y1="14" x2="232" y2="498" {...stroke} {...part(1, 10)} />
      <circle cx="150" cy="128" r="56" {...stroke} {...part(2, 10)} />
      <circle cx="150" cy="114" r="18" {...stroke} strokeWidth={20} {...part(3, 10)} />
      <path d="M116 170 a36 30 0 0 1 68 0" {...stroke} strokeWidth={20} {...part(3, 10)} />
      <rect x="104" y="232" width="92" height="46" rx="22" {...stroke} {...part(4, 10)} />
      <rect x="104" y="318" width="92" height="46" rx="22" {...stroke} {...part(5, 10)} />
      <rect x="104" y="404" width="92" height="46" rx="22" {...stroke} {...part(6, 10)} />
      {lines.map(([y, x2], i) => (
        <line key={i} x1="268" y1={y} x2={x2} y2={y} {...stroke} strokeWidth={20} {...part(7 + i * 0.4, 10)} />
      ))}
      <text
        x="340"
        y="148"
        textAnchor="middle"
        fontFamily={display}
        fontWeight={700}
        fontSize="104"
        letterSpacing="6"
        fill={accent}
        opacity={map(draw, [0.65, 1])}
      >
        CV
      </text>
    </svg>
  );
};
