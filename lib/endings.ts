import type { GameState } from './types';

export type EndingId =
  | 'legendary_pm'
  | 'team_hero'
  | 'schedule_master'
  | 'quality_craftsman'
  | 'comeback'
  | 'project_fire'
  | 'team_collapse'
  | 'budget_overrun'
  | 'schedule_disaster'
  | 'stakeholder_betrayal';

export type Ending = {
  id: EndingId;
  type: 'positive' | 'negative';
  title: string;
  subtitle: string;
  description: string;
  flavor: string;
  mainEmoji: string;
  particles: string[];
};

export const endings: Record<EndingId, Ending> = {
  legendary_pm: {
    id: 'legendary_pm',
    type: 'positive',
    title: '伝説のプロジェクトマネージャー',
    subtitle: 'LEGENDARY ENDING',
    description:
      'すべての指標を高水準で維持し、チームも顧客も完全に満足した完璧なプロジェクトを成し遂げた。あなたの名前は社内の語り草となり、後輩PMたちの目標になるだろう。',
    flavor: '「このプロジェクトを担当できて光栄です」——チーム一同',
    mainEmoji: '🏆',
    particles: ['⭐', '✨', '🌟', '💫', '⭐', '✨', '🌟', '💫'],
  },
  team_hero: {
    id: 'team_hero',
    type: 'positive',
    title: 'チームが最高の仕事をした',
    subtitle: 'TEAM HERO ENDING',
    description:
      'チームのモチベーションを高く保ちながら、顧客の期待にも応えた。技術力だけでなく、人を大切にするマネジメントが評価され、メンバー全員から尊敬を集めた。',
    flavor: '「また一緒に仕事がしたい」——プロジェクトメンバー一同',
    mainEmoji: '🤝',
    particles: ['💚', '🌿', '✨', '💪', '🌟', '💚', '🌿', '✨'],
  },
  schedule_master: {
    id: 'schedule_master',
    type: 'positive',
    title: '完璧な納期管理',
    subtitle: 'ON TIME ENDING',
    description:
      '予算を守り、約束した納期を一度も破らずプロジェクトを完遂した。「予定通りに終わる」という最大の信頼を顧客に証明した実力派PMとして名を刻んだ。',
    flavor: '「御社のPMさんは本当に信頼できる」——クライアント',
    mainEmoji: '📅',
    particles: ['✅', '🕐', '📊', '✅', '🔵', '✅', '📊', '🕐'],
  },
  quality_craftsman: {
    id: 'quality_craftsman',
    type: 'positive',
    title: '品質の匠',
    subtitle: 'QUALITY MASTER ENDING',
    description:
      'サイロ化を一切許さず、チームの情報共有を徹底しながら最高品質の成果物を届けた。手抜きを排除した姿勢が、納品後のトラブルゼロという結果に結びついた。',
    flavor: '「品質管理がここまで徹底されたプロジェクトは初めてです」——品質保証部門',
    mainEmoji: '💎',
    particles: ['🔷', '✨', '💠', '🔷', '💜', '✨', '💠', '🔷'],
  },
  comeback: {
    id: 'comeback',
    type: 'positive',
    title: '逆境からの生還',
    subtitle: 'COMEBACK ENDING',
    description:
      '多くの困難が立ちはだかったが、諦めずに判断を重ね、プロジェクトを完走させた。完璧ではないが、それでも完成させた——その粘りこそが本物のPMの証だ。',
    flavor: '「最後まで諦めなかった。それが全てだ」',
    mainEmoji: '💪',
    particles: ['🌅', '🔥', '⚡', '🌄', '💫', '🌅', '⚡', '🌄'],
  },
  project_fire: {
    id: 'project_fire',
    type: 'negative',
    title: 'プロジェクト炎上',
    subtitle: 'BURNOUT ENDING',
    description:
      '複数のKPIが危険水域に突入し、プロジェクトは制御不能に陥った。経営陣からの叱責、顧客からのクレーム、チームの疲弊——すべてが重なって最悪の結末を迎えた。',
    flavor: '「なぜもっと早く報告しなかったのか」——上司',
    mainEmoji: '🔥',
    particles: ['💸', '😱', '⚠️', '🔥', '💔', '😱', '⚠️', '🔥'],
  },
  team_collapse: {
    id: 'team_collapse',
    type: 'negative',
    title: 'チームは崩壊した',
    subtitle: 'TEAM COLLAPSE ENDING',
    description:
      'サイロ化が進み、チームの分断は修復不可能になった。孤立したメンバーたちはモチベーションを失い、次々と戦線を離脱。プロジェクトは人材不足のまま迷走を続けた。',
    flavor: '「話し合いができるチームを作ることが先決でした」——PMOレビュー',
    mainEmoji: '💔',
    particles: ['👤', '❌', '😔', '💔', '👤', '❌', '😔', '💔'],
  },
  budget_overrun: {
    id: 'budget_overrun',
    type: 'negative',
    title: '予算超過による失敗',
    subtitle: 'BUDGET OVERRUN ENDING',
    description:
      'コストは当初見積もりを大幅に超過し、経営会議では緊急停止の声も上がった。お金を使い続けながら成果が出ない状況が、信頼の完全な崩壊を招いた。',
    flavor: '「このプロジェクト、本当に続ける価値がありますか？」——CFO',
    mainEmoji: '💸',
    particles: ['📉', '💰', '❌', '📉', '💸', '❌', '📉', '💰'],
  },
  schedule_disaster: {
    id: 'schedule_disaster',
    type: 'negative',
    title: '大幅な納期遅延',
    subtitle: 'SCHEDULE DISASTER ENDING',
    description:
      '約束した納期を大幅に過ぎても完成の見通しが立たない。顧客は業務調整のやり直しを余儀なくされ、損害賠償の話まで持ち上がってしまった。',
    flavor: '「納期はいつになりますか？3回目の質問です」——クライアント',
    mainEmoji: '⏰',
    particles: ['❌', '📅', '⚠️', '❌', '😤', '⚠️', '❌', '📅'],
  },
  stakeholder_betrayal: {
    id: 'stakeholder_betrayal',
    type: 'negative',
    title: '顧客の信頼を失った',
    subtitle: 'TRUST LOST ENDING',
    description:
      '顧客との関係は修復できないほど悪化した。報告の遅延、期待値のズレ、コミュニケーション不足が積み重なり、最終的には契約解除の通告が届いた。',
    flavor: '「残念ながら、今後の取引は見合わせることになりました」——顧客担当役員',
    mainEmoji: '🤝',
    particles: ['💔', '❌', '📵', '💔', '😞', '❌', '📵', '💔'],
  },
};

export function computeAverageScore(state: GameState): number {
  const scheduleNorm = Math.max(0, state.schedule + 50);
  return Math.round(
    (state.quality + state.cost + scheduleNorm + state.stakeholder + state.morale) / 5
  );
}

export function determineEnding(state: GameState): Ending {
  const averageScore = computeAverageScore(state);
  const siloCount = state.members.filter((m) => m.isSiloed).length;
  const scheduleNorm = Math.max(0, state.schedule + 50);

  // Negative endings — specific crisis conditions checked first
  if (state.cost < 30) return endings.budget_overrun;
  if (state.schedule < -35) return endings.schedule_disaster;
  if (state.stakeholder < 30) return endings.stakeholder_betrayal;
  if (siloCount >= 3 && averageScore < 55) return endings.team_collapse;
  if (averageScore < 50) return endings.project_fire;

  // Positive endings — best to good
  if (averageScore >= 88) return endings.legendary_pm;
  if (state.morale >= 78 && state.stakeholder >= 78 && averageScore >= 75) return endings.team_hero;
  if (scheduleNorm >= 72 && state.cost >= 70 && averageScore >= 64) return endings.schedule_master;
  if (state.quality >= 78 && siloCount === 0 && averageScore >= 64) return endings.quality_craftsman;
  if (averageScore >= 64) return endings.comeback;

  return endings.project_fire;
}
