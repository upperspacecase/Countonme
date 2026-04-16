import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Intro } from './scenes/Intro';
import { CheckIn } from './scenes/CheckIn';
import { Week } from './scenes/Week';
import { Friends } from './scenes/Friends';
import { Encourage } from './scenes/Encourage';
import { Outro } from './scenes/Outro';

export const FPS = 30;
export const WIDTH = 1280;
export const HEIGHT = 720;

// Scene lengths (frames)
export const SCENE = {
  intro: 90, // 3s
  checkIn: 180, // 6s
  week: 180, // 6s
  friends: 150, // 5s
  encourage: 180, // 6s
  outro: 120, // 4s
};

export const DEMO_DURATION =
  SCENE.intro + SCENE.checkIn + SCENE.week + SCENE.friends + SCENE.encourage + SCENE.outro;

const from = {
  intro: 0,
  checkIn: SCENE.intro,
  week: SCENE.intro + SCENE.checkIn,
  friends: SCENE.intro + SCENE.checkIn + SCENE.week,
  encourage: SCENE.intro + SCENE.checkIn + SCENE.week + SCENE.friends,
  outro: SCENE.intro + SCENE.checkIn + SCENE.week + SCENE.friends + SCENE.encourage,
};

export const Demo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#F4ECD8',
        fontFamily:
          "'Playfair Display', Georgia, 'Times New Roman', serif",
        color: '#1b1b1b',
      }}
    >
      <Sequence from={from.intro} durationInFrames={SCENE.intro} name="Intro">
        <Intro />
      </Sequence>
      <Sequence from={from.checkIn} durationInFrames={SCENE.checkIn} name="CheckIn">
        <CheckIn />
      </Sequence>
      <Sequence from={from.week} durationInFrames={SCENE.week} name="Week">
        <Week />
      </Sequence>
      <Sequence from={from.friends} durationInFrames={SCENE.friends} name="Friends">
        <Friends />
      </Sequence>
      <Sequence from={from.encourage} durationInFrames={SCENE.encourage} name="Encourage">
        <Encourage />
      </Sequence>
      <Sequence from={from.outro} durationInFrames={SCENE.outro} name="Outro">
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
