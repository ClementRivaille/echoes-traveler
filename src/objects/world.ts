import { UNIT } from './area';
import Player from './player';

export const WORLD_RADIUS = (9 * UNIT) / 2;

export default class World {
  constructor(private player: Player) {}

  update() {
    const playerPosition = this.player.getPosition();

    if (Math.abs(playerPosition.x) > WORLD_RADIUS) {
      this.player.warp(
        World.getOppositePosition(playerPosition.x),
        playerPosition.y
      );
    }
    if (Math.abs(playerPosition.y) > WORLD_RADIUS) {
      this.player.warp(
        playerPosition.x,
        World.getOppositePosition(playerPosition.y)
      );
    }
  }

  static zoneIsOverflowing(position: number, range: number) {
    return Math.abs(position) + range > WORLD_RADIUS;
  }

  static getOppositePosition(position: number) {
    const side = position > 0 ? -1 : 1;
    const diff = WORLD_RADIUS - Math.abs(position);
    return side * (WORLD_RADIUS + diff);
  }
}
