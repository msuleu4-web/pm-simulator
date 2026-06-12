export type Difficulty = 'easy' | 'normal' | 'hard';

export interface DiffConfig {
  label: string;
  penaltyMult: number;   // 誤答時の点数倍率
  bonusMult: number;     // 正答時の点数倍率
  showHints: boolean;    // 選択肢に推奨ヒントを表示するか
  description: string;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, DiffConfig> = {
  easy: {
    label: '新人モード',
    penaltyMult: 0.5,
    bonusMult: 1,
    showHints: true,
    description: '誤った選択の減点が半分になり、おすすめの選択肢に💡ヒントが表示されます。',
  },
  normal: {
    label: '現場モード',
    penaltyMult: 1,
    bonusMult: 1,
    showHints: false,
    description: '標準バランス。現場のリアルな評価がそのまま点数に反映されます。',
  },
  hard: {
    label: '炎上モード',
    penaltyMult: 2,
    bonusMult: 1,
    showHints: false,
    description: '誤った選択の減点が2倍に。炎上イベントも増え、納期のプレッシャーが容赦なく襲いかかります。',
  },
};

// HUD上の難易度ラベルの色（EASY: 緑 / NORMAL: 青 / HARD: 赤）
export const DIFFICULTY_HUD_COLOR: Record<Difficulty, string> = {
  easy: '#6ee7a0',
  normal: '#7ab8f0',
  hard: '#ff8080',
};

const STORAGE_KEY = 'sier-office-difficulty-v2';

export function saveDifficulty(d: Difficulty): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, d);
  } catch {
    /* localStorage unavailable */
  }
}

export function getDifficulty(): Difficulty {
  if (typeof window === 'undefined') return 'normal';
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === 'easy' || raw === 'normal' || raw === 'hard') return raw;
  } catch {
    /* localStorage unavailable */
  }
  return 'normal';
}
