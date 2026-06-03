import { pmBokDefinitions } from '../../lib/pmBokDefinitions';

export function GlossaryPanel({
  activeTags = [],
  tagUsage = {},
  selectedTag,
  onSelectTag,
}: {
  activeTags?: string[];
  tagUsage?: Record<string, number>;
  selectedTag?: string | null;
  onSelectTag?: (tag: string | null) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">PMBOK用語集</p>
          <p className="mt-2 text-sm text-slate-600">ゲーム内で使われる重要用語の意味を確認できます。</p>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {selectedTag && (
          <div className="rounded-3xl border border-brand-200 bg-brand-50/70 p-4 text-sm text-brand-800">
            選択中の用語: <span className="font-semibold">{selectedTag}</span>
          </div>
        )}
        {Object.entries(pmBokDefinitions).map(([term, description]) => {
          const isActive = activeTags.includes(term);
          const usageCount = tagUsage[term] ?? 0;

          return (
            <div
              key={term}
              onClick={() => onSelectTag?.(selectedTag === term ? null : term)}
              className={`rounded-3xl border p-4 ${
                isActive ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-slate-50'
              } cursor-pointer transition hover:border-brand-400 hover:bg-brand-50/80`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">{term}</p>
                {isActive && (
                  <span className="rounded-full bg-brand-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-700">
                    このフェーズで登場
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              {usageCount > 0 && (
                <p className="mt-3 text-xs font-medium text-slate-500">過去の選択で {usageCount} 回使用</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
