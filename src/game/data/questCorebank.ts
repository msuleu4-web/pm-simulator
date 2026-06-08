// quest_corebank — 「最終合意の夜」
// All characters and organizations are fictional. 架空の物語です。

export interface DialogueFlagEffect {
  warnedEarly?: boolean;
  gijirokuKept?: boolean;
  proposedStop?: boolean;
  trust?: number;
}

export interface DialogueChoice {
  label: string;
  setFlags: DialogueFlagEffect;
  next: string;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  next?: string;
  choices?: DialogueChoice[];
  isEndingGate?: boolean;
}

export interface QuestFlags {
  warnedEarly: boolean;
  gijirokuKept: boolean;
  proposedStop: boolean;
  trust: number;
}

export interface EndingDef {
  id: string;
  title: string;
  text: string;
  learn: string;
  type: 'best' | 'bad';
}

export const DIALOGUE: DialogueNode[] = [
  // ── 起 ──────────────────────────────────────────────────────────
  {
    id: 'disclaimer',
    speaker: 'システム',
    text: 'このストーリーはフィクションです。実在の企業・人物・事件とは一切関係ありません。',
    next: 'intro',
  },
  {
    id: 'intro',
    speaker: 'ナレーション',
    text: 'みなと地方銀行の勘定系刷新プロジェクト。提案したのは海外実績のあるパッケージ「CoreFlex」。ただし、国内の銀行に導入された前例は——まだ一件もない。',
    next: 'kuroda_1',
  },
  {
    id: 'kuroda_1',
    speaker: '黒田PM',
    text: 'CoreFlexで提案が通った。海外の銀行で動いてる実績がある。日本の銀行は初だが、まあ何とかなるだろう。',
    next: 'branch1_setup',
  },
  // ── 分岐1：早期の懸念表明 ──────────────────────────────────────
  {
    id: 'branch1_setup',
    speaker: 'あなた',
    text: '（国内の銀行業務に、海外パッケージがそのまま合うとは限らない……今の段階で言っておくべきか？）',
    choices: [
      {
        label: '「国内の銀行業務とのギャップを、要件定義前に検証すべきです」',
        setFlags: { warnedEarly: true, trust: 1 },
        next: 'branch1_warn',
      },
      {
        label: '「分かりました、実績があるなら大丈夫ですね」',
        setFlags: { warnedEarly: false },
        next: 'branch1_silent',
      },
    ],
  },
  {
    id: 'branch1_warn',
    speaker: '黒田PM',
    text: '……慎重だな。まあ一理ある。だが提案はもう通ってる。検証しつつ進めるぞ。',
    next: 'act2_intro',
  },
  {
    id: 'branch1_silent',
    speaker: '黒田PM',
    text: 'そうだ、その意気だ。前に進めよう。',
    next: 'act2_intro',
  },
  // ── 承：ギャップ発覚 ────────────────────────────────────────────
  {
    id: 'act2_intro',
    speaker: 'ナレーション',
    text: '数か月後。要件定義が進むほど、CoreFlexの標準機能と日本の銀行業務のズレが次々と表面化していった。',
    next: 'sasaki_1',
  },
  {
    id: 'sasaki_1',
    speaker: '佐々木（二次請け）',
    text: '先輩、これマズいです。標準機能で吸収できない要件が山ほどある。このままだと予算も納期も全然足りません。',
    next: 'branch2_setup',
  },
  // ── 分岐2：議事録に残すか ─────────────────────────────────────
  {
    id: 'branch2_setup',
    speaker: 'あなた',
    text: '（このギャップとリスク、顧客との打ち合わせで正式に記録に残すべきか。それとも内々で処理して波風を立てないか……）',
    choices: [
      {
        label: '顧客との議事録に「重大なギャップとリスク」を明記する',
        setFlags: { gijirokuKept: true, trust: 1 },
        next: 'branch2_record',
      },
      {
        label: '口頭共有にとどめ、議事録には書かない',
        setFlags: { gijirokuKept: false, trust: -1 },
        next: 'branch2_norecord',
      },
    ],
  },
  {
    id: 'branch2_record',
    speaker: '高梨部長',
    text: '……正直に書いてくれて助かる。問題があるなら、こちらも判断材料にしたい。',
    next: 'act3_intro',
  },
  {
    id: 'branch2_norecord',
    speaker: '中村営業',
    text: '（小声で）助かるよ。議事録に「リスク」なんて残ったら、顧客が不安がるからな。',
    next: 'act3_intro',
  },
  // ── 転：最終合意の夜（クライマックス） ──────────────────────────
  {
    id: 'act3_intro',
    speaker: 'ナレーション',
    text: 'そして最終合意の前夜。約90億円で開発を完遂するという「最終合意書」に、明日サインがなされる。だが現場の感触では、この予算と納期で完成させるのは——ほぼ不可能だ。',
    next: 'kuroda_2',
  },
  {
    id: 'kuroda_2',
    speaker: '黒田PM',
    text: 'ここまで来たんだ。いまさら「できません」とは言えない。とりあえずサインをもらって、走りながら何とかしよう。',
    next: 'branch3_setup',
  },
  // ── 分岐3：クライマックス ──────────────────────────────────────
  {
    id: 'branch3_setup',
    speaker: 'あなた',
    text: '（中止や抜本的な見直しを進言すれば、これまでの投資が無駄になると責められる。でも、黙ってサインさせれば、無理な約束の責任を全員が負う……）',
    choices: [
      {
        label: '顧客に「スコープ・予算・納期の抜本見直し、または中止」を正式に進言する',
        setFlags: { proposedStop: true, trust: 1 },
        next: 'ending_gate',
      },
      {
        label: '対症療法でしのぎ、「順調です」と報告してサインを進める',
        setFlags: { proposedStop: false, trust: -1 },
        next: 'ending_gate',
      },
    ],
  },
  {
    id: 'ending_gate',
    speaker: 'システム',
    text: '（エンディング判定へ）',
    isEndingGate: true,
  },
];

export const DIALOGUE_MAP: Record<string, DialogueNode> = Object.fromEntries(
  DIALOGUE.map((n) => [n.id, n])
);

export const ENDINGS: Record<'best' | 'bad_norecord' | 'bad_meltdown', EndingDef> = {
  best: {
    id: 'ending_best',
    title: '【ベストエンド】誠実なベンダー',
    text: 'あなたは記録を残し、適切なタイミングでリスクを伝え、最後に中止と見直しを正式に進言した。プロジェクトは縮小・再設計され、損害は最小限に抑えられた。みなと地方銀行はテクノブリッジを「信頼できるパートナー」と評した。',
    learn: 'ベンダーには、危機において中止をも提言する「プロジェクトマネジメント義務」がある。それを果たすことが、長期的な信頼につながる。',
    type: 'best',
  },
  bad_norecord: {
    id: 'ending_lawsuit',
    title: '【バッドエンド】言った、言わない',
    text: 'プロジェクトは予算超過の末に頓挫した。あなたは「リスクは口頭で伝えていた」と主張したが、議事録は残っていない。顧客は「そんな説明は受けていない」と反論。責任の所在は曖昧なまま、テクノブリッジが過失を問われた。',
    learn: '「中止を提言する義務」を果たしたかどうかは、最終的に"記録"で判断される。議事録は自分を守る盾になる。',
    type: 'bad',
  },
  bad_meltdown: {
    id: 'ending_meltdown',
    title: '【バッドエンド】炎上',
    text: '「順調です」という報告を重ねたまま開発は進み、無理な約束は破綻。プロジェクトは中止に追い込まれ、巨額の費用が無駄になった。後の検証で「ベンダーは危険を認識しながら適切な提言をしなかった」と認定された。',
    learn: '対症療法と「問題なし」報告は、炎上を先送りにするだけ。早期の警告と中止提言こそが被害を防ぐ。',
    type: 'bad',
  },
};

export function resolveEnding(flags: QuestFlags): EndingDef {
  if (flags.proposedStop) return ENDINGS.best;
  if (!flags.gijirokuKept) return ENDINGS.bad_norecord;
  return ENDINGS.bad_meltdown;
}

export const DEFAULT_FLAGS: QuestFlags = {
  warnedEarly: false,
  gijirokuKept: false,
  proposedStop: false,
  trust: 0,
};
