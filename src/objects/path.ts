import 'phaser';
import Tile, { TILE_SIZE, TileState } from './tile';
import CollisionManager from './collisionManager';
import Instruments, { InstrumentType } from '../utils/instruments';
import Sounds from '../utils/Sounds';
import { Resources } from '../utils/resources';
import Game from '../game';

export enum Directions {
  Up,
  Down,
  Left,
  Right,
}

enum PathState {
  Inactive,
  Validation,
  Validated,
}

const NOTES = ['D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5'];

export default class Path {
  private tiles: Tile[];
  private state: PathState = PathState.Inactive;

  private step = 0;

  constructor(
    game: Phaser.Scene,
    x: number,
    y: number,
    directions: Directions[],
    private instruments: Instruments,
    private sounds: Sounds,
    private onValidateCallback: () => void
  ) {
    const firstTile = new Tile(
      game,
      1,
      x,
      y,
      (value, state) => this.onTileEnter(value, state),
      (value, state) => this.onTileExit(value, state)
    );

    let stepX = x;
    let stepY = y;
    this.tiles = [
      firstTile,
      ...directions.map((direction, index) => {
        if (direction === Directions.Up) {
          stepY -= TILE_SIZE;
        } else if (direction === Directions.Down) {
          stepY += TILE_SIZE;
        } else if (direction === Directions.Left) {
          stepX -= TILE_SIZE;
        } else if (direction === Directions.Right) {
          stepX += TILE_SIZE;
        }
        return new Tile(
          game,
          index + 2,
          stepX,
          stepY,
          (value, state) => this.onTileEnter(value, state),
          (value, state) => this.onTileExit(value, state)
        );
      }),
    ];
  }

  private onTileEnter(value: number, state: TileState) {
    // If path is not validated yet
    if (this.state !== PathState.Validated) {
      // Step on next step
      if (state === TileState.Inactive && value === this.step + 1) {
        // End path
        if (value === this.tiles.length) {
          this.validate();
        }
        // Path in validation
        else {
          this.tiles[this.step].setState(TileState.Validation);
        }

        // Validate previous tile
        if (this.step > 0) {
          this.tiles[this.step - 1].setState(TileState.Validated);
        }
        this.step += 1;
        this.instruments.play(
          NOTES[(value - 1) % NOTES.length],
          InstrumentType.Main
        );
        this.instruments.play(
          NOTES[(value - 1) % NOTES.length],
          InstrumentType.Second
        );

        // Initialise validation state
        if (this.state === PathState.Inactive) {
          this.state = PathState.Validation;
          const hintedTiles = this.tiles.filter(
            (tile) => tile.getState() === TileState.Hint
          );
          hintedTiles.forEach((tile) => tile.setState(TileState.Inactive));
        }
      }

      // Step on wrong tile
      else if (
        state === TileState.Inactive &&
        this.state === PathState.Validation &&
        value !== this.step + 1
      ) {
        // Break combo
        this.exitPath();
        this.hintTile(value - 1);
      } else if (
        this.state === PathState.Validation &&
        [TileState.Validated, TileState.Validation].includes(state)
      ) {
        this.instruments.play(
          NOTES[(value - 1) % NOTES.length],
          InstrumentType.Second
        );
      }

      // Step on a latter tile while inactive
      else if (this.state === PathState.Inactive) {
        this.hintTile(value - 1);
      }
    }
  }

  private onTileExit(value: number, state: TileState) {
    // Break if we are validating and the player isn't on any validated tile
    if (
      this.state === PathState.Validation &&
      this.tiles.findIndex(
        (tile) =>
          [TileState.Validated, TileState.Validation].includes(
            tile.getState()
          ) && tile.isSteppedOn()
      ) === -1
    ) {
      // BREAK
      this.exitPath();
    }

    // Clean hinted tiles
    if (
      this.state === PathState.Inactive &&
      this.tiles.findIndex((tile) => tile.isSteppedOn()) === -1
    ) {
      this.tiles.forEach((tile) => tile.setState(TileState.Inactive));
    }
  }

  private exitPath() {
    this.tiles.forEach((tile) => tile.setState(TileState.Inactive));
    this.step = 0;
    this.state = PathState.Inactive;
  }

  private hintTile(index) {
    this.tiles.forEach((tile) => tile.setState(TileState.Inactive));
    this.tiles[index].setState(TileState.Hint);
    this.instruments.play(NOTES[index % NOTES.length], InstrumentType.Second);
  }

  private validate() {
    this.state = PathState.Validated;
    this.tiles[this.step].setState(TileState.Validated);
    this.sounds.play(Resources.ValidatePath);
    this.onValidateCallback();
  }
}
