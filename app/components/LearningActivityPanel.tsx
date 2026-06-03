import React from 'react';
import type { LearningProgress, QuizResults } from '../../lib/useLearningProgress';

function pad(num: number) {
  return String(num).padStart(2, '0');
}

function getDateLabel(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function LearningActivityPanel({ progress, scores }: { progress: LearningProgress; scores: QuizResults }) {
  const today = new Date();
  const last7Days = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const key = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    return { key, label: getDateLabel(date), count: 0 };
  });

  const learnedByDay = Object.values(progress).reduce<Record<string, number>>((acc, item) => {
    const day = item.learnedAt.slice(0, 10);
    acc[day] = (acc[day] ?? 0) + 1;
    return acc;
  }, {});

  const activityBars = last7Days.map((day) => ({
    ...day,
    count: learnedByDay[day.key] ?? 0,
  }));

  const maxCount = Math.max(1, ...activityBars.map((day) => day.count));

  const reviewItems = Object.entries(scores)
    .filter(([, result]) => result.score < 0.7)
    .sort(([, a], [, b]) => a.score - b.score)
    .slice(0, 4);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-700">学習アクティビティ</p>
          <p className="mt-1 text-xs text-slate-500">直近7日間の理解登録数と復習候補</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {activityBars.map((day) => (
          <div key={day.key} className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{day.label}</span>
              <span>{day.count} 回</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-brand-600"
                style={{ width: `${(day.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">復習候補</p>
        {reviewItems.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {reviewItems.map(([term, result]) => (
              <li key={term} className="rounded-2xl border border-slate-200 bg-white p-3">
                <p className="font-semibold text-slate-900">{term}</p>
                <p className="mt-1 text-xs text-slate-500">スコア: {Math.round(result.score * 100)}% / 試行: {result.attempts}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-500">現在、特に復習が必要な用語はありません。</p>
        )}
      </div>
    </div>
  );
}

export default LearningActivityPanel;
