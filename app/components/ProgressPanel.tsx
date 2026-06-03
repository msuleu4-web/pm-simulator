import React from 'react';
import { pmBokDefinitions } from '../../lib/pmBokDefinitions';

export function ProgressPanel({ count }: { count: number }) {
  const total = Object.keys(pmBokDefinitions).length;
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-soft">
      <p className="text-sm font-semibold text-slate-700">学習進捗</p>
      <p className="mt-2 text-3xl font-bold text-brand-700">{count}/{total}</p>
      <p className="mt-2 text-sm text-slate-500">理解済みの用語数</p>
    </div>
  );
}

export default ProgressPanel;
