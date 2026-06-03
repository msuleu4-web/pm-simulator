import type { DecisionLog } from '../../lib/types';

export function LearningLogPanel({ items }: { items: (DecisionLog & { phaseLabel: string })[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-slate-900">学びログ</h2>
      <p className="mt-2 text-sm text-slate-600">各意思決定の要点とPMBOKタグを振り返り、次の現場で活かせるポイントを確認します。</p>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={`${item.phaseId}-${item.scenarioId}-${item.choiceId}`} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{item.phaseLabel}</span>
              <span>{new Date(item.timestamp).toLocaleString('ja-JP')}</span>
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-900">{item.choiceLabel}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.explanation}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.pmBokTags.map((tag) => (
                <span key={tag} className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-700">
              <div className="rounded-2xl bg-white p-3 shadow-sm">
                <p className="text-xs text-slate-400">品質</p>
                <p className="mt-1 font-semibold">{item.effects.quality > 0 ? `+${item.effects.quality}` : item.effects.quality}</p>
              </div>
              <div className="rounded-2xl bg-white p-3 shadow-sm">
                <p className="text-xs text-slate-400">スケジュール</p>
                <p className="mt-1 font-semibold">{item.effects.schedule > 0 ? `+${item.effects.schedule}` : item.effects.schedule}</p>
              </div>
              <div className="rounded-2xl bg-white p-3 shadow-sm">
                <p className="text-xs text-slate-400">残予算</p>
                <p className="mt-1 font-semibold">{item.effects.cost > 0 ? `+${item.effects.cost}` : item.effects.cost}</p>
              </div>
              <div className="rounded-2xl bg-white p-3 shadow-sm">
                <p className="text-xs text-slate-400">士気</p>
                <p className="mt-1 font-semibold">{item.effects.morale > 0 ? `+${item.effects.morale}` : item.effects.morale}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
