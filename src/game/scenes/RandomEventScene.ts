import * as Phaser from 'phaser';
import type { RandomEvent } from '../data/randomEvents';
import { gameState, DIFFICULTY_MULTIPLIER } from '../state/gameState';
import { sfx } from '../utils/audio';

const CANVAS_W = 800;
const CANVAS_H = 600;
const JP = '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", "Meiryo", Arial, sans-serif';
const BOX_X = 20, BOX_Y = 80, BOX_W = 760, BOX_H = 200;
const PAD = 18;

type Phase = 'situation' | 'choices' | 'result' | 'done';

export class RandomEventScene extends Phaser.Scene {
  private event!: RandomEvent;
  private phase: Phase = 'situation';
  private selectedChoice = 0;
  private charIndex = 0;
  private fullText = '';
  private typeTimer: Phaser.Time.TimerEvent | null = null;
  private typeOnComplete: (() => void) | null = null;

  private gfx!: Phaser.GameObjects.Graphics;
  private titleText!: Phaser.GameObjects.Text;
  private bodyText!: Phaser.GameObjects.Text;
  private nextIndicator!: Phaser.GameObjects.Text;
  private choiceTexts: Phaser.GameObjects.Text[] = [];

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private confirmKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private upKey!: Phaser.Input.Keyboard.Key;
  private downKey!: Phaser.Input.Keyboard.Key;
  private inputCooldown = 0;

  constructor() { super({ key: 'RandomEventScene' }); }

  init(data: { event: RandomEvent }) {
    this.event = data.event;
    this.phase = 'situation';
    this.selectedChoice = 0;
    this.charIndex = 0;
    this.fullText = '';
    this.typeOnComplete = null;
    this.inputCooldown = 0;
  }

  create() {
    // Semi-transparent dark overlay (MapScene stays paused behind)
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.65);
    overlay.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Warning banner at top
    const banner = this.add.graphics();
    banner.fillStyle(0x8B1A1A, 1);
    banner.fillRect(0, 0, CANVAS_W, 60);
    banner.lineStyle(2, 0xFF4444, 1);
    banner.strokeRect(0, 0, CANVAS_W, 60);

    this.add.text(CANVAS_W / 2, 30, `${this.event.emoji}  ランダムイベント発生！  ${this.event.emoji}`, {
      fontSize: '18px', fontStyle: 'bold', color: '#FFD0D0', fontFamily: JP,
    }).setOrigin(0.5);

    // Event title
    this.add.text(CANVAS_W / 2, 72, this.event.title, {
      fontSize: '20px', fontStyle: 'bold', color: '#FFEEAA', fontFamily: JP,
    }).setOrigin(0.5);

    // Main box
    this.gfx = this.add.graphics();
    this.drawBox();

    // Body text
    this.bodyText = this.add.text(BOX_X + PAD, BOX_Y + PAD, '', {
      fontSize: '15px', color: '#F0F4FF',
      fontFamily: JP,
      wordWrap: { width: BOX_W - PAD * 2, useAdvancedWrap: true },
      lineSpacing: 6,
      fixedWidth: BOX_W - PAD * 2,
    });

    // Indicator
    this.nextIndicator = this.add.text(BOX_X + BOX_W - PAD, BOX_Y + BOX_H - 10, '', {
      fontSize: '14px', color: '#88BBFF', fontFamily: JP,
    }).setOrigin(1, 1);

    this.titleText = this.add.text(0, 0, '', { fontSize: '1px' }); // placeholder

    // Keyboard
    this.cursors    = this.input.keyboard!.createCursorKeys();
    this.confirmKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.enterKey   = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.upKey      = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey    = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

    this.input.on('pointerdown', () => {
      if (this.inputCooldown > 0) return;
      this.handleConfirm();
    });

    this.startTypewriter(this.event.situation, () => {
      this.phase = 'situation';
      this.nextIndicator.setText('▼ Zキー / タップで選択肢へ');
      this.tweens.add({
        targets: this.nextIndicator, alpha: { from: 1, to: 0.2 },
        yoyo: true, loop: -1, duration: 550,
      });
    });
  }

  private drawBox(bgColor = 0x0D1C3A) {
    this.gfx.clear();
    this.gfx.fillStyle(bgColor, 0.97);
    this.gfx.fillRoundedRect(BOX_X, BOX_Y, BOX_W, BOX_H, 10);
    this.gfx.lineStyle(2, 0xFF4444, 0.6);
    this.gfx.strokeRoundedRect(BOX_X, BOX_Y, BOX_W, BOX_H, 10);
    this.gfx.lineStyle(3, 0xFF4444, 0.4);
    this.gfx.strokeRect(0, 58, CANVAS_W, 2);
  }

  private startTypewriter(text: string, onComplete: () => void) {
    this.fullText = text;
    this.charIndex = 0;
    this.typeOnComplete = onComplete;
    this.bodyText.setText('');
    if (this.typeTimer) { this.typeTimer.destroy(); this.typeTimer = null; }

    this.typeTimer = this.time.addEvent({
      delay: 20,
      callback: () => {
        this.charIndex++;
        this.bodyText.setText(this.fullText.substring(0, this.charIndex));
        if (this.charIndex % 3 === 0) sfx.typeChar();
        if (this.charIndex >= this.fullText.length) {
          this.typeTimer?.destroy(); this.typeTimer = null;
          const cb = this.typeOnComplete; this.typeOnComplete = null;
          cb?.();
        }
      },
      loop: true,
    });
  }

  private skipTypewriter() {
    if (this.typeTimer) { this.typeTimer.destroy(); this.typeTimer = null; }
    this.bodyText.setText(this.fullText);
    this.charIndex = this.fullText.length;
    if (this.typeOnComplete) {
      const cb = this.typeOnComplete; this.typeOnComplete = null;
      cb();
    }
  }

  private showChoices() {
    this.phase = 'choices';
    this.nextIndicator.setText('');
    this.tweens.killAll();
    this.clearChoices();

    const choiceH = 52, gap = 6;
    const total = this.event.choices.length * (choiceH + gap);
    const startY = BOX_Y - total - 10;

    this.bodyText.setText('どう対応しますか？');

    this.event.choices.forEach((choice, i) => {
      const y = startY + i * (choiceH + gap);
      const txt = this.add.text(BOX_X + PAD, y, '', {
        fontSize: '14px', color: '#AABBCC',
        wordWrap: { width: BOX_W - PAD * 2 - 20, useAdvancedWrap: true },
        fontFamily: JP, backgroundColor: '#0A1828',
        padding: { x: 10, y: 8 }, fixedWidth: BOX_W - PAD * 2,
        lineSpacing: 3,
      });
      txt.setInteractive({ useHandCursor: true });
      txt.on('pointerdown', () => {
        this.inputCooldown = 350;
        this.selectedChoice = i;
        this.confirmChoice();
      });
      txt.on('pointerover', () => {
        if (this.selectedChoice !== i) {
          this.selectedChoice = i;
          this.updateHighlight();
        }
      });
      this.choiceTexts.push(txt);
    });
    this.updateHighlight();
  }

  private updateHighlight() {
    this.choiceTexts.forEach((t, i) => {
      const sel = i === this.selectedChoice;
      t.setColor(sel ? '#FFFF66' : '#8899AA');
      t.setBackgroundColor(sel ? '#1A3050' : '#0A1828');
      t.setText((sel ? '▶  ' : '      ') + this.event.choices[i].text);
    });
  }

  private clearChoices() {
    this.choiceTexts.forEach((t) => t.destroy());
    this.choiceTexts = [];
  }

  private confirmChoice() {
    const choice = this.event.choices[this.selectedChoice];
    sfx.select();

    // Apply effects scaled by difficulty
    const mult = DIFFICULTY_MULTIPLIER[gameState.difficulty];
    const scaled = {
      quality:  choice.effects.quality  ? Math.round(choice.effects.quality  * mult) : undefined,
      cost:     choice.effects.cost     ? Math.round(choice.effects.cost     * mult) : undefined,
      delivery: choice.effects.delivery ? Math.round(choice.effects.delivery * mult) : undefined,
      trust:    choice.effects.trust    ? Math.round(choice.effects.trust    * mult) : undefined,
    };
    gameState.applyEffects(scaled);

    this.phase = 'result';
    this.clearChoices();
    this.drawBox(0x0D1C30);
    this.nextIndicator.setText('');

    // Effect summary
    const parts: string[] = [];
    if (scaled.quality)  parts.push(`品質 ${scaled.quality  > 0 ? '+' : ''}${scaled.quality}`);
    if (scaled.cost)     parts.push(`コスト ${scaled.cost   > 0 ? '+' : ''}${scaled.cost}`);
    if (scaled.delivery) parts.push(`納期 ${scaled.delivery  > 0 ? '+' : ''}${scaled.delivery}`);
    if (scaled.trust)    parts.push(`信頼度 ${scaled.trust   > 0 ? '+' : ''}${scaled.trust}`);
    if (parts.length) {
      this.add.text(CANVAS_W / 2, BOX_Y - 28, parts.join('  '), {
        fontSize: '14px', fontStyle: 'bold', color: '#FFDD44',
        fontFamily: JP, backgroundColor: '#1A1800CC',
        padding: { x: 12, y: 5 },
      }).setOrigin(0.5);
    }

    this.startTypewriter(choice.result, () => {
      this.phase = 'done';
      this.nextIndicator.setText('▼ Zキー / タップで続ける');
    });
  }

  private finishEvent() {
    gameState.triggeredRandomEvents.add(this.event.id);
    this.game.events.emit('sier-random-event-done');
    this.scene.resume('MapScene');
    this.scene.stop('RandomEventScene');
  }

  private handleConfirm() {
    switch (this.phase) {
      case 'situation':
        if (this.typeTimer) { this.skipTypewriter(); return; }
        this.inputCooldown = 200;
        this.showChoices();
        break;
      case 'choices':
        this.confirmChoice();
        break;
      case 'result':
        if (this.typeTimer) { this.skipTypewriter(); }
        break;
      case 'done':
        this.finishEvent();
        break;
    }
  }

  update(_time: number, delta: number) {
    this.inputCooldown = Math.max(0, this.inputCooldown - delta);
    if (this.inputCooldown > 0) return;

    if (this.phase === 'choices') {
      if (Phaser.Input.Keyboard.JustDown(this.upKey) || Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
        this.selectedChoice = (this.selectedChoice - 1 + this.event.choices.length) % this.event.choices.length;
        this.updateHighlight(); sfx.step(); this.inputCooldown = 120; return;
      }
      if (Phaser.Input.Keyboard.JustDown(this.downKey) || Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
        this.selectedChoice = (this.selectedChoice + 1) % this.event.choices.length;
        this.updateHighlight(); sfx.step(); this.inputCooldown = 120; return;
      }
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.confirmKey) ||
      Phaser.Input.Keyboard.JustDown(this.enterKey) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.space)
    ) {
      this.inputCooldown = 200;
      this.handleConfirm();
    }
  }
}
