import { Resources } from './resources';

export function yieldTimeout(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export function promisifyTween(tween: Phaser.Tweens.Tween): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (tween.hasStarted && !tween.isPlaying()) {
      resolve();
    } else {
      tween.once('complete', resolve);
      tween.once('stop', reject);
    }
  });
}

interface FrameDimensions {
  width: number;
  height: number;
}
type SpriteDimensions = {
  [key in Resources]?: FrameDimensions;
};
export const spritesDimensions: SpriteDimensions = {
  [Resources.GhostSpritesheet]: {
    width: 15,
    height: 36,
  },
  [Resources.DarkGhost]: {
    width: 15,
    height: 35,
  },
  [Resources.LargeStar]: {
    width: 17,
    height: 17,
  },
  [Resources.MediumStar]: {
    width: 9,
    height: 9,
  },
  [Resources.SmallStar]: {
    width: 5,
    height: 5,
  },
  [Resources.DotStar]: {
    width: 1,
    height: 1,
  },
};

export enum GhostAnimations {
  IdleFront = 'IdleFront',
  IdleBack = 'IdleBack',
  IdleSide = 'IdleSide',
  WalkFront = 'WalkFront',
  WalkBack = 'WalkBack',
  WalkSide = 'WalkSide',
}

const GHOST_FRAMERATE = 10;

export function setupGhostAnimations(game: Phaser.Scene) {
  game.anims.create({
    key: GhostAnimations.IdleFront,
    frames: game.anims.generateFrameNumbers(Resources.GhostSpritesheet, {
      frames: [0],
    }),
    frameRate: GHOST_FRAMERATE,
    repeat: -1,
  });
  game.anims.create({
    key: GhostAnimations.IdleBack,
    frames: game.anims.generateFrameNumbers(Resources.GhostSpritesheet, {
      frames: [4],
    }),
    frameRate: GHOST_FRAMERATE,
    repeat: -1,
  });
  game.anims.create({
    key: GhostAnimations.IdleSide,
    frames: game.anims.generateFrameNumbers(Resources.GhostSpritesheet, {
      frames: [8],
    }),
    frameRate: GHOST_FRAMERATE,
    repeat: -1,
  });
  game.anims.create({
    key: GhostAnimations.WalkFront,
    frames: game.anims.generateFrameNumbers(Resources.GhostSpritesheet, {
      frames: [0, 1, 2, 3],
    }),
    frameRate: GHOST_FRAMERATE,
    repeat: -1,
  });
  game.anims.create({
    key: GhostAnimations.WalkBack,
    frames: game.anims.generateFrameNumbers(Resources.GhostSpritesheet, {
      frames: [4, 5, 6, 7],
    }),
    frameRate: GHOST_FRAMERATE,
    repeat: -1,
  });
  game.anims.create({
    key: GhostAnimations.WalkSide,
    frames: game.anims.generateFrameNumbers(Resources.GhostSpritesheet, {
      frames: [8, 9, 10, 11],
    }),
    frameRate: GHOST_FRAMERATE,
    repeat: -1,
  });
}

export enum StarAnimations {
  largeTwinkle = 'largeTwinkle',
  mediumTwinkle = 'mediumTwinkle',
  smallTwinkle = 'smallTwinkle',
}

export function setupStarsAnimations(game: Phaser.Scene) {
  game.anims.create({
    key: StarAnimations.largeTwinkle,
    frames: Resources.LargeStar,
    frameRate: 5,
    repeat: -1,
    yoyo: true,
  });
  game.anims.create({
    key: StarAnimations.mediumTwinkle,
    frames: Resources.MediumStar,
    frameRate: 3,
    repeat: -1,
    yoyo: true,
  });
  game.anims.create({
    key: StarAnimations.smallTwinkle,
    frames: Resources.SmallStar,
    frameRate: 3,
    repeat: -1,
    yoyo: true,
  });
}
