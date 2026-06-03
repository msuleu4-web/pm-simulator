'use client';

import { motion } from 'framer-motion';

export function NextActionPanel({ actions }: { actions: string[] }) {
  return (
    <motion.div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-soft transition hover:shadow-lg" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-700">次に取るべきアクション</p>
          <p className="mt-1 text-sm text-slate-500">短時間で決断できるように導きます。</p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">優先度高</span>
      </div>
      <div className="mt-6 space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action}
            className="group flex items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-2xl bg-brand-600 text-sm font-semibold text-white shadow-sm transition group-hover:bg-brand-700">
              {index + 1}
            </div>
            <p className="text-sm leading-6 text-slate-700">{action}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
