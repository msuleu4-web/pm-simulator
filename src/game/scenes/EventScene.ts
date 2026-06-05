import * as Phaser from 'phaser';
import { scenarios } from '../data/scenarios';
import type { GameEvent, EventChoice } from '../data/scenarios';
import { gameState, DIFFICULTY_MULTIPLIER } from '../state/gameState';
import { sfx } from '../utils/audio';

// ── Layout constants ─────────────────────────────────────────
const CANVAS_W = 800;
const CANVAS_H = 600;
const BOX_X    = 16;
const BOX_Y    = 316;
const BOX_W    = CANVAS_W - 32;   // 768
const BOX_H    = 232;
const PAD      = 18;
const TEXT_W   = BOX_W - PAD * 2; // 732  (wrap width)
const EDU_Y    = 175;

const JP = '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", "Meiryo", Arial, sans-serif';

type Phase =
  | 'situation' | 'wait-situation'
  | 'choices'
  | 'result'    | 'wait-result'
  | 'education' | 'wait-education'
  | 'done';

export class EventScene extends Phaser.Scene {
  private event!: GameEvent;
  private shuffledChoices: EventChoice[] = [];  // choices in randomised order
  private phase: Phase = 'situation';
  private selectedChoice = 0;
  private chosenChoice: EventChoice | null = null;

  private overlay!: Phaser.GameObjects.Graphics;
  private boxGfx!: Phaser.GameObjects.Graphics;
  private nameText!: Phaser.GameObjects.Text;
  private dialogText!: Phaser.GameObjects.Text;
  private nextIndicator!: Phaser.GameObjects.Text;
  private choiceTexts: Phaser.GameObjects.Text[] = [];
  private effectText!: Phaser.GameObjects.Text;

  private fullText = '';
  private charIndex = 0;
  private typeTimer: Phaser.Time.TimerEvent | null = null;
  // stored so skipTypewriter() can also fire the completion callback
  private typeOnComplete: (() => void) | null = null;

  // Education point pagination
  private eduPages: string[] = [];
  private eduPageIndex = 0;
  private pageCountText!: Phaser.GameObjects.Text;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private confirmKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private upKey!: Phaser.Input.Keyboard.Key;
  private downKey!: Phaser.Input.Keyboard.Key;
  private inputCooldown = 0;

  constructor() { super({ key: 'EventScene' }); }

  init(data: { eventId: string }) {
    this.event = scenarios[data.eventId];
    if (!this.event) {
      console.error(`[EventScene] Unknown eventId: ${data.eventId}`);
      // Fallback to first available scenario to prevent crash
      this.event = Object.values(scenarios)[0];
    }

    // Build choice pool based on difficulty, then shuffle
    const base = [...this.event.choices];
    const extras = this.event.extraChoices ?? [];
    const diff = gameState.difficulty;
    let pool: typeof base;
    if (diff === 'easy') {
      pool = base;
    } else if (diff === 'normal') {
      pool = [...base, ...(extras.slice(0, 1))];   // +1 trap choice
    } else {
      pool = [...base, ...extras];                  // +2 trap choices
    }
    this.shuffledChoices = pool.sort(() => Math.random() - 0.5);
    this.phase = 'situation';
    this.selectedChoice = 0;
    this.chosenChoice = null;
    this.charIndex = 0;
    this.fullText = '';
    this.typeOnComplete = null;
    this.inputCooldown = 0;
    this.eduPages = [];
    this.eduPageIndex = 0;
    // Reset stale ref — Phaser reuses scene instances so class fields persist
    // across launches even after all game objects are destroyed
    (this as unknown as { pageCountText: null }).pageCountText = null;
  }

  create() {
    // Dim overlay
    this.overlay = this.add.graphics();
    this.overlay.fillStyle(0x000000, 0.6);
    this.overlay.fillRect(0, 0, CANVAS_W, CANVAS_H);

    this.boxGfx = this.add.graphics();

    // NPC name badge
    this.nameText = this.add.text(BOX_X + PAD, BOX_Y - 30, '', {
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#e8f0ff',
      backgroundColor: '#0d2060',
      padding: { x: 10, y: 5 },
      fontFamily: JP,
    });

    // Main dialog text — useAdvancedWrap for Japanese character-level wrapping
    this.dialogText = this.add.text(BOX_X + PAD, BOX_Y + PAD, '', {
      fontSize: '16px',
      color: '#f0f4ff',
      wordWrap: { width: TEXT_W, useAdvancedWrap: true },
      lineSpacing: 7,
      fontFamily: JP,
      fixedWidth: TEXT_W,   // hard cap on text width
    });

    // "▼ 次へ" — right-aligned so it never clips
    this.nextIndicator = this.add
      .text(BOX_X + BOX_W - PAD, BOX_Y + BOX_H - 10, '', {
        fontSize: '14px',
        color: '#88bbff',
        fontFamily: JP,
      })
      .setOrigin(1, 1);

    // Effect result chip — placed above all boxes (y=118) so it never overlaps
    this.effectText = this.add.text(CANVAS_W / 2, 118, '', {
      fontSize: '14px',
      color: '#ffdd44',
      fontFamily: JP,
      align: 'center',
      backgroundColor: '#1a1800dd',
      padding: { x: 14, y: 6 },
    }).setOrigin(0.5).setDepth(10);

    // Keyboard
    this.cursors    = this.input.keyboard!.createCursorKeys();
    this.confirmKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.enterKey   = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.upKey      = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey    = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

    // Global tap-to-advance — blocked during 'choices' phase (choices have their own handlers)
    this.input.on('pointerdown', () => {
      if (this.inputCooldown > 0) return;
      if (this.phase === 'choices') return; // choice buttons handle their own clicks
      this.handleConfirm();
    });

    this.startSituation();
  }

  // ── Box drawing ──────────────────────────────────────────────

  private drawDialogBox(bgColor = 0x0b1830, alpha = 0.97) {
    this.boxGfx.clear();
    this.boxGfx.fillStyle(bgColor, alpha);
    this.boxGfx.fillRoundedRect(BOX_X, BOX_Y, BOX_W, BOX_H, 10);
    this.boxGfx.lineStyle(2, 0x3a7acc, 0.9);
    this.boxGfx.strokeRoundedRect(BOX_X, BOX_Y, BOX_W, BOX_H, 10);
  }

  private drawEduBox() {
    const h = CANVAS_H - EDU_Y - 10;
    this.boxGfx.clear();
    this.boxGfx.fillStyle(0x071a0d, 0.97);
    this.boxGfx.fillRoundedRect(BOX_X, EDU_Y, BOX_W, h, 10);
    this.boxGfx.lineStyle(2, 0x3caf50, 0.9);
    this.boxGfx.strokeRoundedRect(BOX_X, EDU_Y, BOX_W, h, 10);
  }

  // ── Typewriter ───────────────────────────────────────────────

  private startTypewriter(text: string, onComplete: () => void) {
    this.fullText = text;
    this.charIndex = 0;
    this.typeOnComplete = onComplete;
    this.dialogText.setText('');
    if (this.typeTimer) { this.typeTimer.destroy(); this.typeTimer = null; }

    this.typeTimer = this.time.addEvent({
      delay: 22,
      callback: () => {
        this.charIndex++;
        this.dialogText.setText(this.fullText.substring(0, this.charIndex));
        if (this.charIndex % 3 === 0) sfx.typeChar();
        if (this.charIndex >= this.fullText.length) {
          this.typeTimer?.destroy();
          this.typeTimer = null;
          // fire completion
          const cb = this.typeOnComplete;
          this.typeOnComplete = null;
          cb?.();
        }
      },
      loop: true,
    });
  }

  /**
   * Skip to end of typewriter AND fire onComplete so the phase advances.
   * Without calling onComplete, the phase gets stuck (e.g. stays 'result' forever).
   */
  private skipTypewriter() {
    if (this.typeTimer) { this.typeTimer.destroy(); this.typeTimer = null; }
    this.dialogText.setText(this.fullText);
    this.charIndex = this.fullText.length;

    if (this.typeOnComplete) {
      const cb = this.typeOnComplete;
      this.typeOnComplete = null;
      cb();
    }
  }

  // ── Phases ───────────────────────────────────────────────────

  private startSituation() {
    this.phase = 'situation';
    this.clearChoices();
    this.effectText.setText('');
    this.drawDialogBox();
    this.resetTextPositions();
    this.nameText.setText(`【${this.event.npcName}】  ${this.event.title}`);
    this.nextIndicator.setText('');

    this.startTypewriter(this.event.situation, () => {
      this.phase = 'wait-situation';
      this.nextIndicator.setText('▼ Zキー / タップで次へ');
      this.tweens.add({
        targets: this.nextIndicator,
        alpha: { from: 1, to: 0.2 },
        yoyo: true, loop: -1, duration: 550,
      });
    });
  }

  private showChoices() {
    this.phase = 'choices';
    // Longer cooldown on entering choices — prevents the tap that dismissed the
    // situation text from immediately landing on a choice button (mobile)
    this.inputCooldown = 400;
    this.clearChoices();
    this.boxGfx.clear();
    this.nameText.setText('▼  どう対応しますか？');
    this.dialogText.setText('');
    this.nextIndicator.setText('');

    const choiceH = 50;
    const gap = 6;
    const totalH = this.shuffledChoices.length * (choiceH + gap);
    const startY = BOX_Y - totalH - 10;

    this.shuffledChoices.forEach((choice, i) => {
      const y = startY + i * (choiceH + gap);
      const txt = this.add.text(BOX_X + PAD, y, '', {
        fontSize: '14px',
        color: '#aabbcc',
        wordWrap: { width: TEXT_W - 20, useAdvancedWrap: true },
        fontFamily: JP,
        backgroundColor: '#0a1828',
        padding: { x: 10, y: 8 },
        lineSpacing: 4,
        fixedWidth: TEXT_W,
      });

      txt.setInteractive({ useHandCursor: true });

      txt.on('pointerover', () => {
        if (this.selectedChoice !== i) {
          this.selectedChoice = i;
          this.updateChoiceHighlight();
        }
      });

      txt.on('pointerdown', () => {
        // Set cooldown BEFORE confirmChoice so the global pointerdown
        // handler (which fires for the same click) is blocked.
        this.inputCooldown = 350;
        this.selectedChoice = i;
        this.confirmChoice();
      });

      this.choiceTexts.push(txt);
    });

    this.updateChoiceHighlight();
  }

  private updateChoiceHighlight() {
    this.choiceTexts.forEach((t, i) => {
      const sel = i === this.selectedChoice;
      t.setColor(sel ? '#ffff66' : '#8899aa');
      t.setBackgroundColor(sel ? '#163050' : '#0a1828');
      t.setText((sel ? '▶  ' : '      ') + this.shuffledChoices[i].text);
    });
  }

  private clearChoices() {
    this.choiceTexts.forEach((t) => t.destroy());
    this.choiceTexts = [];
  }

  private confirmChoice() {
    this.chosenChoice = this.shuffledChoices[this.selectedChoice];
    const grade = this.chosenChoice.grade;

    if (grade === '◎') sfx.correct();
    else if (grade === '×') sfx.wrong();
    else sfx.neutral();

    // Scale effects by difficulty multiplier
    // Use !== undefined (not truthy check) so that effect=0 is correctly handled
    const mult = DIFFICULTY_MULTIPLIER[gameState.difficulty];
    const efxRaw = this.chosenChoice.effects;
    const scaledEffects = {
      quality:  efxRaw.quality  !== undefined ? Math.round(efxRaw.quality  * mult) : undefined,
      cost:     efxRaw.cost     !== undefined ? Math.round(efxRaw.cost     * mult) : undefined,
      delivery: efxRaw.delivery !== undefined ? Math.round(efxRaw.delivery * mult) : undefined,
      trust:    efxRaw.trust    !== undefined ? Math.round(efxRaw.trust    * mult) : undefined,
    };
    gameState.applyEffects(scaledEffects);
    if (this.event.flagKey) gameState.setFlag(this.event.flagKey, this.chosenChoice.id);

    // Effect summary badge — show SCALED values (what was actually applied)
    const parts: string[] = [];
    if (scaledEffects.quality  !== undefined) parts.push(`品質 ${scaledEffects.quality  > 0 ? '+' : ''}${scaledEffects.quality}`);
    if (scaledEffects.cost     !== undefined) parts.push(`コスト ${scaledEffects.cost    > 0 ? '+' : ''}${scaledEffects.cost}`);
    if (scaledEffects.delivery !== undefined) parts.push(`納期 ${scaledEffects.delivery  > 0 ? '+' : ''}${scaledEffects.delivery}`);
    if (scaledEffects.trust    !== undefined) parts.push(`信頼度 ${scaledEffects.trust   > 0 ? '+' : ''}${scaledEffects.trust}`);
    const badge = grade === '◎' ? '◎ 正解' : grade === '△' ? '△ 許容' : '× 要注意';
    this.effectText.setText(`${badge}  ／  ${parts.join('  ') || '変化なし'}`);
    this.effectText.setColor(grade === '◎' ? '#44ff88' : grade === '×' ? '#ff7766' : '#ffdd44');

    // Show result text
    this.phase = 'result';
    this.clearChoices();
    this.drawDialogBox();
    this.resetTextPositions();
    this.nameText.setText('— 結果 —');
    this.nextIndicator.setText('');

    this.startTypewriter(this.chosenChoice.result, () => {
      this.phase = 'wait-result';
      this.nextIndicator.setText('▼ Zキー / タップで続きへ');
    });
  }

  private showEducation() {
    this.phase = 'education';
    this.clearChoices();
    this.effectText.setText('');
    this.eduPageIndex = 0;

    // Split education point into pages by blank line (\n\n)
    const raw = this.event.educationPoint;
    // Group into chunks of ~3 paragraphs per page so the box doesn't overflow
    const paragraphs = raw.split('\n\n');
    this.eduPages = [];
    let chunk: string[] = [];
    paragraphs.forEach((p, idx) => {
      chunk.push(p);
      // flush chunk every 3 paragraphs or at end
      if (chunk.length >= 3 || idx === paragraphs.length - 1) {
        this.eduPages.push(chunk.join('\n\n'));
        chunk = [];
      }
    });

    this.renderEduPage();
  }

  private renderEduPage() {
    this.phase = 'education';

    try {
      this.drawEduBox();

      this.nameText.setPosition(BOX_X + PAD, EDU_Y + 10);
      this.nameText.setStyle({ color: '#88ffcc', fontSize: '16px', fontStyle: 'bold', fontFamily: JP });
      this.nameText.setText('📚  学習ポイント');

      this.dialogText.setPosition(BOX_X + PAD, EDU_Y + 48);
      this.dialogText.setStyle({
        fontSize: '14px',
        color: '#d0f0d8',
        wordWrap: { width: TEXT_W, useAdvancedWrap: true },
        lineSpacing: 6,
        fontFamily: JP,
        fixedWidth: TEXT_W,
      });

      this.nextIndicator.setPosition(BOX_X + BOX_W - PAD, CANVAS_H - 14);
      this.nextIndicator.setText('');

      // Always create a fresh page-count text (stale ref causes errors on scene reuse)
      if (this.pageCountText) {
        try { this.pageCountText.destroy(); } catch { /* already destroyed */ }
      }
      this.pageCountText = this.add.text(BOX_X + PAD, CANVAS_H - 14, '', {
        fontSize: '11px', color: '#88aa88', fontFamily: JP,
      }).setOrigin(0, 1);

      if (this.eduPages.length > 1) {
        this.pageCountText.setText(`${this.eduPageIndex + 1} / ${this.eduPages.length}`);
      }

      const isLast = this.eduPageIndex >= this.eduPages.length - 1;
      const pageText = this.eduPages[this.eduPageIndex] ?? '';

      this.startTypewriter(pageText, () => {
        this.phase = 'wait-education';
        this.nextIndicator.setText(isLast ? '▼ Zキー / タップで閉じる' : '▼ Zキー / タップで次へ');
      });
    } catch (err) {
      // Fallback: if rendering fails, jump straight to wait-education so player isn't stuck
      console.warn('[EventScene] renderEduPage error, skipping:', err);
      this.phase = 'wait-education';
      this.nextIndicator.setPosition(BOX_X + BOX_W - PAD, CANVAS_H - 14);
      this.nextIndicator.setText('▼ Zキー / タップで閉じる');
    }
  }

  private resetTextPositions() {
    this.nameText.setPosition(BOX_X + PAD, BOX_Y - 30);
    this.nameText.setStyle({
      color: '#e8f0ff', fontSize: '15px', fontStyle: 'bold', fontFamily: JP,
    });
    this.dialogText.setPosition(BOX_X + PAD, BOX_Y + PAD);
    this.dialogText.setStyle({
      fontSize: '16px', color: '#f0f4ff',
      wordWrap: { width: TEXT_W, useAdvancedWrap: true },
      lineSpacing: 7, fontFamily: JP, fixedWidth: TEXT_W,
    });
    this.nextIndicator.setPosition(BOX_X + BOX_W - PAD, BOX_Y + BOX_H - 10);
  }

  private finishEvent() {
    this.phase = 'done';
    gameState.markComplete(this.event.id);
    sfx.confirm();
    this.game.events.emit('sier-event-complete', this.event.id);
    this.scene.resume('MapScene');
    this.scene.stop('EventScene');
  }

  // ── Input ────────────────────────────────────────────────────

  private handleConfirm() {
    switch (this.phase) {
      case 'situation':
        // If still typing → skip to end (onComplete fires automatically)
        // If already done → do nothing (wait-situation handles next step)
        if (this.typeTimer) { this.skipTypewriter(); }
        break;
      case 'wait-situation':
        this.tweens.killTweensOf(this.nextIndicator);
        this.nextIndicator.setAlpha(1);
        this.inputCooldown = 200;
        sfx.select();
        this.showChoices();
        break;
      case 'choices':
        // choices are handled by their own pointerdown — keyboard confirm also works
        this.confirmChoice();
        break;
      case 'result':
        if (this.typeTimer) { this.skipTypewriter(); }
        break;
      case 'wait-result':
        this.inputCooldown = 200;
        this.resetTextPositions();
        sfx.select();
        this.showEducation();
        break;
      case 'education':
        if (this.typeTimer) { this.skipTypewriter(); }
        break;
      case 'wait-education':
        // Advance to next page, or finish if last page
        if (this.eduPageIndex < this.eduPages.length - 1) {
          this.eduPageIndex++;
          this.inputCooldown = 200;
          sfx.select();
          this.renderEduPage();
        } else {
          this.finishEvent();
        }
        break;
      default:
        break;
    }
  }

  update(_time: number, delta: number) {
    this.inputCooldown = Math.max(0, this.inputCooldown - delta);
    if (this.inputCooldown > 0) return;

    if (this.phase === 'choices') {
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.upKey)) {
        this.selectedChoice = (this.selectedChoice - 1 + this.shuffledChoices.length) % this.shuffledChoices.length;
        this.updateChoiceHighlight();
        sfx.step();
        this.inputCooldown = 120;
        return;
      }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.down) || Phaser.Input.Keyboard.JustDown(this.downKey)) {
        this.selectedChoice = (this.selectedChoice + 1) % this.shuffledChoices.length;
        this.updateChoiceHighlight();
        sfx.step();
        this.inputCooldown = 120;
        return;
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

  // Cleanup typewriter timer when scene is stopped to prevent ghost text
  shutdown() {
    if (this.typeTimer) { this.typeTimer.destroy(); this.typeTimer = null; }
    this.typeOnComplete = null;
    this.clearChoices();
    if (this.pageCountText) {
      try { this.pageCountText.destroy(); } catch { /* */ }
      (this as unknown as { pageCountText: null }).pageCountText = null;
    }
  }
}
