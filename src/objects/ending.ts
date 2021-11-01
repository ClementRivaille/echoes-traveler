import { Player } from 'tone';
import Game from '../game';
import { musics, Resources } from '../utils/resources';

export default class Ending {
  private player: Player;
  constructor() {
    this.player = new Player(musics.get(Resources.ending)).toDestination();
    this.player.autostart = false;
    this.player.loop = false;
  }

  start() {
    Game.orchestreVolume.gain.setTargetAtTime(0, Game.context.currentTime, 8);
    this.player.start();
  }
}
