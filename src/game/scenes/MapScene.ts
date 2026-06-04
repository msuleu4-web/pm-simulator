import * as Phaser from 'phaser';
import { getChapter } from '../data/chapters';
import type { ChapterDefinition, NPCDefinition } from '../data/chapters';
import { gameState } from '../state/gameState';
import { sfx } from '../utils/audio';

const TILE = 32;
const MAP_COLS = 25;
const MAP_ROWS = 14;
const STATUS_H = 82;
const MAP_Y = STATUS_H;
const VPAD_Y = MAP_Y + MAP_ROWS * TILE + 6; // 82 + 448 + 6 = 536
const CANVAS_W = 800;
const CANVAS_H = 598;
// Japanese-friendly font for readable status/hint text
const JP = '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", "Meiryo", Arial, sans-serif';

// Tile type → fill color
const TILE_COLORS: Record<number, number> = {
  0: 0xd4d9e3,  // floor
  1: 0x3d4252,  // wall
  2: 0x8b6914,  // desk
  3: 0x4caf50,  // exit (green)
  4: 0x5c4033,  // meeting table
  5: 0x1b5e20,  // server rack
  6: 0x7eb3ce,  // window
  7: 0x2e7d32,  // plant
};

// Walkable tile types
const WALKABLE = new Set([0, 3, 8]);

export class MapScene extends Phaser.Scene {
  private chapter!: ChapterDefinition;
  private tileMap: number[][] = [];
  private playerTile = { col: 0, row: 0 };
  private moveCooldown = 0;
  private interacting = false;
  private advancing = false;

  private mapGfx!: Phaser.GameObjects.Graphics;
  private charGfx!: Phaser.GameObjects.Graphics;
  private statusGfx!: Phaser.GameObjects.Graphics;
  private uiGfx!: Phaser.GameObjects.Graphics;

  private statusTexts: Phaser.GameObjects.Text[] = [];
  private chapterLabel!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private noticeText!: Phaser.GameObjects.Text;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdUp!: Phaser.Input.Keyboard.Key;
  private wasdDown!: Phaser.Input.Keyboard.Key;
  private wasdLeft!: Phaser.Input.Keyboard.Key;
  private wasdRight!: Phaser.Input.Keyboard.Key;
  private confirmKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;

  private virtualDir = { up: false, down: false, left: false, right: false };
  private virtualConfirm = false;

  private introShown = false;
  private introText!: Phaser.GameObjects.Text;
  private introBg!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'MapScene' });
  }

  init(data: { chapterId: number }) {
    const id = data?.chapterId ?? gameState.currentChapter;
    gameState.currentChapter = id;
    this.chapter = getChapter(id);
    this.tileMap = this.chapter.mapRows.map((row) => row.split('').map(Number));
    this.playerTile = { ...this.chapter.playerStart };
    this.moveCooldown = 0;
    this.interacting = false;
    this.introShown = false;
    this.advancing = false;
    this.virtualDir = { up: false, down: false, left: false, right: false };
    this.virtualConfirm = false;
  }

  create() {
    this.cameras.main.setBackgroundColor(this.chapter.bgColor);

    // Layers (draw order)
    this.mapGfx = this.add.graphics();
    this.charGfx = this.add.graphics();
    this.uiGfx = this.add.graphics();
    this.statusGfx = this.add.graphics();

    this.buildMap();
    this.createStatusBar();
    this.createHintText();   // must be before drawChars() which calls updateHint()
    this.drawChars();
    this.createVirtualPad();
    this.showChapterIntro();

    // Keyboard
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasdUp    = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.wasdDown  = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.wasdLeft  = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.wasdRight = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.confirmKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.enterKey   = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // Listen for EventScene completing
    this.game.events.on('sier-event-complete', this.onEventComplete, this);

    // Redraw status & chars when resuming from EventScene — ALWAYS reset interacting
    this.events.on('resume', () => {
      this.interacting = false;   // reset first so update() can run again
      this.moveCooldown = 300;    // brief grace period after resume
      this.updateStatusBar();
      this.drawChars();
      this.checkProximity();
    });

    // Also reset interacting if scene wakes (in case of sleep/wake instead of pause/resume)
    this.events.on('wake', () => {
      this.interacting = false;
      this.moveCooldown = 300;
    });
  }

  // ── Map drawing ─────────────────────────────────────────────

  private buildMap() {
    this.mapGfx.clear();
    for (let row = 0; row < MAP_ROWS; row++) {
      for (let col = 0; col < MAP_COLS; col++) {
        const type = this.tileMap[row]?.[col] ?? 1;
        this.drawTile(col, row, type);
      }
    }
  }

  private drawTile(col: number, row: number, type: number) {
    const x = col * TILE;
    const y = MAP_Y + row * TILE;
    const color = TILE_COLORS[type] ?? TILE_COLORS[0];

    this.mapGfx.fillStyle(color, 1);
    this.mapGfx.fillRect(x, y, TILE, TILE);

    // Wall top edge highlight
    if (type === 1) {
      this.mapGfx.fillStyle(0x555b6d, 1);
      this.mapGfx.fillRect(x, y, TILE, 4);
    }

    // Floor grid line
    if (type === 0) {
      this.mapGfx.lineStyle(1, 0x000000, 0.06);
      this.mapGfx.strokeRect(x, y, TILE, TILE);
    }

    // Desk detail
    if (type === 2) {
      this.mapGfx.fillStyle(0x6b5010, 1);
      this.mapGfx.fillRect(x + 3, y + 3, TILE - 6, TILE - 6);
      this.mapGfx.fillStyle(0xc0a030, 0.5);
      this.mapGfx.fillRect(x + 6, y + 6, TILE - 12, TILE - 12);
    }

    // Server rack LEDs
    if (type === 5) {
      this.mapGfx.fillStyle(0x003300, 1);
      this.mapGfx.fillRect(x + 2, y + 2, TILE - 4, TILE - 4);
      this.mapGfx.fillStyle(0x00ff44, 0.9);
      this.mapGfx.fillCircle(x + 8, y + 8, 3);
      this.mapGfx.fillStyle(0xff4400, 0.9);
      this.mapGfx.fillCircle(x + 16, y + 8, 3);
      this.mapGfx.fillStyle(0x00aaff, 0.9);
      this.mapGfx.fillCircle(x + 24, y + 8, 3);
    }

    // Exit tile — plain green floor tile, no decorations
    if (type === 3) {
      this.mapGfx.fillStyle(0x2a7a40, 1);
      this.mapGfx.fillRect(x, y, TILE, TILE);
      this.mapGfx.fillStyle(0x4cbb6a, 0.6);
      this.mapGfx.fillRect(x + 6, y + 6, TILE - 12, TILE - 12);
    }

    // Window (wall with lighter center)
    if (type === 6) {
      this.mapGfx.fillStyle(0x7eb3ce, 1);
      this.mapGfx.fillRect(x, y, TILE, TILE);
      this.mapGfx.fillStyle(0xb0d8f0, 0.6);
      this.mapGfx.fillRect(x + 4, y + 4, TILE - 8, TILE - 8);
    }

    // Meeting table
    if (type === 4) {
      this.mapGfx.fillStyle(0x3e2810, 1);
      this.mapGfx.fillRect(x + 2, y + 2, TILE - 4, TILE - 4);
    }
  }

  // ── Character drawing ─────────────────────────────────────────

  private drawChars() {
    this.charGfx.clear();

    const allDone = this.chapter.events.every((id) => gameState.completedEvents.has(id));

    // Draw NPCs
    this.chapter.npcs.forEach((npc) => {
      const done = gameState.completedEvents.has(npc.eventId);
      this.drawNPC(npc, done);
    });

    // Draw player
    this.drawPlayer();

    // Update hint
    this.updateHint(allDone);
  }

  private drawNPC(npc: NPCDefinition, completed: boolean) {
    const x = npc.col * TILE + TILE / 2;
    const y = MAP_Y + npc.row * TILE + TILE / 2;
    const color = completed ? 0x666666 : npc.color;
    const alpha = completed ? 0.45 : 1;

    // Body
    this.charGfx.fillStyle(color, alpha);
    this.charGfx.fillRect(x - 9, y - 4, 18, 16);

    // Head
    this.charGfx.fillStyle(0xffe0b2, alpha);
    this.charGfx.fillCircle(x, y - 12, 9);

    // Completed check
    if (completed) {
      this.charGfx.fillStyle(0xaaaaaa, 0.6);
      this.charGfx.fillCircle(x, y - 12, 5);
    }
  }

  private drawPlayer() {
    const x = this.playerTile.col * TILE + TILE / 2;
    const y = MAP_Y + this.playerTile.row * TILE + TILE / 2;

    // Shadow
    this.charGfx.fillStyle(0x000000, 0.18);
    this.charGfx.fillEllipse(x, y + 12, 20, 8);

    // Body (blue suit)
    this.charGfx.fillStyle(0x2c5f8a, 1);
    this.charGfx.fillRect(x - 9, y - 4, 18, 16);

    // Head (skin)
    this.charGfx.fillStyle(0xffd5a0, 1);
    this.charGfx.fillCircle(x, y - 13, 9);

    // Hair
    this.charGfx.fillStyle(0x3d2b1a, 1);
    this.charGfx.fillRect(x - 8, y - 22, 16, 6);

    // Tie
    this.charGfx.fillStyle(0xcc2222, 1);
    this.charGfx.fillTriangle(x - 2, y - 4, x + 2, y - 4, x, y + 5);

    // "YOU" badge
    this.charGfx.fillStyle(0xffff00, 0.85);
    this.charGfx.fillRect(x - 10, y - 28, 20, 8);
    // (text drawn separately via hint text)
  }

  // ── Status bar ───────────────────────────────────────────────

  private createStatusBar() {
    // Remove old texts
    this.statusTexts.forEach((t) => t.destroy());
    this.statusTexts = [];

    // Background
    this.statusGfx.clear();
    this.statusGfx.fillStyle(0x0d1a2e, 0.97);
    this.statusGfx.fillRect(0, 0, CANVAS_W, STATUS_H);
    this.statusGfx.lineStyle(1, 0x2a4a70, 1);
    this.statusGfx.strokeRect(0, 0, CANVAS_W, STATUS_H);

    // Chapter label — always create fresh (scene instance is reused; stale refs cause errors)
    if (this.chapterLabel) { try { this.chapterLabel.destroy(); } catch { /* */ } }
    this.chapterLabel = this.add.text(10, 6, '', {
      fontSize: '13px',
      color: '#88aacc',
      fontFamily: JP,
    });
    this.chapterLabel.setText(`${this.chapter.phase}：${this.chapter.title}  📍${this.chapter.location}`);

    this.updateStatusBar();
  }

  private updateStatusBar() {
    this.statusGfx.clear();
    this.statusGfx.fillStyle(0x0d1a2e, 0.97);
    this.statusGfx.fillRect(0, 0, CANVAS_W, STATUS_H);
    this.statusGfx.lineStyle(1, 0x2a4a70, 1);
    this.statusGfx.strokeRect(0, 0, CANVAS_W, STATUS_H);

    const metrics: Array<{ label: string; value: number; color: number }> = [
      { label: '品質', value: gameState.quality,  color: 0x4caf50 },
      { label: 'コスト', value: gameState.cost,    color: 0x2196f3 },
      { label: '納期',  value: gameState.delivery, color: 0xff9800 },
      { label: '信頼度', value: gameState.trust,   color: 0xe91e63 },
    ];

    const barW = 140;
    const barH = 12;
    const startX = 10;
    const rowH = 26;

    metrics.forEach((m, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = startX + col * (CANVAS_W / 2 - 10);
      const y = 24 + row * rowH;

      // Remove old text if exists
      if (this.statusTexts[i]) this.statusTexts[i].destroy();

      const txt = this.add.text(x, y - 1, `${m.label}`, {
        fontSize: '12px',
        color: '#aabbcc',
        fontFamily: JP,
      });
      this.statusTexts[i] = txt;

      const bx = x + 44;
      // Bar background
      this.statusGfx.fillStyle(0x222a38, 1);
      this.statusGfx.fillRoundedRect(bx, y, barW, barH, 3);

      // Filled portion
      const filled = Math.max(0, Math.min(barW, (m.value / 100) * barW));
      const barColor = m.value >= 60 ? m.color : m.value >= 35 ? 0xffaa00 : 0xff3333;
      this.statusGfx.fillStyle(barColor, 0.9);
      this.statusGfx.fillRoundedRect(bx, y, filled, barH, 3);

      // Score label next to bar
      if (this.statusTexts[i + 4]) this.statusTexts[i + 4].destroy();
      const scoreTxt = this.add.text(bx + barW + 6, y - 1, `${m.value}`, {
        fontSize: '12px',
        color: '#ccddee',
        fontFamily: JP,
      });
      this.statusTexts[i + 4] = scoreTxt;
    });
  }

  // ── Hint text ────────────────────────────────────────────────

  private createHintText() {
    // Destroy stale refs if scene instance is reused across chapters
    if (this.hintText)   { try { this.hintText.destroy();   } catch { /* */ } }
    if (this.noticeText) { try { this.noticeText.destroy();  } catch { /* */ } }

    this.hintText = this.add.text(CANVAS_W / 2, MAP_Y + MAP_ROWS * TILE + 2, '', {
      fontSize: '13px',
      color: '#88aacc',
      fontFamily: JP,
      align: 'center',
    }).setOrigin(0.5, 0);

    this.noticeText = this.add.text(CANVAS_W / 2, MAP_Y + 6, '', {
      fontSize: '14px',
      color: '#ffdd88',
      fontFamily: JP,
      align: 'center',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 4 },
    }).setOrigin(0.5, 0);
  }

  private updateHint(allDone: boolean) {
    const nearby = this.getNearbyNPC();
    if (nearby && !gameState.completedEvents.has(nearby.eventId)) {
      this.hintText.setText(`【${nearby.name}】に近づいてZキーで話しかける`);
    } else if (allDone) {
      this.hintText.setText('全員と話し終えました！右下の出口（緑タイル）へ進んでください');
    } else {
      const remaining = this.chapter.events.filter((id) => !gameState.completedEvents.has(id)).length;
      this.hintText.setText(`残りNPC: ${remaining}人`);
    }
  }

  // ── Virtual D-pad ────────────────────────────────────────────

  private createVirtualPad() {
    const g = this.uiGfx;
    const cx = 90;
    const cy = VPAD_Y + 28;
    const r = 24;
    const btnColor = 0x334466;
    const btnAlpha = 0.78;

    type DirDef = { label: string; dx: number; dy: number; bx: number; by: number };
    const dirs: DirDef[] = [
      { label: '↑', dx:  0, dy: -1, bx: cx,      by: cy - r - 4 },
      { label: '↓', dx:  0, dy:  1, bx: cx,      by: cy + r + 4 },
      { label: '←', dx: -1, dy:  0, bx: cx - r - 4, by: cy },
      { label: '→', dx:  1, dy:  0, bx: cx + r + 4, by: cy },
    ];

    dirs.forEach((d) => {
      g.fillStyle(btnColor, btnAlpha);
      g.fillCircle(d.bx, d.by, r);
      g.lineStyle(1, 0x6688aa, 0.5);
      g.strokeCircle(d.bx, d.by, r);

      this.add.text(d.bx, d.by, d.label, {
        fontSize: '18px',
        color: '#aabbdd',
        fontFamily: 'monospace',
      }).setOrigin(0.5);

      const zone = this.add.zone(d.bx, d.by, r * 2, r * 2).setInteractive();

      const key = d.dx === -1 ? 'left' : d.dx === 1 ? 'right' : d.dy === -1 ? 'up' : 'down';
      zone.on('pointerdown', () => { this.virtualDir[key as keyof typeof this.virtualDir] = true; });
      zone.on('pointerup',   () => { this.virtualDir[key as keyof typeof this.virtualDir] = false; });
      zone.on('pointerout',  () => { this.virtualDir[key as keyof typeof this.virtualDir] = false; });
    });

    // Z/確認 button
    const zx = CANVAS_W - 80;
    const zy = cy;
    g.fillStyle(0x2a4a30, btnAlpha);
    g.fillCircle(zx, zy, r + 4);
    g.lineStyle(2, 0x4caf50, 0.7);
    g.strokeCircle(zx, zy, r + 4);
    this.add.text(zx, zy, '決定\n(Z)', {
      fontSize: '12px',
      color: '#88ffaa',
      fontFamily: 'monospace',
      align: 'center',
    }).setOrigin(0.5);
    const zZone = this.add.zone(zx, zy, (r + 4) * 2, (r + 4) * 2).setInteractive();
    zZone.on('pointerdown', () => { this.virtualConfirm = true; });
    zZone.on('pointerup',   () => { this.virtualConfirm = false; });
  }

  // ── Chapter intro overlay ─────────────────────────────────────

  private showChapterIntro() {
    this.introBg = this.add.graphics();
    this.introBg.fillStyle(0x000000, 0.82);
    this.introBg.fillRect(0, 0, CANVAS_W, CANVAS_H);

    this.introText = this.add.text(CANVAS_W / 2, CANVAS_H / 2, [
      this.chapter.phase,
      this.chapter.title,
      '',
      `📍 ${this.chapter.location}`,
      '',
      '（クリックまたはZキーで開始）',
    ], {
      fontSize: '22px',
      color: '#e0eeff',
      fontFamily: JP,
      align: 'center',
      lineSpacing: 10,
    }).setOrigin(0.5);

    this.introShown = true;

    // Dismiss on click or Z — add cooldown so the same keypress doesn't
    // also immediately trigger tryInteract() in update()
    const dismiss = () => {
      this.introBg.destroy();
      this.introText.destroy();
      this.introShown = false;
      this.moveCooldown = 400;  // grace period: ignore input right after intro
      sfx.confirm();
    };

    this.input.once('pointerdown', dismiss);
    this.input.keyboard!.once('keydown-Z', dismiss);
    this.input.keyboard!.once('keydown-ENTER', dismiss);
    this.input.keyboard!.once('keydown-SPACE', dismiss);
  }

  // ── Movement & interaction ────────────────────────────────────

  private isWalkable(col: number, row: number): boolean {
    if (col < 0 || col >= MAP_COLS || row < 0 || row >= MAP_ROWS) return false;
    const t = this.tileMap[row]?.[col] ?? 1;
    return WALKABLE.has(t);
  }

  private getNearbyNPC(): NPCDefinition | null {
    const { col, row } = this.playerTile;
    return (
      this.chapter.npcs.find((npc) => {
        const dc = Math.abs(npc.col - col);
        const dr = Math.abs(npc.row - row);
        return (dc === 1 && dr === 0) || (dc === 0 && dr === 1) || (dc === 0 && dr === 0);
      }) ?? null
    );
  }

  private isNearExit(): boolean {
    const { col, row } = this.playerTile;
    const { col: ec, row: er } = this.chapter.exitTile;
    return (col === ec && row === er) ||
      (Math.abs(col - ec) <= 1 && Math.abs(row - er) <= 1);
  }

  private tryMove(dx: number, dy: number) {
    const newCol = this.playerTile.col + dx;
    const newRow = this.playerTile.row + dy;
    if (!this.isWalkable(newCol, newRow)) return;

    this.playerTile = { col: newCol, row: newRow };
    sfx.step();
    this.drawChars();
    this.moveCooldown = 160;
  }

  private tryInteract() {
    // Safety: never double-launch EventScene
    if (this.scene.isActive('EventScene') || this.scene.isSleeping('EventScene')) return;

    const allDone = this.chapter.events.every((id) => gameState.completedEvents.has(id));
    const nearby = this.getNearbyNPC();

    if (nearby && !gameState.completedEvents.has(nearby.eventId)) {
      this.interacting = true;
      this.moveCooldown = 200;
      this.scene.launch('EventScene', { eventId: nearby.eventId });
      this.scene.pause('MapScene');
      sfx.select();
      return;
    }

    if (allDone && this.isNearExit()) {
      this.advanceChapter();
      return;
    }

    if (!allDone && this.isNearExit()) {
      this.showNotice('まだ話していないNPCがいます！', 2000);
    }
  }

  private advanceChapter() {
    if (this.advancing) return;
    this.advancing = true;
    try { sfx.nextChapter(); } catch { /* audio unavailable */ }

    const nextId = this.chapter.id + 1;
    if (nextId > 7) {
      this.scene.start('EndingScene');
    } else {
      // Use BootScene as relay — avoids Phaser's same-key scene restart limitation
      gameState.currentChapter = nextId;
      this.scene.start('BootScene', { relay: true });
    }
  }

  private showNotice(text: string, duration = 2000) {
    this.noticeText.setText(text);
    this.time.delayedCall(duration, () => {
      this.noticeText.setText('');
    });
  }

  private onEventComplete(_eventId: string) {
    this.updateStatusBar();
    this.drawChars();
  }

  private checkProximity() {
    const allDone = this.chapter.events.every((id) => gameState.completedEvents.has(id));
    this.updateHint(allDone);
  }

  // ── Main loop ─────────────────────────────────────────────────

  update(_time: number, delta: number) {
    if (this.introShown || this.interacting || this.advancing) return;

    this.moveCooldown = Math.max(0, this.moveCooldown - delta);

    // ── 出口チェック（毎フレーム。Z不要、乗るだけで進む） ──────────
    const { col: ec, row: er } = this.chapter.exitTile;
    const onExit = this.playerTile.col === ec && this.playerTile.row === er;
    if (onExit) {
      const allDone = this.chapter.events.every((id) => gameState.completedEvents.has(id));
      if (allDone) {
        this.advanceChapter();
        return;
      }
    }

    // ── Z / Enter / 決定ボタン → NPC話しかけ or 出口（隣接でも可） ──
    const confirmJust =
      Phaser.Input.Keyboard.JustDown(this.confirmKey) ||
      Phaser.Input.Keyboard.JustDown(this.enterKey) ||
      this.virtualConfirm;
    if (confirmJust) {
      this.virtualConfirm = false;
      this.tryInteract();
      return;
    }

    // ── 移動 ────────────────────────────────────────────────────────
    if (this.moveCooldown > 0) return;

    let dx = 0, dy = 0;
    if      (this.cursors.left.isDown  || this.wasdLeft.isDown  || this.virtualDir.left)  dx = -1;
    else if (this.cursors.right.isDown || this.wasdRight.isDown || this.virtualDir.right) dx =  1;
    else if (this.cursors.up.isDown    || this.wasdUp.isDown    || this.virtualDir.up)    dy = -1;
    else if (this.cursors.down.isDown  || this.wasdDown.isDown  || this.virtualDir.down)  dy =  1;

    if (dx !== 0 || dy !== 0) {
      this.tryMove(dx, dy);
    }
  }

  // Clean up global listeners when scene is destroyed/restarted
  shutdown() {
    this.game.events.off('sier-event-complete', this.onEventComplete, this);
  }
}
