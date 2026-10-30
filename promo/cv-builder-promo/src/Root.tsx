import React from 'react';
import {Composition} from 'remotion';
import {Promo} from './Promo';
import {DURATION, FPS} from './timeline';

// Authored at 1080p; render with --scale=1.333 for 2560×1440 (text and vectors stay razor sharp).
export const Root: React.FC = () => (
  <>
    <Composition id="CvBuilder16x9" component={Promo} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} />
    <Composition id="CvBuilder9x16" component={Promo} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
  </>
);
