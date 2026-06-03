import type { Phase } from '../../lib/types';

const phaseTimings: Record<string, { start: number; duration: number }> = {
  requirements: { start: 0, duration: 14 },
  basicDesign: { start: 14, duration: 14 },
  detailedDesign: { start: 28, duration: 14 },
  testing: { start: 42, duration: 18 },
  release: { start: 60, duration: 20 },
};

export function GanttChart({ phases, currentPhaseId, criticalPhaseIds = [] }: { phases: Phase[]; currentPhaseId: string; criticalPhaseIds?: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700">簡易ガントチャート</p>
          <p className="mt-1 text-sm text-slate-500">工程の並びと現在位置を見える化します。</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">9ヶ月</span>
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">クリティカルパス</span>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {phases.map((phase) => {
          const timing = phaseTimings[phase.id] ?? { start: 0, duration: 12 };
          const barStyle = {
            marginLeft: `${timing.start}%`,
            width: `${timing.duration}%`,
          };
          const isActive = phase.id === currentPhaseId;
          const isCritical = criticalPhaseIds.includes(phase.id);
          return (
            <div key={phase.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>{phase.label}</span>
                <span className="text-xs uppercase tracking-[0.24em] text-slate-400">{timing.duration}d</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${isActive ? 'bg-brand-600' : isCritical ? 'bg-red-500/90' : 'bg-slate-400'}`}
                  style={barStyle}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
