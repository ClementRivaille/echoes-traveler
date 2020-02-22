import { Resources } from './resources';

interface AreaConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  music: Resources;
}

const areasConfig: AreaConfig[] = [
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
export default areasConfig;
