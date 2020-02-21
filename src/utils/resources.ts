export enum Resources {
  Background = 'background',
  Player = 'player'
}

export const images = new Map<Resources, string>([
  [Resources.Background, 'assets/sprites/background.png'],
  [Resources.Player, 'assets/sprites/player.png']
]);
