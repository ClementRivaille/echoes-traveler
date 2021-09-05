import 'phaser';
import { connect, Filter, FilterOptions, getContext, Noise } from 'tone';
import Game from '../game';
import { soundEmittersConfig } from '../utils/audioConfig';
import { musics, Resources } from '../utils/resources';

const RANGE = 50;
const HIGH_FILTER_OPTIONS = {
  frequency: 1600,
  type: 'highpass' as BiquadFilterType,
  Q: 20,
};

export default class HintRadio {
  private soundName: string;
  private whiteNoise = new Noise({
    type: 'white',
    fadeIn: 0.1,
    fadeOut: 0.2,
    volume: -55,
  });
  private loading: Promise<void>;

  constructor(
    private game: Phaser.Scene,
    x: number,
    y: number,
    sound: Resources
  ) {
    const zone = game.add.zone(x, y, 0, 0);
    Game.collisionsManager.addOverlap(
      zone,
      () => this.enter(),
      () => this.exit()
    );
    (zone.body as Phaser.Physics.Arcade.Body).setCircle(RANGE, -RANGE, -RANGE);

    this.soundName = `${sound}_hint`;
    const config = soundEmittersConfig.find((config) => config.sound === sound);

    const noiseFilter = new Filter(
      HIGH_FILTER_OPTIONS as Partial<FilterOptions>
    ).toDestination();
    connect(this.whiteNoise, noiseFilter);

    const highPass = new BiquadFilterNode(Game.context, HIGH_FILTER_OPTIONS);
    const distorsion = new WaveShaperNode(Game.context, {
      curve: makeDistortionCurve(16),
    });
    const compressor = new DynamicsCompressorNode(Game.context, {
      threshold: -5,
      ratio: 1.4,
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
    this.loading = Game.orchestre.addPlayer(
      this.soundName,
      musics.get(sound),
      (config && config.length) || 16,
      true,
      highPass
    );
  }

  public load() {
    return this.loading;
  }

  private enter() {
    this.whiteNoise.start();
    Game.orchestre.play(this.soundName, { now: true, fade: 0.2 });
  }

  private exit() {
    this.whiteNoise.stop();
    Game.orchestre.stop(this.soundName, { now: true, fade: 0.2 });
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
