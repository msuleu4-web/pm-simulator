'use client';

import { useEffect, useState } from 'react';
import { calculateTaskEffectiveLoad } from '../../lib/taskCalculations';
import type { GameState } from '../../lib/types';

const rankByScore = (score: number) => {
  if (score >= 88) return 'S';
  if (score >= 78) return 'A';
  if (score >= 64) return 'B';
  if (score >= 50) return 'C';
  return 'D';
};

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

export function ProjectEvaluationPanel({ state }: { state: GameState }) {
  const [aiComment, setAiComment] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const totalTasks = state.tasks.length;
  const assignedTasks = state.tasks.filter((task) => task.assignedMembers.length > 0).length;
  const wbsExecution = totalTasks === 0 ? 50 : Math.round((assignedTasks / totalTasks) * 100);

  const effectiveLoad = state.tasks.reduce((sum, task) => sum + calculateTaskEffectiveLoad(task, state.members), 0);
  const requiredLoad = state.tasks.reduce((sum, task) => sum + task.requiredManMonths, 0);
  const overloadScore = clamp(100 - Math.max(0, (effectiveLoad - requiredLoad) * 14), 0, 100);

  const riskTagCount = state.decisions.filter((decision) => decision.pmBokTags.includes('リスク管理')).length;
  const stakeholderTagCount = state.decisions.filter((decision) => decision.pmBokTags.includes('ステークホルダー管理')).length;
  const docTagCount = state.decisions.filter((decision) => decision.pmBokTags.includes('統合管理') || decision.pmBokTags.includes('品質管理')).length;

  const teamBalance = Math.round(
    state.members.reduce((sum, member) => sum + member.condition + member.motivation, 0) / (state.members.length * 2)
  );
  const siloCount = state.members.filter((member) => member.isSiloed).length;
  const collaborationScore = clamp(100 - siloCount * 14, 0, 100);

  const evaluationItems = [
    { label: 'WBS実行力', score: wbsExecution, detail: 'タスク割り当てと工程の進行がWBSに沿って管理されたかを評価します。' },
    { label: 'バッファ管理', score: overloadScore, detail: '実質工数とバッファ設計のバランスをもとにリスク余裕を評価します。' },
    { label: '品質管理', score: state.quality, detail: '成果物の品質に対する注意力と判断の信頼性を示します。' },
    { label: 'コスト統制', score: state.cost, detail: '予算管理の精度と無駄を抑えた運営の安定性を示します。' },
    { label: 'スケジュール遵守', score: clamp(state.schedule + 50), detail: '工程遅延リスクと納期達成力を評価します。' },
    { label: 'ステークホルダー対応', score: clamp(state.stakeholder + stakeholderTagCount * 5), detail: '顧客・経営・チームの合意形成と期待値管理の度合いです。' },
    { label: 'チーム安定性', score: teamBalance, detail: 'メンバーの状態とモチベーションがプロジェクトの継続性に与える影響です。' },
    { label: 'リスク対応力', score: clamp(20 + riskTagCount * 18), detail: 'リスク管理への意識と先回り対応の度合いを見ます。' },
    { label: '情報共有・協調', score: collaborationScore, detail: 'サイロ化を抑え、メンバー間コミュニケーションを活性化したかを評価します。' },
    { label: '文書化・意思決定', score: clamp(30 + docTagCount * 15), detail: '議事録や報告、意思決定の記録が標準化されているかを示します。' },
  ];

  const averageScore = Math.round(evaluationItems.reduce((sum, item) => sum + item.score, 0) / evaluationItems.length);
  const overallRank = rankByScore(averageScore);

  const topTagCounts: Record<string, number> = {};
  state.decisions.forEach((decision) => {
    decision.pmBokTags.forEach((tag) => {
      topTagCounts[tag] = (topTagCounts[tag] ?? 0) + 1;
    });
  });
  const topTags = Object.entries(topTagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setAiComment(null);

    fetch('/api/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ averageScore, overallRank, evaluationItems, decisionCount: state.decisions.length, topTags, siloCount }),
    })
      .then((res) => res.json())
      .then((data: { comment: string }) => {
        if (!cancelled) setAiComment(data.comment);
      })
      .catch(() => {
        if (!cancelled) setAiComment('AI評価の取得に失敗しました。');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  // evaluationItems is derived — depend on the source values only
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [averageScore, overallRank, state.decisions.length, siloCount]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700">プロジェクト完了評価</p>
          <p className="mt-1 text-sm text-slate-500">WBSと現場判断をもとに、プロジェクト完了時の評価を自動生成します。</p>
        </div>
        <div className="rounded-3xl bg-brand-50 px-4 py-3 text-center text-sm font-semibold text-brand-700">
          最終評価: {overallRank}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {evaluationItems.slice(0, 6).map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{item.score}</p>
            <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {evaluationItems.slice(6).map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-100 bg-slate-100 p-4">
            <p className="text-sm font-semibold text-slate-700">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{item.score}</p>
            <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-brand-200 bg-brand-50/70 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-brand-900">AIによる評価コメント</p>
          <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">Groq Llama</span>
        </div>
        {isLoading ? (
          <div className="mt-3 flex items-center gap-2 text-sm text-brand-700">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-400 border-t-transparent" />
            評価を生成中...
          </div>
        ) : (
          <p className="mt-3 text-sm leading-6 text-brand-900">{aiComment}</p>
        )}
      </div>
    </div>
  );
}
