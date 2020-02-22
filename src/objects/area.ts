import 'phaser';
import CollisionManager from './collisionManager';
import { Resources, musics } from '../utils/resources';

const UNIT = 1024;
const FADE = 1.5;
const MEASURE_LENGTH = 16;

export default class Area {
  public active: boolean = false;
  private loading: Promise<void>;

  constructor(
    game: Phaser.Scene,
    private orchestre: any,
    collisonManager: CollisionManager,
    x: number,
    y: number,
    width: number,
    height: number,
    private music: Resources
  ) {
    const zone = game.add.zone(x * UNIT, y * UNIT, width * UNIT, height * UNIT);
    collisonManager.addOverlap(
      zone,
      () => this.enter(),
      () => this.exit()
    );

    this.loading = orchestre.addPlayer(
      music,
      musics.get(music),
      MEASURE_LENGTH,
      true
    );
  }

  public load() {
    return this.loading;
  }

  public activate() {
    if (this.orchestre.started) {
      this.orchestre.play(this.music, { fade: FADE, now: true });
    }
  }

  private enter() {
    if (this.orchestre.started) {
      this.orchestre.play(this.music, { fade: FADE, now: true });
    }
  }

  private exit() {
    if (this.orchestre.started) {
      this.orchestre.stop(this.music, { fade: FADE, now: true });
    }
  }
}
