'use client';

import { Player } from '@remotion/player';
import { Demo, DEMO_DURATION, FPS, HEIGHT, WIDTH } from '@/remotion/Demo';

export function DemoPlayer() {
  return (
    <div className="demo-player">
      <Player
        component={Demo}
        durationInFrames={DEMO_DURATION}
        fps={FPS}
        compositionWidth={WIDTH}
        compositionHeight={HEIGHT}
        style={{ width: '100%', aspectRatio: `${WIDTH} / ${HEIGHT}` }}
        controls
        autoPlay
        loop
      />
    </div>
  );
}
