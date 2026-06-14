import * as Phaser from 'phaser';
import { Chapter1Scene } from './scenes/Chapter1Scene';
import { Chapter2Scene } from './scenes/Chapter2Scene';
import { Chapter3Scene } from './scenes/Chapter3Scene';
import { Chapter4Scene } from './scenes/Chapter4Scene';
import { Chapter5Scene } from './scenes/Chapter5Scene';
import { Chapter6Scene } from './scenes/Chapter6Scene';
import { Chapter7Scene } from './scenes/Chapter7Scene';
import { EasyChapter1Scene } from './scenes/easy/EasyChapter1Scene';
import { EasyChapter2Scene } from './scenes/easy/EasyChapter2Scene';
import { EasyChapter3Scene } from './scenes/easy/EasyChapter3Scene';
import { EasyChapter4Scene } from './scenes/easy/EasyChapter4Scene';
import { EasyChapter5Scene } from './scenes/easy/EasyChapter5Scene';
import { EasyChapter6Scene } from './scenes/easy/EasyChapter6Scene';
import { EasyChapter7Scene } from './scenes/easy/EasyChapter7Scene';
import { TitleScene } from './scenes/TitleScene';

const NORMAL_CHAPTER_SCENES = [Chapter1Scene, Chapter2Scene, Chapter3Scene, Chapter4Scene, Chapter5Scene, Chapter6Scene, Chapter7Scene];
const EASY_CHAPTER_SCENES = [EasyChapter1Scene, EasyChapter2Scene, EasyChapter3Scene, EasyChapter4Scene, EasyChapter5Scene, EasyChapter6Scene, EasyChapter7Scene];
const ALL_CHAPTER_SCENES = [...NORMAL_CHAPTER_SCENES, ...EASY_CHAPTER_SCENES];

// Keyed by string literal (not class.name) so scene lookup survives production minification,
// which mangles class names but never rewrites object-literal string keys.
const SCENE_REGISTRY: Record<string, new (...args: never[]) => Phaser.Scene> = {
  'TitleScene': TitleScene,
  'Chapter1Scene': Chapter1Scene,
  'Chapter2Scene': Chapter2Scene,
  'Chapter3Scene': Chapter3Scene,
  'Chapter4Scene': Chapter4Scene,
  'Chapter5Scene': Chapter5Scene,
  'Chapter6Scene': Chapter6Scene,
  'Chapter7Scene': Chapter7Scene,
  'EasyChapter1Scene': EasyChapter1Scene,
  'EasyChapter2Scene': EasyChapter2Scene,
  'EasyChapter3Scene': EasyChapter3Scene,
  'EasyChapter4Scene': EasyChapter4Scene,
  'EasyChapter5Scene': EasyChapter5Scene,
  'EasyChapter6Scene': EasyChapter6Scene,
  'EasyChapter7Scene': EasyChapter7Scene,
};

export function createGame(parent: HTMLElement, startScene?: string): Phaser.Game {
  // Build scene list — first entry boots automatically
  const allScenes = [TitleScene, ...ALL_CHAPTER_SCENES];
  const startSceneClass = startScene ? SCENE_REGISTRY[startScene] : undefined;
  const sceneList = startSceneClass
    ? [startSceneClass, ...allScenes.filter((s) => s !== startSceneClass)]
    : allScenes;

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent,
    backgroundColor: '#0d1a2e',
    scene: sceneList,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
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
