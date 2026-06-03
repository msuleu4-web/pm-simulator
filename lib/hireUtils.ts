import type { TeamMember } from './types';

export type FitLevel = 'excellent' | 'good' | 'poor';

export type FitResult = {
  score: number;
  level: FitLevel;
  reasons: string[];
  qualityDelta: number;
  moraleDelta: number;
};

const phaseRoleMap: Record<string, string[]> = {
  requirements:          ['アナリスト', 'SE', 'PL'],
  basicDesign:           ['SE', 'PL', 'デザイナー', 'アナリスト'],
  detailedDesign:        ['PG', 'SE', 'インフラ', 'DBA'],
  testing:               ['テスター', 'QA', 'SE'],
  release:               ['インフラ', 'PG', 'SE'],
  operations:            ['インフラ', 'DBA', 'QA'],
  expansion:             ['PG', 'SE', 'デザイナー'],
  'organizational-change': ['PL', 'PM', 'アナリスト'],
  'legacy-renewal':      ['SE', 'PG', 'インフラ', 'DBA'],
  'project-closure':     ['PL', 'PM', 'アナリスト'],
};

export const calculateFit = (
  candidate: TeamMember,
  team: TeamMember[],
  currentPhaseId: string
): FitResult => {
  const reasons: string[] = [];

  // 1. 役割の不足度 (0~40)
  const roleCounts = team.reduce<Record<string, number>>((acc, m) => {
    acc[m.role] = (acc[m.role] ?? 0) + 1;
    return acc;
  }, {});
  const existingCount = roleCounts[candidate.role] ?? 0;
  let roleScore = 0;
  if (existingCount === 0) {
    roleScore = 40;
    reasons.push(`${candidate.role}の担当者がおらず、補完効果が高い`);
  } else if (existingCount === 1) {
    roleScore = 20;
    reasons.push(`${candidate.role}は1名で、バックアップとして有効`);
  } else {
    roleScore = 0;
    reasons.push(`${candidate.role}は既に${existingCount}名在籍`);
  }

  // 2. フェーズ適合度 (0~30)
  const goodRoles = phaseRoleMap[currentPhaseId] ?? [];
  const phaseScore = goodRoles.includes(candidate.role) ? 30 : 0;
  if (phaseScore > 0) {
    reasons.push(`現フェーズで${candidate.role}は活躍しやすい`);
  } else {
    reasons.push(`現フェーズへの直接貢献は限定的`);
  }

  // 3. スキルレベル (0~30)
  const skillScore = candidate.skillLevel * 6;
  if (candidate.skillLevel >= 4) {
    reasons.push(`スキルレベル${candidate.skillLevel}のベテラン`);
  } else if (candidate.skillLevel <= 2) {
    reasons.push(`経験が浅くキャッチアップが必要`);
  }

  // 4. サイロリスクペナルティ
  const siloCount = team.filter(m => m.isSiloed).length;
  const siloPenalty = siloCount >= 3 ? -10 : 0;
  if (siloPenalty < 0) reasons.push('既存のサイロ化リスクを悪化させる可能性');

  const score = Math.max(0, Math.min(100, roleScore + phaseScore + skillScore + siloPenalty));

  const level: FitLevel = score >= 65 ? 'excellent' : score >= 40 ? 'good' : 'poor';
  const qualityDelta = level === 'excellent' ? 5 : level === 'good' ? 2 : -3;
  const moraleDelta = level === 'excellent' ? 4 : level === 'good' ? 1 : -4;

  return { score, level, reasons, qualityDelta, moraleDelta };
};

export const hiringCostKpi = (member: TeamMember): number =>
  Math.max(3, Math.round(member.costPerMonth / 18));

export const fitLabel: Record<FitLevel, { text: string; color: string; stars: string }> = {
  excellent: { text: '最適', color: 'bg-emerald-100 text-emerald-700', stars: '★★★' },
  good:      { text: '良好', color: 'bg-blue-100 text-blue-700',     stars: '★★☆' },
  poor:      { text: '不適合', color: 'bg-red-100 text-red-700',     stars: '★☆☆' },
};
