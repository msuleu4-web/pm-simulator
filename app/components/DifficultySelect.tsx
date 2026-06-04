'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Difficulty } from '../../lib/types';
import { difficultyConfigs, projectThemes } from '../../lib/difficultyConfig';

const colorMap = {
  emerald: { card: 'border-emerald-300 bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700', btn: 'bg-emerald-600 hover:bg-emerald-700', ring: 'ring-emerald-400', header: 'text-emerald-700' },
  blue:    { card: 'border-blue-300 bg-blue-50',       badge: 'bg-blue-100 text-blue-700',       btn: 'bg-blue-600 hover:bg-blue-700',       ring: 'ring-blue-400',    header: 'text-blue-700'    },
  orange:  { card: 'border-orange-300 bg-orange-50',   badge: 'bg-orange-100 text-orange-700',   btn: 'bg-orange-600 hover:bg-orange-700',   ring: 'ring-orange-400',  header: 'text-orange-700'  },
  violet:  { card: 'border-violet-300 bg-violet-50',   badge: 'bg-violet-100 text-violet-700',   btn: 'bg-violet-600 hover:bg-violet-700',   ring: 'ring-violet-400',  header: 'text-violet-700'  },
  teal:    { card: 'border-teal-300 bg-teal-50',       badge: 'bg-teal-100 text-teal-700',       btn: 'bg-teal-600 hover:bg-teal-700',       ring: 'ring-teal-400',    header: 'text-teal-700'    },
  indigo:  { card: 'border-indigo-300 bg-indigo-50',   badge: 'bg-indigo-100 text-indigo-700',   btn: 'bg-indigo-600 hover:bg-indigo-700',   ring: 'ring-indigo-400',  header: 'text-indigo-700'  },
} as const;

const devDifficulties: Difficulty[] = ['easy', 'normal', 'hard', 'ultra'];
const maintDifficulties: Difficulty[] = ['maint-easy', 'maint-hard'];
const pmoDifficulties: Difficulty[] = ['pmo-support', 'pmo-control', 'pmo-directive'];
const memberDifficulties: Difficulty[] = ['ops-easy', 'ops-normal', 'ops-hard'];
const starCount: Partial<Record<Difficulty, number>> = {
  easy: 1, normal: 2, hard: 3, ultra: 4,
  'maint-easy': 1, 'maint-hard': 3,
  'pmo-support': 1, 'pmo-control': 2, 'pmo-directive': 3,
  'ops-easy': 1, 'ops-normal': 2, 'ops-hard': 3,
};

type ProjectTab = 'dev' | 'maint' | 'pmo' | 'member';

export function DifficultySelect({
  onStart,
  ultraUnlocked,
}: {
  onStart: (difficulty: Difficulty, projectThemeId: string) => void;
  ultraUnlocked: boolean;
}) {
  const [tab, setTab] = useState<ProjectTab>('dev');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  const handleTabChange = (t: ProjectTab) => {
    setTab(t);
    setSelectedDifficulty(null);
    setSelectedThemeId(null);
  };

  const handleDifficultyClick = (difficulty: Difficulty) => {
    const isLocked = difficulty === 'ultra' && !ultraUnlocked;
    if (isLocked) return;
    setSelectedDifficulty(difficulty);
    setSelectedThemeId(null);
  };

  const handleStart = () => {
    if (selectedDifficulty && selectedThemeId) {
      onStart(selectedDifficulty, selectedThemeId);
    }
  };

  const currentList =
    tab === 'dev' ? devDifficulties :
    tab === 'maint' ? maintDifficulties :
    tab === 'pmo' ? pmoDifficulties :
    memberDifficulties;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">PM シミュレーター</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">プロジェクトタイプと難易度を選択</h1>
          <p className="mt-3 text-slate-500">まずプロジェクトの種類を選び、難易度とプロジェクトを決めてください。</p>
        </motion.div>

        {/* Tab: 新規開発 vs 保守運用 */}
        <div className="mt-8 flex justify-center gap-2">
          {(['dev', 'maint', 'member', 'pmo'] as ProjectTab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTabChange(t)}
              className={`rounded-2xl px-6 py-2.5 text-sm font-bold transition ${
                tab === t
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t === 'dev' ? '新規開発' : t === 'maint' ? '保守・運用（PM）' : t === 'member' ? '開発メンバー' : 'PMO'}
            </button>
          ))}
        </div>

        {tab === 'maint' && (
          <div className="mt-3 rounded-2xl border border-teal-200 bg-teal-50 px-5 py-3 text-center text-sm text-teal-800">
            保守・運用（PM）モードは<strong>既存システムの維持・障害対応・改善をPM視点で管理</strong>するモードです。
          </div>
        )}
        {tab === 'member' && (
          <div className="mt-3 rounded-2xl border border-teal-200 bg-teal-50 px-5 py-3 text-center text-sm text-teal-800">
            <strong>あなた自身が保守運用チームの一員</strong>として判断します。深夜アラート・属人化・SLAプレッシャー・評価されにくさ——現場エンジニアのリアルを体験してください。
          </div>
        )}
        {tab === 'pmo' && (
          <div className="mt-3 rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-center text-sm text-indigo-800">
            PMOモードは<strong>複数プロジェクトを横断的に支援・標準化・ガバナンス</strong>する役割。PM（プロジェクト担当）ではなく<strong>PM支援の仕組みを作る</strong>側です。
          </div>
        )}

        {/* Step 1: Difficulty */}
        <div className="mt-8">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-500">Step 1 — 難易度</p>
          <div className={`grid gap-4 ${tab === 'dev' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2'}`}>
            {currentList.map((id, i) => {
              const config = difficultyConfigs[id];
              const colors = colorMap[config.color as keyof typeof colorMap];
              const isLocked = id === 'ultra' && !ultraUnlocked;
              const isSelected = selectedDifficulty === id;
              const stars = starCount[id] ?? 1;

              return (
                <motion.button
                  key={id}
                  type="button"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.07 }}
                  onClick={() => handleDifficultyClick(id)}
                  disabled={isLocked}
                  className={`relative rounded-3xl border-2 p-5 text-left transition ${
                    isLocked
                      ? 'cursor-not-allowed border-slate-200 bg-slate-100 opacity-60'
                      : isSelected
                      ? `${colors.card} ring-2 ${colors.ring} shadow-lg`
                      : `border-slate-200 bg-white hover:shadow-md`
                  }`}
                >
                  {isLocked && <span className="absolute right-3 top-3 text-lg">🔒</span>}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${colors.badge}`}>{config.badge}</span>
                    <span className="text-sm text-amber-400">{'★'.repeat(stars)}</span>
                  </div>
                  <p className={`mt-3 text-lg font-bold ${colors.header}`}>{config.label}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{config.weeks}週間 · {config.phaseCount}フェーズ · {config.teamSize}名</p>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{config.description}</p>
                  {isLocked && config.unlockCondition && (
                    <p className="mt-3 text-xs text-slate-400">🔓 {config.unlockCondition.label}</p>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Project Theme */}
        {selectedDifficulty && (
          <motion.div key={selectedDifficulty} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-8">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-500">Step 2 — プロジェクト選択</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {projectThemes[selectedDifficulty].map((theme, i) => {
                const config = difficultyConfigs[selectedDifficulty];
                const colors = colorMap[config.color as keyof typeof colorMap];
                const isSelected = selectedThemeId === theme.id;

                return (
                  <motion.button
                    key={theme.id}
                    type="button"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.22, delay: i * 0.04 }}
                    onClick={() => setSelectedThemeId(theme.id)}
                    className={`rounded-2xl border-2 p-4 text-left transition ${
                      isSelected
                        ? `${colors.card} ring-2 ${colors.ring} shadow-md`
                        : 'border-slate-200 bg-white hover:shadow-sm hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-slate-900 leading-snug">{theme.title}</p>
                      {theme.category && (
                        <span className="shrink-0 rounded-full bg-teal-100 px-2 py-0.5 text-xs font-bold text-teal-700">{theme.category}</span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{theme.client}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-600">{theme.description}</p>
                    {Object.keys(theme.statModifiers).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {Object.entries(theme.statModifiers).map(([k, v]) => {
                          const labels: Record<string, string> = { quality: '品質', cost: '予算', schedule: '納期', stakeholder: '顧客満足', morale: '士気' };
                          const pos = (v ?? 0) > 0;
                          return (
                            <span key={k} className={`rounded-full px-2 py-0.5 text-xs font-semibold ${pos ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                              {pos ? '↑' : '↓'}{labels[k]}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Start Button */}
        {selectedDifficulty && selectedThemeId && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleStart}
              className={`rounded-3xl px-10 py-4 text-base font-bold text-white shadow-lg transition ${colorMap[difficultyConfigs[selectedDifficulty].color as keyof typeof colorMap].btn}`}
            >
              プロジェクトを開始する →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
