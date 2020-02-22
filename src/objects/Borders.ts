import 'phaser';

export default class Borders {
  public group: Phaser.Physics.Arcade.StaticGroup;
  constructor(game: Phaser.Scene, width, height) {
    this.group = game.physics.add.staticGroup();

    this.group.add(game.add.zone(0, -height / 2, width, 4));
    this.group.add(game.add.zone(0, height / 2, width, 4));
    this.group.add(game.add.zone(-width / 2, 0, 4, height));
    this.group.add(game.add.zone(width / 2, 0, 4, height));
  }

  public desactivate() {
    this.group.destroy();
  }
}
