import { Orchestre } from 'orchestre-js';
import 'phaser';
import Area from './objects/area';
import Borders from './objects/Borders';
import CollisionManager from './objects/collisionManager';
import Ending from './objects/ending';
import Indicator from './objects/indicator';
import Path from './objects/path';
import Player from './objects/player';
import SoundEmitter from './objects/soundEmitter';
import UI from './objects/ui';
import World from './objects/world';
import { spritesDimensions } from './utils/animation';
import { areasConfig, soundEmittersConfig } from './utils/audioConfig';
import { DialogName } from './utils/dialogs';
import { loadFonts } from './utils/fonts';
import Instruments from './utils/instruments';
import Particles from './utils/particles';
import pathsConfig, { PathId } from './utils/pathsConfig';
import { images, Resources, sprites } from './utils/resources';
import { eraseSave, loadSave, save, SaveFile } from './utils/save';
import Sounds from './utils/Sounds';
import { TouchInput } from './utils/mobile';
import MobileUI from './objects/mobileUI';

enum GameState {
  Preload,
  Title,
  Loading,
  Playing,
  Ending,
  Credits,
}

enum TutorialStep {
  Path,
  Goal,
  Signal,
  Completed,
}

export default class Game extends Phaser.Scene {
  private player: Player;
  private camera: Phaser.Cameras.Scene2D.Camera;
  private ui: UI;
  private mobileUI: MobileUI;

  private paths: Path[] = [];
  private pathValidated = 0;
  private indicators: Indicator[] = [];

  private borders: Borders;

  private soundEmitters: SoundEmitter[];
  private instruments: Instruments;
  private world: World;
  private areas: Area[];

  private ending: Ending;
  private orchestreVolume: GainNode;

  public static orchestre: Orchestre;
  public static collisionsManager: CollisionManager;
  public static context: AudioContext;
  public static sounds: Sounds;
  public static particles: Particles;

  private state: GameState = GameState.Preload;
  private loaded = false;
  private tutorial = TutorialStep.Path;

  constructor() {
    super('game');
  }

  preload() {
    for (const image of images.keys()) {
      this.load.image(image, images.get(image));
    }
    for (const sprite of sprites.keys()) {
      const dimensions = spritesDimensions[sprite];
      this.load.spritesheet(sprite, sprites.get(sprite), {
        frameWidth: dimensions.width,
        frameHeight: dimensions.height,
      });
    }
  }

  async create() {
    const resourcesLoading: Promise<void>[] = [];
    const touchInput = new TouchInput(this);

    this.ui = new UI(this);
    this.mobileUI = new MobileUI(this, touchInput);

    this.camera = this.cameras.main;
    this.camera.scrollX = -this.camera.centerX;
    this.camera.scrollY = -this.camera.centerY;

    this.input.addPointer();

    resourcesLoading.push(this.loadTitle());

    const background = this.add.sprite(0, 0, Resources.Background);
    background.scale = 3.4;
    const trees = this.add.sprite(0, 0, Resources.TreeShadows);
    trees.scale = 3.4;
    trees.setDepth(2);

    this.player = new Player(this, touchInput, 0, 0);
    this.world = new World(this.player);

    Game.collisionsManager = new CollisionManager(
      this.physics,
      this.player.sprite.object
    );

    Game.context = new AudioContext();
    Game.orchestre = new Orchestre(110, Game.context);
    this.orchestreVolume = new GainNode(Game.context, {
      gain: 2,
    });
    this.orchestreVolume.connect(Game.context.destination);
    Game.orchestre.master.disconnect(Game.context.destination);
    Game.orchestre.master.connect(this.orchestreVolume);

    Game.particles = new Particles(this);

    this.areas = areasConfig.map((areaConfig) => {
      const area = new Area(
        this,
        areaConfig.x,
        areaConfig.y,
        areaConfig.width,
        areaConfig.height,
        areaConfig.music,
        areaConfig.measure
      );
      resourcesLoading.push(area.load());
      return area;
    });
    this.soundEmitters = soundEmittersConfig.map((emitterConfig) => {
      const emitter = new SoundEmitter(
        this,
        this.player,
        emitterConfig.x,
        emitterConfig.y,
        emitterConfig.range,
        emitterConfig.sound,
        emitterConfig.length
      );
      resourcesLoading.push(emitter.load());
      return emitter;
    });
    this.instruments = new Instruments();
    resourcesLoading.push(this.instruments.load());
    Game.sounds = new Sounds();
    resourcesLoading.push(Game.sounds.load());

    // Debug camera
    // this.camera.startFollow(this.player.sprite);

    // Position paths
    for (const pathConfig of pathsConfig) {
      this.paths.push(
        new Path(
          this,
          pathConfig.x,
          pathConfig.y,
          pathConfig.id,
          pathConfig.directions,
          this.instruments,
          (id) => this.validatePath(id)
        )
      );
      const indicator = new Indicator(
        this,
        pathConfig.torchX,
        pathConfig.torchY,
        pathConfig.id,
        pathConfig.hint
      );
      this.indicators.push(indicator);
      if (pathConfig.hint) {
        resourcesLoading.push(indicator.load());
      }
    }

    this.borders = new Borders(
      this,
      this.camera.width,
      this.camera.height,
      this.player.sprite.object,
      () => this.onBorderCollide()
    );

    // Save
    const file = loadSave();
    if (file) {
      this.loadSave(file);
    }

    // Controls
    const enter = this.input.keyboard.addKey('ENTER');
    enter.on('down', () => this.onPressStart());
    this.input.on('pointerdown', () => this.onPressStart());

    // Ending
    this.ending = new Ending(
      this,
      this.orchestreVolume,
      this.camera,
      this.player,
      trees
    );

    // ------------LOADING --------------------
    await Promise.all(resourcesLoading);
    this.onResourcesLoaded();
  }

  update() {
    this.player.update();

    Game.collisionsManager.update();
    this.soundEmitters.forEach((emitter) => emitter.update());

    if (this.tutorial !== TutorialStep.Completed) {
      const playerPosition = this.player.getPosition();
      const playerHeight = spritesDimensions[Resources.GhostSpritesheet].height;
      if (
        Math.abs(playerPosition.x) > this.camera.width / 2 ||
        playerPosition.y > this.camera.height / 2 + playerHeight ||
        playerPosition.y < -this.camera.height / 2
      ) {
        this.ui.showDialog(DialogName.Camera, true);
        this.tutorial = TutorialStep.Completed;
      }
    }

    if (this.state === GameState.Playing) {
      this.world.update();
      this.mobileUI.update();
    }
    if (this.state === GameState.Ending) {
      this.ending.update();
    }
  }

  onEnd() {
    this.state = GameState.Credits;
    this.ui.showCredits(this.camera.midPoint.x, this.camera.midPoint.y);
  }

  private async loadTitle(): Promise<void> {
    await loadFonts();
    this.ui.init();
    this.state = GameState.Title;
    if (this.pathValidated > 0) {
      this.ui.setFileDetected();
    }
  }

  private async onResourcesLoaded() {
    this.loaded = true;

    Game.orchestre.start();
    this.areas[0].activate();
    if (this.state == GameState.Loading) {
      await this.ui.hideLoading();
      this.startGame();
      this.state = GameState.Playing;
    }
  }

  private async onPressStart() {
    if (this.state === GameState.Title) {
      this.state = GameState.Loading;
      const uiPromise = this.ui.hideTitle(this.loaded);
      if (this.loaded) {
        await uiPromise;
        this.startGame();
        this.state = GameState.Playing;
      }
    }
  }

  private async startGame() {
    await this.player.activate();

    if (this.tutorial === TutorialStep.Path) {
      await this.ui.showFirstSteps();
    } else {
      this.borders.desactivate();
    }
  }

  private validatePath(id: string) {
    const indicator = this.indicators.find((indic) => indic.id === id);
    if (indicator) {
      indicator.validate(true);
    }
    this.pathValidated += 1;

    if (this.tutorial === TutorialStep.Path) {
      this.tutorial = TutorialStep.Goal;
      this.ui.showDialog(DialogName.Goal);

      this.indicators.forEach((indicator) => {
        if (!indicator.validated) {
          indicator.watchStay(() => this.onListenToHint());
          indicator.activateRadio();
        }
      });
    }

    if (this.pathValidated > 1 && this.pathValidated < this.paths.length) {
      this.updateSave();
    } else if (this.pathValidated === this.paths.length) {
      this.win();
    }
  }

  private onBorderCollide() {
    Game.sounds.play(Resources.Block);

    if (this.tutorial == TutorialStep.Path) {
      this.indicators[0].blink();
    } else if (this.tutorial == TutorialStep.Goal) {
      this.indicators.forEach((indicator) => {
        if (!indicator.validated) {
          indicator.blink();
        }
      });
    }
  }

  private onListenToHint() {
    this.tutorial = TutorialStep.Signal;
    this.borders.desactivate();
    this.ui.showDialog(DialogName.Hints);
    this.indicators.forEach((indicator) => {
      if (!indicator.validated) {
        indicator.unwatchStay();
      }
    });
  }

  private async win() {
    this.state = GameState.Ending;
    this.player.deactivate();
    await Game.orchestre.wait(1);
    this.ending.start();
    eraseSave();
  }

  private loadSave(file: SaveFile) {
    for (const path of this.paths) {
      const indicator = this.indicators.find(
        (indicator) => indicator.id === path.id
      );
      if (file[path.id]) {
        this.pathValidated += 1;
        path.disable();
        indicator.validate();
      } else {
        indicator.activateRadio();
      }
    }
    this.tutorial = TutorialStep.Completed;
  }

  private updateSave() {
    const file: SaveFile = {
      [PathId.hub]: true,
      [PathId.city]: false,
      [PathId.sea]: false,
      [PathId.celtic]: false,
      [PathId.desert]: false,
    };
    for (const path of this.paths) {
      file[path.id] = path.validated;
    }
    const saved = save(file);
    this.ui.showAutomaticSave(saved);
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#303030',
  width: 1024,
  height: 800,
  scene: Game,
  render: {
    pixelArt: true,
    maxLights: 50,
  },
  // zoom: 0.5,
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
    },
  },
  scale: {
    expandParent: true,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT,
  },
};

const game = new Phaser.Game(config);
