import 'phaser';
import Game from '../game';
import { GhostAnimations, yieldTimeout } from '../utils/animation';
import { Resources } from '../utils/resources';
import GhostSprite, { AnimationDirection } from './ghostSprite';

const SPEED = 170;
const PLAYER_DEPTH = 5;

export default class Player {
  public sprite: GhostSprite;

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private direction: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 1);
  private active = false;

  constructor(private game: Phaser.Scene, x: number, y: number) {
    this.sprite = new GhostSprite(game, x, y);
    this.cursors = game.input.keyboard.createCursorKeys();

    this.sprite.setDepth(PLAYER_DEPTH);
  }

  public update() {
    if (this.active) {
      this.move();
    }
  }

  public async activate() {
    Game.sounds.play(Resources.Teleport);
    await this.sprite.fadeIn();
    this.active = true;
  }

  public deactivate() {
    this.active = false;
    this.sprite.playAnimation(
      GhostAnimations.IdleFront,
      AnimationDirection.none
    );
    this.sprite.body.setVelocity(0, 0);
    this.sprite.hide();
  }

  public show() {
    return this.sprite.fadeIn(false);
  }

  public async fly() {
    this.sprite.stopFloating();
    this.sprite.body.setAccelerationY(-80);
    await yieldTimeout(1000);
    this.sprite.body.setAccelerationY(0);
  }

  private move() {
    this.sprite.body.setVelocity(0);

    const direction = new Phaser.Math.Vector2(0, 0);

    if (this.cursors.left.isDown) {
      direction.x = -1;
    } else if (this.cursors.right.isDown) {
      direction.x = 1;
    }
    if (this.cursors.up.isDown) {
      direction.y = -1;
    } else if (this.cursors.down.isDown) {
      direction.y = 1;
    }

    const velocity = direction.normalize().scale(SPEED);
    this.sprite.body.setVelocity(velocity.x, velocity.y);

    // Animation
    if (velocity.length() > 0) {
      this.direction = velocity;
      const animDirection =
        this.direction.x === 0
          ? AnimationDirection.none
          : this.direction.x > 0
          ? AnimationDirection.right
          : AnimationDirection.left;
      const animation =
        this.direction.x !== 0
          ? GhostAnimations.WalkSide
          : this.direction.y > 0
          ? GhostAnimations.WalkFront
          : GhostAnimations.WalkBack;
      this.sprite.playAnimation(animation, animDirection);
    } else {
      const animDirection =
        this.direction.x === 0
          ? AnimationDirection.none
          : this.direction.x > 0
          ? AnimationDirection.right
          : AnimationDirection.left;
      const animation =
        this.direction.x !== 0
          ? GhostAnimations.IdleSide
          : this.direction.y > 0
          ? GhostAnimations.IdleFront
          : GhostAnimations.IdleBack;
      this.sprite.playAnimation(animation, animDirection);
    }
  }

  public getPosition() {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  public warp(x: number, y: number) {
    this.sprite.setPosition(x, y);
  }
}
