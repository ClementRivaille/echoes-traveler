export enum Resources {
  Background = 'background',
  Player = 'player',
  TileNeutral = 'tileNeutral',
  TileValidating = 'TileValidating',
  TileValidated = 'TileValidated',
  TorchOff = 'TorchOff',
  TorchOn = 'TorchOn',
  Wall = 'Wall',
  ExitClosed = 'ExitClosed',
  ExitOpen = 'ExitOpen',

  Bg1 = 'bg1',
  Bg2 = 'bg2',
  Birds = 'birds',
  Cats = 'cats',
  Monkeys = 'monkeys',
  Reader = 'reader',
  Shells = 'shells',
  Shoals = 'shoals',
  Spiders = 'spiders',
  Statues = 'statues'
}

export const images = new Map<Resources, string>([
  [Resources.Background, 'assets/sprites/background.png'],
  [Resources.Player, 'assets/sprites/player.png'],
  [Resources.TileNeutral, 'assets/sprites/tile.png'],
  [Resources.TileValidating, 'assets/sprites/tile_validating.png'],
  [Resources.TileValidated, 'assets/sprites/tile_validated.png'],
  [Resources.TorchOff, 'assets/sprites/torch_off.png'],
  [Resources.TorchOn, 'assets/sprites/torch_on.png'],
  [Resources.Wall, 'assets/sprites/wall.png'],
  [Resources.ExitClosed, 'assets/sprites/exit_closed.png'],
  [Resources.ExitOpen, 'assets/sprites/exit_open.png']
]);

export const musics = new Map<Resources, string>([
  [Resources.Bg1, 'assets/music/test/bg1.ogg'],
  [Resources.Bg2, 'assets/music/test/bg2.ogg'],
  [Resources.Birds, 'assets/music/test/birds.ogg'],
  [Resources.Cats, 'assets/music/test/cats.ogg'],
  [Resources.Monkeys, 'assets/music/test/monkeys.ogg'],
  [Resources.Reader, 'assets/music/test/reader.ogg'],
  [Resources.Shells, 'assets/music/test/shells.ogg'],
  [Resources.Shoals, 'assets/music/test/shoals.ogg'],
  [Resources.Spiders, 'assets/music/test/spiders.ogg'],
  [Resources.Statues, 'assets/music/test/statues.ogg']
]);
