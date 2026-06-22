// ── シナリオシステム型定義 ────────────────────────────────────────────────
// 既存の chapters.ts / Phaser Scene には依存しない独立モジュール

export type ChapterId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type EventSlot =
  | 'INTRO'
  | 'MISSION_A'
  | 'MISSION_B'
  | 'MISSION_C'
  | 'SIDE'
  | 'RISK'
  | 'JUDGE'
  | 'REVIEW';

// ── フラグ ────────────────────────────────────────────────────────────────
export type ScenarioFlagKey =
  | 'minutesDocumented'
  | 'roleConfirmed'
  | 'ambiguityFlagged'
  | 'clientExpectationRisk'
  | 'requirementsPrioritized'
  | 'scopeChangeLogged'
  | 'legacySystemRisk'
  | 'nonFunctionalChecked'
  | 'securityReviewed'
  | 'technicalDebtNoted'
  | 'permanentFixChosen'
  | 'reviewCompleted'
  | 'edgeCaseTested'
  | 'evidenceRecorded'
  | 'testSkipped';

export type ScenarioFlags = Record<ScenarioFlagKey, boolean>;

// ── NPC信頼度 ─────────────────────────────────────────────────────────────
export type NpcTrustKey = 'tanaka' | 'satou' | 'suzuki' | 'ishida';
export type NpcTrust = Record<NpcTrustKey, 0 | 1 | 2 | 3>;

// ── 評価パラメータ ────────────────────────────────────────────────────────
export type ScenarioMetricKey =
  | 'trust'
  | 'quality'
  | 'schedule'
  | 'cost'
  | 'teamMorale'
  | 'clientSatisfaction'
  | 'compliance'
  | 'technicalDebt'
  | 'learning';

export type ScenarioMetrics = Record<ScenarioMetricKey, number>;

// ── 選択肢効果 ────────────────────────────────────────────────────────────
export interface ScenarioEffect {
  scoreDelta: number;
  metricDeltas?: Partial<ScenarioMetrics>;
  flagUpdates?: Partial<ScenarioFlags>;
  npcTrustDeltas?: Partial<Record<NpcTrustKey, number>>;
  nextEventHint?: string;
  explanation: string;
}

// ── 選択肢 ────────────────────────────────────────────────────────────────
export interface ScenarioChoice {
  id: string;
  text: string;
  effect: ScenarioEffect;
}

// ── 発火条件 ─────────────────────────────────────────────────────────────
export interface ScenarioCondition {
  requiredFlags?: Partial<ScenarioFlags>;
  blockedFlags?: ScenarioFlagKey[];
  requiredNpcTrust?: Partial<Record<NpcTrustKey, number>>;
  fallbackEventId?: string;
}

// ── イベント ─────────────────────────────────────────────────────────────
export interface ScenarioEvent {
  id: string;
  chapterId: ChapterId;
  slot: EventSlot;
  title: string;
  body: string;
  choices: ScenarioChoice[];
  condition?: ScenarioCondition;
  reviewNote?: string;
}

// ── ゲーム状態 ────────────────────────────────────────────────────────────
export interface ScenarioState {
  flags: ScenarioFlags;
  npcTrust: NpcTrust;
  metrics: ScenarioMetrics;
  totalScore: number;
  clearedEventIds: string[];
  selectedChoices: Record<string, string>;
}

// ── エンディング ─────────────────────────────────────────────────────────
export type ScenarioEndingId =
  | 'balanced_se'
  | 'pm_candidate'
  | 'quality_guardian'
  | 'firefighter'
  | 'technical_specialist'
  | 'hidden_trusted_bridge';

export interface ScenarioEnding {
  id: ScenarioEndingId;
  title: string;
  comment: string;
  color: string;
}
