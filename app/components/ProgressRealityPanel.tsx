'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Dispatch } from 'react';
import type { GameAction, TeamMember } from '../../lib/types';

type Discovery = {
  name: string;
  reportedBefore: number;
  actual: number;
  gap: number;
};

const average = (values: number[]) =>
  values.length ? Math.round(values.reduce((s, v) => s + v, 0) / values.length) : 0;

const SHOW_LIMIT = 6;

export function ProgressRealityPanel({
  members,
  dispatch,
}: {
  members: TeamMember[];
  dispatch: Dispatch<GameAction>;
}) {
  const [lastDiscovery, setLastDiscovery] = useState<Discovery | null>(null);
  const [showAll, setShowAll] = useState(false);

  const avgReported = average(members.map((m) => m.reportedProgress));
  const avgActual = average(members.map((m) => m.actualProgress));
  const overstatementCount = members.filter((m) => m.reportedProgress - m.actualProgress >= 15).length;
  const syndromeCount = members.filter((m) => m.reportedProgress >= 90 && m.actualProgress <= 75).length;

  const sorted = [...members].sort(
    (a, b) => (b.reportedProgress - b.actualProgress) - (a.reportedProgress - a.actualProgress)
  );
  const displayed = showAll ? sorted : sorted.slice(0, SHOW_LIMIT);

  const handleVerify = (member: TeamMember) => {
    const gap = member.reportedProgress - member.actualProgress;
    setLastDiscovery({
      name: member.name,
      reportedBefore: member.reportedProgress,
      actual: member.actualProgress,
      gap,
    });
    dispatch({ type: 'verifyMemberProgress', memberId: member.id });
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700">進捗の見える化</p>
          <p className="mt-1 text-sm text-slate-500">自己申告と実態の差を確認し、90%症候群や報告癖をチェックします。</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${overstatementCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
          {overstatementCount} 件の差異
        </span>
      </div>

      {/* 裏取り結果フィードバック */}
      <AnimatePresence>
        {lastDiscovery && (
          <motion.div
            key={lastDiscovery.name + lastDiscovery.actual}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className={`mt-4 rounded-2xl border px-4 py-3 ${
              lastDiscovery.gap >= 15
                ? 'border-red-200 bg-red-50'
                : lastDiscovery.gap >= 5
                ? 'border-amber-200 bg-amber-50'
                : 'border-emerald-200 bg-emerald-50'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest ${lastDiscovery.gap >= 15 ? 'text-red-600' : lastDiscovery.gap >= 5 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  📋 裏取り結果
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{lastDiscovery.name}</p>
                <p className="mt-0.5 text-sm text-slate-700">
                  申告 <span className="font-bold">{lastDiscovery.reportedBefore}%</span>
                  {' → '}
                  実態 <span className={`font-bold ${lastDiscovery.gap >= 10 ? 'text-red-600' : 'text-slate-900'}`}>{lastDiscovery.actual}%</span>
                  {lastDiscovery.gap !== 0 && (
                    <span className={`ml-2 text-xs font-semibold ${lastDiscovery.gap > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      （差 {lastDiscovery.gap > 0 ? '+' : ''}{lastDiscovery.gap}%）
                    </span>
                  )}
                </p>
                <p className="mt-1.5 text-xs text-slate-600">
                  {lastDiscovery.gap >= 20
                    ? '⚠️ 大幅な過大申告。このまま放置するとスケジュールに直撃します。'
                    : lastDiscovery.gap >= 10
                    ? '📌 要注意レベルの差異。フォローアップが必要です。'
                    : lastDiscovery.gap >= 5
                    ? '確認完了。軽微な差異あり。'
                    : '✅ 申告と実態は一致していました。'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLastDiscovery(null)}
                className="shrink-0 rounded-full p-1 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">平均自己申告</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{avgReported}%</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">平均実態</p>
          <p className={`mt-2 text-3xl font-semibold ${avgReported - avgActual >= 10 ? 'text-red-600' : 'text-slate-900'}`}>{avgActual}%</p>
        </div>
      </div>

      {syndromeCount > 0 && (
        <div className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          ⚠️ 90%症候群が疑われるメンバーが {syndromeCount} 名います。裏取りを優先してください。
        </div>
      )}

      <div className="mt-5 space-y-3">
        {displayed.map((member) => {
          const gap = member.reportedProgress - member.actualProgress;
          const alreadyVerified = gap === 0;
          return (
            <div
              key={member.id}
              className={`rounded-3xl border p-4 ${
                gap >= 15 ? 'border-red-200 bg-red-50' :
                gap >= 5  ? 'border-amber-200 bg-amber-50/60' :
                'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.role} · {member.affiliation}</p>
                </div>
                {gap >= 15 ? (
                  <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">差異 {gap}%</span>
                ) : gap >= 5 ? (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">差異 {gap}%</span>
                ) : alreadyVerified ? (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">確認済み</span>
                ) : null}
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 text-sm text-slate-700">
                <div>
                  <p className="text-xs text-slate-500">自己申告</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-blue-400" style={{ width: `${member.reportedProgress}%` }} />
                    </div>
                    <span className="shrink-0 font-semibold text-xs">{member.reportedProgress}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500">実態</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div className={`h-full rounded-full ${member.actualProgress < member.reportedProgress - 10 ? 'bg-red-400' : 'bg-emerald-400'}`} style={{ width: `${member.actualProgress}%` }} />
                    </div>
                    <span className="shrink-0 font-semibold text-xs">{member.actualProgress}%</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleVerify(member)}
                disabled={alreadyVerified}
                className={`mt-4 w-full rounded-3xl px-4 py-2.5 text-sm font-semibold transition ${
                  alreadyVerified
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-800 text-white hover:bg-slate-900'
                }`}
              >
                {alreadyVerified ? '✓ 裏取り完了' : '📋 進捗裏取り'}
              </button>
            </div>
          );
        })}
      </div>

      {members.length > SHOW_LIMIT && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full rounded-2xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          {showAll ? '閉じる ▲' : `全メンバー表示 (${members.length}名) ▼`}
        </button>
      )}
    </div>
  );
}
