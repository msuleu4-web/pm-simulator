'use client';

import { motion } from 'framer-motion';

export function GrowthTrendPanel({ values }: { values: number[] }) {
  return (
    <motion.div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-soft transition hover:shadow-lg" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-700">成長トレンド</p>
          <p className="mt-1 text-sm text-slate-500">直感的なビジュアルでトレンドを把握します。</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">直近 5 週</span>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-5">
        {values.map((value, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center gap-3 text-sm text-slate-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex h-40 w-full flex-col justify-end overflow-hidden rounded-3xl bg-slate-100 shadow-inner">
              <motion.div
                className="w-full rounded-t-3xl bg-gradient-to-t from-brand-600 via-cyan-400 to-slate-200"
                initial={{ height: '0%' }}
                animate={{ height: `${Math.min(Math.max(value, 6), 100)}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            <span className="text-xs text-slate-500">W{index + 1}</span>
            <span className="text-sm font-semibold text-slate-900">{value}%</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
