import * as Phaser from 'phaser';
import { gameState } from '../state/gameState';
import { determineEnding, endingDefinitions } from '../data/endings';
import type { EndingDefinition } from '../data/endings';
import { saveGameResult } from '../utils/supabaseClient';
import { sfx } from '../utils/audio';

const CANVAS_W = 800;
const CANVAS_H = 598;
const JP = '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", "Meiryo", Arial, sans-serif';

// Per-ending theme tokens
interface Theme {
  headerBg: number;
  headerText: string;
  cardBg: number;
  cardAlpha: number;
  accentColor: number;
  accentText: string;
  badgeBg: number;
  badgeText: string;
  scoreBg: number;
  btnPrimary: number;
  btnPrimaryHover: number;
  bodyBg: number;
}

const THEMES: Record<string, Theme> = {
  A: {
    headerBg: 0x7a5c00, headerText: '#fff8d0',
    cardBg: 0xffffff, cardAlpha: 0.7,
    accentColor: 0xc49a00, accentText: '#5c3d00',
    badgeBg: 0xe8b800, badgeText: '#3a2800',
    scoreBg: 0xf5e9b0,
    btnPrimary: 0x7a5c00, btnPrimaryHover: 0x9a7a10,
    bodyBg: 0xfdf3c0,
  },
  B: {
    headerBg: 0x1a4a2a, headerText: '#d0ffd8',
    cardBg: 0xffffff, cardAlpha: 0.7,
    accentColor: 0x2e7a44, accentText: '#0d3018',
    badgeBg: 0x2e7a44, badgeText: '#ffffff',
    scoreBg: 0xd8f0df,
    btnPrimary: 0x1a4a2a, btnPrimaryHover: 0x2e6a3a,
    bodyBg: 0xe0f0e0,
  },
  C: {
    headerBg: 0x5c3000, headerText: '#ffe8c0',
    cardBg: 0xffffff, cardAlpha: 0.7,
    accentColor: 0xcc6600, accentText: '#3a1a00',
    badgeBg: 0xcc6600, badgeText: '#ffffff',
    scoreBg: 0xf5dfc0,
    btnPrimary: 0x5c3000, btnPrimaryHover: 0x7c4800,
    bodyBg: 0xfde8c0,
  },
  D: {
    headerBg: 0x1a1a4a, headerText: '#d0d0ff',
    cardBg: 0xffffff, cardAlpha: 0.65,
    accentColor: 0x3a3a8a, accentText: '#0d0d2a',
    badgeBg: 0x3a3a8a, badgeText: '#ffffff',
    scoreBg: 0xd8d8f0,
    btnPrimary: 0x1a1a4a, btnPrimaryHover: 0x2a2a6a,
    bodyBg: 0xe0e0f0,
  },
};

export class EndingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndingScene' });
  }

  async create() {
    const total = gameState.getTotalScore();
    const endingType = determineEnding(total, gameState.quality, gameState.delivery, gameState.trust);
    const ending = endingDefinitions[endingType];
    const theme = THEMES[endingType] ?? THEMES['B'];

    this.drawBackground(theme);
    this.drawHeader(ending, theme);
    this.drawStoryCard(ending, theme);
    this.drawScoreSection(theme, total);
    this.drawAdvice(ending, theme);
    this.drawButtons(theme, endingType, total);
    this.setupKeyboard();

    try {
      await saveGameResult({
        player_name: gameState.playerName || '新人SE',
        ending_type: endingType,
        total_score: total,
        quality_score: gameState.quality,
        cost_score: gameState.cost,
        delivery_score: gameState.delivery,
        trust_score: gameState.trust,
      });
    } catch { /* save failure is non-critical */ }

    sfx.nextChapter();
  }

  // ── Sections ──────────────────────────────────────────────────

  private drawBackground(t: Theme) {
    const bg = this.add.graphics();
    bg.fillStyle(t.bodyBg, 1);
    bg.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Subtle diagonal stripe pattern
    bg.fillStyle(0x000000, 0.03);
    for (let i = -CANVAS_H; i < CANVAS_W + CANVAS_H; i += 40) {
      bg.fillRect(i, 0, 20, CANVAS_H);
    }
  }

  private drawHeader(ending: EndingDefinition, t: Theme) {
    const g = this.add.graphics();

    // Header card
    g.fillStyle(t.headerBg, 1);
    g.fillRoundedRect(0, 0, CANVAS_W, 108, { tl: 0, tr: 0, bl: 24, br: 24 });

    // Grade badge circle
    const bx = 62, by = 54;
    g.fillStyle(t.badgeBg, 1);
    g.fillCircle(bx, by, 34);
    g.lineStyle(3, 0xffffff, 0.35);
    g.strokeCircle(bx, by, 34);

    // Grade letter
    this.add.text(bx, by, ending.type, {
      fontSize: '30px', fontStyle: 'bold',
      color: t.badgeText, fontFamily: JP,
    }).setOrigin(0.5);

    // Emoji + subtitle label
    this.add.text(116, 30, `${ending.emoji}  ${ending.subtitle}`, {
      fontSize: '12px', color: t.headerText,
      fontFamily: JP,
    }).setOrigin(0, 0.5).setAlpha(0.8);

    // Main title
    this.add.text(116, 66, ending.title, {
      fontSize: '26px', fontStyle: 'bold',
      color: t.headerText, fontFamily: JP,
    }).setOrigin(0, 0.5);

    // Player name badge (top right)
    this.add.text(CANVAS_W - 16, 20, `👤 ${gameState.playerName}`, {
      fontSize: '12px', color: t.headerText,
      fontFamily: JP,
    }).setOrigin(1, 0).setAlpha(0.75);
  }

  private drawStoryCard(ending: EndingDefinition, t: Theme) {
    const cx = CANVAS_W / 2;
    const cardY = 124, cardH = 128;
    const PAD = 32;

    const g = this.add.graphics();
    g.fillStyle(t.cardBg, t.cardAlpha);
    g.fillRoundedRect(PAD, cardY, CANVAS_W - PAD * 2, cardH, 12);
    g.lineStyle(1.5, t.accentColor, 0.5);
    g.strokeRoundedRect(PAD, cardY, CANVAS_W - PAD * 2, cardH, 12);

    // Left accent bar
    g.fillStyle(t.accentColor, 0.9);
    g.fillRoundedRect(PAD, cardY, 4, cardH, { tl: 12, tr: 0, bl: 12, br: 0 });

    this.add.text(cx, cardY + cardH / 2, ending.story, {
      fontSize: '13px', color: '#1a1a1a',
      fontFamily: JP, align: 'center',
      wordWrap: { width: CANVAS_W - PAD * 2 - 32, useAdvancedWrap: true },
      lineSpacing: 6,
    }).setOrigin(0.5);
  }

  private drawScoreSection(t: Theme, total: number) {
    const sectionY = 264;
    const scores = [
      { label: '品質',  val: gameState.quality },
      { label: 'コスト', val: gameState.cost },
      { label: '納期',  val: gameState.delivery },
      { label: '信頼度', val: gameState.trust },
    ];

    const cardW = 158, cardH = 88, gap = 12;
    const totalW = scores.length * cardW + (scores.length - 1) * gap;
    const startX = (CANVAS_W - totalW) / 2;

    const g = this.add.graphics();

    scores.forEach((s, i) => {
      const cx = startX + i * (cardW + gap);

      // Card background
      g.fillStyle(t.scoreBg, 0.9);
      g.fillRoundedRect(cx, sectionY, cardW, cardH, 10);
      g.lineStyle(1, t.accentColor, 0.3);
      g.strokeRoundedRect(cx, sectionY, cardW, cardH, 10);

      // Score bar background
      const barX = cx + 12, barY = sectionY + 52;
      const barW = cardW - 24, barH = 8;
      g.fillStyle(0x000000, 0.12);
      g.fillRoundedRect(barX, barY, barW, barH, 4);

      // Score bar fill
      const filled = Math.max(0, Math.min(barW, (s.val / 100) * barW));
      const barColor = s.val >= 65 ? 0x22aa44 : s.val >= 40 ? 0xdd8800 : 0xcc2222;
      g.fillStyle(barColor, 0.9);
      g.fillRoundedRect(barX, barY, filled, barH, 4);

      const midX = cx + cardW / 2;

      // Label
      this.add.text(midX, sectionY + 16, s.label, {
        fontSize: '11px', color: '#555555', fontFamily: JP,
      }).setOrigin(0.5);

      // Score value
      const scoreColor = s.val >= 65 ? '#1a7a2a' : s.val >= 40 ? '#886600' : '#aa1a1a';
      this.add.text(midX, sectionY + 35, `${s.val}`, {
        fontSize: '22px', fontStyle: 'bold',
        color: scoreColor, fontFamily: JP,
      }).setOrigin(0.5);

      this.add.text(midX, sectionY + 70, '/100', {
        fontSize: '10px', color: '#888888', fontFamily: JP,
      }).setOrigin(0.5);
    });

    // Total score line
    const rank = total >= 320 ? 'S' : total >= 270 ? 'A' : total >= 220 ? 'B' : total >= 160 ? 'C' : 'D';
    const rankColor = rank === 'S' || rank === 'A' ? '#1a7a2a' : rank === 'B' ? '#886600' : '#aa1a1a';

    this.add.text(CANVAS_W / 2 - 30, sectionY + cardH + 12, `合計スコア：${total} / 400`, {
      fontSize: '13px', color: '#444444', fontFamily: JP,
    }).setOrigin(0.5);

    this.add.text(CANVAS_W / 2 + 90, sectionY + cardH + 12, `総合 ${rank}`, {
      fontSize: '13px', fontStyle: 'bold',
      color: rankColor, fontFamily: JP,
    }).setOrigin(0.5);
  }

  private drawAdvice(ending: EndingDefinition, t: Theme) {
    const advY = 388;
    const PAD = 32;
    const g = this.add.graphics();

    g.fillStyle(t.accentColor, 0.1);
    g.fillRoundedRect(PAD, advY, CANVAS_W - PAD * 2, 68, 10);
    g.lineStyle(1, t.accentColor, 0.25);
    g.strokeRoundedRect(PAD, advY, CANVAS_W - PAD * 2, 68, 10);

    this.add.text(CANVAS_W / 2, advY + 34, ending.advice, {
      fontSize: '12px', color: '#333333',
      fontFamily: JP, align: 'center',
      wordWrap: { width: CANVAS_W - PAD * 2 - 24, useAdvancedWrap: true },
      lineSpacing: 5,
    }).setOrigin(0.5);
  }

  private drawButtons(t: Theme, endingType: string, total: number) {
    const BW = 190, BH = 44, BY = 472, GAP = 10;
    const g = this.add.graphics();

    // ── Row 1: Reflection chat (full width) ──
    const chatBtnX = CANVAS_W / 2 - (BW + GAP / 2 + BW / 2 + GAP / 2) / 2 - 20;
    this.makeButton(g, 32, BY, CANVAS_W - 64, 44, 0x1a3a5c, '💬 クライアントと振り返る（AI）', '#a8d8ff', () => {
      sfx.select();
      // Dispatch to React wrapper to open chat overlay
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sier-open-reflection', {
          detail: {
            playerName: gameState.playerName,
            endingType,
            quality:  gameState.quality,
            cost:     gameState.cost,
            delivery: gameState.delivery,
            trust:    gameState.trust,
            total,
          },
        }));
      }
    }, 0x254a6a);
    void chatBtnX;

    // ── Row 2: Ranking + Play again ──
    const leftX = CANVAS_W / 2 - BW - GAP / 2;
    const rightX = CANVAS_W / 2 + GAP / 2;
    const BY2 = BY + 54;

    this.makeButton(g, leftX, BY2, BW, BH, t.btnPrimary, 'ランキングを見る 🏆', '#ffffff', () => {
      sfx.select();
      this.scene.start('RankingScene');
    }, t.btnPrimaryHover);

    // Play again button (secondary)
    this.makeButton(g, rightX, BY2, BW, BH, 0x3a3a3a, 'もう一度プレイ ↺', '#ffffff', () => {
      sfx.select();
      gameState.reset();
      this.scene.start('BootScene', { relay: false });
    }, 0x555555);

    // Keyboard hint
    this.add.text(CANVAS_W / 2, BY2 + BH + 14, 'R：ランキング　P：もう一度プレイ', {
      fontSize: '11px', color: '#888888', fontFamily: JP,
    }).setOrigin(0.5);
  }

  private makeButton(
    _g: Phaser.GameObjects.Graphics,
    x: number, y: number, w: number, h: number,
    color: number, label: string, textColor: string,
    onClick: () => void,
    hoverColor: number,
  ) {
    const gfx = this.add.graphics();
    gfx.fillStyle(color, 1);
    gfx.fillRoundedRect(x, y, w, h, 10);

    const txt = this.add.text(x + w / 2, y + h / 2, label, {
      fontSize: '14px', fontStyle: 'bold',
      color: textColor, fontFamily: JP,
    }).setOrigin(0.5);

    const zone = this.add.zone(x + w / 2, y + h / 2, w, h).setInteractive({ useHandCursor: true });
    zone.on('pointerover', () => {
      gfx.clear();
      gfx.fillStyle(hoverColor, 1);
      gfx.fillRoundedRect(x, y, w, h, 10);
    });
    zone.on('pointerout', () => {
      gfx.clear();
      gfx.fillStyle(color, 1);
      gfx.fillRoundedRect(x, y, w, h, 10);
    });
    zone.on('pointerdown', onClick);

    void txt;
  }

  private setupKeyboard() {
    this.input.keyboard!.once('keydown-R', () => { sfx.select(); this.scene.start('RankingScene'); });
    this.input.keyboard!.once('keydown-P', () => {
      sfx.select();
      gameState.reset();
      this.scene.start('BootScene', { relay: false });
    });
  }
}
