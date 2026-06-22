'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Game } from 'phaser';
import { CHAPTERS, getClearedChapters, isChapterUnlocked, getEarnedTitles, getModeChapterId, ENDINGS } from '../../src/game/chapters';
import { DIFFICULTY_CONFIG, getDifficulty, saveDifficulty, type Difficulty as SierDifficulty } from '../../src/game/difficulty';

const JP_FONT = '"Hiragino Kaku Gothic ProN","Hiragino Sans","Yu Gothic","Meiryo",Arial,sans-serif';

const IMPLEMENTED_SCENES = new Set([
  'Chapter1Scene', 'Chapter2Scene', 'Chapter3Scene', 'Chapter4Scene', 'Chapter5Scene', 'Chapter6Scene', 'Chapter7Scene',
  'EasyChapter1Scene', 'EasyChapter2Scene', 'EasyChapter3Scene', 'EasyChapter4Scene', 'EasyChapter5Scene', 'EasyChapter6Scene', 'EasyChapter7Scene',
  'HardChapter1Scene', 'HardChapter2Scene', 'HardChapter3Scene', 'HardChapter4Scene', 'HardChapter5Scene', 'HardChapter6Scene', 'HardChapter7Scene',
]);

// ── 表示用メタ（内部値 easy/normal/hard は変更しない） ──────────

const DIFF_DISPLAY: Record<SierDifficulty, {
  label: string; icon: string; tier: string;
  featureTag: string; featureBg: string; featureText: string;
  tierBg: string; tierText: string;
  selBorder: string; selBg: string; selText: string;
  isWarning?: boolean;
}> = {
  easy: {
    label: '新人案件', icon: '📋', tier: 'BEGINNER',
    featureTag: 'ヒントあり', featureBg: '#dcfce7', featureText: '#15803d',
    tierBg: '#dcfce7', tierText: '#15803d',
    selBorder: '#22c55e', selBg: '#f0fdf4', selText: '#15803d',
  },
  normal: {
    label: '現場案件', icon: '👥', tier: 'STANDARD',
    featureTag: '標準評価', featureBg: '#dbeafe', featureText: '#1d4ed8',
    tierBg: '#dbeafe', tierText: '#1d4ed8',
    selBorder: '#3b82f6', selBg: '#eff6ff', selText: '#1d4ed8',
  },
  hard: {
    label: '炎上注意案件', icon: '🔥', tier: 'HARD',
    featureTag: 'ペナルティ 2倍', featureBg: '#ffedd5', featureText: '#c2410c',
    tierBg: '#ffedd5', tierText: '#c2410c',
    selBorder: '#f97316', selBg: '#fff7ed', selText: '#c2410c',
    isWarning: true,
  },
};

const PHASE_LABELS: Record<SierDifficulty, string[]> = {
  easy:   ['ヒアリング', 'UI設計', '実装', 'テスト', 'リリース', '運用', '振り返り'],
  normal: ['キックオフ', '要件定義', '基本設計', '製造', 'テスト', '炎上対応', 'リリース'],
  hard:   ['キックオフ', '要件定義', '基本設計', '製造', 'テスト', '炎上対応', 'リリース'],
};

const PROJECT_NAME: Record<SierDifficulty, string> = {
  easy: '社内ポータル', normal: '現場プロジェクト', hard: 'Spire',
};

const CHAPTER_THEMES: Record<SierDifficulty, string[][]> = {
  easy: [
    ['ヒアリング', '質問力', '傾聴'],
    ['UI設計', 'ワイヤーフレーム', '要件整理'],
    ['実装', 'コードレビュー', '品質'],
    ['テスト', 'バグ管理', '品質確認'],
    ['リリース', '展開計画', 'マニュアル'],
    ['運用', 'フィードバック収集', '改善'],
    ['KPT', '振り返り', '次期企画'],
  ],
  normal: [
    ['キックオフ', 'WBS', '関係構築'],
    ['要件定義', '議事録', '質問力'],
    ['基本設計', 'ドキュメント', 'レビュー'],
    ['実装管理', '進捗報告', '課題管理'],
    ['テスト設計', 'バグ票', '品質管理'],
    ['炎上対応', 'リスク管理', '調整力'],
    ['リリース', '引き継ぎ', '運用保守'],
  ],
  hard: [
    ['即戦力', 'セルフスタート', 'ロール確認'],
    ['曖昧要件', '議事録なし', 'Slack整理'],
    ['ノーレビュー', '最低限設計', '判断力'],
    ['孤独な実装', 'デプロイ', 'DevOps'],
    ['本番テスト', 'バグ票なし', '実地確認'],
    ['炎上立て直し', 'スコープ交渉', '記録の重要性'],
    ['引き継ぎなし', '障害対応', '運用保守の実態'],
  ],
};

const SKILL_BASE: Record<SierDifficulty, { comm: number; doc: number; trouble: number }> = {
  easy:   { comm: 55, doc: 40, trouble: 20 },
  normal: { comm: 40, doc: 40, trouble: 35 },
  hard:   { comm: 30, doc: 25, trouble: 55 },
};

// ── SIer道場 title screen (Phaser) ── 変更なし ─────────────────

function SierTitleCanvas({ onStart }: { onStart: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelled = false;
    const init = async () => {
      // @ts-ignore
      const { createGame } = await import('../../src/game/PhaserGame');
      if (!cancelled && containerRef.current && !gameRef.current) {
        gameRef.current = createGame(containerRef.current, 'TitleScene');
      }
    };
    init().catch(console.error);
    const onTitleStart = () => onStart();
    window.addEventListener('sier-title-start', onTitleStart);
    return () => {
      cancelled = true;
      window.removeEventListener('sier-title-start', onTitleStart);
      if (gameRef.current) { gameRef.current.destroy(true); gameRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={{ position: 'fixed', inset: 0, background: '#0a0a14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </main>
  );
}

// ── サイドバー: 配属状況 + ミッション + テーマ + スキル ────────

function StatusCard({ difficulty, cleared }: { difficulty: SierDifficulty; cleared: string[] }) {
  const clearCount = CHAPTERS.filter((ch) =>
    cleared.includes(getModeChapterId(ch.id, difficulty))
  ).length;
  const pct = CHAPTERS.length > 0 ? Math.round((clearCount / CHAPTERS.length) * 100) : 0;
  const meta = DIFF_DISPLAY[difficulty];

  // 現在のミッション: 最初の「解放済み・未クリア」章
  const missionIdx = CHAPTERS.findIndex((ch, i) =>
    isChapterUnlocked(i, cleared, difficulty) &&
    !cleared.includes(getModeChapterId(ch.id, difficulty))
  );
  const missionChapter = missionIdx >= 0 ? CHAPTERS[missionIdx] : null;
  const missionPhase = missionIdx >= 0 ? PHASE_LABELS[difficulty][missionIdx] : null;
  const themes = missionIdx >= 0 ? (CHAPTER_THEMES[difficulty][missionIdx] ?? []) : [];

  const skills = [
    { name: 'コミュニケーション', val: Math.min(100, SKILL_BASE[difficulty].comm + clearCount * 9) },
    { name: 'ドキュメント化',     val: Math.min(100, SKILL_BASE[difficulty].doc  + clearCount * 7) },
    { name: 'トラブル対応',       val: Math.min(100, SKILL_BASE[difficulty].trouble + clearCount * 8) },
  ];

  // 称号システム（ゲーム内表示用、スコアベースの ENDINGS とは独立）
  const titleInfo = (() => {
    if (clearCount >= 7) return { title: 'エースSE',   nextTitle: null,        chaptersLeft: 0 };
    if (clearCount >= 6) return { title: '一人前SE',   nextTitle: 'エースSE',  chaptersLeft: 1 };
    if (clearCount >= 4) return { title: '中堅SE',     nextTitle: '一人前SE',  chaptersLeft: 6 - clearCount };
    if (clearCount >= 2) return { title: '下請けSE',   nextTitle: '中堅SE',    chaptersLeft: 4 - clearCount };
    return                      { title: '新人SE',     nextTitle: '下請けSE',  chaptersLeft: 2 - clearCount };
  })();

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" style={{ fontFamily: JP_FONT }}>

      {/* 配属状況 */}
      <div className="border-b border-slate-100 p-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">配属状況</p>
        <dl className="space-y-2">
          <div className="flex items-center justify-between">
            <dt className="text-[11px] text-slate-500">配属先</dt>
            <dd className="text-[11px] font-bold text-slate-800">{PROJECT_NAME[difficulty]}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-[11px] text-slate-500">進行状況</dt>
            <dd className="text-[11px] font-bold text-slate-800">{clearCount} / {CHAPTERS.length} 章</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-[11px] text-slate-500">案件タイプ</dt>
            <dd className="text-[11px] font-bold" style={{ color: meta.selText }}>{meta.label}</dd>
          </div>
        </dl>
        <div className="mt-3">
          <div className="h-1.5 w-full rounded-full bg-slate-100">
            <div
              className="h-1.5 rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1 text-[10px] text-slate-400">{pct}% 完了</p>
        </div>
      </div>

      {/* 現在のミッション */}
      {missionChapter ? (
        <div className="border-b border-slate-100 p-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">現在のミッション</p>
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
            <p className="text-[10px] font-semibold text-blue-600">{missionPhase}</p>
            <p className="mt-0.5 text-xs font-bold text-slate-800">
              第{missionIdx + 1}章を完了する
            </p>
          </div>
        </div>
      ) : clearCount === CHAPTERS.length ? (
        <div className="border-b border-slate-100 p-4">
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-center">
            <p className="text-xs font-bold text-emerald-700">全章クリア達成！</p>
          </div>
        </div>
      ) : null}

      {/* 今日の学習テーマ */}
      {themes.length > 0 && (
        <div className="border-b border-slate-100 p-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">今日の学習テーマ</p>
          <div className="flex flex-wrap gap-1.5">
            {themes.map((t) => (
              <span
                key={t}
                className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* スキルメーター */}
      <div className="border-b border-slate-100 p-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">スキルメーター</p>
        <div className="space-y-2.5">
          {skills.map((s) => (
            <div key={s.name}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-600">{s.name}</span>
                <span className="text-[10px] font-bold text-slate-500">{s.val}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100">
                <div
                  className="h-1.5 rounded-full bg-blue-400 transition-all duration-300"
                  style={{ width: `${s.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ゲーム進行 */}
      <div className="p-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">ゲーム進行</p>

        {/* 現在の称号 */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">現在の称号</span>
          <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-black text-white">
            {titleInfo.title}
          </span>
        </div>

        {/* 次の称号まで */}
        {titleInfo.nextTitle ? (
          <div className="mb-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
            <p className="text-[10px] text-slate-400">次の称号まで</p>
            <p className="mt-0.5 text-xs font-bold text-slate-700">
              あと{titleInfo.chaptersLeft}章 → {titleInfo.nextTitle}
            </p>
          </div>
        ) : (
          <div className="mb-3 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-center">
            <p className="text-xs font-bold text-amber-700">全称号解放済み 🏆</p>
          </div>
        )}

        {/* 累計XP */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">累計 XP</span>
          <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-700">
            {clearCount * 50} XP
          </span>
          {missionChapter && (
            <span className="text-[10px] text-slate-400">次 +50 XP</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 案件チャプター選択画面 ────────────────────────────────────

function ChapterSelect({ onPlay }: { onPlay: (sceneName: string) => void }) {
  const router = useRouter();
  const [cleared, setCleared] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<SierDifficulty>('normal');
  const [earnedTitles, setEarnedTitles] = useState<string[]>([]);

  // ── 既存ロジック: 変更なし ──
  useEffect(() => {
    setCleared(getClearedChapters());
    setDifficulty(getDifficulty());
    setEarnedTitles(getEarnedTitles());
  }, []);

  const handleDifficultyChange = (d: SierDifficulty) => {
    setDifficulty(d);
    saveDifficulty(d);
  };

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: JP_FONT }}>

      {/* 背景グリッド */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* 背景装飾: ホワイトボード風（右上） */}
      <div
        className="pointer-events-none fixed right-8 top-24 hidden opacity-[0.12] lg:block"
        aria-hidden="true"
      >
        <div className="h-32 w-40 rounded-lg border-2 border-slate-400 bg-white p-3 shadow-sm">
          <p className="mb-2 text-[8px] font-black uppercase tracking-widest text-slate-500">PROJECT BOARD</p>
          <div className="space-y-1.5">
            <div className="h-2 w-24 rounded bg-slate-300" />
            <div className="h-2 w-20 rounded bg-slate-300" />
            <div className="h-2 w-28 rounded bg-slate-300" />
            <div className="h-2 w-16 rounded bg-slate-200" />
          </div>
          <div className="mt-3 flex gap-1">
            <div className="h-4 w-10 rounded bg-blue-200" />
            <div className="h-4 w-10 rounded bg-emerald-200" />
          </div>
        </div>
      </div>

      {/* 背景装飾: WBS ラベル（右中） */}
      <div
        className="pointer-events-none fixed right-10 top-[52%] hidden opacity-[0.08] lg:block"
        aria-hidden="true"
        style={{ transform: 'rotate(2deg)' }}
      >
        <div className="rounded border border-slate-300 bg-white px-3 py-2">
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">WBS</p>
          <div className="mt-1.5 space-y-1">
            <div className="h-1.5 w-14 rounded bg-slate-300" />
            <div className="h-1.5 w-10 rounded bg-slate-300" />
            <div className="h-1.5 w-12 rounded bg-slate-200" />
          </div>
        </div>
      </div>

      {/* 背景装飾: REVIEW ラベル（左上） */}
      <div
        className="pointer-events-none fixed left-8 top-28 hidden opacity-[0.09] lg:block"
        aria-hidden="true"
        style={{ transform: 'rotate(-1deg)' }}
      >
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
          <p className="text-[8px] font-black uppercase tracking-widest text-blue-400">REVIEW</p>
          <div className="mt-1.5 space-y-1">
            <div className="h-1.5 w-16 rounded bg-blue-200" />
            <div className="h-1.5 w-12 rounded bg-blue-200" />
          </div>
        </div>
      </div>

      {/* 背景装飾: ポストイット SPRINT（左下） */}
      <div
        className="pointer-events-none fixed bottom-20 left-8 hidden opacity-[0.12] lg:block"
        aria-hidden="true"
        style={{ transform: 'rotate(-3deg)' }}
      >
        <div className="h-24 w-28 rounded border border-yellow-300 bg-yellow-100 p-2.5 shadow-sm">
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">SPRINT</p>
          <div className="mt-2 space-y-1.5">
            <div className="h-1.5 w-20 rounded bg-slate-400" />
            <div className="h-1.5 w-16 rounded bg-slate-400" />
            <div className="h-1.5 w-18 rounded bg-slate-300" />
          </div>
        </div>
      </div>

      {/* 背景装飾: ポストイット RETROSPECTIVE（左下2枚目） */}
      <div
        className="pointer-events-none fixed bottom-8 left-24 hidden opacity-[0.09] lg:block"
        aria-hidden="true"
        style={{ transform: 'rotate(2deg)' }}
      >
        <div className="h-20 w-24 rounded border border-pink-200 bg-pink-50 p-2">
          <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">RETRO</p>
          <div className="mt-1.5 space-y-1">
            <div className="h-1.5 w-14 rounded bg-slate-300" />
            <div className="h-1.5 w-10 rounded bg-slate-300" />
          </div>
        </div>
      </div>

      {/* ── ポータルヘッダー ── */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1.5 rounded-full bg-blue-600" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">SIer道場</p>
              <h1 className="text-base font-bold leading-tight text-slate-900">案件ボード</h1>
            </div>
            <span className="ml-3 hidden border-l border-slate-200 pl-3 text-[11px] text-slate-400 sm:inline-block">
              研修モード · プロジェクト進行管理
            </span>
          </div>
          <button
            onClick={() => router.push('/')}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
          >
            ← ホームへ
          </button>
        </div>
      </header>

      {/* ── メインコンテンツ ── */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_288px]">

          {/* ── 左カラム ── */}
          <div className="space-y-5">

            {/* 案件タイプ選択 */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                案件タイプ選択
              </p>
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(DIFFICULTY_CONFIG) as SierDifficulty[]).map((d) => {
                  const cfg = DIFFICULTY_CONFIG[d];
                  const meta = DIFF_DISPLAY[d];
                  const sel = d === difficulty;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleDifficultyChange(d)}
                      className={`relative rounded-lg border-2 p-4 text-left transition-all hover:shadow-sm ${
                        sel ? '' : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                      style={sel ? { borderColor: meta.selBorder, background: meta.selBg } : undefined}
                    >
                      {/* TIERラベル + 選択チェック */}
                      <div className="mb-2 flex items-center justify-between">
                        <span
                          className="rounded px-1.5 py-0.5 text-[9px] font-black tracking-wider"
                          style={{ background: meta.tierBg, color: meta.tierText }}
                        >
                          {meta.tier}
                        </span>
                        {sel && (
                          <span
                            className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white"
                            style={{ background: meta.selBorder }}
                          >
                            ✓
                          </span>
                        )}
                      </div>

                      <span className="text-2xl">{meta.icon}</span>
                      <p
                        className="mt-2 text-sm font-bold"
                        style={{ color: sel ? meta.selText : '#1f2937' }}
                      >
                        {meta.label}
                      </p>

                      {meta.isWarning && (
                        <span className="mt-1 inline-block rounded border border-orange-300 bg-orange-50 px-1.5 py-0.5 text-[9px] font-bold text-orange-700">
                          ⚠ 炎上注意
                        </span>
                      )}

                      <p className="mt-2 text-[10px] leading-relaxed text-slate-600">{cfg.description}</p>

                      {/* 機能タグ */}
                      <div className="mt-3">
                        <span
                          className="rounded-full px-2 py-0.5 text-[9px] font-semibold"
                          style={{ background: meta.featureBg, color: meta.featureText }}
                        >
                          {meta.featureTag}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 案件チャプター一覧 */}
            <section>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                案件チャプター一覧 — {PROJECT_NAME[difficulty]}
              </p>
              <div className="space-y-3">
                {CHAPTERS.map((ch, i) => {
                  // ── 既存の章解放ロジック: 変更なし ──
                  const isCleared = cleared.includes(getModeChapterId(ch.id, difficulty));
                  const unlocked = isChapterUnlocked(i, cleared, difficulty);
                  const sceneName =
                    difficulty === 'easy' ? ch.easySceneName
                    : difficulty === 'hard' ? ch.hardSceneName
                    : ch.sceneName;
                  const title =
                    difficulty === 'easy' ? ch.easyTitle
                    : difficulty === 'hard' ? ch.hardTitle
                    : ch.title;
                  const description =
                    difficulty === 'easy' ? ch.easyDescription
                    : difficulty === 'hard' ? ch.hardDescription
                    : ch.description;
                  const playable = unlocked && IMPLEMENTED_SCENES.has(sceneName);
                  const phase = PHASE_LABELS[difficulty][i] ?? '';
                  const themes = CHAPTER_THEMES[difficulty][i] ?? [];

                  // カード状態
                  const chNumBg = isCleared ? '#16a34a' : unlocked ? '#2563eb' : '#94a3b8';
                  const statusLabel = isCleared ? '完了済み' : playable ? '進行可能' : unlocked ? '準備中' : '次章未解放';
                  const statusStyle = isCleared
                    ? 'bg-emerald-100 text-emerald-700'
                    : playable
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-500';

                  return (
                    <div
                      key={ch.id}
                      className={`flex overflow-hidden rounded-xl border shadow-sm transition-shadow ${
                        isCleared
                          ? 'border-emerald-200 bg-white'
                          : playable
                          ? 'border-blue-200 bg-blue-50 hover:shadow-md'
                          : 'border-slate-200 bg-white opacity-80'
                      }`}
                    >
                      {/* 章番号ブロック */}
                      <div
                        className="flex w-14 flex-shrink-0 flex-col items-center justify-center gap-0.5 py-4 text-white"
                        style={{ background: chNumBg }}
                      >
                        <span className="text-[8px] font-bold opacity-70">CH</span>
                        <span className="text-2xl font-black leading-none">{i + 1}</span>
                        {isCleared && <span className="mt-0.5 text-[10px] font-black">✓</span>}
                      </div>

                      {/* カード本文 */}
                      <div className="flex flex-1 flex-col p-4">
                        {/* タイトル行 */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                              {phase}
                            </span>
                            <h3 className={`text-sm font-bold leading-snug ${unlocked ? 'text-slate-900' : 'text-slate-600'}`}>
                              {title}
                            </h3>
                          </div>
                          <div className="flex-shrink-0">
                            {isCleared && (
                              <span
                                className="inline-block rounded border-2 border-emerald-500 px-2 py-0.5 text-[10px] font-black text-emerald-600"
                                style={{ transform: 'rotate(-2deg)' }}
                              >
                                完了
                              </span>
                            )}
                            {!unlocked && (
                              <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                                次章未解放
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 説明文 */}
                        <p className={`mt-2 text-sm leading-relaxed ${unlocked ? 'text-slate-600' : 'text-slate-500'}`}>
                          {description}
                        </p>

                        {/* ステータス行 */}
                        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusStyle}`}>
                            {statusLabel}
                          </span>
                          {themes.slice(0, 2).map((t) => (
                            <span key={t} className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs text-slate-500">
                              {t}
                            </span>
                          ))}
                          <span className="ml-auto text-xs text-slate-400">約20〜30分</span>
                        </div>

                        {/* 解放ヒント */}
                        {!unlocked && i > 0 && (
                          <p className="mt-1.5 text-xs text-slate-400">
                            第{i}章を完了すると解放されます
                          </p>
                        )}

                        {/* アクションボタン */}
                        <div className="mt-3">
                          {playable ? (
                            <button
                              type="button"
                              onClick={() => onPlay(sceneName)}
                              className={`w-full rounded-lg py-2.5 text-sm font-bold text-white transition-colors ${
                                isCleared
                                  ? 'bg-emerald-500 hover:bg-emerald-600'
                                  : 'bg-blue-600 hover:bg-blue-700'
                              }`}
                            >
                              {isCleared ? 'もう一度プレイ →' : 'プレイする →'}
                            </button>
                          ) : unlocked ? (
                            <button
                              type="button"
                              disabled
                              className="w-full cursor-default rounded-lg bg-slate-100 py-2.5 text-sm font-medium text-slate-400"
                            >
                              準備中
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="w-full cursor-default rounded-lg border border-slate-200 bg-slate-50 py-2.5 text-sm font-medium text-slate-500"
                            >
                              次章未解放
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* ── 右サイドバー ── */}
          <aside className="space-y-4">
            <StatusCard difficulty={difficulty} cleared={cleared} />

            {earnedTitles.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">獲得した称号</p>
                <div className="flex flex-wrap gap-2">
                  {earnedTitles.map((title) => (
                    <span
                      key={title}
                      className="rounded border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"
                    >
                      {title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

// ── Chapter canvas ── 変更なし ─────────────────────────────────

function ChapterCanvas({ sceneName, onDone, onChapterCleared }: {
  sceneName: string; onDone: () => void; onChapterCleared: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [docImage, setDocImage] = useState<{ path: string; label: string } | null>(null);

  const closeDocImage = () => {
    setDocImage(null);
    window.dispatchEvent(new CustomEvent('sier-doc-image-closed'));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelled = false;
    const init = async () => {
      // @ts-ignore
      const { createGame } = await import('../../src/game/PhaserGame');
      if (!cancelled && containerRef.current && !gameRef.current) {
        gameRef.current = createGame(containerRef.current, sceneName);
      }
    };
    init().catch(console.error);
    const onCleared = () => onChapterCleared();
    const onShowDocImage = (e: Event) => {
      setDocImage((e as CustomEvent<{ path: string; label: string }>).detail);
    };
    const onDocImageClosed = () => { setDocImage(null); };
    window.addEventListener('sier-chapter-cleared', onCleared);
    window.addEventListener('sier-show-doc-image', onShowDocImage);
    window.addEventListener('sier-doc-image-closed', onDocImageClosed);
    return () => {
      cancelled = true;
      window.removeEventListener('sier-chapter-cleared', onCleared);
      window.removeEventListener('sier-show-doc-image', onShowDocImage);
      window.removeEventListener('sier-doc-image-closed', onDocImageClosed);
      if (gameRef.current) { gameRef.current.destroy(true); gameRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={{ position: 'fixed', inset: 0, background: '#050d18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      <button
        onClick={onDone}
        style={{
          position: 'absolute', top: 12, right: 12,
          background: '#1a2e4a', border: '1px solid #2a5a7c',
          color: '#aabbcc', fontSize: 12, borderRadius: 6,
          padding: '6px 12px', cursor: 'pointer', fontFamily: 'monospace', zIndex: 100,
        }}
      >
        ← 戻る
      </button>
      {docImage && (
        <div
          onClick={closeDocImage}
          style={{
            position: 'fixed', inset: 0, zIndex: 9998,
            background: 'rgba(0,0,0,0.93)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '16px 16px 8px', cursor: 'zoom-out',
          }}
        >
          <p style={{ color: '#C8A040', fontSize: 12, fontFamily: 'monospace', marginBottom: 10, letterSpacing: '0.05em', textAlign: 'center' }}>
            📄 {docImage.label}
          </p>
          <img
            src={docImage.path}
            alt={docImage.label}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '100%', maxHeight: 'calc(100vh - 80px)',
              objectFit: 'contain', borderRadius: 6,
              border: '2px solid #C8A040', boxShadow: '0 4px 32px rgba(0,0,0,0.8)',
            }}
          />
          <p style={{ color: '#556677', fontSize: 11, fontFamily: 'monospace', marginTop: 10, textAlign: 'center' }}>
            タップ / クリックで閉じる　|　Zキーでも閉じる
          </p>
        </div>
      )}
    </main>
  );
}

// ── Page entry point ── 変更なし ──────────────────────────────

export default function GamePage() {
  const [phase, setPhase] = useState<'sier-title' | 'chapters' | 'office'>('sier-title');
  const [activeScene, setActiveScene] = useState('Chapter1Scene');

  if (phase === 'sier-title') {
    return <SierTitleCanvas onStart={() => setPhase('chapters')} />;
  }

  if (phase === 'chapters') {
    return (
      <ChapterSelect
        onPlay={(sceneName) => { setActiveScene(sceneName); setPhase('office'); }}
      />
    );
  }

  return (
    <ChapterCanvas
      sceneName={activeScene}
      onDone={() => setPhase('chapters')}
      onChapterCleared={() => setPhase('chapters')}
    />
  );
}
