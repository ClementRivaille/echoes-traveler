import { promisifyTween } from '../utils/animation';
import { Resources } from '../utils/resources';

export enum GhostAnimations {
  IdleFront = 'IdleFront',
  IdleBack = 'IdleBack',
  IdleSide = 'IdleSide',
  WalkFront = 'WalkFront',
  WalkBack = 'WalkBack',
  WalkSide = 'WalkSide',
}

export enum AnimationDirection {
  none,
  left,
  right,
}

const FRAMERATE = 10;

export const FRAME_WIDTH = 15;
export const FRAME_HEIGHT = 36;
const SCALE = 1.5;

const BODY_WIDTH = 32;
const BODY_HEIGHT = 32;
const GROUND_HEIGHT = BODY_HEIGHT / 2 + 16;

export default class GhostSprite {
  private sprite: Phaser.GameObjects.Sprite;
  private shadow: Phaser.GameObjects.Sprite;

  public object: Phaser.GameObjects.Container;
  public body: Phaser.Physics.Arcade.Body;

  constructor(private game: Phaser.Scene, x: number, y: number) {
    this.initAnimations(game);

    this.sprite = game.add.sprite(
      0,
      -GROUND_HEIGHT,
      GhostAnimations.IdleFront,
      0
    );
    this.sprite.play(GhostAnimations.IdleFront);
    this.sprite.scale = SCALE;
    game.tweens.add({
      targets: [this.sprite],
      y: -GROUND_HEIGHT - 10,
      yoyo: true,
      ease: 'Sine.easeInOut',
      duration: 1000,
      loop: -1,
    });

    this.shadow = game.add.sprite(0, 0, Resources.Shadow);
    this.shadow.scale = SCALE;

    this.sprite.alpha = 0;
    this.shadow.alpha = 0;

    this.object = game.add.container(x, y, [this.shadow, this.sprite]);
    this.object.setSize(BODY_WIDTH, BODY_HEIGHT);
    game.physics.world.enable(this.object);
    this.body = this.object.body as Phaser.Physics.Arcade.Body;
    this.body.setOffset(0, -BODY_HEIGHT);
  }

  playAnimation(animation: GhostAnimations, direction: AnimationDirection) {
    const flip = direction === AnimationDirection.right;
    const currentAnim = this.sprite.anims.currentAnim.key as GhostAnimations;

    if (currentAnim !== animation || this.sprite.flipX !== flip) {
      this.sprite.play(animation);
      this.sprite.flipX = flip;
    }
  }

  setPosition(x: number, y: number) {
    this.object.setPosition(x, y);
  }

  setDepth(value: number) {
    this.object.setDepth(value);
  }

  async fadeIn(): Promise<void> {
    const tweenConfig = {
      duration: 500,
      ease: 'Sine.easeOut',
    };
    const tween = this.game.tweens.add({
      ...tweenConfig,
      targets: [this.sprite],
      alpha: 1,
    });
    this.game.tweens.add({
      ...tweenConfig,
      targets: [this.shadow],
      alpha: 0.5,
    });
    const vibration = this.game.tweens.add({
      duration: 30,
      targets: [this.sprite, this.shadow],
      x: -2,
      yoyo: true,
      loop: -1,
    });

    // End animation
    await promisifyTween(tween);
    vibration.stop();
    this.sprite.setX(0);
    this.shadow.setX(0);
  }

  public get x() {
    return this.object.x;
  }
  public get y() {
    return this.object.y;
  }

  private initAnimations(game: Phaser.Scene) {
    game.anims.create({
      key: GhostAnimations.IdleFront,
      frames: game.anims.generateFrameNumbers(Resources.GhostSpritesheet, {
        frames: [0],
      }),
      frameRate: FRAMERATE,
      repeat: -1,
    });
    game.anims.create({
      key: GhostAnimations.IdleBack,
      frames: game.anims.generateFrameNumbers(Resources.GhostSpritesheet, {
        frames: [4],
      }),
      frameRate: FRAMERATE,
      repeat: -1,
    });
    game.anims.create({
      key: GhostAnimations.IdleSide,
      frames: game.anims.generateFrameNumbers(Resources.GhostSpritesheet, {
        frames: [8],
      }),
      frameRate: FRAMERATE,
      repeat: -1,
    });
    game.anims.create({
      key: GhostAnimations.WalkFront,
      frames: game.anims.generateFrameNumbers(Resources.GhostSpritesheet, {
        frames: [0, 1, 2, 3],
      }),
      frameRate: FRAMERATE,
      repeat: -1,
    });
    game.anims.create({
      key: GhostAnimations.WalkBack,
      frames: game.anims.generateFrameNumbers(Resources.GhostSpritesheet, {
        frames: [4, 5, 6, 7],
      }),
      frameRate: FRAMERATE,
      repeat: -1,
    });
    game.anims.create({
      key: GhostAnimations.WalkSide,
      frames: game.anims.generateFrameNumbers(Resources.GhostSpritesheet, {
        frames: [8, 9, 10, 11],
      }),
      frameRate: FRAMERATE,
      repeat: -1,
    });
  }
}
