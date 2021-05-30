import 'phaser';
import CollisionManager from './collisionManager';
import { Resources, musics } from '../utils/resources';
import Player from './player';
import { Orchestre } from 'orchestre-js';

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
  private zone: Phaser.GameObjects.Zone;
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
    this.zone = game.add.zone(x, y, 0, 0);
    collisionManager.addOverlap(
      this.zone,
      () => this.enter(),
      () => this.exit()
    );
    (this.zone.body as Phaser.Physics.Arcade.Body).setCircle(
      range,
      -range,
      -range
    );
    game.add.sprite(x, y, '');

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
      // Update volume according to distance
      const playerPos = this.player.getPosition();
      const distance = Phaser.Math.Distance.Between(
        playerPos.x,
        playerPos.y,
        this.zone.x,
        this.zone.y
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
}
