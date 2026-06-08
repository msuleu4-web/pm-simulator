'use client';

import { useState } from 'react';
import type { Scenario, Choice, Effect, GameState } from '../../lib/types';
import { Tooltip } from './Tooltip';
import { pmBokDefinitions } from '../../lib/pmBokDefinitions';
import { ClientChatModal } from './ClientChatModal';

/** `**太字**` を <strong> に変換する */
function B(text: string) {
  if (!text.includes('**')) return <>{text}</>;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} className="font-bold text-emerald-900">{p.slice(2, -2)}</strong>
          : p
      )}
    </>
  );
}

type KpiState = Pick<GameState, 'quality' | 'cost' | 'schedule' | 'stakeholder' | 'morale'>;

const effectItems: { key: keyof Effect; label: string }[] = [
  { key: 'quality', label: '品質' },
  { key: 'cost', label: '予算' },
  { key: 'schedule', label: '納期余裕' },
  { key: 'stakeholder', label: '顧客満足' },
  { key: 'morale', label: 'チーム士気' },
];

function EffectHints({ effects }: { effects: Effect }) {
  const visible = effectItems.filter((e) => effects[e.key] !== 0);
  if (visible.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {visible.map((e) => {
        const val = effects[e.key];
        const positive = val > 0;
        return (
          <span key={e.key} className={`rounded-full px-2 py-0.5 text-xs font-semibold ${positive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {positive ? '↑' : '↓'} {e.label}
          </span>
        );
      })}
    </div>
  );
}

export function ScenarioCard({
  scenario,
  onSelectChoice,
  selectedTag,
  clientInfo,
  kpiState,
  phaseLabel,
}: {
  scenario: Scenario;
  onSelectChoice: (choice: Choice) => void;
  selectedTag?: string;
  clientInfo?: { name: string; description: string };
  kpiState?: KpiState;
  phaseLabel?: string;
}) {
  const [showClientChat, setShowClientChat] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-soft">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">シナリオ</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">{scenario.title}</h1>
        </div>
      </div>
      <p className="text-slate-600">{scenario.description}</p>

      {scenario.pmTip && (
        <div className="mt-4 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <span className="mt-0.5 text-base">💡</span>
          <p className="text-sm leading-6 text-emerald-800">{B(scenario.pmTip ?? '')}</p>
        </div>
      )}

      {scenario.learningImage && (
        <>
          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-left transition hover:border-sky-400 hover:bg-sky-100"
          >
            <span className="text-base">📊</span>
            <div>
              <p className="text-sm font-semibold text-sky-800">参考資料を見る</p>
              <p className="text-xs text-sky-600">{scenario.learningImage.caption}</p>
            </div>
            <span className="ml-auto text-xs text-sky-500">タップで拡大 →</span>
          </button>

          {showImageModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
              onClick={() => setShowImageModal(false)}
            >
              <div
                className="relative flex max-h-[90vh] max-w-4xl flex-col overflow-auto rounded-3xl bg-white p-3 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/70 text-sm text-white hover:bg-slate-900"
                >
                  ✕
                </button>
                <img
                  src={scenario.learningImage.src}
                  alt={scenario.learningImage.caption}
                  className="rounded-2xl object-contain"
                />
                <p className="mt-2 text-center text-sm text-slate-600">{scenario.learningImage.caption}</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* クライアント相談ボタン */}
      {scenario.clientChat && clientInfo && kpiState && (
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-amber-800">📞 クライアントに確認できます</p>
            <p className="text-xs text-amber-700">判断前にクライアントと直接話して状況を把握できます（最大7ターン）</p>
          </div>
          <button
            type="button"
            onClick={() => setShowClientChat(true)}
            className="ml-4 shrink-0 rounded-2xl bg-amber-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-600"
          >
            相談する
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {scenario.docs.map((doc) => (
          <div key={doc.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center justify-between gap-2 text-sm text-slate-500">
              <span className="font-semibold text-slate-700">{doc.type}</span>
              <span>{doc.title}</span>
            </div>
            <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{doc.content}</pre>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">どう判断しますか？</p>
        {scenario.choices.map((choice) => {
          const isRelated = selectedTag ? choice.pmBokTags.includes(selectedTag) : false;
          return (
            <button
              key={choice.id}
              onClick={() => onSelectChoice(choice)}
              className={`w-full rounded-3xl border px-5 py-4 text-left shadow-sm transition hover:border-brand-500 hover:bg-white ${
                isRelated ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-slate-100'
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <p className="text-base font-semibold text-slate-900">{choice.label}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {choice.pmBokTags.map((tag) => (
                    <Tooltip key={tag} label={tag} description={pmBokDefinitions[tag] ?? ''} />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-600">{choice.summary}</p>
              <EffectHints effects={choice.effects} />
              {isRelated && (
                <p className="mt-3 text-sm font-medium text-brand-700">この選択肢には「{selectedTag}」が関連しています。</p>
              )}
            </button>
          );
        })}
      </div>

      {showClientChat && clientInfo && kpiState && (
        <ClientChatModal
          scenarioTitle={scenario.title}
          scenarioDescription={scenario.description}
          phaseLabel={phaseLabel ?? ''}
          clientName={clientInfo.name}
          clientDescription={clientInfo.description}
          state={kpiState}
          onClose={() => setShowClientChat(false)}
        />
      )}
    </div>
  );
}
