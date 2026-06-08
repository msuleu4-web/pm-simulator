// quest_corebank — 「最終合意の夜」
// All characters and organizations are fictional. 架空の物語です。

export interface DialogueFlagEffect {
  warnedEarly?: boolean;
  gijirokuKept?: boolean;
  escalatedUp?: boolean;
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
  escalatedUp: boolean;
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
    text: 'このストーリーはフィクションです。実在の企業・人物・事件とは一切関係ありません',
    next: 'intro',
  },
  {
    id: 'intro',
    speaker: 'ナレーション',
    text: 'みなと地方銀行の勘定系刷新プロジェクト。提案したのは海外実績のあるパッケージ「CoreFlex」。ただし、国内の銀行に導入された前例は——まだ一件もない',
    next: 'kuroda_1',
  },
  {
    id: 'kuroda_1',
    speaker: '黒田PM',
    text: 'CoreFlexで提案が通った。海外の銀行で動いてる実績がある。日本の銀行は初だが、まあ何とかなるだろう',
    next: 'branch1_setup',
  },

  // ── 分岐①：早期の懸念表明 ─────────────────────────────────────
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
    text: '……慎重だな。まあ一理ある。だが提案はもう通ってる。検証しつつ進めるぞ',
    next: 'act2_intro',
  },
  {
    id: 'branch1_silent',
    speaker: '黒田PM',
    text: 'そうだ、その意気だ。前に進めよう',
    next: 'act2_intro',
  },

  // ── 承：ギャップ発覚 ────────────────────────────────────────────
  {
    id: 'act2_intro',
    speaker: 'ナレーション',
    text: '数か月後。要件定義が進むほど、CoreFlexの標準機能と日本の銀行業務のズレが次々と表面化していった',
    next: 'sasaki_1',
  },
  {
    id: 'sasaki_1',
    speaker: '佐々木（二次請け）',
    text: '先輩、これマズいです。標準機能で吸収できない要件が山ほどある。このままだと予算も納期も全然足りません',
    next: 'branch2_setup',
  },

  // ── 分岐②：議事録に残すか ─────────────────────────────────────
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
    text: '……正直に書いてくれて助かる。問題があるなら、こちらも判断材料にしたい',
    next: 'branch4_intro',
  },
  {
    id: 'branch2_norecord',
    speaker: '中村営業',
    text: '（小声で）助かるよ。議事録に「リスク」なんて残ったら、顧客が不安がるからな',
    next: 'branch4_intro',
  },

  // ── 分岐④：自社の上層部に報告するか ──────────────────────────
  {
    id: 'branch4_intro',
    speaker: 'ナレーション',
    text: '翌週。テクノブリッジの事業部長・橋本から突然連絡が入った。「プロジェクトの現状を聞かせてほしい。黒田PMから上がってくる報告が楽観的すぎる気がしてな」',
    next: 'branch4_setup',
  },
  {
    id: 'branch4_setup',
    speaker: 'あなた',
    text: '（これは好機かもしれない——が、黒田PMをすっ飛ばして上に本当のことを話せば、組織内の信頼関係が壊れる。でも黙っていれば、上層部も手を打てない……）',
    choices: [
      {
        label: '「実は深刻な状況です」と、橋本部長に現状を正直に報告する',
        setFlags: { escalatedUp: true, trust: 1 },
        next: 'branch4_escalate',
      },
      {
        label: '「問題ありません、順調です」と、黒田PMの報告に合わせる',
        setFlags: { escalatedUp: false, trust: -1 },
        next: 'branch4_silent',
      },
    ],
  },
  {
    id: 'branch4_escalate',
    speaker: '橋本部長',
    text: '……そうか。よく話してくれた。会社として対処を検討する。ただし、この話は黒田PMには出所を明かさない。以上だ',
    next: 'act3_intro',
  },
  {
    id: 'branch4_silent',
    speaker: 'あなた',
    text: '（また、蓋をした。これで何度目だろう……）',
    next: 'act3_intro',
  },

  // ── 転：最終合意の夜（クライマックス） ──────────────────────────
  {
    id: 'act3_intro',
    speaker: 'ナレーション',
    text: 'そして最終合意の前夜。約90億円で開発を完遂するという「最終合意書」に、明日サインがなされる。だが現場の感触では、この予算と納期で完成させるのは——ほぼ不可能だ',
    next: 'kuroda_2',
  },
  {
    id: 'kuroda_2',
    speaker: '黒田PM',
    text: 'ここまで来たんだ。いまさら「できません」とは言えない。とりあえずサインをもらって、走りながら何とかしよう',
    next: 'branch3_setup',
  },

  // ── 分岐③：クライマックス ─────────────────────────────────────
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

// ── 16-ending matrix  (W=warnedEarly · G=gijirokuKept · E=escalatedUp · S=proposedStop) ──
//
//  S=✓（中止進言した）
//   #1  W✓ G✓ E✓ S✓  →  伝説のPM
//   #2  W✗ G✓ E✓ S✓  →  組織を動かした誠実者
//   #3  W✓ G✗ E✓ S✓  →  上は動いたが記録なし
//   #4  W✓ G✓ E✗ S✓  →  孤独な英断
//   #5  W✗ G✗ E✓ S✓  →  土壇場で組織が動く
//   #6  W✗ G✓ E✗ S✓  →  誠実なベンダー
//   #7  W✓ G✗ E✗ S✓  →  証明なき英断
//   #8  W✗ G✗ E✗ S✓  →  土壇場の一手
//
//  S=✗（しのいだ）
//   #9  W✓ G✓ E✓ S✗  →  全て持っていたのに
//  #10  W✗ G✓ E✓ S✗  →  組織も沈黙した
//  #11  W✓ G✗ E✓ S✗  →  内部告発も記録なし
//  #12  W✓ G✓ E✗ S✗  →  記録だけでは足りない
//  #13  W✗ G✗ E✓ S✗  →  組織が諦めた日
//  #14  W✗ G✓ E✗ S✗  →  証拠の墓場
//  #15  W✓ G✗ E✗ S✗  →  言った、言わない
//  #16  W✗ G✗ E✗ S✗  →  完全な炎上

export const ENDINGS: Record<string, EndingDef> = {
  // ─────────────────────── S=✓ グループ ───────────────────────────

  e01_legend: {
    id: 'e01_legend',
    title: '【完全制覇】伝説のプロジェクトマネージャー',
    text: '早期に懸念を表明し、ギャップを議事録に刻み、上層部にも正直に状況を上げ、そして最後に退路を断って中止を進言した。4つの決断すべてが正しかった。プロジェクトは縮小・再設計に転換され、みなと地方銀行との関係は次の10年に続く契約として実を結んだ。橋本部長はこう言った——「これがプロフェッショナルというものだ」',
    learn: '早期警告・記録・内部エスカレーション・中止提言——4つ全てが揃って初めてPMとしての義務を完全に果たしたと言える。一つ欠けても「ほぼ」にとどまる',
    type: 'best',
  },
  e02_org_hero: {
    id: 'e02_org_hero',
    title: '【ベストエンド】組織を動かした誠実者',
    text: '記録を残し、上層部に状況を正直に報告し、最後に中止を進言した。会社として橋本部長が動いてくれたことで、進言の重みが増した。「あなた一人じゃなかった」——佐々木がそう言って頭を下げた',
    learn: '個人の勇気だけでなく、組織を巻き込む動きが被害を最小化した。エスカレーションは裏切りではなく、会社全体のリスク管理だ',
    type: 'best',
  },
  e03_brave_no_record: {
    id: 'e03_brave_no_record',
    title: '【グッドエンド】上は動いたが記録がない',
    text: '早期から懸念を抱き、上層部にも報告し、最後に中止を進言した。プロジェクトは再設計された。ただし議事録が残っていなかったため、後から「本当にそう言ったのか」という場面が何度か生じた。功績は認められたが、証拠がないと評価も曖昧になる',
    learn: '行動が正しくても記録がなければ「したこと」は証明できない。勇気はドキュメントで補強しろ',
    type: 'good',
  },
  e04_lone_hero: {
    id: 'e04_lone_hero',
    title: '【グッドエンド】孤独な英断',
    text: '早期から警告し、議事録にも残し、最後に中止を進言した。上層部への報告はしなかったが、その分あなた個人の決断の重みが際立った。プロジェクトは再設計され、あなたは社内で「あの時止めた人」として語られるようになった',
    learn: '組織に頼らずとも正しい行動はできる。ただし孤独に戦うより、組織を味方につけた方が勝ちやすい',
    type: 'good',
  },
  e05_last_org: {
    id: 'e05_last_org',
    title: '【グッドエンド・薄氷】土壇場で組織が動く',
    text: '早期警告も議事録もなかったが、上層部には正直に話し、最後に中止を進言した。橋本部長がバックについたことで、黒田PMも退かざるを得なかった。プロジェクトは止まった——ギリギリで',
    learn: '準備がなくても、信頼できる上に早めに話を上げることで被害を抑えられる場合がある。組織のリソースを使うことを恐れるな',
    type: 'good',
  },
  e06_honest_vendor: {
    id: 'e06_honest_vendor',
    title: '【ベストエンド】誠実なベンダー',
    text: '記録を残し、最後に中止を正式に進言した。プロジェクトは縮小・再設計され、損害は最小限に抑えられた。「早い段階で言ってくれれば」と黒田PMは呟いたが、後悔よりも安堵の方が大きかった',
    learn: '中止を提言するプロジェクトマネジメント義務を果たし、かつ記録で証明できた。早期警告があればさらに良かったが、これが誠実さの最低ライン',
    type: 'best',
  },
  e07_no_proof: {
    id: 'e07_no_proof',
    title: '【グッドエンド・但し書き付き】証明なき英断',
    text: '早期から懸念を抱き、最後に中止を進言した。プロジェクトは再設計への道を歩み始めた。ただし議事録がなかったため「本当にそんな懸念を持っていたのか」と後から疑われた。行動は正しかったが、証明が難しかった',
    learn: '正しい行動をしても記録がなければ「やった」ことにならない場合がある。善意はドキュメントで守れ',
    type: 'good',
  },
  e08_last_minute: {
    id: 'e08_last_minute',
    title: '【グッドエンド・薄氷】土壇場の一手',
    text: '早期警告も議事録も上への報告もなかったが、最後の最後に中止を進言した。プロジェクトは混乱したが方向転換できた。「なぜもっと早く言わなかったのか」という問いに、あなたは答えられなかった。それでも、言わないよりはずっとよかった',
    learn: 'どれだけ遅くても「言う」は「言わない」より優れている。ただし早ければ早いほど被害は少なかった。タイミングはコストだ',
    type: 'good',
  },

  // ─────────────────────── S=✗ グループ ───────────────────────────

  e09_had_everything: {
    id: 'e09_had_everything',
    title: '【バッドエンド】全てを持っていたのに',
    text: '早期に警告し、議事録に残し、上層部にも報告した——それでも最後に踏み出せなかった。橋本部長も動こうとしていた。あなたが一言「止めてください」と言えば、会社は動けた。でも言わなかった。後の検証でこう記録された——「ベンダーは全ての情報を持ちながら、最終的な提言を回避した」',
    learn: '準備が整っていても、最後に「言う」勇気がなければ何も変わらない。情報と行動の間には、越えなければならない一線がある',
    type: 'bad',
  },
  e10_org_also_silent: {
    id: 'e10_org_also_silent',
    title: '【バッドエンド】組織も沈黙した',
    text: '議事録を残し、橋本部長にも報告した。しかし最後に中止の進言をしなかった。橋本部長も「現場が言わないなら……」と判断を先送りにした。組織はあなたの動きを待っていた。誰も最後の一手を打たないまま、プロジェクトは崩壊した',
    learn: '報告とエスカレーションは「誰かが動いてくれること」を期待する行為ではない。最後の決断を他人に委ねるな。提言は自分の口でしろ',
    type: 'bad',
  },
  e11_escalate_no_record: {
    id: 'e11_escalate_no_record',
    title: '【バッドエンド】内部告発も記録なし',
    text: '早期から懸念を持ち、上層部にも正直に話した。しかし議事録がなく、最後も「順調です」で通した。橋本部長は「そんな深刻な話を聞いた覚えはない」と後から言い張った。証明できるものが何もなかった。あなたの正直さは、記録がなければ存在しなかったことになる',
    learn: '口頭の告発は消える。書面の告発は残る。内部でどれだけ正直に話しても、記録に残らなければ「言った」と証明できない',
    type: 'bad',
  },
  e12_record_not_enough: {
    id: 'e12_record_not_enough',
    title: '【バッドエンド】記録だけでは足りなかった',
    text: '早期に懸念を表明し、ギャップも議事録に残した。だが最後の一手——中止の進言——だけが踏み出せなかった。プロジェクトは議事録が示した通りの末路を辿った。裁判では「危険を知りながら提言しなかった」と認定された。議事録は、自分を守るどころか、自分の過失を証明する証拠になった',
    learn: '記録は「知っていた」ことを証明する。知っていながら提言しなかったなら、それはより重い責任になりうる。知識は行動を義務づける',
    type: 'bad',
  },
  e13_org_gave_up: {
    id: 'e13_org_gave_up',
    title: '【バッドエンド】組織が諦めた日',
    text: '上層部には正直に話したが、議事録もなく早期警告もなかった。橋本部長は一度動こうとしたが「証拠が薄すぎる」と引いた。最後も「順調です」で通した。組織は諦め、現場は崩壊した。橋本部長は後に言った——「もっと早く、もっと記録を持って来てくれれば動けた」',
    learn: '上層部を動かすには証拠が必要だ。口頭の訴えだけでは、組織の意思決定は動かせない。エスカレーションと記録はセットだ',
    type: 'bad',
  },
  e14_evidence_graveyard: {
    id: 'e14_evidence_graveyard',
    title: '【バッドエンド】証拠の墓場',
    text: '議事録にリスクを残した。しかし中止の提言をしなかった。プロジェクトは破綻し、残された議事録が法廷に持ち出された。「ベンダーはリスクを認識していた」——その一文が、テクノブリッジに対する賠償命令の根拠になった',
    learn: '記録は「知っていた証拠」でもある。リスクを把握したなら、それに対応する義務が生じる。議事録は保険にもなるし、凶器にもなる',
    type: 'bad',
  },
  e15_he_said_she_said: {
    id: 'e15_he_said_she_said',
    title: '【バッドエンド】言った、言わない',
    text: '早期から懸念はあった。佐々木にも伝えていた。しかし議事録には残さず、上にも報告せず、最後も「順調です」で押し通した。プロジェクトが破綻したあと、あなたは「リスクは伝えていた」と主張した。顧客は「そんな話は聞いていない」と言い張った。記録がないので、確かめる術はない',
    learn: '口頭の警告は「言った」という記憶だけが残る。記憶は摩耗する。議事録は摩耗しない。「言った」を証明できるのは記録だけだ',
    type: 'bad',
  },
  e16_full_meltdown: {
    id: 'e16_full_meltdown',
    title: '【最悪エンド】完全な炎上',
    text: '懸念を表明せず、記録も残さず、上にも報告せず、中止も提言しなかった。プロジェクトは「順調」という虚構の中で膨張し続け、最終的に全てが爆発した。検証委員会の結論は短かった——「ベンダーに、プロジェクトマネジメント上の重大な過失があった」。90億円の損害賠償訴訟が始まった',
    learn: 'これはフィクションだが、スルガ銀行 vs 日本IBM事件（2019年）は現実に起きた。74億円の賠償が認められた。沈黙には値段がつく',
    type: 'bad',
  },
};

export function resolveEnding(flags: QuestFlags): EndingDef {
  const { warnedEarly: W, gijirokuKept: G, escalatedUp: E, proposedStop: S } = flags;

  if ( W &&  G &&  E &&  S) return ENDINGS.e01_legend;
  if (!W &&  G &&  E &&  S) return ENDINGS.e02_org_hero;
  if ( W && !G &&  E &&  S) return ENDINGS.e03_brave_no_record;
  if ( W &&  G && !E &&  S) return ENDINGS.e04_lone_hero;
  if (!W && !G &&  E &&  S) return ENDINGS.e05_last_org;
  if (!W &&  G && !E &&  S) return ENDINGS.e06_honest_vendor;
  if ( W && !G && !E &&  S) return ENDINGS.e07_no_proof;
  if (!W && !G && !E &&  S) return ENDINGS.e08_last_minute;

  if ( W &&  G &&  E && !S) return ENDINGS.e09_had_everything;
  if (!W &&  G &&  E && !S) return ENDINGS.e10_org_also_silent;
  if ( W && !G &&  E && !S) return ENDINGS.e11_escalate_no_record;
  if ( W &&  G && !E && !S) return ENDINGS.e12_record_not_enough;
  if (!W && !G &&  E && !S) return ENDINGS.e13_org_gave_up;
  if (!W &&  G && !E && !S) return ENDINGS.e14_evidence_graveyard;
  if ( W && !G && !E && !S) return ENDINGS.e15_he_said_she_said;
  return ENDINGS.e16_full_meltdown;
}

export const DEFAULT_FLAGS: QuestFlags = {
  warnedEarly: false,
  gijirokuKept: false,
  escalatedUp: false,
  proposedStop: false,
  trust: 0,
};
