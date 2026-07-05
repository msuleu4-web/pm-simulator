import * as Phaser from 'phaser';
import { sfx } from '../utils/audio';

const CANVAS_W = 800;
const CANVAS_H = 600;
const JP = '"Hiragino Kaku Gothic ProN","Hiragino Sans","Yu Gothic","Meiryo",Arial,sans-serif';
const GOLD     = 0xc8a030;
const GOLD_S   = '#c8a030';
const GOLD_L   = '#e8c84a';
const CX       = CANVAS_W / 2;

// Desk / character anchor
const DESK_CX = CX;
const DESK_Y  = 420;

// ─────────────────────────────────────────────────────────────────────────────

export class TitleScene extends Phaser.Scene {
  private started = false;
  private typingTimer: Phaser.Time.TimerEvent | null = null;

  constructor() { super({ key: 'TitleScene' }); }

  create() {
    this.cameras.main.setBackgroundColor('#05080f');
    this.cameras.main.fadeIn(900, 5, 8, 15);

    this.buildBackground();
    this.buildFrame();
    this.buildCornerOrnaments();
    this.buildConnectorLines();
    this.buildDeskScene();
    this.buildSkillIcons();
    this.buildTitleText();
    this.buildSubtitle();
    this.buildStartPrompt();
    this.buildCredits();

    this.input.keyboard!.on('keydown-SPACE', () => this.handleStart());
    this.input.on('pointerdown', () => this.handleStart());
    this.scheduleTypingSound();

    this.applyFitZoom();
    this.scale.on('resize', this.onResize, this);
    this.events.once('shutdown', () => this.scale.off('resize', this.onResize, this));
  }

  private onResize = () => this.applyFitZoom();
  private applyFitZoom() {
    const zoom = Math.min(this.scale.width / CANVAS_W, this.scale.height / CANVAS_H);
    this.cameras.main.setZoom(zoom);
    this.cameras.main.centerOn(CX, CANVAS_H / 2);
  }

  // ── Background: circuit board pattern ────────────────────────────────────

  private buildBackground() {
    const g = this.add.graphics();

    // Base fill
    g.fillStyle(0x05080f, 1).fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Soft radial glow around desk area
    for (let r = 320; r > 0; r -= 20) {
      g.fillStyle(0x0a1828, 0.04).fillEllipse(DESK_CX, DESK_Y + 20, r * 2.2, r * 1.1);
    }

    // Circuit grid lines
    g.lineStyle(1, GOLD, 0.06);
    for (let x = 60; x < CANVAS_W; x += 60) g.lineBetween(x, 0, x, CANVAS_H);
    for (let y = 60; y < CANVAS_H; y += 60) g.lineBetween(0, y, CANVAS_W, y);

    // Grid intersection dots
    g.fillStyle(GOLD, 0.18);
    for (let x = 60; x < CANVAS_W; x += 60) {
      for (let y = 60; y < CANVAS_H; y += 60) g.fillCircle(x, y, 1.5);
    }

    // Sparse scattered accent dots
    const sparks = [
      [150,75],[310,55],[420,90],[570,60],[680,85],[740,160],
      [55,180],[60,320],[55,450],[745,220],[750,380],[740,490],
    ];
    g.fillStyle(GOLD, 0.45);
    sparks.forEach(([sx, sy]) => g.fillCircle(sx, sy, 2.5));

    // Circuit L-traces (left side)
    g.lineStyle(1, GOLD, 0.18);
    g.lineBetween(80, 90, 130, 90);  g.lineBetween(130, 90, 130, 130);
    g.lineBetween(80, 200, 145, 200); g.lineBetween(145, 200, 145, 165);
    g.lineBetween(65, 330, 110, 330); g.lineBetween(110, 330, 110, 295);
    // Circuit L-traces (right side)
    g.lineBetween(CANVAS_W-80, 90, CANVAS_W-130, 90);  g.lineBetween(CANVAS_W-130, 90, CANVAS_W-130, 130);
    g.lineBetween(CANVAS_W-80, 200, CANVAS_W-145, 200); g.lineBetween(CANVAS_W-145, 200, CANVAS_W-145, 165);
    g.lineBetween(CANVAS_W-65, 330, CANVAS_W-110, 330); g.lineBetween(CANVAS_W-110, 330, CANVAS_W-110, 295);
  }

  // ── Golden frame ──────────────────────────────────────────────────────────

  private buildFrame() {
    const g = this.add.graphics();
    const pad = 18;

    // Outer border
    g.lineStyle(2.5, GOLD, 0.88).strokeRect(pad, pad, CANVAS_W - pad * 2, CANVAS_H - pad * 2);
    // Inner border
    g.lineStyle(1, GOLD, 0.3).strokeRect(pad + 6, pad + 6, CANVAS_W - (pad + 6) * 2, CANVAS_H - (pad + 6) * 2);

    // Diamonds along vertical sides
    g.fillStyle(GOLD, 0.88);
    for (let y = pad + 60; y < CANVAS_H - pad; y += 64) {
      this.diamond(g, pad, y, 5);
      this.diamond(g, CANVAS_W - pad, y, 5);
    }
    // Diamonds along horizontal sides
    for (let x = pad + 80; x < CANVAS_W - pad; x += 80) {
      this.diamond(g, x, pad, 3.5);
      this.diamond(g, x, CANVAS_H - pad, 3.5);
    }
  }

  // ── Corner ornaments ──────────────────────────────────────────────────────

  private buildCornerOrnaments() {
    const g = this.add.graphics();
    const corners: [number, number][] = [[28,28],[CANVAS_W-28,28],[28,CANVAS_H-28],[CANVAS_W-28,CANVAS_H-28]];

    corners.forEach(([cx, cy]) => {
      const sx = cx < CX ? 1 : -1;
      const sy = cy < CANVAS_H / 2 ? 1 : -1;

      // Large outer diamond
      g.fillStyle(GOLD, 0.95);
      this.diamond(g, cx, cy, 12);
      // Inner void diamond
      g.fillStyle(0x05080f, 1);
      this.diamond(g, cx, cy, 6);
      // Tiny center diamond
      g.fillStyle(GOLD, 0.95);
      this.diamond(g, cx, cy, 3);

      // L-bracket arms
      g.lineStyle(2, GOLD, 0.8);
      g.lineBetween(cx + sx * 14, cy, cx + sx * 34, cy);
      g.lineBetween(cx, cy + sy * 14, cx, cy + sy * 34);

      // Outer dot accents
      g.fillStyle(GOLD, 0.6);
      g.fillCircle(cx + sx * 38, cy, 2.5);
      g.fillCircle(cx, cy + sy * 38, 2.5);
    });
  }

  // ── Connector lines (icon → desk) ─────────────────────────────────────────

  private buildConnectorLines() {
    const g = this.add.graphics();
    g.lineStyle(1, GOLD, 0.25);

    const deskTop = DESK_Y - 68; // top of desk scene

    // Left icons → desk
    [[115, 255], [100, 390]].forEach(([ix, iy]) => {
      g.lineBetween(ix + 45, iy, DESK_CX - 85, deskTop + 40);
      g.fillStyle(GOLD, 0.5); g.fillCircle(ix + 45, iy, 3);
    });

    // Right icons → desk
    [[685, 255], [685, 390]].forEach(([ix, iy]) => {
      g.lineBetween(ix - 45, iy, DESK_CX + 85, deskTop + 40);
      g.fillStyle(GOLD, 0.5); g.fillCircle(ix - 45, iy, 3);
    });

    // Floating panels → desk (vertical drops)
    [[288, 238], [512, 228]].forEach(([px, py]) => {
      g.lineBetween(px, py + 42, px, deskTop + 10);
      g.fillStyle(GOLD, 0.5); g.fillCircle(px, deskTop + 10, 3);
    });
  }

  // ── Central desk scene (enlarged) ─────────────────────────────────────────

  private buildDeskScene() {
    const g = this.add.graphics();
    const cx = DESK_CX;
    const deskY = DESK_Y;
    const deskW = 200, deskH = 64;

    // Drop shadow
    g.fillStyle(0x000000, 0.3).fillEllipse(cx, deskY + deskH + 14, deskW + 40, 22);

    // Chair back
    g.fillStyle(0x2a2a2a).fillRoundedRect(cx - 30, deskY - 50, 60, 88, 7);
    g.fillStyle(0x1a1a1a).fillRoundedRect(cx - 30, deskY - 64, 60, 20, 7);
    g.lineStyle(1, 0x444444, 0.5).strokeRoundedRect(cx - 30, deskY - 64, 60, 20, 7);

    // Player body (suit)
    const bw = 36, bh = 36;
    g.fillStyle(0x1c3a6e).fillRoundedRect(cx - bw/2, deskY - bh - 6, bw, bh, 4);
    // Tie detail
    g.fillStyle(0x0a1a40).fillTriangle(cx - 4, deskY - bh - 4, cx + 4, deskY - bh - 4, cx, deskY - 10);
    // Shirt highlight
    g.fillStyle(0xffffff, 0.12).fillRect(cx - bw/2 + 3, deskY - bh - 3, 10, 10);

    // Head
    const headY = deskY - bh - 22;
    g.fillStyle(0xF5C518).fillCircle(cx, headY, 14);
    g.lineStyle(1.5, 0xB89010).strokeCircle(cx, headY, 14);
    // Eyes
    g.fillStyle(0x1a1000);
    g.fillCircle(cx - 4, headY - 2, 2.5);
    g.fillCircle(cx + 4, headY - 2, 2.5);
    // Hair
    g.fillStyle(0x1a1000).fillEllipse(cx, headY - 10, 28, 14);
    g.fillStyle(0x1a1000).fillRect(cx - 14, headY - 14, 28, 8);

    // Desk surface
    g.fillStyle(0x6b4f0e).fillRoundedRect(cx - deskW/2, deskY, deskW, deskH, 5);
    g.fillStyle(GOLD, 0.2).fillRoundedRect(cx - deskW/2 + 8, deskY + 8, deskW - 16, deskH - 16, 3);
    g.lineStyle(1, GOLD, 0.3).strokeRoundedRect(cx - deskW/2, deskY, deskW, deskH, 5);

    // Monitor
    g.fillStyle(0x111111).fillRoundedRect(cx - 32, deskY - 40, 64, 42, 3);
    g.fillStyle(0x4477cc, 0.75).fillRect(cx - 26, deskY - 35, 52, 32);
    // Screen code lines
    g.lineStyle(1, 0x88aaff, 0.6);
    [0,8,16,24].forEach(dy => g.lineBetween(cx - 20, deskY - 32 + dy, cx - 2 + dy * 0.5, deskY - 32 + dy));
    // Monitor stand
    g.fillStyle(0x333333).fillRect(cx - 5, deskY, 10, 5);
    g.fillStyle(0x444444).fillRect(cx - 12, deskY + 4, 24, 4);

    // Desk items: coffee mug
    g.fillStyle(0x336699).fillRect(cx + 72, deskY + 8, 16, 18);
    g.fillStyle(0x4488bb, 0.5).fillRect(cx + 74, deskY + 10, 12, 8);
    g.lineStyle(1, 0x88aacc, 0.5).lineBetween(cx + 88, deskY + 14, cx + 96, deskY + 12);

    // Desk items: plant
    g.fillStyle(0x2a5a1a).fillCircle(cx - 82, deskY + 8, 9);
    g.fillStyle(0x3a7a28).fillCircle(cx - 88, deskY + 14, 6);
    g.fillStyle(0x4a7a2a).fillCircle(cx - 76, deskY + 14, 5);
    g.fillStyle(0x5a3a10).fillRect(cx - 86, deskY + 18, 8, 10);

    // Lamp
    g.fillStyle(0x888888).fillRect(cx - 55, deskY - 10, 4, 30);
    g.fillStyle(0xddddaa, 0.9).fillTriangle(cx - 72, deskY - 12, cx - 38, deskY - 12, cx - 55, deskY - 28);
    g.fillStyle(0xffeeaa, 0.15).fillEllipse(cx - 55, deskY + 5, 80, 30);

    // "新入社員" badge below desk
    const badgeY = deskY + deskH + 18;
    g.fillStyle(0x0a1828, 0.9).fillRoundedRect(cx - 52, badgeY - 10, 104, 22, 4);
    g.lineStyle(1, GOLD, 0.7).strokeRoundedRect(cx - 52, badgeY - 10, 104, 22, 4);
    this.add.text(cx, badgeY + 1, '新入社員', {
      fontSize: '13px', color: GOLD_S, fontFamily: JP, fontStyle: 'bold',
    }).setOrigin(0.5);
  }

  // ── Skill icons ───────────────────────────────────────────────────────────

  private buildSkillIcons() {
    // Left column hexagons (fade in staggered)
    this.hexIcon(115, 255, '顧客対応', (g, cx, cy) => {
      // Two people silhouettes
      g.fillStyle(GOLD, 0.8);
      g.fillCircle(cx - 8, cy - 6, 7); g.fillCircle(cx + 8, cy - 6, 7);
      g.fillRoundedRect(cx - 18, cy + 3, 16, 14, 3);
      g.fillRoundedRect(cx + 2, cy + 3, 16, 14, 3);
    }, 400);

    this.hexIcon(100, 390, '打ち合わせ', (g, cx, cy) => {
      // Speech bubble
      g.fillStyle(GOLD, 0.8);
      g.fillRoundedRect(cx - 14, cy - 14, 28, 20, 5);
      g.fillTriangle(cx - 8, cy + 6, cx - 14, cy + 16, cx + 2, cy + 6);
      // Dots inside bubble
      g.fillStyle(0x05080f, 0.9);
      [-6, 0, 6].forEach(dx => g.fillCircle(cx + dx, cy - 4, 2));
    }, 600);

    // Right column hexagons
    this.hexIcon(685, 255, 'インフラ', (g, cx, cy) => {
      // Server stack
      g.fillStyle(GOLD, 0.8);
      [-12, 0, 12].forEach(dy => {
        g.fillRoundedRect(cx - 16, cy + dy - 5, 32, 8, 2);
        g.fillStyle(0x44ff88, 0.8).fillCircle(cx + 10, cy + dy - 1, 2.5);
        g.fillStyle(GOLD, 0.8);
      });
    }, 400);

    this.hexIcon(685, 390, 'タスク管理', (g, cx, cy) => {
      // Checklist
      g.fillStyle(GOLD, 0.8);
      [-10, 0, 10].forEach(dy => {
        g.fillRect(cx - 16, cy + dy - 3, 8, 6);        // checkbox
        g.fillRect(cx - 3, cy + dy, 18, 2);            // line
        g.fillStyle(0x05080f, 0.9).fillRect(cx - 15, cy + dy - 2, 6, 4); // check void
        g.fillStyle(0x44ff88, 0.9).fillRect(cx - 14, cy + dy - 1, 3, 2); // tick
        g.fillStyle(GOLD, 0.8);
      });
    }, 600);

    // Floating panels (プロジェクト管理, 開発)
    this.floatingPanel(288, 195, 'プロジェクト管理', (g, cx, cy) => {
      // Gantt bars
      g.fillStyle(GOLD, 0.85);
      const bars = [[0, 50], [20, 70], [35, 65], [50, 80]];
      bars.forEach(([start, end], i) => {
        const barY = cy - 10 + i * 10;
        g.fillStyle(GOLD, 0.3).fillRect(cx - 45, barY, 90, 7);
        g.fillStyle(GOLD, 0.85).fillRect(cx - 45 + start * 0.9, barY, (end - start) * 0.9, 7);
      });
    }, 200);

    this.floatingPanel(512, 185, '開発', (g, cx, cy) => {
      // Code block
      g.fillStyle(GOLD, 0.35).fillRoundedRect(cx - 44, cy - 20, 88, 36, 3);
      this.add.text(cx, cy - 2, '</>', {
        fontSize: '20px', color: GOLD_L, fontFamily: 'monospace', fontStyle: 'bold',
      }).setOrigin(0.5);
      // Syntax highlight lines
      g.fillStyle(0x6699ff, 0.5).fillRect(cx - 36, cy + 18, 40, 4);
      g.fillStyle(0xff9966, 0.5).fillRect(cx - 36, cy + 18, 20, 4);
    }, 200);

    // Small ドキュメント badge (right side middle)
    this.floatingPanel(682, 318, 'ドキュメント', (g, cx, cy) => {
      // Document icon
      g.fillStyle(GOLD, 0.8);
      g.fillRoundedRect(cx - 14, cy - 18, 28, 34, 2);
      g.fillStyle(0x05080f, 0.9);
      [-6, 0, 6].forEach(dy => g.fillRect(cx - 9, cy - 4 + dy, 18, 3));
      g.fillStyle(GOLD, 0.5).fillTriangle(cx + 4, cy - 18, cx + 14, cy - 8, cx + 4, cy - 8);
    }, 500);
  }

  // ── Hexagonal icon helper ─────────────────────────────────────────────────

  private hexIcon(
    cx: number, cy: number, label: string,
    drawFn: (g: Phaser.GameObjects.Graphics, cx: number, cy: number) => void,
    delay: number,
  ) {
    const g = this.add.graphics().setAlpha(0);
    const r = 40;
    const pts = this.hexPoints(cx, cy, r);

    g.fillStyle(0x070e1c, 0.94).fillPoints(pts, true);
    g.lineStyle(1.5, GOLD, 0.8).strokePoints(pts, true);
    // Inner hex ring
    const inner = this.hexPoints(cx, cy, r - 6);
    g.lineStyle(1, GOLD, 0.2).strokePoints(inner, true);

    drawFn(g, cx, cy);

    const lbl = this.add.text(cx, cy + r + 8, label, {
      fontSize: '11px', color: GOLD_S, fontFamily: JP,
    }).setOrigin(0.5, 0).setAlpha(0);

    this.tweens.add({ targets: [g, lbl], alpha: 1, duration: 500, delay, ease: 'Sine.InOut' });
  }

  // ── Floating panel helper ─────────────────────────────────────────────────

  private floatingPanel(
    cx: number, cy: number, title: string,
    drawFn: (g: Phaser.GameObjects.Graphics, cx: number, cy: number) => void,
    delay: number,
  ) {
    const w = 96, h = 66;
    const g = this.add.graphics().setAlpha(0);

    g.fillStyle(0x070e1c, 0.92).fillRoundedRect(cx - w/2, cy - h/2, w, h, 4);
    g.lineStyle(1, GOLD, 0.7).strokeRoundedRect(cx - w/2, cy - h/2, w, h, 4);
    g.lineStyle(1, GOLD, 0.3).lineBetween(cx - w/2 + 4, cy - h/2 + 18, cx + w/2 - 4, cy - h/2 + 18);

    const hdr = this.add.text(cx, cy - h/2 + 9, title, {
      fontSize: '9px', color: GOLD_S, fontFamily: JP,
    }).setOrigin(0.5, 0.5).setAlpha(0);

    drawFn(g, cx, cy + 8);

    this.tweens.add({ targets: [g, hdr], alpha: 1, duration: 500, delay, ease: 'Sine.InOut' });

    // Gentle float animation
    this.tweens.add({
      targets: [g, hdr], y: '-=6', duration: 2200 + delay,
      yoyo: true, repeat: -1, ease: 'Sine.InOut', delay: delay + 300,
    });
  }

  // ── Hex point helpers ─────────────────────────────────────────────────────

  private hexPoints(cx: number, cy: number, r: number): Phaser.Types.Math.Vector2Like[] {
    return Array.from({ length: 6 }, (_, i) => {
      const a = (i * 60 - 30) * Math.PI / 180;
      return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    });
  }

  private diamond(g: Phaser.GameObjects.Graphics, x: number, y: number, r: number) {
    g.fillTriangle(x - r, y, x, y - r, x + r, y);
    g.fillTriangle(x - r, y, x, y + r, x + r, y);
  }

  // ── Title text ────────────────────────────────────────────────────────────

  private buildTitleText() {
    // Glow layer (behind)
    const glow = this.add.text(CX, 55, 'SIer道場', {
      fontSize: '68px', color: '#c8a030', fontFamily: JP, fontStyle: 'bold',
    }).setOrigin(0.5, 0).setAlpha(0.25).setBlendMode(Phaser.BlendModes.ADD);
    glow.setScale(1.04);

    // Main title
    const title = this.add.text(CX, -80, 'SIer道場', {
      fontSize: '68px', color: '#ffffff', fontFamily: JP, fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 7,
    }).setOrigin(0.5, 0);
    title.setShadow(0, 3, '#000000', 8, true, true);

    this.tweens.add({ targets: title, y: 50, duration: 900, delay: 100, ease: 'Back.Out' });
    // Pulse glow
    this.tweens.add({ targets: glow, alpha: { from: 0.15, to: 0.45 }, duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.InOut', delay: 1200 });
  }

  // ── Subtitle with decorative dividers ────────────────────────────────────

  private buildSubtitle() {
    const sub = this.add.text(CX, 138, '◇ 日本のSIer現場を体験せよ ◇', {
      fontSize: '14px', color: '#ddb84a', fontFamily: JP, letterSpacing: 3,
    }).setOrigin(0.5, 0).setAlpha(0);

    // Divider lines
    const g = this.add.graphics().setAlpha(0);
    g.lineStyle(1, GOLD, 0.5);
    g.lineBetween(CX - 240, 157, CX - 170, 157);
    g.lineBetween(CX + 170, 157, CX + 240, 157);
    g.fillStyle(GOLD, 0.8);
    [CX - 170, CX + 170].forEach(x => this.diamond(g, x, 157, 4));

    this.tweens.add({ targets: [sub, g], alpha: 1, duration: 600, delay: 900 });
  }

  // ── Start prompt ──────────────────────────────────────────────────────────

  private buildStartPrompt() {
    // Background pill
    const g = this.add.graphics();
    g.fillStyle(0x0a1828, 0.7).fillRoundedRect(CX - 130, CANVAS_H - 78, 260, 30, 6);
    g.lineStyle(1, GOLD, 0.45).strokeRoundedRect(CX - 130, CANVAS_H - 78, 260, 30, 6);

    const prompt = this.add.text(CX, CANVAS_H - 63, '◆  Spaceキーでスタート  ◆', {
      fontSize: '15px', color: '#ffeeaa', fontFamily: JP, fontStyle: 'bold',
    }).setOrigin(0.5);

    this.tweens.add({ targets: prompt, alpha: 0.2, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.InOut', delay: 1400 });
  }

  // ── Credits ───────────────────────────────────────────────────────────────

  private buildCredits() {
    this.add.text(CANVAS_W - 30, CANVAS_H - 14, 'Tileset: LimeZu Modern Office\n© 2026 SIer道場', {
      fontSize: '8px', color: '#334455', fontFamily: 'monospace', align: 'right', lineSpacing: 2,
    }).setOrigin(1, 1);
  }

  // ── Audio ─────────────────────────────────────────────────────────────────

  private scheduleTypingSound() {
    const delay = 80 + Math.random() * 180;
    this.typingTimer = this.time.delayedCall(delay, () => {
      try { sfx.typeChar(); } catch { /* audio unavailable */ }
      if (!this.started) this.scheduleTypingSound();
    });
  }

  // ── Start handler ─────────────────────────────────────────────────────────

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
