'use client';

import { motion } from 'framer-motion';
import type { GameState } from '../../lib/types';

const getHealthLabel = (score: number) => {
  if (score >= 80) return '安定';
  if (score >= 60) return '要注意';
  return '要対応';
};

export function DashboardHeroPanel({
  state,
  xp,
  level,
  streak,
  nextAction,
}: {
  state: GameState;
  xp: number;
  level: number;
  streak: number;
  nextAction: string;
}) {
  const totalScore = Math.round(
    (state.quality + state.cost + Math.max(0, state.schedule + 50) + state.stakeholder + state.morale) / 5
  );
  const healthLabel = getHealthLabel(totalScore);
  const xpProgress = Math.min(100, (xp % 120) / 120 * 100);

  return (
    <motion.section
      className="space-y-6"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div
        className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white shadow-soft ring-1 ring-white/10 md:p-8"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">PM ダッシュボード</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">今週のプロジェクト状況</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              重要なKPIと学習ステータスを3秒で把握し、次の意思決定に迷わない構成です。
            </p>
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-3 lg:w-[420px]">
            {[
              { title: 'PMレベル', value: `Lv ${level}`, subtitle: `経験値 ${xp} XP` },
              { title: '連続記録', value: `${streak} 日`, subtitle: '学習継続中' },
              { title: '総合状態', value: healthLabel, subtitle: `スコア ${totalScore}` },
            ].map((item) => (
              <motion.div
                key={item.title}
                className="rounded-3xl bg-slate-900/95 p-4 text-center"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">{item.title}</p>
                <p className="mt-3 text-3xl font-semibold">{item.value}</p>
                <p className="mt-1 text-sm text-slate-400">{item.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {[
            { label: '品質', hint: '成果物の出来栄え', value: state.quality, color: 'from-cyan-400 to-slate-400' },
            { label: '残予算', hint: '予算の余裕度', value: state.cost, color: 'from-slate-400 to-slate-500' },
            { label: 'スケジュール', hint: '工程の余裕度', value: Math.max(0, state.schedule + 50), color: 'from-blue-400 to-blue-600' },
            { label: '満足度', hint: '顧客の信頼レベル', value: state.stakeholder, color: 'from-emerald-400 to-emerald-600' },
          ].map((item) => (
            <div key={item.label} className="overflow-hidden rounded-3xl bg-slate-900/80 p-4 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{item.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{item.hint}</p>
              <div className="mt-3 flex items-end justify-between gap-4">
                <p className="text-2xl font-semibold">{item.value}</p>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">KPI</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-500`} style={{ width: `${Math.min(item.value, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>

        <motion.div
          className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.9)] sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-100">次のアクション</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{nextAction}</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-100"
            >
              詳細を確認する
            </button>
          </div>
          <div className="mt-4 rounded-3xl bg-slate-900/90 p-4 text-slate-300">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.32em] text-slate-500">
              <span>次LVまでのXP</span>
              <span>{Math.round(xpProgress)}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
