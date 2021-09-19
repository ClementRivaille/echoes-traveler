import 'phaser';
import pathsConfig from '../utils/pathsConfig';
import { Resources } from '../utils/resources';
import { TILE_SIZE } from './tile';

export default class Walls {
  public group: Phaser.Physics.Arcade.StaticGroup;
  constructor(game: Phaser.Scene) {
    const wallPositions: Array<{ x: number; y: number }> = [
      { x: pathsConfig[0].x, y: pathsConfig[0].y - TILE_SIZE },
      { x: pathsConfig[0].x - TILE_SIZE, y: pathsConfig[0].y - TILE_SIZE },
      { x: pathsConfig[0].x + TILE_SIZE, y: pathsConfig[0].y - TILE_SIZE },
      { x: pathsConfig[0].x - TILE_SIZE, y: pathsConfig[0].y },
      { x: pathsConfig[0].x + TILE_SIZE, y: pathsConfig[0].y },
      { x: pathsConfig[0].x - TILE_SIZE, y: pathsConfig[0].y + TILE_SIZE },
      { x: pathsConfig[0].x + TILE_SIZE * 2, y: pathsConfig[0].y },
      { x: pathsConfig[0].x, y: pathsConfig[0].y + TILE_SIZE * 2 },
      { x: pathsConfig[0].x + TILE_SIZE, y: pathsConfig[0].y + TILE_SIZE * 2 },
      {
        x: pathsConfig[0].x + TILE_SIZE * 2,
        y: pathsConfig[0].y + TILE_SIZE * 2,
      },
      {
        x: pathsConfig[0].x + TILE_SIZE * 3,
        y: pathsConfig[0].y + TILE_SIZE * 2,
      },
      { x: pathsConfig[0].x + TILE_SIZE * 4, y: pathsConfig[0].y + TILE_SIZE },
    ];

    this.group = game.physics.add.staticGroup();
    for (const wallPos of wallPositions) {
      const wall = this.group.create(wallPos.x, wallPos.y, Resources.Wall);
      (wall as Phaser.Physics.Arcade.Sprite).body.setSize(TILE_SIZE, TILE_SIZE);
      (wall as Phaser.Physics.Arcade.Sprite).scale =
        TILE_SIZE / (wall as Phaser.Physics.Arcade.Sprite).width;
    }
  }
}
