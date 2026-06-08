import * as Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MapScene } from './scenes/MapScene';
import { EventScene } from './scenes/EventScene';
import { RandomEventScene } from './scenes/RandomEventScene';
import { DocumentScene } from './scenes/DocumentScene';
import { EndingScene } from './scenes/EndingScene';
import { RankingScene } from './scenes/RankingScene';
import { QuestCorebankScene } from './scenes/QuestCorebankScene';
import { gameState } from './state/gameState';

export function createGame(parent: HTMLElement, playerName?: string, startScene?: string): Phaser.Game {
  if (playerName) {
    gameState.playerName = playerName;
  }

  // Build scene list — quest mode puts QuestCorebankScene first so it boots directly
  const sceneList = startScene === 'QuestCorebankScene'
    ? [QuestCorebankScene, BootScene, MapScene, EventScene, RandomEventScene, DocumentScene, EndingScene, RankingScene]
    : [BootScene, MapScene, EventScene, RandomEventScene, DocumentScene, EndingScene, RankingScene, QuestCorebankScene];

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 598,
    parent,
    backgroundColor: '#0d1a2e',
    scene: sceneList,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 800,
      height: 598,
      parent,
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
