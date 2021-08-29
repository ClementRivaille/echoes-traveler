import { Directions } from '../objects/path';
import { TILE_SIZE } from '../objects/tile';

interface PahtConfig {
  x: number;
  y: number;
  directions: Directions[];
  torchX: number;
  torchY: number;
}

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
];
export default pathsConfig;
