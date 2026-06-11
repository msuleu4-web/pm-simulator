import * as Phaser from 'phaser';
import { markChapterCleared, saveChapterScore, getTotalScore, getEndingTier, ENDINGS, saveEarnedTitle } from '../chapters';
import { VirtualPad } from '../VirtualPad';
import { getDifficulty, DIFFICULTY_CONFIG, DIFFICULTY_HUD_COLOR, type Difficulty, type DiffConfig } from '../difficulty';

const TILE = 32;
const COLS = 25;
const ROWS = 18;
const CANVAS_W = 800;
const CANVAS_H = 600;
const PLAYER_SIZE = 28;
const SPEED = 160;
const JP = '"Hiragino Kaku Gothic ProN","Hiragino Sans","Yu Gothic","Meiryo",Arial,sans-serif';

const F = 0, W = 1, D = 2, E = 3, P = 5; // P = player desk (blue, walkable)

const TILE_MAP: number[][] = [
  [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
  [W,F,F,F,F,W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
  [W,F,F,F,F,W,F,D,D,D,F,D,D,D,F,D,D,D,F,D,D,D,F,F,W],
  [W,F,F,F,F,F,F,D,D,D,F,D,D,D,F,D,D,D,F,D,D,D,F,F,W],
  [W,F,F,F,F,W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
  [W,F,F,F,F,W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
  [W,W,W,W,W,W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
  [W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
  [W,F,F,F,F,F,F,D,D,D,F,D,D,D,F,D,D,D,F,D,D,D,F,F,W],
  [W,F,F,F,F,F,F,D,D,D,F,D,D,D,F,D,D,D,F,D,D,D,F,F,W],
  [W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
  [W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
  [W,F,F,F,F,F,F,D,D,D,F,D,D,D,F,D,D,D,F,D,D,D,F,F,W],
  [W,F,F,F,F,F,F,D,D,D,F,D,D,D,F,D,D,D,F,D,D,D,F,F,W],
  [W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
  [W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
  [W,F,F,F,F,F,P,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W], // P = col6
  [W,W,W,W,W,W,W,W,W,W,W,W,E,W,W,W,W,W,W,W,W,W,W,W,W],
];

const WALKABLE = new Set([F, E, P]);

const TILE_COLORS: Record<number, number> = {
  0: 0xE8E4D9, 1: 0x4A4A4A, 2: 0x8B6914, 3: 0x2a7a40, 5: 0x2a5aaa,
};

interface NpcDef { name: string; col: number; row: number; lines: string[]; }
interface Choice  { text: string; score: number; result: string; }

const NPCS: NpcDef[] = [
  { name: '田中PM',   col: 2,  row: 3, lines: ['いよいよ最終章だ', '本番環境へのデプロイ準備をしてください', 'スケジュールは死守、品質は…まあなんとかなる', 'リリースさえすればこっちのもん。あとは運用で', 'よし、頼んだぞ！なんとかなるなる！'] },
  { name: '佐藤先輩', col: 10, row: 3, lines: ['デプロイ手順、確認した？', '不安なところがあれば一緒に見るよ', '表向きは『手順書通りに』なんだけど', '実際は『何かあったら呼んで』が本音かな'] },
  { name: '鈴木さん', col: 18, row: 9, lines: ['運用保守って、終わりがないんですよ…', '運用フェーズになると、急に人減らされるんですよ', 'リリースしてもまた次の改修が始まりますからね', '客先常駐のまま何年目になるかな…', 'でも、ここまで一緒にやれて嬉しかったです'] },
];

const CHOICES: Record<'deploy' | 'incident', Choice[]> = {
  deploy: [
    { text: '手順書通りに慎重にリリース',         score: 10, result: '手順書を一つずつ確認しながら慎重にリリース。本番は何のトラブルもなく稼働し、佐藤先輩も「完璧だね」と笑顔だった。[+10点]' },
    { text: '急いでそのままデプロイ',             score: -5, result: '早く終わらせたくて手順を一部飛ばしてデプロイ。直後にエラーログが大量に出力され、緊急対応に追われることに。[-5点]' },
    { text: '先輩とダブルチェックしてリリース',   score:  5, result: '佐藤先輩とダブルチェックしながらリリース。二人で確認したことで安心感もあり、無事に本番稼働できた。[+5点]' },
  ],
  incident: [
    { text: 'ログを確認して原因を特定',           score: 10, result: 'ログを丁寧に確認し、原因の処理を特定。迅速に修正パッチを適用し、影響を最小限に抑えることができた。[+10点]' },
    { text: 'とりあえずサーバー再起動',           score: -5, result: 'とりあえず再起動したら一時的に直ったように見えた。だが30分後に同じ障害が再発し、結局原因調査をする羽目に。[-5点]' },
    { text: '影響範囲を確認してから対応',         score:  5, result: 'まず影響範囲を確認し、関係者に連絡してから対応。落ち着いて行動できたことで、混乱を最小限に抑えられた。[+5点]' },
  ],
};

const FLAREUP = {
  notice: '🔥炎上アラート🔥\nリリース当日、客先担当者と連絡が取れない！\n「あれ…今日有休でした」',
  title: '🔥 客先承認なしのリリース、どうする？',
  choices: [
    { text: 'エスカレーション手順に従う',     score: 10, result: '事前に決めていたエスカレーション先に連絡し、代理承認をもらった。手順通りに進めたことで、リリースは予定通り完了した。[+10点]' },
    { text: '承認を待たず勝手に進める',       score: -5, result: '「待ってられないから」と承認を待たずにリリース。後日、客先から「聞いてない」とクレームになり、田中PMが平謝りすることに。[-5点]' },
    { text: 'リリース延期を判断する',         score:  5, result: '「今日は見送りましょう」と延期を判断。安全だったが、再調整したスケジュールはさらにタイトになり、佐藤先輩は「うーん、悩ましいね」と苦笑い。[+5点]' },
  ] as Choice[],
};

const MISSION_LABEL = [
  'NPCに話しかけよう',
  '🚀 本番デプロイ準備（自分の机へ）',
  '🚀 完了！  佐藤先輩に話しかけよう',
  '🔥 障害対応（自分の机へ）',
  '🔥 全ミッション完了！',
];

type DialogState = 'closed' | 'typing' | 'waiting';
type ChoiceState  = 'hidden' | 'open' | 'result';

// ─────────────────────────────────────────────────────────────────────────────

export class Chapter5Scene extends Phaser.Scene {
  private mapGfx!: Phaser.GameObjects.Graphics;
  private charGfx!: Phaser.GameObjects.Graphics;
  private player!: { x: number; y: number };

  // game state
  private score = 0;
  private gameStep = 0;

  // dialog
  private dialogState: DialogState = 'closed';
  private activeNpc: NpcDef | null = null;
  private activeLines: string[] = [];
  private lineIdx = 0;
  private typedLen = 0;
  private typingTimer: Phaser.Time.TimerEvent | null = null;

  // choice
  private choiceState: ChoiceState = 'hidden';
  private missionKey: 'deploy' | 'incident' | 'flareup' | null = null;
  private incidentDone = false;

  // 難易度
  private diffLevel: Difficulty = 'normal';
  private diffCfg: DiffConfig = DIFFICULTY_CONFIG.normal;

  // chapter clear
  private chapterClearShown = false;

  // input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private key1!: Phaser.Input.Keyboard.Key;
  private key2!: Phaser.Input.Keyboard.Key;
  private key3!: Phaser.Input.Keyboard.Key;
  private virtualPad!: VirtualPad;

  // HUD
  private hudMission!: Phaser.GameObjects.Text;
  private hudScore!: Phaser.GameObjects.Text;

  // misc UI
  private proximityHint!: Phaser.GameObjects.Text;
  private noticeText!: Phaser.GameObjects.Text;
  private noticeTimer: Phaser.Time.TimerEvent | null = null;

  // dialog UI
  private dlgBg!: Phaser.GameObjects.Graphics;
  private dlgName!: Phaser.GameObjects.Text;
  private dlgBody!: Phaser.GameObjects.Text;
  private dlgCue!: Phaser.GameObjects.Text;

  // choice UI
  private choiceGfx!: Phaser.GameObjects.Graphics;
  private choiceTitle!: Phaser.GameObjects.Text;
  private choiceOpts: Phaser.GameObjects.Text[] = [];
  private resultText!: Phaser.GameObjects.Text;

  // ending UI
  private clearGfx!: Phaser.GameObjects.Graphics;
  private clearTitle!: Phaser.GameObjects.Text;
  private clearScore!: Phaser.GameObjects.Text;
  private clearNext!: Phaser.GameObjects.Text;

  constructor() { super({ key: 'Chapter5Scene' }); }

  preload() {
    this.load.spritesheet('office', '/game-assets/Modern_Office_32x32.png', {
      frameWidth: 32, frameHeight: 32,
    });
  }

  create() {
    this.diffLevel = getDifficulty();
    this.diffCfg = DIFFICULTY_CONFIG[this.diffLevel];

    this.mapGfx = this.add.graphics();

    this.buildMap();
    this.buildSprites();

    this.charGfx = this.add.graphics();

    this.buildNpcLabels();
    this.buildHud();
    this.buildProximityHint();
    this.buildNotice();
    this.buildHintBar();
    this.buildDialogBox();
    this.buildChoicePanel();
    this.buildChapterClear();

    this.virtualPad = new VirtualPad(this);

    this.player = { x: 12 * TILE + TILE / 2, y: 15 * TILE + TILE / 2 };
    this.drawChars();

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up:    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down:  this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left:  this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.key1 = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    this.key2 = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    this.key3 = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);

    this.showNotice('「無事これ名馬」\nリリース当日、何も起きないのが一番のお祝いです。', 4500);
  }

  // ── Map ──────────────────────────────────────────────────────

  private buildMap() {
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        this.drawTile(c, r, TILE_MAP[r][c]);

    this.add.text(TILE + 4, TILE + 4, '会議室', { fontSize: '10px', color: '#999', fontFamily: 'monospace' });
    this.add.text(6 * TILE + 16, 16 * TILE - 2, '自分の机', {
      fontSize: '9px', color: '#88aaff', fontFamily: JP, stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5, 1);
  }

  private drawTile(col: number, row: number, type: number) {
    const x = col * TILE, y = row * TILE;
    this.mapGfx.fillStyle(TILE_COLORS[type] ?? TILE_COLORS[0], 1);
    this.mapGfx.fillRect(x, y, TILE, TILE);
    if (type === 0) { this.mapGfx.lineStyle(1, 0x000000, 0.07); this.mapGfx.strokeRect(x, y, TILE, TILE); }
    if (type === 1) { this.mapGfx.fillStyle(0x686868, 1); this.mapGfx.fillRect(x, y, TILE, 4); }
    if (type === 2) {
      this.mapGfx.fillStyle(0x6b4f0e, 1); this.mapGfx.fillRect(x+2, y+2, TILE-4, TILE-4);
      this.mapGfx.fillStyle(0xc8a030, 0.35); this.mapGfx.fillRect(x+5, y+5, TILE-10, TILE-10);
    }
    if (type === 3) {
      this.mapGfx.fillStyle(0x4cbb6a, 0.55); this.mapGfx.fillRect(x+4, y+4, TILE-8, TILE-8);
      this.mapGfx.fillStyle(0xffffff, 0.6);
      this.mapGfx.fillTriangle(x+16, y+TILE-6, x+10, y+TILE-14, x+22, y+TILE-14);
    }
    if (type === 5) {
      this.mapGfx.fillStyle(0x1a3a88, 1); this.mapGfx.fillRect(x+2, y+2, TILE-4, TILE-4);
      this.mapGfx.fillStyle(0x6699ee, 0.5); this.mapGfx.fillRect(x+5, y+5, TILE-10, TILE-10);
    }
  }

  // ── Sprite decorations (drawn over the Graphics map) ──────────

  private buildSprites() {
    // 1. Floor tile variation
    const floorFrames = [77, 78, 93, 94];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (TILE_MAP[r][c] === F) {
          const frame = floorFrames[Phaser.Math.Between(0, floorFrames.length - 1)];
          this.add.image(c * TILE + TILE / 2, r * TILE + TILE / 2, 'office', frame);
        }
      }
    }

    // 2-4. Desk groups (3x2) + chair + monitor
    const deskTop = [455, 456, 457];
    const deskBottom = [471, 472, 473];
    const chairFrames = [700, 716];
    const monitorFrames = [712, 713];
    let groupIdx = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (TILE_MAP[r][c] === D && TILE_MAP[r - 1]?.[c] !== D && TILE_MAP[r]?.[c - 1] !== D) {
          for (let i = 0; i < 3; i++) {
            this.add.image((c + i) * TILE + TILE / 2, r * TILE + TILE / 2, 'office', deskTop[i]);
            this.add.image((c + i) * TILE + TILE / 2, (r + 1) * TILE + TILE / 2, 'office', deskBottom[i]);
          }
          this.add.image((c + 1) * TILE + TILE / 2, (r + 2) * TILE + TILE / 2, 'office', chairFrames[groupIdx % 2]);
          this.add.image((c + 1) * TILE + TILE / 2, r * TILE + TILE / 2, 'office', monitorFrames[groupIdx % 2]);
          groupIdx++;
        }
      }
    }

    // 5. Plants in the 4 map corners (2-tile vertical stack)
    const plantSpots = [
      { col: 1, row: 1 }, { col: 23, row: 1 },
      { col: 1, row: 14 }, { col: 23, row: 14 },
    ];
    for (const { col, row } of plantSpots) {
      this.add.image(col * TILE + TILE / 2, row * TILE + TILE / 2, 'office', 166);
      this.add.image(col * TILE + TILE / 2, (row + 1) * TILE + TILE / 2, 'office', 182);
    }

    // 6. Meeting table (3x3) in the meeting room
    const tableFrames = [
      [65, 66, 67],
      [81, 82, 83],
      [97, 98, 99],
    ];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.add.image((2 + j) * TILE + TILE / 2, (2 + i) * TILE + TILE / 2, 'office', tableFrames[i][j]);
      }
    }
  }

  // ── HUD ──────────────────────────────────────────────────────

  private buildHud() {
    const g = this.add.graphics();
    g.fillStyle(0x0a0a14, 0.93); g.fillRect(0, 0, CANVAS_W, 26);
    g.lineStyle(1, 0x223344, 1); g.strokeRect(0, 0, CANVAS_W, 26);
    this.add.text(10, 5, 'Day 21  リリースフェーズ', { fontSize: '11px', color: '#7799aa', fontFamily: JP });
    this.hudMission = this.add.text(CANVAS_W / 2, 5, MISSION_LABEL[0], { fontSize: '12px', color: '#ddcc88', fontFamily: JP }).setOrigin(0.5, 0);
    this.hudScore   = this.add.text(CANVAS_W - 10, 5, `${this.diffCfg.label} | Score: 0`, { fontSize: '12px', color: DIFFICULTY_HUD_COLOR[this.diffLevel], fontFamily: JP }).setOrigin(1, 0);
  }

  private updateHud() {
    this.hudMission.setText(MISSION_LABEL[this.gameStep] ?? '');
    this.hudScore.setText(`${this.diffCfg.label} | Score: ${this.score}`);
  }

  // ── NPC labels ────────────────────────────────────────────────

  private buildNpcLabels() {
    for (const npc of NPCS) {
      this.add.text(npc.col * TILE + 16, npc.row * TILE - 2, npc.name, {
        fontSize: '10px', color: '#ffffaa', fontFamily: JP, stroke: '#000', strokeThickness: 3,
      }).setOrigin(0.5, 1);
    }
  }

  // ── Misc UI ───────────────────────────────────────────────────

  private buildProximityHint() {
    this.proximityHint = this.add.text(CANVAS_W / 2, ROWS * TILE - 28, '', {
      fontSize: '12px', color: '#ffee88', fontFamily: JP,
      backgroundColor: '#00000099', padding: { x: 10, y: 4 },
    }).setOrigin(0.5, 1);
  }

  private buildNotice() {
    this.noticeText = this.add.text(CANVAS_W / 2, 120, '', {
      fontSize: '14px', color: '#ffeeaa', fontFamily: JP, align: 'center',
      backgroundColor: '#000000aa', padding: { x: 16, y: 10 },
    }).setOrigin(0.5, 0.5).setVisible(false);
  }

  private showNotice(msg: string, ms = 2800) {
    if (this.noticeTimer) { this.noticeTimer.destroy(); this.noticeTimer = null; }
    this.noticeText.setText(msg).setVisible(true);
    this.noticeTimer = this.time.addEvent({ delay: ms, callback: () => { this.noticeText.setVisible(false); this.noticeTimer = null; } });
  }

  private buildHintBar() {
    const y = ROWS * TILE;
    const g = this.add.graphics();
    g.fillStyle(0x0e0e16, 1); g.fillRect(0, y, CANVAS_W, CANVAS_H - y);
    this.add.text(CANVAS_W / 2, y + 10, '矢印/WASD：移動　Space：話す/作業　1-3：選択', {
      fontSize: '11px', color: '#3a4a5a', fontFamily: 'monospace',
    }).setOrigin(0.5, 0);
  }

  // ── Dialog box ────────────────────────────────────────────────

  private buildDialogBox() {
    const BX = 10, BY = 504, BW = CANVAS_W - 20, BH = 70, P2 = 14;
    this.dlgBg = this.add.graphics();
    this.dlgBg.fillStyle(0x000000, 0.88); this.dlgBg.fillRoundedRect(BX, BY, BW, BH, 8);
    this.dlgBg.lineStyle(1, 0x445566, 0.9); this.dlgBg.strokeRoundedRect(BX, BY, BW, BH, 8);
    this.dlgBg.setVisible(false);
    this.dlgName = this.add.text(BX + P2, BY + 10, '', { fontSize: '12px', color: '#ffdd66', fontFamily: JP, fontStyle: 'bold' }).setVisible(false);
    this.dlgBody = this.add.text(BX + P2, BY + 30, '', { fontSize: '14px', color: '#eeeeff', fontFamily: JP, wordWrap: { width: BW - P2 * 2 - 60 } }).setVisible(false);
    this.dlgCue  = this.add.text(BX + BW - P2, BY + BH - 10, '', { fontSize: '11px', color: '#556677', fontFamily: 'monospace' }).setOrigin(1, 1).setVisible(false);
  }

  private getLines(npc: NpcDef): string[] {
    if (npc.name === '田中PM') {
      if (this.gameStep === 0) return ['いよいよ最終章だ', '本番環境へのデプロイ準備をしてください', 'スケジュールは死守、品質は…まあなんとかなる', 'リリースさえすればこっちのもん。あとは運用で', 'よし、頼んだぞ！なんとかなるなる！'];
      if (this.gameStep === 1) return ['リリース判定会議は通った。準備は万全かな', '何か不安なことがあれば、今のうちに言ってね', '机に戻って、最終チェックをお願い'];
      return ['本番切替、緊張するね。落ち着いていこう', '何かあっても、みんなでなんとかするから', 'いよいよだね、頑張ろう'];
    }
    if (npc.name === '佐藤先輩') {
      if (this.gameStep < 2) return ['デプロイ手順、確認した？', '不安なところがあれば一緒に見るよ', '表向きは『手順書通りに』なんだけど', '実際は『何かあったら呼んで』が本音かな'];
      if (this.gameStep === 2) return ['本番から障害報告が来た！対応お願い', '切り戻すかどうかも判断してね', '机に戻って対応しましょう'];
      return ['対応お疲れ様。よく頑張ったね', 'この一年で、すごく成長したと思うよ', '胸を張っていいからね'];
    }
    if (npc.name === '鈴木さん') {
      if (this.gameStep < 3) return ['運用保守って、終わりがないんですよ…', '運用フェーズになると、急に人減らされるんですよ', 'リリースしてもまた次の改修が始まりますからね', '客先常駐のまま何年目になるかな…', 'でも、ここまで一緒にやれて嬉しかったです'];
      return ['お疲れ様でした！', 'これで一区切りですね。本当によく頑張りました', '正直、最初はどうなることかと思いましたよ', 'また一緒に仕事できたら嬉しいです'];
    }
    return npc.lines;
  }

  private openDialog(npc: NpcDef) {
    this.proximityHint.setText('');
    this.activeNpc = npc;
    this.activeLines = this.getLines(npc);
    this.lineIdx = 0;
    this.dialogState = 'typing';
    this.startTyping();
  }

  private startTyping() {
    if (!this.activeNpc) return;
    const line = this.activeLines[this.lineIdx];
    this.typedLen = 0;
    this.dlgBg.setVisible(true);
    this.dlgName.setText(this.activeNpc.name).setVisible(true);
    this.dlgBody.setText('').setVisible(true);
    this.dlgCue.setText('').setVisible(true);
    if (this.typingTimer) { this.typingTimer.destroy(); this.typingTimer = null; }
    this.typingTimer = this.time.addEvent({
      delay: 32, repeat: line.length - 1,
      callback: () => {
        this.typedLen++;
        this.dlgBody.setText(line.slice(0, this.typedLen));
        if (this.typedLen >= line.length) {
          this.dialogState = 'waiting';
          const last = this.lineIdx >= this.activeLines.length - 1;
          this.dlgCue.setText(last ? 'Space: 閉じる ■' : 'Space: 次へ ▶').setVisible(true);
        }
      },
    });
  }

  private advanceDialog() {
    if (!this.activeNpc) return;
    if (this.dialogState === 'typing') {
      if (this.typingTimer) { this.typingTimer.destroy(); this.typingTimer = null; }
      this.dlgBody.setText(this.activeLines[this.lineIdx]);
      this.dialogState = 'waiting';
      const last = this.lineIdx >= this.activeLines.length - 1;
      this.dlgCue.setText(last ? 'Space: 閉じる ■' : 'Space: 次へ ▶').setVisible(true);
      return;
    }
    if (this.dialogState === 'waiting') {
      this.lineIdx++;
      if (this.lineIdx < this.activeLines.length) { this.dialogState = 'typing'; this.startTyping(); }
      else this.closeDialog();
    }
  }

  private closeDialog() {
    if (this.typingTimer) { this.typingTimer.destroy(); this.typingTimer = null; }
    this.dialogState = 'closed';
    this.dlgBg.setVisible(false); this.dlgName.setVisible(false);
    this.dlgBody.setVisible(false); this.dlgCue.setVisible(false);
    const npc = this.activeNpc;
    this.activeNpc = null;
    if (!npc) return;
    if (npc.name === '田中PM' && this.gameStep === 0) {
      this.gameStep = 1; this.updateHud();
      this.showNotice('ミッション受諾！\n🚀 本番環境へのデプロイ準備をしてください\n自分の机（青いタイル）へ行こう', 3000);
    } else if (npc.name === '佐藤先輩' && this.gameStep === 2) {
      this.gameStep = 3; this.updateHud();
      this.showNotice('ミッション受諾！\n🔥 障害対応をしてください\n自分の机へ行こう', 3000);
    }
  }

  // ── Choice panel ──────────────────────────────────────────────

  private buildChoicePanel() {
    const PW = 580, PH = 210, PX = 110, PY = 185;
    this.choiceGfx = this.add.graphics();
    this.choiceGfx.fillStyle(0x000000, 0.80); this.choiceGfx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    this.choiceGfx.fillStyle(0x111a28, 1); this.choiceGfx.fillRoundedRect(PX, PY, PW, PH, 10);
    this.choiceGfx.lineStyle(2, 0x3a5a8a, 1); this.choiceGfx.strokeRoundedRect(PX, PY, PW, PH, 10);
    this.choiceGfx.setVisible(false);

    this.choiceTitle = this.add.text(CANVAS_W / 2, PY + 18, '', { fontSize: '14px', color: '#aaccee', fontFamily: JP, fontStyle: 'bold' }).setOrigin(0.5, 0).setVisible(false);

    this.choiceOpts = [];
    for (let i = 0; i < 3; i++) {
      this.choiceOpts.push(
        this.add.text(PX + 18, PY + 56 + i * 46, '', { fontSize: '14px', color: '#ddeeff', fontFamily: JP, wordWrap: { width: PW - 40 } }).setVisible(false),
      );
    }

    this.resultText = this.add.text(CANVAS_W / 2, PY + PH / 2 + 10, '', {
      fontSize: '15px', color: '#ffdd88', fontFamily: JP, align: 'center',
      wordWrap: { width: 520 }, backgroundColor: '#00000099', padding: { x: 14, y: 10 },
    }).setOrigin(0.5, 0.5).setVisible(false);
  }

  private openChoices(key: 'deploy' | 'incident' | 'flareup') {
    this.missionKey = key;
    this.choiceState = 'open';
    const title = key === 'deploy' ? '🚀 どうやってリリースしますか？'
      : key === 'incident' ? '🔥 障害にどう対応しますか？'
      : FLAREUP.title;
    this.choiceGfx.setVisible(true);
    this.choiceTitle.setText(title).setVisible(true);
    const choices = key === 'flareup' ? FLAREUP.choices : CHOICES[key];
    const maxScore = Math.max(...choices.map(c => c.score));
    for (let i = 0; i < 3; i++) {
      const hint = this.diffCfg.showHints && choices[i].score === maxScore ? '  💡推奨' : '';
      this.choiceOpts[i].setText(`[${i + 1}]  ${choices[i].text}${hint}`).setVisible(true);
    }
    this.resultText.setVisible(false);
    this.proximityHint.setText('');
    this.virtualPad.setChoiceButtonsVisible(true);
  }

  private handleChoice(idx: number) {
    if (this.choiceState !== 'open' || !this.missionKey) return;
    const choices = this.missionKey === 'flareup' ? FLAREUP.choices : CHOICES[this.missionKey];
    const c = choices[idx];
    const mult = c.score >= 0 ? this.diffCfg.bonusMult : this.diffCfg.penaltyMult;
    this.score += Math.round(c.score * mult);
    this.choiceState = 'result';
    for (const o of this.choiceOpts) o.setVisible(false);
    this.choiceTitle.setVisible(false);
    this.resultText.setText(c.result).setVisible(true);

    if (this.missionKey === 'flareup') {
      this.time.delayedCall(2600, () => { this.updateHud(); this.closeChoices(); });
      return;
    }

    const next = this.missionKey === 'deploy' ? 2 : 4;
    this.time.delayedCall(2400, () => {
      this.gameStep = next; this.updateHud(); this.closeChoices();
      if (next === 4) this.showChapterClear();
      if (next === 2) this.scheduleIncident();
    });
  }

  // ── 炎上イベント ──────────────────────────────────────────────

  private scheduleIncident() {
    this.time.delayedCall(1200, () => this.tryShowIncident());
  }

  private tryShowIncident() {
    if (this.incidentDone || this.gameStep > 2) return;
    if (this.gameStep !== 2 || this.dialogState !== 'closed' || this.choiceState !== 'hidden') {
      this.time.delayedCall(600, () => this.tryShowIncident());
      return;
    }
    this.incidentDone = true;
    this.showNotice(FLAREUP.notice, 2200);
    this.time.delayedCall(2200, () => {
      if (this.dialogState === 'closed' && this.choiceState === 'hidden') this.openChoices('flareup');
    });
  }

  private closeChoices() {
    this.choiceState = 'hidden'; this.missionKey = null;
    this.choiceGfx.setVisible(false); this.choiceTitle.setVisible(false);
    for (const o of this.choiceOpts) o.setVisible(false);
    this.resultText.setVisible(false);
    this.virtualPad.setChoiceButtonsVisible(false);
  }

  // ── Ending screen ─────────────────────────────────────────────

  private buildChapterClear() {
    this.clearGfx = this.add.graphics();
    this.clearGfx.fillStyle(0x000000, 0.85); this.clearGfx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    this.clearGfx.setDepth(50).setVisible(false);

    this.clearTitle = this.add.text(CANVAS_W / 2, CANVAS_H / 2 - 130, '', {
      fontSize: '30px', color: '#ffdd66', fontFamily: JP, fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(51).setVisible(false);

    this.clearScore = this.add.text(CANVAS_W / 2, CANVAS_H / 2, '', {
      fontSize: '15px', color: '#ddeeff', fontFamily: JP, align: 'center', lineSpacing: 6,
      wordWrap: { width: 640 },
    }).setOrigin(0.5).setDepth(51).setVisible(false);

    this.clearNext = this.add.text(CANVAS_W / 2, CANVAS_H / 2 + 180, '', {
      fontSize: '13px', color: '#88aacc', fontFamily: JP, align: 'center',
      backgroundColor: '#00000099', padding: { x: 12, y: 6 },
    }).setOrigin(0.5).setDepth(51).setVisible(false);
  }

  private showChapterClear() {
    saveChapterScore('chapter5', this.score);
    markChapterCleared('chapter5');
    this.chapterClearShown = true;

    const total = getTotalScore();
    const tier = getEndingTier(total);
    const ending = ENDINGS[tier];
    saveEarnedTitle(ending.title);

    this.clearGfx.setVisible(true);
    this.clearTitle.setText(`🏆 ${ending.title}`).setColor(ending.color).setVisible(true);
    this.clearScore.setText(
      `第5章「リリース・運用保守」クリア！　スコア：${this.score}点\n総合スコア：${total}点\n\n${ending.comment}`,
    ).setVisible(true);
    this.clearNext.setText(
      'Space：チャプター選択に戻る\nもう一度挑戦して、難易度を変えれば結果も変わるかも？',
    ).setVisible(true);
  }

  // ── Characters ────────────────────────────────────────────────

  private drawChars() {
    this.charGfx.clear();
    for (const npc of NPCS) {
      const cx = npc.col * TILE + 16, cy = npc.row * TILE + 16, r = 11;
      this.charGfx.fillStyle(0x000000, 0.15); this.charGfx.fillEllipse(cx, cy + r + 1, r * 2 + 2, 7);
      this.charGfx.fillStyle(0xF5C518, 1); this.charGfx.fillCircle(cx, cy, r);
      this.charGfx.lineStyle(2, 0xB89010, 1); this.charGfx.strokeCircle(cx, cy, r);
      this.charGfx.fillStyle(0x333300, 1);
      this.charGfx.fillCircle(cx - 3, cy - 1, 2); this.charGfx.fillCircle(cx + 3, cy - 1, 2);
      this.charGfx.fillStyle(0x553300, 0.8); this.charGfx.fillEllipse(cx, cy + 3, 8, 3);
    }
    const { x, y } = this.player;
    const h = PLAYER_SIZE / 2;
    this.charGfx.fillStyle(0x000000, 0.18); this.charGfx.fillEllipse(x, y + h - 1, PLAYER_SIZE + 4, 8);
    this.charGfx.fillStyle(0x2a6abf, 1); this.charGfx.fillRect(x - h, y - h, PLAYER_SIZE, PLAYER_SIZE);
    this.charGfx.fillStyle(0xffffff, 0.28); this.charGfx.fillRect(x - h + 3, y - h + 3, 9, 9);
  }

  // ── Collision ─────────────────────────────────────────────────

  private tileAt(px: number, py: number): number {
    const c = Math.floor(px / TILE), r = Math.floor(py / TILE);
    if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return W;
    return TILE_MAP[r]?.[c] ?? W;
  }

  private canMoveTo(x: number, y: number): boolean {
    const r = PLAYER_SIZE / 2 - 2;
    return WALKABLE.has(this.tileAt(x-r, y-r)) && WALKABLE.has(this.tileAt(x+r, y-r)) &&
           WALKABLE.has(this.tileAt(x-r, y+r)) && WALKABLE.has(this.tileAt(x+r, y+r));
  }

  private playerTile() {
    return { col: Math.floor(this.player.x / TILE), row: Math.floor(this.player.y / TILE) };
  }

  private getNearbyNpc(): NpcDef | null {
    const { col, row } = this.playerTile();
    return NPCS.find(n => Math.abs(n.col - col) <= 1 && Math.abs(n.row - row) <= 1) ?? null;
  }

  private isOnDesk(): boolean {
    const { col, row } = this.playerTile();
    return TILE_MAP[row]?.[col] === P;
  }

  // ── Update ────────────────────────────────────────────────────

  update(_t: number, delta: number) {
    if (this.chapterClearShown) {
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey) || this.virtualPad.isActionPressed()) {
        window.dispatchEvent(new CustomEvent('sier-chapter-cleared', { detail: { chapterId: 'chapter5' } }));
      }
      return;
    }

    if (this.choiceState === 'open') {
      const padChoice = this.virtualPad.getChoicePressed();
      if (Phaser.Input.Keyboard.JustDown(this.key1) || padChoice === 1) this.handleChoice(0);
      if (Phaser.Input.Keyboard.JustDown(this.key2) || padChoice === 2) this.handleChoice(1);
      if (Phaser.Input.Keyboard.JustDown(this.key3) || padChoice === 3) this.handleChoice(2);
      return;
    }
    if (this.choiceState === 'result') return;

    if (this.dialogState !== 'closed') {
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey) || this.virtualPad.isActionPressed()) this.advanceDialog();
      return;
    }

    const nearby = this.getNearbyNpc();
    const onDesk = this.isOnDesk();
    const missionActive = this.gameStep === 1 || this.gameStep === 3;
    const spaceJust = Phaser.Input.Keyboard.JustDown(this.spaceKey) || this.virtualPad.isActionPressed();

    if (spaceJust && nearby) { this.openDialog(nearby); return; }
    if (spaceJust && onDesk && missionActive) { this.openChoices(this.gameStep === 1 ? 'deploy' : 'incident'); return; }

    this.proximityHint.setText(
      nearby ? `【${nearby.name}】  Space で話しかける` :
      (onDesk && missionActive) ? '自分の机  Space で作業する' : '',
    );

    const dt = delta / 1000;
    let dx = 0, dy = 0;
    if (this.cursors.left.isDown  || this.wasd.left.isDown)  dx = -1;
    if (this.cursors.right.isDown || this.wasd.right.isDown) dx =  1;
    if (this.cursors.up.isDown    || this.wasd.up.isDown)    dy = -1;
    if (this.cursors.down.isDown  || this.wasd.down.isDown)  dy =  1;
    const pad = this.virtualPad.getDirection();
    if (pad.dx !== 0) dx = pad.dx;
    if (pad.dy !== 0) dy = pad.dy;
    if (dx === 0 && dy === 0) return;

    const nx = this.player.x + dx * SPEED * dt;
    const ny = this.player.y + dy * SPEED * dt;
    if (this.canMoveTo(nx, this.player.y)) this.player.x = nx;
    if (this.canMoveTo(this.player.x, ny)) this.player.y = ny;
    this.drawChars();
  }
}
