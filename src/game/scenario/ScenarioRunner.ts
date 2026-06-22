/**
 * ScenarioRunner — 章ごとのシナリオ進行を管理する共通クラス
 *
 * 責務:
 *   - localStorage からのシナリオ状態読み込み / 保存
 *   - chapterId に応じたイベントリスト管理 (条件分岐・再計算含む)
 *   - 選択肢適用 (score / flags / npcTrust / metrics 更新)
 *   - Phaser オーバーレイ UI の構築・レイアウト・表示制御
 *   - キーボード / VirtualPad 入力処理
 *   - 全イベント完了時のコールバック呼び出し
 *
 * Scene 側の責務:
 *   - ScenarioRunner の生成とコールバックの実装
 *   - update() で runner.update() を呼ぶ
 *   - resize 時に runner.resize() を呼ぶ
 *   - onChapterComplete で markChapterCleared / saveChapterScore / showChapterClear を実行
 */

import * as Phaser from 'phaser';
import type { ChapterId, ScenarioState, ScenarioEvent, ScenarioChoice } from './types';
import type { DiffConfig } from '../difficulty';
import { getScenarioEventsForChapter, applyScenarioChoice } from './scenarioEffects';
import { loadScenarioState, saveScenarioState } from './scenarioStorage';
import type { VirtualPad } from '../VirtualPad';

const JP =
  '"Hiragino Kaku Gothic ProN","Hiragino Sans","Yu Gothic","Meiryo",Arial,sans-serif';

export interface ScenarioRunnerOptions {
  scene: Phaser.Scene;
  chapterId: ChapterId;
  /** 難易度設定 (showHints / bonusMult / penaltyMult) */
  diffCfg: DiffConfig;
  virtualPad: VirtualPad;
  /**
   * 選択肢決定時に呼ぶ。
   * delta = 難易度倍率適用済みのスコア増減 → Scene 側で this.score に加算すること。
   * ScenarioState.totalScore には倍率なしの生スコアが別途保存される (エンディング計算用)。
   */
  onScoreDelta: (delta: number) => void;
  /**
   * HUD の mission ラベルとスコアの更新を Scene に委譲する。
   * showEvent / handleChoice の都度呼ばれる。
   */
  onLabelChange: (label: string) => void;
  /**
   * 全イベント完了時コールバック。
   * Scene 側で markChapterCleared / saveChapterScore / showChapterClear を呼ぶ。
   */
  onChapterComplete: () => void;
}

export class ScenarioRunner {
  private readonly scene: Phaser.Scene;
  private readonly chapterId: ChapterId;
  private readonly diffCfg: DiffConfig;
  private readonly virtualPad: VirtualPad;
  private readonly cbScoreDelta: (d: number) => void;
  private readonly cbLabelChange: (label: string) => void;
  private readonly cbChapterComplete: () => void;

  // ── State ────────────────────────────────────────────────────
  private state!: ScenarioState;
  private events: ScenarioEvent[] = [];
  private idx = 0;
  private active = false;
  private phase: 'event' | 'result' = 'event';
  private choiceCount = 0;

  // ── Keyboard refs (registered on scene, independent of Scene's own keys) ─
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private key1!: Phaser.Input.Keyboard.Key;
  private key2!: Phaser.Input.Keyboard.Key;
  private key3!: Phaser.Input.Keyboard.Key;
  private key4!: Phaser.Input.Keyboard.Key;
  private key5!: Phaser.Input.Keyboard.Key;

  // ── Overlay UI (Phaser objects, depth 40/41) ─────────────────
  private ovlGfx!: Phaser.GameObjects.Graphics;
  private ovlIdBadge!: Phaser.GameObjects.Text;
  private ovlSlotBadge!: Phaser.GameObjects.Text;
  private ovlTitle!: Phaser.GameObjects.Text;
  private ovlBody!: Phaser.GameObjects.Text;
  private ovlChoices: Phaser.GameObjects.Text[] = [];
  private ovlResult!: Phaser.GameObjects.Text;
  private ovlExplain!: Phaser.GameObjects.Text;
  private ovlCue!: Phaser.GameObjects.Text;

  get isActive(): boolean {
    return this.active;
  }

  constructor(opts: ScenarioRunnerOptions) {
    this.scene = opts.scene;
    this.chapterId = opts.chapterId;
    this.diffCfg = opts.diffCfg;
    this.virtualPad = opts.virtualPad;
    this.cbScoreDelta = opts.onScoreDelta;
    this.cbLabelChange = opts.onLabelChange;
    this.cbChapterComplete = opts.onChapterComplete;

    this.buildOverlay();
  }

  // ── Public API ───────────────────────────────────────────────

  /**
   * localStorage から状態を読み込み、最初の未完了イベントを表示する。
   * 全イベント完了済み (リプレイ) の場合は false を返し、何も表示しない。
   * Scene 側は false なら showChapterClearUiOnly() などを呼ぶこと。
   */
  init(): boolean {
    this.state = loadScenarioState();
    this.events = getScenarioEventsForChapter(this.chapterId, this.state);

    const firstPending = this.events.findIndex(
      (e) => !this.state.clearedEventIds.includes(e.id)
    );

    if (firstPending === -1) {
      // 全イベント完了済み — Scene 側に処理を委ねる
      return false;
    }

    this.idx = firstPending;
    this.active = true;
    this.showEvent();
    return true;
  }

  /**
   * リプレイ時に chapter score 表示へ使う保存済み生スコアを返す。
   * init() 呼び出し後に有効。
   */
  getSavedTotalScore(): number {
    return this.state?.totalScore ?? 0;
  }

  /** Phaser の update() ループから毎フレーム呼び出す */
  update(): void {
    if (!this.active) return;
    const ev = this.events[this.idx];
    if (!ev) return;

    const spaceJust =
      Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
      this.virtualPad.isActionPressed();

    if (this.phase === 'result' || ev.choices.length === 0) {
      this.virtualPad.getChoicePressed(); // 誤操作を破棄
      if (spaceJust) this.advance();
      return;
    }

    // 選択肢フェーズ
    const pad = this.virtualPad.getChoicePressed();
    if      (Phaser.Input.Keyboard.JustDown(this.key1) || pad === 1) this.handleChoice(0);
    else if (Phaser.Input.Keyboard.JustDown(this.key2) || pad === 2) this.handleChoice(1);
    else if (Phaser.Input.Keyboard.JustDown(this.key3) || pad === 3) this.handleChoice(2);
    else if (Phaser.Input.Keyboard.JustDown(this.key4) || pad === 4) this.handleChoice(3);
    else if (Phaser.Input.Keyboard.JustDown(this.key5) || pad === 5) this.handleChoice(4);
  }

  /** キャンバスリサイズ時に onResize から呼び出す */
  resize(_w: number, _h: number): void {
    this.layoutOverlay();
  }

  /** Scene シャットダウン時に呼ぶ (Phaser オブジェクトを明示的に破棄) */
  destroy(): void {
    [
      this.ovlGfx, this.ovlIdBadge, this.ovlSlotBadge,
      this.ovlTitle, this.ovlBody, this.ovlResult,
      this.ovlExplain, this.ovlCue, ...this.ovlChoices,
    ].forEach((o) => o.destroy());
  }

  // ── Overlay build ────────────────────────────────────────────

  private buildOverlay(): void {
    const D = 40;
    const K = Phaser.Input.Keyboard.KeyCodes;
    const kb = this.scene.input.keyboard!;
    // Scene 自身が登録済みのキーと独立した参照を追加
    this.spaceKey = kb.addKey(K.SPACE);
    this.key1     = kb.addKey(K.ONE);
    this.key2     = kb.addKey(K.TWO);
    this.key3     = kb.addKey(K.THREE);
    this.key4     = kb.addKey(K.FOUR);
    this.key5     = kb.addKey(K.FIVE);

    this.ovlGfx = this.scene.add
      .graphics()
      .setDepth(D)
      .setScrollFactor(0)
      .setVisible(false);

    // タップで「次へ」: result フェーズ or 選択肢なしの場合にバックドロップをタップすると進む
    this.ovlGfx.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 4000, 4000),
      Phaser.Geom.Rectangle.Contains,
    );
    this.ovlGfx.on('pointerdown', () => {
      if (!this.active) return;
      const ev = this.events[this.idx];
      if (!ev) return;
      if (this.phase === 'result' || ev.choices.length === 0) this.advance();
    });

    const base = { fontSize: '11px', fontFamily: 'monospace', padding: { x: 6, y: 3 } };
    this.ovlIdBadge = this.scene.add
      .text(0, 0, '', { ...base, color: '#8899aa', backgroundColor: '#1a2a3a' })
      .setDepth(D + 1).setScrollFactor(0).setVisible(false).setResolution(2);
    this.ovlSlotBadge = this.scene.add
      .text(0, 0, '', { ...base, color: '#aabb88', backgroundColor: '#1a281a' })
      .setDepth(D + 1).setScrollFactor(0).setVisible(false).setResolution(2);

    this.ovlTitle = this.scene.add
      .text(0, 0, '', {
        fontSize: '17px', color: '#ffdd88', fontFamily: JP, fontStyle: 'bold',
        wordWrap: { width: 540 },
      })
      .setDepth(D + 1).setScrollFactor(0).setVisible(false).setResolution(2);

    this.ovlBody = this.scene.add
      .text(0, 0, '', {
        fontSize: '14px', color: '#ccddf0', fontFamily: JP,
        lineSpacing: 4, wordWrap: { width: 540 },
      })
      .setDepth(D + 1).setScrollFactor(0).setVisible(false).setResolution(2);

    for (let i = 0; i < 5; i++) {
      this.ovlChoices.push(
        this.scene.add
          .text(0, 0, '', {
            fontSize: '14px', color: '#ddeeff', fontFamily: JP,
            backgroundColor: '#0a1a2a', padding: { x: 10, y: 6 },
            wordWrap: { width: 520 },
          })
          .setDepth(D + 1).setScrollFactor(0).setVisible(false).setResolution(2)
      );
    }

    this.ovlResult = this.scene.add
      .text(0, 0, '', {
        fontSize: '14px', color: '#88ffaa', fontFamily: JP, fontStyle: 'bold',
        wordWrap: { width: 540 },
      })
      .setDepth(D + 1).setScrollFactor(0).setVisible(false).setResolution(2);

    this.ovlExplain = this.scene.add
      .text(0, 0, '', {
        fontSize: '13px', color: '#aabbcc', fontFamily: JP,
        lineSpacing: 3, wordWrap: { width: 540 },
      })
      .setDepth(D + 1).setScrollFactor(0).setVisible(false).setResolution(2);

    this.ovlCue = this.scene.add
      .text(0, 0, '', { fontSize: '12px', color: '#556677', fontFamily: 'monospace' })
      .setOrigin(1, 1)
      .setDepth(D + 1).setScrollFactor(0).setVisible(false).setResolution(2);
  }

  // ── Overlay layout ───────────────────────────────────────────

  private layoutOverlay(): void {
    if (!this.active) return;

    const w = this.scene.scale.width;
    const h = this.scene.scale.height;
    const PW = Math.min(580, w - 40);
    const PAD = 18;
    const bodyWrap = PW - PAD * 2;
    const small = w < 500;
    // HUD の高さ (compact: 46px / normal: 26px)
    const hudH = w < 560 ? 46 : 26;

    this.ovlTitle.setFontSize(small ? '15px' : '17px').setWordWrapWidth(bodyWrap);
    this.ovlBody.setFontSize(small ? '12px' : '14px').setWordWrapWidth(bodyWrap);
    this.ovlResult.setFontSize(small ? '12px' : '14px').setWordWrapWidth(bodyWrap);
    this.ovlExplain.setFontSize(small ? '11px' : '13px').setWordWrapWidth(bodyWrap);
    for (const c of this.ovlChoices) {
      c.setFontSize(small ? '12px' : '14px').setWordWrapWidth(bodyWrap - 20);
    }

    // コンテンツ高さを計測
    let contentH = 40; // badges 行
    contentH += 10 + (this.ovlTitle.height || 24);
    contentH += 10 + (this.ovlBody.height || 48);
    if (this.phase === 'event') {
      for (let i = 0; i < this.choiceCount; i++) {
        if (this.ovlChoices[i]?.visible) contentH += 8 + (this.ovlChoices[i].height || 34);
      }
    } else {
      if (this.ovlResult.visible)  contentH += 10 + (this.ovlResult.height || 28);
      if (this.ovlExplain.visible) contentH += 8  + (this.ovlExplain.height || 48);
    }
    contentH += 28; // cue + 下余白

    // HUD 下から下端 20px 手前を利用可能エリアとする
    const topEdge = hudH + 8;
    const availH  = h - topEdge - 20;
    const PH = Math.min(Math.max(contentH + PAD * 2, 180), availH);
    const PX = (w - PW) / 2;
    const PY = topEdge + (availH - PH) / 2;

    // バックドロップ (HUD より下のみ暗くして HUD は透過)
    this.ovlGfx.clear();
    this.ovlGfx.fillStyle(0x000000, 0.82);
    this.ovlGfx.fillRect(0, hudH, w, h - hudH);
    this.ovlGfx.fillStyle(0x0c1824, 1);
    this.ovlGfx.fillRoundedRect(PX, PY, PW, PH, 10);
    this.ovlGfx.lineStyle(2, 0x2a4466, 1);
    this.ovlGfx.strokeRoundedRect(PX, PY, PW, PH, 10);

    // 要素の縦位置を順に計算
    let y = PY + PAD;
    this.ovlIdBadge.setPosition(PX + PAD, y);
    this.ovlSlotBadge.setPosition(PX + PAD + this.ovlIdBadge.width + 8, y);
    y += 36;

    this.ovlTitle.setPosition(PX + PAD, y);
    y += (this.ovlTitle.height || 22) + 10;

    this.ovlBody.setPosition(PX + PAD, y);
    y += (this.ovlBody.height || 48) + 14;

    if (this.phase === 'event') {
      for (let i = 0; i < 5; i++) {
        if (this.ovlChoices[i]?.visible) {
          this.ovlChoices[i].setPosition(PX + PAD, y);
          y += (this.ovlChoices[i].height || 34) + 8;
        }
      }
    }
    if (this.ovlResult.visible) {
      this.ovlResult.setPosition(PX + PAD, y);
      y += (this.ovlResult.height || 28) + 8;
    }
    if (this.ovlExplain.visible) {
      this.ovlExplain.setPosition(PX + PAD, y);
    }
    this.ovlCue.setPosition(PX + PW - PAD, PY + PH - 10);
  }

  // ── Event display ────────────────────────────────────────────

  private showEvent(): void {
    if (this.idx >= this.events.length) { this.complete(); return; }
    const ev = this.events[this.idx];
    this.phase = 'event';
    this.choiceCount = ev.choices.length;

    this.ovlIdBadge.setText(ev.id);
    this.ovlSlotBadge.setText(ev.slot);
    this.ovlTitle.setText(ev.title);

    const body = ev.reviewNote ? ev.body + '\n\n' + ev.reviewNote : ev.body;
    this.ovlBody.setText(body);

    // easy モードは最高得点選択肢に 💡 ヒント
    const maxDelta = ev.choices.length > 0
      ? Math.max(...ev.choices.map((c) => c.effect.scoreDelta))
      : 0;
    for (let i = 0; i < 5; i++) {
      if (i < ev.choices.length) {
        const ch = ev.choices[i];
        const hint = this.diffCfg.showHints && ch.effect.scoreDelta === maxDelta ? '  💡' : '';
        this.ovlChoices[i].setText(`[${i + 1}]  ${ch.text}${hint}`).setVisible(true);
      } else {
        this.ovlChoices[i].setVisible(false);
      }
    }

    this.ovlResult.setVisible(false);
    this.ovlExplain.setVisible(false);
    this.ovlCue.setText(
      ev.choices.length === 0
        ? '次へ ▶  [Space / タップ]'
        : `[1]〜[${ev.choices.length}] またはボタンで選択`,
    );

    [this.ovlGfx, this.ovlIdBadge, this.ovlSlotBadge,
     this.ovlTitle, this.ovlBody, this.ovlCue]
      .forEach((o) => o.setVisible(true));

    this.layoutOverlay();
    this.cbLabelChange(`📖 ${ev.id}  ${ev.title}`);
    this.virtualPad.setChoiceButtonsVisible(ev.choices.length);
  }

  // ── Choice handling ──────────────────────────────────────────

  private handleChoice(idx: number): void {
    const ev = this.events[this.idx];
    if (!ev || idx >= ev.choices.length) return;

    const choice = ev.choices[idx];

    // スコア設計:
    //   cbScoreDelta に渡す値 = 難易度倍率適用済み → Scene 側の this.score / saveChapterScore 用
    //   state.totalScore      = 生点数 (倍率なし) → calculateScenarioEnding 用
    const raw  = choice.effect.scoreDelta;
    const mult = raw >= 0 ? this.diffCfg.bonusMult : this.diffCfg.penaltyMult;
    this.cbScoreDelta(Math.round(raw * mult));

    this.state = applyScenarioChoice(this.state, ev, choice);
    saveScenarioState(this.state);

    this.phase = 'result';
    for (const c of this.ovlChoices) c.setVisible(false);

    const summary = this.buildEffectSummary(choice);
    this.ovlResult.setText(`✓ [${idx + 1}] ${choice.text}\n${summary}`).setVisible(true);
    this.ovlExplain.setText('📘 ' + choice.effect.explanation).setVisible(true);
    this.ovlCue.setText('次へ ▶  [Space / タップ]');

    this.virtualPad.setChoiceButtonsVisible(0);
    this.layoutOverlay();
    this.cbLabelChange(`✓ ${ev.id}  ${ev.title}`);
  }

  private buildEffectSummary(choice: ScenarioChoice): string {
    const parts: string[] = [];
    const d = choice.effect.scoreDelta;
    parts.push(`スコア: ${d >= 0 ? '+' : ''}${d}点`);
    if (choice.effect.flagUpdates) {
      for (const [k, v] of Object.entries(choice.effect.flagUpdates)) {
        if (v) parts.push(`${k} ✓`);
      }
    }
    if (choice.effect.npcTrustDeltas) {
      for (const [k, v] of Object.entries(choice.effect.npcTrustDeltas)) {
        const n = v as number;
        parts.push(`${k}信頼 ${n >= 0 ? '+' : ''}${n}`);
      }
    }
    return parts.join('  ·  ');
  }

  // ── Progression ──────────────────────────────────────────────

  private advance(): void {
    const ev = this.events[this.idx];
    // 選択肢なし (INTRO / REVIEW) は Space / タップで進んだ時点でクリア済みにする
    if (ev && ev.choices.length === 0 && !this.state.clearedEventIds.includes(ev.id)) {
      this.state = {
        ...this.state,
        clearedEventIds: [...this.state.clearedEventIds, ev.id],
      };
      saveScenarioState(this.state);
    }

    this.idx++;
    // フラグ更新後にリスト再計算 (例: E02-A 後に E07 が追加される)
    this.events = getScenarioEventsForChapter(this.chapterId, this.state);

    // 安全ガード: 再計算で idx が既クリア済みイベントを指す場合はスキップ
    while (
      this.idx < this.events.length &&
      this.state.clearedEventIds.includes(this.events[this.idx].id)
    ) {
      this.idx++;
    }

    if (this.idx >= this.events.length) { this.complete(); return; }
    this.showEvent();
  }

  private complete(): void {
    [
      this.ovlGfx, this.ovlIdBadge, this.ovlSlotBadge,
      this.ovlTitle, this.ovlBody, this.ovlResult,
      this.ovlExplain, this.ovlCue, ...this.ovlChoices,
    ].forEach((o) => o.setVisible(false));

    this.active = false;
    this.virtualPad.setChoiceButtonsVisible(0);
    this.cbChapterComplete();
  }
}
