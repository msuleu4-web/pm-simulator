'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Dispatch } from 'react';
import type { GameAction, TeamMember } from '../../lib/types';
import { allTeamMembers } from '../../lib/teamMembers';
import { calculateFit, hiringCostKpi, fitLabel } from '../../lib/hireUtils';

type HireResult = {
  member: TeamMember;
  qualityDelta: number;
  moraleDelta: number;
  fitLevel: string;
  costPaid: number;
};

type FilterRole = 'all' | string;

export function HiringPanel({
  currentMembers,
  currentPhaseId,
  currentCost,
  dispatch,
}: {
  currentMembers: TeamMember[];
  currentPhaseId: string;
  currentCost: number;
  dispatch: Dispatch<GameAction>;
}) {
  const [filterRole, setFilterRole] = useState<FilterRole>('all');
  const [lastResult, setLastResult] = useState<HireResult | null>(null);

  const hiredIds = new Set(currentMembers.map(m => m.id));
  const candidates = useMemo(
    () => allTeamMembers
      .filter(m => !hiredIds.has(m.id))
      .map(m => ({ member: m, fit: calculateFit(m, currentMembers, currentPhaseId), cost: hiringCostKpi(m) }))
      .sort((a, b) => b.fit.score - a.fit.score),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentMembers.length, currentPhaseId]
  );

  const availableRoles = [...new Set(candidates.map(c => c.member.role))].sort();

  const filtered = filterRole === 'all'
    ? candidates
    : candidates.filter(c => c.member.role === filterRole);

  const handleHire = (item: typeof candidates[number]) => {
    setLastResult({
      member: item.member,
      qualityDelta: item.fit.qualityDelta,
      moraleDelta: item.fit.moraleDelta,
      fitLevel: fitLabel[item.fit.level].text,
      costPaid: item.cost,
    });
    dispatch({ type: 'hireTeamMember', memberId: item.member.id, phaseId: currentPhaseId });
  };

  const skillLevelBar = (level: number) => (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <div key={i} className={`h-1.5 w-3 rounded-full ${i <= level ? 'bg-brand-500' : 'bg-slate-200'}`} />
      ))}
    </div>
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700">採用ダッシュボード</p>
          <p className="mt-1 text-sm text-slate-500">
            候補者を採用してチームを強化できます。採用には予算が必要です。
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">現在の予算KPI</p>
          <p className={`text-2xl font-bold ${currentCost < 30 ? 'text-red-600' : 'text-slate-900'}`}>{currentCost}</p>
        </div>
      </div>

      {/* 採用結果フィードバック */}
      <AnimatePresence>
        {lastResult && (
          <motion.div
            key={lastResult.member.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-sky-600">採用完了</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {lastResult.member.name}（{lastResult.member.role}）を採用しました
                </p>
                <div className="mt-1.5 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">
                    フィット: {lastResult.fitLevel}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 font-semibold ${lastResult.qualityDelta >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    品質 {lastResult.qualityDelta >= 0 ? '+' : ''}{lastResult.qualityDelta}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 font-semibold ${lastResult.moraleDelta >= 0 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                    士気 {lastResult.moraleDelta >= 0 ? '+' : ''}{lastResult.moraleDelta}
                  </span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
                    予算 -{lastResult.costPaid}
                  </span>
                </div>
              </div>
              <button type="button" onClick={() => setLastResult(null)} className="shrink-0 text-slate-400 hover:text-slate-600">✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ロールフィルター */}
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilterRole('all')}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${filterRole === 'all' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          全員 ({candidates.length})
        </button>
        {availableRoles.map(role => {
          const count = candidates.filter(c => c.member.role === role).length;
          return (
            <button
              key={role}
              type="button"
              onClick={() => setFilterRole(role)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${filterRole === role ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {role} ({count})
            </button>
          );
        })}
      </div>

      {/* 候補者リスト */}
      <div className="mt-4 space-y-3">
        {filtered.slice(0, 12).map((item, i) => {
          const fl = fitLabel[item.fit.level];
          const canAfford = currentCost >= item.cost;
          return (
            <motion.div
              key={item.member.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className={`rounded-2xl border p-4 transition ${
                item.fit.level === 'excellent'
                  ? 'border-emerald-200 bg-emerald-50/50'
                  : item.fit.level === 'poor'
                  ? 'border-slate-200 bg-slate-50 opacity-75'
                  : 'border-blue-200 bg-blue-50/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900">{item.member.name}</p>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{item.member.role}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{item.member.affiliation}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${fl.color}`}>{fl.stars} {fl.text}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">得意: {item.member.specialty} ／ 苦手: {item.member.weakness}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-500">スキル</span>
                      {skillLevelBar(item.member.skillLevel)}
                    </div>
                    <span className="text-xs text-slate-400">経験 {item.member.experienceYears}年</span>
                  </div>
                  {/* フィット理由 */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.fit.reasons.map((r, ri) => (
                      <span key={ri} className="rounded-full bg-white/70 px-2 py-0.5 text-xs text-slate-600 border border-slate-200">{r}</span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-xs text-slate-500">採用コスト</p>
                  <p className={`text-lg font-bold ${canAfford ? 'text-slate-900' : 'text-red-400'}`}>
                    -{item.cost}
                  </p>
                  <div className="mt-1 flex flex-col gap-1 text-xs">
                    <span className={`${item.fit.qualityDelta >= 0 ? 'text-emerald-600' : 'text-red-600'} font-semibold`}>
                      品質 {item.fit.qualityDelta >= 0 ? '+' : ''}{item.fit.qualityDelta}
                    </span>
                    <span className={`${item.fit.moraleDelta >= 0 ? 'text-blue-600' : 'text-red-600'} font-semibold`}>
                      士気 {item.fit.moraleDelta >= 0 ? '+' : ''}{item.fit.moraleDelta}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleHire(item)}
                    disabled={!canAfford}
                    className={`mt-3 rounded-xl px-4 py-2 text-xs font-bold transition ${
                      canAfford
                        ? item.fit.level === 'excellent'
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : item.fit.level === 'good'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-slate-500 text-white hover:bg-slate-600'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? '採用する' : '予算不足'}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <p className="py-6 text-center text-sm text-slate-400">このロールの候補者はいません</p>
        )}
        {filtered.length > 12 && (
          <p className="text-center text-xs text-slate-400">フィルターで絞り込むと上位12名を表示します</p>
        )}
      </div>
    </div>
  );
}
