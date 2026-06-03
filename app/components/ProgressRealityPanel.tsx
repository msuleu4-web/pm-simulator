import type { Dispatch } from 'react';
import type { GameAction, TeamMember } from '../../lib/types';

const average = (values: number[]) => (values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0);

export function ProgressRealityPanel({ members, dispatch }: { members: TeamMember[]; dispatch: Dispatch<GameAction> }) {
  const avgReported = average(members.map((member) => member.reportedProgress));
  const avgActual = average(members.map((member) => member.actualProgress));
  const overstatementCount = members.filter((member) => member.reportedProgress - member.actualProgress >= 15).length;
  const syndromeCount = members.filter((member) => member.reportedProgress >= 90 && member.actualProgress <= 75).length;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700">進捗の見える化</p>
          <p className="mt-1 text-sm text-slate-500">自己申告と実態の差を確認し、90%症候群や報告癖をチェックします。</p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">{overstatementCount} 件の差異</span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">平均自己申告進捗</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{avgReported}%</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">平均実態進捗</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{avgActual}%</p>
        </div>
      </div>

      {syndromeCount > 0 && (
        <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          90%症候群が疑われるメンバーが {syndromeCount} 名います。実態確認を優先しましょう。
        </div>
      )}

      <div className="mt-5 space-y-3">
        {members.map((member) => {
          const gap = member.reportedProgress - member.actualProgress;
          return (
            <div key={member.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-slate-900">{member.name}</p>
                <span className="text-xs text-slate-500">差分: {gap}%</span>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 text-sm text-slate-700">
                <div>
                  <p className="text-xs text-slate-500">自己申告</p>
                  <p className="mt-1 font-semibold">{member.reportedProgress}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">実態</p>
                  <p className="mt-1 font-semibold">{member.actualProgress}%</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => dispatch({ type: 'verifyMemberProgress', memberId: member.id })}
                className="mt-4 rounded-3xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
              >
                進捗裏取り
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
