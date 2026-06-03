'use client';

import { motion } from 'framer-motion';
import type { RandomEvent } from '../../lib/types';

const severityConfig = {
  medium: { label: '注意', bg: 'bg-amber-50', border: 'border-amber-300', header: 'bg-amber-500', badge: 'bg-amber-100 text-amber-800' },
  high: { label: '重大', bg: 'bg-orange-50', border: 'border-orange-400', header: 'bg-orange-600', badge: 'bg-orange-100 text-orange-800' },
  critical: { label: '緊急', bg: 'bg-red-50', border: 'border-red-500', header: 'bg-red-700', badge: 'bg-red-100 text-red-800' },
};

export function RandomEventCard({
  event,
  onResolve,
}: {
  event: RandomEvent;
  onResolve: (choiceId: string) => void;
}) {
  const cfg = severityConfig[event.severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`rounded-3xl border-2 ${cfg.border} ${cfg.bg} shadow-lg overflow-hidden`}
    >
      <div className={`${cfg.header} px-6 py-4 flex items-center gap-3`}>
        <span className="text-xl">⚡</span>
        <span className="text-sm font-bold uppercase tracking-widest text-white">突発事象</span>
        <span className={`ml-auto rounded-full px-3 py-0.5 text-xs font-bold ${cfg.badge}`}>
          {cfg.label}
        </span>
      </div>

      <div className="px-6 pt-5 pb-2">
        <h2 className="text-lg font-bold text-slate-900 leading-snug">{event.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-700">{event.description}</p>
      </div>

      <div className="px-6 pb-6 mt-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">どう対応しますか？</p>
        {event.choices.map((choice) => (
          <motion.button
            key={choice.id}
            type="button"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.15 }}
            onClick={() => onResolve(choice.id)}
            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-slate-400 hover:shadow-md"
          >
            <p className="text-sm font-semibold text-slate-900">{choice.label}</p>
            <p className="mt-1 text-xs text-slate-500">{choice.summary}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
