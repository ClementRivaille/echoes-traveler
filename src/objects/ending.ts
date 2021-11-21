import { Cameras } from 'phaser';
import { getContext, Player as TonePlayer } from 'tone';
import Game from '../game';
import {
  promisifyTween,
  setupStarsAnimations,
  StarAnimations,
  yieldTimeout,
} from '../utils/animation';
import { musics, Resources } from '../utils/resources';
import DarkGhost from './darkGhost';
import Orb, { NB_ORBS } from './orb';
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

const ORBS_ORDER_BPS = [0, 2 * BEAT, 1 * BAR, 2 * BEAT];
const ORBS_SPEED = 2 * Math.PI * 0.007;

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

const DARK_BLUE = 0x070b0e;

const STAR_SCALE = 4;
const STAR_COLOR = 0xfafcee;
const PLAYER_STAR_COLOR = 0xfaffd3;
const SKY_COLOR = 0x02032a;

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

  private orbsGroup: Phaser.GameObjects.Container;
  private nextOrbBP = -1;
  private activeOrbs: Orb[] = [];

  private flash: Phaser.GameObjects.Rectangle;
  private playerStar: Phaser.GameObjects.Sprite;
  private stars: Phaser.GameObjects.Sprite[] = [];
  private explosionParticles: Phaser.GameObjects.Particles.ParticleEmitter;

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
      this.camera.height + 50,
      DARK_BLUE
    );
    this.darkBg1.setAlpha(0);
    this.darkBg2 = this.game.add.rectangle(
      0,
      0,
      this.camera.width,
      this.camera.height + 50,
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
    this.rayEmitter = Game.particles.makeRayParticlesEmitter();

    const lightBg = this.game.make.graphics({ x: 0, y: 0, add: false });
    lightBg.fillStyle(0xe4e3f7);
    lightBg.fillRect(0, 0, this.camera.width, this.camera.height + 50);
    const lightBgName = 'LightBg';
    lightBg.generateTexture(
      lightBgName,
      this.camera.width,
      this.camera.height + 50
    );
    this.lightBackground = this.game.add.sprite(0, 0, lightBgName);
    this.lightBackground.setAlpha(0);
    this.lightBackground.setPipeline('Light2D');

    // Orbs
    this.orbsGroup = this.game.add.container(0, 0);
    Orb.initTexture(this.game);

    // Stars
    setupStarsAnimations(this.game);
    this.flash = this.game.add.rectangle(
      0,
      0,
      this.camera.width,
      this.camera.height,
      0xffffff
    );
    this.flash.setAlpha(0);
    this.playerStar = this.game.add
      .sprite(0, 0, Resources.LargeStar)
      .play(StarAnimations.largeTwinkle);
    this.playerStar.setScale(STAR_SCALE);
    this.playerStar.setTint(PLAYER_STAR_COLOR);
    this.playerStar.setAlpha(0);
    this.explosionParticles = Game.particles.makeCircleExplosionEmitter();

    // Positions
    this.darkBg1.setDepth(1);
    this.darkBg2.setDepth(3);
    this.lightBackground.setDepth(3.1);
    this.lightBridge.setDepth(4.4);
    this.lightBridgeMask.setDepth(6);
    this.orbsGroup.setDepth(6);
    this.flash.setDepth(10);
    this.playerStar.setDepth(6);
  }

  start() {
    this.startTime = getContext().currentTime;
    this.orchestreVolume.gain.setTargetAtTime(0, this.startTime, 6);
    this.music.start();
    this.started = true;
    this.init();
  }

  update() {
    if (!this.started) return;

    if (getContext().currentTime >= this.nextBreakpoint) {
      switch (this.step) {
        case EndingSteps.START:
          this.ascending();
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

    if (this.step === EndingSteps.ORBS || this.step === EndingSteps.EXPLOSION) {
      this.updateOrbs();
    }
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

  private async ascending() {
    this.step = EndingSteps.ACSENDING;
    this.nextBreakpoint = getContext().currentTime + GHOSTS_BP;

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
    this.nextBreakpoint = getContext().currentTime + SKY_BP;

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
  private async sky() {
    this.step = EndingSteps.SKY;
    this.nextBreakpoint = getContext().currentTime + ORBS_BP;

    // Zoom
    this.game.tweens.add({
      targets: [this.camera],
      zoom: 2,
      ease: 'Sine.easeInOut',
      duration: 11500,
    });

    // Remove light
    this.game.tweens.add({
      targets: [this.lightBridge, this.lightBridgeMask],
      alpha: 0,
      ease: 'Sine.easeIn',
      duration: 6000,
    });
    await promisifyTween(
      this.game.tweens.add({
        targets: [...this.lights],
        intensity: 0,
        duration: 5000,
        ease: 'Sine.easeIn',
      })
    );

    // Clear unused sprites
    this.lights.forEach((light) => this.game.lights.removeLight(light));
    this.lights = [];
    this.darkGhosts.forEach((ghost) => ghost.destroy());
    this.darkGhosts = [];
  }

  private orbs() {
    this.step = EndingSteps.ORBS;
    this.nextBreakpoint = getContext().currentTime + EXPLOSION_BP;

    this.nextOrbBP = getContext().currentTime + ORBS_ORDER_BPS[0];
  }

  private updateOrbs() {
    // Move group
    const playerPosition = this.player.getPosition();
    this.orbsGroup.setPosition(playerPosition.x, playerPosition.y - 40);
    this.orbsGroup.setRotation(this.orbsGroup.rotation + ORBS_SPEED);
    for (const orb of this.activeOrbs) {
      orb.update(this.orbsGroup.rotation);
    }

    // Add orb
    if (
      this.activeOrbs.length < NB_ORBS &&
      getContext().currentTime >= this.nextOrbBP
    ) {
      const idx = this.activeOrbs.length;
      this.activeOrbs.push(
        new Orb(this.game, this.orbsGroup, (idx * -2 * Math.PI) / NB_ORBS)
      );

      if (idx + 1 < ORBS_ORDER_BPS.length) {
        this.nextOrbBP = this.nextOrbBP + ORBS_ORDER_BPS[idx + 1];
      }
    }
  }

  private explosion() {
    this.step = EndingSteps.EXPLOSION;
    this.nextBreakpoint = getContext().currentTime + STAR_BP;

    for (const orb of this.activeOrbs) {
      orb.explode(STAR_BP * 1000);
    }
  }
  private star() {
    this.step = EndingSteps.STAR;
    this.nextBreakpoint = getContext().currentTime + END_BP;

    // Clear orbs
    for (const orb of this.activeOrbs) {
      orb.destroy();
    }
    this.activeOrbs = [];

    // Deactivate player and stop scrolling
    this.player.deactivate();
    this.scrolling = ScrollingState.None;

    const playerPosition = this.player.getPosition();

    // Flash & explosion
    this.flash.setPosition(playerPosition.x, playerPosition.y);
    this.flash.setAlpha(1);
    this.game.tweens.add({
      targets: [this.flash],
      alpha: 0,
      duration: 1500,
      ease: 'Sine.easeOut',
    });
    this.explosionParticles.explode(
      20,
      playerPosition.x,
      playerPosition.y - 40
    );

    // Dezoom
    this.game.tweens.add({
      targets: [this.camera],
      zoom: 1,
      duration: END_BP * 1000 - 1000,
      ease: 'Sine.easeOut',
    });

    // Stars
    this.playerStar.setAlpha(1);
    this.playerStar.setPosition(playerPosition.x, playerPosition.y - 40);
    this.game.lights.disable();

    // Fill sky
    this.lightBackground.destroy();
    this.darkBg2.setFillStyle(SKY_COLOR);
    this.darkBg2.setPosition(this.camera.midPoint.x, this.camera.midPoint.y);
    this.fillSky();
  }

  private fillSky() {
    const sky_chunk = 150;
    const chunk_margin = 20;
    const leftBorder = this.camera.midPoint.x - this.camera.width / 2;
    const topBorder = this.camera.midPoint.y - this.camera.height / 2;
    const stepsY = Math.floor(this.camera.height / sky_chunk) + 1;
    const stepsX = Math.floor(this.camera.width / sky_chunk) + 1;
    const lastMedium = { x: -5, y: -5 };
    for (let idxY = 0; idxY < stepsY; idxY++) {
      const y = topBorder + sky_chunk * idxY;
      for (let idxX = 0; idxX < stepsX; idxX++) {
        const x = leftBorder + sky_chunk * idxX;

        const closeToCenter =
          Math.abs(stepsY / 2 - idxY) <= 1 && Math.abs(stepsX / 2 - idxX) <= 1;

        if (!closeToCenter && Math.random() > 0.4) {
          // Add star
          const starX =
            x + chunk_margin + Math.random() * (sky_chunk - 2 * chunk_margin);
          const starY =
            y + chunk_margin + Math.random() * (sky_chunk - 2 * chunk_margin);
          const mediumStar =
            Math.abs(lastMedium.x - idxX) > 2 &&
            Math.abs(lastMedium.y - idxY) > 2 &&
            Math.random() < 0.5;
          // Select sprite
          if (mediumStar) {
            lastMedium.x = idxX;
            lastMedium.y = idxY;
          }
          const starTexture = mediumStar
            ? Resources.MediumStar
            : Math.random() < 0.4
            ? Resources.SmallStar
            : Resources.DotStar;
          const star = this.game.add.sprite(starX, starY, starTexture);
          star.setScale(STAR_SCALE);
          star.setTint(STAR_COLOR);
          star.setDepth(7);
          if (starTexture !== Resources.DotStar) {
            star.setFrame(Math.random() < 0.5 ? 0 : 1);
            star.play(
              starTexture === Resources.MediumStar
                ? StarAnimations.mediumTwinkle
                : StarAnimations.smallTwinkle
            );
          }
          this.stars.push(star);
        }
      }
    }
  }
  private end() {
    this.step = EndingSteps.END;
    this.game.onEnd();
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
