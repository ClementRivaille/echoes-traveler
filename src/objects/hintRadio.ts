import 'phaser';
import { connect, Filter, FilterOptions, getContext, Noise } from 'tone';
import Game from '../game';
import { soundEmittersConfig } from '../utils/audioConfig';
import { musics, Resources } from '../utils/resources';

const RANGE = 80;
const HIGH_FILTER_OPTIONS = {
  frequency: 1800,
  type: 'highpass' as BiquadFilterType,
  Q: 2.2,
};

export default class HintRadio {
  private soundNames: string[] = [];
  private whiteNoise = new Noise({
    type: 'pink',
    fadeIn: 0.1,
    fadeOut: 0.2,
    volume: -40,
  });
  private loading: Array<Promise<void>> = [];

  public onEnter?: () => void;
  public onExit?: () => void;
  public activated = false;

  constructor(
    private game: Phaser.Scene,
    x: number,
    y: number,
    sounds: Resources[]
  ) {
    const zone = game.add.zone(x, y, 0, 0);
    Game.collisionsManager.addOverlap(
      zone,
      () => this.enter(),
      () => this.exit()
    );
    (zone.body as Phaser.Physics.Arcade.Body).setCircle(RANGE, -RANGE, -RANGE);

    const noiseFilter = new Filter(
      HIGH_FILTER_OPTIONS as Partial<FilterOptions>
    ).toDestination();
    connect(this.whiteNoise, noiseFilter);

    const highPass = new BiquadFilterNode(Game.context, HIGH_FILTER_OPTIONS);
    const distorsion = new WaveShaperNode(Game.context, {
      curve: makeDistortionCurve(20),
    });
    const compressor = new DynamicsCompressorNode(Game.context, {
      threshold: -4,
      ratio: 1.6,
      attack: 0.2,
      release: 0.1,
    });
    const gain = new GainNode(Game.context, {
      gain: 0.4,
    });
    highPass.connect(distorsion);
    distorsion.connect(compressor);
    compressor.connect(gain);
    gain.connect(Game.orchestre.master);

    for (const sound of sounds) {
      const name = `${sound}_hint`;
      this.soundNames.push(name);
      const config = soundEmittersConfig.find(
        (config) => config.sound === sound
      );
      this.loading.push(
        Game.orchestre.addPlayer(
          name,
          musics.get(sound),
          (config && config.length) || 16,
          true,
          highPass
        )
      );
    }
  }

  public async load(): Promise<void> {
    await Promise.all(this.loading);
    return;
  }

  private enter() {
    if (!this.activated) return;

    this.whiteNoise.start();
    for (const soundName of this.soundNames) {
      Game.orchestre.play(soundName, { now: true, fade: 0.2 });
    }
    if (this.onEnter) {
      this.onEnter();
    }
  }

  private exit() {
    if (!this.activated) return;

    this.whiteNoise.stop();
    for (const soundName of this.soundNames) {
      Game.orchestre.stop(soundName, { now: true, fade: 0.2 });
    }
    if (this.onExit) {
      this.onExit();
    }
  }
}

// http://stackoverflow.com/a/22313408/1090298
function makeDistortionCurve(amount: number) {
  var k = amount,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x: number;
  for (; i < n_samples; ++i) {
    x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}
