import * as Phaser from 'phaser';
import { SierDungeonScene } from './scenes/SierDungeonScene';

// Separate game factory for the SIer Dungeon action game.
// Kept separate from PhaserGame.ts so the scenario game is not affected.
export function createDungeonGame(parent: HTMLElement): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 640,
    height: 512,
    parent,
    backgroundColor: '#0d1117',
    scene: [SierDungeonScene],
    physics: {
      default: 'arcade',
      arcade: { debug: false },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent,
    },
    render: {
      antialias: false,
      pixelArt: true,
    },
    input: {
      keyboard: true,
    },
  };

  return new Phaser.Game(config);
}
