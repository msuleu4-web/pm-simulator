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
  type: 'best' | 'good' | 'bad';
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

// ── 8-ending matrix  (warnedEarly × gijirokuKept × proposedStop) ──────────────
//
//  E1 : W=✓  G=✓  S=✓  →  パーフェクト          ★★★
//  E2 : W=✗  G=✓  S=✓  →  誠実なベンダー        ★★☆
//  E3 : W=✓  G=✗  S=✓  →  証明なき英断          ★★☆
//  E4 : W=✗  G=✗  S=✓  →  土壇場の一手          ★☆☆
//  E5 : W=✓  G=✓  S=✗  →  記録だけでは足りない  ✕✓✓
//  E6 : W=✗  G=✓  S=✗  →  証拠の墓場            ✕✗✓
//  E7 : W=✓  G=✗  S=✗  →  言った、言わない      ✕✓✗
//  E8 : W=✗  G=✗  S=✗  →  完全な炎上            ✕✗✗

export const ENDINGS: Record<string, EndingDef> = {
  e1_perfect: {
    id: 'e1_perfect',
    title: '【完全クリア】模範的なプロジェクトマネージャー',
    text: '早期に懸念を表明し、ギャップを議事録に刻み、最後は退路を断って中止を進言した。プロジェクトは縮小・再設計に転換され、被害は最小限に抑えられた。高梨部長はこう言った。「こういうベンダーと仕事がしたかった」。テクノブリッジとの次の案件契約は3か月後に締結された。',
    learn: '早期警告・記録・中止提言——三拍子揃って初めて「PMとしての義務」を完全に果たしたことになる。どれが欠けても完全ではない。',
    type: 'best',
  },
  e2_honest: {
    id: 'e2_honest',
    title: '【ベストエンド】誠実なベンダー',
    text: '記録を残し、最後に中止と見直しを正式に進言した。プロジェクトは縮小・再設計され、損害は最小限に抑えられた。「早い段階で言ってくれれば……」と黒田PMは呟いたが、後悔よりも安堵の方が大きかった。',
    learn: '「中止を提言するプロジェクトマネジメント義務」を果たし、かつ記録で証明できた。これが最低ラインのベスト。早期警告があればさらに良かった。',
    type: 'best',
  },
  e3_brave_no_record: {
    id: 'e3_brave_no_record',
    title: '【グッドエンド・但し書き付き】証明なき英断',
    text: '早期から懸念を抱き、最後に中止を進言した。プロジェクトは再設計への道を歩み始めた。ただし、議事録が残っていなかったため「本当にそんな懸念を持っていたのか」と後から疑われる場面が生じた。あなたの行動は正しかったが、証明が難しかった。',
    learn: '正しい行動をしても、記録がなければ「やった」ことにならない場合がある。善意はドキュメントで守れ。',
    type: 'good',
  },
  e4_last_minute: {
    id: 'e4_last_minute',
    title: '【グッドエンド・薄氷】土壇場の一手',
    text: '早期警告も議事録も残さなかったが、最後の最後に中止を進言した。プロジェクトは一時混乱したが、方向転換できた。「なぜもっと早く言わなかったのか」という問いに、あなたは答えられなかった。それでも、言わないよりはずっとよかった。',
    learn: 'どれだけ遅くても「言う」は「言わない」より優れている。ただし、早ければ早いほど被害は少なかった。タイミングはコストだ。',
    type: 'good',
  },
  e5_record_not_enough: {
    id: 'e5_record_not_enough',
    title: '【バッドエンド】記録だけでは足りなかった',
    text: '早期に懸念を表明し、ギャップも議事録に残した。だが最後の一手——中止の進言——だけが踏み出せなかった。プロジェクトは議事録が示した通りの末路を辿った。裁判では「危険を知りながら提言しなかった」と認定された。議事録は、自分を守るどころか、自分の過失を証明する証拠になった。',
    learn: '記録は「知っていた」ことを証明する。知っていながら提言しなかったなら、それはより重い責任になりうる。知識は行動を義務づける。',
    type: 'bad',
  },
  e6_evidence_graveyard: {
    id: 'e6_evidence_graveyard',
    title: '【バッドエンド】証拠の墓場',
    text: '議事録にリスクを残した。しかし中止の提言をしなかった。プロジェクトは破綻し、残された議事録が法廷に持ち出された。「ベンダーはリスクを認識していた」——その一文が、テクノブリッジに対する賠償命令の根拠になった。',
    learn: '記録は「知っていた証拠」でもある。リスクを把握したなら、それに対応する義務が生じる。議事録は保険にもなるし、凶器にもなる。',
    type: 'bad',
  },
  e7_he_said_she_said: {
    id: 'e7_he_said_she_said',
    title: '【バッドエンド】言った、言わない',
    text: '早期から懸念はあった。佐々木にも伝えていた。しかし議事録には残さず、最後も「順調です」で押し通した。プロジェクトが破綻したあと、あなたは「リスクは伝えていた」と主張した。顧客は「そんな話は聞いていない」と言い張った。記録がないので、確かめる術はない。',
    learn: '口頭の警告は「言った」という記憶だけが残る。記憶は摩耗する。議事録は摩耗しない。「言った」を証明できるのは記録だけだ。',
    type: 'bad',
  },
  e8_full_meltdown: {
    id: 'e8_full_meltdown',
    title: '【最悪エンド】完全な炎上',
    text: '懸念を表明せず、記録も残さず、中止も提言しなかった。プロジェクトは「順調」という虚構の中で膨張し続け、最終的に全てが爆発した。検証委員会の結論は短かった。「ベンダーに、プロジェクトマネジメント上の重大な過失があった」。90億円の損害賠償訴訟が始まった。',
    learn: 'これはフィクションだが、スルガ銀行 vs 日本IBM事件（2019年）は現実に起きた。74億円の賠償が認められた。沈黙には値段がつく。',
    type: 'bad',
  },
};

export function resolveEnding(flags: QuestFlags): EndingDef {
  const { warnedEarly: W, gijirokuKept: G, proposedStop: S } = flags;
  if ( W &&  G &&  S) return ENDINGS.e1_perfect;
  if (!W &&  G &&  S) return ENDINGS.e2_honest;
  if ( W && !G &&  S) return ENDINGS.e3_brave_no_record;
  if (!W && !G &&  S) return ENDINGS.e4_last_minute;
  if ( W &&  G && !S) return ENDINGS.e5_record_not_enough;
  if (!W &&  G && !S) return ENDINGS.e6_evidence_graveyard;
  if ( W && !G && !S) return ENDINGS.e7_he_said_she_said;
  return ENDINGS.e8_full_meltdown;
}

export const DEFAULT_FLAGS: QuestFlags = {
  warnedEarly: false,
  gijirokuKept: false,
  proposedStop: false,
  trust: 0,
};
