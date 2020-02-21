export enum Resources {
  Background = 'background',
  Player = 'player',
  TileNeutral = 'tileNeutral',
  TileValidating = 'TileValidating',
  TileValidated = 'TileValidated'
}

export const images = new Map<Resources, string>([
  [Resources.Background, 'assets/sprites/background.png'],
  [Resources.Player, 'assets/sprites/player.png'],
  [Resources.TileNeutral, 'assets/sprites/tile.png'],
  [Resources.TileValidating, 'assets/sprites/tile_validating.png'],
  [Resources.TileValidated, 'assets/sprites/tile_validated.png']
]);
