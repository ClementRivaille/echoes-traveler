import { Resources } from './resources';
import { UNIT } from '../objects/area';
import { MIDDLE_RANGE, LONG_RANGE, SHORT_RANGE } from '../objects/soundEmitter';

interface AreaConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  music: Resources;
  measure: number;
}

export const areasConfig: AreaConfig[] = [
  {
    x: 0,
    y: 0,
    width: 3,
    height: 3,
    music: Resources.Bg1,
    measure: 16,
  },
  {
    x: 3,
    y: -1.5,
    width: 3,
    height: 6,
    music: Resources.city_bg,
    measure: 8,
  },
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
    x: (areasConfig[1].x + 0.4) * UNIT,
    y: (areasConfig[1].y - 2) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_A_melody_cello,
    length: 8,
  },
  {
    x: (areasConfig[1].x - 0.6) * UNIT,
    y: (areasConfig[1].y - 1.5) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_A_melody_marimba,
    length: 16,
  },
  {
    x: (areasConfig[1].x - 0.8) * UNIT,
    y: (areasConfig[1].y - 2.2) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_A_melody_piano_f,
    length: 16,
  },
  {
    x: (areasConfig[1].x + 0.5) * UNIT,
    y: (areasConfig[1].y - 1.4) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_A_melody_piano_p,
    length: 16,
  },
  {
    x: (areasConfig[1].x + 0) * UNIT,
    y: (areasConfig[1].y - 2.5) * UNIT,
    range: SHORT_RANGE,
    sound: Resources.city_A_melody_vibra,
    length: 16,
  },
  {
    x: (areasConfig[1].x + 1) * UNIT,
    y: (areasConfig[1].y - 2.1) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_A_melody_violin,
    length: 16,
  },
  {
    x: (areasConfig[1].x + 0.2) * UNIT,
    y: (areasConfig[1].y + 2.1) * UNIT,
    range: SHORT_RANGE,
    sound: Resources.city_chord_A,
    length: 16,
  },
  {
    x: (areasConfig[1].x + 0.6) * UNIT,
    y: (areasConfig[1].y + 0.1) * UNIT,
    range: SHORT_RANGE,
    sound: Resources.city_chord_F,
    length: 16,
  },
  {
    x: (areasConfig[1].x - 0.3) * UNIT,
    y: (areasConfig[1].y - 2.1) * UNIT,
    range: SHORT_RANGE,
    sound: Resources.city_chord_G,
    length: 16,
  },
  {
    x: (areasConfig[1].x - 0.9) * UNIT,
    y: (areasConfig[1].y + 2.3) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_D_melody_cello,
    length: 8,
  },
  {
    x: (areasConfig[1].x - 0.1) * UNIT,
    y: (areasConfig[1].y + 1.5) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_D_melody_ethan,
    length: 16,
  },
  {
    x: (areasConfig[1].x + 0.7) * UNIT,
    y: (areasConfig[1].y + 2.2) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_D_melody_piano,
    length: 8,
  },
  {
    x: (areasConfig[1].x + 0.6) * UNIT,
    y: (areasConfig[1].y + 1.4) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_D_melody_violins,
    length: 8,
  },
  {
    x: (areasConfig[1].x - 0.9) * UNIT,
    y: (areasConfig[1].y + 0.7) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_F_melody_ethan,
    length: 8,
  },
  {
    x: (areasConfig[1].x + 0.6) * UNIT,
    y: (areasConfig[1].y + 0.3) * UNIT,
    range: LONG_RANGE,
    sound: Resources.city_F_melody_piano_1,
    length: 16,
  },
  {
    x: (areasConfig[1].x + 0.2) * UNIT,
    y: (areasConfig[1].y - 0.1) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_F_melody_piano_2,
    length: 16,
  },
  {
    x: (areasConfig[1].x + 0.8) * UNIT,
    y: (areasConfig[1].y - 0.6) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_F_melody_piano_3,
    length: 16,
  },
  {
    x: (areasConfig[1].x - 0.4) * UNIT,
    y: (areasConfig[1].y - 0.2) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_F_melody_vibra,
    length: 16,
  },
  {
    x: (areasConfig[1].x - 0.6) * UNIT,
    y: (areasConfig[1].y - 1) * UNIT,
    range: LONG_RANGE,
    sound: Resources.city_marimba_bg_CA,
    length: 4,
  },
  {
    x: (areasConfig[1].x - 0.5) * UNIT,
    y: (areasConfig[1].y + 0) * UNIT,
    range: LONG_RANGE,
    sound: Resources.city_marimba_bg_F,
    length: 4,
  },
  {
    x: (areasConfig[1].x + -0.5) * UNIT,
    y: (areasConfig[1].y + 1) * UNIT,
    range: LONG_RANGE,
    sound: Resources.city_marimba_bg_G,
    length: 4,
  },
  {
    x: (areasConfig[1].x - 0.2) * UNIT,
    y: (areasConfig[1].y - 1.8) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_marimba_rtm_A,
    length: 9,
  },
  {
    x: (areasConfig[1].x + 0.5) * UNIT,
    y: (areasConfig[1].y + 1.7) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_marimba_rtm_F_2,
    length: 17,
  },
  {
    x: (areasConfig[1].x - 0.6) * UNIT,
    y: (areasConfig[1].y + 2.2) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_piano_rtm_F_2,
    length: 17,
  },
  {
    x: (areasConfig[1].x + 0.1) * UNIT,
    y: (areasConfig[1].y + 0.3) * UNIT,
    range: LONG_RANGE,
    sound: Resources.city_piano_rtm_F,
    length: 8,
  },
  {
    x: (areasConfig[1].x + 0.8) * UNIT,
    y: (areasConfig[1].y + 2.2) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_violin_bg_D,
    length: 4,
  },
  {
    x: (areasConfig[1].x + -0.5) * UNIT,
    y: (areasConfig[1].y + 0.7) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_violin_bg_F,
    length: 4,
  },
  {
    x: (areasConfig[1].x + 0.7) * UNIT,
    y: (areasConfig[1].y - 2.3) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_violin_bg_GA,
    length: 4,
  },
  {
    x: (areasConfig[1].x - 1) * UNIT,
    y: (areasConfig[1].y + 2.6) * UNIT,
    range: SHORT_RANGE,
    sound: Resources.city_violins_rtm_D,
    length: 4,
  },
  {
    x: (areasConfig[1].x + 1) * UNIT,
    y: (areasConfig[1].y - 0.3) * UNIT,
    range: SHORT_RANGE,
    sound: Resources.city_winds_E_p,
    length: 12,
  },
  {
    x: (areasConfig[1].x + 1.1) * UNIT,
    y: (areasConfig[1].y - 0.1) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_winds_E_w,
    length: 12,
  },
  {
    x: (areasConfig[1].x - 1.1) * UNIT,
    y: (areasConfig[1].y - 2.1) * UNIT,
    range: SHORT_RANGE,
    sound: Resources.city_winds_FG,
    length: 16,
  },
  {
    x: (areasConfig[1].x + 0.7) * UNIT,
    y: (areasConfig[1].y + 1.3) * UNIT,
    range: SHORT_RANGE,
    sound: Resources.city_winds_GE_p,
    length: 12,
  },
  {
    x: (areasConfig[1].x + 0.4) * UNIT,
    y: (areasConfig[1].y + 1.5) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_winds_GE_w,
    length: 12,
  },
  {
    x: (areasConfig[1].x + 0) * UNIT,
    y: (areasConfig[1].y + 2.5) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_xylophone_rtm_F_2,
    length: 17,
  },
  {
    x: (areasConfig[1].x - 1) * UNIT,
    y: (areasConfig[1].y - 0.2) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_xylophone_rtm_F,
    length: 8,
  },
  {
    x: (areasConfig[1].x - 0.8) * UNIT,
    y: (areasConfig[1].y - 2.2) * UNIT,
    range: MIDDLE_RANGE,
    sound: Resources.city_xylo_rtm_A,
    length: 9,
  },
];