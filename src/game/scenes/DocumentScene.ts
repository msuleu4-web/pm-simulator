import * as Phaser from 'phaser';
import type { DocumentItem } from '../data/chapters';
import { sfx } from '../utils/audio';

const CANVAS_W = 800;
const CANVAS_H = 600;
const JP = '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", "Meiryo", Arial, sans-serif';
const BOX_X = 20, BOX_Y = 330, BOX_W = 760, BOX_H = 210;
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
  private docImage?: Phaser.GameObjects.Image;
  private imageFrame?: Phaser.GameObjects.Graphics;
  private closeHint?: Phaser.GameObjects.Text;

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
      this.nextIndicator.setText('▼ Zキー / タップでWBSを確認する');
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
    // Hide dialog elements
    this.boxGfx.setVisible(false);
    this.titleBadge.setVisible(false);
    this.bodyText.setVisible(false);
    this.nextIndicator.setVisible(false);
    this.tweens.killAll();

    // Darker overlay for image viewing
    this.overlay.clear();
    this.overlay.fillStyle(0x000000, 0.85);
    this.overlay.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Display image if texture exists
    const textureExists = this.textures.exists(this.doc.imageKey);
    if (textureExists) {
      const tex = this.textures.get(this.doc.imageKey);
      const src = tex.source[0];
      const imgW = src.width;
      const imgH = src.height;

      // Scale to fit within canvas with margins
      const maxW = CANVAS_W - 60;
      const maxH = CANVAS_H - 100;
      const scale = Math.min(maxW / imgW, maxH / imgH, 1);
      const dw = imgW * scale;
      const dh = imgH * scale;
      const cx = CANVAS_W / 2;
      const cy = (CANVAS_H - 50) / 2 + 10;

      // Frame
      this.imageFrame = this.add.graphics();
      this.imageFrame.fillStyle(0x1A1200, 0.95);
      this.imageFrame.fillRoundedRect(cx - dw / 2 - 8, cy - dh / 2 - 8, dw + 16, dh + 16, 6);
      this.imageFrame.lineStyle(2, 0xC8A040, 0.9);
      this.imageFrame.strokeRoundedRect(cx - dw / 2 - 8, cy - dh / 2 - 8, dw + 16, dh + 16, 6);

      // Image
      this.docImage = this.add.image(cx, cy, this.doc.imageKey);
      this.docImage.setDisplaySize(dw, dh);

      // Label above
      this.add.text(cx, cy - dh / 2 - 26, '過去案件 WBS（Work Breakdown Structure）参考資料', {
        fontSize: '12px', color: '#C8A040', fontFamily: JP,
      }).setOrigin(0.5);
    } else {
      // Fallback if image not loaded
      this.add.text(CANVAS_W / 2, CANVAS_H / 2 - 40,
        'WBS資料\n（画像を読み込めませんでした）', {
          fontSize: '18px', color: '#FFE0A0', fontFamily: JP, align: 'center',
        }).setOrigin(0.5);
    }

    // Close hint at bottom
    this.closeHint = this.add.text(CANVAS_W / 2, CANVAS_H - 22,
      'Zキー / タップで閉じる', {
        fontSize: '13px', color: '#88AABB', fontFamily: JP,
      }).setOrigin(0.5);

    this.tweens.add({
      targets: this.closeHint, alpha: { from: 1, to: 0.3 },
      yoyo: true, loop: -1, duration: 700,
    });

    sfx.select();
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
        this.closeScene();
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
