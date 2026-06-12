'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Difficulty } from '../../lib/types';
import { PMSimulatorWizard } from './PMSimulatorWizard';

export function DifficultySelect({
  onStart,
  ultraUnlocked,
}: {
  onStart: (difficulty: Difficulty, projectThemeId: string) => void;
  ultraUnlocked: boolean;
}) {
  const [mode, setMode] = useState<'landing' | 'wizard'>('landing');

  // ウィザード表示中にブラウザの「戻る」を押すとページ自体から離脱してしまうため、
  // ウィザードを開く際に履歴を1つ積み、popstateでランディングに戻すようにする。
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      setMode(e.state?.pmWizard ? 'wizard' : 'landing');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openWizard = () => {
    window.history.pushState({ pmWizard: true }, '');
    setMode('wizard');
  };

  const closeWizard = () => {
    if (window.history.state?.pmWizard) {
      window.history.back();
    } else {
      setMode('landing');
    }
  };

  if (mode === 'wizard') {
    return <PMSimulatorWizard onStart={onStart} onClose={closeWizard} ultraUnlocked={ultraUnlocked} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">

        {/* ── ① RPGゲーム ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mt-10 overflow-hidden rounded-3xl shadow-xl transition hover:shadow-2xl"
          style={{ backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #312e81 50%, #1e3a8a 100%)' }}
        >
          <div className="flex flex-col gap-6 p-7 sm:p-10 lg:flex-row lg:items-center lg:gap-10">
            <div className="flex-1">
              <span className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white">
                RPGゲーム
              </span>
              <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">配属先は、現場</h2>
              <p className="mt-1 text-sm font-semibold text-blue-300">SIer現場体験ストーリーRPG</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                新人SEとして2Dマップを歩き、NPCに話しかけながら現場の判断を体験する物語型RPG。要件定義・基本設計・テスト・炎上対応・リリースまで全5章。
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['🗺️ マップ探索', '💬 選択肢分岐', '📖 教育ポイント解説', '⏱️ 約15分'].map((tag) => (
                  <span key={tag} className="rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-300">{tag}</span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/game"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:from-blue-400 hover:to-purple-400"
                >
                  🎮 ゲームをプレイする <span className="text-base">→</span>
                </a>
                <a
                  href="/game"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-500 px-6 py-3 text-sm font-bold text-slate-200 transition hover:border-slate-300 hover:text-white"
                >
                  詳細をみる
                </a>
              </div>
            </div>

            {/* アイソメトリック風オフィスビル */}
            <div className="mx-auto w-full max-w-[260px] shrink-0 lg:mx-0 lg:w-64">
              <svg viewBox="0 0 240 200" className="h-auto w-full" role="img" aria-label="オフィスビルのイラスト">
                <ellipse cx="130" cy="178" rx="100" ry="14" fill="#0f172a" opacity="0.35" />
                {/* building */}
                <polygon points="70,30 170,30 205,55 105,55" fill="#e2e8f0" />
                <polygon points="70,30 105,55 105,165 70,145" fill="#94a3b8" />
                <polygon points="105,55 205,55 205,165 105,165" fill="#cbd5e1" />
                {/* windows */}
                <rect x="118" y="70" width="18" height="18" rx="2" fill="#7dd3fc" />
                <rect x="160" y="70" width="18" height="18" rx="2" fill="#7dd3fc" />
                <rect x="118" y="102" width="18" height="18" rx="2" fill="#7dd3fc" />
                <rect x="160" y="102" width="18" height="18" rx="2" fill="#7dd3fc" />
                <rect x="80" y="72" width="14" height="16" rx="2" fill="#bae6fd" />
                <rect x="80" y="104" width="14" height="16" rx="2" fill="#bae6fd" />
                {/* door */}
                <rect x="138" y="138" width="26" height="27" rx="2" fill="#475569" />
                {/* trees */}
                <rect x="26" y="150" width="6" height="22" fill="#92744f" />
                <circle cx="29" cy="140" r="18" fill="#6ee7b7" />
                <circle cx="18" cy="150" r="12" fill="#34d399" />
                <rect x="205" y="158" width="5" height="18" fill="#92744f" />
                <circle cx="208" cy="150" r="14" fill="#4ade80" />
                {/* character */}
                <circle cx="58" cy="170" r="6" fill="#1e293b" />
                <rect x="53" y="176" width="10" height="14" rx="3" fill="#3b82f6" />
                {/* signpost */}
                <rect x="180" y="172" width="3" height="16" fill="#a8856a" />
                <rect x="172" y="164" width="20" height="10" rx="1" fill="#e7d3b3" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* ── 区切り ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="my-8 flex items-center gap-4"
        >
          <div className="h-px flex-1 bg-slate-200" />
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">または</p>
          <div className="h-px flex-1 bg-slate-200" />
        </motion.div>

        {/* ── ② PMシミュレーター ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-md transition hover:shadow-xl"
        >
          <div className="flex flex-col gap-6 p-7 sm:p-10 lg:flex-row lg:items-center lg:gap-10">
            <div className="flex-1">
              <span className="inline-block rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white">
                シミュレーションゲーム
              </span>
              <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">PMシミュレーター</h2>
              <p className="mt-1 text-sm font-semibold text-emerald-600">プロジェクトマネジメント体験シミュレーション</p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                プロジェクトの種類と難易度を選び、納期・品質・コストのバランスを取りながらプロジェクトを成功に導くシミュレーションゲーム。
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['📋 プロジェクト管理', '📈 リソース配分', '👥 リスク対応', '⏱ 約20〜30分'].map((tag) => (
                  <span key={tag} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">{tag}</span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openWizard}
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:bg-emerald-700"
                >
                  ▶ シミュレーターをプレイする <span className="text-base">→</span>
                </button>
                <button
                  type="button"
                  onClick={openWizard}
                  className="inline-flex items-center justify-center rounded-2xl border border-emerald-300 px-6 py-3 text-sm font-bold text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50"
                >
                  詳細をみる
                </button>
              </div>
            </div>

            {/* ダッシュボード風イラスト */}
            <div className="mx-auto w-full max-w-xs shrink-0 lg:mx-0 lg:w-64">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 sm:p-5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex-1 space-y-2.5">
                    <div className="h-2.5 w-full rounded-full bg-white">
                      <div className="h-2.5 w-4/5 rounded-full bg-blue-400" />
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-white">
                      <div className="h-2.5 w-3/5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-white">
                      <div className="h-2.5 w-2/3 rounded-full bg-amber-400" />
                    </div>
                  </div>
                  <div
                    className="h-16 w-16 shrink-0 rounded-full ring-4 ring-white"
                    style={{ background: 'conic-gradient(#34d399 0% 45%, #60a5fa 45% 75%, #fbbf24 75% 100%)' }}
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-lg">
                  <div className="rounded-xl bg-white py-2 shadow-sm">👥</div>
                  <div className="rounded-xl bg-white py-2 shadow-sm">💰</div>
                  <div className="rounded-xl bg-white py-2 shadow-sm">📈</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
