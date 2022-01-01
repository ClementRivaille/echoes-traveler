import { yieldTimeout } from '../utils/animation';
import { PathId } from '../utils/pathsConfig';
import { Resources } from '../utils/resources';
import HintRadio from './hintRadio';

const GREY = 0x9b9b9b;
const RED = 0xda2657;
const BLUE = 0x47ebf7;
const GREEN = 0xc6f78f;

const SIZE = 46;
const INDICATOR_DEPTH = 2;

const STAY_DELAY = 1000;

export default class Indicator {
  private colorLight: Phaser.GameObjects.Sprite;
  private radio?: HintRadio;
  public validated = false;

  private coroutine = -1;
  private stayCallback?: () => void;

  constructor(
    game: Phaser.Scene,
    x: number,
    y: number,
    public readonly id: PathId,
    hint?: Resources[]
  ) {
    this.colorLight = game.add.sprite(x, y, Resources.IndicatorLightColor);
    const panel = game.add.sprite(x, y, Resources.IndicatorLight);
    this.colorLight.setDepth(INDICATOR_DEPTH);
    panel.setDepth(INDICATOR_DEPTH + 0.1);

    this.colorLight.displayWidth = SIZE;
    this.colorLight.displayHeight = SIZE;
    panel.displayWidth = SIZE;
    panel.displayHeight = SIZE;

    this.colorLight.tint = GREY;

    if (hint) {
      this.radio = new HintRadio(game, x, y, hint);
      this.radio.onEnter = () => this.setRadioState(true);
      this.radio.onExit = () => this.setRadioState(false);
    }
  }

  public load() {
    return this.radio ? this.radio.load() : Promise.resolve();
  }

  public validate() {
    this.colorLight.tint = GREEN;
    this.validated = true;
    if (this.radio) {
      this.radio.activated = false;
    }
  }

  public async blink() {
    const amount = 3;
    const delay = 120;

    for (const _i of Array(amount)) {
      this.colorLight.tint = RED;
      await yieldTimeout(delay);
      this.colorLight.tint = GREY;
      await yieldTimeout(delay);
    }
  }

  public watchStay(callback: () => void) {
    this.stayCallback = callback;
  }
  public unwatchStay() {
    delete this.stayCallback;
  }

  public activateRadio() {
    if (this.radio) {
      this.radio.activated = true;
    }
  }

  private setRadioState(value: boolean) {
    this.colorLight.tint = value ? BLUE : GREY;

    if (value && !!this.stayCallback) {
      this.coroutine = setTimeout(() => this.onStay(), STAY_DELAY);
    } else if (this.coroutine > -1) {
      clearTimeout(this.coroutine);
      this.coroutine = -1;
    }
  }

  private onStay() {
    if (this.stayCallback) {
      this.stayCallback();
    }
  }
}
