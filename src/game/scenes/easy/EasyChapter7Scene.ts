import * as Phaser from 'phaser';
import { markChapterCleared, saveChapterScore } from '../../chapters';
import { VirtualPad } from '../../VirtualPad';
import { getDifficulty, DIFFICULTY_CONFIG, DIFFICULTY_HUD_COLOR, type Difficulty, type DiffConfig } from '../../difficulty';

const TILE = 32;
const COLS = 25;
const ROWS = 20;
const MAP_W = COLS * TILE;
const MAP_H = ROWS * TILE;
const PLAYER_SIZE = 28;
const SPEED = 160;
const JP = '"Hiragino Kaku Gothic ProN","Hiragino Sans","Yu Gothic","Meiryo",Arial,sans-serif';

const F = 0, W = 1, D = 2, E = 3, P = 5; // P = player desk (blue, walkable)

const TILE_MAP: number[][] = [
  [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
  [W,F,F,F,F,W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
  [W,F,F,F,F,W,D,D,D,F,F,D,D,D,F,F,D,D,D,F,F,D,D,D,W],
  [W,F,F,F,F,F,D,D,D,F,F,D,D,D,F,F,D,D,D,F,F,D,D,D,W],
  [W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
  [W,F,F,F,F,W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
  [W,W,W,W,W,W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
  [W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
  [W,F,F,F,F,F,D,D,D,F,F,D,D,D,F,F,D,D,D,F,F,D,D,D,W],
  [W,F,F,F,F,F,D,D,D,F,F,D,D,D,F,F,D,D,D,F,F,D,D,D,W],
  [W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
  [W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
  [W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
  [W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
  [W,F,F,F,F,F,D,D,D,F,F,D,D,D,F,F,D,D,D,F,F,D,D,D,W],
  [W,F,F,F,F,F,D,D,D,F,F,D,D,D,F,F,D,D,D,F,F,D,D,D,W],
  [W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
  [W,F,F,F,F,F,P,P,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W], // P = col6-7 (jibun no desk, 2x2)
  [W,F,F,F,F,F,P,P,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
  [W,W,W,W,W,W,W,W,W,W,W,W,E,W,W,W,W,W,W,W,W,W,W,W,W],
];

const WALKABLE = new Set([F, E, P]);

const TILE_COLORS: Record<number, number> = {
  0: 0xE8E4D9, 1: 0x4A4A4A, 3: 0x2a7a40,
};

interface NpcDef { name: string; col: number; row: number; lines: string[]; }
interface Choice  { text: string; score: number; result: string; }

type Facing = 'down' | 'left' | 'right' | 'up';
const PLAYER_FRAME: Record<Facing, number> = { right: 0, up: 1, left: 2, down: 3 };
const PLAYER_WALK_FRAMES: Record<Facing, number[]> = {
  right: [24, 25, 26, 27, 28, 29],
  up: [30, 31, 32, 33, 34, 35],
  left: [36, 37, 38, 39, 40, 41],
  down: [42, 43, 44, 45, 46, 47],
};
const NPC_FRAME: Record<Facing, number> = { right: 0, up: 1, left: 2, down: 3 };
const NPC_SPRITE_KEY: Record<string, string> = { '山田課長': 'npc-yamada', '木村先輩': 'npc-kimura', '中村さん': 'npc-nakamura' };

const NPCS: NpcDef[] = [
  { name: '山田課長', col: 2, row: 1, lines: ['3ヶ月間、お疲れさまでした', 'このプロジェクトを振り返ってみようか', 'まぁ焦らずやろう。次に繋げていけばいいから'] },
  { name: '木村先輩', col: 9, row: 3, lines: ['振り返り、やってみる？', 'KPTって聞いたことある？', '机でまとめてみて'] },
  { name: '中村さん', col: 6, row: 4, lines: ['ポータル、本当に使いやすくなりました！', '次は何を作るんですか？', '楽しみにしてます！'] },
];

const CHOICES: Record<'m1' | 'm2', Choice[]> = {
  m1: [
    { text: '事実をベースにKeep・Problem・Tryを整理する',     score: 10, result: '「客観的にまとめられてるね」と山田課長も感心した様子。隣で木村先輩も「成長したなぁ」としみじみ。[+10点]' },
    { text: '良かったことだけをまとめる',                       score: -5, result: '「課題も振り返らないと、次に繋がらないよ」と木村先輩に指摘された。中村さんも「もったいないですね」と苦笑い。[-5点]' },
    { text: '先輩に相談しながら整理する',                       score:  5, result: '「一緒に振り返ると、気づきも増えるね」と木村先輩。「お二人、本当にいいチームですね」と中村さんも微笑んだ。[+5点]' },
  ],
  m2: [
    { text: '中村さんたちの要望をヒアリングして企画書にまとめる', score: 10, result: '「現場の声がしっかり入ってるね」と山田課長も納得。「ちゃんと聞いてもらえて嬉しいです」と中村さんも嬉しそう。[+10点]' },
    { text: '自分のやりたい技術だけで企画書を作る',               score: -5, result: '「気持ちはわかるけど、使う人のことも考えてみようか」と木村先輩に言われた。中村さんも「わたしたちの声も…」と少し残念そう。[-5点]' },
    { text: '木村先輩と一緒にたたき台を作る',                     score:  5, result: '「一緒に考えると、いい企画になるね」と木村先輩が褒めてくれた。「お二人、息ぴったりですね」と山田課長も笑顔。[+5点]' },
    { text: 'とりあえずテンプレート通りに形だけ整える',           score:  0, result: '形式は整っていたが、内容が薄く「もう少し中身を詰めようか」と木村先輩に言われた。山田課長も「焦らずでいいよ」とフォローしてくれた。[±0点]' },
  ],
};

const INCIDENT = {
  notice: '🔥プチ炎上アラート🔥\n来月から新人が入ってくることになり、教育係を任されることに！',
  title: '🔥 新人教育係、どう対応する？',
  choices: [
    { text: '自分が教わったことをもとに引継ぎ資料を作成する',       score: 10, result: '「自分の経験を整理するのは、いい振り返りにもなるね」と山田課長に言われた。「あの時の木村さんみたいですね」と中村さんも嬉しそう。[+10点]' },
    { text: '特に準備せず、その場で口頭で教える',                   score: -5, result: '新人さんから「何をすればいいかよくわからなくて…」と相談されてしまった。木村先輩も「俺の時の資料、まだあるから渡すよ」と苦笑い。[-5点]' },
    { text: '木村先輩に教え方を相談してから準備する',               score:  5, result: '「先輩のやり方、参考になるね」と取り入れることができた。「今度は自分が木村くんの役か」と山田課長も感慨深そう。[+5点]' },
  ] as Choice[],
};

const MISSION_LABEL = [
  'NPCに話しかけよう',
  '📋 KPTで振り返りをまとめよう（自分の机へ）',
  '📋 完了！ 中村さんに話しかけよう',
  '📝 次期企画を提案しよう（自分の机へ）',
  '📝 全ミッション完了！',
];

type DialogState = 'closed' | 'typing' | 'waiting';
type ChoiceState  = 'hidden' | 'open' | 'result';

// ─────────────────────────────────────────────────────────────────────────────

export class EasyChapter7Scene extends Phaser.Scene {
  private mapGfx!: Phaser.GameObjects.Graphics;
  private charGfx!: Phaser.GameObjects.Graphics;

  private canvasW = 800;
  private canvasH = 600;

  private player!: { x: number; y: number };
  private playerSprite!: Phaser.GameObjects.Sprite;
  private npcSprites = new Map<string, Phaser.GameObjects.Image>();
  private facing: Facing = 'down';

  private score = 0;
  private gameStep = 0;

  private dialogState: DialogState = 'closed';
  private activeNpc: NpcDef | null = null;
  private activeLines: string[] = [];
  private lineIdx = 0;
  private typedLen = 0;
  private typingTimer: Phaser.Time.TimerEvent | null = null;

  private choiceState: ChoiceState = 'hidden';
  private missionKey: 'm1' | 'm2' | 'incident' | null = null;

  private incidentDone = false;

  private diffLevel: Difficulty = 'normal';
  private diffCfg: DiffConfig = DIFFICULTY_CONFIG.normal;

  private chapterClearShown = false;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private key1!: Phaser.Input.Keyboard.Key;
  private key2!: Phaser.Input.Keyboard.Key;
  private key3!: Phaser.Input.Keyboard.Key;
  private key4!: Phaser.Input.Keyboard.Key;
  private key5!: Phaser.Input.Keyboard.Key;
  private virtualPad!: VirtualPad;

  private hudBg!: Phaser.GameObjects.Graphics;
  private hudTitle!: Phaser.GameObjects.Text;
  private hudMission!: Phaser.GameObjects.Text;
  private hudScore!: Phaser.GameObjects.Text;
  private missionLabel = MISSION_LABEL[0];

  private proximityHint!: Phaser.GameObjects.Text;
  private noticeText!: Phaser.GameObjects.Text;
  private noticeTimer: Phaser.Time.TimerEvent | null = null;
  private hintBarBg!: Phaser.GameObjects.Graphics;
  private hintBarText!: Phaser.GameObjects.Text;

  private dlgBg!: Phaser.GameObjects.Graphics;
  private dlgName!: Phaser.GameObjects.Text;
  private dlgBody!: Phaser.GameObjects.Text;
  private dlgCue!: Phaser.GameObjects.Text;

  private choiceGfx!: Phaser.GameObjects.Graphics;
  private choiceTitle!: Phaser.GameObjects.Text;
  private choiceOpts: Phaser.GameObjects.Text[] = [];
  private currentChoiceCount = 3;
  private resultText!: Phaser.GameObjects.Text;
  private resultCue!: Phaser.GameObjects.Text;

  private clearGfx!: Phaser.GameObjects.Graphics;
  private clearTitle!: Phaser.GameObjects.Text;
  private clearScore!: Phaser.GameObjects.Text;
  private clearNext!: Phaser.GameObjects.Text;

  constructor() { super({ key: 'EasyChapter7Scene' }); }

  preload() {
    this.load.spritesheet('office', '/game-assets/Modern_Office_32x32.png', {
      frameWidth: 32, frameHeight: 32,
    });
    this.load.spritesheet('player-walk', '/game-assets/Adam_16x16.png', { frameWidth: 16, frameHeight: 32 });
    this.load.spritesheet('npc-yamada', '/game-assets/Bob_idle_16x16.png', { frameWidth: 16, frameHeight: 32 });
    this.load.spritesheet('npc-kimura', '/game-assets/Alex_idle_16x16.png', { frameWidth: 16, frameHeight: 32 });
    this.load.spritesheet('npc-nakamura', '/game-assets/Amelia_idle_16x16.png', { frameWidth: 16, frameHeight: 32 });
  }

  create() {
    this.diffLevel = getDifficulty();
    this.diffCfg = DIFFICULTY_CONFIG[this.diffLevel];

    this.canvasW = this.scale.width;
    this.canvasH = this.scale.height;

    this.mapGfx = this.add.graphics();

    this.buildMap();
    this.buildSprites();

    this.charGfx = this.add.graphics();

    this.player = { x: 12 * TILE + TILE / 2, y: 17 * TILE + TILE / 2 };
    this.buildCharacterSprites();

    this.buildNpcLabels();
    this.buildHud();
    this.buildProximityHint();
    this.buildNotice();
    this.buildHintBar();
    this.buildDialogBox();
    this.buildChoicePanel();
    this.buildChapterClear();

    this.virtualPad = new VirtualPad(this);

    this.drawChars();
    this.updateCamera();

    this.scale.on('resize', this.onResize, this);
    this.events.once('shutdown', () => this.scale.off('resize', this.onResize, this));

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
    this.key4 = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
    this.key5 = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);

    this.showNotice('「3ヶ月間、お疲れさまでした。最後にチームで振り返りをしましょう」', 4500);
  }

  // ── Map ──────────────────────────────────────────────────────

  private buildMap() {
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        this.drawTile(c, r, TILE_MAP[r][c]);

    this.add.text(TILE + 4, TILE + 4, '会議室', { fontSize: '10px', color: '#999', fontFamily: 'monospace' }).setResolution(2);
    this.add.text(6 * TILE + 16, 17 * TILE - 2, '自分の机', {
      fontSize: '9px', color: '#88aaff', fontFamily: JP, stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5, 1).setResolution(2);
  }

  private drawTile(col: number, row: number, type: number) {
    const x = col * TILE, y = row * TILE;
    this.mapGfx.fillStyle(TILE_COLORS[type] ?? TILE_COLORS[0], 1);
    this.mapGfx.fillRect(x, y, TILE, TILE);
    if (type === 0) { this.mapGfx.lineStyle(1, 0x000000, 0.07); this.mapGfx.strokeRect(x, y, TILE, TILE); }
    if (type === 1) { this.mapGfx.fillStyle(0x686868, 1); this.mapGfx.fillRect(x, y, TILE, 4); }
    if (type === 3) {
      this.mapGfx.fillStyle(0x4cbb6a, 0.55); this.mapGfx.fillRect(x+4, y+4, TILE-8, TILE-8);
      this.mapGfx.fillStyle(0xffffff, 0.6);
      this.mapGfx.fillTriangle(x+16, y+TILE-6, x+10, y+TILE-14, x+22, y+TILE-14);
    }
  }

  // ── Sprite decorations (drawn over the Graphics map) ──────────

  private buildSprites() {
    const floorFrames = [77, 78, 93, 94];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (TILE_MAP[r][c] === F) {
          const frame = floorFrames[Phaser.Math.Between(0, floorFrames.length - 1)];
          this.add.image(c * TILE + TILE / 2, r * TILE + TILE / 2, 'office', frame);
        }
      }
    }

    const deskTop = [455, 456, 457];
    const deskBottom = [471, 472, 473];
    const monitorFrames = [712, 713];
    const chairSets: [number, number][] = [[129, 145], [131, 147]];
    let groupIdx = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (TILE_MAP[r][c] === D && TILE_MAP[r - 1]?.[c] !== D && TILE_MAP[r]?.[c - 1] !== D) {
          for (let i = 0; i < 3; i++) {
            this.add.image((c + i) * TILE + TILE / 2, r * TILE + TILE / 2, 'office', deskTop[i]);
            this.add.image((c + i) * TILE + TILE / 2, (r + 1) * TILE + TILE / 2, 'office', deskBottom[i]);
          }
          const centerX = (c + 1) * TILE + TILE / 2;
          this.add.image(centerX, r * TILE + TILE / 2, 'office', monitorFrames[groupIdx % 2]);
          if (TILE_MAP[r + 2]?.[c + 1] === F) {
            const [chairTop, chairBottom] = chairSets[Phaser.Math.Between(0, 1)];
            this.add.image(centerX, (r + 2) * TILE + TILE / 2, 'office', chairTop);
            this.add.image(centerX, (r + 3) * TILE + TILE / 2, 'office', chairBottom);
          }
          groupIdx++;
        }
      }
    }

    const plantSpots = [
      { col: 1, row: 1 }, { col: 23, row: 5 },
      { col: 1, row: 17 }, { col: 23, row: 17 },
    ];
    for (const { col, row } of plantSpots) {
      this.add.image(col * TILE + TILE / 2, row * TILE + TILE / 2, 'office', 166);
      this.add.image(col * TILE + TILE / 2, (row + 1) * TILE + TILE / 2, 'office', 182);
    }

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

    const whiteboardSpots = [{ col: 2, row: 0 }, { col: 9, row: 0 }, { col: 16, row: 0 }];
    for (const { col, row } of whiteboardSpots) {
      this.add.image(col * TILE + TILE / 2, row * TILE + TILE / 2, 'office', 233);
      this.add.image((col + 1) * TILE + TILE / 2, row * TILE + TILE / 2, 'office', 234);
      this.add.image(col * TILE + TILE / 2, (row + 1) * TILE + TILE / 2, 'office', 249);
      this.add.image((col + 1) * TILE + TILE / 2, (row + 1) * TILE + TILE / 2, 'office', 250);
    }

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (TILE_MAP[r][c] === P && TILE_MAP[r - 1]?.[c] !== P && TILE_MAP[r]?.[c - 1] !== P) {
          this.add.image(c * TILE + TILE / 2, r * TILE + TILE / 2, 'office', 366);
          this.add.image((c + 1) * TILE + TILE / 2, r * TILE + TILE / 2, 'office', 367);
          this.add.image(c * TILE + TILE / 2, (r + 1) * TILE + TILE / 2, 'office', 382);
          this.add.image((c + 1) * TILE + TILE / 2, (r + 1) * TILE + TILE / 2, 'office', 383);
        }
      }
    }
  }

  // ── HUD ──────────────────────────────────────────────────────

  private buildHud() {
    this.hudBg = this.add.graphics().setScrollFactor(0);
    this.hudTitle = this.add.text(10, 5, 'Day 40  ふりかえり', { fontSize: '11px', color: '#7799aa', fontFamily: JP }).setScrollFactor(0).setResolution(2);
    this.hudMission = this.add.text(0, 5, MISSION_LABEL[0], { fontSize: '14px', color: '#ddcc88', fontFamily: JP }).setOrigin(0.5, 0).setScrollFactor(0).setResolution(2);
    this.hudScore   = this.add.text(0, 5, `${this.diffCfg.label} | Score: 0`, { fontSize: '14px', color: DIFFICULTY_HUD_COLOR[this.diffLevel], fontFamily: JP }).setOrigin(1, 0).setScrollFactor(0).setResolution(2);
    this.layoutHud();
  }

  private layoutHud() {
    const compact = this.canvasW < 560;
    const h = compact ? 46 : 26;

    this.hudBg.clear();
    this.hudBg.fillStyle(0x0a0a14, 0.93); this.hudBg.fillRect(0, 0, this.canvasW, h);
    this.hudBg.lineStyle(1, 0x223344, 1); this.hudBg.strokeRect(0, 0, this.canvasW, h);

    this.hudTitle.setPosition(10, 5);
    this.hudScore.setPosition(this.canvasW - 90, 5);
    if (compact) {
      this.hudMission.setFontSize(12).setPosition(this.canvasW / 2, 25);
    } else {
      this.hudMission.setFontSize(14).setPosition(this.canvasW / 2, 5);
    }
    this.refreshMissionText();
  }

  private refreshMissionText() {
    const compact = this.canvasW < 560;
    const maxWidth = compact ? this.canvasW - 20 : this.canvasW - 200;
    let text = this.missionLabel;
    this.hudMission.setText(text);
    while (this.hudMission.width > maxWidth && text.length > 1) {
      text = text.slice(0, -1);
      this.hudMission.setText(text + '…');
    }
  }

  private updateHud() {
    this.missionLabel = MISSION_LABEL[this.gameStep] ?? '';
    this.refreshMissionText();
    this.hudScore.setText(`${this.diffCfg.label} | Score: ${this.score}`);
  }

  // ── NPC labels ────────────────────────────────────────────────

  private buildNpcLabels() {
    for (const npc of NPCS) {
      this.add.text(npc.col * TILE + 16, npc.row * TILE - 2, npc.name, {
        fontSize: '10px', color: '#ffffaa', fontFamily: JP, stroke: '#000', strokeThickness: 3,
      }).setOrigin(0.5, 1).setResolution(2);
    }
  }

  // ── Misc UI ───────────────────────────────────────────────────

  private buildProximityHint() {
    this.proximityHint = this.add.text(0, 0, '', {
      fontSize: '15px', color: '#ffee88', fontFamily: JP,
      backgroundColor: '#00000099', padding: { x: 10, y: 4 },
    }).setOrigin(0.5, 1).setScrollFactor(0).setResolution(2);
    this.layoutProximityHint();
  }

  private layoutProximityHint() {
    this.proximityHint.setPosition(this.canvasW / 2, this.canvasH - 100);
  }

  private buildNotice() {
    this.noticeText = this.add.text(0, 120, '', {
      fontSize: '17px', color: '#ffeeaa', fontFamily: JP, align: 'center',
      backgroundColor: '#000000aa', padding: { x: 16, y: 10 },
    }).setOrigin(0.5, 0.5).setVisible(false).setScrollFactor(0).setResolution(2);
    this.layoutNotice();
  }

  private layoutNotice() {
    const fontSize = this.canvasW < 500 ? '12px' : '14px';
    this.noticeText.setFontSize(fontSize).setX(this.canvasW / 2);
    this.noticeText.setWordWrapWidth(this.canvasW - 60, true);
  }

  private showNotice(msg: string, ms = 2800) {
    if (this.noticeTimer) { this.noticeTimer.destroy(); this.noticeTimer = null; }
    this.noticeText.setText(msg).setVisible(true);
    this.noticeTimer = this.time.addEvent({ delay: ms, callback: () => { this.noticeText.setVisible(false); this.noticeTimer = null; } });
  }

  private buildHintBar() {
    this.hintBarBg = this.add.graphics().setScrollFactor(0);
    this.hintBarText = this.add.text(0, 0, '矢印/WASD：移動　Space：話す/作業　1-5：選択', {
      fontSize: '12px', color: '#3a4a5a', fontFamily: 'monospace',
    }).setOrigin(0.5, 0).setScrollFactor(0).setResolution(2);
    this.layoutHintBar();
  }

  private layoutHintBar() {
    const h = 24;
    const y = this.canvasH - h;
    this.hintBarBg.clear();
    this.hintBarBg.fillStyle(0x0e0e16, 1); this.hintBarBg.fillRect(0, y, this.canvasW, h);
    this.hintBarText.setPosition(this.canvasW / 2, y + 5);
  }

  // ── Dialog box ────────────────────────────────────────────────

  private buildDialogBox() {
    this.dlgBg = this.add.graphics().setVisible(false).setScrollFactor(0);
    this.dlgName = this.add.text(0, 0, '', { fontSize: '15px', color: '#ffdd66', fontFamily: JP, fontStyle: 'bold' }).setVisible(false).setScrollFactor(0).setResolution(2);
    this.dlgBody = this.add.text(0, 0, '', { fontSize: '18px', color: '#eeeeff', fontFamily: JP }).setVisible(false).setScrollFactor(0).setResolution(2);
    this.dlgCue  = this.add.text(0, 0, '', { fontSize: '12px', color: '#556677', fontFamily: 'monospace' }).setOrigin(1, 1).setVisible(false).setScrollFactor(0).setResolution(2);
    this.layoutDialogBox();
  }

  private layoutDialogBox() {
    const BX = 10, BW = this.canvasW - 20, BH = 120, P2 = 14;
    const BY = this.canvasH - BH - 10;
    const fontSize = this.canvasW < 500 ? '12px' : '14px';
    this.dlgBg.clear();
    this.dlgBg.fillStyle(0x000000, 0.88); this.dlgBg.fillRoundedRect(BX, BY, BW, BH, 8);
    this.dlgBg.lineStyle(1, 0x445566, 0.9); this.dlgBg.strokeRoundedRect(BX, BY, BW, BH, 8);
    this.dlgName.setPosition(BX + P2, BY + 10);
    this.dlgBody.setFontSize(fontSize).setPosition(BX + P2, BY + 30).setWordWrapWidth(BW - 40, true);
    this.dlgCue.setPosition(BX + BW - P2, BY + BH - 10);
  }

  private getLines(npc: NpcDef): string[] {
    if (npc.name === '山田課長') {
      if (this.gameStep === 0) return ['3ヶ月間、お疲れさまでした', 'このプロジェクトを振り返ってみようか', '思えば最初は木村くんに教育係を頼んだね', 'あの時の新人さんが、もうこんなに頼りになるとは', 'まずはKPTでまとめてみよう'];
      if (this.gameStep < 3) return ['振り返り、進んでる？', '良かったことも、課題も、どちらも大事だよ', 'そういえば、今日は会議室の空調が効いてて快適だね', '木村くんも中村さんも、君のこと褒めてたよ'];
      return ['次期企画の提案、お疲れさま', '成長したね。これからも頼りにしてるよ', '実はね、次のプロジェクトも君に任せたいと思ってる', '木村くんにはサポート役をお願いするつもりだ', '引き続き、よろしく頼むよ'];
    }
    if (npc.name === '木村先輩') {
      if (this.gameStep === 0) return ['振り返り、やってみる？', 'KPTって聞いたことある？', '入社した時はKもPもわからなかったよね', 'もう新人って感じじゃないなぁ、なんか感慨深いよ', 'Keep・Problem・Tryでまとめてみて。机でやってみよう'];
      if (this.gameStep === 1) return ['振り返り、進んでる？', '事実をベースに考えてみるといいよ', '中村さんとも、3ヶ月いろいろあったよねって話してたんだ', '一緒にお菓子食べたの、つい最近のことみたいだな'];
      return ['振り返り、見たよ。いいまとめだね', '次は次期企画の提案も考えてみようか', '中村さんも「最初の頃と全然違う」って驚いてたよ'];
    }
    if (npc.name === '中村さん') {
      if (this.gameStep < 2) return ['ポータル、本当に使いやすくなりました！', '次は何を作るんですか？', '木村さんと、最初に話を聞いた日のこと話してたんです', 'あの頃と比べて、すっかり頼もしくなりましたね', '楽しみにしてます！'];
      if (this.gameStep === 2) return ['もしよかったら、わたしたちの要望も聞いてもらえますか？', '実は他にもこんな機能があったら…と思うことがあって', '今度、聞いてもらえますか？'];
      return ['企画書、見せてもらいました！', 'わたしたちの声、ちゃんと反映されていて嬉しいです', 'これ、よかったらどうぞ。お世話になったお礼です', '（クッキーの小袋を渡してくれた）', '3ヶ月間、本当にありがとうございました'];
    }
    return npc.lines;
  }

  private openDialog(npc: NpcDef) {
    this.proximityHint.setText('').setVisible(false);
    this.faceNpcToPlayer(npc);
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
    this.npcSprites.get(npc.name)?.setFrame(NPC_FRAME.down);
    if (npc.name === '木村先輩' && this.gameStep === 0) {
      this.gameStep = 1; this.updateHud();
      this.showNotice('ミッション受諾！\n📋 KPTで振り返りをまとめてください\n自分の机へ行こう', 3000);
    } else if (npc.name === '中村さん' && this.gameStep === 2) {
      this.gameStep = 3; this.updateHud();
      this.showNotice('ミッション受諾！\n📝 次期企画を提案してください\n自分の机へ行こう', 3000);
    }
  }

  // ── Choice panel ──────────────────────────────────────────────

  private buildChoicePanel() {
    this.choiceGfx = this.add.graphics().setVisible(false).setScrollFactor(0);

    this.choiceTitle = this.add.text(0, 0, '', { fontSize: '16px', color: '#aaccee', fontFamily: JP, fontStyle: 'bold' }).setOrigin(0.5, 0).setVisible(false).setScrollFactor(0).setResolution(2);

    this.choiceOpts = [];
    for (let i = 0; i < 5; i++) {
      this.choiceOpts.push(
        this.add.text(0, 0, '', { fontSize: '15px', color: '#ddeeff', fontFamily: JP }).setVisible(false).setScrollFactor(0).setResolution(2),
      );
    }

    this.resultText = this.add.text(0, 0, '', {
      fontSize: '17px', color: '#ffdd88', fontFamily: JP, align: 'center',
      backgroundColor: '#00000099', padding: { x: 14, y: 10 },
    }).setOrigin(0.5, 0.5).setVisible(false).setScrollFactor(0).setResolution(2);

    this.resultCue = this.add.text(0, 0, '', {
      fontSize: '12px', color: '#556677', fontFamily: 'monospace',
    }).setOrigin(1, 1).setVisible(false).setScrollFactor(0).setResolution(2);

    this.layoutChoicePanel();
  }

  private layoutChoicePanel() {
    const n = this.currentChoiceCount;
    const optGap = n <= 3 ? 46 : n === 4 ? 40 : 35;
    const PW = Math.min(580, this.canvasW - 40);
    const PH = Math.min(56 + n * optGap + 30, this.canvasH - 40);
    const PX = (this.canvasW - PW) / 2;
    const PY = (this.canvasH - PH) / 2;
    const fontSize = this.canvasW < 500 ? '12px' : '14px';

    this.choiceGfx.clear();
    this.choiceGfx.fillStyle(0x000000, 0.80); this.choiceGfx.fillRect(0, 0, this.canvasW, this.canvasH);
    this.choiceGfx.fillStyle(0x111a28, 1); this.choiceGfx.fillRoundedRect(PX, PY, PW, PH, 10);
    this.choiceGfx.lineStyle(2, 0x3a5a8a, 1); this.choiceGfx.strokeRoundedRect(PX, PY, PW, PH, 10);

    this.choiceTitle.setFontSize(fontSize).setPosition(this.canvasW / 2, PY + 18).setWordWrapWidth(PW - 40, true);

    for (let i = 0; i < 5; i++) {
      this.choiceOpts[i].setFontSize(fontSize).setPosition(PX + 18, PY + 56 + i * optGap).setWordWrapWidth(PW - 40, true);
    }

    this.resultText.setFontSize(fontSize).setPosition(this.canvasW / 2, PY + PH / 2 + 10).setWordWrapWidth(Math.min(520, PW - 60), true);
    this.resultCue.setPosition(PX + PW - 14, PY + PH - 10);
  }
  private recalcChoiceLayout() {
    const n = this.currentChoiceCount;
    const GAP = 10;
    const PW = Math.min(580, this.canvasW - 40);
    const PX = (this.canvasW - PW) / 2;
    const fontSize = this.canvasW < 500 ? '12px' : '14px';
    let contentH = 56;
    for (let i = 0; i < n; i++) contentH += this.choiceOpts[i].height + GAP;
    contentH += 20;
    const PH = Math.min(contentH, this.canvasH - 40);
    const PY = (this.canvasH - PH) / 2;
    this.choiceGfx.clear();
    this.choiceGfx.fillStyle(0x000000, 0.80); this.choiceGfx.fillRect(0, 0, this.canvasW, this.canvasH);
    this.choiceGfx.fillStyle(0x111a28, 1); this.choiceGfx.fillRoundedRect(PX, PY, PW, PH, 10);
    this.choiceGfx.lineStyle(2, 0x3a5a8a, 1); this.choiceGfx.strokeRoundedRect(PX, PY, PW, PH, 10);
    this.choiceTitle.setPosition(this.canvasW / 2, PY + 18);
    let cy = PY + 56;
    for (let i = 0; i < 5; i++) {
      this.choiceOpts[i].setPosition(PX + 18, cy);
      if (i < n) cy += this.choiceOpts[i].height + GAP;
    }
    this.resultText.setFontSize(fontSize).setPosition(this.canvasW / 2, PY + PH / 2 + 10).setWordWrapWidth(Math.min(520, PW - 60), true);
    this.resultCue.setPosition(PX + PW - 14, PY + PH - 10);
  }

  private openChoices(key: 'm1' | 'm2' | 'incident') {
    this.missionKey = key;
    this.choiceState = 'open';
    const title = key === 'm1' ? '📋 KPTでどう振り返りますか？'
      : key === 'm2' ? '📝 次期企画をどう提案しますか？'
      : INCIDENT.title;
    const choices = key === 'incident' ? INCIDENT.choices : CHOICES[key];
    this.currentChoiceCount = choices.length;
    this.layoutChoicePanel();
    this.choiceGfx.setVisible(true);
    this.choiceTitle.setText(title).setVisible(true);
    const maxScore = Math.max(...choices.map(c => c.score));
    for (let i = 0; i < 5; i++) {
      if (i < choices.length) {
        const hint = this.diffCfg.showHints && choices[i].score === maxScore ? '  💡推奨' : '';
        this.choiceOpts[i].setText(`[${i + 1}]  ${choices[i].text}${hint}`).setVisible(true);
      } else {
        this.choiceOpts[i].setVisible(false);
      }
    }
    this.recalcChoiceLayout();
    this.resultText.setVisible(false);
    this.proximityHint.setText('').setVisible(false);
    this.virtualPad.setChoiceButtonsVisible(choices.length);
  }

  private handleChoice(idx: number) {
    if (this.choiceState !== 'open' || !this.missionKey) return;
    const choices = this.missionKey === 'incident' ? INCIDENT.choices : CHOICES[this.missionKey];
    if (idx >= choices.length) return;
    const c = choices[idx];
    const mult = c.score >= 0 ? this.diffCfg.bonusMult : this.diffCfg.penaltyMult;
    this.score += Math.round(c.score * mult);
    this.choiceState = 'result';
    for (const o of this.choiceOpts) o.setVisible(false);
    this.choiceTitle.setVisible(false);
    this.resultText.setText(c.result).setVisible(true);
    this.resultCue.setText('Space: 次へ ▶').setVisible(true);
  }

  private finishChoiceResult() {
    const missionKey = this.missionKey;
    this.resultCue.setVisible(false);

    if (missionKey === 'incident') {
      this.updateHud(); this.closeChoices();
      return;
    }

    const next = missionKey === 'm1' ? 2 : 4;
    this.gameStep = next; this.updateHud(); this.closeChoices();
    if (next === 4) this.showChapterClear();
    if (next === 2) this.scheduleIncident();
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
    this.resultCue.setVisible(false);
    this.virtualPad.setChoiceButtonsVisible(0);
  }

  // ── Chapter clear ─────────────────────────────────────────────

  private buildChapterClear() {
    this.clearGfx = this.add.graphics().setDepth(50).setVisible(false).setScrollFactor(0);

    this.clearTitle = this.add.text(0, 0, '🎉 チャプタークリア！', {
      fontSize: '30px', color: '#ffdd66', fontFamily: JP, fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(51).setVisible(false).setScrollFactor(0).setResolution(2);

    this.clearScore = this.add.text(0, 0, '', {
      fontSize: '17px', color: '#ddeeff', fontFamily: JP, align: 'center',
    }).setOrigin(0.5).setDepth(51).setVisible(false).setScrollFactor(0).setResolution(2);

    this.clearNext = this.add.text(0, 0, 'Space：次のチャプターへ（準備中）', {
      fontSize: '15px', color: '#88aacc', fontFamily: JP,
      backgroundColor: '#00000099', padding: { x: 12, y: 6 },
    }).setOrigin(0.5).setDepth(51).setVisible(false).setScrollFactor(0).setResolution(2);

    this.layoutChapterClear();
  }

  private layoutChapterClear() {
    const wrap = this.canvasW - 60;
    this.clearGfx.clear();
    this.clearGfx.fillStyle(0x000000, 0.85); this.clearGfx.fillRect(0, 0, this.canvasW, this.canvasH);
    this.clearTitle.setPosition(this.canvasW / 2, this.canvasH / 2 - 50).setWordWrapWidth(wrap, true);
    this.clearScore.setPosition(this.canvasW / 2, this.canvasH / 2 + 4).setWordWrapWidth(wrap, true);
    this.clearNext.setPosition(this.canvasW / 2, this.canvasH / 2 + 60).setWordWrapWidth(wrap, true);
  }

  private showChapterClear() {
    saveChapterScore('easy-chapter7', this.score);
    markChapterCleared('easy-chapter7');
    this.chapterClearShown = true;
    this.clearGfx.setVisible(true);
    this.clearTitle.setVisible(true);
    this.clearScore.setText(`第7章「振り返り・次期企画」クリア！\nスコア：${this.score}点`).setVisible(true);
    this.clearNext.setVisible(true);
  }

  // ── Characters ────────────────────────────────────────────────

  private buildCharacterSprites() {
    (Object.keys(PLAYER_WALK_FRAMES) as Facing[]).forEach((dir) => {
      const key = `player-walk-${dir}`;
      if (!this.anims.exists(key)) {
        this.anims.create({
          key,
          frames: this.anims.generateFrameNumbers('player-walk', { frames: PLAYER_WALK_FRAMES[dir] }),
          frameRate: 8,
          repeat: -1,
        });
      }
    });
    for (const npc of NPCS) {
      const sprite = this.add.image(npc.col * TILE + 16, npc.row * TILE + 16, NPC_SPRITE_KEY[npc.name], NPC_FRAME.down).setScale(2);
      this.npcSprites.set(npc.name, sprite);
    }
    this.playerSprite = this.add.sprite(this.player.x, this.player.y, 'player-walk', PLAYER_FRAME.down).setScale(2);
  }

  private drawChars() {
    this.charGfx.clear();
    this.playerSprite.setPosition(this.player.x, this.player.y);
    this.updatePlayerAnimation();
  }

  private updatePlayerAnimation() {
    this.playerSprite.play(`player-walk-${this.facing}`, true);
  }

  private faceNpcToPlayer(npc: NpcDef) {
    const sprite = this.npcSprites.get(npc.name);
    if (!sprite) return;
    const { col: playerCol, row: playerRow } = this.playerTile();
    const dx = playerCol - npc.col;
    const dy = playerRow - npc.row;
    if (Math.abs(dx) > Math.abs(dy)) {
      sprite.setFrame(dx > 0 ? NPC_FRAME.right : NPC_FRAME.left);
    } else {
      sprite.setFrame(dy > 0 ? NPC_FRAME.down : NPC_FRAME.up);
    }
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

  // ── Camera & resize ──────────────────────────────────────────

  private updateCamera() {
    const cam = this.cameras.main;
    cam.setSize(this.canvasW, this.canvasH);
    const scrollX = MAP_W <= this.canvasW
      ? (MAP_W - this.canvasW) / 2
      : Phaser.Math.Clamp(this.player.x - this.canvasW / 2, 0, MAP_W - this.canvasW);
    const scrollY = MAP_H <= this.canvasH
      ? (MAP_H - this.canvasH) / 2
      : Phaser.Math.Clamp(this.player.y - this.canvasH / 2, 0, MAP_H - this.canvasH);
    cam.setScroll(scrollX, scrollY);
  }

  private onResize = (gameSize: Phaser.Structs.Size) => {
    this.canvasW = gameSize.width;
    this.canvasH = gameSize.height;
    this.layoutHud();
    this.layoutProximityHint();
    this.layoutNotice();
    this.layoutHintBar();
    this.layoutDialogBox();
    this.layoutChoicePanel();
    this.layoutChapterClear();
    this.updateCamera();
  };

  // ── Update ────────────────────────────────────────────────────

  update(_t: number, delta: number) {
    this.virtualPad.setDpadVisible(
      !this.chapterClearShown &&
      this.choiceState === 'hidden' && this.dialogState === 'closed',
    );

    if (this.choiceState !== 'open') this.virtualPad.getChoicePressed();

    if (this.chapterClearShown) {
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey) || this.virtualPad.isActionPressed()) {
        window.dispatchEvent(new CustomEvent('sier-chapter-cleared', { detail: { chapterId: 'easy-chapter7' } }));
      }
      return;
    }

    if (this.choiceState === 'open') {
      this.virtualPad.isActionPressed();
      const padChoice = this.virtualPad.getChoicePressed();
      if (Phaser.Input.Keyboard.JustDown(this.key1) || padChoice === 1) this.handleChoice(0);
      if (Phaser.Input.Keyboard.JustDown(this.key2) || padChoice === 2) this.handleChoice(1);
      if (Phaser.Input.Keyboard.JustDown(this.key3) || padChoice === 3) this.handleChoice(2);
      if (Phaser.Input.Keyboard.JustDown(this.key4) || padChoice === 4) this.handleChoice(3);
      if (Phaser.Input.Keyboard.JustDown(this.key5) || padChoice === 5) this.handleChoice(4);
      return;
    }
    if (this.choiceState === 'result') {
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey) || this.virtualPad.isActionPressed()) this.finishChoiceResult();
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
    if (spaceJust && onDesk && missionActive) { this.openChoices(this.gameStep === 1 ? 'm1' : 'm2'); return; }

    const hintText = nearby ? `【${nearby.name}】  Space で話しかける` :
      (onDesk && missionActive) ? '自分の机  Space で作業する' : '';
    this.proximityHint.setText(hintText).setVisible(!!hintText);

    const dt = delta / 1000;
    let dx = 0, dy = 0;
    if (this.cursors.left.isDown  || this.wasd.left.isDown)  dx = -1;
    if (this.cursors.right.isDown || this.wasd.right.isDown) dx =  1;
    if (this.cursors.up.isDown    || this.wasd.up.isDown)    dy = -1;
    if (this.cursors.down.isDown  || this.wasd.down.isDown)  dy =  1;
    const pad = this.virtualPad.getDirection();
    if (pad.dx !== 0) dx = pad.dx;
    if (pad.dy !== 0) dy = pad.dy;
    if (dx === 0 && dy === 0) {
      if (this.playerSprite.anims.isPlaying) {
        this.playerSprite.anims.stop();
        this.playerSprite.setFrame(PLAYER_FRAME[this.facing]);
      }
      return;
    }

    if (dx < 0) this.facing = 'left';
    else if (dx > 0) this.facing = 'right';
    else if (dy < 0) this.facing = 'up';
    else if (dy > 0) this.facing = 'down';

    const nx = this.player.x + dx * SPEED * dt;
    const ny = this.player.y + dy * SPEED * dt;
    if (this.canMoveTo(nx, this.player.y)) this.player.x = nx;
    if (this.canMoveTo(this.player.x, ny)) this.player.y = ny;
    this.drawChars();
    this.updateCamera();
  }
}
