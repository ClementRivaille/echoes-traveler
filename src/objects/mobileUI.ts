import 'phaser';
import { MOBILE_TOUCH_MARGIN, TouchInput } from '../utils/mobile';
import { Resources } from '../utils/resources';
import { promisifyTween } from '../utils/animation';

const MOBILE_UI_DEPTH = 8;

const ARROW_SCALE = 3.2;
const MARGIN = 35;

const INACTIVE_ALPHA = 0.3;
const ACTIVE_ALPHA = 0.8;

const GRADIENT_BORDER = 'GRADIENT_BORDER';
const GRADIENT_BORDER_HEIGHT = MOBILE_TOUCH_MARGIN - 20;

export default class MobileUI {
  private leftSprite: Phaser.GameObjects.Sprite;
  private rightSprite: Phaser.GameObjects.Sprite;
  private upSprite: Phaser.GameObjects.Sprite;
  private downSprite: Phaser.GameObjects.Sprite;

  private leftGradient: Phaser.GameObjects.Sprite;
  private rightGradient: Phaser.GameObjects.Sprite;
  private upGradient: Phaser.GameObjects.Sprite;
  private downGradient: Phaser.GameObjects.Sprite;

  private active = false;

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
        sprite.setAlpha(0);
      }
    );

    this.generateGradientTexture();
    this.downGradient = this.game.add.sprite(
      0,
      this.game.renderer.height / 2 - GRADIENT_BORDER_HEIGHT / 2,
      GRADIENT_BORDER
    );
    this.upGradient = this.game.add.sprite(
      0,
      -this.game.renderer.height / 2 + GRADIENT_BORDER_HEIGHT / 2,
      GRADIENT_BORDER
    );
    this.leftGradient = this.game.add.sprite(
      -this.game.renderer.width / 2 + GRADIENT_BORDER_HEIGHT / 2,
      0,
      GRADIENT_BORDER
    );
    this.rightGradient = this.game.add.sprite(
      this.game.renderer.width / 2 - GRADIENT_BORDER_HEIGHT / 2,
      0,
      GRADIENT_BORDER
    );

    this.upGradient.setFlipY(true);
    this.leftGradient.setRotation(Math.PI / 2);
    this.rightGradient.setRotation(-Math.PI / 2);

    [
      this.downGradient,
      this.upGradient,
      this.rightGradient,
      this.leftGradient,
    ].forEach((sprite) => {
      sprite.setDepth(MOBILE_UI_DEPTH - 1);
      sprite.setAlpha(0);
    });
  }

  update() {
    if (this.active) {
      const input = this.touchInput.readTouchDirections();
      this.updateArrow(this.upSprite, this.upGradient, input.up);
      this.updateArrow(this.downSprite, this.downGradient, input.down);
      this.updateArrow(this.leftSprite, this.leftGradient, input.left);
      this.updateArrow(this.rightSprite, this.rightGradient, input.right);
    }
  }

  updateArrow(
    sprite: Phaser.GameObjects.Sprite,
    gradient: Phaser.GameObjects.Sprite,
    active: boolean
  ) {
    const targetAlpha = active ? ACTIVE_ALPHA : INACTIVE_ALPHA;
    if (sprite.alpha !== targetAlpha) {
      sprite.setAlpha(targetAlpha);
      gradient.setAlpha(active ? 1 : 0);
    }
  }

  async activate(): Promise<void> {
    await promisifyTween(
      this.game.tweens.add({
        targets: [
          this.downSprite,
          this.upSprite,
          this.leftSprite,
          this.rightSprite,
        ],
        alpha: INACTIVE_ALPHA,
        ease: 'Sine.easeInOut',
        duration: 300,
      })
    );
    this.active = true;
  }

  async deactivate(): Promise<void> {
    this.active = false;
    [this.downSprite, this.leftSprite, this.upSprite, this.rightSprite].forEach(
      (sprite) => {
        sprite.setAlpha(INACTIVE_ALPHA);
      }
    );
    [
      this.downGradient,
      this.leftGradient,
      this.upGradient,
      this.rightGradient,
    ].forEach((sprite) => {
      sprite.setAlpha(0);
    });
    await promisifyTween(
      this.game.tweens.add({
        targets: [
          this.downSprite,
          this.upSprite,
          this.leftSprite,
          this.rightSprite,
        ],
        alpha: 0,
        ease: 'Sine.easeIn',
        duration: 1000,
      })
    );
  }

  isActive(): boolean {
    return this.active;
  }

  private generateGradientTexture() {
    const texture = this.game.textures.createCanvas(
      GRADIENT_BORDER,
      this.game.renderer.width,
      GRADIENT_BORDER_HEIGHT
    );
    const ctx = texture.context;
    const gradient = ctx.createLinearGradient(0, 0, 0, GRADIENT_BORDER_HEIGHT);
    gradient.addColorStop(0, '#ffffff00');
    gradient.addColorStop(1, '#ffffff2a');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.game.renderer.width, GRADIENT_BORDER_HEIGHT);

    texture.refresh();
  }
}
