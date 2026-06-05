import * as Phaser from 'phaser';
import { gameState } from '../state/gameState';

/**
 * BootScene serves two purposes:
 * 1. Initial game start (resets state, starts chapter 1)
 * 2. Chapter relay — when advancing chapters, MapScene calls scene.start('BootScene')
 *    with the next chapterId already set in gameState.currentChapter,
 *    avoiding the Phaser limitation of restarting the same scene key.
 */
export class BootScene extends Phaser.Scene {
  private isRelay = false;

  constructor() {
    super({ key: 'BootScene' });
  }

  init(data?: { relay?: boolean }) {
    this.isRelay = data?.relay === true;
  }

  preload() {
    // Load document images for in-game item viewing
    this.load.image('wbs', '/game-assets/wbs.png');
  }

  create() {
    if (!this.isRelay) {
      // Initial start — reset everything except playerName
      const name = gameState.playerName;
      gameState.reset();
      gameState.playerName = name;
    }
    // Start the correct chapter (set in gameState.currentChapter by advanceChapter())
    this.scene.start('MapScene', { chapterId: gameState.currentChapter });
  }
}
