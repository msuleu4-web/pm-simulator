import type {
  ScenarioState,
  ScenarioFlags,
  NpcTrust,
  ScenarioMetrics,
  ScenarioEnding,
  ScenarioEndingId,
} from './types';

const INITIAL_FLAGS: ScenarioFlags = {
  minutesDocumented: false,
  roleConfirmed: false,
  ambiguityFlagged: false,
  clientExpectationRisk: false,
  requirementsPrioritized: false,
  scopeChangeLogged: false,
  legacySystemRisk: false,
  nonFunctionalChecked: false,
  securityReviewed: false,
  technicalDebtNoted: false,
  permanentFixChosen: false,
  reviewCompleted: false,
  edgeCaseTested: false,
  evidenceRecorded: false,
  testSkipped: false,
};

const INITIAL_NPC_TRUST: NpcTrust = {
  tanaka: 0,
  satou: 0,
  suzuki: 0,
  ishida: 0,
};

const INITIAL_METRICS: ScenarioMetrics = {
  trust: 50,
  quality: 50,
  schedule: 50,
  cost: 50,
  teamMorale: 50,
  clientSatisfaction: 50,
  compliance: 50,
  technicalDebt: 0,
  learning: 0,
};

export function createInitialScenarioState(): ScenarioState {
  return {
    flags: { ...INITIAL_FLAGS },
    npcTrust: { ...INITIAL_NPC_TRUST },
    metrics: { ...INITIAL_METRICS },
    totalScore: 0,
    clearedEventIds: [],
    selectedChoices: {},
  };
}

// ── エンディング定義 ──────────────────────────────────────────────────────

const ENDINGS: Record<ScenarioEndingId, ScenarioEnding> = {
  hidden_trusted_bridge: {
    id: 'hidden_trusted_bridge',
    title: '信頼の架け橋',
    color: '#ff8c00',
    comment:
      '全NPCに信頼され、スコアも高水準。あなたは技術とコミュニケーション両方を備えた稀有な存在。\n現場の誰もが「またあなたと働きたい」と思っている。',
  },
  balanced_se: {
    id: 'balanced_se',
    title: 'バランス型SE',
    color: '#6366f1',
    comment:
      '技術もコミュニケーションも平均以上。どんな現場でも一定の成果を出せる。\n「頼りになるSE」として、次のプロジェクトでも指名されるだろう。',
  },
  technical_specialist: {
    id: 'technical_specialist',
    title: '技術スペシャリスト',
    color: '#0ea5e9',
    comment:
      '設計・レビュー・テストへの真剣な取り組みが光った。コードで語るタイプ。\n佐藤先輩「あなたに設計を任せると安心できる」',
  },
  pm_candidate: {
    id: 'pm_candidate',
    title: 'PM候補生',
    color: '#10b981',
    comment:
      'チームを動かすことが自然にできている。報連相・スコープ管理・合意形成すべてが高水準。\n田中PM「君はPMとしてやっていける」',
  },
  quality_guardian: {
    id: 'quality_guardian',
    title: '品質番人',
    color: '#8b5cf6',
    comment:
      '品質に妥協しない姿勢が現場の安心感を生み出した。\n「テストが終わっているなら大丈夫」と信頼される存在。',
  },
  firefighter: {
    id: 'firefighter',
    title: '炎上サバイバー',
    color: '#ef4444',
    comment:
      '炎上を経験し、それを正直な対応で乗り越えた。傷だらけだが、土壇場の強さを手に入れた。\n鈴木さん「生きてるだけで偉い。でも次は記録を残してな」',
  },
};

export function calculateScenarioEnding(state: ScenarioState): ScenarioEnding {
  const { flags, npcTrust, metrics, totalScore } = state;

  const goodFlagCount = (Object.keys(flags) as (keyof typeof flags)[]).filter(
    (k) => {
      // 「良い」フラグのみカウント（リスクフラグは除外）
      const riskFlags: (keyof typeof flags)[] = [
        'clientExpectationRisk',
        'legacySystemRisk',
        'testSkipped',
      ];
      return !riskFlags.includes(k) && flags[k] === true;
    }
  ).length;

  const allNpcTrustHigh = (Object.values(npcTrust) as number[]).every(
    (t) => t >= 2
  );

  // 隠しエンディング: 全NPC信頼>=2 & スコア175以上 & 良フラグ12以上
  if (totalScore >= 175 && goodFlagCount >= 12 && allNpcTrustHigh) {
    return ENDINGS['hidden_trusted_bridge'];
  }

  // 炎上サバイバー: testSkipped=true だが障害を正直に報告した
  if (flags.testSkipped && metrics.trust >= 50) {
    return ENDINGS['firefighter'];
  }

  // PM候補: tanaka高信頼 & スコープ管理系フラグ
  if (
    npcTrust.tanaka >= 2 &&
    flags.requirementsPrioritized &&
    flags.scopeChangeLogged
  ) {
    return ENDINGS['pm_candidate'];
  }

  // 品質番人: テスト・セキュリティ系フラグ完全
  if (
    flags.edgeCaseTested &&
    flags.evidenceRecorded &&
    flags.securityReviewed
  ) {
    return ENDINGS['quality_guardian'];
  }

  // 技術スペシャリスト: レビュー完了 & テスト & satou信頼
  if (
    flags.reviewCompleted &&
    flags.edgeCaseTested &&
    npcTrust.satou >= 2
  ) {
    return ENDINGS['technical_specialist'];
  }

  // バランス型: スコア140以上 & 良フラグ6以上
  if (totalScore >= 140 && goodFlagCount >= 6) {
    return ENDINGS['balanced_se'];
  }

  // デフォルト
  return ENDINGS['firefighter'];
}
