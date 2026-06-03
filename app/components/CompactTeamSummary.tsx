'use client';

import { motion } from 'framer-motion';
import type { TeamMember } from '../../lib/types';

const getConditionLabel = (v: number) => {
  if (v >= 85) return { label: '好調', color: 'bg-emerald-100 text-emerald-700' };
  if (v >= 70) return { label: '注意', color: 'bg-amber-100 text-amber-700' };
  if (v >= 50) return { label: '疲労', color: 'bg-orange-100 text-orange-700' };
  return { label: '危険', color: 'bg-red-100 text-red-700' };
};

function StatusBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

export function CompactTeamSummary({ members }: { members: TeamMember[] }) {
  const sorted = [...members].sort((a, b) => b.utilization - a.utilization);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-soft transition hover:shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-700">チームサマリー</p>
          <p className="mt-1 text-sm text-slate-500">メンバーの状態と士気をリアルタイムで確認できます。</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{members.length}名</span>
      </div>
      <div className="mt-5 space-y-3">
        {sorted.map((member, index) => {
          const cond = getConditionLabel(member.condition);
          return (
            <motion.div
              key={member.id}
              className={`rounded-2xl border p-4 transition duration-300 hover:-translate-y-0.5 ${
                member.isSiloed
                  ? 'border-red-200 bg-red-50'
                  : index === 0
                  ? 'border-brand-200 bg-brand-50/60 ring-1 ring-brand-100'
                  : 'border-slate-200 bg-slate-50'
              }`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.role} · {member.affiliation}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {member.isSiloed && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">孤立</span>
                  )}
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cond.color}`}>{cond.label}</span>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                    <span>コンディション</span>
                    <span className="font-semibold text-slate-700">{member.condition}</span>
                  </div>
                  <StatusBar
                    value={member.condition}
                    color={member.condition >= 70 ? 'bg-emerald-400' : member.condition >= 50 ? 'bg-amber-400' : 'bg-red-400'}
                  />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                    <span>モチベーション</span>
                    <span className="font-semibold text-slate-700">{member.motivation}</span>
                  </div>
                  <StatusBar
                    value={member.motivation}
                    color={member.motivation >= 70 ? 'bg-blue-400' : member.motivation >= 50 ? 'bg-amber-400' : 'bg-red-400'}
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>稼働率 <span className="font-semibold text-slate-700">{member.utilization}%</span></span>
                <span>進捗差 <span className={`font-semibold ${member.reportedProgress - member.actualProgress > 10 ? 'text-red-600' : 'text-slate-700'}`}>{member.reportedProgress - member.actualProgress}%</span></span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
