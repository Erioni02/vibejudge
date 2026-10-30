import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {STYLE, TIMING} from '../config';
import {clamp, easeInOut, INTER} from '../lib';

/**
 * Wraps every scene: fade in/out at the edges + a slow camera push-in.
 * Set `fadeOut={false}` on the last scene so the CTA holds to the end.
 */
export const SceneWrap: React.FC<{children: React.ReactNode; fadeIn?: boolean; fadeOut?: boolean}> = ({
  children,
  fadeIn = true,
  fadeOut = true,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const f = TIMING.fade;

  const inO = fadeIn ? interpolate(frame, [0, f], [0, 1], clamp) : 1;
  const outO = fadeOut ? interpolate(frame, [durationInFrames - f, durationInFrames], [1, 0], clamp) : 1;
  const scale = interpolate(frame, [0, durationInFrames], [1, STYLE.pushIn], {...clamp, easing: easeInOut});
  const blur = fadeOut ? interpolate(frame, [durationInFrames - f, durationInFrames], [0, 8], clamp) : 0;

  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(inO, outO),
        transform: `scale(${scale})`,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        fontFamily: INTER,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
