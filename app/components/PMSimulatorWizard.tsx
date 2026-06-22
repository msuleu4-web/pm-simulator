'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Difficulty } from '../../lib/types';
import { difficultyConfigs, projectThemes } from '../../lib/difficultyConfig';

type ProjectTab = 'dev' | 'maint' | 'member' | 'pmo';

const projectTabMeta: Record<ProjectTab, {
  label: string; icon: string; description: string;
  accentColor: string; bgColor: string; borderColor: string;
}> = {
  dev:    { label: '新規開発',         icon: '🆕', description: 'ゼロから新しいシステムを開発するプロジェクト',    accentColor: '#2563eb', bgColor: '#eff6ff', borderColor: '#93c5fd' },
  maint:  { label: '保守・運用（PM）', icon: '🔧', description: '既存システムの保守・運用を行うプロジェクト',      accentColor: '#0f766e', bgColor: '#f0fdfa', borderColor: '#5eead4' },
  member: { label: '開発メンバー',     icon: '👥', description: '開発チームの一員としてプロジェクトに参加',        accentColor: '#6d28d9', bgColor: '#f5f3ff', borderColor: '#c4b5fd' },
  pmo:    { label: 'PMO',             icon: '📊', description: '複数のプロジェクトを支援・統制する立場',          accentColor: '#b45309', bgColor: '#fffbeb', borderColor: '#fcd34d' },
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

const WARNING_DIFFICULTIES: Difficulty[] = ['hard', 'maint-hard', 'ops-hard', 'pmo-directive'];

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
    <div className="min-h-screen bg-slate-50">
      {/* ── ポータルヘッダー ── */}
      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-5 w-1 rounded-full bg-blue-600" />
            <span className="text-sm font-bold text-slate-700">PMシミュレーター設定</span>
          </div>
          <button
            type="button"
            onClick={goBack}
            className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
          >
            ← {step === 1 ? 'トップへ戻る' : '戻る'}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* ── ステッパー ── */}
        <div className="mx-auto mb-10 max-w-lg">
          <div className="flex items-center">
            {STEP_LABELS.map((label, i) => {
              const n = i + 1;
              const isDone = step > n;
              const isCurrent = step === n;
              return (
                <div key={label} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition ${
                        isCurrent
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : isDone
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-300 bg-white text-slate-400'
                      }`}
                    >
                      {isDone ? '✓' : n}
                    </div>
                    <span className={`mt-1.5 whitespace-nowrap text-[11px] font-semibold ${
                      isCurrent ? 'text-blue-700' : isDone ? 'text-blue-600' : 'text-slate-400'
                    }`}>
                      {label}
                    </span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div className={`mx-2 mb-4 h-px flex-1 transition ${isDone ? 'bg-blue-400' : 'bg-slate-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          {/* ── STEP 1: プロジェクトタイプ ── */}
          {step === 1 && (
            <motion.section
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <div className="mb-8 text-center">
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">プロジェクトタイプを選択</h2>
                <p className="mt-1 text-sm text-slate-500">あなたはどの立場でプロジェクトに参加しますか？</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {(Object.keys(projectTabMeta) as ProjectTab[]).map((t) => {
                  const meta = projectTabMeta[t];
                  const isSelected = tab === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => selectTab(t)}
                      className={`relative overflow-hidden rounded-lg border-2 p-6 text-center transition hover:shadow-sm ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div
                        className="absolute inset-x-0 top-0 h-1"
                        style={{ background: meta.accentColor }}
                      />
                      {isSelected && (
                        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                          ✓
                        </span>
                      )}
                      <span className="mt-2 inline-block text-4xl">{meta.icon}</span>
                      <p className="mt-3 text-sm font-bold text-slate-800">{meta.label}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{meta.description}</p>
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!tab}
                  className={`rounded px-10 py-3 text-sm font-bold transition ${
                    tab
                      ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                      : 'cursor-not-allowed bg-slate-200 text-slate-400'
                  }`}
                >
                  次へ →
                </button>
              </div>
            </motion.section>
          )}

          {/* ── STEP 2: 難易度 ── */}
          {step === 2 && tab && (
            <motion.section
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <div className="mb-8 text-center">
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">難易度を選択</h2>
                <p className="mt-1 text-sm text-slate-500">プロジェクト規模が大きいほど、トラブルと責任が増加します。</p>
              </div>
              <div className={`grid gap-4 ${tab === 'dev' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2'}`}>
                {difficultiesByTab[tab].map((id) => {
                  const config = difficultyConfigs[id];
                  const isLocked = id === 'ultra' && !ultraUnlocked;
                  const isSelected = selectedDifficulty === id;
                  const stars = starCount[id] ?? 1;
                  const isWarning = WARNING_DIFFICULTIES.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => selectDifficulty(id)}
                      disabled={isLocked}
                      className={`relative overflow-hidden rounded-lg border-2 p-5 text-left transition ${
                        isLocked
                          ? 'cursor-not-allowed border-slate-200 bg-slate-100 opacity-60'
                          : isSelected
                          ? isWarning
                            ? 'border-orange-400 bg-orange-50 shadow-md'
                            : 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      {/* top accent */}
                      {!isLocked && (
                        <div
                          className="absolute inset-x-0 top-0 h-1"
                          style={{ background: isWarning ? '#f97316' : '#2563eb' }}
                        />
                      )}
                      {isSelected && !isLocked && (
                        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                          ✓
                        </span>
                      )}
                      {isLocked && (
                        <span className="absolute right-3 top-3 rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                          権限なし
                        </span>
                      )}
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-bold ${
                          isWarning ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {config.badge}
                        </span>
                        {isWarning && (
                          <span className="inline-block rounded border border-orange-300 bg-orange-50 px-1.5 py-0.5 text-[10px] font-bold text-orange-700">
                            ⚠ 炎上注意
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-amber-500">
                        {'★'.repeat(stars)}{'☆'.repeat(Math.max(0, 4 - stars))}
                      </p>
                      <p className="mt-1 text-base font-bold text-slate-800">{config.label}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{config.weeks}週間 / {config.teamSize}名</p>
                      <p className="mt-2 text-xs leading-5 text-slate-600">{config.description}</p>
                      {isLocked && config.unlockCondition && (
                        <p className="mt-2 text-xs text-slate-500">
                          <span className="font-semibold text-slate-600">解放条件:</span> {config.unlockCondition.label}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="rounded border border-slate-300 px-8 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-800"
                >
                  ← 戻る
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!selectedDifficulty}
                  className={`rounded px-10 py-3 text-sm font-bold transition ${
                    selectedDifficulty
                      ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                      : 'cursor-not-allowed bg-slate-200 text-slate-400'
                  }`}
                >
                  次へ →
                </button>
              </div>
            </motion.section>
          )}

          {/* ── STEP 3: プロジェクト選択 ── */}
          {step === 3 && selectedDifficulty && (
            <motion.section
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <div className="mb-8 text-center">
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">担当するプロジェクトを選択</h2>
                <p className="mt-1 text-sm text-slate-500">プロジェクトによって、初期状況や難所が変わります。</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projectThemes[selectedDifficulty].map((theme) => {
                  const isSelected = selectedThemeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedThemeId(theme.id)}
                      className={`relative rounded-lg border-2 p-5 text-left transition hover:shadow-sm ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                          ✓
                        </span>
                      )}
                      {theme.category && (
                        <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                          {theme.category}
                        </span>
                      )}
                      <p className="mt-2 text-sm font-bold leading-snug text-slate-800">{theme.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{theme.client}</p>
                      <p className="mt-2 text-xs leading-5 text-slate-600">{theme.description}</p>
                      {Object.keys(theme.statModifiers).length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {Object.entries(theme.statModifiers).map(([k, v]) => {
                            const pos = (v ?? 0) > 0;
                            return (
                              <span
                                key={k}
                                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                                  pos ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                }`}
                              >
                                {pos ? '↑' : '↓'}{statLabels[k]}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="rounded border border-slate-300 px-8 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-800"
                >
                  ← 戻る
                </button>
                <motion.button
                  type="button"
                  onClick={handleStart}
                  disabled={!selectedThemeId}
                  animate={selectedThemeId ? { scale: [1, 1.03, 1] } : undefined}
                  transition={selectedThemeId ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : undefined}
                  className={`rounded px-10 py-3 text-sm font-bold transition ${
                    selectedThemeId
                      ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                      : 'cursor-not-allowed bg-slate-200 text-slate-400'
                  }`}
                >
                  ゲーム開始 →
                </motion.button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
