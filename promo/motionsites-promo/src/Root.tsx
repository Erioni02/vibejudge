import React from 'react';
import {Composition} from 'remotion';
import {VIDEO} from './config';
import {Promo} from './Promo';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Promo16x9"
      component={Promo}
      durationInFrames={VIDEO.durationInFrames}
      fps={VIDEO.fps}
      width={VIDEO.landscape.width}
      height={VIDEO.landscape.height}
    />
    <Composition
      id="Promo9x16"
      component={Promo}
      durationInFrames={VIDEO.durationInFrames}
      fps={VIDEO.fps}
      width={VIDEO.portrait.width}
      height={VIDEO.portrait.height}
    />
  </>
);
