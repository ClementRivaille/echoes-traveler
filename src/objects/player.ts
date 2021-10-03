import 'phaser';
import { Resources } from '../utils/resources';
import GhostSprite, {
  AnimationDirection,
  GhostAnimations,
} from './ghostSprite';

const SPEED = 170;

export default class Player {
  public sprite: GhostSprite;

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private direction: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 1);

  constructor(private game: Phaser.Scene, x: number, y: number) {
    this.sprite = new GhostSprite(game, x, y);
    this.cursors = game.input.keyboard.createCursorKeys();
  }

  public update() {
    this.move();
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
