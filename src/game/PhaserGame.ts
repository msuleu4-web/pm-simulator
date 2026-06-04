import * as Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MapScene } from './scenes/MapScene';
import { EventScene } from './scenes/EventScene';
import { EndingScene } from './scenes/EndingScene';
import { RankingScene } from './scenes/RankingScene';
import { gameState } from './state/gameState';

export function createGame(parent: HTMLElement, playerName?: string): Phaser.Game {
  if (playerName) {
    gameState.playerName = playerName;
  }

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 598,
    parent,
    backgroundColor: '#0d1a2e',
    scene: [BootScene, MapScene, EventScene, EndingScene, RankingScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    input: {
      keyboard: true,
      mouse: true,
      touch: true,
    },
    render: {
      antialias: true,
      pixelArt: false,
    },
  };

  return new Phaser.Game(config);
}
