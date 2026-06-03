'use client';

import { useState } from 'react';
import type { Dispatch } from 'react';
import type { GameAction, TeamMember } from '../../lib/types';
import { OneOnOneChatModal } from './OneOnOneChatModal';

const conditionLabel = (condition: number) => {
  if (condition >= 85) return '元気';
  if (condition >= 70) return '注意';
  if (condition >= 50) return '疲労';
  return '危険';
};

export function TeamCarePanel({
  members,
  dispatch,
  currentPhaseLabel = 'プロジェクト進行中',
}: {
  members: TeamMember[];
  dispatch: Dispatch<GameAction>;
  currentPhaseLabel?: string;
}) {
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);

  const activeMember = members.find((m) => m.id === activeMemberId) ?? null;

  const handleComplete = () => {
    if (activeMemberId) {
      dispatch({ type: 'performOneOnOne', memberId: activeMemberId });
    }
    setActiveMemberId(null);
  };

  return (
    <>
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-700">1on1・ケア対応</p>
            <p className="mt-1 text-sm text-slate-500">メンバーをクリックしてAIとの1on1チャットを開始できます。完了すると状態が回復します。</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {members.map((member) => (
            <div
              key={member.id}
              className={`rounded-3xl border bg-slate-50 p-4 transition ${
                member.condition < 50 || member.motivation < 50
                  ? 'border-orange-200 bg-orange-50/50'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.affiliation} / {member.role}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  member.condition >= 85 ? 'bg-emerald-100 text-emerald-700' :
                  member.condition >= 70 ? 'bg-amber-100 text-amber-700' :
                  member.condition >= 50 ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {conditionLabel(member.condition)}
                </span>
              </div>
              <div className="mt-3 space-y-1.5 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>コンディション</span>
                  <span className="font-semibold text-slate-900">{member.condition}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${member.condition >= 70 ? 'bg-emerald-400' : member.condition >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                    style={{ width: `${member.condition}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>モチベーション</span>
                  <span className="font-semibold text-slate-900">{member.motivation}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${member.motivation >= 70 ? 'bg-blue-400' : member.motivation >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                    style={{ width: `${member.motivation}%` }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveMemberId(member.id)}
                className="mt-4 w-full rounded-3xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                1on1実施
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-3xl bg-slate-100 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">1on1効果</p>
          <p className="mt-2">AIがメンバーの現在の状態をもとに本人として返答します。会話を通じてメンバーの悩みを把握し、完了するとコンディション・モチベーションが回復します。</p>
        </div>
      </div>

      {activeMember && (
        <OneOnOneChatModal
          member={activeMember}
          phaseLabel={currentPhaseLabel}
          onComplete={handleComplete}
          onClose={() => setActiveMemberId(null)}
        />
      )}
    </>
  );
}
