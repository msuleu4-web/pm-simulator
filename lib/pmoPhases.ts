import type { Phase } from './types';

// KPI文脈（PMOモード）:
//   quality    = 標準化レベル
//   cost       = PMO工数・キャパ
//   schedule   = 横断課題の進行状況
//   stakeholder= 現場信頼度
//   morale     = 経営層信頼度
//   pmMental   = ナレッジ蓄積

export const pmoPhases: Phase[] = [
  {
    id: 'pmo-startup',
    label: 'PMO立ち上げ',
    description: 'PMOの目的・役割・権限を明確化し、組織に受け入れてもらう最初の壁。',
    scenarios: [
      {
        id: 'pmo-role-unknown',
        title: '誰もPMOの役割を理解していない——「何をする部署ですか？」',
        description:
          'PMO設置初日、各プロジェクトのPMやメンバーに挨拶に回ると「PMOって何をするんですか？」「また管理が増えるのか」という反応が大半。経営層は「全部任せた」と言っただけで、具体的な権限も活動範囲も定義されていません。',
        pmTip: 'PMOの仕事①：存在意義を作る。PMOが「何のためにあるか」を明確にすることが最初の仕事。管理を増やす組織ではなく、PMたちを助ける組織として認識されないと機能しません。',
        docs: [{ type: '議事録', title: 'PMO設置時の経営決裁メモ', content: '経営判断: PMO設置を承認\n目的: プロジェクト成功率の向上\n権限: 未定義\n具体的な活動内容: 担当者に一任' }],
        choices: [
          { id: 'individual-meetings', label: '全PMと個別面談し、PMOへの期待と懸念を収集する', summary: '聞く姿勢でPMたちの本音を引き出し、信頼の土台を作る。', effects: { quality: 3, cost: -4, schedule: -3, stakeholder: 8, morale: 2 }, explanation: 'PMOが最初にすべきことは「聞く」ことです。各PMの課題を把握し、実際の支援ニーズに基づいてPMOの役割を設計することが現場信頼の出発点です。', pmBokTags: ['ステークホルダー管理', 'コミュニケーション管理', 'ファシリテーション'] },
          { id: 'create-charter', label: 'PMO憲章（役割・権限・活動範囲）を作成し、経営層の承認を取る', summary: '書面で役割を定義し、組織的な根拠を作る。', effects: { quality: 5, cost: -3, schedule: -2, stakeholder: 3, morale: 6 }, explanation: 'PMO憲章は役割・権限の曖昧さを解消します。経営層の承認を得ることで、PMOの活動に組織的な正当性が生まれます。', pmBokTags: ['統合管理', 'ガバナンス', 'ステークホルダー管理'] },
          { id: 'show-by-doing', label: '議論より先に、困っているPMを助ける活動から始める', summary: '小さな支援実績を作り、PMOの価値を行動で示す。', effects: { quality: 2, cost: -5, schedule: 2, stakeholder: 6, morale: 1 }, explanation: '説明より実績が先という判断は現場信頼を早期に獲得できます。ただしPMO工数を消耗しやすく、役割が曖昧なまま進むリスクがあります。', pmBokTags: ['ステークホルダー管理', 'コミュニケーション管理'] },
        ],
      },
      {
        id: 'pmo-report-chaos',
        title: '各プロジェクトの報告フォーマットが全員バラバラ——比較も集計もできない',
        description:
          '担当する5つのプロジェクトの進捗報告を集めると、全てのフォーマットが異なっていました。PPT・Excel・Wordが混在し、記載内容も粒度も統一されておらず、PMOとして横断的な状況把握が全くできていません。',
        pmTip: 'PMOの仕事②：標準化は手段であって目的ではない。報告フォーマットを統一するのは「比較・集計・早期発見」のため。押し付けではなく価値を示して受け入れてもらいます。',
        docs: [{ type: 'リスク管理表', title: '報告フォーマット調査結果', content: 'プロジェクト数: 5\n使用フォーマット: 5種類（全て異なる）\n主な問題: 比較不能・集計不能・読み解きに時間を要する\n現場の反応: 「今さら変えたくない」' }],
        choices: [
          { id: 'mandate-standard', label: '今月から標準フォーマットへの切り替えを全PJに指示する', summary: '権限を使って即座に統一を図る。', effects: { quality: 8, cost: -3, schedule: -2, stakeholder: -5, morale: 4 }, explanation: '統制型・指揮型PMOなら強制力を使えますが、現場の反発リスクがあります。変更の理由と価値を十分に説明することが抵抗を最小化します。', pmBokTags: ['標準化', 'ガバナンス', 'コミュニケーション管理'] },
          { id: 'template-offer', label: '使いやすい新テンプレートを作り、任意で使えるよう提供する', summary: 'プッシュせずに価値で引き寄せる。', effects: { quality: 4, cost: -4, schedule: -1, stakeholder: 5, morale: 2 }, explanation: '強制せずに良いものを作って自然に普及させるアプローチは抵抗が少ないですが、全PJに浸透するまで時間がかかります。', pmBokTags: ['標準化', 'ステークホルダー管理', 'コミュニケーション管理'] },
          { id: 'analyze-first', label: '各フォーマットを分析し、共通要素だけを抽出した最小限のひな型を提案する', summary: '現行を尊重しながら段階的に収束させる。', effects: { quality: 6, cost: -5, schedule: -3, stakeholder: 7, morale: 3 }, explanation: '現行フォーマットの良いところを残しながら統一する方法は現場の納得感が高いです。分析コストはかかりますが、定着率が最も高くなります。', pmBokTags: ['標準化', 'ファシリテーション', '品質管理'] },
        ],
      },
      {
        id: 'pmo-unrealistic-mandate',
        title: '経営層から「全プロジェクトを救ってくれ」と無茶ぶり',
        description:
          '経営層から「当社の全プロジェクトの成功率が50%台しかない。PMOを作ったからにはすぐに改善してほしい」と期待値が爆発しています。具体的な支援内容も予算も人員も決まっていません。',
        pmTip: 'PMOの仕事③：期待値を管理する。PMOは万能ではありません。何ができて何ができないかを早期に合意しておかないと、後で「PMOを作っても何も変わらない」という評価につながります。',
        docs: [{ type: 'メール', title: '経営層からのPMO設置指示メール', content: '社長: 「プロジェクト成功率向上のためPMOを設置する。来期末までに目に見える成果を出してほしい。何でも動いてくれ」\nPMOマネジャー（あなた）: 範囲・権限・リソースの明確化が急務' }],
        choices: [
          { id: 'accept-all', label: '全プロジェクトの支援を引き受け、全力で動き始める', summary: '期待に応えるため広範な活動を開始する。', effects: { quality: 3, cost: -10, schedule: 2, stakeholder: 4, morale: 4 }, explanation: '全てを引き受けると短期的には評価されますが、PMO工数が急速に消耗します。広く浅い支援では根本的な改善にならないリスクがあります。', pmBokTags: ['資源管理', 'ステークホルダー管理'] },
          { id: 'negotiate-scope', label: '優先度の高い2〜3PJに絞り込み、経営層と合意する', summary: '選択と集中で確実な成果を出す。', effects: { quality: 6, cost: -3, schedule: -2, stakeholder: 3, morale: 7 }, explanation: 'PMOの資源は有限です。選択と集中で確実な成果を出し、それを実績として次の活動範囲拡大につなげる判断が長期的に正解です。', pmBokTags: ['ポートフォリオ管理', 'ステークホルダー管理', 'ガバナンス'] },
          { id: 'phased-plan', label: '段階的ロードマップを提示し、期待値と実現可能範囲を合意する', summary: '中長期計画で透明性を確保する。', effects: { quality: 5, cost: -2, schedule: -3, stakeholder: 5, morale: 8 }, explanation: 'PMOの活動計画を可視化し、いつ・何が達成できるかを経営層と合意することは、後の「やっていない」批判を防ぐ重要な活動です。', pmBokTags: ['統合管理', 'ガバナンス', 'コミュニケーション管理'] },
        ],
      },
    ],
  },
  {
    id: 'pmo-standardization',
    label: '標準化推進',
    description: '報告・プロセス・ツールの統一を進める。現場の反発と過剰管理の誘惑との戦い。',
    scenarios: [
      {
        id: 'pmo-field-resistance',
        title: '現場から「また管理が増える」と抵抗——標準化が進まない',
        description:
          '標準フォーマットの導入を案内したところ、「業務が増える」「うちのPJは特殊なんです」「前の方法の方が使いやすい」という声が続出。一部のPMは「使い方が分からない」と言いつつ、使う気がない状態です。',
        pmTip: 'PMOの仕事④：変化への抵抗は当然。標準化の目的は管理強化ではなく現場の負担軽減のはず。価値を伝えながら巻き込む姿勢がPMOファシリテーターの本質です。',
        docs: [{ type: '課題管理表', title: '標準フォーマット導入状況', content: '対象: 5プロジェクト\n採用済み: 1PJ\n様子見: 2PJ\n明確に拒否: 2PJ\n理由: 「業務が増える」「特殊事情がある」' }],
        choices: [
          { id: 'force-adoption', label: '経営層の承認を根拠に強制導入を命じる', summary: '権限で押し切る。', effects: { quality: 7, cost: -2, schedule: 0, stakeholder: -8, morale: 3 }, explanation: '強制導入は標準化レベルを上げますが、現場信頼度に深刻なダメージを与えます。信頼なきPMOは「悪い情報が上がらない」組織を作ります。', pmBokTags: ['ガバナンス', '標準化', 'ステークホルダー管理'] },
          { id: 'listen-and-adapt', label: '抵抗の理由を個別に聞き、改善しながら再提案する', summary: '現場の声をフィードバックとして取り込む。', effects: { quality: 5, cost: -5, schedule: -3, stakeholder: 8, morale: 2 }, explanation: '反発の中には正当な意見が含まれています。現場の声を聞いて改善する姿勢がファシリテーターとしての信頼を積み上げます。', pmBokTags: ['ファシリテーション', 'ステークホルダー管理', 'コミュニケーション管理'] },
          { id: 'pilot-team', label: '協力的なPJでパイロット実施し、成功事例を作る', summary: '実績で他PJを引き寄せる。', effects: { quality: 4, cost: -4, schedule: -2, stakeholder: 6, morale: 4 }, explanation: '強制よりも実績での説得が現場の自発的な採用を促します。ただし全体への普及に時間がかかる点は計画に織り込む必要があります。', pmBokTags: ['標準化', 'ナレッジ管理', 'ステークホルダー管理'] },
        ],
      },
      {
        id: 'pmo-over-management',
        title: 'プロジェクトオーナーが細かすぎる報告を要求——過剰管理の誘惑',
        description:
          '有力なプロジェクトオーナーから「毎週、担当者ごとの稼働時間・タスク詳細・次週予定を全部出してほしい」という要求が来ました。そのまま現場に要求を転嫁すればオーナーは満足しますが、PMたちへの負担は膨大です。',
        pmTip: 'PMOの仕事⑤：過剰管理の緩衝材になる。オーナーへの忖度で現場に無駄な報告業務を強いるPMOは本末転倒。「何のための報告か」を問い直すのがPMOの役割です。',
        docs: [{ type: 'メール', title: 'プロジェクトオーナーからの報告要求', content: 'オーナー: 「週次で全メンバーの時間内訳とタスク詳細を提出してください。進捗の実態をしっかり把握したい」\nPMO（あなた）: 現場への影響が大きい。調整が必要か？' }],
        choices: [
          { id: 'comply-owner', label: 'オーナーの要求通り、現場に詳細報告を求める', summary: 'オーナー満足を優先し、現場に転嫁する。', effects: { quality: 3, cost: -2, schedule: -4, stakeholder: -7, morale: 4 }, explanation: 'オーナーへの忖度で現場に詳細報告を強いることは「管理のための管理」です。報告業務が肥大化すると現場が本来業務に集中できなくなります。', pmBokTags: ['コミュニケーション管理', 'ステークホルダー管理'] },
          { id: 'negotiate-reporting', label: 'オーナーと報告内容・レベルを交渉し、最適なバランスを提案する', summary: '経営層に「信号報告方式」を提案する。', effects: { quality: 4, cost: -4, schedule: -1, stakeholder: 5, morale: 6 }, explanation: '状態（赤/黄/緑）と必要な意思決定だけを伝える「信号報告」への切り替えは、オーナーの知りたいことを満たしながら現場の負担を激減させます。', pmBokTags: ['コミュニケーション管理', 'ファシリテーション', 'ステークホルダー管理'] },
          { id: 'create-summary-layer', label: 'PMOが生データをまとめてサマリーだけをオーナーに出す構造を作る', summary: 'PMOが情報加工者として機能する。', effects: { quality: 5, cost: -6, schedule: -2, stakeholder: 4, morale: 5 }, explanation: 'PMOがフィルター役になることで現場も経営層も満足できます。ただしPMO工数の消費が大きくなるため、持続可能かどうかを確認する必要があります。', pmBokTags: ['コミュニケーション管理', 'ガバナンス', '標準化'] },
        ],
      },
      {
        id: 'pmo-vendor-pmo',
        title: '委託先ベンダーのPMOが、自社に有利な情報しか出してこない',
        description:
          '外部ベンダーに一部PJのPMO業務を委託していますが、提出される報告書には問題点がほとんど記載されておらず、「順調です」という報告が続いています。しかし担当PMから「内部ではかなり揉めている」という噂が聞こえてきます。',
        pmTip: 'PMOの仕事⑥：情報の真偽を確認する。委託先PMOの報告は自社利益を守るために加工される可能性があります。自社の目でエビデンスを確認する仕組みが必要です。',
        docs: [{ type: '課題管理表', title: 'ベンダーPMO報告書サマリー', content: 'ベンダー報告: 「全て順調、課題なし、納期内完了見込み」\n現場PMの証言: 「実は先週重大なバグが出て揉めていた」\nPMO（あなた）: 報告と実態が乖離している可能性大' }],
        choices: [
          { id: 'trust-vendor', label: 'ベンダーの報告を信頼し、特別な確認はしない', summary: '委託したのだから信頼する判断をする。', effects: { quality: -6, cost: 0, schedule: 3, stakeholder: -2, morale: -3 }, explanation: 'ベンダーPMOの報告をそのまま信頼すると、問題が手遅れになるまで発覚しません。PMOの独立した視点でのモニタリングは重要な役割です。', pmBokTags: ['調達管理', 'リスク管理'] },
          { id: 'direct-spot-check', label: '定期的にPM・担当者と直接ヒアリングしてエビデンスを確認する', summary: 'PMOとして独自の確認ルートを確立する。', effects: { quality: 7, cost: -4, schedule: -2, stakeholder: 5, morale: 2 }, explanation: '独立したモニタリングは「本当の状況」を把握するために不可欠です。ベンダーとの関係を壊さずに事実確認できる聞き方が重要です。', pmBokTags: ['ガバナンス', '調達管理', 'コミュニケーション管理'] },
          { id: 'require-evidence', label: 'ベンダーPMOにエビデンスベースの報告（成果物・議事録・課題ログ）を義務付ける', summary: '契約・プロセス上の仕組みで透明性を確保する。', effects: { quality: 6, cost: -3, schedule: -3, stakeholder: 3, morale: 4 }, explanation: 'エビデンスベースの報告義務化は持続可能な透明性確保の方法です。ベンダーとの合意形成が必要ですが、長期的な信頼関係にもつながります。', pmBokTags: ['調達管理', 'ガバナンス', '品質管理'] },
        ],
      },
    ],
  },
  {
    id: 'pmo-progress',
    label: '進捗管理・課題解決',
    description: '横断的な進捗把握と課題解決。「管理だけで終わる」PMOから脱却できるかが問われる。',
    scenarios: [
      {
        id: 'pmo-90-syndrome',
        title: '「90%完了」が実は50%だった——90%症候群の真っ只中',
        description:
          '重要プロジェクトのPMから「あと少しで完了です、今週中に終わります」という報告が2週間続いています。PMOとして状況を確認しに行くと、実際にはテスト環境すら整っていないことが判明しました。',
        pmTip: 'PMOの仕事⑦：問い詰めではなく、一緒に解決する姿勢で進捗を確認する。「なぜ遅れたのか」より「どうすれば回復できるか」という問いかけが正直な報告を生みます。',
        docs: [{ type: '課題管理表', title: '進捗ヒアリング結果', content: 'PM自己申告: 「90%完了、あと少しです」\n実態確認: テスト環境未整備、主要機能の実装に遅延発覚\n実際の進捗（推定）: 50〜55%\nPM: 「遅延を報告したら詰められると思って…」' }],
        choices: [
          { id: 'confront-pm', label: '虚偽報告として問い詰め、正直に報告するよう求める', summary: '問題の重大性を認識させ、正確な報告を求める。', effects: { quality: 3, cost: 0, schedule: -2, stakeholder: -6, morale: -3 }, explanation: '問い詰めアプローチは短期的に真実を引き出せますが、「報告すると詰められる」文化を強化します。次回からますます悪い情報が隠れるリスクがあります。', pmBokTags: ['コミュニケーション管理', 'リスク管理'] },
          { id: 'recovery-focus', label: '「一緒にリカバリ計画を考えましょう」という姿勢で向き合う', summary: '支援者として信頼される対応をする。', effects: { quality: 6, cost: -4, schedule: -2, stakeholder: 8, morale: 2 }, explanation: '「PMOに相談すると助けてくれる」という空気が生まれると、問題が早期に報告されるようになります。これが「悪い情報が上がる組織」を作る最善策です。', pmBokTags: ['ファシリテーション', 'ステークホルダー管理', '統合管理'] },
          { id: 'escalate-management', label: '実態を経営層に報告し、追加リソースの確保を依頼する', summary: '問題を上位に共有し組織的対処を求める。', effects: { quality: 4, cost: -3, schedule: -4, stakeholder: 2, morale: 5 }, explanation: '経営層への正直な報告はPMOの重要な役割です。ただしPMが傷つく前に本人と相談する手順を踏むことで、信頼関係を守りながらエスカレーションできます。', pmBokTags: ['ガバナンス', 'コミュニケーション管理', 'ステークホルダー管理'] },
        ],
      },
      {
        id: 'pmo-buried-issue',
        title: 'チームをまたぐ厄介な課題が塩漬けになっている',
        description:
          '課題管理表を確認すると、3週間以上誰も動いていない課題が4件あります。いずれもチームをまたぐ複雑な問題で、「自分の担当ではない」と押し付け合いになっていることが判明しました。',
        pmTip: 'PMOの仕事⑧：塩漬け課題こそPMOが動く場面。複数チームにまたがる課題は、誰かが横断的に動かないと永遠に放置されます。PMOがファシリテーターとして意思決定を促します。',
        docs: [{ type: 'リスク管理表', title: '課題管理表 未解決項目', content: '塩漬け課題: 4件\n放置期間: 3〜5週間\n共通点: 全てチームをまたぐ責任境界の曖昧な問題\n関係者の反応: 「うちの担当ではない」' }],
        choices: [
          { id: 'pmo-takes-ownership', label: 'PMOが課題の担当者として動き、解決まで引っ張る', summary: 'PMOが主体的に課題を「動かす」。', effects: { quality: 5, cost: -7, schedule: 3, stakeholder: 5, morale: 1 }, explanation: 'PMOが直接動くことで即効性がありますが、PMO工数の消耗が大きく、「また何でも屋に」という状態になるリスクがあります。解決後の仕組み化が必須です。', pmBokTags: ['統合管理', '資源管理', 'ファシリテーション'] },
          { id: 'facilitate-resolution', label: '関係チームを集め、ファシリテーターとして意思決定の場を作る', summary: '当事者が自ら解決できる場を設計する。', effects: { quality: 6, cost: -4, schedule: -2, stakeholder: 7, morale: 3 }, explanation: 'PMOがファシリテーターとして場を作り、当事者同士が解決に向かう仕組みを作ることが最も持続可能なアプローチです。', pmBokTags: ['ファシリテーション', 'コミュニケーション管理', 'ガバナンス'] },
          { id: 'escalate-issue', label: '経営層・スポンサーにエスカレーションして担当者を指名させる', summary: '権限で担当者を決め、課題を前進させる。', effects: { quality: 4, cost: -2, schedule: -3, stakeholder: 2, morale: 4 }, explanation: 'エスカレーションによる担当者指名は問題を前進させますが、現場の自律性を損なう可能性があります。PMOの権限レベルに応じた判断が必要です。', pmBokTags: ['ガバナンス', 'ステークホルダー管理', '統合管理'] },
        ],
      },
      {
        id: 'pmo-hollow-meeting',
        title: '週次進捗会議が「報告のための報告」になっている',
        description:
          '毎週月曜の3時間会議で全PMが週次報告を順番に読み上げますが、誰も質問せず、何も決まらないまま終わります。参加者からは「この会議の意味がわからない」という声が上がっています。あなた自身も土曜日に報告書作成に時間を費やし、誰にも読まれていない感覚があります。',
        pmTip: 'PMOの仕事⑨：会議の設計も仕事のうち。「情報共有」と「意思決定」は別の場で行うべきです。報告は非同期で、会議は決断のために使う設計がPMOの腕の見せどころ。',
        docs: [{ type: '議事録', title: '週次進捗会議 議事録', content: '参加者: 8名（全PM）\n時間: 3時間\n内容: 各PMが進捗を読み上げ\n決定事項: なし\n参加者の声: 「この会議に何の意味があるのか」' }],
        choices: [
          { id: 'keep-meeting', label: '慣例なので変えずに続ける', summary: '既存のルーティンを維持する。', effects: { quality: -3, cost: -4, schedule: -3, stakeholder: -4, morale: -5 }, explanation: '形骸化した会議を続けることはPMO工数と全員の時間を浪費し続けます。PMOが率先して改善提案をすることが組織の生産性向上につながります。', pmBokTags: ['コミュニケーション管理', '標準化'] },
          { id: 'signal-reporting', label: '報告を非同期化し、会議は課題解決・意思決定だけに絞る', summary: '会議の目的を再設計する。', effects: { quality: 5, cost: 4, schedule: 3, stakeholder: 6, morale: 8 }, explanation: '状態（赤/黄/緑）と必要な意思決定だけを会議で扱い、詳細報告は事前に非同期で共有する設計は、全員の時間を節約し価値ある会議に変えます。', pmBokTags: ['コミュニケーション管理', 'ファシリテーション', '標準化'] },
          { id: 'shorten-meeting', label: '会議時間を1時間に短縮し、重要事項に絞る', summary: '時間を減らしてまず変化を見せる。', effects: { quality: 2, cost: 2, schedule: 1, stakeholder: 4, morale: 4 }, explanation: '小さな改善から始めるアプローチは抵抗が少ないですが、根本的な会議設計の改善なしでは半端な結果になる可能性があります。', pmBokTags: ['コミュニケーション管理', 'ファシリテーション'] },
        ],
      },
    ],
  },
  {
    id: 'pmo-crisis',
    label: '危機対応・板挟み',
    description: '経営層と現場の間で圧力が集中する。PMOの本当の価値が試される局面。',
    scenarios: [
      {
        id: 'pmo-sandwich',
        title: '経営層の期待値と現場リソースの板挟み——中間にいるPMOに全部のしかかる',
        description:
          '経営層は「来期までに全プロジェクトを予定通り完了させ、新規PJも追加で受けてほしい」と言い、一方で現場PMたちは「今でも全員120%稼働で限界です」と訴えています。このギャップを調整する役割がPMOに期待されています。',
        pmTip: 'PMOの仕事⑩：両方の味方になる。板挟みは恐れるべきでなく、「両者の現実を引き合わせる場を作る」チャンスです。データで語り、感情論にしないことが重要。',
        docs: [{ type: 'リスク管理表', title: 'リソース需給分析', content: '経営層の要求: 既存PJ完遂 + 新規3PJ追加受注\n現場リソース合計: 既存PJだけで120%稼働\nギャップ: 新規PJ分の工数が全く存在しない\nPMO（あなた）: このまま伝えると双方から批判される' }],
        choices: [
          { id: 'side-with-management', label: '経営層の方針を優先し、現場に無理を依頼する', summary: '経営層に従い、現場に圧力をかける。', effects: { quality: -3, cost: -3, schedule: 4, stakeholder: -9, morale: 5 }, explanation: '経営層に忖度して現場に無理を強いると、バーンアウトや離職につながります。PMOが経営層の意思決定装置になってしまいます。', pmBokTags: ['ステークホルダー管理', '資源管理'] },
          { id: 'side-with-field', label: '現場の限界を経営層に伝え、新規PJの断念を提言する', summary: '現場の声を代弁し、経営層に現実を伝える。', effects: { quality: 3, cost: 0, schedule: -4, stakeholder: 5, morale: -4 }, explanation: '現場を守る判断は正しいですが、経営層との関係を損なう可能性があります。データと代替案を示した上での提言が必要です。', pmBokTags: ['ステークホルダー管理', 'ガバナンス'] },
          { id: 'bring-to-table', label: '経営層と現場PMを同じテーブルに着かせ、データで現実を共有する', summary: '両者に直接データを見せ、PMOがファシリテーターとして解決を促す。', effects: { quality: 5, cost: -4, schedule: -2, stakeholder: 6, morale: 7 }, explanation: 'PMOの最も価値ある仕事は「両者の現実を引き合わせる場を作ること」です。データで語り、感情論にしないことで建設的な意思決定が可能になります。', pmBokTags: ['ファシリテーション', 'ガバナンス', 'ステークホルダー管理'] },
        ],
      },
      {
        id: 'pmo-capacity-limit',
        title: 'PMOが「何でも屋」化して工数が限界に——本来業務ができない',
        description:
          '担当外のタスク・雑用・調整業務がどんどんPMOに流れ込み、課題管理・ナレッジ化・標準化といったPMO本来の仕事が全くできていません。チームメンバーも疲弊しており、このままでは組織全体のPM支援が崩壊します。',
        pmTip: 'PMOの仕事⑪：境界線を引く勇気。「何でも屋」になったPMOは本質的な価値を失います。本来の担当者に返す仕組みと、PMO本来の活動に集中できる体制を整えることがPMOの責務です。',
        docs: [{ type: '課題管理表', title: 'PMO工数分析', content: 'PMO本来業務: 25%\n担当外雑用・調整: 45%\n報告業務: 30%\nメンバーの声: 「何のためのPMOか分からなくなってきた」' }],
        choices: [
          { id: 'accept-all-tasks', label: '「PMOの仕事は広い」と受け入れ、全部引き受ける', summary: '全タスクを抱え込み続ける。', effects: { quality: -2, cost: -8, schedule: -2, stakeholder: 3, morale: -8 }, explanation: 'PMO工数が尽きると本来の横断的支援ができなくなります。雑用をこなすPMOはプロジェクト全体の品質を守る機能を失います。', pmBokTags: ['資源管理', 'ガバナンス'] },
          { id: 'decline-clearly', label: 'PMO担当外タスクは明確に断り、適切な担当者に返す', summary: '境界線を引いて本来業務に集中する。', effects: { quality: 4, cost: 5, schedule: 2, stakeholder: -5, morale: 4 }, explanation: '明確に断ることで短期的には関係が悪化しますが、PMO本来の活動に集中することで組織全体への価値提供が回復します。', pmBokTags: ['ガバナンス', 'ステークホルダー管理', '資源管理'] },
          { id: 'return-with-process', label: 'タスクを本来の担当者に返しながら、「誰が何を担うか」の仕組みを整備する', summary: 'タスク返却と同時に再発防止の仕組みを作る。', effects: { quality: 6, cost: -2, schedule: -3, stakeholder: 4, morale: 6 }, explanation: '単に断るのでなく「なぜPMOに集まっているか」という根本原因を解消することが最善の対処です。プロセスを整備することで同じ問題の再発を防げます。', pmBokTags: ['標準化', 'ガバナンス', 'ファシリテーション'] },
        ],
      },
      {
        id: 'pmo-basics-not-working',
        title: '炎上現場で当たり前が通じない——ツール・プロセス以前の問題',
        description:
          '炎上しているプロジェクトに入ると、会議の無断欠席・遅延の隠蔽・できないのに相談しない・議事録を誰も書かない、という状態が常態化しています。標準化ツールを入れても誰も使わず、プロセス改善の前提となる「当たり前」が機能していません。',
        pmTip: 'PMOの仕事⑫：ツール導入より土台づくり。炎上現場では管理ツールよりも「正直に話せる安全な雰囲気」作りが先決です。プロセスは人が動いて初めて機能します。',
        docs: [{ type: '課題管理表', title: '炎上PJ 現状評価', content: '無断遅延報告: 週平均3件\n会議無断欠席: 週1〜2件\n課題の隠蔽: 複数発覚\nPMの言葉: 「報告したら詰められるから言えない」' }],
        choices: [
          { id: 'introduce-tools', label: 'プロジェクト管理ツールを導入し、可視化を強化する', summary: 'ツールで状況を見える化する。', effects: { quality: 2, cost: -5, schedule: -2, stakeholder: -3, morale: -4 }, explanation: '炎上現場でツールを先に入れると「また管理が増えた」と受け取られ、かえって状況が悪化することがあります。土台となる心理的安全性が先です。', pmBokTags: ['標準化', 'ガバナンス'] },
          { id: 'groundwork-first', label: '一人ひとりと対話し、「相談しやすい空気」を作ることから始める', summary: '地道な信頼構築を優先する。', effects: { quality: 4, cost: -3, schedule: -4, stakeholder: 9, morale: 3 }, explanation: '心理的安全性が生まれると正直な情報が上がるようになります。これが炎上を早期に発見し回復できる組織の土台です。時間はかかりますが最も効果的なアプローチです。', pmBokTags: ['ファシリテーション', 'ステークホルダー管理', 'コミュニケーション管理'] },
          { id: 'management-intervention', label: '経営層・スポンサーに現状を報告し、権威を使って組織を立て直す', summary: '上位の権威を借りてチームを整える。', effects: { quality: 3, cost: -2, schedule: -3, stakeholder: 1, morale: 2 }, explanation: 'マネジメント介入は即効性がありますが、根本的な文化変革につながるかどうかは不確かです。短期的な整理と長期的な信頼構築の両方が必要です。', pmBokTags: ['ガバナンス', 'ステークホルダー管理', '統合管理'] },
        ],
      },
    ],
  },
  {
    id: 'pmo-maturity',
    label: '組織成熟・参謀型',
    description: 'PMOが「御用聞き」から「戦略パートナー」に進化する。組織の学びを未来に活かす最終局面。',
    scenarios: [
      {
        id: 'pmo-knowledge-loss',
        title: 'ナレッジが属人化し、担当者が退職したら全てが消えた',
        description:
          'PMOの中核メンバーが退職し、過去の失敗事例・交渉の文脈・非公式ルールが全て消えてしまいました。「あの人しか知らなかった情報」の多さに、ナレッジ管理の重要性を痛感しています。',
        pmTip: 'PMOの仕事⑬：ナレッジを組織の資産にする。人が去っても知識が残る仕組みを作ることがPMOの長期的な価値です。失敗こそ最高の教材です。',
        docs: [{ type: '課題管理表', title: 'ナレッジ流出影響調査', content: '退職者が保有していた情報: 顧客対応の文脈・過去失敗の詳細・非公式な意思決定プロセス\n他メンバーが引き継げた情報: 約30%\n影響: 同種トラブルが既に2件再発' }],
        choices: [
          { id: 'emergency-document', label: '今すぐ残っているメンバーの知識を緊急でドキュメント化する', summary: '急場しのぎのナレッジ収集を行う。', effects: { quality: 4, cost: -5, schedule: -3, stakeholder: 2, morale: -2 }, explanation: '緊急のドキュメント化は当面の損失を抑えますが、根本的なナレッジ管理の仕組みなしでは同じことが繰り返されます。', pmBokTags: ['ナレッジ管理', '統合管理'] },
          { id: 'build-knowledge-system', label: 'ナレッジ管理システムを構築し、定期的な蓄積・更新プロセスを設計する', summary: '組織として知識を積み上げる仕組みを作る。', effects: { quality: 7, cost: -5, schedule: -4, stakeholder: 3, morale: 5 }, explanation: '失敗事例・判断の文脈・交渉の経緯を組織の財産として記録する仕組みは、PMOの長期的価値の源泉です。「同じ失敗を繰り返さない組織」を作ります。', pmBokTags: ['ナレッジ管理', 'ガバナンス', '標準化'] },
          { id: 'cross-training', label: '重要知識を複数名が保有するクロストレーニング体制を整える', summary: '一人に依存しない知識の分散化を行う。', effects: { quality: 5, cost: -4, schedule: -2, stakeholder: 4, morale: 6 }, explanation: '知識の分散化はナレッジロスリスクを根本から解消します。文書化と組み合わせることで最も耐久性のある組織的知識管理が実現します。', pmBokTags: ['ナレッジ管理', '資源管理', '標準化'] },
        ],
      },
      {
        id: 'pmo-role-perception',
        title: '「PMOはお目付け役か助け舟か」——現場との認識が根本的にズレている',
        description:
          'PMO活動が軌道に乗ってきた一方、あるPMから本音を聞くと「PMOが来ると問題点を突かれる気がして、悪い情報を報告しにくい」という発言が。PMOが「監視役」として認識されており、本来の「支援役」として機能できていません。',
        pmTip: 'PMOの仕事⑭：「御用聞き・メッセンジャー」ではなくファシリテーターとして頼られること。信頼されるPMOは悪い情報が早く上がる。怖がられるPMOは問題が手遅れになるまで来ない。',
        docs: [{ type: '議事録', title: 'PM非公式懇談会 議事録', content: 'PMのリアルな声:\n「PMOに話すと上に筒抜けになる気がする」\n「問題があると責められると思って言いにくい」\n「もっと一緒に考えてくれる存在だと思っていた」' }],
        choices: [
          { id: 'clarify-role-publicly', label: 'PMOの役割・情報の扱い方を全員に改めて説明する', summary: 'ミスコミュニケーションを解消する。', effects: { quality: 3, cost: -2, schedule: -1, stakeholder: 5, morale: 2 }, explanation: '説明による認識是正は必要ですが、行動が伴わなければ信頼は回復しません。宣言と実際の行動の一致が重要です。', pmBokTags: ['コミュニケーション管理', 'ステークホルダー管理'] },
          { id: 'change-behavior', label: '「一緒にリカバリを考える」スタンスに行動を変え、実績で示す', summary: '言葉より行動で信頼を作る。', effects: { quality: 5, cost: -3, schedule: -2, stakeholder: 9, morale: 3 }, explanation: '信頼は行動の積み重ねで生まれます。PMOがファシリテーターとして機能すれば、やがてPMたちから「相談したい」と声がかかる存在になります。', pmBokTags: ['ファシリテーション', 'ステークホルダー管理', 'コミュニケーション管理'] },
          { id: 'co-design-pmo', label: 'PMたちを巻き込んでPMOの役割を一緒に再定義する', summary: '現場の声でPMOを作り直す。', effects: { quality: 4, cost: -4, schedule: -3, stakeholder: 10, morale: 4 }, explanation: 'PMOの役割を現場と一緒に作ることは最高の関係構築です。「自分たちが作ったPMO」という認識は協力を引き出す最強の動機づけになります。', pmBokTags: ['ファシリテーション', 'ガバナンス', 'ステークホルダー管理'] },
        ],
      },
      {
        id: 'pmo-strategic-partner',
        title: '経営の意思決定に食い込む機会——参謀型PMOへの進化の瞬間',
        description:
          '経営会議で「来期のIT投資ポートフォリオをどう組むか、PMOの視点で提言してほしい」という依頼が来ました。これはPMOが「事務局型」から「参謀型」に進化できる重大な機会です。どのような形で経営層に関与するかが、PMOの未来を決めます。',
        pmTip: 'PMOの仕事⑮：データと横断視点で経営の意思決定を支える。参謀型PMOは「言われたことをする」のではなく、「組織全体を見た最善策を提言する」存在です。過去のナレッジが武器になります。',
        docs: [{ type: 'リスク管理表', title: 'IT投資ポートフォリオ 現状データ', content: '進行中PJ: 8件（うち炎上リスク: 2件）\n成功率: 67%（業界平均52%比較で良好）\n主な失敗要因: 上流の要件曖昧さ・リソース計画の甘さ\n提言余地: 新規投資基準の見直し・既存PJの選択と集中' }],
        choices: [
          { id: 'balanced-analysis', label: '現状データと課題を整理し、複数のシナリオを提示する', summary: '客観的な分析と複数選択肢で経営判断を支援する。', effects: { quality: 6, cost: -4, schedule: -2, stakeholder: 5, morale: 8 }, explanation: 'PMOが蓄積してきたデータと横断視点を活かした客観的な提言は、参謀型PMOの真骨頂です。複数シナリオを示すことで経営層の意思決定の質を高めます。', pmBokTags: ['ポートフォリオ管理', 'ガバナンス', 'ナレッジ管理'] },
          { id: 'support-management-view', label: '経営層の既定路線を支持する資料を作る', summary: '経営層が求める結論に沿った分析を行う。', effects: { quality: -2, cost: -2, schedule: 1, stakeholder: -2, morale: 4 }, explanation: '経営層に忖度した分析はPMOの信頼性を損ないます。参謀型PMOの価値は「耳が痛いことも含めた正直な分析」を提供することにあります。', pmBokTags: ['ステークホルダー管理', 'ガバナンス'] },
          { id: 'radical-restructuring', label: '問題PJの中止と投資の大幅組み替えを大胆に提言する', summary: '現状への根本的な問題提起を行う。', effects: { quality: 5, cost: -3, schedule: -3, stakeholder: -2, morale: 8 }, explanation: '大胆な提言は組織に必要な刺激を与えますが、経営層・PM双方との関係構築なしに行うと反発を招きます。信頼の積み重ねの上での提言が前提です。', pmBokTags: ['ポートフォリオ管理', 'ガバナンス', '統合管理'] },
        ],
      },
    ],
  },
];
