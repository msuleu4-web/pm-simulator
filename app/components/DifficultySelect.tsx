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

const projectTabMeta: Record<ProjectTab, { label: string; icon: string; description: string; color: keyof typeof colorMap }> = {
  dev:    { label: '新規開発',         icon: '🆕', description: 'ゼロから新しいシステムを開発するプロジェクト', color: 'emerald' },
  maint:  { label: '保守・運用（PM）', icon: '🔧', description: '既存システムの保守・運用を行うプロジェクト',   color: 'blue'    },
  member: { label: '開発メンバー',     icon: '👥', description: '開発チームの一員としてプロジェクトに参加',     color: 'violet'  },
  pmo:    { label: 'PMO',             icon: '📊', description: '複数のプロジェクトを支援・統制する立場',       color: 'indigo'  },
};

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

        {/* ── ① RPGゲーム ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mt-10 overflow-hidden rounded-3xl shadow-xl transition hover:shadow-2xl"
          style={{ backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #312e81 50%, #1e3a8a 100%)' }}
        >
          <div className="flex flex-col gap-6 p-7 sm:p-10 lg:flex-row lg:items-center lg:gap-10">
            <div className="flex-1">
              <span className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white">
                RPGゲーム
              </span>
              <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">配属先は、現場</h2>
              <p className="mt-1 text-sm font-semibold text-blue-300">SIer現場体験ストーリーRPG</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                新人SEとして2Dマップを歩き、NPCに話しかけながら現場の判断を体験する物語型RPG。要件定義・基本設計・テスト・炎上対応・リリースまで全5章。
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['🗺️ マップ探索', '💬 選択肢分岐', '📖 教育ポイント解説', '⏱️ 約15分'].map((tag) => (
                  <span key={tag} className="rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-300">{tag}</span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/game"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:from-blue-400 hover:to-purple-400"
                >
                  🎮 ゲームをプレイする <span className="text-base">→</span>
                </a>
                <a
                  href="/game"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-500 px-6 py-3 text-sm font-bold text-slate-200 transition hover:border-slate-300 hover:text-white"
                >
                  詳細をみる
                </a>
              </div>
            </div>

            {/* アイソメトリック風オフィスビル */}
            <div className="mx-auto w-full max-w-[260px] shrink-0 lg:mx-0 lg:w-64">
              <svg viewBox="0 0 240 200" className="h-auto w-full" role="img" aria-label="オフィスビルのイラスト">
                <ellipse cx="130" cy="178" rx="100" ry="14" fill="#0f172a" opacity="0.35" />
                {/* building */}
                <polygon points="70,30 170,30 205,55 105,55" fill="#e2e8f0" />
                <polygon points="70,30 105,55 105,165 70,145" fill="#94a3b8" />
                <polygon points="105,55 205,55 205,165 105,165" fill="#cbd5e1" />
                {/* windows */}
                <rect x="118" y="70" width="18" height="18" rx="2" fill="#7dd3fc" />
                <rect x="160" y="70" width="18" height="18" rx="2" fill="#7dd3fc" />
                <rect x="118" y="102" width="18" height="18" rx="2" fill="#7dd3fc" />
                <rect x="160" y="102" width="18" height="18" rx="2" fill="#7dd3fc" />
                <rect x="80" y="72" width="14" height="16" rx="2" fill="#bae6fd" />
                <rect x="80" y="104" width="14" height="16" rx="2" fill="#bae6fd" />
                {/* door */}
                <rect x="138" y="138" width="26" height="27" rx="2" fill="#475569" />
                {/* trees */}
                <rect x="26" y="150" width="6" height="22" fill="#92744f" />
                <circle cx="29" cy="140" r="18" fill="#6ee7b7" />
                <circle cx="18" cy="150" r="12" fill="#34d399" />
                <rect x="205" y="158" width="5" height="18" fill="#92744f" />
                <circle cx="208" cy="150" r="14" fill="#4ade80" />
                {/* character */}
                <circle cx="58" cy="170" r="6" fill="#1e293b" />
                <rect x="53" y="176" width="10" height="14" rx="3" fill="#3b82f6" />
                {/* signpost */}
                <rect x="180" y="172" width="3" height="16" fill="#a8856a" />
                <rect x="172" y="164" width="20" height="10" rx="1" fill="#e7d3b3" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* ── 区切り ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="my-8 flex items-center gap-4"
        >
          <div className="h-px flex-1 bg-slate-200" />
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">または</p>
          <div className="h-px flex-1 bg-slate-200" />
        </motion.div>

        {/* ── ② PMシミュレーター ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-md transition hover:shadow-xl"
        >
          <div className="flex flex-col gap-6 p-7 sm:p-10 lg:flex-row lg:items-center lg:gap-10">
            <div className="flex-1">
              <span className="inline-block rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white">
                シミュレーションゲーム
              </span>
              <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">PMシミュレーター</h2>
              <p className="mt-1 text-sm font-semibold text-emerald-600">プロジェクトマネジメント体験シミュレーション</p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                プロジェクトの種類と難易度を選び、納期・品質・コストのバランスを取りながらプロジェクトを成功に導くシミュレーションゲーム。
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['📋 プロジェクト管理', '📈 リソース配分', '👥 リスク対応', '⏱ 約20〜30分'].map((tag) => (
                  <span key={tag} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">{tag}</span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#pm-simulator-select"
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:bg-emerald-700"
                >
                  ▶ シミュレーターをプレイする <span className="text-base">→</span>
                </a>
                <a
                  href="#pm-simulator-select"
                  className="inline-flex items-center justify-center rounded-2xl border border-emerald-300 px-6 py-3 text-sm font-bold text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50"
                >
                  詳細をみる
                </a>
              </div>
            </div>

            {/* ダッシュボード風イラスト */}
            <div className="mx-auto w-full max-w-xs shrink-0 lg:mx-0 lg:w-64">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 sm:p-5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex-1 space-y-2.5">
                    <div className="h-2.5 w-full rounded-full bg-white">
                      <div className="h-2.5 w-4/5 rounded-full bg-blue-400" />
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-white">
                      <div className="h-2.5 w-3/5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-white">
                      <div className="h-2.5 w-2/3 rounded-full bg-amber-400" />
                    </div>
                  </div>
                  <div
                    className="h-16 w-16 shrink-0 rounded-full ring-4 ring-white"
                    style={{ background: 'conic-gradient(#34d399 0% 45%, #60a5fa 45% 75%, #fbbf24 75% 100%)' }}
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-lg">
                  <div className="rounded-xl bg-white py-2 shadow-sm">👥</div>
                  <div className="rounded-xl bg-white py-2 shadow-sm">💰</div>
                  <div className="rounded-xl bg-white py-2 shadow-sm">📈</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── PMシミュレーターを始める ── */}
        <motion.div
          id="pm-simulator-select"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mb-8 mt-12 scroll-mt-6 text-center"
        >
          <h2 className="text-2xl font-bold text-slate-900">PMシミュレーターを始める</h2>
          <p className="mt-2 text-sm text-slate-500">プロジェクトタイプと難易度を選択してください。</p>
        </motion.div>

        {/* STEP 1/2: プロジェクトタイプ */}
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">STEP 1 / 2</p>
          <p className="mb-4 text-lg font-bold text-slate-900">プロジェクトタイプを選択</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(['dev', 'maint', 'member', 'pmo'] as ProjectTab[]).map((t) => {
              const meta = projectTabMeta[t];
              const colors = colorMap[meta.color];
              const isSelected = tab === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTabChange(t)}
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    isSelected ? `${colors.card} ring-2 ${colors.ring} shadow-md` : 'border-slate-200 bg-white hover:shadow-sm'
                  }`}
                >
                  <span className="text-2xl">{meta.icon}</span>
                  <p className="mt-2 text-sm font-bold text-slate-900">{meta.label}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{meta.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {tab === 'maint' && (
          <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50 px-5 py-3 text-center text-sm text-teal-800">
            保守・運用（PM）モードは<strong>既存システムの維持・障害対応・改善をPM視点で管理</strong>するモードです。
          </div>
        )}
        {tab === 'member' && (
          <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50 px-5 py-3 text-center text-sm text-teal-800">
            <strong>あなた自身が保守運用チームの一員</strong>として判断します。深夜アラート・属人化・SLAプレッシャー・評価されにくさ——現場エンジニアのリアルを体験してください。
          </div>
        )}
        {tab === 'pmo' && (
          <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-center text-sm text-indigo-800">
            PMOモードは<strong>複数プロジェクトを横断的に支援・標準化・ガバナンス</strong>する役割。PM（プロジェクト担当）ではなく<strong>PM支援の仕組みを作る</strong>側です。
          </div>
        )}

        {/* STEP 2 ボタン → 難易度セクションへ */}
        <div className="mt-6 flex justify-center">
          <a
            href="#pm-difficulty-select"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-black text-white shadow-lg transition hover:bg-emerald-700"
          >
            STEP 2: 難易度を選択する <span className="text-base">→</span>
          </a>
        </div>

        {/* Step 2/2: Difficulty */}
        <div id="pm-difficulty-select" className="mt-12 scroll-mt-6">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">STEP 2 / 2</p>
          <p className="mb-4 text-lg font-bold text-slate-900">難易度を選択</p>
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
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-500">プロジェクトを選択</p>
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
