/**
 * QuestCorebankScene — 「最終合意の夜」
 *
 * Ending routes:
 *   BEST       : branch3=進言
 *   BAD_NORECORD: branch3=しのぐ & branch2=議事録なし
 *   BAD_MELTDOWN: branch3=しのぐ & branch2=議事録あり
 */
import * as Phaser from 'phaser';
import {
  DIALOGUE_MAP,
  resolveEnding,
  DEFAULT_FLAGS,
  type QuestFlags,
  type DialogueNode,
  type EndingDef,
} from '../data/questCorebank';
import { sfx } from '../utils/audio';

const W  = 800;
const H  = 598;
const JP = '"Hiragino Kaku Gothic ProN","Hiragino Sans","Yu Gothic","Meiryo",Arial,sans-serif';

// Dialog box (bottom strip)
const BOX_X = 16;
const BOX_Y = 350;
const BOX_W = W - 32;
const BOX_H = 200;
const PAD   = 20;
const TW    = BOX_W - PAD * 2;   // text wrap width

// Speaker colors per name
const SPEAKER_COLORS: Record<string, string> = {
  'ナレーション':       '#aaaacc',
  'システム':           '#667788',
  'あなた':             '#88ddff',
  '黒田PM':             '#ffaa44',
  '佐々木（二次請け）': '#88ffaa',
  '高梨部長':           '#ffdd88',
  '中村営業':           '#ff8888',
};

type Phase =
  | 'typing'
  | 'waiting'
  | 'choices'
  | 'ending_text'
  | 'ending_learn'
  | 'done';

export class QuestCorebankScene extends Phaser.Scene {
  private flags: QuestFlags = { warnedEarly: false, gijirokuKept: false, escalatedUp: false, proposedStop: false, trust: 0 };
  private node!: DialogueNode;
  private phase: Phase = 'typing';

  private fullText  = '';
  private charIndex = 0;
  private typeTimer: Phaser.Time.TimerEvent | null = null;
  private typeOnComplete: (() => void) | null = null;

  private bg!: Phaser.GameObjects.Graphics;
  private boxGfx!: Phaser.GameObjects.Graphics;
  private speakerBadge!: Phaser.GameObjects.Text;
  private bodyText!: Phaser.GameObjects.Text;
  private nextHint!: Phaser.GameObjects.Text;
  private choiceObjs: Phaser.GameObjects.Text[] = [];
  private selectedChoice = 0;

  // For ending screen
  private endingGfx!: Phaser.GameObjects.Graphics;
  private endingTitle!: Phaser.GameObjects.Text;
  private endingBody!: Phaser.GameObjects.Text;
  private learnBox!: Phaser.GameObjects.Graphics;
  private learnLabel!: Phaser.GameObjects.Text;
  private learnText!: Phaser.GameObjects.Text;
  private backBtn!: Phaser.GameObjects.Text;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private zKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private upKey!: Phaser.Input.Keyboard.Key;
  private downKey!: Phaser.Input.Keyboard.Key;
  private inputCooldown = 0;

  constructor() { super({ key: 'QuestCorebankScene' }); }

  init() {
    this.flags = { warnedEarly: false, gijirokuKept: false, escalatedUp: false, proposedStop: false, trust: 0 };
    this.phase = 'typing';
    this.charIndex = 0;
    this.fullText = '';
    this.typeOnComplete = null;
    this.inputCooldown = 300;
    this.selectedChoice = 0;
    this.choiceObjs = [];
  }

  // ── create ────────────────────────────────────────────────────────

  create() {
    // Background gradient
    this.bg = this.add.graphics();
    this.bg.fillGradientStyle(0x050d18, 0x050d18, 0x0a1528, 0x0a1528, 1);
    this.bg.fillRect(0, 0, W, H);

    // Subtle grid lines
    this.bg.lineStyle(1, 0x112233, 0.3);
    for (let x = 0; x < W; x += 40) this.bg.lineBetween(x, 0, x, H);
    for (let y = 0; y < H; y += 40) this.bg.lineBetween(0, y, W, y);

    // Title strip at top
    this.bg.fillStyle(0x0a1c30, 0.95);
    this.bg.fillRect(0, 0, W, 54);
    this.bg.lineStyle(1, 0x1a4a7a, 1);
    this.bg.strokeRect(0, 0, W, 54);

    this.add.text(W / 2, 12, '特別クエスト：最終合意の夜', {
      fontSize: '11px',
      color: '#3a6a8a',
      fontFamily: JP,
      letterSpacing: 3,
    }).setOrigin(0.5, 0);

    this.add.text(W / 2, 28, 'The Final Agreement', {
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#88aacc',
      fontFamily: JP,
    }).setOrigin(0.5, 0);

    // Dialog box
    this.boxGfx = this.add.graphics();
    this.drawDialogBox();

    // Speaker badge
    this.speakerBadge = this.add.text(BOX_X + PAD, BOX_Y - 28, '', {
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#e0eeff',
      fontFamily: JP,
    }).setDepth(3);

    // Body text
    this.bodyText = this.add.text(BOX_X + PAD, BOX_Y + PAD, '', {
      fontSize: '15px',
      color: '#d8e8f8',
      wordWrap: { width: TW, useAdvancedWrap: true },
      lineSpacing: 8,
      fontFamily: JP,
      fixedWidth: TW,
    }).setDepth(3);

    // "▼ 次へ" indicator
    this.nextHint = this.add
      .text(BOX_X + BOX_W - PAD, BOX_Y + BOX_H - 10, '', {
        fontSize: '13px',
        color: '#4a8aaa',
        fontFamily: JP,
      })
      .setOrigin(1, 1)
      .setDepth(3);

    // Ending layer (hidden until needed)
    this.endingGfx   = this.add.graphics().setDepth(10).setVisible(false);
    this.endingTitle = this.add.text(W / 2, 80, '', {
      fontSize: '22px', fontStyle: 'bold', color: '#ffffff',
      fontFamily: JP, align: 'center',
    }).setOrigin(0.5, 0).setDepth(11).setVisible(false);

    this.endingBody = this.add.text(W / 2, 140, '', {
      fontSize: '14px', color: '#c8ddf0',
      fontFamily: JP, align: 'left',
      wordWrap: { width: 700, useAdvancedWrap: true }, lineSpacing: 8,
    }).setOrigin(0.5, 0).setDepth(11).setVisible(false);

    this.learnBox   = this.add.graphics().setDepth(11).setVisible(false);
    this.learnLabel = this.add.text(60, 0, '📚  学び', {
      fontSize: '13px', fontStyle: 'bold', color: '#88ffcc', fontFamily: JP,
    }).setDepth(12).setVisible(false);
    this.learnText  = this.add.text(60, 0, '', {
      fontSize: '14px', color: '#d0f8e0', fontFamily: JP,
      wordWrap: { width: 680, useAdvancedWrap: true }, lineSpacing: 8,
    }).setDepth(12).setVisible(false);

    this.backBtn = this.add.text(W / 2, 0, 'タイトルに戻る  →', {
      fontSize: '15px', fontStyle: 'bold', color: '#88aacc',
      fontFamily: JP,
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5, 0).setDepth(12).setVisible(false)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.backBtn.setColor('#ffffff'))
      .on('pointerout',  () => this.backBtn.setColor('#88aacc'))
      .on('pointerdown', () => this.exitQuest());

    // Input
    this.cursors  = this.input.keyboard!.createCursorKeys();
    this.zKey     = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.upKey    = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey  = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

    this.input.on('pointerdown', () => {
      if (this.inputCooldown > 0) return;
      if (this.phase === 'choices') return;
      if (this.phase === 'done') { this.exitQuest(); return; }
      this.handleConfirm();
    });

    this.gotoNode('disclaimer');
  }

  // ── Dialog box drawing ────────────────────────────────────────────

  private drawDialogBox(highlight = false) {
    this.boxGfx.clear();
    this.boxGfx.fillStyle(0x071320, 0.97);
    this.boxGfx.fillRoundedRect(BOX_X, BOX_Y, BOX_W, BOX_H, 10);
    this.boxGfx.lineStyle(1.5, highlight ? 0x4a9aff : 0x1a3a5a, 1);
    this.boxGfx.strokeRoundedRect(BOX_X, BOX_Y, BOX_W, BOX_H, 10);
  }

  // ── Typewriter ────────────────────────────────────────────────────

  private startTypewriter(text: string, onComplete: () => void) {
    this.fullText = text;
    this.charIndex = 0;
    this.typeOnComplete = onComplete;
    this.bodyText.setText('');
    if (this.typeTimer) { this.typeTimer.destroy(); this.typeTimer = null; }

    this.typeTimer = this.time.addEvent({
      delay: 24,
      callback: () => {
        this.charIndex++;
        this.bodyText.setText(this.fullText.substring(0, this.charIndex));
        if (this.charIndex % 4 === 0) sfx.typeChar();
        if (this.charIndex >= this.fullText.length) {
          this.typeTimer?.destroy();
          this.typeTimer = null;
          const cb = this.typeOnComplete;
          this.typeOnComplete = null;
          cb?.();
        }
      },
      loop: true,
    });
  }

  private skipTypewriter() {
    if (this.typeTimer) { this.typeTimer.destroy(); this.typeTimer = null; }
    this.bodyText.setText(this.fullText);
    this.charIndex = this.fullText.length;
    const cb = this.typeOnComplete;
    this.typeOnComplete = null;
    cb?.();
  }

  // ── Node navigation ───────────────────────────────────────────────

  private gotoNode(id: string) {
    this.clearChoices();
    this.node = DIALOGUE_MAP[id];
    if (!this.node) { console.error(`[QuestCorebank] unknown node: ${id}`); return; }

    if (this.node.isEndingGate) {
      this.showEnding(resolveEnding(this.flags));
      return;
    }

    const color = SPEAKER_COLORS[this.node.speaker] ?? '#aabbcc';
    this.speakerBadge.setText(`【${this.node.speaker}】`).setColor(color);
    this.nextHint.setText('');
    this.drawDialogBox();

    this.phase = 'typing';
    this.startTypewriter(this.node.text, () => {
      if (this.node.choices?.length) {
        this.phase = 'choices';
        this.selectedChoice = 0;
        this.renderChoices();
      } else {
        this.phase = 'waiting';
        this.nextHint.setText('▼ Zキー / タップで次へ');
        this.tweens.add({
          targets: this.nextHint,
          alpha: { from: 1, to: 0.3 },
          yoyo: true, loop: -1, duration: 600,
        });
      }
    });
  }

  // ── Choices ───────────────────────────────────────────────────────

  private renderChoices() {
    this.clearChoices();
    const choices = this.node.choices!;
    const ROW_H = 50;
    const GAP   = 5;
    const n     = choices.length;

    // Total choice area height
    const choiceAreaH = n * ROW_H + (n - 1) * GAP;
    const choiceTop   = BOX_Y - GAP - choiceAreaH;
    const labelY      = choiceTop - 28;
    const bgY         = labelY - 6;

    // Background box
    this.boxGfx.clear();
    this.boxGfx.fillStyle(0x071320, 0.97);
    this.boxGfx.fillRoundedRect(BOX_X, bgY, BOX_W, BOX_Y - bgY, 10);
    this.boxGfx.lineStyle(1.5, 0x1a3a5a, 1);
    this.boxGfx.strokeRoundedRect(BOX_X, bgY, BOX_W, BOX_Y - bgY, 10);

    // Label
    const labelTxt = this.add.text(BOX_X + PAD, labelY, '▼  どう対応しますか？', {
      fontSize: '13px', color: '#4a8aaa', fontFamily: JP,
    }).setDepth(5);
    this.choiceObjs.push(labelTxt);

    choices.forEach((choice, i) => {
      const y   = choiceTop + i * (ROW_H + GAP);
      const sel = i === this.selectedChoice;
      const txt = this.add.text(BOX_X + PAD, y, (sel ? '►  ' : '    ') + choice.label, {
        fontSize: '13px',
        color: sel ? '#ffff66' : '#8899aa',
        wordWrap: { width: TW - 24, useAdvancedWrap: true },
        fontFamily: JP,
        backgroundColor: sel ? '#1a3560' : '#0a1828',
        padding: { x: 10, y: 8 },
        lineSpacing: 3,
        fixedWidth: TW,
        fixedHeight: ROW_H,
      }).setDepth(5);

      txt.setInteractive({ useHandCursor: true });
      txt.on('pointerover', () => {
        if (this.selectedChoice !== i) { this.selectedChoice = i; this.updateChoiceHighlight(); }
      });
      txt.on('pointerdown', () => {
        this.inputCooldown = 300;
        this.selectedChoice = i;
        this.confirmChoice();
      });

      this.choiceObjs.push(txt);
    });
  }

  private updateChoiceHighlight() {
    const choices = this.node.choices!;
    // index 0 = label, choices start at 1
    this.choiceObjs.slice(1).forEach((t, i) => {
      const sel = i === this.selectedChoice;
      t.setColor(sel ? '#ffff66' : '#8899aa');
      t.setBackgroundColor(sel ? '#1a3560' : '#0a1828');
      t.setText((sel ? '►  ' : '    ') + choices[i].label);
    });
  }

  private confirmChoice() {
    const choice = this.node.choices![this.selectedChoice];
    // Apply flags
    const fx = choice.setFlags;
    if (fx.warnedEarly  !== undefined) this.flags.warnedEarly  = fx.warnedEarly;
    if (fx.gijirokuKept !== undefined) this.flags.gijirokuKept = fx.gijirokuKept;
    if (fx.escalatedUp  !== undefined) this.flags.escalatedUp  = fx.escalatedUp;
    if (fx.proposedStop !== undefined) this.flags.proposedStop = fx.proposedStop;
    if (fx.trust        !== undefined) this.flags.trust        += fx.trust;
    sfx.select();
    this.phase = 'typing';
    this.clearChoices();
    this.drawDialogBox();
    this.nextHint.setText('');
    this.gotoNode(choice.next);
  }

  private clearChoices() {
    this.choiceObjs.forEach((t) => t.destroy());
    this.choiceObjs = [];
    this.tweens.killTweensOf(this.nextHint);
    this.nextHint.setAlpha(1).setText('');
  }

  // ── Confirm / advance ─────────────────────────────────────────────

  private handleConfirm() {
    if (this.phase === 'typing') {
      this.skipTypewriter();
      return;
    }
    if (this.phase === 'waiting') {
      sfx.select();
      this.inputCooldown = 200;
      this.gotoNode(this.node.next!);
      return;
    }
    if (this.phase === 'choices') {
      this.confirmChoice();
      return;
    }
    if (this.phase === 'ending_text') {
      this.skipTypewriter();
      return;
    }
    if (this.phase === 'ending_learn') {
      this.exitQuest();
      return;
    }
  }

  // ── Ending screen ─────────────────────────────────────────────────

  private showEnding(ending: EndingDef) {
    this.clearChoices();
    // Hide dialog layer
    this.boxGfx.clear();
    this.speakerBadge.setVisible(false);
    this.bodyText.setVisible(false);
    this.nextHint.setVisible(false);

    const isGood = ending.type === 'good';
    const isBest = ending.type === 'best';
    const bgColor     = isBest ? 0x071a0d : isGood ? 0x0d1a07 : 0x1a0707;
    const borderColor = isBest ? 0x2e7a44 : isGood ? 0x5a9a2a : 0x7a2222;
    const titleColor  = isBest ? '#88ffaa' : isGood ? '#ccff88' : '#ff8888';

    // Full-screen ending background
    this.endingGfx.setVisible(true);
    this.endingGfx.fillStyle(bgColor, 0.98);
    this.endingGfx.fillRect(0, 0, W, H);
    this.endingGfx.lineStyle(2, borderColor, 0.8);
    this.endingGfx.strokeRect(10, 10, W - 20, H - 20);

    // Title
    this.endingTitle
      .setText(ending.title)
      .setColor(titleColor)
      .setVisible(true);

    // Body text — typewriter
    this.endingBody.setVisible(true);
    this.phase = 'ending_text';

    const self = this;
    this.fullText = ending.text;
    this.charIndex = 0;
    this.bodyText.setVisible(false); // use endingBody instead
    this.endingBody.setText('');

    if (this.typeTimer) { this.typeTimer.destroy(); this.typeTimer = null; }
    this.typeTimer = this.time.addEvent({
      delay: 20,
      callback: () => {
        self.charIndex++;
        self.endingBody.setText(self.fullText.substring(0, self.charIndex));
        if (self.charIndex >= self.fullText.length) {
          self.typeTimer?.destroy();
          self.typeTimer = null;
          self.showLearnSection(ending);
        }
      },
      loop: true,
    });
  }

  private showLearnSection(ending: EndingDef) {
    this.phase = 'ending_learn';
    // Position learn box below body text
    const bodyBottom = this.endingBody.y + this.endingBody.height + 20;
    const learnBoxY  = Math.min(bodyBottom, H - 190);
    const learnH     = 120;

    this.learnBox.setVisible(true);
    this.learnBox.fillStyle(0x0d2810, 0.95);
    this.learnBox.fillRoundedRect(40, learnBoxY, W - 80, learnH, 8);
    this.learnBox.lineStyle(2, 0x2e7a44, 0.9);
    this.learnBox.strokeRoundedRect(40, learnBoxY, W - 80, learnH, 8);

    this.learnLabel.setPosition(60, learnBoxY + 12).setVisible(true);
    this.learnText
      .setPosition(60, learnBoxY + 34)
      .setText(ending.learn)
      .setVisible(true);

    this.backBtn.setPosition(W / 2, learnBoxY + learnH + 16).setVisible(true);

    this.nextHint
      .setVisible(true)
      .setText('▼ Zキー / タップでタイトルへ')
      .setAlpha(1);
    this.tweens.add({
      targets: this.nextHint,
      alpha: { from: 1, to: 0.3 }, yoyo: true, loop: -1, duration: 700,
    });

    sfx.confirm();
  }

  // ── Exit ──────────────────────────────────────────────────────────

  private exitQuest() {
    this.phase = 'done';
    window.dispatchEvent(new CustomEvent('sier-quest-done'));
  }

  // ── Update / input ────────────────────────────────────────────────

  update(_t: number, delta: number) {
    this.inputCooldown = Math.max(0, this.inputCooldown - delta);
    if (this.inputCooldown > 0) return;

    if (this.phase === 'choices') {
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.upKey)) {
        this.selectedChoice = (this.selectedChoice - 1 + this.node.choices!.length) % this.node.choices!.length;
        this.updateChoiceHighlight();
        sfx.step();
        this.inputCooldown = 120;
        return;
      }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.down) || Phaser.Input.Keyboard.JustDown(this.downKey)) {
        this.selectedChoice = (this.selectedChoice + 1) % this.node.choices!.length;
        this.updateChoiceHighlight();
        sfx.step();
        this.inputCooldown = 120;
        return;
      }
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.zKey) ||
      Phaser.Input.Keyboard.JustDown(this.enterKey) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.space)
    ) {
      this.inputCooldown = 200;
      this.handleConfirm();
    }
  }

  shutdown() {
    if (this.typeTimer) { this.typeTimer.destroy(); this.typeTimer = null; }
    this.typeOnComplete = null;
    this.clearChoices();
  }
}
