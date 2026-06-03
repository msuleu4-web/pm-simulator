import type { DecisionLog } from '../../lib/types';
import { pmBokDefinitions } from '../../lib/pmBokDefinitions';
import { pmBokTips } from '../../lib/pmBokTips';

const rankByScore = (score: number) => {
  if (score >= 85) return 'S';
  if (score >= 75) return 'A';
  if (score >= 60) return 'B';
  if (score >= 45) return 'C';
  return 'D';
};

const tagLabels: Record<string, string> = Object.fromEntries(
  Object.keys(pmBokDefinitions).map((tag) => [tag, tag])
);

const summarizeStrengths = (decisions: DecisionLog[]) => {
  const tally: Record<string, number> = {};
  decisions.forEach((decision) => {
    decision.pmBokTags.forEach((tag) => {
      tally[tag] = (tally[tag] ?? 0) + 1;
    });
  });
  const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, 4).map(([tag]) => tagLabels[tag] ?? tag);
};

const buildPmBokProfile = (decisions: DecisionLog[]) => {
  const tally: Record<string, number> = {};
  decisions.forEach((decision) => {
    decision.pmBokTags.forEach((tag) => {
      tally[tag] = (tally[tag] ?? 0) + 1;
    });
  });

  const counts = Object.entries(tagLabels).map(([tag, label]) => ({ tag, label, count: tally[tag] ?? 0 }));
  const maxCount = Math.max(...counts.map((item) => item.count), 1);
  return { counts, maxCount };
};

export function ResultPanel({
  quality,
  cost,
  schedule,
  stakeholder,
  morale,
  members,
  decisions,
  onSelectTag,
}: {
  quality: number;
  cost: number;
  schedule: number;
  stakeholder: number;
  morale: number;
  members: { condition: number; motivation: number; isSiloed: boolean }[];
  decisions: DecisionLog[];
  onSelectTag?: (tag: string) => void;
}) {
  const averageScore = Math.round((quality + cost + Math.max(0, schedule) + stakeholder + morale) / 5);
  const rank = rankByScore(averageScore);
  const strengths = summarizeStrengths(decisions);

  const humanManagementScore = Math.round(
    members.reduce((sum, member) => sum + member.condition + member.motivation, 0) / (members.length * 2)
  );
  const siloRisk = members.filter((member) => member.isSiloed).length;

  const recommendation = (() => {
    if (rank === 'S') return 'あなたのPM判断は非常に安定しています。現場の調整力とバランス感覚が高いです。';
    if (rank === 'A') return '良い判断ができています。次はリスク管理や品質のさらなるバランスも意識しましょう。';
    if (rank === 'B') return '総合力は安定していますが、スケジュールとコストの両立をもっと強化しましょう。';
    if (rank === 'C') return '判断は悪くありませんが、関係者合意と品質管理の優先順位を見直す余地があります。';
    return '今回の判断から学ぶポイントが多いです。次回はリスクとステークホルダーをより慎重に扱いましょう。';
  })();

  const decisionCounts = decisions.reduce((tally: Record<string, number>, decision) => {
    decision.pmBokTags.forEach((tag) => {
      tally[tag] = (tally[tag] ?? 0) + 1;
    });
    return tally;
  }, {});

  const underusedTags = Object.keys(tagLabels)
    .map((tag) => ({ tag, count: decisionCounts[tag] ?? 0 }))
    .sort((a, b) => a.count - b.count)
    .slice(0, 3)
    .filter((item) => item.count <= 1)
    .map((item) => item.tag);

  const underusedTips = underusedTags.map((tag) => ({ tag, tips: pmBokTips[tag] ?? [] }));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-soft">
      <h2 className="text-2xl font-semibold text-slate-900">最終リザルト</h2>
      <p className="mt-2 text-slate-600">QCDとチーム・ステークホルダーを総合評価し、あなたのPM傾向を示します。</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          { label: '品質', value: quality },
          { label: '残予算', value: cost },
          { label: 'スケジュール', value: schedule },
          { label: 'ステークホルダー', value: stakeholder },
          { label: '士気', value: morale },
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm text-slate-500">総合ランク</p>
        <p className="mt-2 text-5xl font-bold text-brand-700">{rank}</p>
        <p className="mt-3 text-sm text-slate-600">QCDのバランスとステークホルダー対応を総合した評価です。</p>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-700">強みと学び</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {strengths.map((label) => (
            <button
              type="button"
              key={label}
              onClick={() => onSelectTag?.(label)}
              className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-700">PMBOK分析</h3>
            <p className="mt-1 text-sm text-slate-500">選択による知識エリアの偏りを確認しましょう。</p>
          </div>
          <p className="text-sm font-semibold text-slate-800">{decisions.length} 回の判断</p>
        </div>
        <div className="mt-5 space-y-3">
          {(() => {
            const profile = buildPmBokProfile(decisions);
            return profile.counts.map((item) => (
            <div key={item.tag} className="space-y-1">
                <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
                  <button type="button" onClick={() => onSelectTag?.(item.tag)} className="text-left font-medium text-slate-700">
                    {item.label}
                  </button>
                  <span>{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-brand-600"
                    style={{ width: `${(item.count / profile.maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-sm font-semibold text-slate-700">診断コメント</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{recommendation}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-700">ヒューマンマネジメント</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{humanManagementScore}</p>
            <p className="mt-2 text-sm text-slate-600">チームの状態とケアの判断がどれだけ安定していたかを示します。</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-700">サイロリスク</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{siloRisk}</p>
            <p className="mt-2 text-sm text-slate-600">サイロ化したメンバー数が多いほど、情報共有や進捗の遅れが発生しやすくなります。</p>
          </div>
        </div>
        {underusedTags.length > 0 && (
          <div className="mt-4 space-y-3">
            <p className="rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-800">
              次回は以下のPMBOK領域も意識するとさらに安定します: {underusedTags.join('、')}。
            </p>
            {underusedTips.map(({ tag, tips }) => (
              <div key={tag} className="rounded-2xl border border-slate-100 bg-white p-4">
                <p className="text-sm font-semibold text-slate-800">{tag} の学習ヒント</p>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                  {tips.slice(0, 3).map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
