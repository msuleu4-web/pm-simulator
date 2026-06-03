import type { GameState } from '../../lib/types';

const metrics = [
  { key: 'plan', label: '計画力' },
  { key: 'people', label: '対人力' },
  { key: 'risk', label: 'リスク管理' },
  { key: 'motivation', label: '士気管理' },
];

const normalizeValue = (state: GameState, key: string) => {
  switch (key) {
    case 'plan':
      return Math.max(0, Math.min(100, state.cost));
    case 'people':
      return Math.max(0, Math.min(100, state.stakeholder));
    case 'risk':
      return Math.max(0, Math.min(100, Math.max(0, state.schedule + 50)));
    case 'motivation':
      return Math.max(0, Math.min(100, state.morale));
    default:
      return 0;
  }
};

export function AbilityRadarPanel({ state }: { state: GameState }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-soft transition hover:shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-700">成長レーダー</p>
          <p className="mt-1 text-sm text-slate-500">PMの主要軸を4つの指標で確認します。</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">実績ベース</span>
      </div>
      <div className="mt-6 space-y-4">
        {metrics.map((metric) => {
          const value = normalizeValue(state, metric.key);
          return (
            <div key={metric.key} className="rounded-3xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
                <span>{metric.label}</span>
                <span className="font-semibold text-slate-900">{value}%</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-600 via-cyan-400 to-slate-500" style={{ width: `${value}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
