import * as Phaser from 'phaser';
import { markChapterCleared, saveChapterScore } from '../chapters';
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
  { name: '田中PM',   col: 2,  row: 3, lines: ['第3章は基本設計フェーズだ', '要件定義書をベースに基本設計書を作ってくれ', 'テンプレ？前のプロジェクトのを流用していいよ', '品質と納期、両方守れるよね？(圧)', '細かい部分は現場のノリで察してくれ！'] },
  { name: '佐藤先輩', col: 10, row: 3, lines: ['設計、順調？要件との整合性に気をつけてね', '表向きは『テンプレ通りでOK』なんだけど', '実際はお客さんのこだわりが後から出てくるから', '行間を読む力が必要になるんだよね'] },
  { name: '鈴木さん', col: 18, row: 9, lines: ['元請けの設計書って、結構雑なんですよね…', '『行間を読め』ってよく言われるんですけど', '行間に何も書いてないんですよ', 'うちは下請けなんで、ちゃんと書いとかないと痛い目見るんです'] },
];

// スコアバランス: ミッション1(design)+ミッション2(review)+炎上イベント(INCIDENT)の
// 計3セット、各セット{+10,-5,+5}。本章の最大30点 / 最小-15点(NORMAL)。
// 全5章合計・難易度別最低点・エース判定の詳細は src/game/chapters.ts のコメント参照。
const CHOICES: Record<'design' | 'review', Choice[]> = {
  design: [
    { text: '要件をもう一度確認してから書く', score: 10, result: '要件定義書を読み返してから書いたら抜け漏れのない設計書に。佐藤先輩に「直すところほぼないよ」と言われた。[+10点]' },
    { text: 'なんとなくで書き始める',           score: -5, result: '勢いで書き始めたら項目のつながりが分からず迷子に。結局、要件定義書を読み返す二度手間になった。[-5点]' },
    { text: '過去の設計書をコピーする',         score:  5, result: '過去案件の設計書を流用し、とりあえず形にはなった。ただし会社名のコピペ忘れを佐藤先輩に指摘された。[+5点]' },
  ],
  review: [
    { text: '指摘を全部直して再レビュー依頼', score: 10, result: '指摘事項をすべて反映して再レビュー依頼。佐藤先輩から「もう何も言うことないよ」と太鼓判をもらった。[+10点]' },
    { text: '1件だけ直して提出',               score: -5, result: '目立つ1件だけ直して提出したら「他の2件も直ってないよ？」とやんわり指摘され、気まずい空気に。[-5点]' },
    { text: '理由を聞いてから対応する',         score:  5, result: 'なぜその指摘なのか理由を聞いてから直したことで、設計意図への理解が深まった。[+5点]' },
  ],
};

// 炎上イベント — ミッションの合間に発生する「あるある」割り込みイベント
const INCIDENT = {
  notice: '🔥炎上アラート🔥\n田中PM「仕様、まだ固まってないんだけど」\n「設計は並行で進めといてー」',
  title: '🔥 仕様未確定のまま、設計をどう進める？',
  choices: [
    { text: '未確定部分を前提条件として明記し並行で進める', score: 10, result: '「ここはA案を前提に進めます」と一文添えておいたおかげで、後日仕様が変わっても直す範囲は最小限。佐藤先輩「その一文、神だね」[+10点]' },
    { text: '何も考えず、今の仕様のまま全部作り切る',         score: -5, result: '案の定、翌週に仕様変更の連絡。作った分がまるごと手戻りに。田中PMは「そんなこともあるよねー」と他人事。[-5点]' },
    { text: '仕様が固まるまで、その部分は保留にする',       score:  5, result: '保留にした分、スケジュールはギリギリに。ただし手戻りはゼロで、佐藤先輩から「判断としては正しいよ」とフォローが入った。[+5点]' },
  ] as Choice[],
};

const MISSION_LABEL = [
  'NPCに話しかけよう',
  '📐 基本設計書を作成（自分の机へ）',
  '📐 完了！  佐藤先輩に話しかけよう',
  '🔍 レビュー指摘に対応（自分の机へ）',
  '🔍 全ミッション完了！',
];

type DialogState = 'closed' | 'typing' | 'waiting';
type ChoiceState  = 'hidden' | 'open' | 'result';

// ─────────────────────────────────────────────────────────────────────────────

export class Chapter3Scene extends Phaser.Scene {
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
  private missionKey: 'design' | 'review' | 'incident' | null = null;

  // 炎上イベント
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

  // chapter clear UI
  private clearGfx!: Phaser.GameObjects.Graphics;
  private clearTitle!: Phaser.GameObjects.Text;
  private clearScore!: Phaser.GameObjects.Text;
  private clearNext!: Phaser.GameObjects.Text;

  constructor() { super({ key: 'Chapter3Scene' }); }

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

    this.showNotice('「設計書、ちゃんと書いてね」\n…誰も読まないけど。', 4500);
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
    this.add.text(10, 5, 'Day 3  基本設計フェーズ', { fontSize: '11px', color: '#7799aa', fontFamily: JP });
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
    const BX = 10, BY = 454, BW = CANVAS_W - 20, BH = 120, P2 = 14;
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
      if (this.gameStep === 0) return ['第3章は基本設計フェーズだ', '要件定義書をベースに基本設計書を作ってくれ', 'テンプレ？前のプロジェクトのを流用していいよ', '品質と納期、両方守れるよね？(圧)', '細かい部分は現場のノリで察してくれ！'];
      if (this.gameStep === 1) return ['設計書、進んでる？', '明日の朝イチで佐藤くんに見せられそう？', '机で作業してね、頑張って'];
      return ['設計書ありがとう。レビューに回しておくね', '指摘？まあ、いつも通り少しはあるだろうけど', '気にせずサクッと直しちゃおう！'];
    }
    if (npc.name === '佐藤先輩') {
      if (this.gameStep < 2) return ['設計、順調？要件との整合性に気をつけてね', '表向きは『テンプレ通りでOK』なんだけど', '実際はお客さんのこだわりが後から出てくるから', '行間を読む力が必要になるんだよね'];
      if (this.gameStep === 2) return ['レビュー指摘が3件あるよ', '正直、田中さんが見落としてた所を拾った感じ', '机に戻って対応しましょう'];
      return ['レビュー対応、お疲れ様！', '指摘に向き合えるのは、いいエンジニアの第一歩', '次の製造フェーズも一緒に頑張ろう'];
    }
    if (npc.name === '鈴木さん') {
      if (this.gameStep < 3) return ['元請けの設計書って、結構雑なんですよね…', '『行間を読め』ってよく言われるんですけど', '行間に何も書いてないんですよ', 'うちは下請けなんで、ちゃんと書いとかないと痛い目見るんです'];
      return ['指摘対応、大変そうですね…', 'うちでも真っ赤な設計書見て震えてますよ', '客先常駐だと、自社に帰れるの月1回ですね…', '頑張ってください、応援してます'];
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
      this.showNotice('ミッション受諾！\n📐 基本設計書を作成してください\n自分の机（青いタイル）へ行こう', 3000);
    } else if (npc.name === '佐藤先輩' && this.gameStep === 2) {
      this.gameStep = 3; this.updateHud();
      this.showNotice('ミッション受諾！\n🔍 レビュー指摘に対応してください\n自分の机へ行こう', 3000);
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

  private openChoices(key: 'design' | 'review' | 'incident') {
    this.missionKey = key;
    this.choiceState = 'open';
    const title = key === 'design' ? '📐 基本設計書をどう書きますか？'
      : key === 'review' ? '🔍 レビュー指摘にどう対応しますか？'
      : INCIDENT.title;
    this.choiceGfx.setVisible(true);
    this.choiceTitle.setText(title).setVisible(true);
    const choices = key === 'incident' ? INCIDENT.choices : CHOICES[key];
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
    const choices = this.missionKey === 'incident' ? INCIDENT.choices : CHOICES[this.missionKey];
    const c = choices[idx];
    const mult = c.score >= 0 ? this.diffCfg.bonusMult : this.diffCfg.penaltyMult;
    this.score += Math.round(c.score * mult);
    this.choiceState = 'result';
    for (const o of this.choiceOpts) o.setVisible(false);
    this.choiceTitle.setVisible(false);
    this.resultText.setText(c.result).setVisible(true);

    if (this.missionKey === 'incident') {
      this.time.delayedCall(2600, () => { this.updateHud(); this.closeChoices(); });
      return;
    }

    const next = this.missionKey === 'design' ? 2 : 4;
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
    if (this.incidentDone || this.chapterClearShown) return;
    if (this.dialogState !== 'closed' || this.choiceState !== 'hidden') {
      this.time.delayedCall(600, () => this.tryShowIncident());
      return;
    }
    this.incidentDone = true;
    this.showNotice(INCIDENT.notice, 2200);
    this.time.delayedCall(2200, () => this.tryOpenIncidentChoices());
  }

  private tryOpenIncidentChoices() {
    if (this.chapterClearShown) return;
    if (this.dialogState !== 'closed' || this.choiceState !== 'hidden') {
      this.time.delayedCall(600, () => this.tryOpenIncidentChoices());
      return;
    }
    this.openChoices('incident');
  }

  private closeChoices() {
    this.choiceState = 'hidden'; this.missionKey = null;
    this.choiceGfx.setVisible(false); this.choiceTitle.setVisible(false);
    for (const o of this.choiceOpts) o.setVisible(false);
    this.resultText.setVisible(false);
    this.virtualPad.setChoiceButtonsVisible(false);
  }

  // ── Chapter clear ─────────────────────────────────────────────

  private buildChapterClear() {
    this.clearGfx = this.add.graphics();
    this.clearGfx.fillStyle(0x000000, 0.85); this.clearGfx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    this.clearGfx.setDepth(50).setVisible(false);

    this.clearTitle = this.add.text(CANVAS_W / 2, CANVAS_H / 2 - 50, '🎉 チャプタークリア！', {
      fontSize: '26px', color: '#ffdd66', fontFamily: JP, fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(51).setVisible(false);

    this.clearScore = this.add.text(CANVAS_W / 2, CANVAS_H / 2 + 4, '', {
      fontSize: '15px', color: '#ddeeff', fontFamily: JP, align: 'center',
    }).setOrigin(0.5).setDepth(51).setVisible(false);

    this.clearNext = this.add.text(CANVAS_W / 2, CANVAS_H / 2 + 60, 'Space：次のチャプターへ（準備中）', {
      fontSize: '13px', color: '#88aacc', fontFamily: JP,
      backgroundColor: '#00000099', padding: { x: 12, y: 6 },
    }).setOrigin(0.5).setDepth(51).setVisible(false);
  }

  private showChapterClear() {
    saveChapterScore('chapter3', this.score);
    markChapterCleared('chapter3');
    this.chapterClearShown = true;
    this.clearGfx.setVisible(true);
    this.clearTitle.setVisible(true);
    this.clearScore.setText(`第3章「基本設計」クリア！\nスコア：${this.score}点`).setVisible(true);
    this.clearNext.setVisible(true);
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
    // 選択肢ボタン(1/2/3)は選択パネル表示中のみ有効。パネルが閉じている間の
    // 誤タップを毎フレーム破棄し、次に開くパネルへ持ち越されないようにする。
    if (this.choiceState !== 'open') this.virtualPad.getChoicePressed();

    if (this.chapterClearShown) {
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey) || this.virtualPad.isActionPressed()) {
        window.dispatchEvent(new CustomEvent('sier-chapter-cleared', { detail: { chapterId: 'chapter3' } }));
      }
      return;
    }

    if (this.choiceState === 'open') {
      this.virtualPad.isActionPressed(); // Aボタンの誤操作が次の状態へ漏れないよう破棄
      const padChoice = this.virtualPad.getChoicePressed();
      if (Phaser.Input.Keyboard.JustDown(this.key1) || padChoice === 1) this.handleChoice(0);
      if (Phaser.Input.Keyboard.JustDown(this.key2) || padChoice === 2) this.handleChoice(1);
      if (Phaser.Input.Keyboard.JustDown(this.key3) || padChoice === 3) this.handleChoice(2);
      return;
    }
    if (this.choiceState === 'result') {
      this.virtualPad.isActionPressed(); // 結果表示中の連打が次の操作に誤適用されないよう破棄
      return;
    }

    if (this.dialogState !== 'closed') {
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey) || this.virtualPad.isActionPressed()) this.advanceDialog();
      return;
    }

    const nearby = this.getNearbyNpc();
    const onDesk = this.isOnDesk();
    const missionActive = this.gameStep === 1 || this.gameStep === 3;
    const spaceJust = Phaser.Input.Keyboard.JustDown(this.spaceKey) || this.virtualPad.isActionPressed();

    if (spaceJust && nearby) { this.openDialog(nearby); return; }
    if (spaceJust && onDesk && missionActive) { this.openChoices(this.gameStep === 1 ? 'design' : 'review'); return; }

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
