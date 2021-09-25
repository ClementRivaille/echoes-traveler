import 'phaser';
import Game from '../game';
import { Resources } from '../utils/resources';

export const TILE_SIZE = 108;
const INNER_ZONE_SIZE = TILE_SIZE - 34;

const NUMBER_SPRITES: Resources[] = [
  Resources.TileFill, //(that's just to put something at index 0)
  Resources.TileNumber1,
  Resources.TileNumber2,
  Resources.TileNumber3,
  Resources.TileNumber4,
  Resources.TileNumber5,
  Resources.TileNumber6,
  Resources.TileNumber7,
  Resources.TileNumber8
]

const ACTIVE_COLOR = 0x7fe155; // light green
const FILL_COLOR = 0x62e1e5; // light blue
const COMPLETE_COLOR = 0x2ebf23; // green

const ACTIVATION_DELAY = 200;
const FADE_OUT_DELAY = 4000;

export enum TileState {
  Inactive,
  Hint,
  Validation,
  Validated,
  Completed
}

export default class Tile {
  private zone: Phaser.GameObjects.Zone;
  private innerZone: Phaser.GameObjects.Zone;

  private shape: Phaser.GameObjects.Sprite;
  private fill: Phaser.GameObjects.Sprite;
  private number: Phaser.GameObjects.Sprite;

  private steppedOn: boolean = false;
  private state: TileState = TileState.Inactive;

  constructor(
    private game: Phaser.Scene,
    private value: number,
    x: number,
    y: number,
    private onEnterCallback: (value: number, state: TileState) => void,
    private onExitCallback: (value: number, state: TileState) => void
  ) {
    this.fill = this.initSprite(game, x, y, Resources.TileFill)
    this.shape = this.initSprite(game, x, y, Resources.TileShape)
    this.number = this.initSprite(game, x, y, NUMBER_SPRITES[value])

    this.zone = game.add.zone(x, y, TILE_SIZE, TILE_SIZE);
    this.innerZone = game.add.zone(x, y, INNER_ZONE_SIZE, INNER_ZONE_SIZE);

    game.physics.world.enable(this.zone);
    Game.collisionsManager.addOverlap(
      this.zone,
      () => { },
      () => this.onExit()
    );
    Game.collisionsManager.addOverlap(
      this.innerZone,
      () => this.onEnter(),
      () => { }
    );
  }

  private initSprite(game: Phaser.Scene, x: number, y: number, res: Resources): Phaser.GameObjects.Sprite {
    const sprite = game.add.sprite(x, y, res);
    sprite.displayWidth = TILE_SIZE;
    sprite.displayHeight = TILE_SIZE;
    sprite.alpha = 0.0;
    return sprite;
  }

  private onEnter() {
    this.steppedOn = true;
    this.onEnterCallback(this.value, this.state);
  }

  private onExit() {
    this.steppedOn = false;
    this.onExitCallback(this.value, this.state);
  }

  public setState(newState: TileState) {
    if (newState === TileState.Inactive && this.state !== TileState.Inactive) {
      this.game.tweens.add({
        targets: [this.shape, this.number, this.fill],
        alpha: 0,
        ease: 'Sine.easeIn',
        duration: ACTIVATION_DELAY
      })
    } else if (newState === TileState.Hint) {
      if (this.shape.alpha < 1) {
        this.game.tweens.add({
          targets: [this.shape, this.number,],
          alpha: 1,
          ease: 'Sine.easeInOut',
          duration: ACTIVATION_DELAY
        })
      }
      this.shape.tint = ACTIVE_COLOR
      this.number.tint = ACTIVE_COLOR
    } else if (newState === TileState.Validation) {
      if (this.shape.alpha < 1) {
        this.game.tweens.add({
          targets: [this.shape, this.number, this.fill],
          alpha: 1,
          ease: 'Sine.easeInOut',
          duration: ACTIVATION_DELAY
        })
      }
      this.fill.tint = FILL_COLOR
      this.shape.tint = this.steppedOn ? ACTIVE_COLOR : 0xffffff;
      this.number.tint = this.steppedOn ? ACTIVE_COLOR : 0xffffff;
    } else if (newState === TileState.Validated) {
      this.shape.tint = 0xffffff;
      this.number.tint = 0xffffff;
      this.shape.alpha = 0.7;
      this.number.alpha = 0.7;
    }
    else if (newState === TileState.Completed) {
      if (this.shape.alpha < 1) {
        this.game.tweens.add({
          targets: [this.shape, this.number, this.fill],
          alpha: 1,
          ease: 'Sine.easeInOut',
          duration: ACTIVATION_DELAY
        })
      }
      this.shape.tint = ACTIVE_COLOR;
      this.number.tint = ACTIVE_COLOR;
      this.fill.tint = COMPLETE_COLOR;
      this.game.tweens.add({
        targets: [this.shape, this.number, this.fill],
        alpha: 0,
        duration: FADE_OUT_DELAY,
        delay: ACTIVATION_DELAY,
        ease: "Sine.easeIn"
      })
    }

    this.state = newState;
    }

  public isSteppedOn() {
    return this.steppedOn;
  }
  public getState() {
    return this.state;
  }
}
