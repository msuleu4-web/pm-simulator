export interface Chapter {
  id: string;
  title: string;
  description: string;
  sceneName: string;
}

export interface ChapterDocument {
  id: string;
  col: number;
  row: number;
  label: string;
  dialog: string;
  imageKey: string;
  imageLabel?: string;
  required?: boolean;
  blockedHint?: string;
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'chapter1',
    title: '第1章　配属・キックオフ',
    description: '初出社、机の上に積まれた資料の山。WBSや体制図、多重下請けの仕組みを読み解き、現場のルールを学ぶ。',
    sceneName: 'Chapter1Scene',
  },
  {
    id: 'chapter2',
    title: '第2章　要件定義',
    description: '配属初日。議事録の書き方と進捗報告のいろはを、現場で叩き込まれる。',
    sceneName: 'Chapter2Scene',
  },
  {
    id: 'chapter3',
    title: '第3章　基本設計',
    description: 'お客様の要望と現実のギャップ。レビュー指摘との戦いが始まる。',
    sceneName: 'Chapter3Scene',
  },
  {
    id: 'chapter4',
    title: '第4章　製造',
    description: '担当モジュールのコーディング開始。「90%」の罠と、正直な進捗報告の大切さを学ぶ。',
    sceneName: 'Chapter4Scene',
  },
  {
    id: 'chapter5',
    title: '第5章　テスト',
    description: 'テスト仕様書を作り、上がってきたバグ票と向き合う。品質を支える地道な工程。',
    sceneName: 'Chapter5Scene',
  },
  {
    id: 'chapter6',
    title: '第6章　炎上と立て直し',
    description: 'リリース直前の仕様変更要求。スコープクリープとQCDのトレードオフに向き合い、現実的な落としどころを探る。',
    sceneName: 'Chapter6Scene',
  },
  {
    id: 'chapter7',
    title: '第7章　リリース・運用保守',
    description: '本番リリースと、その先に待つ障害対応。終わりなき運用保守の世界へ。',
    sceneName: 'Chapter7Scene',
  },
];

const STORAGE_KEY = 'sier-office-chapters-cleared-v2';

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

const SCORE_KEY = 'sier-office-chapter-scores-v2';

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

// ── スコアバランス計算メモ ───────────────────────────────────
// 各チャプター(1〜7)は「ミッション1 / ミッション2 / 炎上イベント」の計3つの
// 選択肢セットを持ち、各セットの選択肢スコアは共通で {+10, -5, +5}。
//   ・章ごとの最大: 10×3 = 30点 / 最小(NORMAL): -5×3 = -15点
//   ・7章合計の最大: 30×7 = 210点（bonusMultは全難易度1倍のため難易度に関わらず共通）
//   ・7章合計の最小(難易度別。penaltyMultは easy=0.5 / normal=1 / hard=2):
//       EASY:   round(-5*0.5)×3×7 = -2×21  = -42点
//       NORMAL:      -5      ×3×7 = -5×21  = -105点
//       HARD:   round(-5*2)  ×3×7 = -10×21 = -210点
//   ・全21セットで「無難（+5）」を選び続けた場合のベースライン = 5×21 = 105点
//
// エースSE到達ライン: ベースライン(105)から+35、つまり「無難」を「最善」に
// 7回置き換える＝平均すると各章で1回は最善手を選ぶ必要がある、という
// 5章版と同じ難度になるよう105+5×7=140に設定（210点中140点=66.7%、5章版と同率）。
// 一人前SE到達ライン: 5章版(40点/150点=26.7%)と同じ比率で210点中56点に設定。
export function getEndingTier(totalScore: number): EndingTier {
  if (totalScore >= 140) return 'ace';
  if (totalScore >= 56) return 'regular';
  return 'survivor';
}

const TITLES_KEY = 'sier-office-earned-titles-v2';

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
