export interface Chapter {
  id: string;
  title: string;
  description: string;
  sceneName: string;
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'chapter1',
    title: '第1章　要件定義',
    description: '配属初日。議事録の書き方と進捗報告のいろはを、現場で叩き込まれる。',
    sceneName: 'Chapter1Scene',
  },
  {
    id: 'chapter2',
    title: '第2章　基本設計',
    description: 'お客様の要望と現実のギャップ。レビュー指摘との戦いが始まる。',
    sceneName: 'Chapter2Scene',
  },
  {
    id: 'chapter3',
    title: '第3章　製造',
    description: '担当モジュールのコーディング開始。「90%」の罠と、正直な進捗報告の大切さを学ぶ。',
    sceneName: 'Chapter3Scene',
  },
  {
    id: 'chapter4',
    title: '第4章　テスト',
    description: 'テスト仕様書を作り、上がってきたバグ票と向き合う。品質を支える地道な工程。',
    sceneName: 'Chapter4Scene',
  },
  {
    id: 'chapter5',
    title: '第5章　リリース・運用保守',
    description: '本番リリースと、その先に待つ障害対応。終わりなき運用保守の世界へ。',
    sceneName: 'Chapter5Scene',
  },
];

const STORAGE_KEY = 'sier-office-chapters-cleared';

export function getClearedChapters(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function markChapterCleared(id: string): void {
  if (typeof window === 'undefined') return;
  const cleared = new Set(getClearedChapters());
  cleared.add(id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...cleared]));
}

export function isChapterUnlocked(index: number, cleared: string[]): boolean {
  if (index === 0) return true;
  return cleared.includes(CHAPTERS[index - 1].id);
}

const SCORE_KEY = 'sier-office-chapter-scores';

export function getChapterScores(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(SCORE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

export function saveChapterScore(id: string, score: number): void {
  if (typeof window === 'undefined') return;
  const scores = getChapterScores();
  scores[id] = score;
  window.localStorage.setItem(SCORE_KEY, JSON.stringify(scores));
}

export function getTotalScore(): number {
  return Object.values(getChapterScores()).reduce((sum, s) => sum + s, 0);
}

// ── エンディング（称号） ─────────────────────────────────────

export type EndingTier = 'ace' | 'regular' | 'survivor';

export interface EndingInfo {
  title: string;
  color: string;
  comment: string;
}

export const ENDINGS: Record<EndingTier, EndingInfo> = {
  ace: {
    title: 'エースSE',
    color: '#ffd700',
    comment:
      'あなたは現場で頼られる存在になった。\n元請けからも『この人なら任せられる』と評判。\n…ただし、評価されるほど仕事が増えるのがSIerの掟。',
  },
  regular: {
    title: '一人前SE',
    color: '#c0c0c0',
    comment:
      'なんとか炎上を乗り越え、一人前になった。\n完璧じゃないけど、現場はそういうもの。\n先輩の『最初はみんなそう』が身に染みる。',
  },
  survivor: {
    title: '炎上サバイバー',
    color: '#cd7f32',
    comment:
      'プロジェクトは…なんとかリリースされた。\n傷だらけだが、それも経験。\n鈴木さん『生きてるだけで偉いですよ』',
  },
};

export function getEndingTier(totalScore: number): EndingTier {
  if (totalScore >= 80) return 'ace';
  if (totalScore >= 40) return 'regular';
  return 'survivor';
}

const TITLES_KEY = 'sier-office-earned-titles';

export function getEarnedTitles(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(TITLES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveEarnedTitle(title: string): void {
  if (typeof window === 'undefined') return;
  const titles = new Set(getEarnedTitles());
  titles.add(title);
  try {
    window.localStorage.setItem(TITLES_KEY, JSON.stringify([...titles]));
  } catch {
    /* localStorage unavailable */
  }
}
