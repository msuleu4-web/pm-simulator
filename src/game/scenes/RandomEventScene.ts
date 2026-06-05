import * as Phaser from 'phaser';
import type { RandomEvent } from '../data/randomEvents';
import { gameState, DIFFICULTY_MULTIPLIER } from '../state/gameState';
import { sfx } from '../utils/audio';

const CANVAS_W = 800;
const CANVAS_H = 600;
const JP = '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", "Meiryo", Arial, sans-serif';

// ── Layout ─────────────────────────────────────────
// Banner     : y= 0 – 52
// Title      : y=60
// Situation  : y=76 – 240  (BOX_H=164)
// Choices    : y=248 – 440 (3×60px+gap)
// Indicator  : y=CANVAS_H-20
const BANNER_H  = 52;
const SIT_Y     = 76;
const SIT_H     = 164;
const CHOICE_Y0 = SIT_Y + SIT_H + 8;   // 248
const CHOICE_H  = 56;
const CHOICE_G  = 6;
const PAD       = 16;

type Phase = 'situation' | 'choices' | 'result' | 'done';

export class RandomEventScene extends Phaser.Scene {
  private event!: RandomEvent;
  private phase: Phase = 'situation';
  private selectedChoice = 0;
  private charIndex = 0;
  private fullText = '';
  private typeTimer: Phaser.Time.TimerEvent | null = null;
  private typeOnComplete: (() => void) | null = null;

  private bgGfx!: Phaser.GameObjects.Graphics;
  private sitBox!: Phaser.GameObjects.Graphics;
  private situationText!: Phaser.GameObjects.Text;
  private nextIndicator!: Phaser.GameObjects.Text;
  private choiceTexts: Phaser.GameObjects.Text[] = [];
  private choicePromptText?: Phaser.GameObjects.Text;
  private effectLabel!: Phaser.GameObjects.Text;

  private confirmKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private upKey!: Phaser.Input.Keyboard.Key;
  private downKey!: Phaser.Input.Keyboard.Key;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private inputCooldown = 0;

  constructor() { super({ key: 'RandomEventScene' }); }

  init(data: { event: RandomEvent }) {
    this.event = data.event;
    this.phase = 'situation';
    this.selectedChoice = 0;
    this.charIndex = 0;
    this.fullText = '';
    this.typeOnComplete = null;
    this.inputCooldown = 400;
  }

  create() {
    // ── Background ────────────────────────────────
    this.bgGfx = this.add.graphics();
    this.bgGfx.fillStyle(0x000000, 0.72);
    this.bgGfx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // ── Warning banner ────────────────────────────
    this.bgGfx.fillStyle(0x7A1010, 1);
    this.bgGfx.fillRect(0, 0, CANVAS_W, BANNER_H);
    this.bgGfx.lineStyle(2, 0xFF5555, 1);
    this.bgGfx.strokeRect(0, 0, CANVAS_W, BANNER_H);

    this.add.text(CANVAS_W / 2, BANNER_H / 2,
      `${this.event.emoji}  ランダムイベント発生！  ${this.event.emoji}`, {
        fontSize: '17px', fontStyle: 'bold',
        color: '#FFD0D0', fontFamily: JP,
      }).setOrigin(0.5);

    // ── Event title ───────────────────────────────
    this.add.text(CANVAS_W / 2, 62, this.event.title, {
      fontSize: '18px', fontStyle: 'bold',
      color: '#FFE88A', fontFamily: JP,
    }).setOrigin(0.5);

    // ── Situation box ──────────────────────────────
    this.sitBox = this.add.graphics();
    this.drawSitBox(0x0A1828);

    // Situation body text
    this.situationText = this.add.text(PAD + 8, SIT_Y + PAD, '', {
      fontSize: '14px', color: '#E8F0FF', fontFamily: JP,
      wordWrap: { width: CANVAS_W - (PAD + 8) * 2, useAdvancedWrap: true },
      lineSpacing: 6,
      fixedWidth: CANVAS_W - (PAD + 8) * 2,
    });

    // Next/proceed indicator (bottom right)
    this.nextIndicator = this.add.text(
      CANVAS_W - PAD, CANVAS_H - 18, '', {
        fontSize: '13px', color: '#88BBFF', fontFamily: JP,
      }).setOrigin(1, 1);

    // Effect label — appears below sitBox in result phase (choices are gone by then)
    this.effectLabel = this.add.text(
      CANVAS_W / 2, SIT_Y + SIT_H + 12, '', {
        fontSize: '14px', fontStyle: 'bold', color: '#FFDD44', fontFamily: JP,
        backgroundColor: '#1A1800DD', padding: { x: 14, y: 6 },
        align: 'center',
      }).setOrigin(0.5, 0).setDepth(10);

    // ── Input ─────────────────────────────────────
    this.cursors    = this.input.keyboard!.createCursorKeys();
    this.confirmKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.enterKey   = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.upKey      = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey    = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

    this.input.on('pointerdown', () => {
      if (this.inputCooldown > 0) return;
      // Choices must be tapped directly on their buttons — block global tap during choice phase
      if (this.phase === 'choices') return;
      this.handleConfirm();
    });

    this.startTypewriter(this.event.situation, () => {
      this.nextIndicator.setText('▼ Zキー / タップで選択肢へ');
      this.tweens.add({
        targets: this.nextIndicator,
        alpha: { from: 1, to: 0.2 }, yoyo: true, loop: -1, duration: 600,
      });
    });
  }

  // ── Drawing ────────────────────────────────────────────────────

  private drawSitBox(bg: number) {
    this.sitBox.clear();
    this.sitBox.fillStyle(bg, 0.95);
    this.sitBox.fillRoundedRect(PAD, SIT_Y, CANVAS_W - PAD * 2, SIT_H, 8);
    this.sitBox.lineStyle(2, 0xCC3333, 0.7);
    this.sitBox.strokeRoundedRect(PAD, SIT_Y, CANVAS_W - PAD * 2, SIT_H, 8);
  }

  // ── Typewriter ──────────────────────────────────────────────────

  private startTypewriter(text: string, onComplete: () => void) {
    this.fullText = text;
    this.charIndex = 0;
    this.typeOnComplete = onComplete;
    this.situationText.setText('');
    if (this.typeTimer) { this.typeTimer.destroy(); this.typeTimer = null; }

    this.typeTimer = this.time.addEvent({
      delay: 20,
      callback: () => {
        this.charIndex++;
        this.situationText.setText(this.fullText.substring(0, this.charIndex));
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
    this.situationText.setText(this.fullText);
    this.charIndex = this.fullText.length;
    if (this.typeOnComplete) {
      const cb = this.typeOnComplete; this.typeOnComplete = null;
      cb();
    }
  }

  // ── Choices ─────────────────────────────────────────────────────

  private showChoices() {
    this.phase = 'choices';
    // Longer cooldown when entering choices — prevents the same tap that dismissed
    // the situation text from immediately firing on a choice button (mobile)
    this.inputCooldown = 400;
    this.tweens.killTweensOf(this.nextIndicator);
    this.nextIndicator.setAlpha(1).setText('↑↓で選択　Zキー / タップで決定');
    this.clearChoices();

    // "どう対応しますか？" label — tracked so clearChoices() can destroy it
    this.choicePromptText = this.add.text(PAD + 4, CHOICE_Y0 - 18, '▼  どう対応しますか？', {
      fontSize: '12px', color: '#AABBCC', fontFamily: JP,
    });

    this.event.choices.forEach((choice, i) => {
      const y = CHOICE_Y0 + i * (CHOICE_H + CHOICE_G);
      const txt = this.add.text(PAD + 4, y, '', {
        fontSize: '13px', color: '#AABBCC', fontFamily: JP,
        wordWrap: { width: CANVAS_W - (PAD + 4) * 2 - 20, useAdvancedWrap: true },
        backgroundColor: '#091420',
        padding: { x: 10, y: 9 },
        fixedWidth: CANVAS_W - (PAD + 4) * 2,
        lineSpacing: 3,
      });
      txt.setInteractive({ useHandCursor: true });
      txt.on('pointerdown', () => { this.inputCooldown = 300; this.selectedChoice = i; this.confirmChoice(); });
      txt.on('pointerover', () => { if (this.selectedChoice !== i) { this.selectedChoice = i; this.updateHighlight(); } });
      this.choiceTexts.push(txt);
    });
    this.updateHighlight();
  }

  private updateHighlight() {
    this.choiceTexts.forEach((t, i) => {
      const sel = i === this.selectedChoice;
      t.setColor(sel ? '#FFFF66' : '#8899AA');
      t.setBackgroundColor(sel ? '#162840' : '#091420');
      t.setText((sel ? '▶  ' : '      ') + this.event.choices[i].text);
    });
  }

  private clearChoices() {
    this.choiceTexts.forEach((t) => t.destroy());
    this.choiceTexts = [];
    this.choicePromptText?.destroy();
    this.choicePromptText = undefined;
  }

  // ── Confirm choice ──────────────────────────────────────────────

  private confirmChoice() {
    const choice = this.event.choices[this.selectedChoice];
    sfx.select();
    this.clearChoices();

    const mult = DIFFICULTY_MULTIPLIER[gameState.difficulty];
    const efx = choice.effects;
    const scaled = {
      quality:  efx.quality  !== undefined ? Math.round(efx.quality  * mult) : undefined,
      cost:     efx.cost     !== undefined ? Math.round(efx.cost     * mult) : undefined,
      delivery: efx.delivery !== undefined ? Math.round(efx.delivery * mult) : undefined,
      trust:    efx.trust    !== undefined ? Math.round(efx.trust    * mult) : undefined,
    };
    gameState.applyEffects(scaled);

    // Effect summary
    const parts: string[] = [];
    if (scaled.quality)  parts.push(`品質 ${scaled.quality  > 0 ? '+' : ''}${scaled.quality}`);
    if (scaled.cost)     parts.push(`コスト ${scaled.cost   > 0 ? '+' : ''}${scaled.cost}`);
    if (scaled.delivery) parts.push(`納期 ${scaled.delivery > 0 ? '+' : ''}${scaled.delivery}`);
    if (scaled.trust)    parts.push(`信頼度 ${scaled.trust  > 0 ? '+' : ''}${scaled.trust}`);
    if (parts.length) this.effectLabel.setText(parts.join('  '));

    // Show result in situation box
    this.phase = 'result';
    this.drawSitBox(0x0A1C10);
    this.nextIndicator.setText('');

    this.startTypewriter(choice.result, () => {
      this.phase = 'done';
      this.nextIndicator.setText('▼ Zキー / タップで続ける');
    });
  }

  // ── Finish ─────────────────────────────────────────────────────

  private finishEvent() {
    gameState.triggeredRandomEvents.add(this.event.id);
    this.game.events.emit('sier-random-event-done');
    this.scene.resume('MapScene');
    this.scene.stop('RandomEventScene');
  }

  // ── Input ──────────────────────────────────────────────────────

  private handleConfirm() {
    this.inputCooldown = 250;
    switch (this.phase) {
      case 'situation':
        if (this.typeTimer) { this.skipTypewriter(); }
        else {
          this.tweens.killAll();
          this.nextIndicator.setAlpha(1);
          this.showChoices();
        }
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

  update(_t: number, delta: number) {
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
      this.inputCooldown = 250;
      this.handleConfirm();
    }
  }

  shutdown() {
    if (this.typeTimer) { this.typeTimer.destroy(); this.typeTimer = null; }
    this.typeOnComplete = null;
    this.clearChoices();
  }
}
