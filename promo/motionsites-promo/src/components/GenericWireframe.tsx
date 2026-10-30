import React from 'react';
import {COLORS} from '../config';

/** A flat, grey, "every AI site looks like this" wireframe. `draw` 0→1 reveals it. */
export const GenericWireframe: React.FC<{width: number; height: number; draw?: number; style?: React.CSSProperties}> = ({
  width,
  height,
  draw = 1,
  style,
}) => {
  const k = width / 1000;
  const line = COLORS.genericLine;
  const box = (d: number): React.CSSProperties => ({
    border: `${2 * k}px solid ${line}`,
    borderRadius: 10 * k,
    opacity: Math.min(1, Math.max(0, (draw - d) * 4)),
  });
  const pill = (w: number, h: number, d: number): React.CSSProperties => ({
    width: w * k,
    height: h * k,
    borderRadius: 6 * k,
    background: line,
    opacity: Math.min(1, Math.max(0, (draw - d) * 4)),
  });

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        borderRadius: 16 * k,
        border: `${2 * k}px solid ${line}`,
        background: '#0E0E12',
        padding: 32 * k,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 28 * k,
        ...style,
      }}
    >
      {/* nav */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={pill(90, 18, 0)} />
        <div style={{display: 'flex', gap: 18 * k}}>
          <div style={pill(60, 12, 0.05)} />
          <div style={pill(60, 12, 0.08)} />
          <div style={pill(60, 12, 0.1)} />
          <div style={{...pill(100, 32, 0.12), background: 'transparent', border: `${2 * k}px solid ${line}`}} />
        </div>
      </div>
      {/* hero */}
      <div style={{display: 'flex', gap: 40 * k, flex: 1}}>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 * k}}>
          <div style={pill(380, 34, 0.2)} />
          <div style={pill(300, 34, 0.25)} />
          <div style={pill(340, 12, 0.3)} />
          <div style={pill(260, 12, 0.32)} />
          <div style={{display: 'flex', gap: 14 * k, marginTop: 12 * k}}>
            <div style={pill(140, 44, 0.38)} />
            <div style={{...pill(140, 44, 0.4), background: 'transparent', border: `${2 * k}px solid ${line}`}} />
          </div>
        </div>
        <div style={{...box(0.45), flex: 0.9, position: 'relative', overflow: 'hidden'}}>
          {/* image-placeholder X */}
          <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}} preserveAspectRatio="none" viewBox="0 0 100 100">
            <line x1="0" y1="0" x2="100" y2="100" stroke={line} strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
            <line x1="100" y1="0" x2="0" y2="100" stroke={line} strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>
      {/* feature row */}
      <div style={{display: 'flex', gap: 20 * k, height: height * 0.18}}>
        {[0.55, 0.6, 0.65].map((d) => (
          <div key={d} style={{...box(d), flex: 1}} />
        ))}
      </div>
    </div>
  );
};
