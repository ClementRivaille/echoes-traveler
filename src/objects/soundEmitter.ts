import 'phaser';
import CollisionManager from './collisionManager';
import { Resources, musics } from '../utils/resources';
import Player from './player';
import { Orchestre } from 'orchestre-js';
import OverlapGroup from './overlapGroup';
import World from './world';

export const SHORT_RANGE = 800;
export const MIDDLE_RANGE = 1024;
export const LONG_RANGE = 1200;

// export const SHORT_RANGE = 1024;
// export const SHORT_RANGE = 1024;
// export const MIDDLE_RANGE = 1600;

const MIN_GAIN = 0.2;

export default class SoundEmitter {
  private gainNode: GainNode;
  private active: boolean = false;
  private zones: Phaser.GameObjects.Zone[] = [];
  private overlapGroup: OverlapGroup;
  private loading: Promise<void>;

  constructor(
    game: Phaser.Scene,
    collisionManager: CollisionManager,
    private context: AudioContext,
    private orchestre: Orchestre,
    private player: Player,
    x: number,
    y: number,
    private range: number,
    private sound: Resources,
    soundLength: number
  ) {
    // Player detection
    this.overlapGroup = new OverlapGroup(
      collisionManager,
      () => this.enter(),
      () => this.exit()
    );

    // Initial zone
    this.createZone(game, x, y);
    // Border zones
    const overflowingX = World.zoneIsOverflowing(x, range);
    const overflowingY = World.zoneIsOverflowing(y, range);
    if (overflowingX) {
      this.createZone(game, World.getOppositePosition(x), y);
    }
    if (overflowingY) {
      this.createZone(game, x, World.getOppositePosition(y));
    }
    if (overflowingX && overflowingY) {
      this.createZone(
        game,
        World.getOppositePosition(x),
        World.getOppositePosition(y)
      );
    }

    game.add.sprite(x, y, ''); // Debug sprite

    // Instrument & sound
    this.gainNode = new GainNode(this.context);
    this.gainNode.connect(orchestre.master);
    this.gainNode.gain.setValueAtTime(MIN_GAIN, this.context.currentTime);
    this.loading = orchestre.addPlayer(
      sound,
      musics.get(sound),
      soundLength,
      true,
      this.gainNode
    );
  }

  private enter() {
    this.active = true;
    if (this.orchestre.started) {
      this.orchestre.play(this.sound, { now: true, fade: 0.3 });
    }
  }

  private exit() {
    this.active = false;
    if (this.orchestre.started) {
      this.orchestre.stop(this.sound, { now: true, fade: 0.3 });
    }
  }

  public update() {
    if (this.active) {
      const playerPos = this.player.getPosition();
      const activeZone = this.zones.find((zone) => {
        const distance = Phaser.Math.Distance.Between(
          playerPos.x,
          playerPos.y,
          zone.x,
          zone.y
        );
        return distance <= this.range;
      });
      if (!activeZone) return;

      // Update volume according to distance
      const distance = Phaser.Math.Distance.Between(
        playerPos.x,
        playerPos.y,
        activeZone.x,
        activeZone.y
      );

      this.gainNode.gain.setValueAtTime(
        Phaser.Math.Linear(MIN_GAIN, 1, 1 - distance / this.range),
        this.context.currentTime
      );
    }
  }

  public load() {
    return this.loading;
  }

  private createZone(game: Phaser.Scene, x: number, y: number) {
    const zone = game.add.zone(x, y, 0, 0);
    this.overlapGroup.addZone(zone);
    (zone.body as Phaser.Physics.Arcade.Body).setCircle(
      this.range,
      -this.range,
      -this.range
    );
    this.zones.push(zone);
  }
}
