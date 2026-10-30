import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {TIMING} from './config';
import {AudioLayer} from './components/AudioLayer';
import {Background, Finish} from './components/Background';
import {CTA} from './scenes/CTA';
import {Hook} from './scenes/Hook';
import {HowItWorks} from './scenes/HowItWorks';
import {Problem} from './scenes/Problem';
import {Proof} from './scenes/Proof';
import {Reveal} from './scenes/Reveal';

/** Scene order — reorder this array to re-cut the video. Durations live in config.ts. */
const SCENES = [
  {id: 'hook', C: Hook, duration: TIMING.hook},
  {id: 'problem', C: Problem, duration: TIMING.problem},
  {id: 'reveal', C: Reveal, duration: TIMING.reveal},
  {id: 'how', C: HowItWorks, duration: TIMING.how},
  {id: 'proof', C: Proof, duration: TIMING.proof},
  {id: 'cta', C: CTA, duration: TIMING.cta},
];

/** Shared by both compositions; every scene adapts to the aspect ratio via useLayout(). */
export const Promo: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Series>
      {SCENES.map(({id, C, duration}) => (
        <Series.Sequence key={id} durationInFrames={duration} name={id}>
          <C />
        </Series.Sequence>
      ))}
    </Series>
    <Finish />
    <AudioLayer />
  </AbsoluteFill>
);
