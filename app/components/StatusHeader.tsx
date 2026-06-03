import type { GameState } from '../../lib/types';
import { Tooltip } from './Tooltip';

const labelList = [
  { key: 'quality', label: '品質', explanation: 'バグ・欠陥の抑制と仕様適合' },
  { key: 'cost', label: '残予算', explanation: '予算と工数の余裕' },
  { key: 'schedule', label: 'スケジュール', explanation: '納期に対する余裕日数' },
  { key: 'stakeholder', label: 'ステークホルダー', explanation: '顧客・経営・チームの満足度' },
];

const normalize = (value: number, key: string) => {
  if (key === 'schedule') {
    return Math.max(0, Math.min(100, value + 50));
  }
  return Math.max(0, Math.min(100, value));
};

export function StatusHeader({ state }: { state: GameState }) {
  const stats = [
    { label: '品質', value: state.quality, color: 'bg-brand-600' },
    { label: '残予算', value: state.cost, color: 'bg-slate-600' },
    { label: 'スケジュール', value: state.schedule, color: 'bg-blue-500' },
    { label: 'ステークホルダー', value: state.stakeholder, color: 'bg-cyan-600' },
    { label: 'PMメンタル', value: state.pmMental, color: 'bg-fuchsia-600' },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-soft">
          <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
            <span>{stat.label}</span>
            <Tooltip label={stat.label} description={labelList.find((item) => item.label === stat.label)?.explanation ?? ''} />
          </div>
          <div className="mt-3 flex items-end gap-4">
            <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
            <span className="text-xs text-slate-500">{stat.label === 'スケジュール' ? '余裕日数' : '0-100'}</span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
            <div className={`${stat.color} h-full`} style={{ width: `${normalize(stat.value, stat.label.toLowerCase())}%` }} />
          </div>
        </div>
      ))}
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-soft">
        <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
          <span>チーム士気</span>
          <Tooltip label="チーム士気" description="メンバーの疲弊度。残業や無理な対応で低下します。" />
        </div>
        <p className="mt-3 text-3xl font-semibold text-slate-900">{state.morale}</p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="bg-emerald-600 h-full" style={{ width: `${state.morale}%` }} />
        </div>
      </div>
    </section>
  );
}
