import type { ScenarioEvent } from './types';

// ── E01〜E56: 全56イベント定義 ────────────────────────────────────────────
// 第1章: E01-E08 / 第2章: E09-E16 / 第3章: E17-E24 / 第4章: E25-E32
// 第5章: E33-E40 / 第6章: E41-E48 / 第7章: E49-E56

export const SCENARIO_EVENTS: ScenarioEvent[] = [
  // ══════════════════════════════════════════════════════════════════════
  // 第1章: 配属・キックオフ
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'E01',
    chapterId: 1,
    slot: 'INTRO',
    title: '初日配属',
    body: '朝9時、田中PMに案内されてデスクへ。体制図と案件概要書を手渡される。「とりあえず読んでおいて」と言われ、5分後には全体会議が始まる。',
    choices: [],
    reviewNote: '【フィールドガイド】田中PM・佐藤先輩・鈴木さん・石田さんとの出会い。誰がどんな役割かを把握することが、プロジェクト序盤の最重要ミッション。',
  },
  {
    id: 'E02',
    chapterId: 1,
    slot: 'MISSION_A',
    title: '初回キックオフ会議',
    body: '顧客担当の石田さんが30分間、怒涛の要求を口頭で話し続けている。議事録担当は誰も指定されていない。どう記録するか？',
    choices: [
      {
        id: 'E02-A',
        text: '発言者・決定事項・未決事項を分けてリアルタイムでメモする',
        effect: {
          scoreDelta: 10,
          metricDeltas: { quality: 5, learning: 5 },
          flagUpdates: { minutesDocumented: true },
          explanation: '発言者・決定事項・未決事項を分けることで、後から「誰が何を言ったか」を正確に追跡できます。議事録の基本フォーマットです。',
        },
      },
      {
        id: 'E02-B',
        text: '録音しながら、後でまとめようとする',
        effect: {
          scoreDelta: 3,
          metricDeltas: { schedule: -3 },
          flagUpdates: { minutesDocumented: false },
          explanation: '録音は補助手段として有効ですが、整理の手間が後で発生し、「その場の確認」が失われます。',
        },
      },
      {
        id: 'E02-C',
        text: '誰かがやるだろうと思い、聞くだけに徹する',
        effect: {
          scoreDelta: -5,
          metricDeltas: { trust: -5, quality: -5 },
          explanation: '議事録担当が指定されていない場合、積極的に担う姿勢がSIer現場では評価されます。',
        },
      },
    ],
  },
  {
    id: 'E03',
    chapterId: 1,
    slot: 'MISSION_B',
    title: '議事録まとめ',
    body: '会議終了後、田中PMから「今日の議事録、今日中にチームに展開して」と言われた。',
    choices: [
      {
        id: 'E03-A',
        text: '決定事項・未決事項・アクション担当者・期日を明記して作成する',
        effect: {
          scoreDelta: 10,
          metricDeltas: { quality: 5, trust: 5 },
          npcTrustDeltas: { tanaka: 1 },
          explanation: '議事録は「後から見た人が会議に参加できる」レベルで書くことが理想。担当者と期日があると実行可能な記録になります。',
        },
      },
      {
        id: 'E03-B',
        text: '会議の流れをざっくり時系列でまとめる',
        effect: {
          scoreDelta: 3,
          metricDeltas: { quality: 2 },
          explanation: '概要でも記録がないよりはましですが、決定事項と未決事項が混在しやすくなります。',
        },
      },
      {
        id: 'E03-C',
        text: '前回の議事録テンプレをほぼコピペして形を整える',
        effect: {
          scoreDelta: -5,
          metricDeltas: { quality: -5, trust: -3 },
          npcTrustDeltas: { tanaka: -1 },
          explanation: '形だけの議事録は後で「記録はあるが内容がない」状態になり、確認コストがかえって増えます。',
        },
      },
    ],
  },
  {
    id: 'E04',
    chapterId: 1,
    slot: 'MISSION_C',
    title: '役割分担の確認',
    body: '体制図には自分の担当が「開発支援」としか書かれていない。このままでは何でも自分の仕事になりかねない。',
    choices: [
      {
        id: 'E04-A',
        text: 'RACI表の作成を田中PMに提案し、自分の担当範囲を明確にする',
        effect: {
          scoreDelta: 10,
          metricDeltas: { trust: 5, teamMorale: 5 },
          flagUpdates: { roleConfirmed: true },
          npcTrustDeltas: { tanaka: 1 },
          explanation: 'RACI（Responsible/Accountable/Consulted/Informed）で役割を明文化すると、後のオーバーロードや責任の押し付けを防げます。',
        },
      },
      {
        id: 'E04-B',
        text: '佐藤先輩に「自分は何を担当すればいいですか？」と聞く',
        effect: {
          scoreDelta: 5,
          metricDeltas: { learning: 5 },
          npcTrustDeltas: { satou: 1 },
          explanation: '先輩への相談は有効な手段。ただし公式な担当確認にはならないため、後でPMへの確認も必要です。',
        },
      },
      {
        id: 'E04-C',
        text: '「何でも拾います」という姿勢で行く',
        effect: {
          scoreDelta: -5,
          metricDeltas: { schedule: -5, teamMorale: -3 },
          explanation: '積極性は美徳ですが、担当範囲が曖昧なままだと後でオーバーロードの温床になります。',
        },
      },
    ],
  },
  {
    id: 'E05',
    chapterId: 1,
    slot: 'SIDE',
    title: '佐藤先輩の声かけ',
    body: '初週の金曜夕方、佐藤先輩が「困ってることある？現場は最初きついよね」と声をかけてきた。',
    choices: [
      {
        id: 'E05-A',
        text: '議事録フォーマットや確認すべき点を具体的に質問する',
        effect: {
          scoreDelta: 5,
          metricDeltas: { learning: 5, teamMorale: 3 },
          npcTrustDeltas: { satou: 1 },
          explanation: '具体的な質問は先輩の時間を有効活用できる。「何でも教えてください」より「○○について教えてください」が好まれます。',
        },
      },
      {
        id: 'E05-B',
        text: '「大丈夫です！頑張ります！」と元気よく断る',
        effect: {
          scoreDelta: 0,
          explanation: '自立心は大切ですが、困ったときに相談できる関係を築く機会を逃しています。',
        },
      },
      {
        id: 'E05-C',
        text: '「要件の優先度が分からなくて…」と正直に相談する',
        effect: {
          scoreDelta: 5,
          metricDeltas: { learning: 8, trust: 3 },
          npcTrustDeltas: { satou: 1 },
          nextEventHint: '佐藤先輩が要件定義のヒントをくれるかもしれない',
          explanation: '問題を抱え込まず相談することは、チームの生産性を上げる行動です。',
        },
      },
    ],
  },
  {
    id: 'E06',
    chapterId: 1,
    slot: 'RISK',
    title: '顧客の曖昧発言',
    body: '会議の締めで石田さんが「とにかくいい感じにしてほしいです。ユーザーが喜ぶやつ」と言い残して退席した。',
    choices: [
      {
        id: 'E06-A',
        text: '「具体的にどういう状態がゴールか確認させてください」と呼び止めて聞く',
        effect: {
          scoreDelta: 15,
          metricDeltas: { quality: 8, clientSatisfaction: 5 },
          flagUpdates: { ambiguityFlagged: true },
          npcTrustDeltas: { ishida: 1 },
          explanation: '曖昧な要求をそのまま受け取ることは、後で「こんなはずじゃなかった」の原因になります。その場で確認するのが最善です。',
        },
      },
      {
        id: 'E06-B',
        text: '「はい」と言って、後で田中PMに確認する',
        effect: {
          scoreDelta: 5,
          metricDeltas: { schedule: -2 },
          explanation: '上司を通じた確認は安全策ですが、一次情報が薄れるリスクがあります。',
        },
      },
      {
        id: 'E06-C',
        text: '「いい感じ」を自分なりに解釈して進める',
        effect: {
          scoreDelta: -10,
          metricDeltas: { clientSatisfaction: -10, quality: -5 },
          flagUpdates: { clientExpectationRisk: true },
          explanation: '「いい感じ」は人によって異なります。解釈のズレが後でCh3以降の炎上リスクになります。',
        },
      },
    ],
  },
  {
    id: 'E07',
    chapterId: 1,
    slot: 'JUDGE',
    title: '議事録への曖昧発言の記録方法',
    body: '議事録を書いている。石田さんの「いい感じに」という発言をどう記録するか？',
    choices: [
      {
        id: 'E07-A',
        text: '「[要確認] ユーザー体験のゴール定義はTBD。次回会議までに合意予定」と記載する',
        effect: {
          scoreDelta: 15,
          metricDeltas: { quality: 8, compliance: 5 },
          flagUpdates: { ambiguityFlagged: true },
          explanation: '[要確認]タグと確認予定を記載することで、読んだ人が「これは未確定事項だ」と即座に分かります。',
        },
      },
      {
        id: 'E07-B',
        text: '「いい感じに（石田様）」とそのまま書く',
        effect: {
          scoreDelta: 0,
          explanation: '事実の記録としては正確ですが、誰もアクションを取らないまま次に進む可能性があります。',
        },
      },
      {
        id: 'E07-C',
        text: '曖昧すぎるので省略する',
        effect: {
          scoreDelta: -10,
          metricDeltas: { quality: -8 },
          explanation: '省略した発言が後で「言った言わない」の原因になります。曖昧でも記録して[要確認]にする方が安全です。',
        },
      },
    ],
    condition: {
      requiredFlags: { minutesDocumented: true },
    },
  },
  {
    id: 'E08',
    chapterId: 1,
    slot: 'REVIEW',
    title: '1章振り返り',
    body: '初週が終わった。',
    choices: [],
    reviewNote: '【第1章のポイント】\n①議事録は「決定事項・未決事項・担当者・期日」の4点セットで書く\n②役割の曖昧さは開始時に解消する。後回しにすると全部自分の仕事になる\n③顧客の曖昧発言は「リスク」として記録する。「言った言わない」は議事録が防ぐ\n④困ったら相談できる関係を早めに作ることがプロジェクト成功の土台になる',
  },

  // ══════════════════════════════════════════════════════════════════════
  // 第2章: 要件定義
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'E09',
    chapterId: 2,
    slot: 'INTRO',
    title: '要件定義フェーズ開始',
    body: '第2章が始まった。田中PMから「ヒアリングをまとめて要件定義書を作って」と指示が来る。',
    choices: [],
    reviewNote: '前章で議事録を正確に書いていた場合、ここから要件整理がスムーズに始められる。そうでない場合、「あの会議の話、どうなってたっけ？」から始まる。',
  },
  {
    id: 'E10',
    chapterId: 2,
    slot: 'MISSION_A',
    title: 'ヒアリング準備',
    body: '石田さんとの1時間のヒアリングセッションが今週ある。どう準備するか？',
    choices: [
      {
        id: 'E10-A',
        text: '業務フロー・現状の課題・理想状態を聞くシートを事前作成して送付する',
        effect: {
          scoreDelta: 10,
          metricDeltas: { quality: 8, clientSatisfaction: 5, trust: 5 },
          npcTrustDeltas: { ishida: 1 },
          explanation: '事前にヒアリングシートを送ることで、顧客も準備できる。会議の密度が上がり、短時間で多くの情報を引き出せます。',
        },
      },
      {
        id: 'E10-B',
        text: '質問リストだけメモして、その場の流れで聞いていく',
        effect: {
          scoreDelta: 5,
          metricDeltas: { quality: 3 },
          explanation: 'ある程度有効ですが、顧客が準備できていないため、表層的な回答に終わりやすいです。',
        },
      },
      {
        id: 'E10-C',
        text: '既存の資料だけで判断して、ヒアリングは最小限にする',
        effect: {
          scoreDelta: -5,
          metricDeltas: { quality: -8, clientSatisfaction: -5 },
          explanation: '既存資料はあくまで参考。現場の声を直接聞くことで初めて「本当の要件」が見えてきます。',
        },
      },
    ],
  },
  {
    id: 'E11',
    chapterId: 2,
    slot: 'MISSION_B',
    title: '経営層と現場のズレ',
    body: 'ヒアリングを進めると問題が発覚。経営層は「承認ワークフロー機能が最優先」と言っているが、現場は「検索機能が一番使いたい」と言っている。',
    choices: [
      {
        id: 'E11-A',
        text: '両者を交えた優先度調整会議を設定する',
        effect: {
          scoreDelta: 15,
          metricDeltas: { quality: 8, clientSatisfaction: 5, trust: 5 },
          flagUpdates: { requirementsPrioritized: true },
          npcTrustDeltas: { tanaka: 1 },
          explanation: '経営層と現場のニーズが違うのはよくあること。どちらかを黙って優先するのではなく、テーブルに出して合意を取ることが正解です。',
        },
      },
      {
        id: 'E11-B',
        text: '経営層の意向を優先して設計する',
        effect: {
          scoreDelta: -5,
          metricDeltas: { clientSatisfaction: -8 },
          flagUpdates: { clientExpectationRisk: true },
          explanation: '経営層の意向を優先した場合、現場ユーザーが使わないシステムになるリスクがあります。',
        },
      },
      {
        id: 'E11-C',
        text: '現場の声を優先して設計する',
        effect: {
          scoreDelta: 0,
          metricDeltas: { teamMorale: 3 },
          explanation: '現場ユーザーを重視する姿勢は良いですが、経営層との認識ズレが後のフェーズで表面化するリスクがあります。',
        },
      },
    ],
  },
  {
    id: 'E12',
    chapterId: 2,
    slot: 'MISSION_C',
    title: '機能の優先順位付け',
    body: '要件が20個以上リストアップされた。納期3ヶ月ではどう考えても全部は無理。どうするか？',
    choices: [
      {
        id: 'E12-A',
        text: 'MoSCoW法（Must/Should/Could/Won\'t）で分類して顧客と合意する',
        effect: {
          scoreDelta: 15,
          metricDeltas: { quality: 8, clientSatisfaction: 5, schedule: 5 },
          flagUpdates: { requirementsPrioritized: true },
          explanation: 'MoSCoWは要件定義の標準的な優先順位付け手法。「何を作らないか」を明確にすることがプロジェクト管理の本質です。',
        },
      },
      {
        id: 'E12-B',
        text: '「全部やります」と返事して、後で調整しようとする',
        effect: {
          scoreDelta: -10,
          metricDeltas: { schedule: -10, cost: -5 },
          flagUpdates: { clientExpectationRisk: true },
          explanation: 'スコープクリープ（要件が際限なく膨らむこと）の典型的な原因。約束した以上、後で断るのは信頼失墜につながります。',
        },
      },
      {
        id: 'E12-C',
        text: '判断を田中PMに全て委ねる',
        effect: {
          scoreDelta: 3,
          metricDeltas: { trust: 2 },
          npcTrustDeltas: { tanaka: 1 },
          explanation: '判断をエスカレーションすること自体は悪くありませんが、自分で優先度を考えてから相談する方が成長につながります。',
        },
      },
    ],
  },
  {
    id: 'E13',
    chapterId: 2,
    slot: 'SIDE',
    title: '石田さんの本音',
    body: 'ヒアリング終了後、石田さんが小声で話しかけてきた。「実はですね、上の人は管理ダッシュボードって言ってますけど、現場的には検索機能の方が100倍必要なんです。言えなくて…」',
    choices: [
      {
        id: 'E13-A',
        text: '「大切な情報をありがとうございます。田中PMと相談して優先度に反映できるか検討します」',
        effect: {
          scoreDelta: 10,
          metricDeltas: { quality: 8, clientSatisfaction: 8 },
          npcTrustDeltas: { ishida: 1 },
          nextEventHint: '検索機能を優先した設計オプションが第3章で解放される',
          explanation: '現場ユーザーの本音は要件定義の最重要インプット。石田さんが信頼してくれたからこそ得られた情報です。',
        },
      },
      {
        id: 'E13-B',
        text: '「そうなんですね」と受け取るだけで何もアクションしない',
        effect: {
          scoreDelta: 0,
          explanation: '情報を得たが、活かせていない状態。聞いた情報は必ず記録・共有・活用しましょう。',
        },
      },
    ],
    condition: {
      requiredNpcTrust: { ishida: 1 },
    },
  },
  {
    id: 'E14',
    chapterId: 2,
    slot: 'RISK',
    title: '「ついでにこれも」追加要求',
    body: '要件定義の最終確認の場で、石田さんが「あ、そうそう、ついでにこれもお願いできますか？」と新機能を提案してきた。',
    choices: [
      {
        id: 'E14-A',
        text: '「仕様変更として正式起票します。影響確認後に判断させてください」',
        effect: {
          scoreDelta: 15,
          metricDeltas: { quality: 8, compliance: 5 },
          flagUpdates: { scopeChangeLogged: true },
          explanation: '変更管理は「いけない」のではなく「記録してから判断する」のが正解。追加コストと影響を見積もって初めて正式に受け入れられます。',
        },
      },
      {
        id: 'E14-B',
        text: '「小さい機能だから取り込んでしまおう」と判断する',
        effect: {
          scoreDelta: -5,
          metricDeltas: { schedule: -5, cost: -3 },
          explanation: '「小さい機能」が積み重なるとスコープが膨張します。今回記録しないと、第4章で「あの機能どこに入れた？」問題が発生します。',
        },
      },
      {
        id: 'E14-C',
        text: '「スコープ外なので追加費用・期間が必要です」と断る',
        effect: {
          scoreDelta: 10,
          metricDeltas: { schedule: 5, cost: 5 },
          flagUpdates: { scopeChangeLogged: true },
          npcTrustDeltas: { ishida: -1 },
          explanation: '断ること自体は正当な対応ですが、代替案の提示（「次フェーズで対応できます」等）があると関係が維持できます。',
        },
      },
    ],
  },
  {
    id: 'E15',
    chapterId: 2,
    slot: 'JUDGE',
    title: '変更管理票の記載粒度',
    body: '変更起票することになった。変更管理票に何を記録するか？',
    choices: [
      {
        id: 'E15-A',
        text: '変更内容・影響範囲・追加工数見積もり・合意者・合意日を全て記載する',
        effect: {
          scoreDelta: 15,
          metricDeltas: { quality: 8, compliance: 8 },
          explanation: '変更管理票は後で「証拠」になります。合意者と合意日が記録されていれば、誰も「そんな話は知らない」と言えなくなります。',
        },
      },
      {
        id: 'E15-B',
        text: '変更内容と担当者だけ書く',
        effect: {
          scoreDelta: 5,
          metricDeltas: { quality: 3 },
          explanation: '最低限の記録ではありますが、工数への影響や合意者がないと後で責任の所在が曖昧になります。',
        },
      },
      {
        id: 'E15-C',
        text: 'Slackのメッセージをスクリーンショットして添付するだけ',
        effect: {
          scoreDelta: 0,
          metricDeltas: { quality: -3 },
          explanation: 'Slackのメッセージは「仕様」とみなされないことが多い。正式な変更管理票での管理が基本です。',
        },
      },
    ],
    condition: {
      requiredFlags: { scopeChangeLogged: true },
    },
  },
  {
    id: 'E16',
    chapterId: 2,
    slot: 'REVIEW',
    title: '2章振り返り',
    body: '要件定義フェーズが完了した。',
    choices: [],
    reviewNote: '【第2章のポイント】\n①要件定義のゴールは「何を作るか」だけでなく「何を作らないか」を決めること\n②スコープクリープ（要件が膨らむこと）は開発の最大リスク。変更管理票はプロジェクトの保険証\n③「ついでに」を無記録で受け入れると「最初からその機能は含まれていたはず」という話になる\n④現場ユーザーと経営層のニーズの違いは、隠すのではなく調整会議でテーブルに出す',
  },

  // ══════════════════════════════════════════════════════════════════════
  // 第3章: 基本設計
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'E17',
    chapterId: 3,
    slot: 'INTRO',
    title: '設計フェーズ開始',
    body: '要件定義が完了し、基本設計に入る。',
    choices: [],
    reviewNote: 'requirementsPrioritized=trueなら優先度が明確なため+5ボーナス。clientExpectationRisk=trueなら「顧客担当が変わって認識がズレているかもしれない」という田中PMからの連絡が入る。',
  },
  {
    id: 'E18',
    chapterId: 3,
    slot: 'MISSION_A',
    title: '画面設計レビュー',
    body: '作成した画面設計書を佐藤先輩にレビューしてもらった。30件の指摘が返ってきた。',
    choices: [
      {
        id: 'E18-A',
        text: '指摘を分類し、重要度の高いものだけ議論してから修正する',
        effect: {
          scoreDelta: 15,
          metricDeltas: { quality: 8, trust: 5 },
          npcTrustDeltas: { satou: 1 },
          explanation: 'レビュー指摘は全て受け入れるのでなく、優先度を付けて議論することが大切。「なぜその指摘か」を理解することが成長につながります。',
        },
      },
      {
        id: 'E18-B',
        text: '全指摘を受け入れてとにかく全部直す',
        effect: {
          scoreDelta: 5,
          metricDeltas: { quality: 5, schedule: -3 },
          npcTrustDeltas: { satou: 1 },
          explanation: '誠実な対応ですが、時間がかかる上に「なぜ修正するか」を考えないと同じ指摘が繰り返されます。',
        },
      },
      {
        id: 'E18-C',
        text: '表面だけ直して「修正完了」と報告する',
        effect: {
          scoreDelta: -10,
          metricDeltas: { quality: -8, trust: -5 },
          npcTrustDeltas: { satou: -1 },
          explanation: '形式的な修正は経験豊富なレビュアーにはすぐ分かります。信頼を損ない、次のレビューでさらに詳細な確認が入るようになります。',
        },
      },
    ],
  },
  {
    id: 'E19',
    chapterId: 3,
    slot: 'MISSION_B',
    title: '外部システム連携仕様の確認',
    body: '外部APIとの連携が必要だが、先方から渡された仕様書が2年前のものだった。',
    choices: [
      {
        id: 'E19-A',
        text: '先方のAPIチームに最新仕様書を請求し、サンプルコードも確認する',
        effect: {
          scoreDelta: 15,
          metricDeltas: { quality: 8, technicalDebt: -5 },
          flagUpdates: { nonFunctionalChecked: true },
          explanation: '外部APIは最新仕様書が必須。古い仕様で設計すると第4章の実装時に大量の手戻りが発生します。',
        },
      },
      {
        id: 'E19-B',
        text: '古い仕様書を元に設計を進め、後で確認しようとする',
        effect: {
          scoreDelta: -5,
          metricDeltas: { schedule: -5, technicalDebt: 10 },
          flagUpdates: { legacySystemRisk: true },
          explanation: '「後で確認する」は往々にして実装直前まで先送りされます。外部連携の仕様は設計段階で確定させるのが鉄則です。',
        },
      },
      {
        id: 'E19-C',
        text: 'その外部連携を一旦スコープ外にするよう田中PMに相談する',
        effect: {
          scoreDelta: 5,
          metricDeltas: { schedule: 5 },
          npcTrustDeltas: { tanaka: 1 },
          explanation: 'リスクを早期にエスカレーションすること自体は正しい。スコープ外にする判断も有効な選択肢の一つです。',
        },
      },
    ],
  },
  {
    id: 'E20',
    chapterId: 3,
    slot: 'MISSION_C',
    title: '非機能要件の確認',
    body: '設計書に画面要件は揃ったが、性能・セキュリティ・可用性・拡張性に関する記述が一切ない。',
    choices: [
      {
        id: 'E20-A',
        text: '非機能要件チェックリストを使って全項目を確認し、顧客と合意する',
        effect: {
          scoreDelta: 15,
          metricDeltas: { quality: 10, compliance: 8 },
          flagUpdates: { nonFunctionalChecked: true },
          explanation: '非機能要件は「後から追加するのが最もコストが高い」要件。設計段階で確定させることが品質保証の基本です。',
        },
      },
      {
        id: 'E20-B',
        text: '「Web標準レベルで問題ない」と自己判断して進める',
        effect: {
          scoreDelta: -5,
          metricDeltas: { quality: -5, compliance: -5 },
          explanation: '「Web標準レベル」は曖昧な基準。第6章のリリース後に性能問題や障害が発生するリスクが高まります。',
        },
      },
      {
        id: 'E20-C',
        text: '非機能要件テンプレートを貼り付けて「後で確認する」と記載する',
        effect: {
          scoreDelta: 0,
          metricDeltas: { quality: -2 },
          explanation: 'テンプレートの貼り付けは出発点としては有効ですが、「後で確認する」が確認されないリスクを生みます。',
        },
      },
    ],
  },
  {
    id: 'E21',
    chapterId: 3,
    slot: 'SIDE',
    title: 'セキュリティ部門からの連絡',
    body: 'セキュリティ担当者から「認証フローと個人情報の取り扱いについて設計レビューをしたい」というメールが届いた。',
    choices: [
      {
        id: 'E21-A',
        text: '積極的に設計書を共有し、レビュー会を早急に設定する',
        effect: {
          scoreDelta: 10,
          metricDeltas: { compliance: 10, quality: 5 },
          flagUpdates: { securityReviewed: true },
          explanation: 'セキュリティレビューは義務ではなく「リスクを事前に潰す機会」です。第6章でのインシデントリスクを大幅に下げます。',
        },
      },
      {
        id: 'E21-B',
        text: '「後でレビューします」と返信して保留にする',
        effect: {
          scoreDelta: -5,
          metricDeltas: { compliance: -5 },
          explanation: 'セキュリティレビューの先送りは、後で本番リリース直前に指摘が来て全て作り直しという最悪のシナリオを招きます。',
        },
      },
      {
        id: 'E21-C',
        text: '自分でチェックして「問題なし」と回答する',
        effect: {
          scoreDelta: -10,
          metricDeltas: { compliance: -10 },
          explanation: 'セキュリティは専門家によるレビューが必須。自己チェックだけでは見落としが発生し、後で深刻な問題になる可能性があります。',
        },
      },
    ],
  },
  {
    id: 'E22',
    chapterId: 3,
    slot: 'RISK',
    title: '既存システムの謎',
    body: '旧システムの一部モジュールを流用するよう言われたが、そのモジュールの仕様を知っている人がプロジェクト内にいない。',
    choices: [
      {
        id: 'E22-A',
        text: 'コードを読んで仕様を解析し、分かったことを設計課題として記録する',
        effect: {
          scoreDelta: 10,
          metricDeltas: { quality: 5, learning: 8 },
          flagUpdates: { technicalDebtNoted: true },
          explanation: '既存コードの解析は時間がかかりますが、不明点を課題化して記録することで後の手戻りを防げます。',
        },
      },
      {
        id: 'E22-B',
        text: '「動いているから問題ない」として設計に組み込む',
        effect: {
          scoreDelta: -10,
          metricDeltas: { technicalDebt: 15, quality: -8 },
          explanation: '「動いている」は「仕様が明確」ではありません。第4章の実装時に想定外の動作で大きな手戻りが発生するリスクがあります。',
        },
      },
    ],
    condition: {
      requiredNpcTrust: { suzuki: 1 },
      fallbackEventId: 'E22-FALLBACK',
    },
  },
  {
    id: 'E22-FALLBACK',
    chapterId: 3,
    slot: 'RISK',
    title: '既存システムの謎（情報なし）',
    body: '旧モジュールの仕様を誰も知らない。鈴木さんとの関係も薄く、頼れる人がいない状態で調査するしかない。',
    choices: [
      {
        id: 'E22F-A',
        text: '時間をかけてコードを読んで調査し、課題管理票に記録する',
        effect: {
          scoreDelta: 8,
          metricDeltas: { schedule: -5, quality: 5, learning: 8 },
          flagUpdates: { technicalDebtNoted: true },
          explanation: '情報がない場合でも、自力で調査して記録する姿勢が後の信頼につながります。',
        },
      },
      {
        id: 'E22F-B',
        text: '「動いているから問題ない」として設計に組み込む',
        effect: {
          scoreDelta: -10,
          metricDeltas: { technicalDebt: 15, quality: -8 },
          explanation: '調査コストを省いた結果、第4章でより大きな手戻りコストが発生します。',
        },
      },
    ],
  },
  {
    id: 'E23',
    chapterId: 3,
    slot: 'JUDGE',
    title: 'TBD（未確定）項目の扱い方',
    body: '設計書に[TBD]が5箇所残っている。レビュー前に自分で判断して埋めるか、課題として管理するか？',
    choices: [
      {
        id: 'E23-A',
        text: '全件を課題管理票に起票し、担当者と確認期日を決めてから提出する',
        effect: {
          scoreDelta: 15,
          metricDeltas: { quality: 8, compliance: 5 },
          explanation: 'TBDは「未解決の問題」です。担当者と期日を決めることで「いつかやる」が「いつまでにやる」に変わります。',
        },
      },
      {
        id: 'E23-B',
        text: '自分の判断で全部埋めて提出する',
        effect: {
          scoreDelta: -5,
          metricDeltas: { quality: -5 },
          explanation: '独断で埋めた仮定が後で覆ると、第4章の実装が全て無駄になるリスクがあります。',
        },
      },
      {
        id: 'E23-C',
        text: 'TBDのまま提出して「後でやります」と言う',
        effect: {
          scoreDelta: -10,
          metricDeltas: { quality: -8, trust: -5 },
          npcTrustDeltas: { satou: -1 },
          explanation: 'TBDに期日と担当者がないと、レビュワーの不信感を生み、「いつまでも未決定」になります。',
        },
      },
    ],
  },
  {
    id: 'E24',
    chapterId: 3,
    slot: 'REVIEW',
    title: '3章振り返り',
    body: '基本設計フェーズが完了した。',
    choices: [],
    reviewNote: '【第3章のポイント】\n①設計レビューは「つらい」ではなく「後の手戻りを防ぐ投資」\n②非機能要件（性能・セキュリティ・可用性）は後から追加するのが最もコストが高い\n③[TBD]のままにするのは悪ではないが、「誰が・いつまでに」を決めることが必須\n④外部APIの仕様は設計段階で最新版を確定させる',
  },

  // ══════════════════════════════════════════════════════════════════════
  // 第4章: 製造
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'E25',
    chapterId: 4,
    slot: 'INTRO',
    title: '実装開始',
    body: '製造フェーズが始まった。設計書を元に実装を進める。',
    choices: [],
    reviewNote: 'scopeChangeLogged=falseの場合、石田さんから「Slackで言ったあの機能、どこに入ってる?」という連絡が来る。roleConfirmed=falseの場合、担当外の作業が次々と積み重なる状況が発生する。',
  },
  {
    id: 'E26',
    chapterId: 4,
    slot: 'MISSION_A',
    title: '影響範囲の調査',
    body: '新機能の実装が既存の共通部品に影響する可能性がある。どうするか？',
    choices: [
      {
        id: 'E26-A',
        text: '共通部品の全利用箇所を洗い出し、影響範囲を文書化する',
        effect: {
          scoreDelta: 15,
          metricDeltas: { quality: 8, technicalDebt: -5 },
          explanation: '影響範囲の文書化は手間ですが、後で「知らなかった」バグが出てから対応するより何倍も効率的です。',
        },
      },
      {
        id: 'E26-B',
        text: '変更箇所だけ確認して、影響は軽微と判断する',
        effect: {
          scoreDelta: -5,
          metricDeltas: { technicalDebt: 10 },
          explanation: '確認範囲が狭いと、第5章のテスト時に見落としたバグが大量発生するリスクがあります。',
        },
      },
      {
        id: 'E26-C',
        text: '鈴木さんに「この部品どこで使ってますか？」と聞く',
        effect: {
          scoreDelta: 10,
          metricDeltas: { quality: 5, learning: 5 },
          npcTrustDeltas: { suzuki: 1 },
          explanation: '知っている人に聞くことは最も効率的な調査手段。鈴木さんとの信頼関係を深める機会でもあります。',
        },
      },
    ],
  },
  {
    id: 'E27',
    chapterId: 4,
    slot: 'MISSION_B',
    title: '実装方針の選択',
    body: '既存のコードを根本から直す恒久対応と、最小限の変更で済む一時対応がある。どちらを選ぶか？',
    choices: [
      {
        id: 'E27-A',
        text: '恒久対応を選び、工数を正直に見積もって田中PMに相談する',
        effect: {
          scoreDelta: 10,
          metricDeltas: { quality: 8, technicalDebt: -10 },
          flagUpdates: { permanentFixChosen: true },
          npcTrustDeltas: { tanaka: 1 },
          explanation: '恒久対応は短期的なコストが高いですが、技術的負債の蓄積を防ぎます。工数を正直に伝えることで信頼関係が築けます。',
        },
      },
      {
        id: 'E27-B',
        text: '一時対応で乗り切り、技術的負債として記録する',
        effect: {
          scoreDelta: 5,
          metricDeltas: { schedule: 5, technicalDebt: 5 },
          flagUpdates: { technicalDebtNoted: true },
          explanation: '一時対応は悪ではありません。「一時対応であることを記録すること」が重要。記録があれば後任も対処できます。',
        },
      },
      {
        id: 'E27-C',
        text: '一時対応を選び、記録もしない',
        effect: {
          scoreDelta: -10,
          metricDeltas: { technicalDebt: 20, quality: -5 },
          explanation: '記録のない一時対応は「誰も知らない爆弾」として残ります。第6章の障害リスクが大幅に増大します。',
        },
      },
    ],
  },
  {
    id: 'E28',
    chapterId: 4,
    slot: 'MISSION_C',
    title: 'コードレビュー依頼',
    body: '実装が完了した。レビュー依頼のやり方は？',
    choices: [
      {
        id: 'E28-A',
        text: 'PRを機能単位で小さく分けて、変更の意図をコメントで丁寧に説明する',
        effect: {
          scoreDelta: 15,
          metricDeltas: { quality: 10, trust: 5 },
          flagUpdates: { reviewCompleted: true },
          npcTrustDeltas: { satou: 1 },
          explanation: '小さなPRは「レビューしやすく」「バグが見つかりやすく」「マージリスクが小さい」の三拍子揃った最善策です。',
        },
      },
      {
        id: 'E28-B',
        text: '一気にまとめて大きなPRを出す（1000行以上）',
        effect: {
          scoreDelta: -5,
          metricDeltas: { schedule: -5, quality: -3 },
          explanation: '大きなPRはレビュアーの負荷が高く、レビュー遅延や見落としが発生します。佐藤先輩が「後回し」にするリスクがあります。',
        },
      },
      {
        id: 'E28-C',
        text: 'セルフレビューだけして完了扱いにする',
        effect: {
          scoreDelta: -10,
          metricDeltas: { quality: -10 },
          explanation: '自分のコードの問題は自分では気づきにくい。コードレビューは品質担保の最後の砦です。',
        },
      },
    ],
  },
  {
    id: 'E29',
    chapterId: 4,
    slot: 'SIDE',
    title: 'レビュアーが不在',
    body: '佐藤先輩に「今週中にレビューしてもらえますか？」と頼んだら、「別案件で手一杯で今週は無理」と断られた。',
    choices: [
      {
        id: 'E29-A',
        text: '田中PMに「レビュアーが確保できていない」とリスクを報告する',
        effect: {
          scoreDelta: 10,
          metricDeltas: { trust: 5 },
          npcTrustDeltas: { tanaka: 1 },
          explanation: 'レビュアー不在をリスクとして早期報告することで、PMが調整できる。隠すより報告することで信頼が上がります。',
        },
      },
      {
        id: 'E29-B',
        text: '鈴木さんにレビューを頼む',
        effect: {
          scoreDelta: 5,
          metricDeltas: { quality: 3 },
          npcTrustDeltas: { suzuki: 1 },
          explanation: '代替レビュアーを自分で探す主体性は評価されます。鈴木さんとの関係も深まります。',
        },
      },
      {
        id: 'E29-C',
        text: 'レビューなしで次の工程に進む',
        effect: {
          scoreDelta: -15,
          metricDeltas: { quality: -10 },
          explanation: 'レビューなしで進むと後の工程でバグが増大します。ここで踏ん張ることが品質を守る最後のチャンスです。',
        },
      },
    ],
    condition: {
      blockedFlags: ['reviewCompleted'],
    },
  },
  {
    id: 'E30',
    chapterId: 4,
    slot: 'RISK',
    title: '共通部品変更の波及バグ',
    body: '実装した変更が、別機能のバグを引き起こしていることが発覚した。',
    choices: [
      {
        id: 'E30-A',
        text: '影響範囲を全件調査し直し、田中PMに正直に報告する',
        effect: {
          scoreDelta: 5,
          metricDeltas: { trust: 8, quality: 3 },
          npcTrustDeltas: { tanaka: 1 },
          explanation: '問題発覚後に正直に報告することは、信頼を維持する最も重要な行動です。隠蔽は後で発覚したときのダメージが何倍にもなります。',
        },
      },
      {
        id: 'E30-B',
        text: '自分で直せる範囲だけ直して、他は黙っておく',
        effect: {
          scoreDelta: -15,
          metricDeltas: { trust: -10, quality: -8 },
          explanation: '部分修正で隠蔽した場合、第6章のリリース後に全体的な障害として表面化します。隠蔽のコストは正直報告の何倍もかかります。',
        },
      },
      {
        id: 'E30-C',
        text: '「テストで見つかるから大丈夫」と判断して先に進む',
        effect: {
          scoreDelta: -10,
          metricDeltas: { quality: -8 },
          explanation: 'テストで見つかれば良いですが、テストを省略する選択が後で来たとき（E39）に、このバグが素通りするリスクがあります。',
        },
      },
    ],
    condition: {
      blockedFlags: ['reviewCompleted'],
    },
  },
  {
    id: 'E31',
    chapterId: 4,
    slot: 'JUDGE',
    title: '進捗報告の正直さ',
    body: '田中PMに「進捗どう？」と聞かれた。正直に言うと遅延が発覚する。',
    choices: [
      {
        id: 'E31-A',
        text: '「現在70%ですが、○○が原因で納期リスクがあります」と正直に報告する',
        effect: {
          scoreDelta: 15,
          metricDeltas: { trust: 10 },
          npcTrustDeltas: { tanaka: 2 },
          explanation: '遅延の早期報告は評価されます。「問題がある」と早く言うほど、対策の選択肢が増えます。隠すほど後の対処が難しくなります。',
        },
      },
      {
        id: 'E31-B',
        text: '「順調です（実際は遅れているが90%と言ってしまう）」',
        effect: {
          scoreDelta: -15,
          metricDeltas: { trust: -10, schedule: -10 },
          npcTrustDeltas: { tanaka: -1 },
          explanation: '嘘の進捗報告は必ずバレます。バレた時の信頼失墜は取り返しがつかないレベルになります。',
        },
      },
      {
        id: 'E31-C',
        text: '「ちょっと遅れています」だけ言う',
        effect: {
          scoreDelta: 3,
          metricDeltas: { trust: 3 },
          explanation: '遅延を報告したことは良いですが、原因と対策がないと「で、どうするの？」と聞かれるだけです。',
        },
      },
    ],
  },
  {
    id: 'E32',
    chapterId: 4,
    slot: 'REVIEW',
    title: '4章振り返り',
    body: '製造フェーズが完了した。',
    choices: [],
    reviewNote: '【第4章のポイント】\n①コードレビューは品質チェックだけでなく「チームとしての共有知識を作る場」\n②技術的負債は「生む罪」ではなく「記録しない罪」\n③進捗の正直な報告は信頼の積み立て。遅延を隠すほど後のコストが増える\n④影響範囲の調査を省くと後の工程でより大きなコストになって返ってくる',
  },

  // ══════════════════════════════════════════════════════════════════════
  // 第5章: テスト
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'E33',
    chapterId: 5,
    slot: 'INTRO',
    title: 'テストフェーズ開始',
    body: 'テストフェーズが始まった。',
    choices: [],
    reviewNote: 'reviewCompleted=trueなら既知バグが少ない状態でスタート(+5ボーナス)。reviewCompleted=falseなら最初から複数のバグがある状態でテストに入る。',
  },
  {
    id: 'E34',
    chapterId: 5,
    slot: 'MISSION_A',
    title: 'テスト仕様書の作成',
    body: 'テスト仕様書を誰が・どの粒度で・どう管理するか決める場面。',
    choices: [
      {
        id: 'E34-A',
        text: '要件とのトレーサビリティを確認しながら全件網羅で仕様書を作成する',
        effect: {
          scoreDelta: 15,
          metricDeltas: { quality: 8, compliance: 5 },
          explanation: 'トレーサビリティ（要件とテスト項目の対応関係）を確認することで、テスト漏れを防ぎ、品質を証明できます。',
        },
      },
      {
        id: 'E34-B',
        text: '主要な正常系を中心に効率よく作成する',
        effect: {
          scoreDelta: 5,
          metricDeltas: { quality: 3, schedule: 3 },
          explanation: '効率的ですが、カバレッジが下がります。第6章でカバーしていなかった部分がバグとして出やすくなります。',
        },
      },
      {
        id: 'E34-C',
        text: '前回プロジェクトのテスト仕様書を流用する',
        effect: {
          scoreDelta: -5,
          metricDeltas: { quality: -5 },
          explanation: '流用は出発点としては使えますが、今回の要件に合わせた見直しなしの流用は「今回のテストをしていない」のと同義です。',
        },
      },
    ],
  },
  {
    id: 'E35',
    chapterId: 5,
    slot: 'MISSION_B',
    title: '異常系テスト',
    body: '正常系テストは完了した。異常系（エラーケース・境界値）をどこまでやるか？',
    choices: [
      {
        id: 'E35-A',
        text: '境界値・エラー入力・権限外アクセス・大量データ投入まで全件実施する',
        effect: {
          scoreDelta: 15,
          metricDeltas: { quality: 10, compliance: 5 },
          flagUpdates: { edgeCaseTested: true },
          explanation: '異常系テストは「ユーザーが予期しない使い方をしたとき」を検証します。第6章での本番障害リスクを大幅に下げます。',
        },
      },
      {
        id: 'E35-B',
        text: '主要な異常系だけ実施して完了とする',
        effect: {
          scoreDelta: 5,
          metricDeltas: { quality: 3 },
          explanation: '部分的な異常系テストでも実施したことは評価されます。ただしカバーしていない部分が本番での問題になる可能性があります。',
        },
      },
      {
        id: 'E35-C',
        text: '正常系でOKだったから異常系は省略する',
        effect: {
          scoreDelta: -15,
          metricDeltas: { quality: -10 },
          flagUpdates: { testSkipped: true },
          explanation: '異常系テストを省略した事故は現実に多数あります。「動いた」と「安全」は別の概念です。',
        },
      },
    ],
  },
  {
    id: 'E36',
    chapterId: 5,
    slot: 'MISSION_C',
    title: 'エビデンスの管理',
    body: 'テスト結果をどう記録するか？',
    choices: [
      {
        id: 'E36-A',
        text: 'テスト項目ごとにスクリーンショット+実行日時+担当者を記録する',
        effect: {
          scoreDelta: 15,
          metricDeltas: { quality: 8, compliance: 8 },
          flagUpdates: { evidenceRecorded: true },
          explanation: 'エビデンスは「自分の身を守る武器」です。後で「本当にテストしたか？」と問われたとき、証明できなければテストしていないのと同じです。',
        },
      },
      {
        id: 'E36-B',
        text: 'バグだけ記録して、正常なものは確認済みチェックだけつける',
        effect: {
          scoreDelta: 5,
          metricDeltas: { quality: 3 },
          explanation: '最低限の記録ですが、「誰が・いつ・何を確認したか」が分からない状態です。',
        },
      },
      {
        id: 'E36-C',
        text: '記憶の中で管理する（ドキュメントなし）',
        effect: {
          scoreDelta: -15,
          metricDeltas: { quality: -10, compliance: -10 },
          explanation: '記憶は証拠になりません。第6章で障害が発生したとき「テストした証明」ができない状態は非常に不利です。',
        },
      },
    ],
  },
  {
    id: 'E37',
    chapterId: 5,
    slot: 'SIDE',
    title: 'バグ票 vs 口頭報告',
    body: '軽微なバグを発見した。担当エンジニアが隣のデスクにいる。口頭で伝えれば今すぐ直してくれる。',
    choices: [
      {
        id: 'E37-A',
        text: '軽微でもバグ票に正式起票する',
        effect: {
          scoreDelta: 10,
          metricDeltas: { quality: 5, compliance: 5 },
          explanation: 'バグ票の記録は「個人の記憶」ではなく「チームの記録」になります。傾向分析・再発防止・品質報告書の作成に欠かせません。',
        },
      },
      {
        id: 'E37-B',
        text: '口頭で伝えて、直ったら終わりにする',
        effect: {
          scoreDelta: 0,
          explanation: '即時解決できますが、同じバグが再発しても「以前にも発生した」記録がなく、原因分析ができません。',
        },
      },
      {
        id: 'E37-C',
        text: '重要でないと判断して無視する',
        effect: {
          scoreDelta: -10,
          metricDeltas: { quality: -8 },
          explanation: '軽微に見えるバグが本番環境で致命的な問題になる事例は多数あります。全てのバグは記録する習慣が品質を守ります。',
        },
      },
    ],
  },
  {
    id: 'E38',
    chapterId: 5,
    slot: 'RISK',
    title: '本番環境との差異',
    body: 'テスト環境では全てパスしたが、鈴木さんが「本番のミドルウェアバージョンが違うんだよね」と言ってきた。',
    choices: [
      {
        id: 'E38-A',
        text: '本番相当環境を準備して再テストする',
        effect: {
          scoreDelta: 15,
          metricDeltas: { quality: 10 },
          explanation: '本番相当環境でのテストは工数がかかりますが、本番リリース後の障害を防ぐ最も確実な方法です。',
        },
      },
      {
        id: 'E38-B',
        text: 'リスクを定量化して田中PMに報告し、判断を仰ぐ',
        effect: {
          scoreDelta: 10,
          metricDeltas: { trust: 5 },
          npcTrustDeltas: { tanaka: 1 },
          explanation: '自分で判断できない場合はリスクを明確にしてエスカレーションすることが正解。PMが判断できる情報を提供するのがSEの役割。',
        },
      },
      {
        id: 'E38-C',
        text: '「テスト環境でOKだったからいい」として進む',
        effect: {
          scoreDelta: -15,
          metricDeltas: { quality: -10 },
          explanation: '「テスト環境でOKだった」は「本番でも動く」の証明にはなりません。環境差異の確認を怠ったリスクが第6章で顕在化します。',
        },
      },
    ],
  },
  {
    id: 'E39',
    chapterId: 5,
    slot: 'JUDGE',
    title: '納期 vs 品質の判断',
    body: 'テスト消化率が80%で納期が3日後に迫っている。残りの20%をどうするか？',
    choices: [
      {
        id: 'E39-A',
        text: '未テスト分のリスクを定量化して田中PMに報告し、納期延期を提案する',
        effect: {
          scoreDelta: 10,
          metricDeltas: { trust: 5, compliance: 5 },
          npcTrustDeltas: { tanaka: 1 },
          explanation: '「テストが終わっていないリスク」を可視化して判断を仰ぐことが、プロとしての正しい行動です。',
        },
      },
      {
        id: 'E39-B',
        text: 'リスクの高い未テスト項目を優先して消化し、残りは割り切る',
        effect: {
          scoreDelta: 5,
          metricDeltas: { schedule: 3 },
          explanation: '優先度を付けたリスク管理は現実的な判断。ただし「割り切った部分」を記録しておくことが重要です。',
        },
      },
      {
        id: 'E39-C',
        text: '全部テストしたことにして納期を守る',
        effect: {
          scoreDelta: -20,
          metricDeltas: { quality: -15, compliance: -15 },
          flagUpdates: { testSkipped: true },
          explanation: 'テストした記録の虚偽は、後で障害が発生したとき全ての責任を負う可能性があります。第6章で深刻な障害として返ってきます。',
        },
      },
    ],
  },
  {
    id: 'E40',
    chapterId: 5,
    slot: 'REVIEW',
    title: '5章振り返り',
    body: 'テストフェーズが完了した。',
    choices: [],
    reviewNote: '【第5章のポイント】\n①テストは「バグを見つける作業」ではなく「品質を証明する作業」\n②エビデンスは「自分の身を守る武器」でもある\n③「テスト環境でOKだった」は言い訳にならない。環境差異の確認も品質管理の一部\n④納期プレッシャーに押されてテストを省略することは、後でより大きなコストになる',
  },

  // ══════════════════════════════════════════════════════════════════════
  // 第6章: リリース・障害対応
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'E41',
    chapterId: 6,
    slot: 'INTRO',
    title: 'リリース直前の状況',
    body: 'いよいよリリース日が近づいた。チームの状態は前の章での選択によって大きく異なる。',
    choices: [],
    reviewNote: 'testSkipped=trueなら「リリース直後にエラー通知が来ている」状態からスタート。nonFunctionalChecked=falseなら「レスポンスが30秒かかっています」という報告。全フラグ良好なら「スムーズな最終確認会議」から始まる。',
  },
  {
    id: 'E42',
    chapterId: 6,
    slot: 'MISSION_A',
    title: 'リリース手順の確認',
    body: 'リリース作業の前に手順書を確認する時間がある。どう使うか？',
    choices: [
      {
        id: 'E42-A',
        text: '手順書を熟読し、不明点を事前に鈴木さんに確認して本番に備える',
        effect: {
          scoreDelta: 15,
          metricDeltas: { quality: 8, trust: 5 },
          npcTrustDeltas: { suzuki: 1 },
          explanation: 'リリース作業は「手順書通りに進める」が原則。不明点の事前確認で「その場での判断」を最小化できます。',
        },
      },
      {
        id: 'E42-B',
        text: '手順書を流し読みして本番に臨む',
        effect: {
          scoreDelta: 3,
          explanation: '最低限の確認はしていますが、手順外のエラーが出たときの対処が難しくなります。',
        },
      },
      {
        id: 'E42-C',
        text: '「なんとかなる」でぶっつけ本番',
        effect: {
          scoreDelta: -15,
          metricDeltas: { quality: -8, trust: -5 },
          explanation: 'リリース作業での「なんとかなる」は最も危険な判断。ぶっつけ本番でのトラブルは対応が遅れ、障害時間が長くなります。',
        },
      },
    ],
  },
  {
    id: 'E43',
    chapterId: 6,
    slot: 'MISSION_B',
    title: '本番反映・手順外エラー',
    body: 'リリース作業中に手順書にないエラーが発生した。',
    choices: [
      {
        id: 'E43-A',
        text: 'エラーを記録・影響確認・田中PMに即報告してから対処する',
        effect: {
          scoreDelta: 10,
          metricDeltas: { trust: 8, quality: 3 },
          npcTrustDeltas: { tanaka: 1 },
          explanation: 'エラー発生時の第一原則は「記録して報告」。一人で抱え込まずにチームで対処することが障害対応の基本です。',
        },
      },
      {
        id: 'E43-B',
        text: '鈴木さんに「このエラー分かりますか？」と連絡する',
        effect: {
          scoreDelta: 10,
          metricDeltas: { quality: 5 },
          npcTrustDeltas: { suzuki: 1 },
          explanation: '経験豊富な人に頼ることは正しい判断。鈴木さんとの信頼関係が高いほど、より詳しい情報を得られます。',
        },
      },
      {
        id: 'E43-C',
        text: '一人で対処しようとして30分使う',
        effect: {
          scoreDelta: -10,
          metricDeltas: { schedule: -10, trust: -5 },
          explanation: 'リリース作業での独断対処は時間ロスと判断ミスのリスクが高い。チームで動くことが鉄則です。',
        },
      },
    ],
  },
  {
    id: 'E44',
    chapterId: 6,
    slot: 'MISSION_C',
    title: '障害一次対応',
    body: 'リリース後に障害が発生した。最初の5分でどう動くか？',
    choices: [
      {
        id: 'E44-A',
        text: '第一報を5分以内に田中PMと顧客へ。同時に影響範囲の調査を開始する',
        effect: {
          scoreDelta: 15,
          metricDeltas: { trust: 10, clientSatisfaction: 5 },
          npcTrustDeltas: { tanaka: 2 },
          explanation: '障害時の第一報は「原因が分からなくても出す」。「現在調査中」を5分以内に伝えることが最優先です。顧客は「連絡がない」ことが最も不安です。',
        },
      },
      {
        id: 'E44-B',
        text: '原因を特定してから報告しようとする（30分かかる）',
        effect: {
          scoreDelta: -5,
          metricDeltas: { clientSatisfaction: -10 },
          explanation: '原因を特定してから報告する姿勢は理解できますが、顧客は30分間、何も情報がない不安な状態に置かれます。',
        },
      },
      {
        id: 'E44-C',
        text: 'しばらく様子を見る',
        effect: {
          scoreDelta: -20,
          metricDeltas: { trust: -15, clientSatisfaction: -20 },
          npcTrustDeltas: { tanaka: -1, satou: -1, suzuki: -1, ishida: -1 },
          explanation: '様子見は障害対応で最も避けるべき行動。問題が拡大し、信頼が完全に失墜します。',
        },
      },
    ],
  },
  {
    id: 'E45',
    chapterId: 6,
    slot: 'SIDE',
    title: '顧客報告書の作成',
    body: '障害の原因と対応を顧客に報告する文書を作成する場面。',
    choices: [
      {
        id: 'E45-A',
        text: '事実・影響範囲・暫定対応・恒久対応・再発防止策を全て明記した報告書を作成する',
        effect: {
          scoreDelta: 15,
          metricDeltas: { trust: 8, clientSatisfaction: 8, compliance: 5 },
          npcTrustDeltas: { ishida: 1 },
          explanation: '障害報告書の5点セット（事実・影響・暫定対応・恒久対応・再発防止）は、顧客の不安を解消し、信頼を回復する最も効果的な手段です。',
        },
      },
      {
        id: 'E45-B',
        text: '「○○のため障害が発生しました。現在対応中です」だけ送る',
        effect: {
          scoreDelta: 3,
          metricDeltas: { clientSatisfaction: -3 },
          explanation: '第一報としては許容できますが、「いつ直るのか」「同じことが再発しないか」という顧客の疑問に答えられていません。',
        },
      },
      {
        id: 'E45-C',
        text: '口頭で謝罪して、報告書は作らない',
        effect: {
          scoreDelta: -10,
          metricDeltas: { trust: -8, compliance: -10 },
          explanation: '口頭の謝罪は記録になりません。後で「どんな対応をしたか」を問われたとき、証明できなくなります。',
        },
      },
    ],
  },
  {
    id: 'E46',
    chapterId: 6,
    slot: 'RISK',
    title: '継続 vs 切り戻しの判断',
    body: '障害の影響範囲が判明した。リリースを継続するか、システムを切り戻すか判断しなければならない。',
    choices: [
      {
        id: 'E46-A',
        text: '影響が大きい場合：即座に切り戻しを実施して損害を最小化する',
        effect: {
          scoreDelta: 15,
          metricDeltas: { clientSatisfaction: 8, trust: 5 },
          explanation: '切り戻しは「失敗」ではなく「被害を最小化する正しい判断」です。ユーザーへの影響を最小化することが最優先。',
        },
      },
      {
        id: 'E46-B',
        text: '影響が小さい場合：暫定対応で継続し、翌日に恒久対応すると宣言する',
        effect: {
          scoreDelta: 10,
          metricDeltas: { schedule: 3, clientSatisfaction: 3 },
          explanation: '影響範囲を正確に評価した上での継続判断は適切です。「翌日に恒久対応」という約束と記録が重要。',
        },
      },
      {
        id: 'E46-C',
        text: '「様子を見よう」と放置する',
        effect: {
          scoreDelta: -20,
          metricDeltas: { clientSatisfaction: -15, trust: -15 },
          explanation: '障害中の放置は最悪の選択。状況が悪化するほど対応コストが増大し、顧客の信頼は地に落ちます。',
        },
      },
    ],
  },
  {
    id: 'E47',
    chapterId: 6,
    slot: 'JUDGE',
    title: '障害原因の正直な報告',
    body: '原因調査の結果、第5章でテストを省略したことが直接の原因だと分かった。',
    choices: [
      {
        id: 'E47-A',
        text: '事実と経緯を正直に報告し、再発防止策にテスト省略の経緯も含める',
        effect: {
          scoreDelta: 15,
          metricDeltas: { trust: 10, compliance: 8 },
          npcTrustDeltas: { tanaka: 1 },
          explanation: '不都合な事実を正直に報告することは、長期的な信頼構築の基盤です。再発防止策に根本原因を含めることで、組織の学習につながります。',
        },
      },
      {
        id: 'E47-B',
        text: '「環境差異が主な原因」と別の要因を前面に出して報告する',
        effect: {
          scoreDelta: -20,
          metricDeltas: { trust: -15, compliance: -15 },
          explanation: '虚偽の原因報告は後で必ずバレます。バレた時点で全ての信頼が失われ、職業的な評判に長期的なダメージを与えます。',
        },
      },
      {
        id: 'E47-C',
        text: '「調査中」のまま具体的な原因の報告を濁す',
        effect: {
          scoreDelta: -10,
          metricDeltas: { clientSatisfaction: -8, trust: -5 },
          explanation: '原因不明のまま放置すると「再発するのでは？」という不安が顧客に残り続けます。',
        },
      },
    ],
  },
  {
    id: 'E48',
    chapterId: 6,
    slot: 'REVIEW',
    title: '6章振り返り',
    body: 'リリース・障害対応フェーズが完了した。',
    choices: [],
    reviewNote: '【第6章のポイント】\n①障害時の第一報は「原因が分からなくても出す」。5分以内に「調査中」を伝えることが最優先\n②切り戻しは「失敗」ではなく「被害を最小化する正しい判断」\n③障害報告書は責任追及のためではなく、組織の学習のためにある\n④不都合な事実を正直に報告することが、長期的な信頼の基盤になる',
  },

  // ══════════════════════════════════════════════════════════════════════
  // 第7章: 振り返り・エンディング
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'E49',
    chapterId: 7,
    slot: 'INTRO',
    title: '総括会議の開幕',
    body: 'プロジェクトが完了した。振り返り会議が始まる。会議室の雰囲気は、7章分の選択の積み重ねを反映している。',
    choices: [],
    reviewNote: 'スコア・フラグ・NPC信頼度の組み合わせによって、会議室の雰囲気が「和やか」「中立」「ぴりっとした」の3パターンで描写される。',
  },
  {
    id: 'E50',
    chapterId: 7,
    slot: 'MISSION_A',
    title: 'KPT振り返り',
    body: 'チームでKPT（Keep/Problem/Try）を実施する。あなたは何を出すか？',
    choices: [
      {
        id: 'E50-A',
        text: '自分の行動を正直に振り返り、Problemも率直に出す',
        effect: {
          scoreDelta: 15,
          metricDeltas: { trust: 8, learning: 10 },
          explanation: 'KPTは「評価」ではなく「学習の場」です。Problemを率直に出せる人がいるチームは、次のプロジェクトで大きく成長します。',
        },
      },
      {
        id: 'E50-B',
        text: 'Keepだけ多く出して、Problemは軽く触れる程度にする',
        effect: {
          scoreDelta: 0,
          metricDeltas: { learning: 3 },
          explanation: 'Problemを出さないKPTは形式的なものになり、本質的な改善につながりません。',
        },
      },
      {
        id: 'E50-C',
        text: '沈黙して他の人の発言を待つ',
        effect: {
          scoreDelta: -5,
          metricDeltas: { teamMorale: -5 },
          explanation: '振り返りの場での沈黙は「貢献していない」と見られます。自分の意見を持って参加することがチームへの貢献です。',
        },
      },
    ],
  },
  {
    id: 'E51',
    chapterId: 7,
    slot: 'MISSION_B',
    title: '顧客評価の受け取り',
    body: '石田さんから顧客評価レポートが届いた。内容は、これまでの選択の積み重ねを反映している。',
    choices: [
      {
        id: 'E51-A',
        text: '評価を真摯に受け取り、良かった点と改善点を整理する',
        effect: {
          scoreDelta: 10,
          metricDeltas: { learning: 8, clientSatisfaction: 3 },
          npcTrustDeltas: { ishida: 1 },
          explanation: '顧客評価は次のプロジェクトに活かすための最重要フィードバック。良い評価も悪い評価も、真摯に受け取ることが成長の鍵です。',
        },
      },
      {
        id: 'E51-B',
        text: '良い評価の部分だけ上司に共有する',
        effect: {
          scoreDelta: 0,
          explanation: '悪い評価を共有しないと、同じ問題が次のプロジェクトで繰り返されます。',
        },
      },
    ],
  },
  {
    id: 'E52',
    chapterId: 7,
    slot: 'MISSION_C',
    title: 'ナレッジ化・引き継ぎ',
    body: '今回学んだことや発見した技術的課題を、次の担当者にどう引き継ぐか？',
    choices: [
      {
        id: 'E52-A',
        text: '技術的負債・注意点・暗黙知をドキュメント化してリポジトリに残す',
        effect: {
          scoreDelta: 10,
          metricDeltas: { quality: 8, learning: 8 },
          explanation: 'ナレッジの文書化は「今のプロジェクト」だけでなく「組織全体の資産」になります。次の人が同じ問題で詰まらないようにする思いやりです。',
        },
      },
      {
        id: 'E52-B',
        text: '口頭で次の担当者に説明する',
        effect: {
          scoreDelta: 3,
          metricDeltas: { learning: 3 },
          explanation: '口頭伝達は即時性がありますが、記録に残らないため、次の人が変わったときに知識が失われます。',
        },
      },
      {
        id: 'E52-C',
        text: '「次の人が何とかするだろう」と放置する',
        effect: {
          scoreDelta: -10,
          metricDeltas: { teamMorale: -5, technicalDebt: 10 },
          explanation: '引き継ぎを放置することは次の担当者への負債を増やします。「自分が経験したことを後の人に活かしてもらう」がプロの姿勢です。',
        },
      },
    ],
  },
  {
    id: 'E53',
    chapterId: 7,
    slot: 'SIDE',
    title: 'NPCからの個別フィードバック',
    body: 'プロジェクトを共にした人たちから、個別のフィードバックが届いた。',
    choices: [
      {
        id: 'E53-A',
        text: 'フィードバックを次のプロジェクトへの行動計画に落とし込む',
        effect: {
          scoreDelta: 10,
          metricDeltas: { learning: 10 },
          explanation: 'フィードバックを「聞く」だけでなく「行動に変える」人が成長します。具体的なアクションに落とし込むことが重要です。',
        },
      },
      {
        id: 'E53-B',
        text: 'フィードバックを受け取り、参考にする',
        effect: {
          scoreDelta: 5,
          metricDeltas: { learning: 5 },
          explanation: '受け取ること自体は良いですが、行動に変えなければ成長にはなりません。',
        },
      },
    ],
    condition: {
      requiredNpcTrust: { tanaka: 1 },
    },
  },
  {
    id: 'E54',
    chapterId: 7,
    slot: 'RISK',
    title: '未解決フラグの精算',
    body: 'プロジェクトの最終報告の場で、これまでの選択の結果が明らかになる瞬間が来た。',
    choices: [
      {
        id: 'E54-A',
        text: '課題を全て受け止め、次プロジェクトへの改善事項として具体化する',
        effect: {
          scoreDelta: 10,
          metricDeltas: { learning: 10, trust: 5 },
          explanation: '課題と向き合い、改善につなげることが「経験から学ぶ」ということ。プロフェッショナルとして最も重要な姿勢です。',
        },
      },
      {
        id: 'E54-B',
        text: '外部要因や他のメンバーの問題として説明しようとする',
        effect: {
          scoreDelta: -10,
          metricDeltas: { trust: -10 },
          explanation: '責任を外に向けることは短期的に楽ですが、長期的な信頼と成長の機会を失います。',
        },
      },
    ],
  },
  {
    id: 'E55',
    chapterId: 7,
    slot: 'JUDGE',
    title: '次案件への方向性',
    body: '「次のプロジェクトでは何を伸ばしたいですか？」という質問。この答えがエンディングの重み付けに影響する。',
    choices: [
      {
        id: 'E55-A',
        text: '技術力をさらに深めたい（設計・コード品質・アーキテクチャ）',
        effect: {
          scoreDelta: 5,
          metricDeltas: { learning: 8 },
          nextEventHint: 'technical_specialistエンディングの重みが増す',
          explanation: '技術の深化はSEとしての専門性を高め、複雑な問題を解決できる力になります。',
        },
      },
      {
        id: 'E55-B',
        text: 'チームマネジメントやPM的な動きをやってみたい',
        effect: {
          scoreDelta: 5,
          metricDeltas: { trust: 5 },
          nextEventHint: 'pm_candidateエンディングの重みが増す',
          explanation: 'PM志向は要件定義・合意形成・リスク管理のスキルをさらに磨く方向です。',
        },
      },
      {
        id: 'E55-C',
        text: '品質・テスト・セキュリティを極めたい',
        effect: {
          scoreDelta: 5,
          metricDeltas: { quality: 5 },
          nextEventHint: 'quality_guardianエンディングの重みが増す',
          explanation: '品質の専門家は現場で最も頼りにされる存在の一つです。「大丈夫」という言葉に説得力が生まれます。',
        },
      },
    ],
  },
  {
    id: 'E56',
    chapterId: 7,
    slot: 'REVIEW',
    title: 'エンディング',
    body: '7つの章を走り切った。あなたの選択の積み重ねが、あなたのSEとしての姿を形作った。',
    choices: [],
    reviewNote: '【プロジェクト全体を通じて】\n記録する・報告する・確認する。この3つが現場SEの基本動作。\n完璧なプロジェクトはない。大切なのは「問題に気づいて記録し、次に活かすこと」。\nあなたの今回の選択は、何を教えてくれましたか？',
  },
];
