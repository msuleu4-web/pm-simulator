'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [showRpgDetails, setShowRpgDetails] = useState(false);
  const [showSimDetails, setShowSimDetails] = useState(false);

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
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-5xl">

        {/* ── セクション見出し ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 text-center sm:mb-8"
        >
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">SIer道場</p>
          <h1 className="mt-2 text-xl font-black text-slate-900 sm:text-3xl">学習モードを選択</h1>

          {/* モバイル: 短い説明 */}
          <p className="mx-auto mt-2 max-w-xs text-sm text-slate-600 sm:hidden">
            2つの研修モードから、学びたい仕事を選びましょう。
          </p>
          {/* デスクトップ: 詳しい説明 */}
          <p className="mx-auto mt-2 hidden max-w-xl text-sm leading-relaxed text-slate-600 sm:block">
            現場判断を体験する<strong className="font-bold text-slate-800">RPGモード</strong>と、
            プロジェクト管理を学ぶ<strong className="font-bold text-slate-800">PMシミュレーター</strong>の
            2つの研修モードを用意しています。
          </p>
        </motion.div>

        {/* ── 2カードグリッド ── */}
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">

          {/* ── MODE 01 : RPGモード ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="h-1 w-full bg-blue-600" />

            <div className="flex flex-1 flex-col p-5 sm:p-6">
              {/* MODE バッジ行 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">MODE 01</span>
                  <span className="h-3 w-px bg-slate-200" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">ストーリーRPG</span>
                </div>
                <span className="rounded border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                  体験型
                </span>
              </div>

              {/* タイトル */}
              <div className="mt-3">
                <span className="rounded border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
                  RPGモード
                </span>
                <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">配属先は、現場</h2>
                <p className="mt-0.5 text-sm font-semibold text-blue-600">現場判断を体験するストーリーRPG</p>
              </div>

              {/* モバイル用ラベル */}
              <div className="mt-3 flex flex-wrap gap-1.5 sm:hidden">
                {['会話・選択', '新人SE向け', '約15分'].map((t) => (
                  <span key={t} className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600">
                    {t}
                  </span>
                ))}
              </div>

              {/* ミニオフィスマッププレビュー */}
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2.5 sm:mt-4" aria-hidden="true">
                <div className="mb-1.5 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-300" />
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="ml-1 text-[8px] font-black uppercase tracking-wider text-slate-400">FLOOR 1F · 配属フロア</span>
                </div>
                {/* マップ: h-28(112px)固定 */}
                <div className="relative overflow-hidden rounded-lg bg-slate-100" style={{ height: 112 }}>
                  <div
                    className="absolute inset-0 grid gap-0.5 p-1"
                    style={{ gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: 'repeat(6, 1fr)' }}
                  >
                    {Array.from({ length: 72 }).map((_, i) => (
                      <div key={i} className="rounded-[1px] bg-slate-200/60" />
                    ))}
                  </div>
                  {/* ホワイトボード */}
                  <div className="absolute left-3 top-2 flex h-3 w-14 items-center justify-center rounded border border-slate-300 bg-white">
                    <div className="h-0.5 w-10 rounded bg-slate-300" />
                  </div>
                  {/* デスク */}
                  <div className="absolute left-3 top-8 h-3.5 w-9 rounded border border-amber-200 bg-amber-100" />
                  <div className="absolute right-4 top-8 h-3.5 w-9 rounded border border-amber-200 bg-amber-100" />
                  {/* NPC: 上司 */}
                  <div className="absolute left-16 top-6">
                    <div className="h-4 w-4 rounded-full border border-white bg-orange-400" />
                    <div className="mt-0.5 h-2.5 w-4 rounded bg-orange-300" />
                  </div>
                  {/* NPC: 同僚 */}
                  <div className="absolute bottom-9 right-6">
                    <div className="h-4 w-4 rounded-full border border-white bg-emerald-400" />
                    <div className="mt-0.5 h-2.5 w-4 rounded bg-emerald-300" />
                  </div>
                  {/* プレイヤー */}
                  <div className="absolute bottom-9 left-1/2 -translate-x-1/2">
                    <div className="h-4 w-4 rounded-full border border-white bg-blue-600 ring-2 ring-blue-200" />
                    <div className="mt-0.5 h-2.5 w-4 rounded bg-blue-400" />
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <span className="text-[6px] font-black uppercase text-blue-600">YOU</span>
                  </div>
                  {/* セリフ */}
                  <div className="absolute left-[68px] top-[32px] whitespace-nowrap rounded border border-slate-200 bg-white px-1 py-0.5 text-[6px] font-semibold text-slate-700 shadow-sm">
                    要件をヒアリングします
                  </div>
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[8px] text-slate-400">第1章 · 配属・キックオフ</span>
                  <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[8px] font-bold text-blue-600">▶ 進行可能</span>
                </div>
              </div>

              {/* 情報行: デスクトップのみ表示 */}
              <div className="mt-4 hidden space-y-1.5 border-t border-slate-100 pt-4 sm:block">
                {[
                  { label: '形式',      value: '2Dマップ探索 / NPC会話 / 選択肢分岐' },
                  { label: '学べること', value: '要件定義・設計・テスト・炎上対応' },
                  { label: 'おすすめ',  value: '新人SE・就活生' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-2">
                    <span className="w-20 shrink-0 text-[11px] font-bold text-slate-500">{label}</span>
                    <span className="text-[11px] text-slate-700">{value}</span>
                  </div>
                ))}
              </div>

              {/* 特徴チップ: デスクトップのみ */}
              <div className="mt-3 hidden flex-wrap gap-1.5 sm:flex">
                {['マップ探索', 'NPC会話', '章クリア型'].map((tag) => (
                  <span key={tag} className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTAボタン */}
              <div className="mt-4 space-y-2 sm:mt-5">
                <a
                  href="/game"
                  className="block w-full rounded-lg bg-blue-600 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-700 sm:py-2.5"
                >
                  RPGモードを始める →
                </a>
                <button
                  type="button"
                  onClick={() => setShowRpgDetails((prev) => !prev)}
                  aria-expanded={showRpgDetails}
                  className="block w-full rounded-lg border border-slate-200 bg-white py-2 text-center text-xs font-semibold text-slate-600 transition hover:bg-slate-50 sm:text-sm sm:text-slate-700"
                >
                  {showRpgDetails ? 'モード詳細を閉じる ▲' : 'モード詳細を見る ▼'}
                </button>
              </div>

              {/* 展開詳細 */}
              <AnimatePresence initial={false}>
                {showRpgDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                      <p>
                        新人SEとして現場に配属され、オフィスのマップを歩きながら上司やメンバーに話しかけ、
                        資料を読み解いて各章のミッションを進めるストーリー型RPGです。
                        場面ごとの選択肢によって評価が変わり、最後にあなたの「現場での働き方」が称号として評価されます。
                      </p>
                      {/* モバイルでは情報行もここに表示 */}
                      <div className="mt-3 space-y-1.5 sm:hidden">
                        {[
                          { label: '形式',      value: '2Dマップ探索 / NPC会話 / 選択肢分岐' },
                          { label: '学べること', value: '要件定義・設計・テスト・炎上対応' },
                          { label: 'おすすめ',  value: '新人SE・就活生' },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex gap-2">
                            <span className="w-20 shrink-0 text-[11px] font-bold text-slate-500">{label}</span>
                            <span className="text-[11px] text-slate-600">{value}</span>
                          </div>
                        ))}
                      </div>
                      <ul className="mt-3 space-y-1.5 text-slate-600">
                        <li>📋 第1〜7章：配属・要件定義・基本設計・製造・テスト・炎上対応・リリース運用</li>
                        <li>🧭 2Dマップを移動してNPCに話しかけたり、資料を確認しながら進行</li>
                        <li>💬 各章の選択肢に応じてスコアが変動し、全章の合計で評価が決まる</li>
                        <li>🏆 「エースSE」「一人前SE」「炎上サバイバー」のいずれかの称号を獲得</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── MODE 02 : PMシミュレーター ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="h-1 w-full bg-emerald-600" />

            <div className="flex flex-1 flex-col p-5 sm:p-6">
              {/* MODE バッジ行 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">MODE 02</span>
                  <span className="h-3 w-px bg-slate-200" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">PMシミュレーター</span>
                </div>
                <span className="rounded border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  管理型
                </span>
              </div>

              {/* タイトル */}
              <div className="mt-3">
                <span className="rounded border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                  シミュレーションゲーム
                </span>
                <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">PMシミュレーター</h2>
                <p className="mt-0.5 text-sm font-semibold text-emerald-600">プロジェクト管理を体験するシミュレーション</p>
              </div>

              {/* モバイル用ラベル */}
              <div className="mt-3 flex flex-wrap gap-1.5 sm:hidden">
                {['QCD判断', 'PM志望向け', '約20〜30分'].map((t) => (
                  <span key={t} className="rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                    {t}
                  </span>
                ))}
              </div>

              {/* ダッシュボードプレビュー */}
              <div className="mt-3 overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 sm:mt-4" aria-hidden="true">
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-300" />
                  <span className="h-2 w-2 rounded-full bg-amber-300" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="ml-1 text-[8px] font-black uppercase tracking-wider text-slate-400">PROJECT DASHBOARD</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2.5">
                    <div>
                      <div className="mb-1 flex justify-between">
                        <span className="text-[9px] font-semibold text-slate-500">品質</span>
                        <span className="text-[9px] font-bold text-blue-600">80%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white">
                        <div className="h-2 w-4/5 rounded-full bg-blue-400" />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between">
                        <span className="text-[9px] font-semibold text-slate-500">コスト</span>
                        <span className="text-[9px] font-bold text-emerald-600">62%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white">
                        <div className="h-2 w-3/5 rounded-full bg-emerald-400" />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between">
                        <span className="text-[9px] font-semibold text-slate-500">進捗</span>
                        <span className="text-[9px] font-bold text-amber-600">68%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white">
                        <div className="h-2 w-2/3 rounded-full bg-amber-400" />
                      </div>
                    </div>
                  </div>
                  <div
                    className="h-16 w-16 shrink-0 rounded-full ring-2 ring-white"
                    style={{ background: 'conic-gradient(#34d399 0% 45%, #60a5fa 45% 75%, #fbbf24 75% 100%)' }}
                  />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
                  <div className="rounded-lg border border-slate-200 bg-white py-1.5 text-[10px] font-semibold text-slate-600 shadow-sm">👥 チーム</div>
                  <div className="rounded-lg border border-slate-200 bg-white py-1.5 text-[10px] font-semibold text-slate-600 shadow-sm">💰 予算</div>
                  <div className="rounded-lg border border-slate-200 bg-white py-1.5 text-[10px] font-semibold text-slate-600 shadow-sm">📈 進捗</div>
                </div>
              </div>

              {/* 情報行: デスクトップのみ表示 */}
              <div className="mt-4 hidden space-y-1.5 border-t border-slate-100 pt-4 sm:block">
                {[
                  { label: '形式',      value: '意思決定 / 進捗管理 / リスク判断' },
                  { label: '学べること', value: '納期・品質・コスト・チーム管理' },
                  { label: 'おすすめ',  value: 'PM志望・上流工程を学びたい人' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-2">
                    <span className="w-20 shrink-0 text-[11px] font-bold text-slate-500">{label}</span>
                    <span className="text-[11px] text-slate-700">{value}</span>
                  </div>
                ))}
              </div>

              {/* 特徴チップ: デスクトップのみ */}
              <div className="mt-3 hidden flex-wrap gap-1.5 sm:flex">
                {['進捗管理', 'リスク判断', 'QCD管理'].map((tag) => (
                  <span key={tag} className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTAボタン */}
              <div className="mt-4 space-y-2 sm:mt-5">
                <button
                  type="button"
                  onClick={openWizard}
                  className="block w-full rounded-lg bg-emerald-600 py-3 text-center text-sm font-bold text-white transition hover:bg-emerald-700 sm:py-2.5"
                >
                  PMシミュレーターを始める →
                </button>
                <button
                  type="button"
                  onClick={() => setShowSimDetails((prev) => !prev)}
                  aria-expanded={showSimDetails}
                  className="block w-full rounded-lg border border-slate-200 bg-white py-2 text-center text-xs font-semibold text-slate-600 transition hover:bg-slate-50 sm:text-sm sm:text-slate-700"
                >
                  {showSimDetails ? 'モード詳細を閉じる ▲' : 'モード詳細を見る ▼'}
                </button>
              </div>

              {/* 展開詳細 */}
              <AnimatePresence initial={false}>
                {showSimDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm leading-6 text-slate-700">
                      <p>
                        「プロジェクトタイプ」→「難易度」→「プロジェクト」の3ステップで設定を選んでスタート。
                        納期・予算・品質・チームの状態を見ながら、各ターンで起こる出来事への対応を選択していくマネジメントシミュレーションです。
                      </p>
                      {/* モバイルでは情報行もここに表示 */}
                      <div className="mt-3 space-y-1.5 sm:hidden">
                        {[
                          { label: '形式',      value: '意思決定 / 進捗管理 / リスク判断' },
                          { label: '学べること', value: '納期・品質・コスト・チーム管理' },
                          { label: 'おすすめ',  value: 'PM志望・上流工程を学びたい人' },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex gap-2">
                            <span className="w-20 shrink-0 text-[11px] font-bold text-slate-500">{label}</span>
                            <span className="text-[11px] text-slate-600">{value}</span>
                          </div>
                        ))}
                      </div>
                      <ul className="mt-3 space-y-1.5 text-slate-600">
                        <li>🆕 新規開発・🔧 保守運用・👥 開発メンバー・📊 PMO の4タイプから立場を選択</li>
                        <li>🎯 難易度ごとにプロジェクト期間・チーム規模・トラブルの強度が変化</li>
                        <li>📈 予算・進捗・品質・チームの状態を管理しながら判断</li>
                        <li>🏁 選択の積み重ねでエンディングが分岐</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>

        {/* ── 下部比較行 ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:gap-4"
        >
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-center sm:px-4 sm:py-2.5">
            <p className="text-[11px] font-bold text-blue-700 sm:text-xs">
              <span className="sm:hidden">RPG: 現場判断を鍛える</span>
              <span className="hidden sm:inline">RPGモード: 現場の判断力を鍛える</span>
            </p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-center sm:px-4 sm:py-2.5">
            <p className="text-[11px] font-bold text-emerald-700 sm:text-xs">
              <span className="sm:hidden">PM: 管理力を鍛える</span>
              <span className="hidden sm:inline">PMシミュレーター: プロジェクト管理力を鍛える</span>
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
