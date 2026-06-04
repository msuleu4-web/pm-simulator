import * as Phaser from 'phaser';
import { fetchRanking } from '../utils/supabaseClient';
import type { GameResultRow } from '../utils/supabaseClient';
import { gameState } from '../state/gameState';
import { sfx } from '../utils/audio';

const CANVAS_W = 800;
const CANVAS_H = 598;

const ENDING_COLORS: Record<string, string> = {
  A: '#d4a000',
  B: '#2a8a2a',
  C: '#cc6600',
  D: '#5050a0',
};

export class RankingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'RankingScene' });
  }

  async create() {
    // Background
    const bg = this.add.graphics();
    bg.fillStyle(0x0d1a2e, 1);
    bg.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Header
    bg.fillStyle(0x1a2e4a, 1);
    bg.fillRect(0, 0, CANVAS_W, 58);

    this.add.text(CANVAS_W / 2, 28, '🏆 プレイヤーランキング', {
      fontSize: '22px',
      color: '#e0d060',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Loading text
    const loadingText = this.add.text(CANVAS_W / 2, 200, '読み込み中...', {
      fontSize: '16px',
      color: '#aaaacc',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    let rows: GameResultRow[] = [];
    try {
      rows = await fetchRanking(15);
    } catch {
      rows = [];
    }
    loadingText.destroy();

    if (rows.length === 0) {
      this.add.text(CANVAS_W / 2, 220, 'まだ結果がありません。最初のプレイヤーになろう！', {
        fontSize: '14px',
        color: '#aaaacc',
        fontFamily: 'monospace',
        align: 'center',
      }).setOrigin(0.5);
    } else {
      // Column headers
      const hdrY = 70;
      const cols = [40, 80, 240, 350, 450, 550, 650, 740];
      const headers = ['順位', 'END', 'プレイヤー', '合計', '品質', 'コスト', '納期', '信頼'];
      headers.forEach((h, i) => {
        this.add.text(cols[i], hdrY, h, {
          fontSize: '11px',
          color: '#7a9abc',
          fontFamily: 'monospace',
        }).setOrigin(0.5, 0);
      });

      bg.lineStyle(1, 0x2a4a6a, 0.7);
      bg.strokeRect(20, hdrY + 18, CANVAS_W - 40, 1);

      const rowH = 28;
      rows.forEach((row, i) => {
        const y = hdrY + 24 + i * rowH;
        const isEven = i % 2 === 0;
        if (isEven) {
          bg.fillStyle(0xffffff, 0.03);
          bg.fillRect(20, y - 2, CANVAS_W - 40, rowH);
        }

        const rankStr = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}位`;
        const endColor = ENDING_COLORS[row.ending_type] ?? '#ffffff';

        const values: Array<{ v: string | number; color?: string }> = [
          { v: rankStr },
          { v: `END ${row.ending_type}`, color: endColor },
          { v: row.player_name },
          { v: row.total_score, color: row.total_score >= 280 ? '#d4a000' : '#cccccc' },
          { v: row.quality_score  ?? '--' },
          { v: row.cost_score     ?? '--' },
          { v: row.delivery_score ?? '--' },
          { v: row.trust_score    ?? '--' },
        ];

        values.forEach((val, j) => {
          this.add.text(cols[j], y + 4, String(val.v), {
            fontSize: '12px',
            color: val.color ?? '#ccddee',
            fontFamily: 'monospace',
          }).setOrigin(0.5, 0);
        });
      });
    }

    // Buttons
    const btnStyle = {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      backgroundColor: '#2c5f8a',
      padding: { x: 20, y: 10 },
    };

    this.add.text(CANVAS_W / 2 - 110, CANVAS_H - 40, 'もう一度プレイ', btnStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        sfx.select();
        gameState.reset();
        this.scene.start('MapScene', { chapterId: 1 });
      });

    this.add.text(CANVAS_W / 2 + 110, CANVAS_H - 40, '結果を更新', {
      ...btnStyle,
      backgroundColor: '#2a4a30',
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        sfx.select();
        this.scene.restart();
      });
  }
}
