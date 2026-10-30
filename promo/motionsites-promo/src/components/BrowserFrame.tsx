import React from 'react';
import {COLORS} from '../config';

/** Stylized browser window. `k` scales chrome relative to a 1000px-wide window. */
export const BrowserFrame: React.FC<{
  width: number;
  height: number;
  url: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  glow?: number;
}> = ({width, height, url, children, style, glow = 1}) => {
  const k = width / 1000;
  const bar = 44 * k;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 18 * k,
        overflow: 'hidden',
        background: COLORS.bgElevated,
        border: `${1.5 * k}px solid rgba(255,255,255,0.12)`,
        boxShadow: `0 ${40 * k}px ${120 * k}px rgba(0,0,0,0.6), 0 0 ${140 * k * glow}px rgba(139,92,246,${0.28 * glow})`,
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      <div
        style={{
          height: bar,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 8 * k,
          padding: `0 ${18 * k}px`,
          background: 'rgba(255,255,255,0.04)',
          borderBottom: `${1 * k}px solid rgba(255,255,255,0.07)`,
        }}
      >
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <div key={c} style={{width: 12 * k, height: 12 * k, borderRadius: '50%', background: c, opacity: 0.85}} />
        ))}
        <div
          style={{
            marginLeft: 18 * k,
            flex: 1,
            maxWidth: 420 * k,
            height: 26 * k,
            borderRadius: 8 * k,
            background: 'rgba(255,255,255,0.06)',
            color: COLORS.textMuted,
            fontSize: 14 * k,
            display: 'flex',
            alignItems: 'center',
            padding: `0 ${12 * k}px`,
            fontWeight: 500,
          }}
        >
          {url}
        </div>
      </div>
      <div style={{position: 'relative', flex: 1, overflow: 'hidden'}}>{children}</div>
    </div>
  );
};
