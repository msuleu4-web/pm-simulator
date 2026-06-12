'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Difficulty } from '../../lib/types';
import { difficultyConfigs, projectThemes } from '../../lib/difficultyConfig';

type ProjectTab = 'dev' | 'maint' | 'member' | 'pmo';

const projectTabMeta: Record<ProjectTab, { label: string; icon: string; description: string }> = {
  dev:    { label: '新規開発',         icon: '🆕', description: 'ゼロから新しいシステムを開発するプロジェクト' },
  maint:  { label: '保守・運用（PM）', icon: '🔧', description: '既存システムの保守・運用を行うプロジェクト' },
  member: { label: '開発メンバー',     icon: '👥', description: '開発チームの一員としてプロジェクトに参加' },
  pmo:    { label: 'PMO',             icon: '📊', description: '複数のプロジェクトを支援・統制する立場' },
};

const difficultiesByTab: Record<ProjectTab, Difficulty[]> = {
  dev: ['easy', 'normal', 'hard', 'ultra'],
  maint: ['maint-easy', 'maint-hard'],
  member: ['ops-easy', 'ops-normal', 'ops-hard'],
  pmo: ['pmo-support', 'pmo-control', 'pmo-directive'],
};

const starCount: Partial<Record<Difficulty, number>> = {
  easy: 1, normal: 2, hard: 3, ultra: 4,
  'maint-easy': 1, 'maint-hard': 3,
  'pmo-support': 1, 'pmo-control': 2, 'pmo-directive': 3,
  'ops-easy': 1, 'ops-normal': 2, 'ops-hard': 3,
};

const statLabels: Record<string, string> = {
  quality: '品質', cost: '予算', schedule: '納期', stakeholder: '顧客満足', morale: '士気',
};

const STEP_LABELS = ['プロジェクトタイプ', '難易度', 'プロジェクト'];

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -60 }),
};

export function PMSimulatorWizard({
  onStart,
  onClose,
  ultraUnlocked,
}: {
  onStart: (difficulty: Difficulty, projectThemeId: string) => void;
  onClose: () => void;
  ultraUnlocked: boolean;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState(1);
  const [tab, setTab] = useState<ProjectTab | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  const goNext = () => {
    setDirection(1);
    setStep((s) => (s === 1 ? 2 : s === 2 ? 3 : s));
  };

  const goBack = () => {
    if (step === 1) {
      onClose();
      return;
    }
    setDirection(-1);
    setStep((s) => (s === 3 ? 2 : 1));
  };

  const selectTab = (t: ProjectTab) => {
    setTab(t);
    setSelectedDifficulty(null);
    setSelectedThemeId(null);
  };

  const selectDifficulty = (id: Difficulty) => {
    if (id === 'ultra' && !ultraUnlocked) return;
    setSelectedDifficulty(id);
    setSelectedThemeId(null);
  };

  const handleStart = () => {
    if (selectedDifficulty && selectedThemeId) onStart(selectedDifficulty, selectedThemeId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        {/* ── ヘッダー ── */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            ← {step === 1 ? 'トップへ戻る' : '戻る'}
          </button>
          <h1 className="text-base font-black tracking-widest text-slate-200 sm:text-lg">PMシミュレーター設定</h1>
          <span className="w-20" aria-hidden="true" />
        </div>

        {/* ── プログレスバー ── */}
        <div className="mx-auto mt-8 flex max-w-xl items-center">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            return (
              <div key={label} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-black transition ${
                      step === n
                        ? 'border-emerald-400 bg-emerald-400 text-slate-900 shadow-[0_0_18px_rgba(52,211,153,0.6)]'
                        : step > n
                        ? 'border-emerald-400 bg-emerald-400/15 text-emerald-300'
                        : 'border-slate-700 bg-slate-800 text-slate-500'
                    }`}
                  >
                    {step > n ? '✓' : n}
                  </div>
                  <span className={`mt-2 whitespace-nowrap text-[11px] font-semibold ${step >= n ? 'text-emerald-300' : 'text-slate-500'}`}>
                    {label}
                  </span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`mx-2 h-0.5 flex-1 rounded transition ${step > n ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.section
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="mt-12"
            >
              <div className="text-center">
                <h2 className="text-xl font-black sm:text-2xl">プロジェクトタイプを選択してください</h2>
                <p className="mt-2 text-sm text-slate-400">あなたはどの立場でプロジェクトに参加しますか？</p>
              </div>
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {(Object.keys(projectTabMeta) as ProjectTab[]).map((t) => {
                  const meta = projectTabMeta[t];
                  const isSelected = tab === t;
                  return (
                    <motion.button
                      key={t}
                      type="button"
                      whileHover={{ y: -6 }}
                      onClick={() => selectTab(t)}
                      className={`relative flex flex-col items-center rounded-3xl border-2 p-8 text-center transition ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-400/10 shadow-[0_0_30px_rgba(52,211,153,0.35)]'
                          : 'border-slate-700 bg-slate-800/60 hover:border-slate-500'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400 text-sm font-black text-slate-900">
                          ✓
                        </span>
                      )}
                      <span className="text-5xl">{meta.icon}</span>
                      <p className="mt-4 text-lg font-black">{meta.label}</p>
                      <p className="mt-2 text-xs leading-5 text-slate-400">{meta.description}</p>
                    </motion.button>
                  );
                })}
              </div>
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!tab}
                  className={`rounded-2xl px-12 py-4 text-base font-black transition ${
                    tab ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400' : 'cursor-not-allowed bg-slate-800 text-slate-500'
                  }`}
                >
                  次へ →
                </button>
              </div>
            </motion.section>
          )}

          {step === 2 && tab && (
            <motion.section
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="mt-12"
            >
              <div className="text-center">
                <h2 className="text-xl font-black sm:text-2xl">難易度を選択してください</h2>
                <p className="mt-2 text-sm text-slate-400">プロジェクト規模が大きいほど、トラブルと責任が増加します。</p>
              </div>
              <div className={`mt-10 grid gap-5 ${tab === 'dev' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2'}`}>
                {difficultiesByTab[tab].map((id) => {
                  const config = difficultyConfigs[id];
                  const isLocked = id === 'ultra' && !ultraUnlocked;
                  const isSelected = selectedDifficulty === id;
                  const stars = starCount[id] ?? 1;
                  return (
                    <motion.button
                      key={id}
                      type="button"
                      whileHover={!isLocked ? { y: -6 } : undefined}
                      onClick={() => selectDifficulty(id)}
                      disabled={isLocked}
                      className={`relative flex flex-col rounded-3xl border-2 p-7 text-left transition ${
                        isLocked
                          ? 'cursor-not-allowed border-slate-800 bg-slate-900/40 opacity-50'
                          : isSelected
                          ? 'scale-[1.02] border-emerald-400 bg-emerald-400/10 shadow-[0_0_30px_rgba(52,211,153,0.35)]'
                          : 'border-slate-700 bg-slate-800/60 hover:border-slate-500'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400 text-sm font-black text-slate-900">
                          ✓
                        </span>
                      )}
                      {isLocked && <span className="absolute right-4 top-4 text-xl">🔒</span>}
                      <span className="inline-block w-fit rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold text-slate-200">{config.badge}</span>
                      <p className="mt-3 text-sm text-amber-400">{'★'.repeat(stars)}</p>
                      <p className="mt-2 text-xl font-black">{config.label}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">{config.weeks}週間 / {config.teamSize}名</p>
                      <p className="mt-3 text-xs leading-5 text-slate-400">{config.description}</p>
                      {isLocked && config.unlockCondition && (
                        <p className="mt-3 text-xs text-amber-400">🔓 {config.unlockCondition.label}</p>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <div className="mt-10 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={goBack}
                  className="rounded-2xl border border-slate-600 px-8 py-4 text-sm font-bold text-slate-300 transition hover:border-slate-400 hover:text-white"
                >
                  ← 戻る
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!selectedDifficulty}
                  className={`rounded-2xl px-12 py-4 text-base font-black transition ${
                    selectedDifficulty ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400' : 'cursor-not-allowed bg-slate-800 text-slate-500'
                  }`}
                >
                  次へ →
                </button>
              </div>
            </motion.section>
          )}

          {step === 3 && selectedDifficulty && (
            <motion.section
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="mt-12"
            >
              <div className="text-center">
                <h2 className="text-xl font-black sm:text-2xl">担当するプロジェクトを選択してください</h2>
                <p className="mt-2 text-sm text-slate-400">プロジェクトによって、初期状況や難所が変わります。</p>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projectThemes[selectedDifficulty].map((theme) => {
                  const isSelected = selectedThemeId === theme.id;
                  return (
                    <motion.button
                      key={theme.id}
                      type="button"
                      whileHover={{ y: -4 }}
                      onClick={() => setSelectedThemeId(theme.id)}
                      className={`relative rounded-2xl border-2 p-5 text-left transition ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-400/10 shadow-[0_0_24px_rgba(52,211,153,0.3)]'
                          : 'border-slate-700 bg-slate-800/60 hover:border-slate-500'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-xs font-black text-slate-900">
                          ✓
                        </span>
                      )}
                      {theme.category && (
                        <span className="inline-block rounded-full bg-teal-400/15 px-2 py-0.5 text-xs font-bold text-teal-300">{theme.category}</span>
                      )}
                      <p className="mt-2 text-sm font-bold leading-snug text-white">{theme.title}</p>
                      <p className="mt-1 text-xs text-slate-400">{theme.client}</p>
                      <p className="mt-2 text-xs leading-5 text-slate-400">{theme.description}</p>
                      {Object.keys(theme.statModifiers).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {Object.entries(theme.statModifiers).map(([k, v]) => {
                            const pos = (v ?? 0) > 0;
                            return (
                              <span key={k} className={`rounded-full px-2 py-0.5 text-xs font-semibold ${pos ? 'bg-emerald-400/15 text-emerald-300' : 'bg-rose-400/15 text-rose-300'}`}>
                                {pos ? '↑' : '↓'}{statLabels[k]}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <div className="mt-10 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={goBack}
                  className="rounded-2xl border border-slate-600 px-8 py-4 text-sm font-bold text-slate-300 transition hover:border-slate-400 hover:text-white"
                >
                  ← 戻る
                </button>
                <motion.button
                  type="button"
                  onClick={handleStart}
                  disabled={!selectedThemeId}
                  animate={selectedThemeId ? { scale: [1, 1.04, 1] } : undefined}
                  transition={selectedThemeId ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : undefined}
                  className={`rounded-2xl px-12 py-4 text-base font-black transition ${
                    selectedThemeId
                      ? 'bg-gradient-to-r from-emerald-400 to-blue-400 text-slate-900 shadow-lg shadow-emerald-500/30'
                      : 'cursor-not-allowed bg-slate-800 text-slate-500'
                  }`}
                >
                  🚀 ゲーム開始
                </motion.button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
