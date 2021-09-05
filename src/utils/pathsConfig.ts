import { UNIT } from '../objects/area';
import { Directions } from '../objects/path';
import { TILE_SIZE } from '../objects/tile';
import { areasConfig } from './audioConfig';
import { Resources } from './resources';

interface PahtConfig {
  x: number;
  y: number;
  directions: Directions[];
  torchX: number;
  torchY: number;
  hint?: Resources;
}

const TORCH_POSITION = 200;

const pathsConfig: PahtConfig[] = [
  {
    x: -TILE_SIZE,
    y: -TILE_SIZE,
    directions: [
      Directions.Right,
      Directions.Right,
      Directions.Down,
      Directions.Down,
      Directions.Left,
      Directions.Left,
      Directions.Up,
    ],
    torchX: 0,
    torchY: 0,
  },
  {
    x: areasConfig[4].x * UNIT,
    y: areasConfig[4].y * UNIT,
    directions: [
      Directions.Right,
      Directions.Down,
      Directions.Down,
      Directions.Left,
      Directions.Left,
      Directions.Up,
      Directions.Right,
    ],
    torchX: TORCH_POSITION,
    torchY: TORCH_POSITION,
    hint: Resources.desert_B_terje,
  },
  {
    x: (areasConfig[3].x - 1) * UNIT,
    y: (areasConfig[3].y - 0.8) * UNIT,
    directions: [
      Directions.Down,
      Directions.Right,
      Directions.Up,
      Directions.Up,
      Directions.Left,
      Directions.Up,
      Directions.Right,
    ],
    torchX: -TORCH_POSITION,
    torchY: TORCH_POSITION,
    hint: Resources.sea_B_synth,
  },
  {
    x: (areasConfig[1].x - 0.4) * UNIT,
    y: (areasConfig[1].y - 2.3) * UNIT,
    directions: [
      Directions.Down,
      Directions.Right,
      Directions.Down,
      Directions.Right,
      Directions.Up,
      Directions.Right,
      Directions.Up,
    ],
    torchX: TORCH_POSITION,
    torchY: -TORCH_POSITION,
    hint: Resources.city_A_melody_vibra,
  },
  {
    x: (areasConfig[2].x + 2) * UNIT,
    y: (areasConfig[2].y + 0.2) * UNIT,
    directions: [
      Directions.Up,
      Directions.Up,
      Directions.Left,
      Directions.Down,
      Directions.Left,
      Directions.Down,
      Directions.Right,
    ],
    torchX: -TORCH_POSITION,
    torchY: -TORCH_POSITION,
    hint: Resources.hub_celtic_clue,
  },
];
export default pathsConfig;
