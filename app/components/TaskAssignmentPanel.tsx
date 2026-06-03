import type { Dispatch } from 'react';
import type { GameAction, Task, TeamMember } from '../../lib/types';
import { calculateTaskEffectiveLoad, computeSkillMultiplier } from '../../lib/taskCalculations';

function getTaskLabel(isCritical: boolean) {
  return isCritical ? 'クリティカル' : '通常';
}

export function TaskAssignmentPanel({
  tasks,
  members,
  currentPhaseId,
  dispatch,
}: {
  tasks: Task[];
  members: TeamMember[];
  currentPhaseId: string;
  dispatch: Dispatch<GameAction>;
}) {
  const phaseTasks = tasks.filter((task) => task.phaseId === currentPhaseId);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700">タスク配分と稼働管理</p>
          <p className="mt-1 text-sm text-slate-500">WBSの各工程にメンバーを割り当て、進捗とクリティカルパスをフェーズごとに管理します。</p>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {phaseTasks.map((task) => {
          const load = calculateTaskEffectiveLoad(task, members);
          const bufferLoad = task.requiredManMonths * task.bufferFactor;
          const overloadWarning = load > task.requiredManMonths * 1.3;
          return (
            <div key={task.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-700">
                <div>
                  <p className="font-semibold">{task.title}</p>
                  <p className="text-xs text-slate-500">{getTaskLabel(task.isCritical)} / バッファ: {task.bufferFactor.toFixed(1)}x</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${task.isCritical ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                  {task.isCritical ? 'クリティカルパス' : '非クリティカル'}
                </span>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-xs text-slate-500">基準工数</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{task.requiredManMonths.toFixed(1)} 人月</p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-xs text-slate-500">実質工数（スキル補正後）</p>
                  <p className={`mt-2 text-lg font-semibold ${overloadWarning ? 'text-red-700' : 'text-slate-900'}`}>{load.toFixed(1)} 人月</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-700">
                  <p className="font-semibold">割り当てメンバー</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {task.assignedMembers.length === 0 ? (
                      <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-600">未割り当て</span>
                    ) : (
                      task.assignedMembers.map((memberId) => {
                        const member = members.find((item) => item.id === memberId);
                        return (
                          <span key={memberId} className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                            {member?.name ?? memberId}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {members.map((member) => {
                    const assigned = task.assignedMembers.includes(member.id);
                    const impact = (task.requiredManMonths / Math.max(task.assignedMembers.length + (assigned ? 0 : 1), 1)) * computeSkillMultiplier(member.skillLevel);
                    return (
                      <button
                        key={member.id}
                        type="button"
                        disabled={assigned}
                        onClick={() => dispatch({ type: 'assignMember', taskId: task.id, memberId: member.id })}
                        className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${assigned ? 'border-slate-200 bg-slate-200 text-slate-500 cursor-not-allowed' : 'border-slate-200 bg-white text-slate-800 hover:border-brand-300 hover:bg-brand-50'}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span>{member.name}</span>
                          <span className="text-xs text-slate-500">+{impact.toFixed(1)}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{member.affiliation} / {member.role} / Lv.{member.skillLevel}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
