import 'tone';
declare var Tone: any;

export enum InstrumentType {
  Main = 'main',
  Second = 'second'
}

export default class Instruments {
  private instruments: { [key: string]: any };
  private loading: Promise<any>;

  constructor() {
    const promises = [];
    this.instruments = {};

    promises.push(
      new Promise(resolve => {
        const rhodesReverb = new Tone.Reverb({
          decay: 2,
          wet: 0.2
        }).toMaster();
        this.instruments[InstrumentType.Main] = new Tone.Sampler(
          {
            B3: '3_B_3.wav',
            D3: '3_D_3.wav',
            G3: '3_G_3.wav',
            B4: '4_B_3.wav',
            D4: '4_D_3.wav',
            F4: '4_F_3.wav'
          },
          () => resolve(),
          './assets/instruments/rhodes/'
        ).connect(rhodesReverb);
        rhodesReverb.generate();
        this.instruments[InstrumentType.Main].release = 2;
        // this.instruments[InstrumentType.Main].volume = -2;
      })
    );

    promises.push(
      new Promise(resolve => {
        const vibraReverb = new Tone.Reverb({
          decay: 2,
          wet: 0.2
        }).toMaster();
        this.instruments[InstrumentType.Second] = new Tone.Sampler(
          {
            A5: '5_A.wav',
            Ab5: '5_Ab.wav',
            B5: '5_B.wav',
            Bb5: '5_Bb.wav',
            C5: '5_C.wav',
            D5: '5_D.wav',
            Db5: '5_Db.wav',
            E5: '5_E.wav',
            Eb5: '5_Eb.wav',
            F5: '5_F.wav',
            G5: '5_G.wav',
            Gb5: '5_Gb.wav'
          },
          () => resolve(),
          './assets/instruments/vibra/'
        ).connect(vibraReverb);
        vibraReverb.generate();
        this.instruments[InstrumentType.Second].release = 0.9;
      })
    );

    this.loading = Promise.all(promises);
  }

  load() {
    return this.loading;
  }

  play(note: string, instrument: InstrumentType) {
    this.instruments[instrument].triggerAttackRelease(note, 0.4);
  }
}
