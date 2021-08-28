import 'phaser';
import { Resources } from '../utils/resources';

const SPEED = 200;

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

    if (this.cursors.left.isDown) {
      this.sprite.setVelocityX(-SPEED);
    } else if (this.cursors.right.isDown) {
      this.sprite.setVelocityX(SPEED);
    }

    if (this.cursors.up.isDown) {
      this.sprite.setVelocityY(-SPEED);
    } else if (this.cursors.down.isDown) {
      this.sprite.setVelocityY(SPEED);
    }
  }

  public getPosition() {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  public warp(x: number, y: number) {
    this.sprite.setPosition(x, y);
  }
}
