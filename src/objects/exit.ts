import 'phaser';
import CollisionManager from './collisionManager';
import { Resources } from '../utils/resources';

export default class Exit {
  private sprite: Phaser.Physics.Arcade.Sprite;
  private zone: Phaser.GameObjects.Zone;
  constructor(
    private game: Phaser.Scene,
    x: number,
    y: number,
    private collisionManager: CollisionManager
  ) {
    this.sprite = game.physics.add.staticSprite(x, y, Resources.ExitClosed);
    this.zone = game.add.zone(x, y, this.sprite.width, this.sprite.height);
  }

  public open(onEnter: () => void) {
    this.sprite.setTexture(Resources.ExitOpen);
    this.collisionManager.addOverlap(
      this.zone,
      () => onEnter(),
      () => null
    );
  }
}
