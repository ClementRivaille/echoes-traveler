import { Resources } from "../utils/resources";
import HintRadio from './hintRadio'

const GREY = 0x8ab7b4;
const RED = 0xe93a60;
const BLUE = 0x47ebf7;
const GREEN = 0xc6f78f;

export default class Indicator {

  private colorLight: Phaser.GameObjects.Sprite
  private radio?: HintRadio;
  private validated = false;

  constructor(game: Phaser.Scene, x: number, y: number, public id: string, hint?: Resources[]) {
    this.colorLight = game.add.sprite(x, y, Resources.IndicatorLightColor);
    const panel = game.add.sprite(x, y, Resources.IndicatorLight);

    this.colorLight.scale = 0.6;
    panel.scale = 0.6;

    this.colorLight.tint = GREY;

    if (hint) {
      this.radio = new HintRadio(
        game,
        x, y,
        hint,
      );
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
    this.radio.activated = false;
  }

  private setRadioState(value: boolean) {
    this.colorLight.tint = value ? BLUE : GREY;
  }
}