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
