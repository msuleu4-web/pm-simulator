import type {
  ScenarioState,
  ScenarioEvent,
  ScenarioChoice,
  NpcTrustKey,
  ScenarioMetricKey,
  ChapterId,
} from './types';
import { SCENARIO_EVENTS } from './scenarioEvents';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function applyScenarioChoice(
  state: ScenarioState,
  event: ScenarioEvent,
  choice: ScenarioChoice
): ScenarioState {
  const { effect } = choice;
  const next = structuredClone(state) as ScenarioState;

  // スコア加算
  next.totalScore += effect.scoreDelta;

  // メトリクス反映 (0〜100 clamp)
  if (effect.metricDeltas) {
    for (const [key, delta] of Object.entries(effect.metricDeltas) as [
      ScenarioMetricKey,
      number,
    ][]) {
      next.metrics[key] = clamp(next.metrics[key] + delta, 0, 100);
    }
  }

  // フラグ反映
  if (effect.flagUpdates) {
    Object.assign(next.flags, effect.flagUpdates);
  }

  // NPC信頼度反映 (0〜3 clamp)
  if (effect.npcTrustDeltas) {
    for (const [key, delta] of Object.entries(effect.npcTrustDeltas) as [
      NpcTrustKey,
      number,
    ][]) {
      next.npcTrust[key] = clamp(
        next.npcTrust[key] + delta,
        0,
        3
      ) as 0 | 1 | 2 | 3;
    }
  }

  // 選択記録
  next.selectedChoices[event.id] = choice.id;

  // クリア済みに追加
  if (!next.clearedEventIds.includes(event.id)) {
    next.clearedEventIds.push(event.id);
  }

  return next;
}

// ── イベント条件評価 ──────────────────────────────────────────────────────

function meetsCondition(
  event: ScenarioEvent,
  state: ScenarioState
): boolean {
  const cond = event.condition;
  if (!cond) return true;

  if (cond.requiredFlags) {
    for (const [k, v] of Object.entries(cond.requiredFlags)) {
      if (state.flags[k as keyof typeof state.flags] !== v) return false;
    }
  }

  if (cond.blockedFlags) {
    for (const k of cond.blockedFlags) {
      if (state.flags[k]) return false;
    }
  }

  if (cond.requiredNpcTrust) {
    for (const [k, minVal] of Object.entries(cond.requiredNpcTrust) as [
      NpcTrustKey,
      number,
    ][]) {
      if (state.npcTrust[k] < minVal) return false;
    }
  }

  return true;
}

export function getScenarioEventsForChapter(
  chapterId: ChapterId,
  state: ScenarioState
): ScenarioEvent[] {
  const chapterEvents = SCENARIO_EVENTS.filter(
    (e) => e.chapterId === chapterId
  );

  const result: ScenarioEvent[] = [];
  const fallbackIds = new Set<string>();

  for (const event of chapterEvents) {
    // fallback として登録されているイベントは後回し
    if (SCENARIO_EVENTS.some((e) => e.condition?.fallbackEventId === event.id)) {
      fallbackIds.add(event.id);
    }
  }

  for (const event of chapterEvents) {
    if (fallbackIds.has(event.id)) continue;

    if (meetsCondition(event, state)) {
      result.push(event);
    } else if (event.condition?.fallbackEventId) {
      const fallback = SCENARIO_EVENTS.find(
        (e) => e.id === event.condition!.fallbackEventId
      );
      if (fallback) result.push(fallback);
    }
    // 条件を満たさず fallback もない場合はスキップ
  }

  return result;
}
