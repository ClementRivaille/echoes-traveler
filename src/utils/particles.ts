import { ORB_RADIUS, ORB_SCALE } from '../objects/orb';

export enum ParticlesNames {
  ray = 'rayParticle',
  circle = 'circleParticle',
}

export default class Particles {
  private rayParticleManager: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private circleParticleManager: Phaser.GameObjects.Particles.ParticleEmitterManager;

  constructor(private game: Phaser.Scene) {
    const rayParticle = this.game.make.graphics({ x: 0, y: 0, add: false });
    rayParticle.fillStyle(0xffffff, 0.4);
    rayParticle.fillRect(0, 0, 1, 16);
    rayParticle.generateTexture(ParticlesNames.ray, 1, 16);

    const particleRadius = 3;
    const circleParticle = this.game.make.graphics({ x: 0, y: 0, add: false });
    circleParticle.fillStyle(0xffffff);
    circleParticle.fillCircle(particleRadius, particleRadius, particleRadius);
    circleParticle.generateTexture(
      ParticlesNames.circle,
      particleRadius * 2,
      particleRadius * 2
    );

    this.rayParticleManager = game.add
      .particles(ParticlesNames.ray)
      .setDepth(6);
    this.circleParticleManager = game.add
      .particles(ParticlesNames.circle)
      .setDepth(6);
  }

  makeRayParticlesEmitter() {
    const emitter = this.rayParticleManager.createEmitter({
      angle: -90,
      lifespan: 3000,
      frequency: 130,
      emitZone: {
        source: new Phaser.Geom.Rectangle(-50, 0, 100, 0),
        type: 'random',
      },
      gravityY: 0,
      speed: { min: 300, max: 700 },
      scaleY: { min: 1, max: 1.7 },
      alpha: { min: 0.4, max: 1 },
      quantity: { min: 0, max: 2 },
    });
    emitter.stop();
    return emitter;
  }

  makeCircleParticlesEmitter() {
    return this.circleParticleManager.createEmitter({
      lifespan: 400,
      frequency: 80,
      quantity: { min: 1, max: 3 },
      gravityY: 0,
      speed: 10,
      emitZone: {
        source: new Phaser.Geom.Circle(0, 0, ORB_RADIUS * ORB_SCALE),
        type: 'random',
      },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 0.8, end: 0.2 },
    });
  }
}
