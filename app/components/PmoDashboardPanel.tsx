'use client';

import { motion } from 'framer-motion';
import type { GameState } from '../../lib/types';
import { difficultyConfigs } from '../../lib/difficultyConfig';

// PMOモードではKPIを文脈に合わせてリマップ
const kpiConfig = [
  { key: 'quality' as const,      label: '標準化レベル',    hint: 'プロセス・報告の統一度',    color: 'from-indigo-400 to-indigo-600' },
  { key: 'cost' as const,         label: 'PMO工数',         hint: '残キャパシティ',             color: 'from-slate-400 to-slate-500'  },
  { key: 'schedule' as const,     label: '横断進行',         hint: '課題解決の進捗状況',        color: 'from-blue-400 to-blue-600'    },
  { key: 'stakeholder' as const,  label: '現場信頼度',       hint: 'PMたちからの信頼レベル',    color: 'from-emerald-400 to-emerald-600' },
  { key: 'morale' as const,       label: '経営層信頼度',     hint: '経営・スポンサーからの評価', color: 'from-violet-400 to-violet-600' },
];

const authorityLabel: Record<string, { text: string; color: string; desc: string }> = {
  'pmo-support':    { text: '支援型', color: 'bg-indigo-100 text-indigo-700',  desc: '提案・説得のみ' },
  'pmo-control':    { text: '統制型', color: 'bg-blue-100 text-blue-700',      desc: '是正要求あり' },
  'pmo-directive':  { text: '指揮型', color: 'bg-violet-100 text-violet-700',  desc: '差止・承認権あり' },
};

const getCareerLevel = (stakeholder: number, morale: number) => {
  const influence = (stakeholder + morale) / 2;
  if (influence >= 70) return { label: '参謀型', color: 'bg-violet-100 text-violet-800', emoji: '🏛️' };
  if (influence >= 50) return { label: '管理実行型', color: 'bg-blue-100 text-blue-800', emoji: '⚙️' };
  return { label: '事務局型', color: 'bg-slate-100 text-slate-700', emoji: '📋' };
};

export function PmoDashboardPanel({
  state,
  xp,
  level,
  streak,
}: {
  state: GameState;
  xp: number;
  level: number;
  streak: number;
}) {
  const config = difficultyConfigs[state.difficulty];
  const authority = authorityLabel[state.difficulty];
  const career = getCareerLevel(state.stakeholder, state.morale);
  const knowledgeBase = state.pmMental; // pmMentalをナレッジ蓄積に流用
  const xpProgress = Math.min(100, (xp % 120) / 120 * 100);

  // schedule KPI正規化 (-100~100 → 0~100)
  const getValue = (key: typeof kpiConfig[number]['key']): number => {
    if (key === 'schedule') return Math.max(0, state.schedule + 50);
    return state[key];
  };

  return (
    <motion.section
      className="space-y-6"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div
        className="rounded-[2rem] bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-950 p-6 text-white shadow-soft ring-1 ring-white/10 md:p-8"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">PMOダッシュボード</p>
              {authority && (
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${authority.color}`}>
                  {authority.text} — {authority.desc}
                </span>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              プロジェクトマネジメントオフィス
            </h1>
            <p className="mt-3 text-sm leading-6 text-indigo-200 sm:text-base">
              複数のプロジェクトを横断的に支援し、組織のプロジェクト成功率を高める。
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid w-full gap-3 sm:grid-cols-3 lg:w-[420px]">
            {[
              { title: 'PMOレベル', value: `Lv ${level}`, sub: `${xp} XP` },
              { title: 'キャリア', value: `${career.emoji} ${career.label}`, sub: '横断影響力' },
              { title: '活動実績', value: `${streak} 日`, sub: 'PMO継続中' },
            ].map(item => (
              <motion.div
                key={item.title}
                className="rounded-3xl bg-indigo-900/80 p-4 text-center"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">{item.title}</p>
                <p className="mt-2 text-2xl font-semibold leading-tight">{item.value}</p>
                <p className="mt-1 text-xs text-indigo-300">{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* KPI Metrics — PMO context */}
        <div className="mt-6 grid gap-4 sm:grid-cols-5">
          {kpiConfig.map(item => {
            const val = getValue(item.key);
            return (
              <div key={item.key} className="overflow-hidden rounded-3xl bg-indigo-900/60 p-4 transition hover:-translate-y-0.5 hover:bg-indigo-800/80">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-300">{item.label}</p>
                <p className="mt-0.5 text-xs text-indigo-400">{item.hint}</p>
                <div className="mt-3 flex items-end justify-between">
                  <p className="text-2xl font-semibold">{val}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${val >= 70 ? 'bg-emerald-900/60 text-emerald-300' : val >= 50 ? 'bg-amber-900/60 text-amber-300' : 'bg-red-900/60 text-red-300'}`}>
                    {val >= 70 ? '良好' : val >= 50 ? '注意' : '危険'}
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-indigo-950">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                    style={{ width: `${Math.min(val, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ナレッジ蓄積 + XP bar */}
        <motion.div
          className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-indigo-400">
                <span>ナレッジ蓄積</span>
                <span>{knowledgeBase}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-indigo-950">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 transition-all duration-500"
                  style={{ width: `${Math.min(knowledgeBase, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-indigo-400">
                {knowledgeBase >= 70 ? '過去の失敗が組織の教材になっている' :
                 knowledgeBase >= 40 ? 'ナレッジの蓄積が進んでいる' :
                 '知識が属人化している。ドキュメント化が急務'}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-indigo-400">
                <span>次レベルまでのXP</span>
                <span>{Math.round(xpProgress)}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-indigo-950">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-indigo-400">
                {career.label}として活動中 — {config.label} ({config.weeks}週)
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
