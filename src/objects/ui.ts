import { promisifyTween, yieldTimeout } from '../utils/animation';
import { DialogName, dialogs } from '../utils/dialogs';
import { Font, loadFonts } from '../utils/fonts';

const UI_DEPTH = 10;
const DIALOG_FADEIN = 600;
const DIALOG_FADEOUT = 400;
const DIALOG_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontSize: '40px',
  fontFamily: Font.ldcBlackRound,
};

interface TextTweens {
  loading?: Phaser.Tweens.Tween;
  dialogs?: Phaser.Tweens.Tween;
}

export default class UI {
  private loading: Phaser.GameObjects.Text;
  private blackScreen: Phaser.GameObjects.Rectangle;
  private loadingInterval: number;

  private title: Phaser.GameObjects.Text;
  private pressStart: Phaser.GameObjects.Text;
  private subdialog: Phaser.GameObjects.Text;

  private top: Phaser.GameObjects.Text;
  private bottom: Phaser.GameObjects.Text;

  private tweens: TextTweens = {};
  private displayedDialog?: DialogName;

  constructor(private game: Phaser.Scene) {
    this.loading = this.initText(0, 50, 'Loading', {
      fontSize: '30px',
      fontFamily: 'sans-serif',
    });
    this.blackScreen = game.add.rectangle(
      0,
      0,
      game.renderer.width,
      game.renderer.height,
      0x000000,
      0.6
    );
    this.blackScreen.setDepth(UI_DEPTH - 1);
  }

  init() {
    // Refresh loading font
    this.loading.style.setFontFamily(Font.ataristocrat);
    this.loading.alpha = 0;
    this.blackScreen.alpha = 0;

    this.title = this.initText(0, -150, 'Echoes Traveler', {
      fontFamily: Font.adventurer,
      fontSize: '110px',
    });
    this.title.setShadow(-5, 10, '#00000022', 6);
    this.pressStart = this.initText(0, 120, 'Press Enter to begin', {
      fontSize: '50px',
    });
    this.pressStart.setShadow(-5, 5, '#00000022', 2);
    this.subdialog = this.initText(0, 300, 'Better played with headphones!', {
      fontSize: '32px',
    });
    this.subdialog.setShadow(-2, 2, '#00000022', 2);
    this.subdialog.setAlpha(0.4);

    this.top = this.initText(0, -320, '', DIALOG_STYLE);
    this.top.setShadow(-6, 6, '#00000022', 2);
    this.bottom = this.initText(0, 320, '', DIALOG_STYLE);
    this.bottom.setShadow(-6, 6, '#00000022', 2);
    this.top.alpha = 0;
    this.bottom.alpha = 0;
  }

  hideTitle(loaded: boolean) {
    const titleTweenPromise = this.fadeOutTitle();
    if (!loaded) {
      this.loadingInterval = setInterval(() => this.animateLoading(), 300);
      this.tweens.loading = this.fadeText([this.loading], true, 300);
    }

    return titleTweenPromise;
  }

  async showFirstSteps() {
    this.loadDialog(DialogName.FirstSteps);
    this.displayedDialog = DialogName.FirstSteps;
    await promisifyTween(this.fadeText([this.top], true, DIALOG_FADEIN));
    await yieldTimeout(2500);
    // If interrupted, stop
    if (this.displayedDialog !== DialogName.FirstSteps) return;
    this.tweens.dialogs = this.fadeText([this.bottom], true, DIALOG_FADEIN);
    try {
      await promisifyTween(this.tweens.dialogs);
      delete this.tweens.dialogs;
    } catch (e) {}
  }

  async showDialog(dialog: DialogName, last = false) {
    try {
      this.displayedDialog = dialog;

      // Stop current tweens
      if (this.tweens.dialogs) {
        this.tweens.dialogs.stop();
      }

      // Fade out displayed text
      if (this.top.alpha > 0) {
        await this.fadeDialog(false);
      }

      // Show new text
      this.loadDialog(dialog);
      await this.fadeDialog(true);

      if (last) {
        // Hide dialogs
        await yieldTimeout(5000);
        if (this.displayedDialog !== dialog) return;

        await this.fadeDialog(false);
        delete this.displayedDialog;
      }

      delete this.tweens.dialogs;
    } catch (e) {}
  }

  async hideLoading() {
    clearInterval(this.loadingInterval);
    if (this.tweens.loading && this.tweens.loading.isPlaying()) {
      this.tweens.loading.stop();
    }
    this.tweens.loading = this.fadeText([this.loading], false, 200);
    return promisifyTween(this.tweens.loading);
  }

  async showCredits(x: number, y: number) {
    const thanks = this.initText(x, y - 200, 'Thank you for playing', {
      ...DIALOG_STYLE,
      fontSize: '50px',
    });
    thanks.setAlpha(0);
    thanks.setShadow(4, 4, '#00000044', 4);

    this.game.tweens.add({
      targets: [thanks],
      alpha: 1,
      duration: DIALOG_FADEIN,
      ease: 'Sine.easeInOut',
    });

    await yieldTimeout(2000);

    const writtenBy = this.initText(x, y + 100, 'Composed and developed by', {
      fontFamily: Font.ataristocrat,
      fontSize: '32px',
    });
    const itooh = this.initText(x, y + 140, 'Itooh', {
      fontFamily: Font.ataristocrat,
      fontSize: '64px',
    });
    const assets = this.initText(
      x,
      y + 250,
      '“Pixel Art Top Down Basic” assets pack by Cairo',
      {
        fontFamily: Font.ataristocrat,
        fontSize: '32px',
      }
    );
    writtenBy.setAlpha(0);
    itooh.setAlpha(0);
    assets.setAlpha(0);
    writtenBy.setShadow(4, 4, '#00000044', 4);
    itooh.setShadow(4, 4, '#00000044', 4);
    assets.setShadow(4, 4, '#00000044', 4);

    this.game.tweens.add({
      targets: [writtenBy, itooh, assets],
      alpha: 1,
      duration: 2000,
      ease: 'Sine.easeInOut',
    });
  }

  private fadeText(
    texts: Phaser.GameObjects.GameObject[],
    toIn: boolean,
    duration: number
  ): Phaser.Tweens.Tween {
    return this.game.tweens.add({
      targets: texts,
      alpha: toIn ? 1 : 0,
      ease: toIn ? 'Sine.easeInOut' : 'Sine.easeIn',
      duration,
    });
  }

  private fadeOutTitle() {
    return promisifyTween(
      this.fadeText([this.title, this.pressStart, this.subdialog], false, 500)
    );
  }

  private animateLoading() {
    this.loading.setText(
      this.loading.text.endsWith('...') ? 'Loading' : this.loading.text + '.'
    );
  }

  private initText(
    x: number,
    y: number,
    text: string,
    style: Phaser.Types.GameObjects.Text.TextStyle
  ) {
    const textObj = this.game.add.text(x, y, text, {
      fontFamily: Font.ataristocrat,
      color: 'white',
      align: 'center',
      ...style,
    });
    textObj.setDepth(UI_DEPTH);
    textObj.setOrigin(0.5, 0.5);
    textObj.setPadding(16);
    return textObj;
  }

  private loadDialog(name: DialogName) {
    const dialog = dialogs[name];
    this.top.setText(dialog.top);
    this.bottom.setText(dialog.bottom);
  }

  private async fadeDialog(toIn) {
    this.tweens.dialogs = this.fadeText(
      [this.top, this.bottom],
      toIn,
      toIn ? DIALOG_FADEIN : DIALOG_FADEOUT
    );
    await promisifyTween(this.tweens.dialogs);
  }
}
