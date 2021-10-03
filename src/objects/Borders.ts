import 'phaser';
import { Physics } from 'phaser';

const COLLISION_COOLDOWN = 1200;

export default class Borders {
  public group: Phaser.Physics.Arcade.StaticGroup;

  private colliders: Phaser.Physics.Arcade.Collider;
  private cooldown = false;

  constructor(
    game: Phaser.Scene,
    width,
    height,
    player: Phaser.GameObjects.GameObject,
    private onCollide: () => void
  ) {
    this.group = game.physics.add.staticGroup();

    this.group.add(game.add.zone(0, -height / 2, width, 4));
    this.group.add(game.add.zone(0, height / 2, width, 4));
    this.group.add(game.add.zone(-width / 2, 0, 4, height));
    this.group.add(game.add.zone(width / 2, 0, 4, height));

    this.colliders = game.physics.add.collider(this.group, player, (_o1, _o2) =>
      this.collisionCallback()
    );
  }

  public desactivate() {
    this.colliders.active = false;
    this.group.destroy();
  }

  private collisionCallback() {
    if (!this.cooldown) {
      this.cooldown = true;
      this.onCollide();
      setTimeout(() => {
        this.cooldown = false;
      }, COLLISION_COOLDOWN);
    }
  }
}
