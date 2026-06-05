import * as Phaser from 'phaser';
import { getChapter } from '../data/chapters';
import type { ChapterDefinition, NPCDefinition, DocumentItem } from '../data/chapters';
import { gameState } from '../state/gameState';
import { sfx } from '../utils/audio';
import { getRandomEventForChapter } from '../data/randomEvents';

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

// ── Pixel art character sprites ──────────────────────────────────────────────
// 10 cols × 14 rows, rendered at 2 game-px per cell = 20 × 28 game pixels.
// 0 = transparent. Every character has a dark outline (0x111111) for crispness.

const O  = 0x111111; // outline / shoes / black
const SK = 0xFFCE9E; // skin
const SS = 0xD4956A; // skin shadow
const EY = 0x2C1A0E; // eye
const WH = 0xF8F8FF; // white shirt
const HB = 0x1A0E00; // dark hair base
const HD = 0x0A0500; // dark hair deep shadow

// Player
const YB = 0xF8C800; // hat bright yellow
const YD = 0xC49000; // hat dark yellow
const JL = 0x5498D8; // jacket highlight
const JC = 0x2F6EA0; // jacket base
const JD = 0x1A4270; // jacket shadow
const PC = 0x1A2850; // pants base
const PD = 0x0A1428; // pants shadow

// PM
const NC = 0x22223A; // navy suit
const ND = 0x0E0E20; // navy dark
const TI = 0xCC2222; // red tie
const GA = 0x888888; // glasses

// Senior / green
const GL = 0x2E8858; // green light
const GD = 0x185030; // green dark

// Client / slate
const CL = 0x3A68B0; // slate light
const CD = 0x1C3870; // slate dark

// Contractor / orange + light hair
const LH = 0xC89040; // light hair
const LD = 0x8A5C1A; // light hair dark
const OL = 0xD87030; // orange light
const OD = 0x9A4010; // orange dark

// Tech / ops
const TL = 0x4A9AD8; // tech blue light
const TD = 0x1A5080; // tech blue dark

const SPRITES: Record<string, number[][]> = {
  player: [
    [0, 0, YD, YB, YB, YB, YB, YD, 0, 0],  // hat
    [0,YD, YB, YB, YB, YB, YB, YB,YD, 0],  // hat brim
    [0, O,  O, SK, SK, SK, SK,  O,  0, 0],  // forehead outline
    [0, O, SK, SK, SK, SK, SK,  O,  0, 0],  // forehead
    [0, O, SK, EY, SK, EY, SK,  O,  0, 0],  // eyes
    [0, O, SK, SK, SS, SS, SK,  O,  0, 0],  // lower face / shadow
    [0, 0,  O, SK, SK, SK,  O,  0,  0, 0],  // neck
    [0, O, JL, JC, WH, WH, JC, JL,  O, 0], // collar
    [0, O, JD, JC, JL, JL, JC, JD,  O, 0], // chest
    [0, O, JD, JD, JC, JC, JD, JD,  O, 0], // waist
    [0, O, PD, PC,  O,  O, PC, PD,  O, 0], // pants split
    [0, O, PC, PC,  O,  O, PC, PC,  O, 0], // pants
    [0, O,  O,  O,  O,  O,  O,  O,  O, 0], // shoe top (outline)
    [O,  O,  O,  O,  O,  O,  O,  O,  O, 0], // shoes
  ],

  pm: [
    [0,  O, HB, HB, HB, HB, HB,  O,  0, 0], // hair
    [0, HB, HD, HD, HB, HB, HD, HB,  0, 0], // hair shade
    [0,  O,  O, SK, SK, SK, SK,  O,  0, 0], // forehead
    [0,  O, GA, SK, GA, SK, GA,  O,  0, 0], // glasses
    [0,  O, SK, SK, SS, SS, SK,  O,  0, 0], // lower face
    [0,  0,  O, SK, SK, SK,  O,  0,  0, 0], // neck
    [0,  O, NC, NC, WH, WH, NC, NC,  O, 0], // collar
    [0,  O, ND, NC, TI, TI, NC, ND,  O, 0], // suit + tie
    [0,  O, ND, NC, TI, TI, NC, ND,  O, 0], // suit + tie
    [0,  O, ND, ND, NC, NC, ND, ND,  O, 0], // waist
    [0,  O, ND, NC,  O,  O, NC, ND,  O, 0], // pants
    [0,  O, NC, NC,  O,  O, NC, NC,  O, 0], // pants
    [0,  O,  O,  O,  O,  O,  O,  O,  O, 0], // shoe top
    [O,   O,  O,  O,  O,  O,  O,  O,  O, 0], // shoes
  ],

  senior: [
    [0,  O, HB, HB, HB, HB, HB,  O,  0, 0],
    [0, HB, HD, HD, HB, HB, HD, HB,  0, 0],
    [0,  O,  O, SK, SK, SK, SK,  O,  0, 0],
    [0,  O, SK, EY, SK, EY, SK,  O,  0, 0],
    [0,  O, SK, SK, SS, SS, SK,  O,  0, 0],
    [0,  0,  O, SK, SK, SK,  O,  0,  0, 0],
    [0,  O, GL, GL, WH, WH, GL, GL,  O, 0],
    [0,  O, GD, GL, GL, GL, GL, GD,  O, 0],
    [0,  O, GD, GL, GD, GD, GL, GD,  O, 0],
    [0,  O, GD, GD, GL, GL, GD, GD,  O, 0],
    [0,  O, PD, PC,  O,  O, PC, PD,  O, 0],
    [0,  O, PC, PC,  O,  O, PC, PC,  O, 0],
    [0,  O,  O,  O,  O,  O,  O,  O,  O, 0],
    [O,   O,  O,  O,  O,  O,  O,  O,  O, 0],
  ],

  client: [
    [0,  O, HB, HB, HB, HB, HB,  O,  0, 0],
    [0, HB, HD, HD, HB, HB, HD, HB,  0, 0],
    [0,  O,  O, SK, SK, SK, SK,  O,  0, 0],
    [0,  O, SK, EY, SK, EY, SK,  O,  0, 0],
    [0,  O, SK, SK, SS, SS, SK,  O,  0, 0],
    [0,  0,  O, SK, SK, SK,  O,  0,  0, 0],
    [0,  O, CL, CL, WH, WH, CL, CL,  O, 0],
    [0,  O, CD, CL, CL, CL, CL, CD,  O, 0],
    [0,  O, CD, CL, CD, CD, CL, CD,  O, 0],
    [0,  O, CD, CD, CL, CL, CD, CD,  O, 0],
    [0,  O, CD, CL,  O,  O, CL, CD,  O, 0],
    [0,  O, CL, CL,  O,  O, CL, CL,  O, 0],
    [0,  O,  O,  O,  O,  O,  O,  O,  O, 0],
    [O,   O,  O,  O,  O,  O,  O,  O,  O, 0],
  ],

  contractor: [
    [0,  O, LH, LH, LH, LH, LH,  O,  0, 0], // light hair (older)
    [0, LH, LD, LD, LH, LH, LD, LH,  0, 0],
    [0,  O,  O, SK, SK, SK, SK,  O,  0, 0],
    [0,  O, SK, EY, SK, EY, SK,  O,  0, 0],
    [0,  O, SK, SK, SS, SS, SK,  O,  0, 0],
    [0,  0,  O, SK, SK, SK,  O,  0,  0, 0],
    [0,  O, OL, OL, WH, WH, OL, OL,  O, 0],
    [0,  O, OD, OL, OL, OL, OL, OD,  O, 0],
    [0,  O, OD, OL, OD, OD, OL, OD,  O, 0],
    [0,  O, OD, OD, OL, OL, OD, OD,  O, 0],
    [0,  O, PD, PC,  O,  O, PC, PD,  O, 0],
    [0,  O, PC, PC,  O,  O, PC, PC,  O, 0],
    [0,  O,  O,  O,  O,  O,  O,  O,  O, 0],
    [O,   O,  O,  O,  O,  O,  O,  O,  O, 0],
  ],

  tech: [
    [0,  O, HB, HB, HB, HB, HB,  O,  0, 0],
    [0, HB, HD, HD, HB, HB, HD, HB,  0, 0],
    [0,  O,  O, SK, SK, SK, SK,  O,  0, 0],
    [0,  O, SK, EY, SK, EY, SK,  O,  0, 0],
    [0,  O, SK, SK, SS, SS, SK,  O,  0, 0],
    [0,  0,  O, SK, SK, SK,  O,  0,  0, 0],
    [0,  O, TL, TL, WH, WH, TL, TL,  O, 0],
    [0,  O, TD, TL, TL, TL, TL, TD,  O, 0],
    [0,  O, TD, TL, TD, TD, TL, TD,  O, 0],
    [0,  O, TD, TD, TL, TL, TD, TD,  O, 0],
    [0,  O, PD, PC,  O,  O, PC, PD,  O, 0],
    [0,  O, PC, PC,  O,  O, PC, PC,  O, 0],
    [0,  O,  O,  O,  O,  O,  O,  O,  O, 0],
    [O,   O,  O,  O,  O,  O,  O,  O,  O, 0],
  ],
};

function spriteKeyForNpc(id: string): string {
  if (id.startsWith('tanaka')) return 'pm';
  if (id.startsWith('sato'))   return 'senior';
  if (id.startsWith('client')) return 'client';
  if (id.startsWith('suzuki')) return 'contractor';
  if (id.startsWith('ops'))    return 'tech';
  if (id.startsWith('other'))  return 'tech';
  return 'senior';
}

// ── Tile type → fill color
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

    // Listen for EventScene / RandomEventScene / DocumentScene completing
    this.game.events.on('sier-event-complete', this.onEventComplete, this);
    this.game.events.on('sier-random-event-done', this.onRandomEventDone, this);
    this.game.events.on('sier-document-closed', this.onDocumentClosed, this);

    // Redraw status & chars when resuming — ALWAYS reset interacting
    this.events.on('resume', () => {
      this.interacting = false;
      this.moveCooldown = 300;
      this.updateStatusBar();
      this.drawChars();
      this.checkProximity();
    });

    this.events.on('wake', () => {
      this.interacting = false;
      this.moveCooldown = 300;
    });

    // Trigger random event for this chapter (after intro is dismissed)
    this.time.delayedCall(800, () => this.tryTriggerRandomEvent());
  }

  private tryTriggerRandomEvent() {
    if (this.introShown || this.advancing) return;
    const randEvt = getRandomEventForChapter(
      this.chapter.id,
      gameState.triggeredRandomEvents,
      gameState.difficulty,
    );
    if (!randEvt) return;
    this.interacting = true;
    this.scene.launch('RandomEventScene', { event: randEvt });
    this.scene.pause('MapScene');
  }

  private onRandomEventDone() {
    this.updateStatusBar();
    this.drawChars();
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

    // Draw document items (papers on desks)
    this.drawDocuments();

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

  private drawDocuments() {
    const docs = this.chapter.documents ?? [];
    const { col: pc, row: pr } = this.playerTile;
    docs.forEach((doc) => {
      const x = doc.col * TILE;
      const y = MAP_Y + doc.row * TILE;

      // Paper visual on desk tile
      this.charGfx.fillStyle(0xF5F0D0, 1);
      this.charGfx.fillRect(x + 5, y + 8, 12, 16);
      this.charGfx.fillStyle(0xC8C080, 0.7);
      this.charGfx.fillRect(x + 7, y + 11, 8, 1);
      this.charGfx.fillRect(x + 7, y + 13, 8, 1);
      this.charGfx.fillRect(x + 7, y + 15, 8, 1);
      this.charGfx.lineStyle(1, 0x886640, 0.9);
      this.charGfx.strokeRect(x + 5, y + 8, 12, 16);

      // Sparkle/attention dot when player is close
      const near = Math.abs(doc.col - pc) <= 1 && Math.abs(doc.row - pr) <= 1;
      if (near) {
        this.charGfx.fillStyle(0xFFDD00, 0.95);
        this.charGfx.fillCircle(x + 11, y + 4, 4);
        this.charGfx.fillStyle(0xFFFFAA, 1);
        this.charGfx.fillCircle(x + 11, y + 4, 2);
      }
    });
  }

  /** Render a pixel-art sprite centred at (cx, cy). px = game-pixels per logical pixel. */
  private drawSprite(
    gfx: Phaser.GameObjects.Graphics,
    sprite: number[][],
    cx: number, cy: number,
    alpha = 1, px = 2,
  ) {
    const rows = sprite.length;
    const cols = sprite[0].length;
    const ox = cx - (cols * px) / 2;
    const oy = cy - (rows * px) / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const col = sprite[r][c];
        if (col !== 0) {
          gfx.fillStyle(col, alpha);
          gfx.fillRect(ox + c * px, oy + r * px, px, px);
        }
      }
    }
  }

  /** Draw grayscale version of a sprite (completed NPC). */
  private drawSpriteGray(
    gfx: Phaser.GameObjects.Graphics,
    sprite: number[][],
    cx: number, cy: number,
    px = 2,
  ) {
    const rows = sprite.length;
    const cols = sprite[0].length;
    const ox = cx - (cols * px) / 2;
    const oy = cy - (rows * px) / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const col = sprite[r][c];
        if (col !== 0) {
          // Convert to grayscale luminance
          const rr = (col >> 16) & 0xff;
          const gg = (col >> 8) & 0xff;
          const bb = col & 0xff;
          const lum = Math.round(rr * 0.299 + gg * 0.587 + bb * 0.114);
          const gray = (lum << 16) | (lum << 8) | lum;
          gfx.fillStyle(gray, 0.5);
          gfx.fillRect(ox + c * px, oy + r * px, px, px);
        }
      }
    }
  }

  private drawNPC(npc: NPCDefinition, completed: boolean) {
    const cx = npc.col * TILE + TILE / 2;
    const cy = MAP_Y + npc.row * TILE + TILE / 2 + 2;
    const sprite = SPRITES[spriteKeyForNpc(npc.id)] ?? SPRITES['senior'];

    // Shadow
    this.charGfx.fillStyle(0x000000, completed ? 0.08 : 0.18);
    this.charGfx.fillEllipse(cx, cy + 13, 18, 5);

    if (completed) {
      this.drawSpriteGray(this.charGfx, sprite, cx, cy);
      // Small ✓ badge
      this.charGfx.fillStyle(0x33cc66, 0.9);
      this.charGfx.fillCircle(cx + 9, cy - 13, 5);
      this.charGfx.fillStyle(0xffffff, 1);
      this.charGfx.fillRect(cx + 6, cy - 14, 2, 4);
      this.charGfx.fillRect(cx + 8, cy - 10, 4, 2);
    } else {
      this.drawSprite(this.charGfx, sprite, cx, cy);
    }
  }

  private drawPlayer() {
    const cx = this.playerTile.col * TILE + TILE / 2;
    const cy = MAP_Y + this.playerTile.row * TILE + TILE / 2 + 2;

    // Shadow
    this.charGfx.fillStyle(0x000000, 0.2);
    this.charGfx.fillEllipse(cx, cy + 13, 20, 6);

    this.drawSprite(this.charGfx, SPRITES['player'], cx, cy);

    // "▼YOU" arrow above player
    this.charGfx.fillStyle(0xffff00, 0.9);
    this.charGfx.fillTriangle(cx - 4, cy - 28, cx + 4, cy - 28, cx, cy - 22);
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
    const nearbyDoc = this.getNearbyDocument();
    if (nearbyDoc) {
      this.hintText.setText('📄 Zキーで資料を確認する');
      return;
    }
    const nearby = this.getNearbyNPC();
    if (nearby && !gameState.completedEvents.has(nearby.eventId)) {
      this.hintText.setText(`【${nearby.name}】に近づいてZキーで話しかける`);
    } else if (allDone) {
      const unreadDoc = (this.chapter.documents ?? [])
        .find((d) => d.required && gameState.getFlag(`doc-seen-${d.id}`) !== 'true');
      this.hintText.setText(unreadDoc
        ? '📄 机の上の資料を確認してから出口へ進もう'
        : '全員と話し終えました！右下の出口（緑タイル）へ進んでください');
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

  private getNearbyDocument(): DocumentItem | null {
    const docs = this.chapter.documents ?? [];
    const { col, row } = this.playerTile;
    return docs.find((doc) =>
      Math.abs(doc.col - col) <= 1 && Math.abs(doc.row - row) <= 1
    ) ?? null;
  }

  private onDocumentClosed(docId: string) {
    // Save "seen" flag so exit gate can check it
    gameState.setFlag(`doc-seen-${docId}`, 'true');
    this.drawChars();
  }

  private tryInteract() {
    // Safety: never double-launch EventScene or DocumentScene
    if (this.scene.isActive('EventScene') || this.scene.isSleeping('EventScene')) return;
    if (this.scene.isActive('DocumentScene') || this.scene.isSleeping('DocumentScene')) return;

    // Check document items first
    const nearbyDoc = this.getNearbyDocument();
    if (nearbyDoc) {
      this.interacting = true;
      this.scene.launch('DocumentScene', { document: nearbyDoc });
      this.scene.pause('MapScene');
      sfx.select();
      return;
    }

    const allDone = this.chapter.events.every((id) => gameState.completedEvents.has(id));
    const nearby = this.getNearbyNPC();

    // NPC interaction — always launchable (even if already talked)
    if (nearby) {
      if (!gameState.completedEvents.has(nearby.eventId)) {
        // First talk: triggers the event
        this.interacting = true;
        this.moveCooldown = 200;
        this.scene.launch('EventScene', { eventId: nearby.eventId });
        this.scene.pause('MapScene');
        sfx.select();
        return;
      } else {
        // Already talked: show a quick re-greeting notice (no full event)
        this.showNotice(`${nearby.name}：「もし他にも疑問があれば聞いてね。」`, 2200);
        return;
      }
    }

    if (allDone && this.isNearExit()) {
      // Check required documents before advancing
      const unreadDoc = (this.chapter.documents ?? [])
        .find((d) => d.required && gameState.getFlag(`doc-seen-${d.id}`) !== 'true');
      if (unreadDoc) {
        this.showNotice(unreadDoc.blockedHint ?? '周りをもう少し探索してみよう…', 2800);
        return;
      }
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
        const unreadDoc = (this.chapter.documents ?? [])
          .find((d) => d.required && gameState.getFlag(`doc-seen-${d.id}`) !== 'true');
        if (unreadDoc) {
          // Show notice only when it's not already visible (prevent per-frame spam)
          if (!this.noticeText.text) {
            this.showNotice(unreadDoc.blockedHint ?? '周りをもう少し探索してみよう…', 2800);
          }
          // NO return here — player must still be able to move away
        } else {
          this.advanceChapter();
          return;
        }
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
    this.game.events.off('sier-random-event-done', this.onRandomEventDone, this);
    this.game.events.off('sier-document-closed', this.onDocumentClosed, this);
  }
}
