import type { Difficulty } from './difficulty';

export interface Chapter {
  id: string;
  title: string;
  description: string;
  sceneName: string;
  easySceneName: string;
  easyTitle: string;
  easyDescription: string;
  hardSceneName: string;
  hardTitle: string;
  hardDescription: string;
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
    hardSceneName: 'HardChapter1Scene',
    hardTitle: '第1章　配属・キックオフ',
    hardDescription: 'スタートアップ「Spire」に即日アサイン。WBSも体制図も存在しない現場で、自分の役割とルールを自分で見つけ出す。',
  },
  {
    id: 'chapter2',
    title: '第2章　要件定義',
    description: '配属初日。議事録の書き方と進捗報告のいろはを、現場で叩き込まれる。',
    sceneName: 'Chapter2Scene',
    easySceneName: 'EasyChapter2Scene',
    easyTitle: '第2章　画面設計・UI設計',
    easyDescription: 'ヒアリング結果をもとに画面を設計。使いやすさを第一に、ワイヤーフレームとユーザーレビューを進めよう。',
    hardSceneName: 'HardChapter2Scene',
    hardTitle: '第2章　要件定義',
    hardDescription: '要件はSlackの断片だけ。議事録文化のない現場で、CTOの思いつき発言が「仕様」になる現実と向き合う。',
  },
  {
    id: 'chapter3',
    title: '第3章　基本設計',
    description: 'お客様の要望と現実のギャップ。レビュー指摘との戦いが始まる。',
    sceneName: 'Chapter3Scene',
    easySceneName: 'EasyChapter3Scene',
    easyTitle: '第3章　開発・実装',
    easyDescription: 'Next.jsで掲示板機能を実装。コードレビューを受けながら、品質の高いコードを目指そう。',
    hardSceneName: 'HardChapter3Scene',
    hardTitle: '第3章　基本設計',
    hardDescription: 'レビュー工程はゼロ、「動けばOK」の文化。誰も読まない設計書と、最低限のドキュメントの境界を探る。',
  },
  {
    id: 'chapter4',
    title: '第4章　製造',
    description: '担当モジュールのコーディング開始。「90%」の罠と、正直な進捗報告の大切さを学ぶ。',
    sceneName: 'Chapter4Scene',
    easySceneName: 'EasyChapter4Scene',
    easyTitle: '第4章　テスト・品質確認',
    easyDescription: '社内向けでも品質は大事。テスト計画を立てて、見つかったバグを丁寧に修正しよう。',
    hardSceneName: 'HardChapter4Scene',
    hardTitle: '第4章　製造',
    hardDescription: '企画から実装・デプロイまで一人で担う毎日。「プロトタイプ」と「製品」の境界が曖昧なまま開発は進む。',
  },
  {
    id: 'chapter5',
    title: '第5章　テスト',
    description: 'テスト仕様書を作り、上がってきたバグ票と向き合う。品質を支える地道な工程。',
    sceneName: 'Chapter5Scene',
    easySceneName: 'EasyChapter5Scene',
    easyTitle: '第5章　リリース・展開',
    easyDescription: 'いよいよリリース。マニュアルを整え、社内お披露目会で新ポータルを発表しよう。',
    hardSceneName: 'HardChapter5Scene',
    hardTitle: '第5章　テスト',
    hardDescription: '検証環境という概念が薄く、本番に近い場所で動作確認。テスト仕様書もバグ票もない「直しといて」の世界。',
  },
  {
    id: 'chapter6',
    title: '第6章　炎上と立て直し',
    description: 'リリース直前の仕様変更要求。スコープクリープとQCDのトレードオフに向き合い、現実的な落としどころを探る。',
    sceneName: 'Chapter6Scene',
    easySceneName: 'EasyChapter6Scene',
    easyTitle: '第6章　運用フィードバック',
    easyDescription: 'リリース後の声を集めて分析。利用率を上げるための施策を考えよう。',
    hardSceneName: 'HardChapter6Scene',
    hardTitle: '第6章　炎上と立て直し',
    hardDescription: 'CTOの思いつき仕様変更が連発し、スコープは膨張するばかり。記録を残していたかどうかが立て直しの鍵になる。',
  },
  {
    id: 'chapter7',
    title: '第7章　リリース・運用保守',
    description: '本番リリースと、その先に待つ障害対応。終わりなき運用保守の世界へ。',
    sceneName: 'Chapter7Scene',
    easySceneName: 'EasyChapter7Scene',
    easyTitle: '第7章　振り返り・次期企画',
    easyDescription: '3ヶ月の歩みをKPTで振り返り、次のプロジェクトの企画を考えよう。',
    hardSceneName: 'HardChapter7Scene',
    hardTitle: '第7章　リリース・運用保守',
    hardDescription: '引き継ぎ資料も保守体制もないまま本番リリース。「直して、また走る」を繰り返すスタートアップの現実。',
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

// イージー/ハードモードはノーマルモードと進行状況・スコアを分けて管理するため、
// 章クリアID/スコアIDに 'easy-' / 'hard-' プレフィックスを付ける。
export function getModeChapterId(chapterId: string, difficulty: Difficulty): string {
  if (difficulty === 'easy') return `easy-${chapterId}`;
  if (difficulty === 'hard') return `hard-${chapterId}`;
  return chapterId;
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

// 難易度ごとに独立したトラック(章ID)のスコアのみを合計する。
// プレフィックスなしの全キー合計だと、複数難易度をプレイした場合に値が膨張してしまうため。
export function getTotalScore(difficulty: Difficulty = 'normal'): number {
  const scores = getChapterScores();
  return CHAPTERS.reduce((sum, ch) => sum + (scores[getModeChapterId(ch.id, difficulty)] ?? 0), 0);
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

// ハードモード（スタートアップ「Spire」常駐）専用のエンディング文言。
// title/colorはENDINGSと共通（称号バッジの表示・色分けを統一するため）、
// commentのみ韮沢CTO/戸田さん/オダギリさんを参照したハード版に差し替える。
export const HARD_ENDINGS: Record<EndingTier, EndingInfo> = {
  ace: {
    title: 'エースSE',
    color: '#ffd700',
    comment:
      'あなたは「Spire」で頼られる存在になった。\n韮沢CTOからも『あの人に任せれば回る』と評判。\n…ただし、評価されるほど無茶振りが増えるのがスタートアップの掟。',
  },
  regular: {
    title: '一人前SE',
    color: '#c0c0c0',
    comment:
      'なんとか炎上を乗り越え、一人前になった。\n完璧じゃないけど、Spireはそういう現場。\n戸田さんの『やればできるって言ったでしょ』が身に染みる。',
  },
  survivor: {
    title: '炎上サバイバー',
    color: '#cd7f32',
    comment:
      'プロジェクトは…なんとかリリースされた。\n傷だらけだが、それも経験。\nオダギリさん『お疲れ様でした…また何かあったら、お願いします』',
  },
};

// ── スコアバランス計算メモ ───────────────────────────────────
// Normal(Chapter1-7Scene)・Easy(EasyChapter1-7Scene)・Hard(HardChapter1-7Scene)は
// それぞれ独立したストーリートラックだが、いずれも各チャプター(1〜7)が
// 「ミッション1 / ミッション2 / 炎上イベント」の計3つの選択肢セットを持ち、
// 各セットの基本スコアは {+10, -5, +5}（一部の章は「あるある」失敗用の
// 0点/-10点オプションを追加）という共通設計に従う。
// いずれも既存の最大(+10)・「無難」ベースライン(+5)を超えないため、
// 章ごとの最大30点・7章合計の最大210点・ベースライン105点(=5×21)は
// トラックを問わず変わらない。
//   ・Normal/Easyの7章合計の最小(penaltyMult: easy=0.5 / normal=1):
//       EASY:   -54点
//       NORMAL: -125点
//   ・Hardは独自の選択肢構成のため最小値はチャプター内容に依存するが、
//     最大210・ベースライン105は共通のため下記の閾値がそのまま適用できる。
//
// エースSE到達ライン: ベースライン(105)から+35、つまり「無難」を「最善」に
// 7回置き換える＝平均すると各章で1回は最善手を選ぶ必要がある、という
// 5章版と同じ難度になるよう105+5×7=140に設定（210点中140点=66.7%、5章版と同率）。
// 一人前SE到達ライン: 5章版(40点/150点=26.7%)と同じ比率で210点中56点に設定。
// ※最大値・ベースラインはトラックに関わらず共通のため、閾値(140/56)は
//   getTotalScore(difficulty)の結果に対してそのまま適用できる。
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
