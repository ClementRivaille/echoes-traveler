import 'phaser';
import { isDefined, now } from 'tone';
export const MOBILE_TOUCH_MARGIN = 200;

interface TouchDirections {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

export class TouchInput {
  private pointers: Phaser.Input.Pointer[];

  constructor(private game: Phaser.Scene) {
    while (!isDefined(game.input.pointer1) || !isDefined(game.input.pointer2)) {
      game.input.addPointer();
    }
    this.pointers = [game.input.pointer1, game.input.pointer2];
  }

  public readTouchDirections(): TouchDirections {
    const pointerPositions = this.pointers
      .map((pointer) => (pointer.isDown ? pointer.position : undefined))
      .filter(isDefined);

    return {
      left: pointerPositions.some((pos) => pos.x <= MOBILE_TOUCH_MARGIN),
      right: pointerPositions.some(
        (pos) => pos.x >= this.game.renderer.width - MOBILE_TOUCH_MARGIN
      ),
      up: pointerPositions.some((pos) => pos.y <= MOBILE_TOUCH_MARGIN),
      down: pointerPositions.some(
        (pos) => pos.y >= this.game.renderer.height - MOBILE_TOUCH_MARGIN
      ),
    };
  }
}

export function isMobile() {
  return navigator.maxTouchPoints > 1;
}

/**
 * Prevent a sli
 * @returns
 */
export function nowWithoutDelay() {
  return Math.max(0, now() - 0.2);
}
