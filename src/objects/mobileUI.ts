import 'phaser';
import { MOBILE_TOUCH_MARGIN, TouchInput } from '../utils/mobile';
import { Resources } from '../utils/resources';

const MOBILE_UI_DEPTH = 8;

const ARROW_SCALE = 3.2;
const MARGIN = 35;

const INACTIVE_ALPHA = 0.3;
const ACTIVE_ALPHA = 0.8;

export default class MobileUI {
  private leftSprite: Phaser.GameObjects.Sprite;
  private rightSprite: Phaser.GameObjects.Sprite;
  private upSprite: Phaser.GameObjects.Sprite;
  private downSprite: Phaser.GameObjects.Sprite;

  constructor(private game: Phaser.Scene, private touchInput: TouchInput) {
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
        sprite.setAlpha(INACTIVE_ALPHA);
      }
    );
  }

  update() {
    const input = this.touchInput.readTouchDirections();
    this.updateArrow(this.upSprite, input.up);
    this.updateArrow(this.downSprite, input.down);
    this.updateArrow(this.leftSprite, input.left);
    this.updateArrow(this.rightSprite, input.right);
  }

  updateArrow(sprite: Phaser.GameObjects.Sprite, active: boolean) {
    const targetAlpha = active ? ACTIVE_ALPHA : INACTIVE_ALPHA;
    if (sprite.alpha !== targetAlpha) {
      sprite.setAlpha(targetAlpha);
    }
  }
}
