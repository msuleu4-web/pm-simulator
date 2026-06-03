import type { Phase } from '../../lib/types';

export function PhaseStepper({ phases, currentIndex }: { phases: Phase[]; currentIndex: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-soft">
      <h2 className="text-sm font-semibold text-slate-700">現在のフェーズ</h2>
      <div className="mt-4 space-y-3">
        {phases.map((phase, index) => {
          const isActive = index === currentIndex;
          const isComplete = index < currentIndex;
          return (
            <div key={phase.id} className="flex items-start gap-3">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold" style={{ borderColor: isActive ? '#3b82f6' : '#cbd5e1', color: isActive ? '#1d4ed8' : '#64748b' }}>
                {index + 1}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-semibold ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>{phase.label}</p>
                <p className="text-sm text-slate-500">{phase.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
