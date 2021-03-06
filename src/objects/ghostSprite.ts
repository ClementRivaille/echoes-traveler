import {
  GhostAnimations,
  setupGhostAnimations,
  promisifyTween,
} from '../utils/animation';
import { Resources, sprites } from '../utils/resources';

export enum AnimationDirection {
  none,
  left,
  right,
}

const SCALE = 1.5;

const BODY_WIDTH = 32;
const BODY_HEIGHT = 32;
const GROUND_HEIGHT = BODY_HEIGHT / 2 + 16;

export default class GhostSprite {
  private sprite: Phaser.GameObjects.Sprite;
  private shadow: Phaser.GameObjects.Sprite;

  public object: Phaser.GameObjects.Container;
  public body: Phaser.Physics.Arcade.Body;

  private floating: Phaser.Tweens.Tween;

  constructor(private game: Phaser.Scene, x: number, y: number) {
    setupGhostAnimations(game);

    this.sprite = game.add.sprite(
      0,
      -GROUND_HEIGHT,
      GhostAnimations.IdleFront,
      0
    );
    this.sprite.play(GhostAnimations.IdleFront);
    this.sprite.scale = SCALE;
    this.floating = game.tweens.add({
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

  async fadeIn(shadow = true): Promise<void> {
    const tweenConfig = {
      duration: 500,
      ease: 'Sine.easeOut',
    };
    const tween = this.game.tweens.add({
      ...tweenConfig,
      targets: [this.sprite],
      alpha: 1,
    });
    if (shadow) {
      this.game.tweens.add({
        ...tweenConfig,
        targets: [this.shadow],
        alpha: 0.5,
      });
    }
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

  public hide() {
    this.sprite.setAlpha(0);
    this.shadow.setAlpha(0);
  }

  public stopFloating() {
    this.floating.stop();
  }

  public get x() {
    return this.object.x;
  }
  public get y() {
    return this.object.y;
  }
}
