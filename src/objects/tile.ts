import 'phaser';
import { Resources } from '../utils/resources';
import CollisionManager from './collisionManager';

export const TILE_SIZE = 96;
const ZONE_SIZE = TILE_SIZE - 20;
const STEP_COLOR = 'rgba(100,100,100, 1)';

export enum TileState {
  Inactive,
  Hint,
  Validation,
  Validated,
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
    collisionManager: CollisionManager,
    private onEnterCallback: (value: number, state: TileState) => void,
    private onExitCallback: (value: number, state: TileState) => void
  ) {
    this.sprite = game.add.sprite(x, y, Resources.TileNeutral);
    this.sprite.displayWidth = TILE_SIZE;
    this.sprite.displayHeight = TILE_SIZE;
    this.zone = game.add.zone(x, y, ZONE_SIZE, ZONE_SIZE);
    this.text = game.add.text(x, y, `${value}`, {
      fontSize: 40,
      align: 'center',
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
    this.onEnterCallback(this.value, this.state);
  }

  private onExit() {
    this.steppedOn = false;
    this.onExitCallback(this.value, this.state);
  }

  public setState(state: TileState) {
    this.state = state;

    this.text.setColor('#ffffff');
    this.sprite.tint = 0xffffff;

    if (this.state === TileState.Inactive) {
      this.sprite.setTexture(Resources.TileNeutral);
    } else if (this.state === TileState.Hint) {
      this.text.setColor(STEP_COLOR);
      this.sprite.tint = 0x100100100;
    } else if (this.state === TileState.Validation) {
      this.text.setColor(STEP_COLOR);
      this.sprite.setTexture(
        this.steppedOn ? Resources.TileValidating : Resources.TileValidated
      );
    } else if (this.state === TileState.Validated) {
      this.sprite.setTexture(Resources.TileValidated);
    }
  }

  public isSteppedOn() {
    return this.steppedOn;
  }
  public getState() {
    return this.state;
  }
}
