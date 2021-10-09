import { Orchestre } from 'orchestre-js';
import 'phaser';
import Area from './objects/area';
import Borders from './objects/Borders';
import CollisionManager from './objects/collisionManager';
import { FRAME_HEIGHT, FRAME_WIDTH } from './objects/ghostSprite';
import Indicator from './objects/indicator';
import Path from './objects/path';
import Player from './objects/player';
import SoundEmitter from './objects/soundEmitter';
import World from './objects/world';
import { areasConfig, soundEmittersConfig } from './utils/audioConfig';
import Instruments from './utils/instruments';
import pathsConfig from './utils/pathsConfig';
import { images, Resources, sprites } from './utils/resources';
import Sounds from './utils/Sounds';
import UI from './objects/ui';
import { loadFonts } from './utils/fonts';
import { StateTimeline } from 'tone';

enum GameState {
  Preload,
  Title,
  Loading,
  Playing,
  Ending,
  Credits,
}

export default class Game extends Phaser.Scene {
  private player: Player;
  private camera: Phaser.Cameras.Scene2D.Camera;
  private ui: UI;

  private paths: Path[] = [];
  private pathValidated = 0;
  private indicators: Indicator[] = [];

  private borders: Borders;

  private soundEmitters: SoundEmitter[];
  private instruments: Instruments;
  private sounds: Sounds;
  private world: World;
  private areas: Area[];

  public static orchestre: Orchestre;
  public static collisionsManager: CollisionManager;
  public static context: AudioContext;

  private state: GameState = GameState.Preload;
  private loaded = false;

  constructor() {
    super('game');
  }

  preload() {
    for (const image of images.keys()) {
      this.load.image(image, images.get(image));
    }
    for (const sprite of sprites.keys()) {
      this.load.spritesheet(sprite, sprites.get(sprite), {
        frameWidth: FRAME_WIDTH,
        frameHeight: FRAME_HEIGHT,
      });
    }
  }

  async create() {
    const resourcesLoading: Promise<void>[] = [];
    this.ui = new UI(this);

    this.camera = this.cameras.main;
    this.camera.scrollX = -this.camera.centerX;
    this.camera.scrollY = -this.camera.centerY;

    resourcesLoading.push(this.loadTitle());

    const background = this.add.sprite(0, 0, Resources.Background);
    background.scale = 3.4;
    const trees = this.add.sprite(0, 0, Resources.TreeShadows);
    trees.scale = 3.4;
    trees.setDepth(2);

    this.player = new Player(this, 0, 0);
    this.world = new World(this.player);

    Game.collisionsManager = new CollisionManager(
      this.physics,
      this.player.sprite.object
    );

    Game.context = new AudioContext();
    Game.orchestre = new Orchestre(110, Game.context);
    this.areas = areasConfig.map((areaConfig) => {
      const area = new Area(
        this,
        areaConfig.x,
        areaConfig.y,
        areaConfig.width,
        areaConfig.height,
        areaConfig.music,
        areaConfig.measure
      );
      resourcesLoading.push(area.load());
      return area;
    });
    this.soundEmitters = soundEmittersConfig.map((emitterConfig) => {
      const emitter = new SoundEmitter(
        this,
        this.player,
        emitterConfig.x,
        emitterConfig.y,
        emitterConfig.range,
        emitterConfig.sound,
        emitterConfig.length
      );
      resourcesLoading.push(emitter.load());
      return emitter;
    });
    this.instruments = new Instruments();
    resourcesLoading.push(this.instruments.load());
    this.sounds = new Sounds();
    resourcesLoading.push(this.sounds.load());

    // Debug camera
    // this.camera.startFollow(this.player.sprite);

    // Position paths
    for (const pathConfig of pathsConfig) {
      this.paths.push(
        new Path(
          this,
          pathConfig.x,
          pathConfig.y,
          pathConfig.id,
          pathConfig.directions,
          this.instruments,
          this.sounds,
          (id) => this.validatePath(id)
        )
      );
      const indicator = new Indicator(
        this,
        pathConfig.torchX,
        pathConfig.torchY,
        pathConfig.id,
        pathConfig.hint
      );
      this.indicators.push(indicator);
      if (pathConfig.hint) {
        resourcesLoading.push(indicator.load());
      }
    }

    this.borders = new Borders(
      this,
      this.camera.width,
      this.camera.height,
      this.player.sprite.object,
      () => this.onBorderCollide()
    );

    // Controls
    const enter = this.input.keyboard.addKey('ENTER');
    enter.on('down', () => this.onPressStart());

    // ------------LOADING --------------------
    await Promise.all(resourcesLoading);
    this.onResourcesLoaded();
  }

  update() {
    this.player.update();
    this.world.update();
    Game.collisionsManager.update();
    this.soundEmitters.forEach((emitter) => emitter.update());
  }

  private async loadTitle(): Promise<void> {
    await loadFonts();
    this.ui.init();
    this.state = GameState.Title;
  }

  private async onResourcesLoaded() {
    this.loaded = true;

    Game.orchestre.start();
    this.areas[0].activate();
    if (this.state == GameState.Loading) {
      await this.ui.hideLoading();
      await this.activatePlayer();
      this.state = GameState.Playing;
    }
  }

  private async onPressStart() {
    if (this.state === GameState.Title) {
      this.state = GameState.Loading;
      const uiPromise = this.ui.hideTitle(this.loaded);
      if (this.loaded) {
        await uiPromise;
        this.activatePlayer();
        this.state = GameState.Playing;
      }
    }
  }

  private activatePlayer() {
    // TODO: show & activate player
    this.player.sprite.setDepth(1);
  }

  private validatePath(id: string) {
    const indicator = this.indicators.find((indic) => indic.id === id);
    if (indicator) {
      indicator.validate();
    }
    this.pathValidated += 1;

    if (this.pathValidated === this.paths.length) {
      // TODO: end game
    }

    if (this.pathValidated === 1) {
      this.borders.desactivate();
    }
  }

  private onBorderCollide() {
    this.sounds.play(Resources.Block);
    this.indicators[0].blink();
  }

  private winGame() {}
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#125555',
  width: 1024,
  height: 800,
  scene: Game,
  render: {
    pixelArt: true,
  },
  // zoom: 0.5,
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
    },
  },
};

const game = new Phaser.Game(config);
