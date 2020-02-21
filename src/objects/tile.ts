import 'phaser';
import { Resources } from '../utils/resources';
import CollisionManager from './collisionManager';

export const TILE_SIZE = 64;
const STEP_COLOR = 'rgba(100,100,100, 1)';

export enum TileState {
  Inactive,
  Validation,
  Validated
}

export default class Tile {
  public zone: Phaser.GameObjects.Zone;
  private sprite: Phaser.GameObjects.Sprite;
  private text: Phaser.GameObjects.Text;

  private steppedOn: boolean = false;
  private state: TileState = TileState.Inactive;

  constructor(
    private game: Phaser.Scene,
    private value: number,
    x: number,
    y: number,
    collisionManager: CollisionManager
  ) {
    this.sprite = game.add.sprite(x, y, Resources.TileNeutral);
    this.zone = game.add.zone(x, y, TILE_SIZE, TILE_SIZE);
    this.text = game.add.text(x, y, `${value}`, {
      fontSize: 40,
      align: 'center'
    });
    this.text.setOrigin(0.5, 0.5);

    game.physics.world.enable(this.zone);
    collisionManager.addOverlap(
      this.zone,
      () => this.onEnter(),
      () => this.onExit()
    );
  }

  private onEnter() {
    this.steppedOn = true;

    if (this.state === TileState.Inactive) {
      this.text.setColor(STEP_COLOR);
      this.sprite.tint = 0x100100100;
    }
  }

  private onExit() {
    this.steppedOn = false;

    if (this.state === TileState.Inactive) {
      this.text.setColor('#ffffff');
      this.sprite.tint = 0xffffff;
    } else {
      this.sprite.tint = 0xffffff;
    }
  }

  public setState(state: TileState) {
    this.state = state;

    if (this.state === TileState.Inactive) {
      this.sprite.setTexture(Resources.TileNeutral);
    } else if (this.state === TileState.Validation) {
      this.sprite.setTexture(
        this.steppedOn ? Resources.TileValidating : Resources.TileValidated
      );
    } else {
      this.sprite.setTexture(Resources.TileValidated);
    }
  }
}
