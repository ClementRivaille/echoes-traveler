import { Directions } from '../objects/path';

interface PahtConfig {
  x: number;
  y: number;
  directions: Directions[];
  torchX: number;
  torchY: number;
}

const pathsConfig: PahtConfig[] = [
  {
    x: -190,
    y: 100,
    directions: [
      Directions.Down,
      Directions.Right,
      Directions.Right,
      Directions.Right,
      Directions.Up,
      Directions.Up
    ],
    torchX: -100,
    torchY: -100
  }
];
export default pathsConfig;
