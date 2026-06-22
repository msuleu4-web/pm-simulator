import type { ScenarioEvent } from './types';

// ── E01〜E56: 全56イベント定義 ────────────────────────────────────────────
// 第1章: E01-E08 / 第2章: E09-E16 / 第3章: E17-E24 / 第4章: E25-E32
// 第5章: E33-E40 / 第6章: E41-E48 / 第7章: E49-E56

export const SCENARIO_EVENTS: ScenarioEvent[] = [
  // ══════════════════════════════════════════════════════════════════════
  // 第1章: 配属・キックオフ
  // 登場人物:
  //   田中PM     … 自社側PM。「なんとかなる」が口癖。実態は何もなんとかしない。
  //   佐藤先輩   … 自社先輩SE。親切だが自分の仕事で手一杯。
  //   鈴木さん   … 三次請け担当。現場の生き字引。愚痴多めだが情報は正確。
  //   石田さん   … 顧客担当（ユーザー企業・係長）。現場の代弁者だが上には弱い。
  //   西村さん   … 自社営業。受注のために無茶な約束をした張本人。現場には滅多に来ない。
  //   山田さん   … 自社ベテランSE。この案件3年目。なぜか田中PMより詳しい。
  //   長谷川部長 … 顧客側の部長。要件を「当然含まれてますよね？」で毎回追加してくる。
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'E01',
    chapterId: 1,
    slot: 'INTRO',
    title: '客先常駐 1日目',
    body: '朝8時50分、入館証が届いていない。受付で15分待たされ、ようやく通してもらったフロアには知った顔が誰もいない。田中PMは「あ、ごめん今会議中、佐藤くんに聞いて」とSlackで一言だけ。\n\n佐藤先輩が気づいて来てくれた。「とりあえずここ座って。あと、この3冊読んどいて。午後に長谷川部長との顔合わせあるから」——バインダー3冊と名刺10枚が机に積まれた。\n\nWBSを開くと、自分の担当欄に「開発支援（詳細TBD）」とだけ書いてある。',
    choices: [],
    reviewNote: '【登場人物メモ】\n・田中PM：Slackで完結させたがる。会議が大好き。\n・佐藤先輩：親切だが自分の仕事で常に手一杯。頼りにしすぎると申し訳ない。\n・長谷川部長（顧客側）：午後に初対面。第一印象が後の関係を決める。\n・WBSの「TBD」は今日中に埋まらないことが多い。まず読むことに集中しよう。',
  },
  {
    id: 'E02',
    chapterId: 1,
    slot: 'MISSION_A',
    title: 'キックオフ会議——議事録担当は？',
    body: '午後2時、キックオフ会議が始まった。顧客側は長谷川部長、石田さん、他2名。自社側は田中PM、佐藤先輩、自分。\n\n長谷川部長が開口一番「でですね、今回のシステム、機能ABCDEに加えて、ダッシュボードも当然含まれますよね？」と言った。田中PMが一瞬固まったのを自分は見逃さなかった。\n\n議事録担当は誰も指定されていない。60分間、長谷川部長の要求が次々と出てくる。どう記録するか？',
    choices: [
      {
        id: 'E02-A',
        text: '発言者・決定事項・未決事項・アクション担当を分けてリアルタイムで記録する',
        effect: {
          scoreDelta: 10,
          metricDeltas: { quality: 5, learning: 5 },
          flagUpdates: { minutesDocumented: true },
          explanation: '発言者と決定/未決を分けることで「長谷川部長が要求したが合意はしていない」という事実が後から証明できます。今日の記録がそのまま第2章の証拠書類になります。',
        },
      },
      {
        id: 'E02-B',
        text: 'スマホで録音しながら、後でまとめることにする',
        effect: {
          scoreDelta: 3,
          metricDeltas: { schedule: -3 },
          flagUpdates: { minutesDocumented: false },
          explanation: '録音は補助手段として有効ですが、「その場で確認・合意する」という機会が失われます。後で文字起こしに2時間かかることも。',
        },
      },
      {
        id: 'E02-C',
        text: '田中PMか佐藤先輩がやるだろうと思い、自分は聞くことに集中する',
        effect: {
          scoreDelta: -5,
          metricDeltas: { trust: -5, quality: -5 },
          explanation: '会議後、田中PMも佐藤先輩も「自分がやると思った」と言い合って、誰も議事録を書いていないことが判明します。長谷川部長の「ダッシュボード発言」も記録ゼロになりました。',
        },
      },
    ],
  },
  {
    id: 'E03',
    chapterId: 1,
    slot: 'MISSION_B',
    title: '営業が何を約束したのか',
    body: '会議後、山田さん（ベテランSE、この案件3年目）がそっと声をかけてきた。\n\n「あのさ、提案書見た？西村さんが受注のときに客先に見せた資料」\n\n山田さんが見せてくれた提案書には、今日の会議で初めて出てきたはずの「ダッシュボード機能」が堂々と記載されていた。しかも「標準機能として提供」と書いてある。\n\n「田中さんはこれ知ってるんですか」と聞くと、山田さんは苦笑いした。「どうかな……西村さんが勝手に書いたっぽいんだよね。工数も相場の半分くらいで見積もってるし」\n\nこの事実、どう扱うか？',
    choices: [
      {
        id: 'E03-A',
        text: '田中PMに「提案書と今日の会議内容に齟齬があります。確認が必要では」と報告する',
        effect: {
          scoreDelta: 10,
          metricDeltas: { quality: 5, trust: 5 },
          npcTrustDeltas: { tanaka: 1 },
          flagUpdates: { ambiguityFlagged: true },
          explanation: '不都合な事実ほど早期にエスカレーションが正解。「知っていたのに黙っていた」は後で最悪の結果を招きます。田中PMは慌てますが、早く知れたことを感謝するはずです。',
        },
      },
      {
        id: 'E03-B',
        text: '山田さんに「自分は新人なので、先輩から田中PMに伝えてもらえますか」と頼む',
        effect: {
          scoreDelta: 3,
          metricDeltas: { learning: 2 },
          npcTrustDeltas: { satou: 1 },
          explanation: '山田さんに委ねること自体は選択肢ですが、「情報を得た人が動く」という現場のルールを覚えておきましょう。山田さんは動いてくれるかもしれませんが、確約はありません。',
        },
      },
      {
        id: 'E03-C',
        text: '自分は新人だし、余計なことは言わないでおく',
        effect: {
          scoreDelta: -8,
          metricDeltas: { trust: -5, quality: -5 },
          flagUpdates: { clientExpectationRisk: true },
          explanation: '第3章でダッシュボード機能の実装が始まったとき、工数オーバーが発覚します。「なぜ早く言わなかったのか」と責任を問われる可能性があります。',
        },
      },
    ],
  },
  {
    id: 'E04',
    chapterId: 1,
    slot: 'MISSION_C',
    title: '「開発支援」の正体',
    body: '翌日、田中PMから作業依頼が来た。内容を見て目を疑う。\n\n「①機能一覧のExcel作成　②顧客向け説明資料のPPT作成　③来週の定例会議の段取り　④鈴木さん（三次請け）への作業指示メモ作成　⑤テスト仕様書のテンプレ準備」\n\n自分の職種は「SE」のはずだが、これはほぼPM兼アシスタントの仕事だ。WBSの「開発支援（TBD）」が全部に展開されている。',
    choices: [
      {
        id: 'E04-A',
        text: '「自分の担当範囲をRACIで整理させてください。どれが本来の自分の役割ですか？」と田中PMに確認する',
        effect: {
          scoreDelta: 10,
          metricDeltas: { trust: 5, teamMorale: 5 },
          flagUpdates: { roleConfirmed: true },
          npcTrustDeltas: { tanaka: 1 },
          explanation: 'RACI（Responsible/Accountable/Consulted/Informed）で役割を明文化するのは正攻法。「何でもやります」は短期的に評価されますが、長期的にはオーバーロードで潰れます。新人のうちに担当範囲の交渉を覚えておくことが重要です。',
        },
      },
      {
        id: 'E04-B',
        text: '佐藤先輩に「これ全部自分がやるべきですか？」と相談する',
        effect: {
          scoreDelta: 5,
          metricDeltas: { learning: 5 },
          npcTrustDeltas: { satou: 1 },
          explanation: '佐藤先輩は「田中さんに直接聞いた方がいいよ、でも言い方はやんわりとね」とアドバイスしてくれます。公式な担当確認にはなりませんが、動き方のヒントをもらえます。',
        },
      },
      {
        id: 'E04-C',
        text: '「新人だし全部やります」と引き受ける',
        effect: {
          scoreDelta: -5,
          metricDeltas: { schedule: -5, teamMorale: -3 },
          explanation: '田中PMは「助かる！」と言いますが、翌週にはさらに5件の依頼が来ます。「何でもやる人」のレッテルが貼られると、本来の開発業務をする時間がなくなります。',
        },
      },
    ],
  },
  {
    id: 'E05',
    chapterId: 1,
    slot: 'SIDE',
    title: '鈴木さんの現場案内',
    body: '昼休み、鈴木さん（三次請け担当）がそっと声をかけてきた。「少し話しませんか、外で」\n\n自動販売機の前で、鈴木さんは小声で話し始めた。\n\n「あの引き継ぎドキュメント、見ましたか？ 3年前のやつ。…実は去年のメンバーが作ったドキュメントがどこにあるか誰も知らなくて、毎回ゼロから確認しなおしてるんです。私はもう慣れましたけど…」\n\n「それと、西村さんって方、提案書に色々書いてますよね。実は私、その提案書初めて見たとき驚いて。うちの作業量の見積もり、半分くらいしか計上されてないんです。でも言えなくて…」\n\n鈴木さんはコーヒーを一口飲んで遠い目をした。',
    choices: [
      {
        id: 'E05-A',
        text: '「教えてくれてありがとうございます。引き継ぎドキュメントの整備を提案できるか考えてみます」と応える',
        effect: {
          scoreDelta: 8,
          metricDeltas: { learning: 5, teamMorale: 5, trust: 3 },
          npcTrustDeltas: { suzuki: 1 },
          explanation: '鈴木さんが信頼してくれたから話してくれた内容です。「記録されていないナレッジ」はプロジェクトの最大リスクの一つ。ドキュメント整備の提案は第2章以降で評価されます。',
        },
      },
      {
        id: 'E05-B',
        text: '「大変でしたね」と相槌を打つだけで、特に動かない',
        effect: {
          scoreDelta: 0,
          explanation: '鈴木さんの信頼は得られますが、情報を活かせていない状態です。聞いた情報をどう扱うかが、現場での信頼を決めます。',
        },
      },
      {
        id: 'E05-C',
        text: '「それ、田中PMに伝えた方がいいのでは？」と促す',
        effect: {
          scoreDelta: 3,
          metricDeltas: { trust: 2 },
          explanation: '正論ですが、「言えなくて…」という鈴木さんの事情を無視した対応です。三次請けの立場から元請けのPMに直接言うのは難しい現実があります。まずあなたが間に立つことを提案すべきでした。',
        },
      },
    ],
  },
  {
    id: 'E06',
    chapterId: 1,
    slot: 'RISK',
    title: '長谷川部長の「当然ですよね」',
    body: '週末前の進捗確認ミーティング。長谷川部長が資料を見ながら口を開いた。\n\n「ところで、スマートフォン対応は当然含まれてますよね？ 今どきスマホ対応なしとか考えられないので」\n\n提案書にも要件一覧にも「スマートフォン対応」の記載はない。田中PMが「は、はい、もちろん……」と言いかけた。\n\nこのまま進むと見積もり工数が20〜30%増加する可能性がある。',
    choices: [
      {
        id: 'E06-A',
        text: '「確認させてください。スマートフォン対応は現在の要件一覧に含まれておらず、追加工数が発生する可能性があります。正式な変更として扱わせていただけますか」と割り込む',
        effect: {
          scoreDelta: 15,
          metricDeltas: { quality: 8, clientSatisfaction: 3 },
          flagUpdates: { ambiguityFlagged: true, scopeChangeLogged: true },
          npcTrustDeltas: { ishida: 1 },
          explanation: '長谷川部長は少し驚きますが、「正式に確認してくれる人」として信頼されます。スコープを守ることがプロジェクト全体を守ることです。田中PMも内心ホッとしています。',
        },
      },
      {
        id: 'E06-B',
        text: '田中PMが「はい」と言った後、こっそり田中PMに「あれって工数的に大丈夫ですか？」と聞く',
        effect: {
          scoreDelta: 3,
          metricDeltas: { schedule: -3 },
          explanation: '田中PMは「あー……なんとかしよう」と言います。この「なんとかしよう」が後でメンバー全員の残業につながります。',
        },
      },
      {
        id: 'E06-C',
        text: '新人なので黙って聞いている',
        effect: {
          scoreDelta: -8,
          metricDeltas: { schedule: -5, cost: -5 },
          flagUpdates: { clientExpectationRisk: true },
          explanation: 'スマートフォン対応が要件として確定してしまいました。後のフェーズで誰かが残業でカバーすることになります。「あのとき言えばよかった」と後悔する場面は第4章で来ます。',
        },
      },
    ],
  },
  {
    id: 'E07',
    chapterId: 1,
    slot: 'JUDGE',
    title: '議事録に残すべき「不都合な事実」',
    body: '議事録を書いていると、問題に気づいた。\n\n今日の会議で「ダッシュボード機能は次フェーズ検討」と田中PMが言ったが、提案書には「標準機能として提供」と書いてある。この矛盾をどう議事録に記録するか？\n\n西村さん（営業）から「議事録は顧客向けにシンプルに書いてね」とSlackが来ている。',
    choices: [
      {
        id: 'E07-A',
        text: '「ダッシュボード機能：提案書との齟齬を確認。次フェーズ検討として合意（要確認事項として田中PM・石田様に確認依頼）」と明記する',
        effect: {
          scoreDelta: 15,
          metricDeltas: { quality: 8, compliance: 5 },
          flagUpdates: { ambiguityFlagged: true },
          explanation: '議事録は「後でもめたときの証拠」です。西村さんの指示に従ってシンプルにすると、後で「あれは含まれていたはず」と顧客に言われたとき、反論できる証拠が消えます。',
        },
      },
      {
        id: 'E07-B',
        text: '西村さんの指示に従い、「ダッシュボード機能：次フェーズ検討」とだけ書く',
        effect: {
          scoreDelta: 0,
          metricDeltas: { quality: -3 },
          explanation: '事実として間違いではありませんが、提案書との矛盾が記録されないまま進みます。第3章で「提案書には書いてあった」と長谷川部長に言われたとき、誰も反論できません。',
        },
      },
      {
        id: 'E07-C',
        text: '矛盾が怖いので、その項目ごと省略する',
        effect: {
          scoreDelta: -10,
          metricDeltas: { quality: -8, compliance: -5 },
          explanation: '省略した事実は存在しなかったことになります。第2章のヒアリングで「当然含まれてますよね？」と長谷川部長に言われたとき、何も反論できない状態になります。',
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
    title: '1週間目を終えて',
    body: '金曜夜、山田さんが「今週どうだった？」と聞いてきた。\n\n「SIerってこんな感じなんですか」と聞くと、山田さんは少し考えてから言った。\n\n「……まあ、ここは割とまともな方だよ。ドキュメントがちゃんとあるプロジェクトって、実は珍しいんだ。議事録を書いてる人がいるだけで、このプロジェクトは上位20%に入る」\n\n佐藤先輩からもSlackが来た。「今週お疲れ様。来週から要件定義が本格始動。長谷川部長が『追加要件を整理してきます』って言ってたから、心の準備しといて（笑）」',
    choices: [],
    reviewNote: '【第1章のポイント】\n①「開発支援（TBD）」は放置すると全部あなたの仕事になる。役割確認はプロジェクト開始直後が最もやりやすい\n②営業の約束≠現場の工数見積もり。提案書と実態の乖離を早期発見することがリスク管理の第一歩\n③スコープ追加を「当然含まれてますよね？」で通そうとする顧客には、その場でやんわり記録に残す必要がある\n④三次請けの鈴木さんのような立場の人が持っている情報は、プロジェクト全体では得られないリアルな現場情報。大切にすること\n⑤議事録は「記録」ではなく「証拠」。不都合な事実ほど正確に残す',
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
