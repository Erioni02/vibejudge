import {loadFont} from '@remotion/google-fonts/Inter';
import {Easing, getStaticFiles, interpolate, useVideoConfig} from 'remotion';

export const {fontFamily: INTER} = loadFont('normal', {
  weights: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
});

/** Layout info shared by both aspect ratios. `u` = 1 at 1080px short side. */
export const useLayout = () => {
  const {width, height} = useVideoConfig();
  const vertical = height > width;
  const u = Math.min(width, height) / 1080;
  return {width, height, vertical, u};
};

/** True if a file exists in /public — lets every media slot be optional. */
export const hasStaticFile = (name: string): boolean =>
  getStaticFiles().some((f) => f.name === name);

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** Eased 0→1 progress between two frames. */
export const progress = (frame: number, start: number, end: number, easing = easeOut) =>
  interpolate(frame, [start, end], [0, 1], {...clamp, easing});

/** Seamless loop: sine with an integer number of cycles over `period` frames. */
export const loopSin = (frame: number, period: number, cycles = 1, phase = 0) =>
  Math.sin(((frame / period) * cycles + phase) * Math.PI * 2);
export const loopCos = (frame: number, period: number, cycles = 1, phase = 0) =>
  Math.cos(((frame / period) * cycles + phase) * Math.PI * 2);
