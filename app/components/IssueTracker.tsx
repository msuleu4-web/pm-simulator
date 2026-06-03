type Issue = {
  id: string;
  title: string;
  priority: '高' | '中' | '低';
  owner: string;
  status: '対応中' | '未対応' | '確認待ち';
};

const issueMap: Record<string, Issue[]> = {
  requirements: [
    { id: 'ISSUE-01', title: '要件変更が口頭確認のみ', priority: '高', owner: 'PM', status: '対応中' },
    { id: 'ISSUE-02', title: '顧客要望の曖昧さ', priority: '中', owner: '要件定義担当', status: '確認待ち' },
  ],
  basicDesign: [
    { id: 'ISSUE-03', title: 'UI要件の詳細が不足', priority: '高', owner: '設計担当', status: '未対応' },
    { id: 'ISSUE-04', title: 'ベンダー間の設計調整', priority: '中', owner: 'PM', status: '対応中' },
  ],
  detailedDesign: [
    { id: 'ISSUE-05', title: 'テストケースの抜け漏れ', priority: '高', owner: 'テストリーダー', status: '未対応' },
    { id: 'ISSUE-06', title: '工数見積もりの狂い', priority: '中', owner: 'PL', status: '確認待ち' },
  ],
  testing: [
    { id: 'ISSUE-07', title: 'ベンダー間インターフェース不整合', priority: '高', owner: 'PM', status: '対応中' },
    { id: 'ISSUE-08', title: '重大バグによる本番延期検討', priority: '高', owner: '品質保証', status: '確認待ち' },
  ],
  release: [
    { id: 'ISSUE-09', title: '受入テストの要件ずれ対応', priority: '高', owner: 'PM', status: '対応中' },
    { id: 'ISSUE-10', title: '本番リリースの延期判断', priority: '高', owner: '経営層', status: '確認待ち' },
  ],
};

export function IssueTracker({ phaseId }: { phaseId: string }) {
  const issues = issueMap[phaseId] ?? [];

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-700">課題管理表</p>
          <p className="mt-1 text-sm text-slate-500">進行中の課題を一覧で管理します。</p>
        </div>
      </div>
      <div className="space-y-3">
        {issues.map((issue) => (
          <div key={issue.id} className="rounded-3xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
              <span className="font-semibold text-slate-700">{issue.id}</span>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">{issue.priority}</span>
            </div>
            <p className="mt-2 text-sm text-slate-700">{issue.title}</p>
            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
              <span>担当: {issue.owner}</span>
              <span>{issue.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
