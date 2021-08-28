import 'phaser';
import { Resources } from '../utils/resources';

const SPEED = 170;

export default class Player {
  public sprite: Phaser.Physics.Arcade.Sprite;

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  constructor(private game: Phaser.Scene, x: number, y: number) {
    this.sprite = game.physics.add.sprite(x, y, Resources.Player);
    this.cursors = game.input.keyboard.createCursorKeys();
  }

  public update() {
    this.move();
  }

  private move() {
    this.sprite.setVelocity(0);

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
    this.sprite.setVelocity(velocity.x, velocity.y);
  }

  public getPosition() {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  public warp(x: number, y: number) {
    this.sprite.setPosition(x, y);
  }
}
