import 'phaser';
import { MOBILE_TOUCH_MARGIN } from '../utils/mobile';
import { Resources } from '../utils/resources';

const MOBILE_UI_DEPTH = 8;

const ARROW_SCALE = 4;
const MARGIN = 30;

export default class MobileUI {
  private leftSprite: Phaser.GameObjects.Sprite;
  private rightSprite: Phaser.GameObjects.Sprite;
  private upSprite: Phaser.GameObjects.Sprite;
  private downSprite: Phaser.GameObjects.Sprite;

  constructor(private game: Phaser.Scene) {
    this.leftSprite = game.add.sprite(
      -this.game.renderer.width / 2 + MARGIN,
      0,
      Resources.ArrowDown
    );
    this.rightSprite = game.add.sprite(
      this.game.renderer.width / 2 - MARGIN,
      0,
      Resources.ArrowDown
    );
    this.upSprite = game.add.sprite(
      0,
      -game.renderer.height / 2 + MARGIN,
      Resources.ArrowDown
    );
    this.downSprite = game.add.sprite(
      0,
      game.renderer.height / 2 - MARGIN,
      Resources.ArrowDown
    );

    this.leftSprite.setRotation(Math.PI / 2);
    this.upSprite.setRotation(Math.PI);
    this.rightSprite.setRotation(-Math.PI / 2);

    [this.downSprite, this.leftSprite, this.upSprite, this.rightSprite].forEach(
      (sprite) => {
        sprite.setDepth(MOBILE_UI_DEPTH);
        sprite.setScale(ARROW_SCALE);
        sprite.setAlpha(0);
      }
    );
  }
}
