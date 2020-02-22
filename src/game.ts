import 'phaser';
import Borders from './objects/Borders';
import CollisionManager from './objects/collisionManager';
import Path from './objects/path';
import Player from './objects/player';
import Walls from './objects/walls';
import pathsConfig from './utils/pathsConfig';
import { images, Resources } from './utils/resources';

export default class Game extends Phaser.Scene {
  private player: Player;
  private camera: Phaser.Cameras.Scene2D.Camera;
  private collisionsManager: CollisionManager;

  private paths: Path[] = [];
  private pathValidated = 0;
  private torchs: Phaser.GameObjects.Sprite[] = [];

  private bordersCollider: Phaser.Physics.Arcade.Collider;

  constructor() {
    super('game');
  }

  preload() {
    for (const image of images.keys()) {
      this.load.image(image, images.get(image));
    }
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.scrollX = -this.camera.centerX;
    this.camera.scrollY = -this.camera.centerY;

    this.add.sprite(0, 0, Resources.Background);

    this.player = new Player(this, 0, 0);

    this.collisionsManager = new CollisionManager(
      this.physics,
      this.player.sprite
    );

    // Debug only
    // this.camera.startFollow(this.player.sprite);

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

    this.player.sprite.setDepth(1);
  }

  update() {
    this.player.update();
    this.collisionsManager.update();
  }

  private validatePath() {
    this.torchs[this.pathValidated].setTexture(Resources.TorchOn);
    this.pathValidated += 1;

    if (this.pathValidated === this.paths.length) {
      // Open the gate!
      console.log('near the end of the game');
    }

    if (this.pathValidated === 1) {
      this.bordersCollider.active = false;
    }
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#125555',
  width: 1024,
  height: 800,
  scene: Game,
  physics: {
    default: 'arcade'
  }
};

const game = new Phaser.Game(config);
