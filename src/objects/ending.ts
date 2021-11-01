import { Cameras } from 'phaser';
import { Player as TonePlayer } from 'tone';
import Game from '../game';
import { yieldTimeout } from '../utils/animation';
import { musics, Resources } from '../utils/resources';
import Player from './player';

const BEAT = 60 / 110;
const BAR = BEAT * 4;

const ACSENDING_BP = 5 * BAR;
const GHOSTS_BP = 13 * BAR;
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

export default class Ending {
  private music: TonePlayer;
  private startTime = -1;
  private started = false;
  private nextBreakpoint = -1;
  private step = EndingSteps.START;

  private darkBg1: Phaser.GameObjects.Rectangle;
  private darkBg2: Phaser.GameObjects.Rectangle;
  private lightBridge: Phaser.GameObjects.Sprite;
  private lightBridgeMask: Phaser.GameObjects.Sprite;

  constructor(
    private game: Game,
    private orchestreVolume: GainNode,
    private camera: Cameras.Scene2D.Camera,
    private player: Player
  ) {
    this.music = new TonePlayer(musics.get(Resources.ending)).toDestination();
    this.music.autostart = false;
    this.music.loop = false;

    this.darkBg1 = this.game.add.rectangle(
      0,
      0,
      this.camera.width,
      this.camera.height,
      0x000000
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

    this.lightBridge = this.game.add.sprite(0, 0, Resources.LightBridge);
    this.lightBridge.setAlpha(0);
    this.lightBridge.setScale(3.4);
    this.lightBridge.setOrigin(0.5, 0.96);
    this.lightBridgeMask = this.game.add.sprite(0, 0, Resources.LightBridge);
    this.lightBridgeMask.setAlpha(0);
    this.lightBridgeMask.setOrigin(0.5, 0.96);
    this.lightBridgeMask.setScale(3.4);

    this.darkBg1.setDepth(1);
    this.darkBg2.setDepth(3);
    this.lightBridge.setDepth(4);
    this.lightBridgeMask.setDepth(6);
  }

  start() {
    this.startTime = Game.context.currentTime;
    this.orchestreVolume.gain.setTargetAtTime(0, this.startTime, 8);
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
  }

  private async init() {
    this.step = EndingSteps.START;
    this.nextBreakpoint = this.startTime + ACSENDING_BP;

    // Darken the scene
    this.game.tweens.add({
      targets: [this.darkBg1],
      alpha: 0.6,
      ease: 'Sine.easeInOut',
      duration: 10000,
    });
    // Wait
    await yieldTimeout(8000);
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
  }

  private async acsending() {
    this.step = EndingSteps.ACSENDING;
    this.nextBreakpoint = Game.context.currentTime + GHOSTS_BP;

    // Particles

    // Show player
    this.player.warp(0, 0);
    await this.player.show();
  }
  private ghosts() {
    this.step = EndingSteps.GHOSTS;
    this.nextBreakpoint = Game.context.currentTime + SKY_BP;
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
}
