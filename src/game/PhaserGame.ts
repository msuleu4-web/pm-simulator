import * as Phaser from 'phaser';
import { Chapter1Scene } from './scenes/Chapter1Scene';
import { Chapter2Scene } from './scenes/Chapter2Scene';
import { Chapter3Scene } from './scenes/Chapter3Scene';
import { Chapter4Scene } from './scenes/Chapter4Scene';
import { Chapter5Scene } from './scenes/Chapter5Scene';
import { Chapter6Scene } from './scenes/Chapter6Scene';
import { Chapter7Scene } from './scenes/Chapter7Scene';
import { TitleScene } from './scenes/TitleScene';

export function createGame(parent: HTMLElement, startScene?: string): Phaser.Game {
  // Build scene list — first entry boots automatically
  const sceneList = startScene === 'TitleScene'
    ? [TitleScene, Chapter1Scene, Chapter2Scene, Chapter3Scene, Chapter4Scene, Chapter5Scene, Chapter6Scene, Chapter7Scene]
    : startScene === 'Chapter1Scene'
    ? [Chapter1Scene, TitleScene, Chapter2Scene, Chapter3Scene, Chapter4Scene, Chapter5Scene, Chapter6Scene, Chapter7Scene]
    : startScene === 'Chapter2Scene'
    ? [Chapter2Scene, TitleScene, Chapter1Scene, Chapter3Scene, Chapter4Scene, Chapter5Scene, Chapter6Scene, Chapter7Scene]
    : startScene === 'Chapter3Scene'
    ? [Chapter3Scene, TitleScene, Chapter1Scene, Chapter2Scene, Chapter4Scene, Chapter5Scene, Chapter6Scene, Chapter7Scene]
    : startScene === 'Chapter4Scene'
    ? [Chapter4Scene, TitleScene, Chapter1Scene, Chapter2Scene, Chapter3Scene, Chapter5Scene, Chapter6Scene, Chapter7Scene]
    : startScene === 'Chapter5Scene'
    ? [Chapter5Scene, TitleScene, Chapter1Scene, Chapter2Scene, Chapter3Scene, Chapter4Scene, Chapter6Scene, Chapter7Scene]
    : startScene === 'Chapter6Scene'
    ? [Chapter6Scene, TitleScene, Chapter1Scene, Chapter2Scene, Chapter3Scene, Chapter4Scene, Chapter5Scene, Chapter7Scene]
    : startScene === 'Chapter7Scene'
    ? [Chapter7Scene, TitleScene, Chapter1Scene, Chapter2Scene, Chapter3Scene, Chapter4Scene, Chapter5Scene, Chapter6Scene]
    : [TitleScene, Chapter1Scene, Chapter2Scene, Chapter3Scene, Chapter4Scene, Chapter5Scene, Chapter6Scene, Chapter7Scene];

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
