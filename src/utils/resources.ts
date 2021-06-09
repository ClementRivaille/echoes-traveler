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

  // City
  city_bg = 'city_bg',
  city_A_melody_cello = 'city_A_melody_cello',
  city_A_melody_marimba = 'city_A_melody_marimba',
  city_A_melody_piano_f = 'city_A_melody_piano_f',
  city_A_melody_piano_p = 'city_A_melody_piano_p',
  city_A_melody_vibra = 'city_A_melody_vibra',
  city_A_melody_violin = 'city_A_melody_violin',
  city_chord_A = 'city_chord_A',
  city_chord_F = 'city_chord_F',
  city_chord_G = 'city_chord_G',
  city_D_melody_cello = 'city_D_melody_cello',
  city_D_melody_ethan = 'city_D_melody_ethan',
  city_D_melody_piano = 'city_D_melody_piano',
  city_D_melody_violins = 'city_D_melody_violins',
  city_F_melody_ethan = 'city_F_melody_ethan',
  city_F_melody_piano_1 = 'city_F_melody_piano_1',
  city_F_melody_piano_2 = 'city_F_melody_piano_2',
  city_F_melody_piano_3 = 'city_F_melody_piano_3',
  city_F_melody_vibra = 'city_F_melody_vibra',
  city_marimba_bg_CA = 'city_marimba_bg_CA',
  city_marimba_bg_F = 'city_marimba_bg_F',
  city_marimba_bg_G = 'city_marimba_bg_G',
  city_marimba_rtm_A = 'city_marimba_rtm_A',
  city_marimba_rtm_F_2 = 'city_marimba_rtm_F_2',
  city_piano_rtm_F_2 = 'city_piano_rtm_F_2',
  city_piano_rtm_F = 'city_piano_rtm_F',
  city_violin_bg_D = 'city_violin_bg_D',
  city_violin_bg_F = 'city_violin_bg_F',
  city_violin_bg_GA = 'city_violin_bg_GA',
  city_violins_rtm_D = 'city_violins_rtm_D',
  city_winds_E_p = 'city_winds_E_p',
  city_winds_E_w = 'city_winds_E_w',
  city_winds_FG = 'city_winds_FG',
  city_winds_GE_p = 'city_winds_GE_p',
  city_winds_GE_w = 'city_winds_GE_w',
  city_xylophone_rtm_F_2 = 'city_xylophone_rtm_F_2',
  city_xylophone_rtm_F = 'city_xylophone_rtm_F',
  city_xylo_rtm_A = 'city_xylo_rtm_A',

  // Celtic
  celtic_bg = 'celtic_bg',
  celtic_A_bagpipe = 'celtic_A_bagpipe',
  celtic_A_bombarde = 'celtic_A_bombarde',
  celtic_A_perc = 'celtic_A_perc',
  celtic_A_tenor = 'celtic_A_tenor',
  celtic_A2_bagpipe = 'celtic_A2_bagpipe',
  celtic_A2_bombarde = 'celtic_A2_bombarde',
  celtic_A2_bourdons = 'celtic_A2_bourdons',
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
  [Resources.ExitOpen, 'assets/sprites/exit_open.png'],
]);

export const musics = new Map<Resources, string>([
  [Resources.Bg1, 'assets/music/test/bg1.ogg'],

  [Resources.city_bg, 'assets/music/city/city_bg.ogg'],
  [Resources.city_A_melody_cello, 'assets/music/city/city_A-melody_cello.ogg'],
  [
    Resources.city_A_melody_marimba,
    'assets/music/city/city_A-melody_marimba.ogg',
  ],
  [
    Resources.city_A_melody_piano_f,
    'assets/music/city/city_A-melody_piano-f.ogg',
  ],
  [
    Resources.city_A_melody_piano_p,
    'assets/music/city/city_A-melody_piano-p.ogg',
  ],
  [Resources.city_A_melody_vibra, 'assets/music/city/city_A-melody_vibra.ogg'],
  [
    Resources.city_A_melody_violin,
    'assets/music/city/city_A-melody_violin.ogg',
  ],
  [Resources.city_chord_A, 'assets/music/city/city_chord-A.ogg'],
  [Resources.city_chord_F, 'assets/music/city/city_chord-F.ogg'],
  [Resources.city_chord_G, 'assets/music/city/city_chord-G.ogg'],
  [Resources.city_D_melody_cello, 'assets/music/city/city_D-melody_cello.ogg'],
  [Resources.city_D_melody_ethan, 'assets/music/city/city_D-melody_ethan.ogg'],
  [Resources.city_D_melody_piano, 'assets/music/city/city_D-melody_piano.ogg'],
  [
    Resources.city_D_melody_violins,
    'assets/music/city/city_D-melody_violins.ogg',
  ],
  [Resources.city_F_melody_ethan, 'assets/music/city/city_F-melody_ethan.ogg'],
  [
    Resources.city_F_melody_piano_1,
    'assets/music/city/city_F-melody_piano-1.ogg',
  ],
  [
    Resources.city_F_melody_piano_2,
    'assets/music/city/city_F-melody_piano-2.ogg',
  ],
  [
    Resources.city_F_melody_piano_3,
    'assets/music/city/city_F-melody_piano-3.ogg',
  ],
  [Resources.city_F_melody_vibra, 'assets/music/city/city_F-melody_vibra.ogg'],
  [Resources.city_marimba_bg_CA, 'assets/music/city/city_marimba-bg-CA.ogg'],
  [Resources.city_marimba_bg_F, 'assets/music/city/city_marimba-bg-F.ogg'],
  [Resources.city_marimba_bg_G, 'assets/music/city/city_marimba-bg-G.ogg'],
  [Resources.city_marimba_rtm_A, 'assets/music/city/city_marimba-rtm-A.ogg'],
  [
    Resources.city_marimba_rtm_F_2,
    'assets/music/city/city_marimba-rtm-F-2.ogg',
  ],
  [Resources.city_piano_rtm_F_2, 'assets/music/city/city_piano-rtm-F-2.ogg'],
  [Resources.city_piano_rtm_F, 'assets/music/city/city_piano-rtm-F.ogg'],
  [Resources.city_violin_bg_D, 'assets/music/city/city_violin-bg-D.ogg'],
  [Resources.city_violin_bg_F, 'assets/music/city/city_violin-bg-F.ogg'],
  [Resources.city_violin_bg_GA, 'assets/music/city/city_violin-bg-GA.ogg'],
  [Resources.city_violins_rtm_D, 'assets/music/city/city_violins-rtm-D.ogg'],
  [Resources.city_winds_E_p, 'assets/music/city/city_winds-E-p.ogg'],
  [Resources.city_winds_E_w, 'assets/music/city/city_winds-E-w.ogg'],
  [Resources.city_winds_FG, 'assets/music/city/city_winds-FG.ogg'],
  [Resources.city_winds_GE_p, 'assets/music/city/city_winds-GE-p.ogg'],
  [Resources.city_winds_GE_w, 'assets/music/city/city_winds-GE-w.ogg'],
  [
    Resources.city_xylophone_rtm_F_2,
    'assets/music/city/city_xylophone-rtm-F-2.ogg',
  ],
  [
    Resources.city_xylophone_rtm_F,
    'assets/music/city/city_xylophone-rtm-F.ogg',
  ],
  [Resources.city_xylo_rtm_A, 'assets/music/city/city_xylo-rtm-A.ogg'],

  [Resources.celtic_bg, 'assets/music/celtic/celtic_bg.ogg'],
  [Resources.celtic_A_bagpipe, 'assets/music/celtic/celtic_A_bagpipe.ogg'],
  [Resources.celtic_A_bombarde, 'assets/music/celtic/celtic_A_bombarde.ogg'],
  [Resources.celtic_A_perc, 'assets/music/celtic/celtic_A_perc.ogg'],
  [Resources.celtic_A_tenor, 'assets/music/celtic/celtic_A_tenor.ogg'],
  [Resources.celtic_A2_bagpipe, 'assets/music/celtic/celtic_A2_bagpipe.ogg'],
  [Resources.celtic_A2_bombarde, 'assets/music/celtic/celtic_A2_bombarde.ogg'],
  [Resources.celtic_A2_bourdons, 'assets/music/celtic/celtic_A2_bourdons.ogg'],
]);
