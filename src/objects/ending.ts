import { Cameras } from 'phaser';
import { Player as TonePlayer } from 'tone';
import Game from '../game';
import { yieldTimeout } from '../utils/animation';
import { musics, Resources } from '../utils/resources';
import DarkGhost from './darkGhost';
import Player from './player';

const BEAT = 60 / 110;
const BAR = BEAT * 4;

const ACSENDING_BP = 12 * BAR;
const GHOSTS_BP = 8 * BAR;
const SKY_BP = 8 * BAR;
const ORBS_BP = 1 * BAR + 2 * BEAT;
const EXPLOSION_BP = 4 * BAR + 1 * BEAT;
const STAR_BP = 1 * BEAT;
const END_BP = 15 * BAR + 3 * BEAT;

const OBS_ORDER_BPS = [0, 2 * BEAT, 1 * BAR, 2 * BEAT];

enum EndingSteps {
  START,
  ACSENDING,
  GHOSTS,
  SKY,
  ORBS,
  EXPLOSION,
  STAR,
  END,
}

enum ScrollingState {
  None,
  CatchingUp,
  Following,
}

const CAMERA_VELOCITY = 2;

enum Particles {
  ray = 'rayParticle',
  circle = 'circleParticle',
}

const DARK_BLUE = 0x070b0e;

export default class Ending {
  private music: TonePlayer;
  private startTime = -1;
  private started = false;
  private nextBreakpoint = -1;
  private step = EndingSteps.START;
  private scrolling = ScrollingState.None;

  private darkBg1: Phaser.GameObjects.Rectangle;
  private darkBg2: Phaser.GameObjects.Rectangle;
  private lightBridge: Phaser.GameObjects.Sprite;
  private lightBridgeMask: Phaser.GameObjects.Sprite;

  private rayEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

  private darkGhosts: DarkGhost[] = [];
  private lights: Phaser.GameObjects.Light[] = [];
  private lightBackground: Phaser.GameObjects.Sprite;

  constructor(
    private game: Game,
    private orchestreVolume: GainNode,
    private camera: Cameras.Scene2D.Camera,
    private player: Player,
    private shadows: Phaser.GameObjects.Sprite
  ) {
    this.music = new TonePlayer(musics.get(Resources.ending)).toDestination();
    this.music.autostart = false;
    this.music.loop = false;

    // Dark backgrounds
    this.darkBg1 = this.game.add.rectangle(
      0,
      0,
      this.camera.width,
      this.camera.height,
      DARK_BLUE
    );
    this.darkBg1.setAlpha(0);
    this.darkBg2 = this.game.add.rectangle(
      0,
      0,
      this.camera.width,
      this.camera.height,
      0x000000
    );
    this.darkBg2.setAlpha(0);

    // Light bridge
    this.lightBridge = this.game.add.sprite(0, 0, Resources.LightBridge);
    this.lightBridge.setAlpha(0);
    this.lightBridge.setScale(3.4);
    this.lightBridge.setOrigin(0.5, 0.96);
    this.lightBridgeMask = this.game.add.sprite(0, 0, Resources.LightBridge);
    this.lightBridgeMask.setAlpha(0);
    this.lightBridgeMask.setOrigin(0.5, 0.96);
    this.lightBridgeMask.setScale(3.4);

    // Particles
    const rayParticle = this.game.make.graphics({ x: 0, y: 0, add: false });
    rayParticle.fillStyle(0xffffff, 0.4);
    rayParticle.fillRect(0, 0, 1, 16);
    rayParticle.generateTexture(Particles.ray, 1, 16);

    this.rayEmitter = this.game.add
      .particles(Particles.ray)
      .setDepth(6)
      .createEmitter({
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
    this.rayEmitter.stop();

    const lightBg = this.game.make.graphics({ x: 0, y: 0, add: false });
    lightBg.fillStyle(0xe4e3f7);
    lightBg.fillRect(0, 0, this.camera.width, this.camera.height);
    const lightBgName = 'LightBg';
    lightBg.generateTexture(lightBgName, this.camera.width, this.camera.height);
    this.lightBackground = this.game.add.sprite(0, 0, lightBgName);
    this.lightBackground.setAlpha(0);
    this.lightBackground.setPipeline('Light2D');

    // Positions
    this.darkBg1.setDepth(1);
    this.darkBg2.setDepth(3);
    this.lightBackground.setDepth(3.1);
    this.lightBridge.setDepth(4.4);
    this.lightBridgeMask.setDepth(6);
  }

  start() {
    this.startTime = Game.context.currentTime;
    this.orchestreVolume.gain.setTargetAtTime(0, this.startTime, 6);
    this.music.start();
    this.started = true;
    this.init();
  }

  update() {
    if (!this.started) return;

    if (Game.context.currentTime >= this.nextBreakpoint) {
      switch (this.step) {
        case EndingSteps.START:
          this.acsending();
          break;
        case EndingSteps.ACSENDING:
          this.ghosts();
          break;
        case EndingSteps.GHOSTS:
          this.sky();
          break;
        case EndingSteps.SKY:
          this.orbs();
          break;
        case EndingSteps.ORBS:
          this.explosion();
          break;
        case EndingSteps.EXPLOSION:
          this.star();
          break;
        case EndingSteps.STAR:
          this.end();
          break;
        default:
          break;
      }
    }

    this.updateCamera();
  }

  private async init() {
    this.step = EndingSteps.START;
    this.nextBreakpoint = this.startTime + ACSENDING_BP;

    // Darken the scene
    this.game.tweens.add({
      targets: [this.darkBg1],
      alpha: 0.7,
      ease: 'Sine.easeInOut',
      duration: 25000,
    });
    this.game.tweens.add({
      targets: [this.shadows],
      alpha: 0,
      ease: 'Sine.easeIn',
      duration: 15000,
    });

    // Wait
    await yieldTimeout(18000);

    // Show player
    this.player.warp(0, 0);
    await this.player.show();
  }

  private async acsending() {
    this.step = EndingSteps.ACSENDING;
    this.nextBreakpoint = Game.context.currentTime + GHOSTS_BP;

    // Show light bridge
    this.game.tweens.add({
      targets: [this.lightBridge],
      alpha: 0.5,
      ease: 'Sine.easeOut',
      duration: 8000,
    });
    this.game.tweens.add({
      targets: [this.lightBridgeMask],
      alpha: 0.15,
      ease: 'Sine.easeInOut',
      duration: 8000,
    });

    await yieldTimeout(4000);

    // Particles
    this.rayEmitter.start();
    this.game.tweens.add({
      targets: [this.darkBg1],
      alpha: 1,
      ease: 'Sine.easeInOut',
      duration: 6000,
    });

    await yieldTimeout(1000);

    // Fly player upward
    this.player.fly();

    await yieldTimeout(4000);

    // Follow player
    this.scrolling = ScrollingState.CatchingUp;
    this.game.tweens.add({
      targets: [this.darkBg2],
      alpha: 1,
      ease: 'Sine.easeInOut',
      duration: 5000,
    });
  }

  private async ghosts() {
    this.step = EndingSteps.GHOSTS;
    this.nextBreakpoint = Game.context.currentTime + SKY_BP;

    const playerPosition = this.player.getPosition();
    const bottomScreen = playerPosition.y + this.camera.height / 2;

    // Add lights
    this.rayEmitter.stop();
    this.game.lights.enable();
    this.game.tweens.add({
      targets: [this.lightBackground],
      alpha: 0.25,
      duration: 500,
    });
    const nbLights = 12;
    const stepY = 200;
    const lightRadius = 1000;
    for (let i = 0; i < nbLights; i++) {
      const y = bottomScreen - stepY * i + (Math.random() * stepY) / 2;
      const x =
        (150 + Math.random() * (this.camera.width / 2)) * (i % 2 == 0 ? -1 : 1);
      const light = this.game.lights.addLight(
        x,
        y,
        lightRadius + (-300 + Math.random() * 600)
      );
      light.setIntensity(0);
      this.game.tweens.add({
        targets: [light],
        intensity: 0.6 + Math.random() * 0.4,
        ease: 'Sine.easeOut',
        duration: 3000,
      });
      this.lights.push(light);
    }

    const nbGhosts = 40;
    const minX = -this.camera.width / 2;
    const maxX = this.camera.width / 2;
    const maxY = bottomScreen;
    const minY = playerPosition.y - this.camera.height * 2.5;

    for (const i of Array(nbGhosts)) {
      const posX = minX + Math.random() * (maxX - minX);
      const posY = minY + Math.random() * (maxY - minY);
      const depth = 0.2 + Math.random();
      this.darkGhosts.push(new DarkGhost(this.game, posX, posY, depth));

      await yieldTimeout(Math.random() * 200);
    }
  }
  private sky() {
    this.step = EndingSteps.SKY;
    this.nextBreakpoint = Game.context.currentTime + ORBS_BP;
  }
  private orbs() {
    this.step = EndingSteps.ORBS;
    this.nextBreakpoint = Game.context.currentTime + EXPLOSION_BP;
  }
  private explosion() {
    this.step = EndingSteps.EXPLOSION;
    this.nextBreakpoint = Game.context.currentTime + STAR_BP;
  }
  private star() {
    this.step = EndingSteps.STAR;
    this.nextBreakpoint = Game.context.currentTime + END_BP;
  }
  private end() {
    this.step = EndingSteps.END;
  }

  private updateCamera() {
    if (this.scrolling === ScrollingState.None) return;

    if (this.scrolling === ScrollingState.CatchingUp) {
      const playerHeight = this.player.getPosition().y;
      if (this.camera.midPoint.y <= playerHeight) {
        this.camera.startFollow(this.player.sprite);
        this.scrolling = ScrollingState.Following;
      } else {
        this.camera.setScroll(
          this.camera.scrollX,
          this.camera.scrollY - CAMERA_VELOCITY
        );
      }
    }

    if (this.camera.scrollY < -this.camera.height) {
      const bottom = this.camera.scrollY + this.camera.height;
      this.lightBridge.setPosition(0, bottom);
      this.lightBridgeMask.setPosition(0, bottom);
      this.rayEmitter.setPosition(0, bottom);
    }

    this.darkBg1.setPosition(this.camera.midPoint.x, this.camera.midPoint.y);
    this.darkBg2.setPosition(this.camera.midPoint.x, this.camera.midPoint.y);
    this.lightBackground.setPosition(
      this.camera.midPoint.x,
      this.camera.midPoint.y
    );
  }
}
