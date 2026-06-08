import * as Phaser from 'phaser';
import type { DocumentItem } from '../data/chapters';
import { sfx } from '../utils/audio';

const CANVAS_W = 800;
const CANVAS_H = 600;
const JP = '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", "Meiryo", Arial, sans-serif';
const BOX_X = 20, BOX_Y = 310, BOX_W = 760, BOX_H = 240;
const PAD = 18;

type Phase = 'dialog' | 'image' | 'done';

export class DocumentScene extends Phaser.Scene {
  private doc!: DocumentItem;
  private phase: Phase = 'dialog';
  private charIndex = 0;
  private fullText = '';
  private typeTimer: Phaser.Time.TimerEvent | null = null;
  private typeOnComplete: (() => void) | null = null;

  private overlay!: Phaser.GameObjects.Graphics;
  private boxGfx!: Phaser.GameObjects.Graphics;
  private titleBadge!: Phaser.GameObjects.Text;
  private bodyText!: Phaser.GameObjects.Text;
  private nextIndicator!: Phaser.GameObjects.Text;
  private confirmKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private inputCooldown = 0;

  constructor() { super({ key: 'DocumentScene' }); }

  init(data: { document: DocumentItem }) {
    this.doc = data.document;
    this.phase = 'dialog';
    this.charIndex = 0;
    this.fullText = '';
    this.typeOnComplete = null;
    this.inputCooldown = 300;
  }

  create() {
    // Dim overlay
    this.overlay = this.add.graphics();
    this.overlay.fillStyle(0x000000, 0.6);
    this.overlay.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Dialog box
    this.boxGfx = this.add.graphics();
    this.drawDialogBox();

    // "📄 資料" badge
    this.titleBadge = this.add.text(BOX_X + PAD, BOX_Y - 28, '📄  資料が見つかった', {
      fontSize: '14px', fontStyle: 'bold', color: '#FFE0A0',
      fontFamily: JP, backgroundColor: '#3A2800',
      padding: { x: 10, y: 5 },
    });

    // Body text
    this.bodyText = this.add.text(BOX_X + PAD, BOX_Y + PAD, '', {
      fontSize: '15px', color: '#F0F4FF',
      fontFamily: JP,
      wordWrap: { width: BOX_W - PAD * 2, useAdvancedWrap: true },
      lineSpacing: 7, fixedWidth: BOX_W - PAD * 2,
    });

    // Next indicator
    this.nextIndicator = this.add.text(BOX_X + BOX_W - PAD, BOX_Y + BOX_H - 10, '', {
      fontSize: '14px', color: '#88BBFF', fontFamily: JP,
    }).setOrigin(1, 1);

    // Keyboard
    this.confirmKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.enterKey   = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // Pointer to advance
    this.input.on('pointerdown', () => {
      if (this.inputCooldown > 0) return;
      this.handleConfirm();
    });

    this.startTypewriter(this.doc.dialog, () => {
      this.nextIndicator.setText(this.doc.nextHint ?? '▼ Zキー / タップで資料を確認する');
      this.tweens.add({
        targets: this.nextIndicator, alpha: { from: 1, to: 0.2 },
        yoyo: true, loop: -1, duration: 600,
      });
    });
  }

  // ── Helpers ─────────────────────────────────────────────────────

  private drawDialogBox() {
    this.boxGfx.clear();
    this.boxGfx.fillStyle(0x0D1C3A, 0.96);
    this.boxGfx.fillRoundedRect(BOX_X, BOX_Y, BOX_W, BOX_H, 10);
    this.boxGfx.lineStyle(2, 0xC8A040, 0.8);
    this.boxGfx.strokeRoundedRect(BOX_X, BOX_Y, BOX_W, BOX_H, 10);
  }

  private startTypewriter(text: string, onComplete: () => void) {
    this.fullText = text;
    this.charIndex = 0;
    this.typeOnComplete = onComplete;
    this.bodyText.setText('');
    if (this.typeTimer) { this.typeTimer.destroy(); this.typeTimer = null; }

    this.typeTimer = this.time.addEvent({
      delay: 22,
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

  private showImage() {
    this.phase = 'image';
    this.boxGfx.setVisible(false);
    this.titleBadge.setVisible(false);
    this.bodyText.setVisible(false);
    this.nextIndicator.setVisible(false);
    this.tweens.killAll();

    this.overlay.clear();
    this.overlay.fillStyle(0x000000, 0.92);
    this.overlay.fillRect(0, 0, CANVAS_W, CANVAS_H);

    sfx.select();

    // Delegate to React HTML overlay for native-quality rendering
    const imagePath = `/game-assets/${this.doc.imageKey}.png`;
    const label = this.doc.imageLabel ?? this.doc.label;
    window.dispatchEvent(new CustomEvent('sier-show-doc-image', { detail: { path: imagePath, label } }));

    const onClose = () => {
      window.removeEventListener('sier-doc-image-closed', onClose);
      this.closeScene();
    };
    window.addEventListener('sier-doc-image-closed', onClose, { once: true });
  }

  private closeScene() {
    this.phase = 'done';
    sfx.confirm();
    // Mark as read (for required-doc gate check) — re-reading is still allowed
    this.game.events.emit('sier-document-closed', this.doc.id);
    this.scene.resume('MapScene');
    this.scene.stop('DocumentScene');
  }

  // ── Input ───────────────────────────────────────────────────────

  private handleConfirm() {
    this.inputCooldown = 250;
    switch (this.phase) {
      case 'dialog':
        if (this.typeTimer) { this.skipTypewriter(); }
        else { this.tweens.killAll(); this.nextIndicator.setAlpha(1); this.showImage(); }
        break;
      case 'image':
        // Close the HTML overlay (which will call closeScene via the event listener)
        window.dispatchEvent(new CustomEvent('sier-doc-image-closed'));
        break;
    }
  }

  update(_t: number, delta: number) {
    this.inputCooldown = Math.max(0, this.inputCooldown - delta);
    if (this.inputCooldown > 0) return;

    if (
      Phaser.Input.Keyboard.JustDown(this.confirmKey) ||
      Phaser.Input.Keyboard.JustDown(this.enterKey)
    ) {
      this.inputCooldown = 250;
      this.handleConfirm();
    }
  }
}
