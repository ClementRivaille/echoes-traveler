import 'phaser';
import { images, Resources } from './utils/resources';
import Player from './objects/player';

export default class Game extends Phaser.Scene {
  private player: Player;
  private camera: Phaser.Cameras.Scene2D.Camera;

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

    // Debug only
    // this.camera.startFollow(this.player.sprite);
  }

  update() {
    this.player.update();
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
