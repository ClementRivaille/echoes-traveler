import { Resources } from './resources';
import { UNIT } from '../objects/area';
import { MIDDLE_RANGE, LONG_RANGE } from '../objects/soundEmitter';

interface AreaConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  music: Resources;
}

export const areasConfig: AreaConfig[] = [
  {
    x: 0,
    y: 0,
    width: 3,
    height: 3,
    music: Resources.Bg1
  },
  {
    x: -1.5,
    y: -3,
    width: 6,
    height: 3,
    music: Resources.Bg2
  }
];

interface EmitterConfig {
  x: number;
  y: number;
  range: number;
  sound: Resources;
  length: number;
}

export const soundEmittersConfig: EmitterConfig[] = [
  {
    x: -1 * UNIT,
    y: 400,
    range: MIDDLE_RANGE,
    sound: Resources.Birds,
    length: 16
  },
  {
    x: 300,
    y: -1.4 * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.Monkeys,
    length: 16
  },
  {
    x: -2.1 * UNIT,
    y: -3 * UNIT,
    range: LONG_RANGE,
    sound: Resources.Reader,
    length: 16
  }
];
