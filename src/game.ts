import { Orchestre } from 'orchestre-js';
import 'phaser';
import Area from './objects/area';
import Borders from './objects/Borders';
import CollisionManager from './objects/collisionManager';
import Exit from './objects/exit';
import HintRadio from './objects/hintRadio';
import Indicator from './objects/indicator';
import Path from './objects/path';
import Player from './objects/player';
import SoundEmitter from './objects/soundEmitter';
import World from './objects/world';
import { areasConfig, soundEmittersConfig } from './utils/audioConfig';
import Instruments from './utils/instruments';
import pathsConfig from './utils/pathsConfig';
import { images, Resources } from './utils/resources';
import Sounds from './utils/Sounds';

export default class Game extends Phaser.Scene {
  private player: Player;
  private camera: Phaser.Cameras.Scene2D.Camera;

  private paths: Path[] = [];
  private pathValidated = 0;
  private indicators: Indicator[] = [];

  private bordersCollider: Phaser.Physics.Arcade.Collider;

  private exit: Exit;

  private soundEmitters: SoundEmitter[];
  private instruments: Instruments;
  private sounds: Sounds;
  private world: World;

  public static orchestre: Orchestre;
  public static collisionsManager: CollisionManager;
  public static context: AudioContext;

  constructor() {
    super('game');
  }

  preload() {
    for (const image of images.keys()) {
      this.load.image(image, images.get(image));
    }
  }

  async create() {
    this.camera = this.cameras.main;
    this.camera.scrollX = -this.camera.centerX;
    this.camera.scrollY = -this.camera.centerY;

    this.add.sprite(0, 0, Resources.Background);

    this.player = new Player(this, 0, 0);
    this.world = new World(this.player);

    Game.collisionsManager = new CollisionManager(
      this.physics,
      this.player.sprite
    );

    Game.context = new AudioContext();
    Game.orchestre = new Orchestre(110, Game.context);
    const musicLoading: Promise<void>[] = [];
    const areas = areasConfig.map((areaConfig) => {
      const area = new Area(
        this,
        areaConfig.x,
        areaConfig.y,
        areaConfig.width,
        areaConfig.height,
        areaConfig.music,
        areaConfig.measure
      );
      musicLoading.push(area.load());
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
      musicLoading.push(emitter.load());
      return emitter;
    });
    this.instruments = new Instruments();
    musicLoading.push(this.instruments.load());
    this.sounds = new Sounds();
    musicLoading.push(this.sounds.load());

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
      const indicator = new Indicator(this,
        pathConfig.torchX,
        pathConfig.torchY,
        pathConfig.id,
        pathConfig.hint
      );
      this.indicators.push(indicator);
      if (pathConfig.hint) {
        musicLoading.push(indicator.load());
      }
    }

    await Promise.all(musicLoading);
    Game.orchestre.start();
    areas[0].activate();

    const borders = new Borders(this, this.camera.width, this.camera.height);
    this.bordersCollider = this.physics.add.collider(
      borders.group,
      this.player.sprite
    );
    // Early exit for debug
    this.bordersCollider.active = false;

    this.exit = new Exit(this, 0, -300, Game.collisionsManager);

    this.player.sprite.setDepth(1);
  }

  update() {
    this.player.update();
    this.world.update();
    Game.collisionsManager.update();
    this.soundEmitters.forEach((emitter) => emitter.update());
  }

  private validatePath(id: string) {
    const indicator = this.indicators.find(indic => indic.id === id);
    if (indicator) {
      indicator.validate();
    }
    this.pathValidated += 1;

    if (this.pathValidated === this.paths.length) {
      this.exit.open(() => this.winGame());
    }

    if (this.pathValidated === 1) {
      this.bordersCollider.active = false;
    }
  }

  winGame() {}
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#125555',
  width: 1024,
  height: 800,
  scene: Game,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
};

const game = new Phaser.Game(config);
