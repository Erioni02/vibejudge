import React from 'react';
import {AbsoluteFill, Audio, Sequence, getStaticFiles, staticFile} from 'remotion';
import {Backdrop, Bokeh, Finish, LightLeaks} from './components/Stage';
import {Exit, SceneShell} from './lib';
import {SceneId, TL, TRANSITION} from './timeline';
import {Blank} from './scenes/Blank';
import {NoCv} from './scenes/NoCv';
import {Meet} from './scenes/Meet';
import {Questions} from './scenes/Questions';
import {Build} from './scenes/Build';
import {Honest} from './scenes/Honest';
import {Roast} from './scenes/Roast';
import {Cta} from './scenes/Cta';

const SCENES: {id: SceneId; C: React.FC; enter?: Exit; exit?: Exit; origin?: string}[] = [
  {id: 'blank', C: Blank},
  {id: 'nocv', C: NoCv, exit: 'zoom', origin: '62% 66%'},
  {id: 'meet', C: Meet, enter: 'zoom', exit: 'zoom'},
  {id: 'questions', C: Questions, enter: 'zoom'},
  {id: 'build', C: Build},
  {id: 'honest', C: Honest},
  {id: 'roast', C: Roast},
  {id: 'cta', C: Cta, enter: 'none', exit: 'none'},
];

const has = (name: string) => getStaticFiles().some((f) => f.name === name);

export const Promo: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#0b0907'}}>
    <Backdrop />
    <Bokeh />
    {SCENES.map(({id, C, enter, exit, origin}) => {
      const s = TL.scenes[id];
      return (
        <Sequence key={id} from={s.from - TRANSITION} durationInFrames={s.dur + TRANSITION * 2} name={id}>
          <SceneShell from={s.from} dur={s.dur} enter={id === 'blank' ? 'dissolve' : enter} exit={exit} origin={origin}>
            <C />
          </SceneShell>
        </Sequence>
      );
    })}
    <LightLeaks />
    <Finish />

    {/* scripts/score.py mixes VO + music + SFX into one mastered track; fall back to bare VO without it */}
    {has('audio/master.wav') ? (
      <Audio src={staticFile('audio/master.wav')} />
    ) : (
      Object.entries(TL.cues).map(([id, c]) => (
        <Sequence key={id} from={c.from} durationInFrames={c.dur + 15} name={`vo ${id}`}>
          <Audio src={staticFile(`vo/${id}.wav`)} />
        </Sequence>
      ))
    )}
  </AbsoluteFill>
);
