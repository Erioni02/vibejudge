import React from 'react';
import {Audio, interpolate, Sequence, staticFile} from 'remotion';
import {AUDIO, VIDEO, VOICEOVER} from '../config';
import {clamp, hasStaticFile} from '../lib';

/**
 * Music, SFX and voiceover. Every file is optional: anything missing from
 * /public is skipped, so the video still renders without audio assets.
 */
export const AudioLayer: React.FC = () => {
  const {music, sfx} = AUDIO;
  const total = VIDEO.durationInFrames;

  const voiceLines = VOICEOVER.lines
    .map((l) => ({...l, file: `voiceover/${l.id}.${VOICEOVER.tts.format}`}))
    .filter((l) => hasStaticFile(l.file));
  const musicVol = voiceLines.length > 0 ? music.volumeUnderVoice : music.volume;

  return (
    <>
      {hasStaticFile(music.file) && (
        <Audio
          src={staticFile(music.file)}
          volume={(f) =>
            interpolate(f, [0, music.fadeInFrames, total - music.fadeOutFrames, total], [0, musicVol, musicVol, 0], clamp)
          }
        />
      )}

      {sfx.cues
        .filter((c) => hasStaticFile(c.file))
        .map((c, i) => (
          <Sequence key={`sfx-${i}`} from={c.frame} layout="none">
            <Audio src={staticFile(c.file)} volume={sfx.volume} />
          </Sequence>
        ))}

      {voiceLines.map((l) => (
        <Sequence key={l.id} from={l.from} layout="none">
          <Audio src={staticFile(l.file)} volume={VOICEOVER.volume} />
        </Sequence>
      ))}
    </>
  );
};
