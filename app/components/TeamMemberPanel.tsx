import type { TeamMember } from '../../lib/types';

const getConditionLabel = (condition: number) => {
  if (condition >= 85) return '好調';
  if (condition >= 70) return '注意';
  if (condition >= 50) return '疲労';
  return '危険';
};

export function TeamMemberPanel({ members }: { members: TeamMember[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700">チームメンバー</p>
          <p className="mt-1 text-sm text-slate-500">メンバーごとの稼働率・コンディション・属人化リスクを確認します。</p>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {members.map((member) => {
          const utilizationWarn = member.utilization >= 85;
          const utilizationColor = utilizationWarn ? 'bg-red-500' : 'bg-brand-600';
          return (
            <div key={member.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                  <p className="text-xs text-slate-500">
                    {member.affiliation} / {member.role} / {member.skillLevel} レベル
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {member.isSiloed && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-800">属人化</span>
                  )}
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
                    {getConditionLabel(member.condition)}
                  </span>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>稼働率: <span className="font-semibold text-slate-900">{member.utilization}%</span></p>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                  <div className={`${utilizationColor} h-full`} style={{ width: `${Math.min(member.utilization, 100)}%` }} />
                </div>
                <p>コンディション: {member.condition} / モチベーション: {member.motivation}</p>
                <p>進捗: {member.reportedProgress}%（申告） / {member.actualProgress}%（実態）</p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">単価: {member.costPerMonth} 万円</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">専門: {member.specialty}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
