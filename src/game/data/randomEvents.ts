import type { ScoreEffects } from '../state/gameState';

export interface RandomEventChoice {
  id: string;
  text: string;
  effects: ScoreEffects;
  result: string;
}

export interface RandomEvent {
  id: string;
  title: string;
  situation: string;
  emoji: string;
  choices: RandomEventChoice[];
  /** Which chapters this can appear in */
  chapters: number[];
}

export const randomEvents: RandomEvent[] = [
  {
    id: 're-spec-change',
    title: '急な仕様変更要求',
    emoji: '📋',
    situation:
      '顧客から突然メールが届いた。\n「先ほどの打ち合わせで合意した帳票の出力形式ですが、上長から変更指示が出ました。今週中に対応できますか？」\n\n今週中は無理な量だが、顧客は重要クライアントだ。',
    chapters: [3, 4, 5, 6],
    choices: [
      {
        id: 'A',
        text: 'A：影響範囲を調査し、工数・納期への影響を正直に伝えてから合意を取る',
        effects: { trust: 8, quality: 5 },
        result: '顧客が「正直に教えてくれてありがとう。では来週でいい」と理解してくれた。\n\n信頼度と品質が上がった。',
      },
      {
        id: 'B',
        text: 'B：「わかりました」とその場で受けて、夜中に突貫作業する',
        effects: { quality: -15, delivery: -10, trust: -5 },
        result: '突貫作業でバグが多発し、品質が落ちた。体も限界に近い…\n\n品質・納期・信頼度が下がった。',
      },
      {
        id: 'C',
        text: 'C：田中PMに相談し、顧客への返答を一緒に考えてもらう',
        effects: { trust: 10, delivery: 3 },
        result: '田中PMが顧客に丁寧に説明してくれた。相談する判断が正解だった。\n\n信頼度と納期が上がった。',
      },
    ],
  },
  {
    id: 're-member-sick',
    title: 'メンバーが突然の体調不良',
    emoji: '🤒',
    situation:
      '開発の核心メンバー・山田さんが高熱で今週いっぱい休むことになった。\n\n山田さんが担当していた機能がまだ完成していない。代わりに誰かがカバーしなければならない状況だ。',
    chapters: [4, 5, 6],
    choices: [
      {
        id: 'A',
        text: 'A：田中PMに報告し、タスクの再割り当てと納期への影響を相談する',
        effects: { trust: 8, delivery: 3 },
        result: '田中PMがチームで分担するよう調整してくれた。正直に報告することが大切だ。\n\n信頼度と納期が上がった。',
      },
      {
        id: 'B',
        text: 'B：黙って自分が全部カバーしようとする（報告は後でいいと思って）',
        effects: { quality: -12, delivery: -14, trust: -8 },
        result: '一人でカバーしきれず品質が落ちた。しかも報告が遅れたことで田中PMが激怒…\n\n品質・納期・信頼度が下がった。',
      },
      {
        id: 'C',
        text: 'C：協力会社の鈴木さんに応援を依頼できないか検討する',
        effects: { cost: -8, delivery: 5 },
        result: '鈴木さんが協力してくれた。追加コストはかかったが、納期リスクを回避できた。\n\nコストが下がったが納期は改善した。',
      },
    ],
  },
  {
    id: 're-boss-inspection',
    title: '上司の急な進捗視察',
    emoji: '👔',
    situation:
      '本社の部長が急に「現場の状況を見たい」と視察に来ることになった。\n\n現在のプロジェクトは少し遅れ気味だが、深刻な問題はまだない状態だ。どう対応するか？',
    chapters: [3, 4, 5],
    choices: [
      {
        id: 'A',
        text: 'A：現状の進捗（遅れも含めて）と対策を正直に報告する',
        effects: { trust: 12 },
        result: '部長が「正直に報告できる文化は大事だ」と評価してくれた。\n\n信頼度が大きく上がった。',
      },
      {
        id: 'B',
        text: 'B：遅れを隠し、良い部分だけをピックアップして報告する',
        effects: { trust: -18, quality: -5 },
        result: '後で遅延が発覚し、「あのとき嘘をついた」と信頼が大きく損なわれた…\n\n信頼度が激しく下がった。',
      },
      {
        id: 'C',
        text: 'C：田中PMに同席してもらい、一緒に説明する',
        effects: { trust: 8, quality: 3 },
        result: '田中PMのフォローで説明が上手くまとまった。チームワークが評価された。\n\n信頼度と品質が上がった。',
      },
    ],
  },
  {
    id: 're-server-down',
    title: '開発環境のサーバーダウン',
    emoji: '🖥️',
    situation:
      '朝から開発環境のサーバーが落ちている。インフラチームに聞いたところ「今日中には復旧できないかもしれない」とのこと。\n\nチームの作業が全面停止している状態だ。',
    chapters: [4, 5],
    choices: [
      {
        id: 'A',
        text: 'A：停止期間中に設計書・ドキュメントの見直しや改善を行う',
        effects: { quality: 8, trust: 5 },
        result: '空き時間を有効活用。設計書の品質が上がり、田中PMから「いい対応だ」と言われた。\n\n品質と信頼度が上がった。',
      },
      {
        id: 'B',
        text: 'B：何もできないので帰宅する（作業できないなら仕方ない）',
        effects: { delivery: -10, trust: -8 },
        result: '無断で帰宅したことが問題になった。やれることはあったのに…\n\n納期と信頼度が下がった。',
      },
      {
        id: 'C',
        text: 'C：顧客への影響範囲を調査し、必要なら事前に報告する',
        effects: { trust: 10, delivery: 3 },
        result: '顧客に先手を打って状況を伝えたことで信頼が上がった。プロアクティブな対応だ。\n\n信頼度と納期が上がった。',
      },
    ],
  },
  {
    id: 're-spec-error',
    title: '要件書の重大な誤り発覚',
    emoji: '😱',
    situation:
      '詳細設計中に気づいた。要件定義書に重大な矛盾があり、このまま進めると後で大規模な手戻りが発生する。\n\nしかし要件定義はもう顧客の承認を得ている。今さら言い出しにくい状況だ。',
    chapters: [3, 4],
    choices: [
      {
        id: 'A',
        text: 'A：今すぐ田中PMと顧客に報告し、修正の合意を取る',
        effects: { trust: 10, quality: 15, delivery: -5 },
        result: '顧客が「気づいてくれてよかった！今修正して本当によかった」と感謝してくれた。\n\n信頼度と品質が上がり、納期への影響は少し出た。',
      },
      {
        id: 'B',
        text: 'B：誰にも言わず、自分なりに解釈して設計を進める',
        effects: { quality: -22, delivery: -12 },
        result: '後で大規模な手戻りが発生した。早く報告していれば…\n\n品質と納期が激しく下がった。',
      },
      {
        id: 'C',
        text: 'C：チームメンバーだけで対処案を検討し、解決策が出てから報告する',
        effects: { quality: 5, trust: -5, delivery: -8 },
        result: '解決策は見つかったが、報告が遅れたことを田中PMに注意された。\n\n品質は少し上がったが信頼度と納期が下がった。',
      },
    ],
  },
  {
    id: 're-member-resign',
    title: '優秀なメンバーが転職を申告',
    emoji: '🚶',
    situation:
      'チームの中心メンバー・田村さん（SE3年目）が「来月末で退職します」と申告してきた。\n\n田村さんは複数の重要機能を担当しており、いなくなると大きな穴があく。',
    chapters: [5, 6],
    choices: [
      {
        id: 'A',
        text: 'A：すぐに田中PMに報告し、引き継ぎ計画とリソース補充を相談する',
        effects: { trust: 10, delivery: 3 },
        result: '早期の報告で対策を打てた。田村さんの引き継ぎも丁寧に進められた。\n\n信頼度と納期が上がった。',
      },
      {
        id: 'B',
        text: 'B：田村さんに気を遣い、しばらく自分だけで抱える',
        effects: { delivery: -15, trust: -10 },
        result: '報告が遅れ、引き継ぎ期間が足りなくなった。早めに相談すべきだった…\n\n納期と信頼度が下がった。',
      },
      {
        id: 'C',
        text: 'C：田村さんから詳しく引き継ぎ事項を文書化してもらうよう依頼する',
        effects: { quality: 8, delivery: 5 },
        result: '丁寧な引き継ぎドキュメントが作られた。ナレッジが残ることでチームの損失が最小化された。\n\n品質と納期が上がった。',
      },
    ],
  },
  {
    id: 're-security',
    title: 'セキュリティ脆弱性の指摘',
    emoji: '🔒',
    situation:
      'テスト中にセキュリティ担当から報告が来た。\n「SQLインジェクション対策が不十分です。このままリリースすると個人情報が漏洩するリスクがあります」\n\nリリースまで2週間しかない。',
    chapters: [5, 6],
    choices: [
      {
        id: 'A',
        text: 'A：セキュリティを最優先とし、修正期間確保のために納期延長を顧客に提案する',
        effects: { quality: 14, trust: 8, delivery: -8 },
        result: '顧客が「セキュリティを優先してくれてよかった」と感謝。信頼が上がった。\n\n品質と信頼度が上がり、納期は少し延びた。',
      },
      {
        id: 'B',
        text: 'B：「リリース後に対応する」と判断し、そのままリリースする',
        effects: { quality: -25, trust: -20 },
        result: 'リリース後、情報漏洩事故が発生。大問題になった…\n\n品質と信頼度が激しく下がった。',
      },
      {
        id: 'C',
        text: 'C：影響範囲を絞り、最重要箇所だけ修正して予定通りリリースする',
        effects: { quality: 5, delivery: 3, trust: 3 },
        result: '最低限のセキュリティ対策で乗り切った。完璧ではないが現実的な判断だった。\n\nQCDが少しずつ改善した。',
      },
    ],
  },
  {
    id: 're-team-conflict',
    title: 'チーム内の対立',
    emoji: '⚡',
    situation:
      '開発チームの内部で対立が起きている。\nベテランの鈴木さん（協力会社）と若手の佐藤さんの設計方針が対立し、MTGが紛糾している。\n\nあなたはどちらかの中立的な立場にいる。',
    chapters: [4, 5],
    choices: [
      {
        id: 'A',
        text: 'A：両者の意見を整理し、技術的根拠をもとに合意形成を促す',
        effects: { trust: 12, quality: 8 },
        result: 'ファシリテーションが評価された。チームの雰囲気も改善した。\n\n信頼度と品質が上がった。',
      },
      {
        id: 'B',
        text: 'B：関わりたくないので、対立を無視してそれぞれに好きにやってもらう',
        effects: { quality: -14, delivery: -10, trust: -8 },
        result: '方針がバラバラになり、後で統合できず手戻りが発生した…\n\n品質・納期・信頼度が下がった。',
      },
      {
        id: 'C',
        text: 'C：田中PMに仲裁を依頼する',
        effects: { trust: 6, delivery: 3 },
        result: '田中PMが上手くまとめてくれた。エスカレーションの判断は正しかった。\n\n信頼度と納期が上がった。',
      },
    ],
  },
];

// Get a random event for the current chapter and difficulty
export function getRandomEventForChapter(
  chapterId: number,
  triggeredIds: Set<string>,
  difficulty: 'easy' | 'normal' | 'hard',
): RandomEvent | null {
  if (difficulty === 'easy') return null;

  // Probability: normal=25%, hard=50%
  const prob = difficulty === 'hard' ? 0.5 : 0.25;
  if (Math.random() > prob) return null;

  const candidates = randomEvents.filter(
    (e) => e.chapters.includes(chapterId) && !triggeredIds.has(e.id)
  );
  if (candidates.length === 0) return null;

  return candidates[Math.floor(Math.random() * candidates.length)];
}
