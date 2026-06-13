import * as Phaser from 'phaser';
import { sfx } from '../utils/audio';

const CANVAS_W = 800;
const CANVAS_H = 600;
const JP = '"Hiragino Kaku Gothic ProN","Hiragino Sans","Yu Gothic","Meiryo",Arial,sans-serif';
const GOLD = 0xc8a030;

// ─────────────────────────────────────────────────────────────────────────────
// SIer道場 — title screen. Pure Graphics/Text, no external images.
// Space / tap → 'sier-title-start' → React switches to chapter select.
// ─────────────────────────────────────────────────────────────────────────────

export class TitleScene extends Phaser.Scene {
  private started = false;
  private typingTimer: Phaser.Time.TimerEvent | null = null;

  constructor() { super({ key: 'TitleScene' }); }

  create() {
    this.cameras.main.setBackgroundColor('#0a0a14');
    this.cameras.main.fadeIn(800, 10, 10, 20);

    this.buildBorders();
    this.buildDeskScene();
    this.buildTitleText();
    this.buildSubtitle();
    this.buildStartPrompt();
    this.buildCredits();

    this.input.keyboard!.on('keydown-SPACE', () => this.handleStart());
    this.input.on('pointerdown', () => this.handleStart());

    this.scheduleTypingSound();

    // Phaser.Scale.RESIZE makes the canvas fill the device viewport; zoom the
    // fixed 800x600 layout to fit and center it so this scene's look is unchanged.
    this.applyFitZoom();
    this.scale.on('resize', this.onResize, this);
    this.events.once('shutdown', () => this.scale.off('resize', this.onResize, this));
  }

  private onResize = () => this.applyFitZoom();

  private applyFitZoom() {
    const zoom = Math.min(this.scale.width / CANVAS_W, this.scale.height / CANVAS_H);
    this.cameras.main.setZoom(zoom);
    this.cameras.main.centerOn(CANVAS_W / 2, CANVAS_H / 2);
  }

  // ── Decoration ──────────────────────────────────────────────

  private buildBorders() {
    const g = this.add.graphics();
    g.lineStyle(3, GOLD, 0.8);
    g.lineBetween(20, 16, 20, CANVAS_H - 16);
    g.lineBetween(CANVAS_W - 20, 16, CANVAS_W - 20, CANVAS_H - 16);
    g.lineBetween(20, 16, 60, 16);
    g.lineBetween(CANVAS_W - 20, 16, CANVAS_W - 60, 16);
    g.lineBetween(20, CANVAS_H - 16, 60, CANVAS_H - 16);
    g.lineBetween(CANVAS_W - 20, CANVAS_H - 16, CANVAS_W - 60, CANVAS_H - 16);

    g.fillStyle(GOLD, 0.9);
    for (let y = 48; y < CANVAS_H - 16; y += 64) {
      this.drawDiamond(g, 20, y, 6);
      this.drawDiamond(g, CANVAS_W - 20, y, 6);
    }
  }

  private drawDiamond(g: Phaser.GameObjects.Graphics, x: number, y: number, r: number) {
    g.fillTriangle(x - r, y, x, y - r, x + r, y);
    g.fillTriangle(x - r, y, x, y + r, x + r, y);
  }

  private buildDeskScene() {
    const g = this.add.graphics();
    const cx = CANVAS_W / 2;
    const deskY = 380;
    const deskW = 150, deskH = 56;

    // shadow
    g.fillStyle(0x000000, 0.25);
    g.fillEllipse(cx, deskY + deskH + 10, deskW + 30, 18);

    // chair
    g.fillStyle(0x333333, 1);
    g.fillRoundedRect(cx - 26, deskY - 36, 52, 76, 6);
    g.fillStyle(0x222222, 1);
    g.fillRoundedRect(cx - 26, deskY - 50, 52, 18, 6);

    // player sitting (lower half tucked behind the desk)
    const h = 28;
    g.fillStyle(0x2a6abf, 1);
    g.fillRect(cx - h / 2, deskY - h - 4, h, h);
    g.fillStyle(0xffffff, 0.28);
    g.fillRect(cx - h / 2 + 3, deskY - h - 1, 9, 9);

    g.fillStyle(0xF5C518, 1);
    g.fillCircle(cx, deskY - h - 16, 11);
    g.lineStyle(2, 0xB89010, 1);
    g.strokeCircle(cx, deskY - h - 16, 11);
    g.fillStyle(0x333300, 1);
    g.fillCircle(cx - 3, deskY - h - 17, 2);
    g.fillCircle(cx + 3, deskY - h - 17, 2);

    // desk
    g.fillStyle(0x6b4f0e, 1);
    g.fillRoundedRect(cx - deskW / 2, deskY, deskW, deskH, 4);
    g.fillStyle(0xc8a030, 0.35);
    g.fillRoundedRect(cx - deskW / 2 + 6, deskY + 6, deskW - 12, deskH - 12, 3);

    // monitor + stand
    g.fillStyle(0x1a1a1a, 1);
    g.fillRect(cx - 24, deskY - 30, 48, 32);
    g.fillStyle(0x6699ee, 0.65);
    g.fillRect(cx - 19, deskY - 26, 38, 24);
    g.fillStyle(0x444444, 1);
    g.fillRect(cx - 4, deskY, 8, 4);
  }

  // ── Title text ────────────────────────────────────────────────

  private buildTitleText() {
    const title = this.add.text(CANVAS_W / 2, -80, 'SIer道場', {
      fontSize: '64px', color: '#ffffff', fontFamily: JP, fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 6, letterSpacing: 6,
    }).setOrigin(0.5, 0);
    title.setShadow(0, 4, '#000000', 6, true, true);

    this.tweens.add({ targets: title, y: 50, duration: 900, delay: 150, ease: 'Bounce.Out' });
  }

  private buildSubtitle() {
    const sub = this.add.text(CANVAS_W / 2, 140, '〜日本のSIer現場を体験せよ〜', {
      fontSize: '15px', color: '#ddb84a', fontFamily: JP, letterSpacing: 2,
    }).setOrigin(0.5, 0).setAlpha(0);

    this.tweens.add({ targets: sub, alpha: 1, duration: 600, delay: 900 });
  }

  private buildStartPrompt() {
    const prompt = this.add.text(CANVAS_W / 2, CANVAS_H - 70, 'Spaceキーでスタート', {
      fontSize: '16px', color: '#ffeeaa', fontFamily: JP, fontStyle: 'bold',
    }).setOrigin(0.5);

    this.tweens.add({ targets: prompt, alpha: 0.15, duration: 650, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
  }

  private buildCredits() {
    this.add.text(CANVAS_W - 28, CANVAS_H - 16, 'Tileset: LimeZu Modern Office\n© 2026 SIer道場', {
      fontSize: '9px', color: '#445566', fontFamily: 'monospace', align: 'right', lineSpacing: 2,
    }).setOrigin(1, 1);
  }

  // ── Audio ─────────────────────────────────────────────────────

  private scheduleTypingSound() {
    const delay = 80 + Math.random() * 180;
    this.typingTimer = this.time.delayedCall(delay, () => {
      try { sfx.typeChar(); } catch { /* audio unavailable */ }
      if (!this.started) this.scheduleTypingSound();
    });
  }

  // ── Start ─────────────────────────────────────────────────────

  private handleStart() {
    if (this.started) return;
    this.started = true;
    if (this.typingTimer) { this.typingTimer.remove(); this.typingTimer = null; }
    try { sfx.confirm(); } catch { /* audio unavailable */ }

    this.cameras.main.fadeOut(400, 10, 10, 20);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      window.dispatchEvent(new CustomEvent('sier-title-start'));
    });
  }
}
