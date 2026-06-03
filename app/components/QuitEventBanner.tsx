'use client';

import { motion } from 'framer-motion';
import type { QuitEvent } from '../../lib/types';

export function QuitEventBanner({
  event,
  onDismiss,
}: {
  event: QuitEvent;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="rounded-2xl border-2 border-red-400 bg-red-50 px-5 py-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-2xl">🚨</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-600">メンバー離脱</p>
            <p className="mt-1 text-base font-bold text-red-900">
              {event.name}（{event.role} · {event.affiliation}）が退職しました
            </p>
            <p className="mt-1 text-sm text-red-800">{event.reason}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 font-semibold text-red-700">
                コンディション {event.condition}
              </span>
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 font-semibold text-red-700">
                モチベーション {event.motivation}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-700">
                士気 -10 ／ 品質 -5
              </span>
            </div>
            <p className="mt-2 text-xs text-red-700">
              💡 採用ダッシュボードから後任を探してください。
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-full p-1.5 text-red-400 transition hover:bg-red-100 hover:text-red-700"
          aria-label="閉じる"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}
