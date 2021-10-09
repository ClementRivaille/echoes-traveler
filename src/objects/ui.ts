import { Font, loadFonts } from '../utils/fonts';

const UI_DEPTH = 10;

export default class UI {
  private loading: Phaser.GameObjects.Text;
  private blackScreen: Phaser.GameObjects.Rectangle;
  private loadingInterval: NodeJS.Timeout;

  private title: Phaser.GameObjects.Text;
  private pressStart: Phaser.GameObjects.Text;

  private top: Phaser.GameObjects.Text;
  private bottom: Phaser.GameObjects.Text;

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
    this.pressStart = this.initText(0, 150, 'Press Enter to begin', {
      fontSize: '50px',
    });

    this.top = this.initText(0, -300, '', {
      fontSize: '80px',
    });
    this.bottom = this.initText(0, 300, '', {
      fontSize: '80px',
    });
    this.top.alpha = 0;
    this.bottom.alpha = 0;
  }

  hideTitle(loaded: boolean) {
    const titleTweenPromise = this.fadeOutTitle();
    if (!loaded) {
      this.loadingInterval = setInterval(() => this.animateLoading(), 300);
      this.fadeText([this.loading], true, 300);
    }

    return titleTweenPromise;
  }

  hideLoading() {
    clearInterval(this.loadingInterval);
    return this.fadeText([this.loading], false, 200);
  }

  private fadeText(
    texts: Phaser.GameObjects.GameObject[],
    toIn: boolean,
    duration: number
  ) {
    return new Promise<void>((resolve) => {
      this.game.tweens.add({
        targets: texts,
        alpha: toIn ? 1 : 0,
        ease: toIn ? 'Sine.easeInOut' : 'Sine.easeIn',
        duration,
        onComplete: resolve,
      });
    });
  }

  private fadeOutTitle() {
    return this.fadeText([this.title, this.pressStart], false, 500);
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
      ...style,
      color: 'white',
      align: 'center',
    });
    textObj.setDepth(UI_DEPTH);
    textObj.setOrigin(0.5, 0.5);
    return textObj;
  }
}
