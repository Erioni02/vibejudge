import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {TRANSITION} from './timeline';

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1); // the site's own "out" curve
export const EASE_IO = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

/** Clamped, eased interpolate: map(frame, [a, b], [from, to]). */
export const map = (f: number, [a, b]: [number, number], [x, y]: [number, number] = [0, 1], easing = EASE_OUT) =>
  interpolate(f, [a, b], [x, y], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

/** Damped overshoot 0→1 (for pops), driven by frames since `at`. */
export const pop = (f: number, at: number, len = 18) => {
  const t = Math.min(Math.max((f - at) / len, 0), 1);
  if (t <= 0) return 0;
  return 1 - Math.exp(-6 * t) * Math.cos(t * Math.PI * 2.2) * (1 - t * 0.2);
};

export const useLayout = () => {
  const {width, height} = useVideoConfig();
  return {portrait: height > width, W: width, H: height};
};

/* ───────── scene frame context ───────── */

const SceneCtx = createContext({from: 0, dur: 0});

/** Inside a scene: absolute frame, frame since scene start, and enter/exit progress. */
export const useScene = () => {
  const {from, dur} = useContext(SceneCtx);
  const abs = useCurrentFrame() + from - TRANSITION;
  return {
    abs,
    t: abs - from,
    dur,
    from,
    end: from + dur,
    enter: map(abs, [from - TRANSITION, from + TRANSITION]),
    exit: map(abs, [from + dur - TRANSITION, from + dur + TRANSITION], [0, 1], EASE_IN),
  };
};

export type Exit = 'dissolve' | 'zoom' | 'none';

/** Wraps a scene: cross-dissolve with blur in, a slow camera push, and a dissolve or zoom-through out. */
export const SceneShell: React.FC<{
  from: number;
  dur: number;
  enter?: Exit;
  exit?: Exit;
  push?: number;
  origin?: string;
  children: React.ReactNode;
}> = ({from, dur, enter = 'dissolve', exit = 'dissolve', push = 0.035, origin = '50% 50%', children}) => (
  <SceneCtx.Provider value={{from, dur}}>
    <Shell enterKind={enter} exitKind={exit} push={push} origin={origin}>
      {children}
    </Shell>
  </SceneCtx.Provider>
);

const Shell: React.FC<{enterKind: Exit; exitKind: Exit; push: number; origin: string; children: React.ReactNode}> = ({
  enterKind,
  exitKind,
  push,
  origin,
  children,
}) => {
  const {t, dur, enter, exit} = useScene();
  const camera = 1 + push * map(t, [0, dur], [0, 1], Easing.linear);

  let scale = camera;
  let opacity = 1;
  let blur = 0;
  if (enterKind === 'dissolve') {
    opacity *= enter;
    blur += (1 - enter) * 18;
    scale *= 1.05 - 0.05 * enter;
  } else if (enterKind === 'zoom') {
    opacity *= enter;
    blur += (1 - enter) * 24;
    scale *= 0.7 + 0.3 * enter;
  }
  if (exitKind === 'dissolve') {
    opacity *= 1 - exit;
    blur += exit * 18;
    scale *= 1 - 0.04 * exit;
  } else if (exitKind === 'zoom') {
    opacity *= 1 - map(exit, [0.25, 1], [0, 1], Easing.linear);
    blur += exit * 30;
    scale *= 1 + 1.6 * exit * exit;
  }

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: origin,
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
