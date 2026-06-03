'use client';

import { motion } from 'framer-motion';

export function RoadmapPanel({ items }: { items: { title: string; subtitle: string; badge: string }[] }) {
  return (
    <motion.div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-soft transition hover:shadow-lg" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-700">おすすめ学習ロードマップ</p>
          <p className="mt-1 text-sm text-slate-500">学習優先度に基づいた3ステップを提案します。</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">3 ステップ</span>
      </div>
      <div className="mt-6 space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:bg-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <div className="flex items-center justify-between gap-3 text-sm text-slate-700">
              <p className="font-semibold">{item.title}</p>
              <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">{item.badge}</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">{item.subtitle}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-700">{index + 1}</span>
              <span>ステップ {index + 1}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
