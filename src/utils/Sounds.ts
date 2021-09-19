import { Gain, Player } from 'tone';
import { Resources, sounds } from './resources';

export default class Sounds {
  private players: { [key in Resources]?: Player } = {};
  private promises: Promise<void>[] = [];
  constructor() {
    const gain = new Gain(0.7).toDestination();
    for (const soundRes of sounds.keys()) {
      this.promises.push(
        new Promise((resolve) => {
          this.players[soundRes] = new Player(sounds.get(soundRes), () =>
            resolve()
          ).connect(gain);
          this.players[soundRes].autostart = false;
          this.players[soundRes].loop = false;
        })
      );
    }
  }

  async load() {
    await Promise.all(this.promises);
    return;
  }

  play(res: Resources) {
    const sound = this.players[res];
    if (sound) {
      sound.start();
    }
  }
}
