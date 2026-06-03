import React from 'react';
import type { QuizResults } from '../../lib/useLearningProgress';

export function QuizSummaryPanel({ scores }: { scores: QuizResults }) {
  const entries = Object.entries(scores);
  const assessedTerms = entries.length;
  const totalAttempts = entries.reduce((sum, [, result]) => sum + result.attempts, 0);
  const averageScore = assessedTerms > 0 ? entries.reduce((sum, [, result]) => sum + result.score, 0) / assessedTerms : 0;
  const latest = entries.reduce((best, [term, result]) => {
    if (!best || result.at > best.result.at) return { term, result };
    return best;
  }, null as { term: string; result: { score: number; at: string; attempts: number } } | null);
  const latestLabel = latest ? `${latest.term} (${new Date(latest.result.at).toLocaleDateString('ja-JP')})` : 'まだありません';

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-soft">
      <p className="text-sm font-semibold text-slate-700">クイズ進捗</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">アセスメント</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{assessedTerms}</p>
          <p className="mt-1 text-sm text-slate-500">評価済み用語</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">平均スコア</p>
          <p className="mt-2 text-2xl font-semibold text-brand-700">{Math.round(averageScore * 100)}%</p>
          <p className="mt-1 text-sm text-slate-500">自己評価の平均</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">総試行回数</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{totalAttempts}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">最新用語</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">{latestLabel}</p>
        </div>
      </div>
    </div>
  );
}

export default QuizSummaryPanel;
