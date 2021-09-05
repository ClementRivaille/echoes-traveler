import 'phaser';
import Game from '../game';
import { musics, Resources } from '../utils/resources';

export const UNIT = 1024;
const FADE = 1.5;

export default class Area {
  public active: boolean = false;
  private loading: Promise<void>;

  constructor(
    game: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    private music: Resources,
    measure: number
  ) {
    const zone = game.add.zone(x * UNIT, y * UNIT, width * UNIT, height * UNIT);
    Game.collisionsManager.addOverlap(
      zone,
      () => this.enter(),
      () => this.exit()
    );

    this.loading = Game.orchestre.addPlayer(
      music,
      musics.get(music),
      measure,
      true
    );
  }

  public load() {
    return this.loading;
  }

  public activate() {
    if (Game.orchestre.started) {
      Game.orchestre.play(this.music, { fade: FADE, now: true });
    }
  }

  private enter() {
    if (Game.orchestre.started) {
      Game.orchestre.play(this.music, { fade: FADE, now: true });
    }
  }

  private exit() {
    if (Game.orchestre.started) {
      Game.orchestre.stop(this.music, { fade: FADE, now: true });
    }
  }
}
