import 'phaser';
import { images, Resources } from './utils/resources';
import Player from './objects/player';
import Tile from './objects/tile';
import CollisionManager from './objects/collisionManager';

export default class Game extends Phaser.Scene {
  private player: Player;
  private camera: Phaser.Cameras.Scene2D.Camera;
  private collisionsManager: CollisionManager;

  private tile: Tile;

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

    this.add.sprite(
      this.camera.centerX,
      this.camera.centerY,
      Resources.Background
    );

    this.player = new Player(this, this.camera.centerX, this.camera.centerY);

    this.collisionsManager = new CollisionManager(
      this.physics,
      this.player.sprite
    );

    // Debug only
    this.camera.startFollow(this.player.sprite);

    this.tile = new Tile(this, 0, 100, 100, this.collisionsManager);

    this.player.sprite.setDepth(1);
  }

  update() {
    this.player.update();
    this.collisionsManager.update();
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#125555',
  width: 800,
  height: 600,
  scene: Game,
  physics: {
    default: 'arcade'
  }
};

const game = new Phaser.Game(config);
