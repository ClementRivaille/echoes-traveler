import { promisifyTween } from '../utils/animation';
import { Resources } from '../utils/resources';

const DARK_GHOST_DEPTH = 3.2;

const MIN_SCALE = 0.4;
const MAX_SCALE = 1.4;

const MIN_SCROLL = 0.2;
const MAX_SCROLL = 1.1;

export default class DarkGhost {
  private sprite: Phaser.GameObjects.Sprite;

  constructor(private game: Phaser.Scene, x: number, y: number, depth: number) {
    // const scroll = MIN_SCROLL + depth * (MAX_SCROLL - MIN_SCROLL);
    this.sprite = game.add.sprite(x, y, Resources.DarkGhost, 0);
    this.sprite.setScale(MIN_SCALE + depth * (MAX_SCALE - MIN_SCALE));
    this.sprite.scrollFactorY = MIN_SCROLL + depth * (MAX_SCROLL - MIN_SCROLL);
    this.sprite.setDepth(DARK_GHOST_DEPTH + depth);
    this.sprite.setPipeline('Light2D');

    this.sprite.setAlpha(0);
    this.game.tweens.add({
      targets: [this.sprite],
      alpha: 1,
      ease: 'Sine.easeOut',
      duration: 3000,
    });
  }

  async destroy() {
    await promisifyTween(
      this.game.add.tween({
        targets: [this.sprite],
        alpha: 0,
        ease: 'Sine.easeIn',
        duration: 500,
      })
    );
    this.sprite.destroy();
  }
}
