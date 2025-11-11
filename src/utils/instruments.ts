import { FeedbackDelay, Reverb, Sampler } from 'tone';
import { nowWithoutDelay } from './mobile';

export enum InstrumentType {
  Main = 'main',
  Second = 'second',
}

export default class Instruments {
  private instruments: { [key: string]: Sampler };
  private loading: Promise<any>;

  constructor(private isMobile: boolean) {
    const promises = [];
    this.instruments = {};

    promises.push(
      new Promise((resolve) => {
        const mainReverb = new Reverb({
          decay: 2,
          wet: 0.5,
        }).toDestination();
        this.instruments[InstrumentType.Main] = new Sampler(
          {
            D4: 'D4.wav',
            G4: 'G4.wav',
            C5: 'C5.wav',
          },
          () => resolve(true),
          './assets/instruments/string_pad/'
        ).connect(mainReverb);
        mainReverb.generate();
        this.instruments[InstrumentType.Main].release = 3;
        this.instruments[InstrumentType.Main].set({ volume: 12 });
      })
    );

    promises.push(
      new Promise((resolve) => {
        const secondReverb = new Reverb({
          decay: 2,
          wet: 0.4,
        }).toDestination();
        const secondEcho = new FeedbackDelay({
          delayTime: 0.2,
          wet: 0.2,
          feedback: 0.1,
        }).connect(secondReverb);
        this.instruments[InstrumentType.Second] = new Sampler(
          {
            D4: 'D4.wav',
            G4: 'G4.wav',
            C5: 'C5.wav',
          },
          () => resolve(true),
          './assets/instruments/glass/'
        ).connect(secondEcho);
        secondReverb.generate();
        this.instruments[InstrumentType.Second].release = 3;
        this.instruments[InstrumentType.Second].set({ volume: 10 });
      })
    );

    this.loading = Promise.all(promises);
  }

  load() {
    return this.loading;
  }

  play(note: string, instrument: InstrumentType) {
    this.instruments[instrument].triggerAttackRelease(
      note,
      0.4,
      this.isMobile ? nowWithoutDelay() : undefined
    );
  }
}
