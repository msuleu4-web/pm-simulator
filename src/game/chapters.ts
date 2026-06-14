import type { Difficulty } from './difficulty';

export interface Chapter {
  id: string;
  title: string;
  description: string;
  sceneName: string;
  easySceneName: string;
  easyTitle: string;
  easyDescription: string;
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
    easySceneName: 'EasyChapter1Scene',
    easyTitle: '第1章　要件ヒアリング',
    easyDescription: '社内ポータル刷新プロジェクト、始動。各部署にヒアリングして、欲しい機能を聞いてみよう。',
  },
  {
    id: 'chapter2',
    title: '第2章　要件定義',
    description: '配属初日。議事録の書き方と進捗報告のいろはを、現場で叩き込まれる。',
    sceneName: 'Chapter2Scene',
    easySceneName: 'EasyChapter2Scene',
    easyTitle: '第2章　画面設計・UI設計',
    easyDescription: 'ヒアリング結果をもとに画面を設計。使いやすさを第一に、ワイヤーフレームとユーザーレビューを進めよう。',
  },
  {
    id: 'chapter3',
    title: '第3章　基本設計',
    description: 'お客様の要望と現実のギャップ。レビュー指摘との戦いが始まる。',
    sceneName: 'Chapter3Scene',
    easySceneName: 'EasyChapter3Scene',
    easyTitle: '第3章　開発・実装',
    easyDescription: 'Next.jsで掲示板機能を実装。コードレビューを受けながら、品質の高いコードを目指そう。',
  },
  {
    id: 'chapter4',
    title: '第4章　製造',
    description: '担当モジュールのコーディング開始。「90%」の罠と、正直な進捗報告の大切さを学ぶ。',
    sceneName: 'Chapter4Scene',
    easySceneName: 'EasyChapter4Scene',
    easyTitle: '第4章　テスト・品質確認',
    easyDescription: '社内向けでも品質は大事。テスト計画を立てて、見つかったバグを丁寧に修正しよう。',
  },
  {
    id: 'chapter5',
    title: '第5章　テスト',
    description: 'テスト仕様書を作り、上がってきたバグ票と向き合う。品質を支える地道な工程。',
    sceneName: 'Chapter5Scene',
    easySceneName: 'EasyChapter5Scene',
    easyTitle: '第5章　リリース・展開',
    easyDescription: 'いよいよリリース。マニュアルを整え、社内お披露目会で新ポータルを発表しよう。',
  },
  {
    id: 'chapter6',
    title: '第6章　炎上と立て直し',
    description: 'リリース直前の仕様変更要求。スコープクリープとQCDのトレードオフに向き合い、現実的な落としどころを探る。',
    sceneName: 'Chapter6Scene',
    easySceneName: 'EasyChapter6Scene',
    easyTitle: '第6章　運用フィードバック',
    easyDescription: 'リリース後の声を集めて分析。利用率を上げるための施策を考えよう。',
  },
  {
    id: 'chapter7',
    title: '第7章　リリース・運用保守',
    description: '本番リリースと、その先に待つ障害対応。終わりなき運用保守の世界へ。',
    sceneName: 'Chapter7Scene',
    easySceneName: 'EasyChapter7Scene',
    easyTitle: '第7章　振り返り・次期企画',
    easyDescription: '3ヶ月の歩みをKPTで振り返り、次のプロジェクトの企画を考えよう。',
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

// イージーモードはノーマルモードと進行状況・スコアを分けて管理するため、
// 章クリアID/スコアIDに 'easy-' プレフィックスを付ける。
export function getModeChapterId(chapterId: string, difficulty: Difficulty): string {
  return difficulty === 'easy' ? `easy-${chapterId}` : chapterId;
}

export function isChapterUnlocked(index: number, cleared: string[], difficulty: Difficulty = 'normal'): boolean {
  if (index === 0) return true;
  return cleared.includes(getModeChapterId(CHAPTERS[index - 1].id, difficulty));
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
// 選択肢セットを持ち、各セットの基本スコアは {+10, -5, +5}。
// 一部の章(1,3,4,6)のミッションには「あるある」失敗用の-10点オプションを追加、
// ハードモードの炎上イベントには専用の追加分岐(+5/-5、計5択)を追加しているが、
// いずれも既存の最大(+10)・「無難」ベースライン(+5)を超えないため、
// 章ごとの最大30点・7章合計の最大210点・ベースライン105点(=5×21)は変わらない。
//   ・章ごとの最小: -10点オプションのある章(1,3,4,6)は-20点、他(2,5,7)は-15点
//   ・7章合計の最小(難易度別。penaltyMultは easy=0.5 / normal=1 / hard=2):
//       EASY:   -54点
//       NORMAL: -125点
//       HARD:   -250点
//
// エースSE到達ライン: ベースライン(105)から+35、つまり「無難」を「最善」に
// 7回置き換える＝平均すると各章で1回は最善手を選ぶ必要がある、という
// 5章版と同じ難度になるよう105+5×7=140に設定（210点中140点=66.7%、5章版と同率）。
// 一人前SE到達ライン: 5章版(40点/150点=26.7%)と同じ比率で210点中56点に設定。
// ※最大値・ベースラインは難易度に関わらず共通のため、閾値(140/56)は難易度を問わず適用できる。
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
