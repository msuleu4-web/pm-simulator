import * as Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MapScene } from './scenes/MapScene';
import { EventScene } from './scenes/EventScene';
import { RandomEventScene } from './scenes/RandomEventScene';
import { DocumentScene } from './scenes/DocumentScene';
import { EndingScene } from './scenes/EndingScene';
import { RankingScene } from './scenes/RankingScene';
import { QuestCorebankScene } from './scenes/QuestCorebankScene';
import { Chapter1Scene } from './scenes/Chapter1Scene';
import { Chapter2Scene } from './scenes/Chapter2Scene';
import { Chapter3Scene } from './scenes/Chapter3Scene';
import { Chapter4Scene } from './scenes/Chapter4Scene';
import { Chapter5Scene } from './scenes/Chapter5Scene';
import { gameState } from './state/gameState';

export function createGame(parent: HTMLElement, playerName?: string, startScene?: string): Phaser.Game {
  if (playerName) {
    gameState.playerName = playerName;
  }

  // Build scene list — first entry boots automatically
  const sceneList = startScene === 'QuestCorebankScene'
    ? [QuestCorebankScene, BootScene, MapScene, EventScene, RandomEventScene, DocumentScene, EndingScene, RankingScene, Chapter1Scene, Chapter2Scene, Chapter3Scene, Chapter4Scene, Chapter5Scene]
    : startScene === 'Chapter1Scene'
    ? [Chapter1Scene, Chapter2Scene, Chapter3Scene, Chapter4Scene, Chapter5Scene, BootScene, MapScene, EventScene, RandomEventScene, DocumentScene, EndingScene, RankingScene, QuestCorebankScene]
    : startScene === 'Chapter2Scene'
    ? [Chapter2Scene, Chapter1Scene, Chapter3Scene, Chapter4Scene, Chapter5Scene, BootScene, MapScene, EventScene, RandomEventScene, DocumentScene, EndingScene, RankingScene, QuestCorebankScene]
    : startScene === 'Chapter3Scene'
    ? [Chapter3Scene, Chapter1Scene, Chapter2Scene, Chapter4Scene, Chapter5Scene, BootScene, MapScene, EventScene, RandomEventScene, DocumentScene, EndingScene, RankingScene, QuestCorebankScene]
    : startScene === 'Chapter4Scene'
    ? [Chapter4Scene, Chapter1Scene, Chapter2Scene, Chapter3Scene, Chapter5Scene, BootScene, MapScene, EventScene, RandomEventScene, DocumentScene, EndingScene, RankingScene, QuestCorebankScene]
    : startScene === 'Chapter5Scene'
    ? [Chapter5Scene, Chapter1Scene, Chapter2Scene, Chapter3Scene, Chapter4Scene, BootScene, MapScene, EventScene, RandomEventScene, DocumentScene, EndingScene, RankingScene, QuestCorebankScene]
    : [BootScene, MapScene, EventScene, RandomEventScene, DocumentScene, EndingScene, RankingScene, QuestCorebankScene, Chapter1Scene, Chapter2Scene, Chapter3Scene, Chapter4Scene, Chapter5Scene];

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
