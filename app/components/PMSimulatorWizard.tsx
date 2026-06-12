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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 px-4 py-10 text-white">
      {/* ── 背景：システム構成図風イラスト ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          className="absolute bottom-0 left-1/2 h-[640px] w-[1400px] -translate-x-1/2 text-slate-400 opacity-[0.22]"
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMax meet"
          aria-hidden="true"
        >
          <defs>
            <symbol id="ic-gear" viewBox="-12 -12 24 24">
              <circle r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <g stroke="currentColor" strokeWidth="1.5">
                <line x1="0" y1="-11" x2="0" y2="-8" />
                <line x1="0" y1="11" x2="0" y2="8" />
                <line x1="-11" y1="0" x2="-8" y2="0" />
                <line x1="11" y1="0" x2="8" y2="0" />
                <line x1="-7.8" y1="-7.8" x2="-5.6" y2="-5.6" />
                <line x1="7.8" y1="7.8" x2="5.6" y2="5.6" />
                <line x1="-7.8" y1="7.8" x2="-5.6" y2="5.6" />
                <line x1="7.8" y1="-7.8" x2="5.6" y2="-5.6" />
              </g>
            </symbol>
            <symbol id="ic-people" viewBox="-14 -12 28 24">
              <circle cx="-5" cy="-5" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M-11,9 q0,-8 6,-8 q6,0 6,8 z" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="5" cy="-5" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M-1,9 q0,-8 6,-8 q6,0 6,8 z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </symbol>
            <symbol id="ic-doc" viewBox="-10 -12 20 24">
              <rect x="-8" y="-11" width="16" height="22" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <line x1="-5" y1="-5" x2="5" y2="-5" stroke="currentColor" strokeWidth="1.2" />
              <line x1="-5" y1="-1" x2="5" y2="-1" stroke="currentColor" strokeWidth="1.2" />
              <line x1="-5" y1="3" x2="5" y2="3" stroke="currentColor" strokeWidth="1.2" />
              <line x1="-5" y1="7" x2="2" y2="7" stroke="currentColor" strokeWidth="1.2" />
            </symbol>
            <symbol id="ic-db" viewBox="-12 -13 24 26">
              <ellipse cx="0" cy="-7" rx="10" ry="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M-10,-7 v14 a10,3.5 0 0 0 20,0 v-14" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M-10,-1 a10,3.5 0 0 0 20,0" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </symbol>
            <symbol id="ic-chart" viewBox="-12 -12 24 24">
              <rect x="-10" y="-10" width="20" height="20" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <rect x="-6" y="0" width="3" height="6" fill="currentColor" />
              <rect x="-1.5" y="-4" width="3" height="10" fill="currentColor" />
              <rect x="3" y="-7" width="3" height="13" fill="currentColor" />
            </symbol>
            <symbol id="ic-cloud" viewBox="-14 -10 28 20">
              <path d="M-10,4 a5,5 0 0 1 0,-10 a6,6 0 0 1 11,-2 a5,5 0 0 1 4,9.5 a4,4 0 0 1 -1,2.5 z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </symbol>
          </defs>

          {/* connector lines */}
          <g fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M115,300 H250" />
            <path d="M430,300 H530" />
            <path d="M710,300 H810" />
            <path d="M990,300 H1085" />
            <path d="M430,110 H530" />
            <path d="M710,110 H810" />
            <path d="M430,490 H530" />
            <path d="M710,490 H810" />
            <path d="M340,160 V250" />
            <path d="M340,350 V440" />
            <path d="M900,160 V250" />
            <path d="M900,350 V440" />
          </g>

          {/* hubs */}
          <circle cx="70" cy="300" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text x="70" y="305" textAnchor="middle" fontSize="15" fill="currentColor">PM</text>
          <circle cx="1130" cy="300" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text x="1130" y="305" textAnchor="middle" fontSize="15" fill="currentColor">顧客</text>

          {/* process boxes */}
          {[
            { x: 250, y: 60,  label: '要件管理',        icon: 'ic-doc' },
            { x: 530, y: 60,  label: '進捗管理',        icon: 'ic-chart' },
            { x: 810, y: 60,  label: 'リスク管理',      icon: 'ic-gear' },
            { x: 250, y: 250, label: '品質管理',        icon: 'ic-doc' },
            { x: 530, y: 250, label: 'チーム',          icon: 'ic-people', accent: true },
            { x: 810, y: 250, label: '予算管理',        icon: 'ic-chart' },
            { x: 250, y: 440, label: '成果物',          icon: 'ic-doc' },
            { x: 530, y: 440, label: 'データ基盤',      icon: 'ic-db' },
            { x: 810, y: 440, label: 'ステークホルダー', icon: 'ic-cloud' },
          ].map((box) => (
            <g key={box.label} className={box.accent ? 'text-emerald-400' : undefined}>
              <rect x={box.x} y={box.y} width="180" height="100" rx="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <use href={`#${box.icon}`} x={box.x + 36} y={box.y + 38} width="28" height="28" />
              <text x={box.x + 90} y={box.y + 78} textAnchor="middle" fontSize="15" fill="currentColor">{box.label}</text>
            </g>
          ))}
        </svg>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
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
