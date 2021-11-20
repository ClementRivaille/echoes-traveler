import Game from '../game';

export const ORB_RADIUS = 6;
const ORB_NAME = 'orb';
const ORB_COLOR = '#e1e6f1';
export const ORB_SCALE = 2;
const ORB_ELLIPSIS = 60;
export const NB_ORBS = 4;

export default class Orb {
  private sprite: Phaser.GameObjects.Sprite;
  private light: Phaser.GameObjects.Light;
  private particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

  private spriteMatrix: Phaser.GameObjects.Components.TransformMatrix;
  private parentMatrix: Phaser.GameObjects.Components.TransformMatrix;

  static initTexture(game: Phaser.Scene) {
    const orbGraphic = game.make.graphics({ x: 0, y: 0, add: false });
    orbGraphic.fillStyle(
      Phaser.Display.Color.HexStringToColor(ORB_COLOR).color
    );
    orbGraphic.fillCircle(
      ORB_RADIUS / ORB_SCALE,
      ORB_RADIUS / ORB_SCALE,
      ORB_RADIUS / ORB_SCALE
    );
    orbGraphic.generateTexture(
      ORB_NAME,
      (ORB_RADIUS * 2) / ORB_SCALE,
      (ORB_RADIUS * 2) / ORB_SCALE
    );
  }

  constructor(
    private game: Phaser.Scene,
    group: Phaser.GameObjects.Container,
    pos: number
  ) {
    this.sprite = this.game.add.sprite(0, 0, ORB_NAME);
    this.sprite.setScale(ORB_SCALE);

    this.light = this.game.lights.addLight(0, 0, 100, 0xffffff, 0.3);
    this.spriteMatrix = new Phaser.GameObjects.Components.TransformMatrix();
    this.parentMatrix = new Phaser.GameObjects.Components.TransformMatrix();

    this.particleEmitter = Game.particles.makeCircleParticlesEmitter();

    group.add(this.sprite);

    this.game.tweens.add({
      targets: [this.sprite],
      x: Math.cos(pos) * ORB_ELLIPSIS,
      y: Math.sin(pos) * ORB_ELLIPSIS,
      duration: 600,
      ease: 'Sine.easeOut',
    });
  }

  update(rotation: number) {
    this.sprite.setRotation(-rotation);

    // Light follow sprite
    this.sprite.getWorldTransformMatrix(this.spriteMatrix, this.parentMatrix);
    const globalPosition = this.spriteMatrix.decomposeMatrix() as any;
    this.light.setPosition(
      globalPosition.translateX,
      globalPosition.translateY
    );
    this.particleEmitter.setPosition(
      globalPosition.translateX,
      globalPosition.translateY
    );
  }

  explode(duration: number) {
    this.game.tweens.add({
      targets: [this.sprite],
      x: 0,
      y: 0,
      duration,
      ease: 'Back.easeIn',
    });
  }

  destroy() {
    this.sprite.destroy();
    this.game.lights.removeLight(this.light);
    this.particleEmitter.stop();
    this.particleEmitter.remove();
  }
}
