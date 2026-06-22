'use client';

import { useState, useMemo } from 'react';
import type {
  ScenarioState,
  ScenarioEvent,
  ScenarioChoice,
  ChapterId,
  ScenarioFlagKey,
  NpcTrustKey,
  ScenarioMetricKey,
} from '../../../src/game/scenario/types';
import {
  createInitialScenarioState,
  calculateScenarioEnding,
} from '../../../src/game/scenario/scenarioState';
import {
  applyScenarioChoice,
  getScenarioEventsForChapter,
} from '../../../src/game/scenario/scenarioEffects';
import { SCENARIO_EVENTS } from '../../../src/game/scenario/scenarioEvents';

// ── 定数 ──────────────────────────────────────────────────────────────────

const FLAG_KEYS: ScenarioFlagKey[] = [
  'minutesDocumented', 'roleConfirmed', 'ambiguityFlagged',
  'clientExpectationRisk', 'requirementsPrioritized', 'scopeChangeLogged',
  'legacySystemRisk', 'nonFunctionalChecked', 'securityReviewed',
  'technicalDebtNoted', 'permanentFixChosen', 'reviewCompleted',
  'edgeCaseTested', 'evidenceRecorded', 'testSkipped',
];

const NPC_KEYS: NpcTrustKey[] = ['tanaka', 'satou', 'suzuki', 'ishida'];

const METRIC_KEYS: ScenarioMetricKey[] = [
  'trust', 'quality', 'schedule', 'cost', 'teamMorale',
  'clientSatisfaction', 'compliance', 'technicalDebt', 'learning',
];

const SLOT_COLORS: Record<string, string> = {
  INTRO:     'bg-slate-100 text-slate-500',
  MISSION_A: 'bg-blue-50 text-blue-600',
  MISSION_B: 'bg-blue-50 text-blue-600',
  MISSION_C: 'bg-blue-50 text-blue-600',
  SIDE:      'bg-green-50 text-green-600',
  RISK:      'bg-red-50 text-red-600',
  JUDGE:     'bg-amber-50 text-amber-700',
  REVIEW:    'bg-purple-50 text-purple-600',
};

// ── クイックテスト定義 ────────────────────────────────────────────────────

const CH1_GOOD: { eventId: string; choiceId: string }[] = [
  { eventId: 'E02', choiceId: 'E02-A' },
  { eventId: 'E03', choiceId: 'E03-A' },
  { eventId: 'E04', choiceId: 'E04-A' },
  { eventId: 'E05', choiceId: 'E05-A' },
  { eventId: 'E06', choiceId: 'E06-A' },
  { eventId: 'E07', choiceId: 'E07-A' }, // 条件: minutesDocumented=true → E02-Aで成立
];

const CH1_BAD: { eventId: string; choiceId: string }[] = [
  { eventId: 'E02', choiceId: 'E02-C' }, // minutesDocumented=falseのまま
  { eventId: 'E03', choiceId: 'E03-C' },
  { eventId: 'E04', choiceId: 'E04-C' },
  { eventId: 'E05', choiceId: 'E05-B' },
  { eventId: 'E06', choiceId: 'E06-C' }, // clientExpectationRisk=true
  // E07はminutesDocumented=false → 条件未達でスキップ
];

// ── 条件チェックユーティリティ ────────────────────────────────────────────

function checkCondition(event: ScenarioEvent, state: ScenarioState): boolean {
  const cond = event.condition;
  if (!cond) return true;
  if (cond.requiredFlags) {
    for (const [k, v] of Object.entries(cond.requiredFlags)) {
      if (state.flags[k as ScenarioFlagKey] !== v) return false;
    }
  }
  if (cond.blockedFlags) {
    for (const k of cond.blockedFlags) {
      if (state.flags[k]) return false;
    }
  }
  if (cond.requiredNpcTrust) {
    for (const [k, minVal] of Object.entries(cond.requiredNpcTrust) as [NpcTrustKey, number][]) {
      if (state.npcTrust[k] < minVal) return false;
    }
  }
  return true;
}

// ── メインコンポーネント ──────────────────────────────────────────────────

export default function ScenarioTestPage() {
  const [state, setState] = useState<ScenarioState>(() => createInitialScenarioState());
  const [currentChapter, setCurrentChapter] = useState<ChapterId>(1);
  const [log, setLog] = useState<string[]>([]);

  const events = useMemo(
    () => getScenarioEventsForChapter(currentChapter, state),
    [currentChapter, state],
  );

  const ending = useMemo(() => calculateScenarioEnding(state), [state]);

  // 全イベント数（fallback除く）
  const totalEventsByChapter = (ch: ChapterId) =>
    SCENARIO_EVENTS.filter((e) => e.chapterId === ch && !e.id.includes('FALLBACK')).length;

  // ── アクション ──────────────────────────────────────────────────────────

  function handleChoice(event: ScenarioEvent, choice: ScenarioChoice) {
    const next = applyScenarioChoice(state, event, choice);
    setState(next);

    const d = choice.effect.scoreDelta;
    const lines: string[] = [
      `[${event.id}] ${choice.id}: "${choice.text}"`,
      `スコア: ${d >= 0 ? '+' : ''}${d}点 → 累計 ${next.totalScore}点`,
    ];
    if (choice.effect.flagUpdates) {
      lines.push('フラグ更新: ' + Object.entries(choice.effect.flagUpdates).map(([k, v]) => `${k} → ${String(v)}`).join(', '));
    }
    if (choice.effect.npcTrustDeltas) {
      lines.push('NPC信頼: ' + Object.entries(choice.effect.npcTrustDeltas).map(([k, v]) => `${k} ${(v as number) >= 0 ? '+' : ''}${v}`).join(', '));
    }
    if (choice.effect.metricDeltas) {
      lines.push('メトリクス: ' + Object.entries(choice.effect.metricDeltas).map(([k, v]) => `${k} ${(v as number) >= 0 ? '+' : ''}${v}`).join(', '));
    }
    lines.push('📘 ' + choice.effect.explanation);
    setLog(lines);
  }

  function runQuick(choices: { eventId: string; choiceId: string }[], label: string) {
    let s = createInitialScenarioState();
    const lines: string[] = [`=== ${label} ===`];
    for (const { eventId, choiceId } of choices) {
      const ev = SCENARIO_EVENTS.find((e) => e.id === eventId);
      if (!ev) { lines.push(`${eventId}: イベント未定義`); continue; }
      if (!checkCondition(ev, s)) {
        lines.push(`${eventId}: 条件未達 → スキップ（期待通り）`);
        continue;
      }
      const ch = ev.choices.find((c) => c.id === choiceId);
      if (!ch) { lines.push(`${eventId}/${choiceId}: 選択肢未定義`); continue; }
      s = applyScenarioChoice(s, ev, ch);
      const d = ch.effect.scoreDelta;
      lines.push(`${eventId}: "${ch.text}" → ${d >= 0 ? '+' : ''}${d}点`);
      if (ch.effect.flagUpdates) {
        lines.push('  ↳ フラグ: ' + Object.entries(ch.effect.flagUpdates).map(([k, v]) => `${k}=${String(v)}`).join(', '));
      }
    }
    lines.push(`=== 完了: totalScore = ${s.totalScore} ===`);
    setState(s);
    setLog(lines);
    setCurrentChapter(1);
  }

  function toggleFlag(key: ScenarioFlagKey) {
    setState((prev) => ({
      ...prev,
      flags: { ...prev.flags, [key]: !prev.flags[key] },
    }));
    setLog([`[手動] フラグ "${key}" を ${!state.flags[key] ? 'ON' : 'OFF'} に変更`]);
  }

  function adjustTrust(key: NpcTrustKey, delta: number) {
    setState((prev) => {
      const next = Math.max(0, Math.min(3, prev.npcTrust[key] + delta)) as 0 | 1 | 2 | 3;
      return { ...prev, npcTrust: { ...prev.npcTrust, [key]: next } };
    });
    setLog([`[手動] NPC信頼 "${key}" を調整`]);
  }

  function resetState() {
    setState(createInitialScenarioState());
    setLog(['状態をリセットしました']);
  }

  // ── レンダリング ─────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800" style={{ fontSize: '13px' }}>
      {/* ── ヘッダー ─────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-3 flex-wrap sticky top-0 z-20 shadow-sm">
        <span className="font-bold text-sm">🎮 Scenario Engine Test</span>
        <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded font-medium">
          開発用 / 本番導線未接続
        </span>
        <span className="text-slate-400 text-xs hidden sm:block">
          E01〜E56 全56イベント | URL: /game/scenario-test
        </span>
        <div className="ml-auto flex gap-2 flex-wrap">
          <button
            onClick={() => runQuick(CH1_GOOD, '第1章 良い選択で進める')}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-medium hover:bg-emerald-700 transition-colors"
          >
            第1章 良い選択で進める
          </button>
          <button
            onClick={() => runQuick(CH1_BAD, '第1章 悪い選択で進める')}
            className="px-3 py-1.5 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition-colors"
          >
            第1章 悪い選択で進める
          </button>
          <button
            onClick={resetState}
            className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded text-xs font-medium hover:bg-slate-300 transition-colors"
          >
            状態をリセット
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-45px)]">
        {/* ── 左サイドバー: 状態パネル ──────────────────────────────── */}
        <aside className="w-72 flex-shrink-0 bg-white border-r border-slate-200 overflow-y-auto p-4 space-y-5">
          {/* スコア */}
          <div>
            <p className="text-xs text-slate-400 mb-0.5 uppercase tracking-wide">Total Score</p>
            <p className="text-4xl font-bold text-blue-600">{state.totalScore}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              クリア: {state.clearedEventIds.length} / 56イベント
            </p>
          </div>

          {/* エンディング */}
          <div className="p-3 rounded-lg border" style={{ borderColor: ending.color + '40', backgroundColor: ending.color + '10' }}>
            <p className="text-xs text-slate-400 mb-1 uppercase">Ending (現在の判定)</p>
            <p className="font-bold text-base" style={{ color: ending.color }}>{ending.title}</p>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">{ending.id}</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{ending.comment.split('\n')[0]}</p>
          </div>

          {/* フラグ（クリックでON/OFF） */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Flags</p>
              <span className="text-xs text-slate-400">
                {FLAG_KEYS.filter((k) => state.flags[k]).length} / 15
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-2">クリックで手動ON/OFF（条件発火テスト用）</p>
            <div className="space-y-0.5">
              {FLAG_KEYS.map((key) => {
                const active = state.flags[key];
                const isRisk = ['clientExpectationRisk', 'legacySystemRisk', 'testSkipped'].includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggleFlag(key)}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left transition-colors ${
                      active
                        ? isRisk
                          ? 'bg-red-50 text-red-700'
                          : 'bg-emerald-50 text-emerald-700'
                        : 'hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    <span className={`text-base leading-none ${active ? (isRisk ? 'text-red-500' : 'text-emerald-500') : 'text-slate-300'}`}>
                      {active ? '●' : '○'}
                    </span>
                    <span className="font-mono text-xs">{key}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* NPC信頼度 */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">NPC Trust</p>
            <p className="text-xs text-slate-400 mb-2">−/＋ボタンで手動調整</p>
            <div className="space-y-2">
              {NPC_KEYS.map((key) => {
                const val = state.npcTrust[key];
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-600 w-14">{key}</span>
                    <button
                      onClick={() => adjustTrust(key, -1)}
                      disabled={val === 0}
                      className="w-6 h-6 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 rounded text-xs font-bold text-slate-600 transition-colors"
                    >
                      −
                    </button>
                    <div className="flex gap-0.5">
                      {([0, 1, 2, 3] as const).map((i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 rounded text-center text-xs leading-6 font-bold ${
                            i <= val
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-100 text-slate-300'
                          }`}
                        >
                          {i}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => adjustTrust(key, 1)}
                      disabled={val === 3}
                      className="w-6 h-6 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 rounded text-xs font-bold text-slate-600 transition-colors"
                    >
                      ＋
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* メトリクス */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Metrics</p>
            <div className="space-y-2">
              {METRIC_KEYS.map((key) => {
                const val = state.metrics[key];
                const isDebt = key === 'technicalDebt';
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="font-mono text-slate-500">{key}</span>
                      <span className="font-bold text-slate-700">{val}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isDebt
                            ? 'bg-red-400'
                            : val >= 70
                            ? 'bg-emerald-400'
                            : val >= 40
                            ? 'bg-blue-400'
                            : 'bg-amber-400'
                        }`}
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* クリア済みイベント */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
              Cleared Events ({state.clearedEventIds.length})
            </p>
            <div className="flex flex-wrap gap-1">
              {state.clearedEventIds.length === 0 ? (
                <span className="text-xs text-slate-400">なし</span>
              ) : (
                state.clearedEventIds.map((id) => (
                  <span
                    key={id}
                    className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono"
                  >
                    {id}
                  </span>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* ── メインエリア: イベントパネル ──────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 min-w-0">
          {/* 章選択タブ */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {([1, 2, 3, 4, 5, 6, 7] as ChapterId[]).map((ch) => (
              <button
                key={ch}
                onClick={() => setCurrentChapter(ch)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentChapter === ch
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                第{ch}章
                <span className="ml-1 text-xs opacity-60">({totalEventsByChapter(ch)})</span>
              </button>
            ))}
          </div>

          {/* 表示件数インフォ */}
          <div className="mb-3 flex items-center gap-3 text-xs text-slate-500">
            <span>
              表示中: <strong>{events.length}件</strong>
            </span>
            <span>（条件未達はスキップ／fallbackに置換）</span>
            {events.some((e) => e.id.includes('FALLBACK')) && (
              <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded font-medium">
                FALLBACKイベント発動中
              </span>
            )}
          </div>

          {/* アクションログ */}
          {log.length > 0 && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs font-bold text-amber-700 mb-2">最後のアクション</p>
              <div className="space-y-0.5">
                {log.map((line, i) => (
                  <p
                    key={i}
                    className={`text-xs ${
                      line.startsWith('===')
                        ? 'font-bold text-amber-800'
                        : line.startsWith('📘')
                        ? 'text-amber-600 mt-1'
                        : line.startsWith('  ↳')
                        ? 'text-amber-500 ml-3'
                        : 'text-amber-800'
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* 条件発火チェックシート */}
          <ConditionCheckSheet currentChapter={currentChapter} state={state} />

          {/* イベント一覧 */}
          <div className="space-y-3 mt-4">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                state={state}
                onChoice={handleChoice}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

// ── 条件発火チェックシート ────────────────────────────────────────────────

function ConditionCheckSheet({
  currentChapter,
  state,
}: {
  currentChapter: ChapterId;
  state: ScenarioState;
}) {
  const conditionalEvents = SCENARIO_EVENTS.filter(
    (e) => e.chapterId === currentChapter && e.condition != null,
  );
  if (conditionalEvents.length === 0) return null;

  return (
    <div className="bg-white border border-orange-200 rounded-lg p-3 mb-1">
      <p className="text-xs font-bold text-orange-700 mb-2">
        第{currentChapter}章の条件付きイベント ({conditionalEvents.length}件)
      </p>
      <div className="space-y-1.5">
        {conditionalEvents.map((ev) => {
          const met = checkCondition(ev, state);
          const isFb = ev.id.includes('FALLBACK');
          return (
            <div
              key={ev.id}
              className={`flex items-center gap-2 text-xs p-1.5 rounded ${
                met && !isFb
                  ? 'bg-emerald-50 text-emerald-700'
                  : isFb
                  ? 'bg-purple-50 text-purple-600'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              <span className="font-bold text-base leading-none">
                {isFb ? '↩' : met ? '✓' : '✗'}
              </span>
              <span className="font-mono font-bold w-24 flex-shrink-0">{ev.id}</span>
              <span>{ev.title}</span>
              <span className="ml-auto text-xs opacity-70">
                {isFb
                  ? 'fallback候補'
                  : met
                  ? '発火'
                  : '未発火（条件不成立）'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── イベントカード ────────────────────────────────────────────────────────

function EventCard({
  event,
  state,
  onChoice,
}: {
  event: ScenarioEvent;
  state: ScenarioState;
  onChoice: (ev: ScenarioEvent, ch: ScenarioChoice) => void;
}) {
  const isCleared = state.clearedEventIds.includes(event.id);
  const selectedChoiceId = state.selectedChoices[event.id];
  const isFallback = event.id.includes('FALLBACK');

  return (
    <div
      className={`bg-white rounded-lg border p-4 transition-colors ${
        isCleared
          ? 'border-emerald-300'
          : isFallback
          ? 'border-purple-300'
          : 'border-slate-200'
      }`}
    >
      {/* ヘッダー行 */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
          {event.id}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded font-medium ${SLOT_COLORS[event.slot] ?? 'bg-slate-100 text-slate-500'}`}>
          {event.slot}
        </span>
        {isFallback && (
          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded font-medium">
            ↩ FALLBACK
          </span>
        )}
        {event.condition && !isFallback && (
          <span className="text-xs bg-orange-50 text-orange-500 px-2 py-0.5 rounded">
            条件付き
          </span>
        )}
        {isCleared && (
          <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded ml-auto">
            ✓ クリア済み
          </span>
        )}
      </div>

      {/* タイトル・本文 */}
      <p className="font-bold text-slate-800 mb-1">{event.title}</p>
      <p className="text-xs text-slate-500 mb-3 leading-relaxed">{event.body}</p>

      {/* 条件情報 */}
      {event.condition && (
        <div className="mb-3 p-2 bg-orange-50 border border-orange-100 rounded text-xs text-orange-700 space-y-0.5">
          <p className="font-bold">発火条件:</p>
          {event.condition.requiredFlags && (
            <p>
              必須フラグ:{' '}
              {Object.entries(event.condition.requiredFlags)
                .map(([k, v]) => `${k} = ${String(v)}`)
                .join(' / ')}
            </p>
          )}
          {event.condition.blockedFlags && (
            <p>ブロックフラグ: {event.condition.blockedFlags.join(', ')} がtrueの場合は非表示</p>
          )}
          {event.condition.requiredNpcTrust && (
            <p>
              必須NPC信頼:{' '}
              {Object.entries(event.condition.requiredNpcTrust)
                .map(([k, v]) => `${k} >= ${v}`)
                .join(' / ')}
            </p>
          )}
          {event.condition.fallbackEventId && (
            <p>条件不成立時 → {event.condition.fallbackEventId} に切替</p>
          )}
        </div>
      )}

      {/* INTRO / REVIEW ノート */}
      {(event.slot === 'INTRO' || event.slot === 'REVIEW') && event.reviewNote && (
        <div className="p-3 bg-blue-50 border border-blue-100 rounded text-xs text-blue-700 whitespace-pre-line leading-relaxed">
          {event.reviewNote}
        </div>
      )}

      {/* 選択肢 */}
      {event.choices.length > 0 && (
        <div className="space-y-2">
          {event.choices.map((choice) => {
            const isSelected = selectedChoiceId === choice.id;
            const d = choice.effect.scoreDelta;
            return (
              <button
                key={choice.id}
                onClick={() => onChoice(event, choice)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100'
                }`}
              >
                {/* 選択肢ヘッダー */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-xs text-slate-400 mr-1.5">[{choice.id}]</span>
                    <span className={`text-xs ${isSelected ? 'text-blue-700 font-medium' : 'text-slate-700'}`}>
                      {choice.text}
                    </span>
                  </div>
                  <span
                    className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded ${
                      d > 0
                        ? 'bg-emerald-100 text-emerald-700'
                        : d < 0
                        ? 'bg-red-100 text-red-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {d > 0 ? '+' : ''}{d}点
                  </span>
                </div>

                {/* エフェクトバッジ */}
                <EffectBadges choice={choice} />

                {/* 選択後: 解説テキスト */}
                {isSelected && (
                  <div className="mt-2 pt-2 border-t border-blue-200 text-xs text-blue-700 leading-relaxed">
                    📘 {choice.effect.explanation}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 選択肢なしのイベント（INTRO等）で選択済みの表示 */}
      {event.choices.length === 0 && event.slot !== 'INTRO' && event.slot !== 'REVIEW' && (
        <p className="text-xs text-slate-400 italic">選択肢なし</p>
      )}
    </div>
  );
}

// ── エフェクトバッジ ──────────────────────────────────────────────────────

function EffectBadges({ choice }: { choice: ScenarioChoice }) {
  const { flagUpdates, npcTrustDeltas, metricDeltas } = choice.effect;
  const hasBadges = flagUpdates || npcTrustDeltas || metricDeltas;
  if (!hasBadges) return null;

  return (
    <div className="flex gap-1 flex-wrap">
      {flagUpdates &&
        (Object.entries(flagUpdates) as [string, boolean][]).map(([k, v]) => (
          <span
            key={k}
            className={`text-xs px-1.5 py-0.5 rounded font-mono ${
              v ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
            }`}
          >
            {k}={String(v)}
          </span>
        ))}
      {npcTrustDeltas &&
        (Object.entries(npcTrustDeltas) as [string, number][]).map(([k, v]) => (
          <span
            key={k}
            className={`text-xs px-1.5 py-0.5 rounded font-mono ${
              v > 0 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-500'
            }`}
          >
            {k} {v > 0 ? '+' : ''}{v}
          </span>
        ))}
      {metricDeltas &&
        (Object.entries(metricDeltas) as [string, number][]).slice(0, 4).map(([k, v]) => (
          <span
            key={k}
            className={`text-xs px-1.5 py-0.5 rounded font-mono ${
              v > 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'
            }`}
          >
            {k} {v > 0 ? '+' : ''}{v}
          </span>
        ))}
    </div>
  );
}
