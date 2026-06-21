import * as Phaser from 'phaser';
import { markChapterCleared, saveChapterScore, getTotalScore, getEndingTier, HARD_ENDINGS, saveEarnedTitle, type ChapterDocument } from '../../chapters';
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
const NPC_SPRITE_KEY: Record<string, string> = { '韮沢CTO': 'npc-nirasawa', '戸田さん': 'npc-toda', 'オダギリさん': 'npc-odagiri' };

const NPCS: NpcDef[] = [
  { name: '韮沢CTO',   col: 2,  row: 1, lines: ['やっと本番リリースだ！おめでとう〜！', '引き継ぎ資料？うーん、まあ必要になったら作れば？', '障害対応はその時考えよう、なんとかなるって', 'とりあえずリリースして、あとは実態に合わせてやっていこう', 'よろしく！リリース楽しみにしてるね〜'] },
  { name: '戸田さん', col: 9, row: 3, lines: ['リリース、お疲れ様！ちょっといい？', '本番でいきなりエラーが出ても、誰が対応するかが決まってないよね', 'オダギリさんが「障害が起きた時どうすれば…」って困ってたよ', '最低限でいいから、対応の流れをまとめておこうか'] },
  { name: 'オダギリさん', col: 14, row: 9, lines: ['リリース、おめでとうございます…（恐る恐る）', 'もし本番でエラーが出た場合、誰に連絡すればいいんでしょう？', '私、障害が起きた時の流れとか、誰も教えてくれなくて…', 'せめて「こういう時はこうする」みたいな簡単なメモがあると助かります…'] },
];

const DOCUMENTS: ChapterDocument[] = [
  { id: 'doc-hourenso2', col: 12, row: 8, label: '資料📄',
    dialog: '本棚に「報・連・相（ホウレンソウ）」の参考資料が挟まっていた。\n\n「報告・連絡・相談」の重要性が書かれているが、\nSpireでは「誰に・いつ・どうやって報告するか」の流れ自体が決まっていない。\n\n「とりあえず今の自分にできることは、\n障害が起きた時に『誰に連絡して、何を伝えるか』を先に決めておくことかな。」',
    imageKey: 'hourenso', imageLabel: '報連相（参考資料）', required: true,
    blockedHint: '机の上の資料をチェックしてみよう…\n運用保守の進め方の参考になるかもしれない。' },
  { id: 'doc-orgchart2', col: 17, row: 8, label: '資料📄',
    dialog: '机の引き出しに「組織図（体制図）」のテンプレートを見つけた。\n\nプロジェクトメンバーの名前が空欄のままで、\n「担当：〇〇」という欄が埋まっていない。\n\n「Spireには明確な役割分担がないから、\n障害が起きた時に『誰の仕事か』が分からなくなる。\nせめて自分の担当範囲だけでも、明示しておこう。」',
    imageKey: 'org-chart', required: true,
    blockedHint: '机の上の資料をチェックしてみよう…\n運用保守の進め方の参考になるかもしれない。' },
];

// スコアバランス: ミッション1(handover)+ミッション2(operate)+炎上イベント(INCIDENT)の
// 計3セット、各セット{+10,-5,+5}＋あるある失敗用の0/-10オプション。本章の最大30点。
// 全7章合計・難易度別最低点・エース判定の詳細は src/game/chapters.ts のコメント参照。
const CHOICES: Record<'handover' | 'operate', Choice[]> = {
  handover: [
    { text: '「よくある障害パターン」と「その時の対応手順」をSlackのチャンネルにまとめておく', score: 10,
      result: '後日、実際に障害が発生した時にオダギリさんがそのメモを見て自己解決できた。「これがあって本当に助かりました！」と感謝された。[+10点]' },
    { text: '「なんとかなる」と思い、引き継ぎ資料を何も作らない', score: -5,
      result: 'リリース翌日に障害が発生。誰に連絡すればいいか分からず、オダギリさんが慌ててあちこちにDMを送る事態になった。[-5点]' },
    { text: '自分が担当する機能の仕様を、簡単にメモとしてGitHubのREADMEに追記する', score: 5,
      result: '完璧ではないが、「この機能は何のためにある」という記録が残せた。後で自分が確認する時にも役立った。[+5点]' },
    { text: '口頭でオダギリさんに「こういう時はこうすれば大丈夫」と伝える', score: 0,
      result: 'その場では伝わったが、1ヶ月後にオダギリさんから「あの時の説明、どんなだったか覚えてますか？」と聞かれ、お互い記憶が曖昧になっていた。[±0点]' },
    { text: '「リリースさえすれば後は運用チームの仕事」と思い、何もしない', score: -10,
      result: '運用チームはいなかった。オダギリさんが全ての対応を一人でこなすことになり、「もうちょっと何か残しておいてほしかったです…」と疲れた様子で言われた。[-10点]' },
  ],
  operate: [
    { text: '状況を確認してから韮沢CTOとオダギリさんに共有し、影響範囲と暫定対応をセットで報告する', score: 10,
      result: '冷静に情報を整理して共有したことで、対応の優先順位が決まりやすくなった。オダギリさんから「こんな感じで共有してもらえると動きやすいです」と言われた。[+10点]' },
    { text: 'とにかく急いで直そうとして、確認もせずにコードを変更してデプロイする', score: -5,
      result: '焦りが原因で別の箇所を壊してしまい、障害が二重になった。「落ち着いて状況を確認してから」と戸田さんにたしなめられた。[-5点]' },
    { text: '戸田さんに状況を共有しながら、一緒に原因を探る', score: 5,
      result: '二人で確認することで、一人では気づかなかった原因に早く気づけた。解決が早まり、オダギリさんへの影響も最小限で済んだ。[+5点]' },
    { text: '韮沢CTOに「障害が起きました」とだけ報告して、あとは自分で対応する', score: 0,
      result: '韮沢CTOから「了解〜、よろしく」とだけ返ってきた。報告はできたが、結局一人で抱えることになった。[±0点]' },
    { text: '「次のリリースで直せばいい」と判断して、対応を後回しにする', score: -10,
      result: '翌日もその障害が継続し、お客さんから複数の問い合わせが来ていた。オダギリさんが「今日もエラーが続いてます…」と困り果てていた。[-10点]' },
  ],
};

// 炎上イベント — ミッションの合間に発生する「あるある」割り込みイベント
const INCIDENT = {
  notice: '🔥炎上アラート🔥\n韮沢CTOからSlack。\n「あ、そういえば今週もう一個小さい機能\nリリースできる？お客さんに約束しちゃったから」',
  title: '🔥 リリース直後に「もう一個追加」、どう返す？',
  choices: [
    { text: '今の本番の安定状況を確認した上で「今週は現状の安定対応を優先させてください、来週以降なら対応できます」と伝える', score: 10,
      result: '状況を正直に伝えたことで、韮沢CTOが「そっか、じゃあ来週でいいよ」と了解してくれた。オダギリさんも「ちゃんと伝えてもらえて助かりました」と言った。[+10点]' },
    { text: 'また「できます」と言ってしまい、無理に今週中に対応しようとする', score: -5,
      result: '本番の安定対応を後回しにしたことで、小さな不具合が積み重なってしまった。[-5点]' },
    { text: '戸田さんに「これ、今週追加対応できそうですか？」と相談してから返事する', score: 5,
      result: '戸田さんが「今週は今の安定を優先した方がいい」と背中を押してくれた。自信を持って断ることができた。[+5点]' },
    { text: '「確認します」と返して時間を作るが、特に動かない', score: 0,
      result: '翌日また「で、どうなった？」と聞かれて、結局同じ状況に。[±0点]' },
    { text: '返事をせずに既読スルーする', score: -10,
      result: '韮沢CTOから「さっきのやつ、お願いしますって言ったじゃないですか？」というメッセージが来た。スルーが逆効果になった。[-10点]' },
  ] as Choice[],
};

const MISSION_LABEL = [
  'NPCに話しかけよう',
  '📋 引き継ぎ・運用準備しよう（自分の机へ）',
  '📋 完了！  戸田さんに話しかけよう',
  '🔧 本番障害に対応しよう（自分の机へ）',
  '🔧 全ミッション完了！',
];

type DialogState = 'closed' | 'typing' | 'waiting';
type ChoiceState  = 'hidden' | 'open' | 'result';

// ─────────────────────────────────────────────────────────────────────────────

export class HardChapter7Scene extends Phaser.Scene {
  private mapGfx!: Phaser.GameObjects.Graphics;
  private charGfx!: Phaser.GameObjects.Graphics;

  // dynamic canvas size (Phaser.Scale.RESIZE) — UI overlay is laid out against these
  private canvasW = 800;
  private canvasH = 600;

  private player!: { x: number; y: number };
  private playerSprite!: Phaser.GameObjects.Sprite;
  private npcSprites = new Map<string, Phaser.GameObjects.Image>();
  private facing: Facing = 'down';

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
  private missionKey: 'handover' | 'operate' | 'incident' | null = null;

  // 炎上イベント
  private incidentDone = false;

  // 難易度
  private diffLevel: Difficulty = 'normal';
  private diffCfg: DiffConfig = DIFFICULTY_CONFIG.normal;

  // chapter clear
  private chapterClearShown = false;

  // documents
  private docsSeen = new Set<string>();
  private docImageOpen = false;
  private activeDoc: ChapterDocument | null = null;
  private finalChoiceMade = false;
  private pendingDocId: string | null = null;

  // input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private key1!: Phaser.Input.Keyboard.Key;
  private key2!: Phaser.Input.Keyboard.Key;
  private key3!: Phaser.Input.Keyboard.Key;
  private key4!: Phaser.Input.Keyboard.Key;
  private key5!: Phaser.Input.Keyboard.Key;
  private keyZ!: Phaser.Input.Keyboard.Key;
  private virtualPad!: VirtualPad;

  // HUD
  private hudBg!: Phaser.GameObjects.Graphics;
  private hudTitle!: Phaser.GameObjects.Text;
  private hudMission!: Phaser.GameObjects.Text;
  private hudScore!: Phaser.GameObjects.Text;
  private missionLabel = MISSION_LABEL[0];

  // misc UI
  private proximityHint!: Phaser.GameObjects.Text;
  private noticeText!: Phaser.GameObjects.Text;
  private noticeTimer: Phaser.Time.TimerEvent | null = null;
  private hintBarBg!: Phaser.GameObjects.Graphics;
  private hintBarText!: Phaser.GameObjects.Text;

  // dialog UI
  private dlgBg!: Phaser.GameObjects.Graphics;
  private dlgName!: Phaser.GameObjects.Text;
  private dlgBody!: Phaser.GameObjects.Text;
  private dlgCue!: Phaser.GameObjects.Text;

  // choice UI
  private choiceGfx!: Phaser.GameObjects.Graphics;
  private choiceTitle!: Phaser.GameObjects.Text;
  private choiceOpts: Phaser.GameObjects.Text[] = [];
  private currentChoiceCount = 3;
  private resultText!: Phaser.GameObjects.Text;
  private resultCue!: Phaser.GameObjects.Text;

  // chapter clear UI
  private clearGfx!: Phaser.GameObjects.Graphics;
  private clearTitle!: Phaser.GameObjects.Text;
  private clearScore!: Phaser.GameObjects.Text;
  private clearNext!: Phaser.GameObjects.Text;

  constructor() { super({ key: 'HardChapter7Scene' }); }

  preload() {
    this.load.spritesheet('office', '/game-assets/Modern_Office_32x32.png', {
      frameWidth: 32, frameHeight: 32,
    });
    this.load.spritesheet('player-walk', '/game-assets/Adam_16x16.png', { frameWidth: 16, frameHeight: 32 });
    this.load.spritesheet('npc-nirasawa', '/game-assets/Bob_idle_16x16.png', { frameWidth: 16, frameHeight: 32 });
    this.load.spritesheet('npc-toda', '/game-assets/Alex_idle_16x16.png', { frameWidth: 16, frameHeight: 32 });
    this.load.spritesheet('npc-odagiri', '/game-assets/Amelia_idle_16x16.png', { frameWidth: 16, frameHeight: 32 });
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
    this.keyZ = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

    window.addEventListener('sier-doc-image-closed', this.onDocImageClosed);
    this.events.once('shutdown', () => window.removeEventListener('sier-doc-image-closed', this.onDocImageClosed));

    this.showNotice('本番リリース当日です。\nまずは机の上の資料を確認してみましょう。', 4500);
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

    const tableFrames = [[65, 66, 67], [81, 82, 83], [97, 98, 99]];
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        this.add.image((2 + j) * TILE + TILE / 2, (2 + i) * TILE + TILE / 2, 'office', tableFrames[i][j]);

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
    this.hudTitle = this.add.text(10, 5, '第7章　リリース・運用保守', { fontSize: '11px', color: '#7799aa', fontFamily: JP }).setScrollFactor(0).setResolution(2);
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
    const docsAllRead = DOCUMENTS.filter(d => d.required).every(d => this.docsSeen.has(d.id));
    if (this.finalChoiceMade && !docsAllRead) {
      this.missionLabel = '📄 室内の資料を全部確認しよう（残り' + DOCUMENTS.filter(d => d.required && !this.docsSeen.has(d.id)).length + '件）';
    } else {
      this.missionLabel = MISSION_LABEL[this.gameStep] ?? '';
    }
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
    if (npc.name === '韮沢CTO') {
      if (this.gameStep === 0) return npc.lines;
      if (this.gameStep === 1) return ['準備の方はどう？', '本番、楽しみにしてるよ〜', '机で進めといてね'];
      return ['リリース成功！ありがとう〜', 'また次のも一緒に頑張ろうね', 'よろしく！'];
    }
    if (npc.name === '戸田さん') {
      if (this.gameStep >= 2 && this.gameStep < 3) return npc.lines;
      if (this.gameStep >= 3) return ['障害対応、お疲れ様', '「直して、また走る」の繰り返しだけど', 'そのたびに少し強くなっていくものだよ'];
    }
    if (npc.name === 'オダギリさん') {
      if (this.gameStep >= 3) return ['色々とありがとうございます…！', 'なんとか落ち着いてきました', '次また何かあったら、また相談させてください'];
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

  private openDocDialog(doc: ChapterDocument) {
    this.proximityHint.setText('').setVisible(false);
    this.activeDoc = doc;
    this.activeNpc = null;
    this.activeLines = doc.dialog.split('\n\n');
    this.lineIdx = 0;
    this.dialogState = 'typing';
    this.startTyping();
  }

  private startTyping() {
    if (!this.activeNpc && !this.activeDoc) return;
    const line = this.activeLines[this.lineIdx];
    this.typedLen = 0;
    this.dlgBg.setVisible(true);
    this.dlgName.setText(this.activeDoc ? this.activeDoc.label : this.activeNpc!.name).setVisible(true);
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
    if (!this.activeNpc && !this.activeDoc) return;
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

    if (this.activeDoc) {
      const doc = this.activeDoc;
      this.activeDoc = null;
      window.dispatchEvent(new CustomEvent('sier-show-doc-image', {
        detail: { path: `/game-assets/${doc.imageKey}.png`, label: doc.imageLabel ?? doc.label },
      }));
      this.docImageOpen = true;
      this.pendingDocId = doc.id;
      return;
    }

    const npc = this.activeNpc;
    this.activeNpc = null;
    if (!npc) return;
    this.npcSprites.get(npc.name)?.setFrame(NPC_FRAME.down);
    if (npc.name === '韮沢CTO' && this.gameStep === 0) {
      this.gameStep = 1; this.updateHud();
      this.showNotice('ミッション受諾！\n📋 引き継ぎ・運用準備をしてください\n自分の机へ行こう', 3000);
    } else if (npc.name === '戸田さん' && this.gameStep === 2) {
      this.gameStep = 3; this.updateHud();
      this.showNotice('ミッション受諾！\n🔧 本番障害に対応してください\n自分の机へ行こう', 3000);
    }
  }

  // ── Documents ─────────────────────────────────────────────────

  private onDocImageClosed = () => {
    if (this.pendingDocId) { this.docsSeen.add(this.pendingDocId); this.pendingDocId = null; }
    this.docImageOpen = false;
    if (this.finalChoiceMade && DOCUMENTS.filter(d => d.required).every(d => this.docsSeen.has(d.id))) {
      this.showChapterClear();
    } else if (this.finalChoiceMade) {
      this.updateHud();
    }
  };

  private drawDocuments() {
    const { col: pc, row: pr } = this.playerTile();
    for (const doc of DOCUMENTS) {
      const x = doc.col * TILE, y = doc.row * TILE;
      this.charGfx.fillStyle(0xF5F0D0, 1); this.charGfx.fillRect(x + 5, y + 8, 12, 16);
      this.charGfx.fillStyle(0xC8C080, 0.7);
      this.charGfx.fillRect(x + 7, y + 11, 8, 1);
      this.charGfx.fillRect(x + 7, y + 13, 8, 1);
      this.charGfx.fillRect(x + 7, y + 15, 8, 1);
      this.charGfx.lineStyle(1, 0x886640, 0.9); this.charGfx.strokeRect(x + 5, y + 8, 12, 16);
      if (Math.abs(doc.col - pc) <= 1 && Math.abs(doc.row - pr) <= 1) {
        this.charGfx.fillStyle(0xFFDD00, 0.95); this.charGfx.fillCircle(x + 11, y + 4, 4);
        this.charGfx.fillStyle(0xFFFFAA, 1); this.charGfx.fillCircle(x + 11, y + 4, 2);
      }
    }
  }

  private getNearbyDocument(): ChapterDocument | null {
    const { col, row } = this.playerTile();
    return DOCUMENTS.find(d => Math.abs(d.col - col) <= 1 && Math.abs(d.row - row) <= 1) ?? null;
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
    for (let i = 0; i < 5; i++)
      this.choiceOpts[i].setFontSize(fontSize).setPosition(PX + 18, PY + 56 + i * optGap).setWordWrapWidth(PW - 40, true);
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

  private getChoices(key: 'handover' | 'operate' | 'incident'): Choice[] {
    return key === 'incident' ? INCIDENT.choices : CHOICES[key];
  }

  private openChoices(key: 'handover' | 'operate' | 'incident') {
    this.missionKey = key;
    this.choiceState = 'open';
    const title = key === 'handover' ? '📋 リリース前の引き継ぎ・運用準備、どうしますか？'
      : key === 'operate' ? '🔧 本番で障害が発生！どう対応しますか？'
      : INCIDENT.title;
    const choices = this.getChoices(key);
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
    const choices = this.getChoices(this.missionKey);
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
    if (missionKey === 'incident') { this.updateHud(); this.closeChoices(); return; }
    const next = missionKey === 'handover' ? 2 : 4;
    this.gameStep = next; this.updateHud(); this.closeChoices();
    if (next === 2) this.scheduleIncident();
    if (next === 4) {
      const unread = DOCUMENTS.filter(d => d.required).find(d => !this.docsSeen.has(d.id));
      if (unread) {
        this.finalChoiceMade = true;
        this.updateHud();
        this.showNotice(unread.blockedHint ?? '必要な資料を確認してから進もう。', 2800);
      } else {
        this.showChapterClear();
      }
    }
  }

  // ── 炎上イベント ──────────────────────────────────────────────

  private scheduleIncident() { this.time.delayedCall(1200, () => this.tryShowIncident()); }

  private tryShowIncident() {
    if (this.incidentDone || this.chapterClearShown) return;
    if (this.dialogState !== 'closed' || this.choiceState !== 'hidden') {
      this.time.delayedCall(600, () => this.tryShowIncident()); return;
    }
    this.incidentDone = true;
    this.showNotice(INCIDENT.notice, 2200);
    this.time.delayedCall(2200, () => this.tryOpenIncidentChoices());
  }

  private tryOpenIncidentChoices() {
    if (this.chapterClearShown) return;
    if (this.dialogState !== 'closed' || this.choiceState !== 'hidden') {
      this.time.delayedCall(600, () => this.tryOpenIncidentChoices()); return;
    }
    this.openChoices('incident');
  }

  private closeChoices() {
    this.choiceState = 'hidden'; this.missionKey = null;
    this.choiceGfx.setVisible(false); this.choiceTitle.setVisible(false);
    for (const o of this.choiceOpts) o.setVisible(false);
    this.resultText.setVisible(false); this.resultCue.setVisible(false);
    this.virtualPad.setChoiceButtonsVisible(0);
  }

  // ── Chapter clear (全7章エンディング) ─────────────────────────

  private buildChapterClear() {
    this.clearGfx = this.add.graphics().setDepth(50).setVisible(false).setScrollFactor(0);
    this.clearTitle = this.add.text(0, 0, '', {
      fontSize: '28px', color: '#ffdd66', fontFamily: JP, fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(51).setVisible(false).setScrollFactor(0).setResolution(2);
    this.clearScore = this.add.text(0, 0, '', {
      fontSize: '16px', color: '#ddeeff', fontFamily: JP, align: 'center',
    }).setOrigin(0.5).setDepth(51).setVisible(false).setScrollFactor(0).setResolution(2);
    this.clearNext = this.add.text(0, 0, '', {
      fontSize: '14px', color: '#88aacc', fontFamily: JP, align: 'center',
      backgroundColor: '#00000099', padding: { x: 12, y: 6 },
    }).setOrigin(0.5).setDepth(51).setVisible(false).setScrollFactor(0).setResolution(2);
    this.layoutChapterClear();
  }

  private layoutChapterClear() {
    const wrap = this.canvasW - 60;
    this.clearGfx.clear();
    this.clearGfx.fillStyle(0x000000, 0.88); this.clearGfx.fillRect(0, 0, this.canvasW, this.canvasH);
    this.clearTitle.setPosition(this.canvasW / 2, this.canvasH / 2 - 70).setWordWrapWidth(wrap, true);
    this.clearScore.setPosition(this.canvasW / 2, this.canvasH / 2 + 10).setWordWrapWidth(wrap, true);
    this.clearNext.setPosition(this.canvasW / 2, this.canvasH / 2 + 80).setWordWrapWidth(wrap, true);
  }

  private showChapterClear() {
    saveChapterScore('hard-chapter7', this.score);
    markChapterCleared('hard-chapter7');
    this.chapterClearShown = true;

    const total = getTotalScore('hard');
    const tier = getEndingTier(total);
    const ending = HARD_ENDINGS[tier];
    saveEarnedTitle(ending.title);

    this.clearGfx.setVisible(true);
    this.clearTitle.setText(`🏆 ${ending.title}`).setColor(ending.color).setVisible(true);
    this.clearScore.setText(
      `第7章「リリース・運用保守」クリア！　スコア：${this.score}点\n総合スコア：${total}点\n\n${ending.comment}`,
    ).setVisible(true);
    this.clearNext.setText(
      'Space：チャプター選択に戻る\nもう一度挑戦して、難易度を変えれば結果も変わるかも？',
    ).setVisible(true);
  }

  // ── Characters ────────────────────────────────────────────────

  private buildCharacterSprites() {
    (Object.keys(PLAYER_WALK_FRAMES) as Facing[]).forEach((dir) => {
      const key = `player-walk-${dir}`;
      if (!this.anims.exists(key)) {
        this.anims.create({
          key, frames: this.anims.generateFrameNumbers('player-walk', { frames: PLAYER_WALK_FRAMES[dir] }),
          frameRate: 8, repeat: -1,
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
    this.drawDocuments();
  }

  private updatePlayerAnimation() { this.playerSprite.play(`player-walk-${this.facing}`, true); }

  private faceNpcToPlayer(npc: NpcDef) {
    const sprite = this.npcSprites.get(npc.name);
    if (!sprite) return;
    const { col: playerCol, row: playerRow } = this.playerTile();
    const dx = playerCol - npc.col, dy = playerRow - npc.row;
    if (Math.abs(dx) > Math.abs(dy)) sprite.setFrame(dx > 0 ? NPC_FRAME.right : NPC_FRAME.left);
    else sprite.setFrame(dy > 0 ? NPC_FRAME.down : NPC_FRAME.up);
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

  private playerTile() { return { col: Math.floor(this.player.x / TILE), row: Math.floor(this.player.y / TILE) }; }

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
    this.canvasW = gameSize.width; this.canvasH = gameSize.height;
    this.layoutHud(); this.layoutProximityHint(); this.layoutNotice();
    this.layoutHintBar(); this.layoutDialogBox(); this.layoutChoicePanel();
    this.layoutChapterClear(); this.updateCamera();
  };

  // ── Update ────────────────────────────────────────────────────

  update(_t: number, delta: number) {
    this.virtualPad.setDpadVisible(
      !this.docImageOpen && !this.chapterClearShown &&
      this.choiceState === 'hidden' && this.dialogState === 'closed',
    );

    if (this.docImageOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.keyZ)) window.dispatchEvent(new CustomEvent('sier-doc-image-closed'));
      return;
    }

    if (this.choiceState !== 'open') this.virtualPad.getChoicePressed();

    if (this.chapterClearShown) {
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey) || this.virtualPad.isActionPressed())
        window.dispatchEvent(new CustomEvent('sier-chapter-cleared', { detail: { chapterId: 'hard-chapter7' } }));
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
    const nearbyDoc = this.getNearbyDocument();
    const missionActive = this.gameStep === 1 || this.gameStep === 3;
    const spaceJust = Phaser.Input.Keyboard.JustDown(this.spaceKey) || this.virtualPad.isActionPressed();

    if (spaceJust && nearby) { this.openDialog(nearby); return; }
    if (spaceJust && onDesk && missionActive) { this.openChoices(this.gameStep === 1 ? 'handover' : 'operate'); return; }
    if (spaceJust && nearbyDoc) { this.openDocDialog(nearbyDoc); return; }

    const hintText = nearby ? `【${nearby.name}】  Space で話しかける` :
      (onDesk && missionActive) ? '自分の机  Space で作業する' :
      nearbyDoc ? '📄 Space で資料を確認する' : '';
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
