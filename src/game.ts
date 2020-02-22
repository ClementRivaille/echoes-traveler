import 'phaser';
import Borders from './objects/Borders';
import CollisionManager from './objects/collisionManager';
import Path from './objects/path';
import Player from './objects/player';
import Walls from './objects/walls';
import pathsConfig from './utils/pathsConfig';
import { images, Resources, musics } from './utils/resources';
import Exit from './objects/exit';
import Orchestre from 'orchestre-js';
import { areasConfig, soundEmittersConfig } from './utils/audioConfig';
import Area from './objects/area';
import SoundEmitter from './objects/soundEmitter';

export default class Game extends Phaser.Scene {
  private player: Player;
  private camera: Phaser.Cameras.Scene2D.Camera;
  private collisionsManager: CollisionManager;

  private paths: Path[] = [];
  private pathValidated = 0;
  private torchs: Phaser.GameObjects.Sprite[] = [];

  private bordersCollider: Phaser.Physics.Arcade.Collider;

  private exit: Exit;

  private orchestre: Orchestre;
  private soundEmitters: SoundEmitter[];

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

    this.collisionsManager = new CollisionManager(
      this.physics,
      this.player.sprite
    );

    this.orchestre = new Orchestre(120);
    const musicLoading: Promise<void>[] = [];
    const areas = areasConfig.map(areaConfig => {
      const area = new Area(
        this,
        this.orchestre,
        this.collisionsManager,
        areaConfig.x,
        areaConfig.y,
        areaConfig.width,
        areaConfig.height,
        areaConfig.music
      );
      musicLoading.push(area.load());
      return area;
    });
    this.soundEmitters = soundEmittersConfig.map(emitterConfig => {
      const emitter = new SoundEmitter(
        this,
        this.collisionsManager,
        this.orchestre,
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
    await Promise.all(musicLoading);
    this.orchestre.start();
    areas[0].activate();

    // Debug only
    this.camera.startFollow(this.player.sprite);

    for (const pathConfig of pathsConfig) {
      this.paths.push(
        new Path(
          this,
          pathConfig.x,
          pathConfig.y,
          pathConfig.directions,
          this.collisionsManager,
          () => this.validatePath()
        )
      );
      this.torchs.push(
        this.add.sprite(
          pathConfig.torchX,
          pathConfig.torchY,
          Resources.TorchOff
        )
      );
    }

    const walls = new Walls(this);
    this.physics.add.collider(walls.group, this.player.sprite);
    const borders = new Borders(this, this.camera.width, this.camera.height);
    this.bordersCollider = this.physics.add.collider(
      borders.group,
      this.player.sprite
    );

    this.exit = new Exit(this, 0, -300, this.collisionsManager);

    this.player.sprite.setDepth(1);
  }

  update() {
    this.player.update();
    this.collisionsManager.update();
    this.soundEmitters.forEach(emitter => emitter.update());
  }

  private validatePath() {
    this.torchs[this.pathValidated].setTexture(Resources.TorchOn);
    this.pathValidated += 1;

    if (this.pathValidated === this.paths.length) {
      this.exit.open(() => this.winGame());
    }

    if (this.pathValidated === 1) {
      this.bordersCollider.active = false;
    }
  }

  winGame() {
    console.log(`C'est fini les amis !`);
  }
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
      debug: true
    }
  }
};

const game = new Phaser.Game(config);
