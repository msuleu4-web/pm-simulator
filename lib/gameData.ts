import type { Phase } from './types';

export const phases: Phase[] = [
  {
    id: 'requirements',
    label: '要件定義',
    description: '顧客の要求を整理し、何を作るかを決める上流工程。議事録や合意形成が重要です。',
    scenarios: [
      {
        id: 'requirements-ambiguity',
        learningImage: { src: '/game-assets/waterfall.png', caption: 'ウォーターフォール開発工程図 — 今は「要件定義」フェーズです' },
        title: '顧客要望が曖昧で「いい感じに」要求される',
        description:
          '顧客担当者から「画面は見やすく、機能は"いい感じに"してほしい」と曖昧な要望が届いた。要件定義でどこまで深掘りするかが問われます。',
        pmTip: 'PMの仕事①：**要件を明確にする**。「いい感じに」という**曖昧な要求**をそのまま進めると後でやり直しが発生します。PMは「**何を作るか**」を具体的に確認してから進めます。',
        clientChat: true,
        docs: [
          {
            type: '議事録',
            title: '要件ヒアリング議事録（草案）',
            content: `顧客: 「とりあえず全部管理できるようにしたい」
PM: 詳細要件を定義する必要あり
次回までに画面要件とレポート要件を明確化する`,
          },
        ],
        choices: [
          {
            id: 'deep-dive',
            label: '追加ヒアリングで具体的要求を確定する',
            summary: '曖昧な要求を深掘りし、要件を明文化する。',
            effects: { quality: 10, cost: -5, schedule: -5, stakeholder: 5, morale: 0 },
            explanation:
              '日本のSIerでは、曖昧な要求をそのまま進めると後でスコープクリーンプや手戻りが発生します。PMは報連相と合意形成でリスクを低減します。',
            pmBokTags: ['スコープ管理', 'コミュニケーション管理', 'リスク管理'],
            consequence: '今後のフェーズで「要件不明瞭」が減り、品質安定につながる。',
            flag: 'requirements-clarified',
          },
          {
            id: 'proceed-guess',
            label: '経験をもとに推測して仕様を固める',
            summary: '曖昧なまま進めて先行開発を開始する。',
            effects: { quality: -10, cost: 0, schedule: 5, stakeholder: -5, morale: 0 },
            explanation:
              '要件を推測して先に進める判断は一時的にスケジュールを守るかもしれませんが、後工程の手戻りリスクが増えます。PMは現場の炎上原因になる曖昧さを避けるべきです。',
            pmBokTags: ['スコープ管理', '品質管理'],
            consequence: '後続工程で要件変更が発生しやすくなる。',
          },
          {
            id: 'delegate-workshop',
            label: '顧客と合同ワークショップを実施する',
            summary: '関係者を集めて要件の合意形成を目指す。',
            effects: { quality: 8, cost: -3, schedule: -3, stakeholder: 8, morale: 2 },
            explanation:
              '根回しと合意形成を重視する日本のPMでは、関係者を巻き込みながら要件を固めるのが正解に近い判断です。議事録を残すことで後の「言った・言わない」問題も減ります。',
            pmBokTags: ['ステークホルダー管理', 'コミュニケーション管理', '統合管理'],
            consequence: '顧客との信頼関係が強まり、ステークホルダー満足度が向上する。',
            flag: 'workshop-held',
          },
        ],
      },
      {
        id: 'requirements-handover-gap',
        learningImage: { src: '/game-assets/meeting-minutes.png', caption: '議事録サンプル — 合意内容の記録が引き継ぎの質を決めます' },
        title: '前任PMの引き継ぎ資料が不完全——経緯が把握できない',
        description:
          '前任PMが急病で離脱し、引き継がれた資料は断片的。顧客との合意経緯が不明瞭なまま要件定義を続けるのか、一度立ち止まって経緯を確認するか判断が必要です。',
        pmTip: 'PMの仕事③：**情報を集める**。前任者からの引き継ぎが不完全でも、PMは**責任を転嫁せず**自分から情報を集めてプロジェクトを正しい方向に向けます。',
        docs: [
          {
            type: '議事録',
            title: '前任PM引き継ぎメモ（断片）',
            content: `前任PM: 顧客の「全管理機能」要求について、別途詰める予定
引き継ぎ資料: 一部ページ欠損あり
顧客への確認: 未完了`,
          },
        ],
        choices: [
          {
            id: 'confirm-with-client',
            label: '顧客に直接確認して合意空白を埋める',
            summary: '不明な経緯を顧客との対話で補完し、正確な要件を確定する。',
            effects: { quality: 8, cost: -3, schedule: -5, stakeholder: 5, morale: 1 },
            explanation:
              '引き継ぎの空白は早期に顧客確認で埋めるのが最善です。不確実な推測で進めるより、追加の合意確認が後工程の手戻りを防ぎます。',
            pmBokTags: ['コミュニケーション管理', 'ステークホルダー管理', 'リスク管理'],
            consequence: '要件の正確性が増し、後工程の不一致リスクが下がる。',
          },
          {
            id: 'proceed-with-gaps',
            label: '現資料の範囲で推測しながら要件定義を進める',
            summary: '不確実な部分は経験で補い、まず進める。',
            effects: { quality: -8, cost: 0, schedule: 4, stakeholder: -3, morale: -1 },
            explanation:
              '空白を推測で埋めて進めると、後工程で要件不一致が表面化し、手戻りや顧客トラブルのリスクが高まります。',
            pmBokTags: ['スコープ管理', 'リスク管理'],
            consequence: '後工程で要件ずれが発生しやすくなる。',
          },
          {
            id: 'reconstruct-from-team',
            label: 'チームメンバーから情報を集め、内部で経緯を再構成する',
            summary: '関係者へのヒアリングで引き継ぎ空白を補う。',
            effects: { quality: 4, cost: -2, schedule: -3, stakeholder: 2, morale: 2 },
            explanation:
              'チーム内の知識を結集して情報を補完するアプローチは、顧客への手間を最小化しつつリスクを低減できます。ただし記憶頼りには限界があります。',
            pmBokTags: ['統合管理', 'コミュニケーション管理', 'リスク管理'],
            consequence: '内部で経緯を再構成できるが、顧客認識とのずれが残るリスクがある。',
          },
        ],
      },
      {
        id: 'requirements-user-vs-it',
        learningImage: { src: '/game-assets/qcd.png', caption: 'QCD（品質・コスト・納期） — 対立する要求をQCDで整理しましょう' },
        title: '現場ユーザーと情報システム部門で要件が真っ向対立している',
        description:
          '現場の営業部門は「シンプルな入力画面がほしい」と訴える一方、情報システム部門は「セキュリティと管理機能を充実させるべき」と主張しています。両者の要件が根本的に異なる方向を向いており、どちらかを優先すると相手が不満を持つ状況です。',
        pmTip: 'PMの仕事④：**対立を解消する**。関係者の意見が対立したとき、PMは**中立の立場**で話し合いの場を作り全員が納得できる方向を見つけます。',
        docs: [
          {
            type: '議事録',
            title: '要件ヒアリング議事録（対立記録）',
            content: `営業部門: 「とにかく入力が簡単なものにしてほしい。管理機能は後でいい」
情シス部門: 「ログ管理と権限設計は最低限必要。セキュリティを妥協できない」
PM: 両者の折り合いをどこに置くか検討が必要`,
          },
        ],
        choices: [
          {
            id: 'joint-workshop',
            label: '両部門を集めてFADセッションを開き、優先度を合意する',
            summary: '機能配分ドキュメントで双方の優先事項を可視化し、合意形成を図る。',
            effects: { quality: 8, cost: -4, schedule: -5, stakeholder: 8, morale: 2 },
            explanation:
              '利害関係が対立する場合、PMが場を設けて可視化と合意形成を主導するのが最善です。双方が納得できる優先順位を文書化することがリスク管理になります。',
            pmBokTags: ['ステークホルダー管理', 'コミュニケーション管理', 'スコープ管理'],
            consequence: '双方の信頼が高まり、後の変更要求が減りやすくなる。',
            flag: 'workshop-held',
          },
          {
            id: 'prioritize-it-dept',
            label: '情シス部門の要件を基本とし、現場へ説明する',
            summary: 'コンプライアンスを優先し、現場には使い勝手の改善で対応する。',
            effects: { quality: 4, cost: -2, schedule: -2, stakeholder: -4, morale: -1 },
            explanation:
              'セキュリティ・管理の要件を先に確保する判断は技術的には妥当ですが、現場ユーザーの不満がプロジェクト後半に問題になるリスクがあります。',
            pmBokTags: ['品質管理', 'ステークホルダー管理', 'リスク管理'],
            consequence: '情シスは満足するが、現場の使い勝手への不満が後半に表面化しやすい。',
          },
          {
            id: 'prioritize-end-users',
            label: '現場ユーザーの声を重視し、シンプルな設計を優先する',
            summary: '利便性を先行し、管理機能は後のフェーズに回す。',
            effects: { quality: 2, cost: 0, schedule: 2, stakeholder: -3, morale: 1 },
            explanation:
              '現場の使いやすさを優先する判断は業務効率に寄与しますが、セキュリティや管理要件の不足が後で問題になるリスクがあります。',
            pmBokTags: ['スコープ管理', 'ステークホルダー管理'],
            consequence: '現場は喜ぶが、情シスからの反発とセキュリティリスクが残る。',
          },
        ],
      },
      {
        id: 'requirements-hidden-stakeholder',
        learningImage: { src: '/game-assets/stakeholder-map.png', caption: 'ステークホルダーマップ — 影響力×関心度で関係者を整理し、対応方針を決めます' },
        title: '要件定義の終盤に「本当の意思決定者」が介入してきた',
        description:
          '要件がほぼまとまったタイミングで、これまで参加していなかった「購買部門の部長」が「なぜ我々に事前確認しなかったのか」と介入してきた。予算の最終承認権を持つ重要な関係者だったことが今になって判明しています。',
        pmTip: 'PMの仕事⑤：**関係者を把握する**。「**誰が意思決定者か**」を早めに整理しておくことで後のトラブルを防げます。これを**ステークホルダー管理**と呼びます。',
        docs: [
          {
            type: 'メール',
            title: '購買部長からの指摘メール',
            content: `購買部長: 「このシステムは我々の承認プロセスにも影響します。なぜ最初から相談がなかったのですか？要件を一から見直してほしい」
PM: ステークホルダーマップの見直しが急務`,
          },
        ],
        choices: [
          {
            id: 'include-new-stakeholder',
            label: '購買部長を正式に巻き込み、要件を再確認する',
            summary: '遅れた対応を謝罪し、改めて要件確認の場を設ける。',
            effects: { quality: 5, cost: -4, schedule: -6, stakeholder: 8, morale: 0 },
            explanation:
              '重要なステークホルダーを後から取り込む際は、謝罪と誠実な対応が信頼回復の鍵です。スケジュール遅延より関係修復を優先すべきです。',
            pmBokTags: ['ステークホルダー管理', 'コミュニケーション管理', '統合管理'],
            consequence: '購買部長との信頼関係が構築され、後の承認プロセスが円滑になる。',
          },
          {
            id: 'minimize-change',
            label: '最小限の説明で理解を得て、決定済み事項は守る',
            summary: '影響の小さい範囲で購買部長を納得させ、変更を最小化する。',
            effects: { quality: 2, cost: -1, schedule: -2, stakeholder: -3, morale: 1 },
            explanation:
              '変更を最小化する姿勢はスケジュールを守りますが、購買部長の不満が残ると承認フェーズで問題になる可能性があります。',
            pmBokTags: ['スコープ管理', 'ステークホルダー管理'],
            consequence: '短期的には影響が小さいが、購買部長の反発リスクが残る。',
          },
          {
            id: 'redo-stakeholder-map',
            label: 'ステークホルダーマップを作り直し、全員を再整理する',
            summary: '関係者全員の役割・影響力を改めて整理し、漏れを防ぐ。',
            effects: { quality: 6, cost: -3, schedule: -5, stakeholder: 6, morale: 2 },
            explanation:
              'ステークホルダー分析を改めて実施することは今後のプロジェクトの透明性を高めます。「誰が意思決定者か」の明確化は根本的なリスク管理です。',
            pmBokTags: ['ステークホルダー管理', '統合管理', 'リスク管理'],
            consequence: '関係者の整理が進み、今後の合意形成が安定する。',
          },
        ],
      },
      {
        id: 'requirements-verbal-change',
        learningImage: { src: '/game-assets/meeting-minutes.png', caption: '議事録サンプル — 口頭で決まったことも必ず文書に残しましょう' },
        title: '会議で口頭の仕様変更が発生した',
        description:
          '顧客が会議中に「この画面に追加の検索条件を入れたい」と口頭で要求。議事録で共有するか、この場で了解済みとするかが選択肢です。',
        pmTip: 'PMの仕事②：**変更を記録する**。口頭で決まったことは後で「言った・言わない」のトラブルになりがちです。PMは**変更内容を必ず文書に残す**習慣が大切です。',
        clientChat: true,
        docs: [
          {
            type: '議事録',
            title: '会議メモ',
            content: `顧客: 「検索に追加の絞り込み条件も入れたい」
PM: 仕様変更の影響を確認する必要あり
担当: 仕様変更範囲を翌日までに取りまとめる`,
          },
        ],
        choices: [
          {
            id: 'formalize-change',
            label: '議事録に書き、影響範囲を再見積りする',
            summary: '変更要求を正式化し、工数と納期への影響を確認する。',
            effects: { quality: 6, cost: -5, schedule: -5, stakeholder: 4, morale: 1 },
            explanation:
              'PMの役割は変更の管理です。口頭合意だけで進めると「言った・言わない」紛争に発展するため、議事録で正式に管理します。',
            pmBokTags: ['変更管理', '品質管理', 'コミュニケーション管理'],
            consequence: '後工程でスコープ管理が効き、変更の手戻りを抑制できる。',
            flag: 'change-documented',
          },
          {
            id: 'accept-verbally',
            label: 'この場で了解済みとし、先に進める',
            summary: '議事録を省略して顧客の要求を受け入れる。',
            effects: { quality: -8, cost: 0, schedule: 5, stakeholder: 3, morale: 0 },
            explanation:
              '「とりあえず進める」は短期的に顧客満足度を保てるかもしれませんが、日本の現場では後の責任追及や手戻りが大きくなりやすい判断です。',
            pmBokTags: ['コミュニケーション管理', 'リスク管理'],
            consequence: '後で要件ずれが表面化しやすい。',
          },
          {
            id: 'decline-change',
            label: '現時点では追加を見送ると顧客に説明する',
            summary: '追加要求を受け入れず、既存スコープに集中する。',
            effects: { quality: 2, cost: 0, schedule: 0, stakeholder: -6, morale: 0 },
            explanation:
              'スコープコントロールは重要ですが、顧客の関心度が高い場合は説明不足が信頼低下につながります。PMは代替案も提示する必要があります。',
            pmBokTags: ['スコープ管理', 'ステークホルダー管理'],
            consequence: '顧客満足度は下がるが、納期とコストは守りやすくなる。 ',
          },
        ],
      },
      {
        id: 'requirements-overtime-estimate',
        learningImage: { src: '/game-assets/wbs.png', caption: 'WBS（作業分解構造） — 工数見積もりの基本フレームワーク' },
        title: '見積もりが「残業前提」で組まれていることが発覚した',
        description:
          'スケジュールを精査していると、全員が定時ベースではなく毎日2〜3時間の残業を暗黙に前提として工程が組まれていることが発覚。このまま進めると、開始初日から全員がオーバーワーク確定の計画になっています。',
        pmTip: 'PMの仕事：見積もりは「**定時ベース＋バッファ**」で組む。**残業を前提にした計画**は最初から破綻が約束されています。',
        docs: [{ type: 'リスク管理表', title: 'スケジュール精査レポート', content: '発覚: 全工程が1日10時間稼働前提\n定時(8h)ベースに換算: 全フェーズが1.3倍に膨れる\nリスク: 開始初日から全員オーバーワーク' }],
        choices: [
          { id: 'accept-overtime-plan', label: 'チームは若いし頑張れる——このまま進める', summary: '残業前提のスケジュールを受け入れる。', effects: { quality: -4, cost: -2, schedule: 3, stakeholder: 1, morale: -10 }, explanation: '残業前提の計画は序盤から士気と体力を削り、後半に深刻な品質問題を引き起こします。持続可能な計画こそが品質の基盤です。', pmBokTags: ['スケジュール管理', 'リスク管理', '資源管理'] },
          { id: 'recalculate-schedule', label: '定時ベースで計画を組み直し、現実的なスケジュールを出す', summary: '持続可能な稼働率を前提に計画を修正する。', effects: { quality: 6, cost: -3, schedule: -5, stakeholder: -1, morale: 6 }, explanation: '見積もりは定時(80%稼働)を前提に組み直すべきです。余白こそが品質の安全装置であり、チームを守るPMの最初の仕事です。', pmBokTags: ['スケジュール管理', '資源管理', 'コスト管理'] },
          { id: 'add-buffer', label: 'バッファを明示的に追加してスコープを調整する', summary: 'リスクバッファを確保した上で顧客と再合意する。', effects: { quality: 5, cost: -4, schedule: -3, stakeholder: 2, morale: 4 }, explanation: 'バッファの明示は計画の健全性を高めます。顧客への丁寧な説明と合意が前提ですが、後の手戻りを防ぐ最善の判断です。', pmBokTags: ['スケジュール管理', 'リスク管理', 'ステークホルダー管理'] },
        ],
      },
    ],
  },
  {
    id: 'basicDesign',
    label: '基本設計',
    description: '外部設計を固め、顧客と機能仕様を詰める段階。スコープ管理とベンダー調整が鍵です。',
    scenarios: [
      {
        id: 'basicDesign-scope-creep',
        learningImage: { src: '/game-assets/wbs.png', caption: 'WBS（作業分解構造） — 追加要求が出たらWBSで工数への影響を可視化します' },
        title: '顧客が「ついでにこの機能も」と追加要求',
        description:
          '基本設計の途中で顧客から「ついでに追加機能もほしい」と要望が来た。変更管理としてどう対応するかが問われます。',
        pmTip: 'PMの仕事⑥：**追加要求を管理する**。顧客から「ついでに〇〇も」と言われることはよくあります。PMは**工数とコストへの影響を確認**してから判断します。',
        clientChat: true,
        docs: [
          {
            type: 'メール',
            title: '顧客追加要求メール',
            content: `顧客: 「ついでに追加機能も納期を変えずに対応できますか？」`,
          },
        ],
        choices: [
          {
            id: 'accept-without-review',
            label: '追加を受け入れ、現行スケジュールで対応する',
            summary: '顧客の要求を優先しつつ、今の体制で進める。',
            effects: { quality: -8, cost: 0, schedule: -5, stakeholder: 6, morale: -4 },
            explanation:
              'スコープクリープをそのまま受けると品質と士気に悪影響が出やすいです。PMは変更の影響を明確にして合意を取るべきです。',
            pmBokTags: ['スコープ管理', '品質管理', 'ステークホルダー管理'],
            consequence: '後工程でバグや手戻りが増えるリスクがあります。',
          },
          {
            id: 'reestimate-change',
            label: '工数と納期を再見積りし、変更合意を取る',
            summary: '変更管理プロセスを活用し、影響範囲を明確にする。',
            effects: { quality: 6, cost: -8, schedule: -8, stakeholder: 3, morale: 1 },
            explanation:
              'PMは変更要求をそのまま進めるのではなく、工数と納期を再見積りして顧客と合意すべきです。日本の現場ではこの確認が後の火消しを防ぎます。',
            pmBokTags: ['変更管理', 'コスト管理', '調達管理'],
            consequence: 'スコープの透明性が高まり、プロジェクト全体の信頼性が向上します。',
            flag: 'scope-managed',
          },
          {
            id: 'decline-addition',
            label: '今回は見送りとし、現状スコープを優先する',
            summary: '既存のスコープを守り、納期と品質に集中する。',
            effects: { quality: 4, cost: 0, schedule: 0, stakeholder: -6, morale: 2 },
            explanation:
              '納期と品質を守るために、追加要求を見送る選択も妥当です。ただし、顧客への説明と代替案提示が欠かせません。',
            pmBokTags: ['スコープ管理', 'コミュニケーション管理', '品質管理'],
            consequence: '納期優先だが顧客満足度は下がる可能性があります。',
          },
        ],
      },
      {
        id: 'basicDesign-security-finding',
        learningImage: { src: '/game-assets/risk-matrix.png', caption: 'リスクマトリクス — 影響度×発生確率でリスクの優先度を判断します' },
        title: 'セキュリティ診断で重大リスクが指摘された——設計を修正しなければならない',
        description:
          '外部セキュリティ診断の結果、現在の設計にSQLインジェクション対策の漏れと権限制御の設計ミスが発覚。専門家から「このままリリースすると情報漏洩リスクがある」と指摘されました。',
        pmTip: 'PMの仕事⑦：**リスクを判断する**。セキュリティ問題が発覚したとき、PMは「**いつ・どう対処するか**」の優先度を決める役割があります。',
        docs: [
          {
            type: 'リスク管理表',
            title: 'セキュリティ診断レポート（抜粋）',
            content: `重大度: 高
指摘1: 入力バリデーション不足によるSQLインジェクションリスク
指摘2: 管理画面の権限制御が未実装
対応期限: 次フェーズ開始前`,
          },
        ],
        choices: [
          {
            id: 'fix-now',
            label: '今フェーズで設計を修正し、セキュリティを確保する',
            summary: '設計段階で脆弱性を閉じ、後工程に問題を持ち込まない。',
            effects: { quality: 10, cost: -6, schedule: -6, stakeholder: 4, morale: -1 },
            explanation:
              'セキュリティ問題は早期発見・早期対処が原則です。設計フェーズで対処することで、後の修正コストを大幅に削減できます。',
            pmBokTags: ['品質管理', 'リスク管理', '統合管理'],
            consequence: '後工程の品質リスクが大幅に下がる。',
          },
          {
            id: 'defer-to-next-phase',
            label: '詳細設計フェーズで対応することにし、今は進める',
            summary: 'リスクを把握した上で次工程での修正を計画する。',
            effects: { quality: -4, cost: -2, schedule: 4, stakeholder: 0, morale: 0 },
            explanation:
              '対応を先送りすると修正コストは増加しますが、計画的な対処を明示することでリスクを管理できます。ただし放置は厳禁です。',
            pmBokTags: ['リスク管理', 'スケジュール管理'],
            consequence: '対応が遅れるほど修正工数が増える。リスク管理表への記載が必須。',
          },
          {
            id: 'partial-fix',
            label: '重大度の高い指摘だけ今すぐ修正し、残りは後回しにする',
            summary: 'クリティカルなリスクのみ優先対処し、軽微なものは後続フェーズへ。',
            effects: { quality: 6, cost: -4, schedule: -3, stakeholder: 2, morale: 1 },
            explanation:
              'リスク優先度に基づいてトリアージする判断は、リソースが限られた現場では合理的です。残リスクの明示と監視が前提になります。',
            pmBokTags: ['リスク管理', '品質管理', 'コスト管理'],
            consequence: '重大なリスクは閉じられるが、残課題の管理が必要になる。',
          },
        ],
      },
      {
        id: 'basicDesign-ui-disagreement',
        learningImage: { src: '/game-assets/stakeholder-map.png', caption: 'ステークホルダーマップ — 対立の根本は関係者の立場の違いです。整理して解消しましょう' },
        title: 'UIデザインで顧客部門と情シスの意見が対立——どちらも引かない',
        description:
          'UIモックアップを顧客部門に提示したところ、「シンプルすぎる」「もっと機能を詰め込んでほしい」という声が続出。一方、情報システム部門は「これ以上複雑にするとメンテナンスが困難」と主張し、双方が折れない状況になっています。',
        pmTip: 'PMの仕事⑧：**意見を調整する**。「誰が正しいか」より「**どうすれば全員が納得できるか**」を考えるのがPMらしい判断です。',
        docs: [
          {
            type: '議事録',
            title: 'UIレビュー会議議事録',
            content: `顧客部門: 「この画面では業務が回らない。もっと情報を表示してほしい」
情シス部門: 「画面要素を増やすと開発コストが倍増する。現実的ではない」
PM: 双方の主張を整理中。優先基準が必要`,
          },
        ],
        choices: [
          {
            id: 'prototype-both',
            label: 'プロトタイプを2案作り、現場でユーザーテストをする',
            summary: '実際の利用者に触れてもらい、客観的なフィードバックで判断する。',
            effects: { quality: 7, cost: -5, schedule: -4, stakeholder: 7, morale: 2 },
            explanation:
              '意見の対立を主観で解決しようとするより、実際のユーザーに判断させる方法は客観的な根拠を提供し、双方を納得させやすいです。',
            pmBokTags: ['品質管理', 'ステークホルダー管理', 'スコープ管理'],
            consequence: '客観的なデータで合意形成ができる。コストと時間がかかる。',
          },
          {
            id: 'phased-ui',
            label: 'フェーズ1はシンプルに、追加機能は後続バージョンで対応する',
            summary: '段階的なリリース計画を提案し、双方の要求を時系列で満たす。',
            effects: { quality: 5, cost: -2, schedule: -2, stakeholder: 5, morale: 1 },
            explanation:
              '段階的リリース計画はスコープを守りながら両者の要求を時間軸で解決する実用的なアプローチです。顧客への丁寧な説明が重要です。',
            pmBokTags: ['スコープ管理', '統合管理', 'ステークホルダー管理'],
            consequence: '双方が妥協できる着地点になりやすい。将来の追加開発が発生する。',
          },
          {
            id: 'accept-complex-ui',
            label: '顧客要望を全て取り込んだ複雑なUIで設計を進める',
            summary: '顧客満足を最優先にし、技術的な複雑さは許容する。',
            effects: { quality: -5, cost: -8, schedule: -5, stakeholder: 4, morale: -4 },
            explanation:
              '顧客の全要求を無条件で受け入れると、開発・テスト・メンテナンスコストが急増します。PMはQCDのバランスを守る立場から代替案を示すべきです。',
            pmBokTags: ['スコープ管理', 'コスト管理', '品質管理'],
            consequence: '顧客は喜ぶが、開発コストと品質リスクが大幅に増加する。',
          },
        ],
      },
      {
        id: 'basicDesign-review-fail',
        learningImage: { src: '/game-assets/meeting-minutes.png', caption: '議事録サンプル — レビューの指摘事項は必ず記録し、対応状況を追跡します' },
        title: '設計レビューで自社品質基準を複数箇所で満たせていないと判明',
        description:
          '自社の設計品質チェックリストを適用したところ、例外処理の設計漏れ・データ整合性チェックの欠如・ログ設計の不備など複数の問題が発覚。このまま詳細設計に進んでよいか判断が必要です。',
        pmTip: 'PMの仕事⑨：**品質を守る**。設計の問題を早めに直すほど**後の修正コストは小さく**て済みます。PMは**品質ゲート**を守る役割があります。',
        docs: [
          {
            type: '課題管理表',
            title: '設計品質レビュー指摘事項',
            content: `指摘数: 12件（重大3件、中程度6件、軽微3件）
主な指摘: 例外処理設計漏れ、データ整合性チェック未定義、ログ設計不備
対応方針: 未定`,
          },
        ],
        choices: [
          {
            id: 'fix-before-next-phase',
            label: '重大・中程度の指摘を全て修正してから次工程に進む',
            summary: '品質基準を満たしてから詳細設計に着手する。',
            effects: { quality: 10, cost: -5, schedule: -6, stakeholder: 2, morale: 1 },
            explanation:
              '上流での品質確保は、後工程での手戻りコストを大幅に削減します。品質ゲートを守る判断がプロジェクト全体の安定につながります。',
            pmBokTags: ['品質管理', '統合管理', 'リスク管理'],
            consequence: '後工程のバグが減り、テスト工程の安定性が高まる。',
            flag: 'design-reviewed',
          },
          {
            id: 'proceed-with-plan',
            label: '重大指摘のみ修正し、残りは詳細設計中に対応する',
            summary: 'クリティカルな問題だけ解決し、中程度以下は後工程で対処する。',
            effects: { quality: 3, cost: -2, schedule: -2, stakeholder: 1, morale: 1 },
            explanation:
              'トリアージによる優先対処は現実的ですが、中程度の問題も放置すると後工程での修正コストが積み上がるリスクがあります。',
            pmBokTags: ['品質管理', 'スケジュール管理', 'リスク管理'],
            consequence: '重大問題は解消されるが、中程度の問題が後工程で顕在化するリスクが残る。',
          },
          {
            id: 'proceed-as-is',
            label: 'スケジュール優先で、指摘を受けたまま次工程に進む',
            summary: '品質問題を後回しにし、納期を守る。',
            effects: { quality: -10, cost: 0, schedule: 5, stakeholder: -2, morale: -3 },
            explanation:
              '品質問題を無視して進むことは、後工程での手戻りとバグ増加につながります。PMは「品質の負債」がチームに与える影響を理解すべきです。',
            pmBokTags: ['品質管理', 'リスク管理'],
            consequence: '後工程でバグや手戻りが多発するリスクが高まる。',
          },
        ],
      },
      {
        id: 'basicDesign-vendor-interface',
        learningImage: { src: '/game-assets/subcontract1.png', caption: '多重下請け構造図 — ベンダー間の連携がなぜ複雑になるか' },
        title: '協力会社間のインターフェース仕様に齟齬が見つかる',
        description:
          '別ベンダーが担当する機能の結合箇所で、データ定義や遷移の仕様が異なることが判明。まず現状把握か責任追及かが分岐します。',
        pmTip: 'PMの仕事⑩：**問題を整理する**。ベンダー間で問題が起きたとき、PMは**責任追及より先に**「何が起きているか」を整理して関係者に共有します。',
        docs: [
          {
            type: '課題管理表',
            title: 'ベンダー間インターフェース課題',
            content: `課題: 受け渡しデータ形式が不一致
担当: ベンダーA/Bの設計調整
期限: 2営業日以内`,
          },
        ],
        choices: [
          {
            id: 'blame-vendors',
            label: '責任先を明確にし、対応を急がせる',
            summary: '齟齬の原因を追及し、双方に改善を求める。',
            effects: { quality: 0, cost: 0, schedule: -3, stakeholder: -4, morale: -3 },
            explanation:
              '責任追及を優先すると短期的には関係が悪化し、協力会社の協力を得にくくなります。PMはまず現状と影響を整理すべきです。',
            pmBokTags: ['コミュニケーション管理', '調達管理', 'リスク管理'],
            consequence: '関係性が悪化し、後の調整コストが増えるかもしれません。',
          },
          {
            id: 'align-and-plan',
            label: '現状を把握し、再計画して合意を取り直す',
            summary: '影響を整理してメンバーと顧客で再合意する。',
            effects: { quality: 8, cost: -4, schedule: -5, stakeholder: 5, morale: 1 },
            explanation:
              'PMは炎上火消しの際にまず現状を正確に把握し、関係者合意を得るのが定石です。根回しを含めた調整が重要です。',
            pmBokTags: ['統合管理', 'リスク管理', 'ステークホルダー管理'],
            consequence: 'プロジェクト全体の安定性が高まります。',
          },
          {
            id: 'accept-risk',
            label: 'このまま進めて問題が出た時に対応する',
            summary: 'いったん現行計画を維持し、リスクを後で吸収する。',
            effects: { quality: -6, cost: 0, schedule: 5, stakeholder: -2, morale: -2 },
            explanation:
              '問題を先送りするとスケジュールは守れるかもしれませんが、品質と信頼が損なわれる可能性があります。PMはリスクを先に閉じる判断が望ましいです。',
            pmBokTags: ['リスク管理', '品質管理'],
            consequence: '後工程での手戻りが発生しやすくなります。',
          },
        ],
      },
      {
        id: 'basicDesign-similar-project-trap',
        learningImage: { src: '/game-assets/wbs.png', caption: 'WBS（作業分解構造） — 前案件の実績は参考値。現チームのスキルで補正するのがPMの責任です' },
        title: '「前の案件と同じで」見積もったら、全然違うチームで再現しなかった',
        description:
          '前回の類似案件の実績をそのまま流用して見積もりを提出していたが、蓋を開けると今のチームは経験レベルがかなり異なることが発覚。前回は全員がベテランだったが、今回は新卒・第二新卒が半数近くいます。',
        pmTip: 'PMの仕事：見積もりは「**誰がやるか**」で変わる。**過去実績は参考値**であり、現チームのスキルと経験で補正するのがPMの責任です。',
        docs: [{ type: '課題管理表', title: '見積もり精度検証レポート', content: '前回実績: ベテラン5名チーム\n今回体制: 新卒・第二新卒3名＋ベテラン2名\n前回比工数試算: 1.6〜1.8倍に膨れる可能性\n現状: 見積もり修正が急務' }],
        choices: [
          { id: 'accept-old-estimate', label: '前の案件実績を信じてそのまま進める', summary: '見積もりを変えずに進む。', effects: { quality: -6, cost: -5, schedule: -5, stakeholder: -2, morale: -5 }, explanation: '異なるスキルレベルのチームに同じ見積もりを適用するのは危険です。後半で必ず手戻りと遅延が発生します。PMは現実を直視した判断が求められます。', pmBokTags: ['資源管理', 'コスト管理', 'スケジュール管理'] },
          { id: 'recalibrate-estimate', label: '現チームのスキルを評価して見積もりを補正する', summary: '現実のチーム力に合った計画に修正する。', effects: { quality: 5, cost: -4, schedule: -4, stakeholder: -1, morale: 3 }, explanation: '見積もりはチームの実力に合わせて補正することが基本です。顧客への説明は必要ですが、現実的な計画が後の信頼を守ります。', pmBokTags: ['資源管理', 'コスト管理', 'スケジュール管理'] },
          { id: 'add-mentor', label: 'ベテランをメンター役につけて、全体のスキルを底上げする', summary: '新人サポート体制を作り、生産性を上げながら進める。', effects: { quality: 4, cost: -5, schedule: -2, stakeholder: 1, morale: 5 }, explanation: 'メンタリングは中長期的にチームの実力を高めます。育成投資とみなすことで、今後の見積もり精度も向上します。', pmBokTags: ['資源管理', '品質管理', '統合管理'] },
        ],
      },
    ],
  },
  {
    id: 'detailedDesign',
    label: '詳細設計・製造',
    description: '内部設計と実装のフェーズ。上流遅延のしわ寄せや協力会社の進捗確認が重要です。',
    scenarios: [
      {
        id: 'detailedDesign-crunch',
        learningImage: { src: '/game-assets/wbs.png', caption: 'WBS（作業分解構造） — 上流遅延がどこに波及するかWBSで確認しましょう' },
        title: '上流設計の遅れで製造工程が圧迫されている',
        description:
          '基本設計が遅延し、製造に割ける期間が短くなっている。人員追加かスコープ削減か、あるいは残業で対応するか判断します。',
        pmTip: 'PMの仕事⑪：**QCDのバランスをとる**。QCDとは**品質・コスト・納期**の3つです。どれを優先するかを判断しチームに方針を示すのがPMの役割です。',
        docs: [
          {
            type: '課題管理表',
            title: '製造工程スケジュール圧迫',
            content: `担当: PL
状況: 詳細設計完了遅延により製造期間が短縮
対応: 体制・スコープ・品質の見直し`,
          },
        ],
        choices: [
          {
            id: 'hire-additional',
            label: '協力会社を増員して納期を守る',
            summary: '人員を投入し、スケジュールの余裕を維持する。',
            effects: { quality: 2, cost: -12, schedule: 8, stakeholder: 3, morale: -2 },
            explanation:
              'D（納期）を守るための増員は、日本のSIer現場でもよく使われる手法です。ただしC（コスト）と士気への影響を考慮する必要があります。',
            pmBokTags: ['資源管理', 'スケジュール管理', 'コスト管理'],
          },
          {
            id: 'cut-scope',
            label: 'スコープを減らし、品質と納期を守る',
            summary: '不要な機能を削り、工数と品質の余裕を確保する。',
            effects: { quality: 6, cost: 5, schedule: 10, stakeholder: -4, morale: 1 },
            explanation:
              'PMはスコープをコントロールしてQCDのバランスを取ることが重要です。顧客への説明と合意形成が前提になります。',
            pmBokTags: ['スコープ管理', '品質管理', 'ステークホルダー管理'],
          },
          {
            id: 'force-overtime',
            label: '残業で乗り切って工程を埋める',
            summary: 'メンバーの労力でスケジュールを維持する。',
            effects: { quality: -6, cost: 0, schedule: 10, stakeholder: 2, morale: -12 },
            explanation:
              '短期的には納期に近づける可能性がありますが、チーム士気と品質に大きな代償があります。日本の現場では過労が炎上につながるケースが多いです。',
            pmBokTags: ['資源管理', '品質管理', 'コミュニケーション管理'],
          },
        ],
      },
      {
        id: 'detailedDesign-skill-gap',
        learningImage: { src: '/game-assets/org-chart.png', caption: 'プロジェクト組織図 — 誰がどの役割を担うか。スキルと責任の対応を整理しましょう' },
        title: '実装段階でコアPGのスキル不足が判明——想定の半分しか進んでいない',
        description:
          '進捗確認を行ったところ、PG遠藤さんが担当する機能の実装が想定の半分しか進んでいないことが判明。コードレビューで基礎的な実装ミスが多く、スキルレベルが採用時の評価と大きく乖離していることが疑われます。',
        pmTip: 'PMの仕事⑫：**チームを補強する**。メンバーのスキル不足に気づいたとき、PMは**責めるのではなくどうフォローするか**を考えます。',
        docs: [
          {
            type: '課題管理表',
            title: 'PG進捗乖離報告',
            content: `担当: 遠藤PG
想定進捗: 60%
実際の進捗: 28%
指摘: コードレビューで基礎的な実装ミスが多数
対応: スキル評価と補強策の検討が必要`,
          },
        ],
        choices: [
          {
            id: 'pair-programming',
            label: 'ベテランメンバーとペアプロを組み、スキルをフォローする',
            summary: '即戦力と組み合わせてスキルギャップを補完する。',
            effects: { quality: 5, cost: -4, schedule: -4, stakeholder: 1, morale: 3 },
            explanation:
              'ペアプログラミングはスキル移転と品質向上の両立に有効です。コストはかかりますが、中長期的なチーム力強化につながります。',
            pmBokTags: ['資源管理', '品質管理', 'コミュニケーション管理'],
            consequence: 'スキル移転が進み、後半の進捗が改善する可能性がある。',
          },
          {
            id: 'reassign-tasks',
            label: '担当を変更し、スキルに合ったタスクに再配置する',
            summary: '得意分野に振り直し、不足部分を他のメンバーが担当する。',
            effects: { quality: 4, cost: -3, schedule: -5, stakeholder: 0, morale: -2 },
            explanation:
              'タスクの再配置は品質リスクを下げますが、当人のモチベーション低下と他メンバーの負荷増加に注意が必要です。',
            pmBokTags: ['資源管理', 'スケジュール管理', '品質管理'],
            consequence: 'リスクは下がるが、チームバランスへの影響を考慮する必要がある。',
          },
          {
            id: 'ignore-and-monitor',
            label: '追加確認せず、期限まで様子を見る',
            summary: '特別な対処をせずに進捗を観察する。',
            effects: { quality: -8, cost: 0, schedule: -6, stakeholder: -2, morale: -3 },
            explanation:
              'スキル不足を放置すると、品質問題がテスト工程で大量に表面化します。PMは早期に状況を把握し介入することが求められます。',
            pmBokTags: ['品質管理', 'リスク管理'],
            consequence: 'テスト工程でのバグが多発するリスクが高い。',
          },
        ],
      },
      {
        id: 'detailedDesign-external-api-change',
        learningImage: { src: '/game-assets/risk-matrix.png', caption: 'リスクマトリクス — 外部変更は影響度×発生確率でリスク優先度を判断します' },
        title: '連携する外部システムが突然API仕様変更を通知してきた',
        description:
          '実装中の外部システム連携部分について、ベンダーから「来月より認証方式をOAuth2.0に変更する」と通知が届いた。現在の実装が全て変更対象になる可能性があり、工数への影響が不明です。',
        pmTip: 'PMの仕事⑬：**変化に対応する**。外部からの予期しない変更が来たとき、PMは**冷静に影響を確認**して計画を調整します。',
        docs: [
          {
            type: 'メール',
            title: '外部ベンダーからのAPI変更通知',
            content: `外部ベンダー: 「2024年X月X日より認証方式をAPIキー方式からOAuth2.0に変更します。移行期間は1ヶ月です。対応のご準備をお願いします」
PM: 影響範囲の確認が急務`,
          },
        ],
        choices: [
          {
            id: 'assess-and-adapt',
            label: '影響範囲を即座に調査し、設計変更を計画する',
            summary: '変更の影響を確認し、スケジュールを調整して対応する。',
            effects: { quality: 6, cost: -5, schedule: -5, stakeholder: 3, morale: 0 },
            explanation:
              '外部依存の変更はリスク管理の典型的なシナリオです。早期に影響を確認し、顧客と計画を再合意することが正しい対応です。',
            pmBokTags: ['リスク管理', '調達管理', '統合管理'],
            consequence: '正確な影響把握により、後工程の混乱を防げる。',
          },
          {
            id: 'negotiate-with-vendor',
            label: '外部ベンダーに移行期限の延長を交渉する',
            summary: '変更タイミングをプロジェクトの都合に合わせるよう交渉する。',
            effects: { quality: 4, cost: -2, schedule: 2, stakeholder: 2, morale: 2 },
            explanation:
              '外部ベンダーとの交渉でスケジュールを調整できる場合もあります。PMは仕様変更をただ受け入れるのではなく、条件交渉も視野に入れるべきです。',
            pmBokTags: ['調達管理', 'ステークホルダー管理', 'コミュニケーション管理'],
            consequence: '交渉が成功すれば工数増を回避できる可能性がある。',
          },
          {
            id: 'continue-old-spec',
            label: '旧仕様のまま実装を続け、後で対応することにする',
            summary: 'まず完成を優先し、API変更対応は後回しにする。',
            effects: { quality: -8, cost: 0, schedule: 3, stakeholder: -4, morale: -2 },
            explanation:
              '旧仕様での実装を続けると、後で全面的な修正が必要になり工数が倍増するリスクがあります。技術的負債の典型的なパターンです。',
            pmBokTags: ['リスク管理', '品質管理'],
            consequence: 'リリース直前に大規模な修正が発生するリスクが高い。',
          },
        ],
      },
      {
        id: 'detailedDesign-env-delay',
        learningImage: { src: '/game-assets/subcontract2.png', caption: '多重下請け構造図 — 環境遅延の背景にベンダー間の調整問題がないか確認しましょう' },
        title: 'テスト環境の整備が大幅に遅れ——開発と並行できなくなった',
        description:
          'インフラチームが担当するテスト環境の構築が、社内手続きとライセンス調達の遅延で当初予定より3週間遅れることが判明。開発が終わってもすぐにテストに移れない状況で、スケジュール全体への影響が懸念されます。',
        pmTip: 'PMの仕事⑭：**段取りをする**。開発に必要な環境が整っていないとき、PMは**代替策を素早く考えて**チームが止まらないようにします。',
        docs: [
          {
            type: '課題管理表',
            title: 'テスト環境遅延報告',
            content: `原因: 社内調達手続き遅延・ライセンス承認待ち
遅延: 当初予定より3週間
影響: テスト開始時期が後ろ倒し
現在の開発進捗: 予定通り`,
          },
        ],
        choices: [
          {
            id: 'accelerate-env-setup',
            label: 'インフラチームに優先対応を要請し、遅延を最小化する',
            summary: '社内交渉でテスト環境の準備を前倒しする。',
            effects: { quality: 3, cost: -3, schedule: 3, stakeholder: 2, morale: 1 },
            explanation:
              'PMは社内調整力を発揮し、インフラチームとの交渉で遅延を圧縮することが重要です。優先度の主張と影響の説明が鍵です。',
            pmBokTags: ['スケジュール管理', '統合管理', 'コミュニケーション管理'],
            consequence: '遅延が圧縮され、テスト工程への影響が最小化される。',
          },
          {
            id: 'use-dev-env-for-test',
            label: '開発環境を流用して簡易テストを先行する',
            summary: '本来のテスト環境が整うまで、開発環境で単体テストを進める。',
            effects: { quality: -4, cost: 0, schedule: 4, stakeholder: 0, morale: 2 },
            explanation:
              '開発環境でのテストは、本番環境との差異によるリスクがあります。ただし空白期間を減らす効果はあるため、リスクを把握した上で実施する場合もあります。',
            pmBokTags: ['品質管理', 'スケジュール管理', 'リスク管理'],
            consequence: '進捗は維持されるが、環境差異によるテスト精度の低下リスクがある。',
          },
          {
            id: 'adjust-schedule',
            label: 'スケジュール全体を見直し、テスト工程を後ろ倒しにする',
            summary: '現実に合わせてプロジェクト計画を修正し、顧客に報告する。',
            effects: { quality: 4, cost: 0, schedule: -8, stakeholder: -3, morale: 0 },
            explanation:
              '現実に合わせてスケジュールを修正する判断は誠実ですが、顧客への影響説明と再合意が必須です。PMは問題を抱え込まず透明性を保つべきです。',
            pmBokTags: ['スケジュール管理', 'コミュニケーション管理', 'ステークホルダー管理'],
            consequence: '品質リスクは下がるが、納期への影響を顧客に説明する必要がある。',
          },
        ],
      },
      {
        id: 'detailedDesign-progress-check',
        learningImage: { src: '/game-assets/wbs.png', caption: 'WBS（作業分解構造） — 「順調です」ではなくWBSで成果物ベースの進捗を確認しましょう' },
        title: '協力会社の進捗が「順調です」だが実態が見えない',
        description:
          '二次請けのSESから進捗報告はあるが成果物やエビデンスが不足している。信用するか確認するかの判断が求められます。',
        pmTip: 'PMの仕事⑮：**実態を把握する**。「順調です」という報告を**鵜呑みにせず**、**証拠で確認する**のがPMの習慣です。これが後の炎上を防ぎます。',
        docs: [
          {
            type: 'メール',
            title: '進捗報告メール',
            content: `協力会社: 「進捗は順調です。設計と実装は予定通り進んでいます。」
PM: 実装成果物の共有を依頼`,
          },
        ],
        choices: [
          {
            id: 'request-deliverables',
            label: '成果物を確認し、見える化する',
            summary: '実績をエビデンスベースで確認し、リスクを減らす。',
            effects: { quality: 8, cost: -3, schedule: -2, stakeholder: 4, morale: 1 },
            explanation:
              'PMは報連相だけでなくエビデンスを基に進捗を管理します。見える化ができれば後工程の品質リスクを減らせます。',
            pmBokTags: ['品質管理', 'コミュニケーション管理', '統合管理'],
          },
          {
            id: 'trust-report',
            label: '報告を信頼し、特別な確認はしない',
            summary: '協力会社の自己申告を前提に進める。',
            effects: { quality: -8, cost: 0, schedule: 5, stakeholder: 1, morale: 0 },
            explanation:
              '信頼は重要ですが、現場では自己申告のみで進めると手戻り発生リスクが高まります。PMはリスクを早期に検知する仕組みを持つべきです。',
            pmBokTags: ['コミュニケーション管理', 'リスク管理'],
          },
          {
            id: 'escalate-risk',
            label: '上長にリスクをエスカレーションし、追加確認を依頼する',
            summary: '不安を共有し、上長と協力して対処策を検討する。',
            effects: { quality: 4, cost: 0, schedule: -3, stakeholder: 3, morale: 2 },
            explanation:
              '報連相を重視し、リスクを抱え込まずにエスカレーションするのは日本のPMでも正解視される対応です。',
            pmBokTags: ['ステークホルダー管理', 'リスク管理', '統合管理'],
          },
        ],
      },
      {
        id: 'detailedDesign-no-questions-culture',
        learningImage: { src: '/game-assets/hourenso.png', caption: '報連相フロー図 — 「相談」できる環境が品質を守ります' },
        title: '「聞いたら怒られそう」——チームに質問できない空気が漂っている',
        description:
          'PMが忙しそうにしているせいか、メンバーが分からないことを質問せず、独自に解釈して進めていることが発覚。確認せずに実装した箇所でいくつかの設計ミスが見つかり始めています。',
        pmTip: 'PMの仕事：**質問できる空気を作る**。**心理的安全性**がないと、問題は隠れ、手戻りが増えます。「**聞きやすい環境**」はPMが作ります。',
        docs: [{ type: '課題管理表', title: 'ミス原因分析', content: '発覚したミスの内訳:\n- 確認せず独自解釈で実装: 4件\n- 仕様不明でとりあえず作った: 3件\nメンバーの声: 「忙しそうで聞けなかった」' }],
        choices: [
          { id: 'blame-members', label: '確認しない方が悪い——責任を明確にする', summary: 'メンバーの確認不足を指摘し、再発防止を命じる。', effects: { quality: -3, cost: 0, schedule: -2, stakeholder: 0, morale: -8 }, explanation: '責任追及は問題を隠蔽する文化を強化します。「怒られるから言わない」という悪循環が生まれ、以後ますます問題が見えなくなります。', pmBokTags: ['コミュニケーション管理', 'リスク管理'] },
          { id: 'create-safe-space', label: '「質問はウェルカム」と明言し、1on1で話しやすい関係を作る', summary: '心理的安全性を意識的に作り、問題の早期発見を促す。', effects: { quality: 7, cost: -2, schedule: -3, stakeholder: 2, morale: 8 }, explanation: '心理的安全性の高いチームは、問題を早期に報告するため手戻りが減ります。PMが「怒らない」姿勢を明確に示すことが最大の予防策です。', pmBokTags: ['コミュニケーション管理', '資源管理', 'リスク管理'] },
          { id: 'regular-standup', label: '毎朝15分のスタンドアップを導入し、詰まっていることを共有する場を作る', summary: '定期的な確認の場で、問題を早期に引き出す。', effects: { quality: 5, cost: -1, schedule: -1, stakeholder: 1, morale: 4 }, explanation: '短い定期同期は問題の早期発見に効果的です。メンバーが「詰まっていること」を共有できる場を作ることで、属人化と独自解釈を防ぎます。', pmBokTags: ['コミュニケーション管理', '品質管理', '統合管理'] },
        ],
      },
    ],
  },
  {
    id: 'testing',
    label: '結合テスト・システムテスト',
    description: 'V字モデルの右側にあたるテスト工程。問題の早期発見と品質判断が鍵です。',
    scenarios: [
      {
        id: 'testing-interface-bug',
        learningImage: { src: '/game-assets/v-model.png', caption: 'V字モデル — 今は結合テスト段階。対応する設計工程と照合しましょう' },
        title: '結合テストでベンダー間のインターフェース齟齬が大量発覚',
        description:
          '結合テストが進んだ段階で、ベンダーAとBのインターフェース定義が大きくズレていることが判明。現状把握と再調整が急務です。',
        pmTip: 'PMの仕事⑯：**問題を収束させる**。テストで大きな問題が発覚したとき、PMは**パニックにならず**原因と影響を整理してから対策を立てます。',
        docs: [
          {
            type: '課題管理表',
            title: 'インターフェース不整合の対応',
            content: `課題: ベンダーA/Bの受け渡し仕様が異なる
影響: 結合テスト停止
対応: 仕様調整と改修の優先度決定`,
          },
        ],
        choices: [
          {
            id: 'resolve-together',
            label: 'まず現状を整理し、再計画を関係者合意で進める',
            summary: '責任追及ではなく調整と合意形成を優先する。',
            effects: { quality: 10, cost: -6, schedule: -8, stakeholder: 6, morale: 2 },
            explanation:
              '日本のPMでは、まず現状把握と関係者合意をとることが火消しの定石です。誰のせいかを追う前に影響範囲を整理します。',
            pmBokTags: ['リスク管理', '調達管理', 'ステークホルダー管理'],
          },
          {
            id: 'blame-vendors-test',
            label: '責任追及で原因を明確にし、強く修正を求める',
            summary: '原因を追及してベンダーに対応を求める。',
            effects: { quality: 0, cost: 0, schedule: -6, stakeholder: -5, morale: -4 },
            explanation:
              '責任追及で短期的に対応圧力はかけられますが、協力会社との信頼と協力姿勢が損なわれるリスクがあります。PMはまず問題の整理を優先すべきです。',
            pmBokTags: ['コミュニケーション管理', '調達管理', 'リスク管理'],
          },
          {
            id: 'accept-degradation',
            label: 'とりあえず現状で進め、リリース後に修正する',
            summary: '品質を一部犠牲にしてスケジュール優先で進行する。',
            effects: { quality: -15, cost: 0, schedule: 10, stakeholder: -6, morale: -5 },
            explanation:
              '「まず納品してから修正」は現場で炎上につながりやすい選択です。PMは品質と顧客信頼を守るために延期の判断も検討すべきです。',
            pmBokTags: ['品質管理', 'ステークホルダー管理'],
          },
        ],
      },
      {
        id: 'testing-performance-fail',
        learningImage: { src: '/game-assets/risk-matrix.png', caption: 'リスクマトリクス — 性能問題の影響度と対応優先度をリスクとして評価します' },
        title: '性能テストで本番想定の負荷に耐えられないことが判明した',
        description:
          'システムテストの性能試験を実施したところ、本番想定の同時接続300ユーザー環境でレスポンスタイムが10秒を超え、画面タイムアウトが多発することが判明。要件定義書には「3秒以内のレスポンス」が明記されており、このまま納品はできない状況です。',
        pmTip: 'PMの仕事⑰：**要件を守る**。性能が要件を満たさないとき、PMは顧客と正直に話し合って対応策を決めます。**隠すより早めの報告**が信頼を守ります。',
        docs: [
          {
            type: 'リスク管理表',
            title: '性能テスト結果報告',
            content: `テスト条件: 同時接続300ユーザー
要件: レスポンスタイム3秒以内
実測: 平均12.4秒、最大28秒
タイムアウト発生率: 23%
ボトルネック: DB検索クエリの最適化不足`,
          },
        ],
        choices: [
          {
            id: 'optimize-now',
            label: 'DBチューニングとクエリ改善に専念し、性能要件を満たす',
            summary: '根本原因であるDBを改善し、要件を達成する。',
            effects: { quality: 10, cost: -6, schedule: -7, stakeholder: 4, morale: -2 },
            explanation:
              '性能要件は非機能要件として顧客との合意事項です。リリース前に達成しなければ検収が通らない可能性があります。早期の改善対応が最善です。',
            pmBokTags: ['品質管理', 'リスク管理', 'ステークホルダー管理'],
            consequence: '性能要件を達成でき、検収リスクが下がる。',
          },
          {
            id: 'negotiate-requirement',
            label: '顧客と要件の緩和を交渉する（5秒以内に変更する）',
            summary: '技術的制約を説明し、性能要件の見直しを提案する。',
            effects: { quality: -2, cost: -2, schedule: 2, stakeholder: -3, morale: 1 },
            explanation:
              '要件緩和の交渉は状況によっては現実的な選択肢ですが、顧客の業務影響を十分に考慮した上で丁寧な説明が必要です。',
            pmBokTags: ['ステークホルダー管理', '品質管理', 'コミュニケーション管理'],
            consequence: '要件緩和により対処できるが、顧客満足度が低下するリスクがある。',
          },
          {
            id: 'release-and-improve',
            label: '現状でリリースし、運用後にパフォーマンス改善をする',
            summary: '性能問題を把握した上でリリースし、後続対応を計画する。',
            effects: { quality: -12, cost: 0, schedule: 8, stakeholder: -6, morale: -3 },
            explanation:
              '性能要件を満たさずにリリースすることは、検収拒否や本番障害の原因になります。PMは品質リスクの重大性を顧客に正確に伝えるべきです。',
            pmBokTags: ['品質管理', 'リスク管理'],
            consequence: '本番でのパフォーマンス問題が発生し、顧客信頼が大きく損なわれるリスクがある。',
          },
        ],
      },
      {
        id: 'testing-regression',
        learningImage: { src: '/game-assets/v-model.png', caption: 'V字モデル — リグレッションはなぜ起きるか。テスト工程と設計の対応関係を確認しましょう' },
        title: 'バグ修正の影響で別機能のリグレッションが多発している',
        description:
          '今週だけで15件のバグを修正したが、その修正が原因で別の機能に新たなバグが発生するリグレッションが9件確認された。修正すれば壊れるというサイクルが続いており、テストが終わらない状況になっています。',
        pmTip: 'PMの仕事⑱：**根本を解決する**。同じ問題が繰り返されるとき、PMは**表面的な対処より根本原因の解決**を選びます。',
        docs: [
          {
            type: '課題管理表',
            title: 'リグレッション発生状況',
            content: `今週のバグ修正数: 15件
リグレッション発生件数: 9件（修正件数の60%）
主な原因: モジュール間の依存関係が複雑で影響範囲の予測が難しい
テスト完了予測: 現状では不明`,
          },
        ],
        choices: [
          {
            id: 'root-cause-analysis',
            label: 'リグレッションの根本原因を分析し、設計を改善する',
            summary: '依存関係の問題を解消し、修正がリグレッションを起こさない状態にする。',
            effects: { quality: 10, cost: -6, schedule: -8, stakeholder: 2, morale: 3 },
            explanation:
              'リグレッションの頻発は設計上の問題が根本原因であることが多いです。表面的な修正を続けるより、根本的な構造改善を行う判断が長期的に正しいです。',
            pmBokTags: ['品質管理', '統合管理', 'リスク管理'],
            consequence: '根本解決により、以降のリグレッションが大幅に減少する。',
          },
          {
            id: 'add-regression-tests',
            label: '自動リグレッションテストを整備し、品質を担保する',
            summary: 'テスト自動化を進め、修正の影響範囲を可視化する。',
            effects: { quality: 7, cost: -5, schedule: -6, stakeholder: 1, morale: 2 },
            explanation:
              '自動テストの整備は短期的にコストがかかりますが、後のリグレッション検出を大幅に効率化します。',
            pmBokTags: ['品質管理', 'リスク管理', 'スケジュール管理'],
            consequence: 'テスト効率が上がり、リグレッション検出が早くなる。',
          },
          {
            id: 'continue-manual-fix',
            label: '現状のやり方で修正を続け、ひとつずつ対処する',
            summary: 'リグレッションを手動で対処しながら、テストを続行する。',
            effects: { quality: -6, cost: 0, schedule: -8, stakeholder: -3, morale: -8 },
            explanation:
              'リグレッションの根本原因を無視して修正を続けることは、チームの疲弊とテスト終了時期の見通しが立たなくなるリスクがあります。',
            pmBokTags: ['品質管理', 'リスク管理'],
            consequence: 'テストが終わらないまま時間だけが経過するリスクがある。',
          },
        ],
      },
      {
        id: 'testing-spec-insufficient',
        learningImage: { src: '/game-assets/meeting-minutes.png', caption: '議事録サンプル — 仕様書の不足は上流の合意・記録が不足していたサインです' },
        title: 'テスト仕様書の粒度が粗く、品質を保証できない状態が発覚した',
        description:
          'テストレビューで、テスト仕様書に「正常系のみ」しか記載されておらず、異常系・境界値・例外処理のテストが大量に抜けていることが発覚。このまま検収に臨むと、本番障害のリスクが高い状態です。',
        pmTip: 'PMの仕事⑲：**品質を保証する**。テスト内容が不十分なまま納品すると後で大きな問題になります。PMは**品質を保証する最後の砦**です。',
        docs: [
          {
            type: '課題管理表',
            title: 'テスト仕様書品質レビュー指摘',
            content: `確認済みテストケース: 89件
不足テストケース（推定）: 200件以上
不足内容: 異常系テスト、境界値テスト、例外処理テスト
リスク: 本番で想定外の障害が発生する可能性が高い`,
          },
        ],
        choices: [
          {
            id: 'add-missing-tests',
            label: 'テストケースを補完し、品質を担保してから検収に臨む',
            summary: '不足テストを追加し、本番品質を保証できる状態にする。',
            effects: { quality: 10, cost: -5, schedule: -7, stakeholder: 3, morale: -1 },
            explanation:
              'テストカバレッジの確保はPMが品質を守るための最後の砦です。スケジュールが遅れても、検収拒否よりはリスクが低いです。',
            pmBokTags: ['品質管理', 'リスク管理', 'ステークホルダー管理'],
            consequence: '品質が保証され、本番障害リスクが大幅に下がる。',
          },
          {
            id: 'prioritize-and-test',
            label: '重要機能に絞ってテストを補完し、残りはリスク承認を得る',
            summary: '全部補完せず、クリティカルな機能に集中してテストする。',
            effects: { quality: 5, cost: -3, schedule: -4, stakeholder: 2, morale: 1 },
            explanation:
              '全テストの補完が難しい場合、重要度でトリアージする判断は現実的です。ただし残リスクを顧客に開示して承認を得ることが必須です。',
            pmBokTags: ['品質管理', 'リスク管理', 'コミュニケーション管理'],
            consequence: '主要機能の品質は保証されるが、残リスクの明示と顧客承認が必要。',
          },
          {
            id: 'proceed-to-acceptance',
            label: '現状のテストで検収に進み、本番後に不具合対応する',
            summary: 'テストが不十分なまま検収に臨む。',
            effects: { quality: -12, cost: 0, schedule: 6, stakeholder: -5, morale: -4 },
            explanation:
              'テストが不十分なまま納品すると、本番障害や検収拒否につながります。PMは品質リスクを正確に顧客に伝える責任があります。',
            pmBokTags: ['品質管理', 'リスク管理'],
            consequence: '本番でのバグ発生率が高くなり、顧客との信頼関係が大きく損なわれる。',
          },
        ],
      },
      {
        id: 'testing-critical-bug',
        learningImage: { src: '/game-assets/risk-matrix.png', caption: 'リスクマトリクス — 重大バグは「影響度：高×発生済み」のリスク。即時対応の優先度最上位です' },
        title: 'システムテストで重大バグが発見された',
        description:
          'リリース直前のシステムテストで、業務上致命的な不具合が見つかった。納期優先でリリースするか、品質優先で延期するか判断が問われます。',
        pmTip: 'PMの仕事⑳：**品質と納期のバランスをとる**。重大なバグが見つかったとき、「このまま出してもいいか」を判断するのはPMです。**勇気ある報告**が大切です。',
        clientChat: true,
        docs: [
          {
            type: 'メール',
            title: '社内報告メール',
            content: `テスト: 受注データの二重登録が発生
影響: 本番直前の重大不具合
提案: 直ちに対応か、リリース延期の検討`,
          },
        ],
        choices: [
          {
            id: 'prioritize-quality',
            label: '品質優先で延期を報連相し、対応期間を確保する',
            summary: '顧客と経営層に品質リスクを伝え、延期を合意する。',
            effects: { quality: 12, cost: -6, schedule: -12, stakeholder: 4, morale: 3 },
            explanation:
              '日本のPMは問題を抱え込まずに報連相し、関係者と合意して対応する判断が評価されます。品質を守ることは中長期的な信頼につながります。',
            pmBokTags: ['品質管理', 'コミュニケーション管理', 'ステークホルダー管理'],
          },
          {
            id: 'prioritize-delivery',
            label: '納期優先でリリースし、後から修正する',
            summary: '納期を守るために品質リスクを受け入れる。',
            effects: { quality: -14, cost: 0, schedule: 10, stakeholder: -5, morale: -2 },
            explanation:
              '納期優先でのリリースは、後のクレームや手戻りを招きやすい判断です。PMはそのリスクと責任を正確に説明すべきです。',
            pmBokTags: ['スケジュール管理', 'リスク管理'],
          },
          {
            id: 'defer-to-customer',
            label: '顧客に判断を委ね、選択肢を説明する',
            summary: '顧客に現状を共有し、最終判断を仰ぐ。',
            effects: { quality: 2, cost: 0, schedule: -4, stakeholder: 2, morale: 0 },
            explanation:
              '関係者合意を重視する日本のPMでは、重大判断を顧客や経営と共有するのが適切です。責任の明確化と合意形成が重要です。',
            pmBokTags: ['ステークホルダー管理', '統合管理', '品質管理'],
          },
        ],
      },
      {
        id: 'testing-last-fix-loop',
        learningImage: { src: '/game-assets/wbs.png', caption: 'WBS（作業分解構造） — 修正ループはWBS上のスコープ管理が機能していないサインです' },
        title: '「これで最後だから」が何度も続く——終わりが見えない修正ループ',
        description:
          'テストが終わりに近づいたと思うたびに「最後にこれだけお願い」という修正依頼が来る。1回、2回と繰り返し、現在5回目。チームは疲弊しており、「いつ終わるのか」という声が上がっています。',
        pmTip: 'PMの仕事：終盤の「ついで」を管理する。**スコープクリープ**は終盤が最も危険です。変更管理プロセスを使い**「全て受けない・全て断わらない」**バランスを保ちます。',
        docs: [{ type: 'メール', title: '追加修正依頼メール（5通目）', content: '顧客: 「申し訳ないのですが、これで本当に最後です。この画面のボタンの配置だけ変えてほしいです」\nPM: （5回目の「最後」）変更管理で整理が必要' }],
        choices: [
          { id: 'accept-all-fixes', label: '全ての修正を受け入れ続ける。顧客のためだから', summary: '都度受け入れてスコープクリープを続ける。', effects: { quality: -5, cost: -4, schedule: -6, stakeholder: 3, morale: -10 }, explanation: '「ついで」の積み重ねがスコープクリープです。受け続けると品質と士気が雪だるま式に悪化し、最終的に何も良くなりません。PMは変更管理で整理する責任があります。', pmBokTags: ['スコープ管理', 'リスク管理', 'ステークホルダー管理'] },
          { id: 'change-control', label: '変更管理として受付け、次期リリースに整理する', summary: '今後の要望を変更ログに記録し、次回対応に分類する。', effects: { quality: 5, cost: -2, schedule: -1, stakeholder: -1, morale: 5 }, explanation: 'スコープ変更はゼロにはできません。でも変更管理プロセスで整理することで、現在の品質と納期を守りながら顧客の要望を確実に次回に繋げられます。', pmBokTags: ['変更管理', 'スコープ管理', 'ステークホルダー管理'] },
          { id: 'clear-boundary', label: '「今回の修正はここで打ち止め」とフォーマルに合意する', summary: 'スコープの終端を明確にして、合意書を取る。', effects: { quality: 4, cost: 0, schedule: 2, stakeholder: -3, morale: 6 }, explanation: '終端を明確にすることはPMの義務です。顧客が不満でも、曖昧なままより「次回対応」として明示する誠実さが長期的な信頼を守ります。', pmBokTags: ['スコープ管理', 'コミュニケーション管理', '統合管理'] },
        ],
      },
    ],
  },
  {
    id: 'release',
    label: '受入テスト・本番リリース',
    description: '顧客受入から本番リリースまで。議事録・顧客対応・リスク説明がPMの腕の見せどころです。',
    scenarios: [
      {
        id: 'release-acceptance-claim',
        learningImage: { src: '/game-assets/meeting-minutes.png', caption: '議事録サンプル — 「言った・言わない」の争いを防ぐのが議事録です。記録が証拠になります' },
        title: '顧客が「要件と違う」と受入テストでクレーム',
        description:
          '受入テストで顧客が要件と違うと指摘。要件定義時の議事録があるかどうかが影響する状況です。',
        pmTip: 'PMの仕事㉑：**記録で守る**。顧客から「要件と違う」と言われたとき、**議事録や合意書が重要な根拠**になります。**記録を残す習慣**がPMを守ります。',
        clientChat: true,
        docs: [
          {
            type: '議事録',
            title: '受入テスト報告書',
            content: `顧客: 「画面の並びや操作フローが要件と違います」
PM: 影響範囲と対応方針を整理中
担当: 要件定義資料と議事録の確認`,
          },
        ],
        choices: [
          {
            id: 'review-documents',
            label: '要件定義の記録を確認し、説明責任を果たす',
            summary: '議事録や合意資料を確認して、顧客と事実を整理する。',
            effects: { quality: 4, cost: 0, schedule: -4, stakeholder: 5, morale: 1 },
            explanation:
              '日本の現場では議事録が「言った・言わない」を防ぐ防衛手段です。記録をもとに顧客と合意形成を図るのがPMの正攻法です。',
            pmBokTags: ['コミュニケーション管理', 'ステークホルダー管理', '品質管理'],
          },
          {
            id: 'apologize-and-fix',
            label: 'まず謝罪し、追加工数で修正を約束する',
            summary: '顧客満足を優先し、問題を速やかに解消する。',
            effects: { quality: 6, cost: -8, schedule: -6, stakeholder: 6, morale: -2 },
            explanation:
              '謝罪と対応は信頼回復に有効ですが、追加工数と納期影響をきちんと顧客と共有する必要があります。PMは過度な約束を避けるべきです。',
            pmBokTags: ['ステークホルダー管理', '変更管理', '品質管理'],
          },
          {
            id: 'defend-delivery',
            label: '現状の納期を守るために修正はバージョン2で対応する',
            summary: 'リリース優先で対応を先送りし、納期を死守する。',
            effects: { quality: -10, cost: 0, schedule: 8, stakeholder: -4, morale: -3 },
            explanation:
              '納期を優先する判断は現場であり得ますが、顧客満足と品質の低下を招くリスクがあります。PMはそのリスクを十分に説明し、合意を得る必要があります。',
            pmBokTags: ['スケジュール管理', 'ステークホルダー管理', 'リスク管理'],
          },
        ],
      },
      {
        id: 'release-env-not-ready',
        learningImage: { src: '/game-assets/risk-matrix.png', caption: 'リスクマトリクス — 環境未整備は「発生確率高×影響度高」のリスク。早期に洗い出すべき項目です' },
        title: '顧客側の本番環境が準備できていない——リリース日が迫っている',
        description:
          'リリース1週間前になって、顧客側のサーバー調達とネットワーク設定が完了していないことが判明。顧客担当者は「もう少し時間をもらえれば」と言っているが、こちらのチームは全員リリース準備完了の状態です。',
        pmTip: 'PMの仕事㉒：**調整する**。顧客側の準備が遅れているとき、PMは状況を確認して**現実的な対応策**を選びます。',
        docs: [
          {
            type: 'メール',
            title: '顧客側環境準備状況の確認メール',
            content: `顧客担当: 「サーバーの調達が遅れており、本番環境の構築が来週になりそうです。リリースを1週間延期できますか？」
PM: 影響と選択肢の整理が必要`,
          },
        ],
        choices: [
          {
            id: 'agree-to-postpone',
            label: '顧客の状況を優先し、リリースを1週間延期する',
            summary: '顧客の準備完了を待ち、確実なリリースを目指す。',
            effects: { quality: 4, cost: -3, schedule: -8, stakeholder: 5, morale: -1 },
            explanation:
              '顧客環境が整っていない状態でのリリースは失敗リスクが高いです。顧客の準備完了を確認してから進めるのが確実です。',
            pmBokTags: ['ステークホルダー管理', 'リスク管理', '統合管理'],
            consequence: '安全なリリースができるが、スケジュールへの影響を関係者に説明する必要がある。',
          },
          {
            id: 'parallel-preparation',
            label: 'こちらの作業を前倒しで完了させ、顧客の準備が整い次第リリースする',
            summary: '自社側の準備を完璧にし、顧客環境が整い次第即日リリースできる体制を作る。',
            effects: { quality: 5, cost: -2, schedule: -4, stakeholder: 4, morale: 1 },
            explanation:
              '自社の準備を完了させておくことで、顧客環境が整い次第迅速に動ける体制を作ることは合理的な判断です。',
            pmBokTags: ['統合管理', 'スケジュール管理', 'リスク管理'],
            consequence: '準備万端の状態で待機できるが、待機コストが発生する。',
          },
          {
            id: 'force-release',
            label: '準備が不十分でも予定通りリリースを強行する',
            summary: '顧客環境の問題は顧客責任として、リリース予定を変更しない。',
            effects: { quality: -8, cost: 0, schedule: 5, stakeholder: -7, morale: -3 },
            explanation:
              '顧客環境が整っていない状態でのリリース強行は、本番障害と顧客トラブルを引き起こすリスクがあります。',
            pmBokTags: ['ステークホルダー管理', 'リスク管理'],
            consequence: '本番環境での障害リスクが高く、顧客との信頼関係に深刻なダメージを与える可能性がある。',
          },
        ],
      },
      {
        id: 'release-post-incident',
        learningImage: { src: '/game-assets/risk-matrix.png', caption: 'リスクマトリクス — 本番障害は最高レベルのリスク。復旧手順と報告先を即座に判断します' },
        title: '本番リリース直後に予期せぬデータ不整合が大量発覚した',
        description:
          '本番リリース後2時間で、既存データの移行漏れによりシステム上のデータと実際のデータが大幅に乖離していることが発覚。顧客から「業務が回らない、すぐ対応してほしい」と緊急連絡が入っています。',
        pmTip: 'PMの仕事㉓：**素早く動く**。リリース後に問題が起きたとき、PMは最初に「**どうすれば顧客の業務を早く正常に戻せるか**」を考えます。',
        docs: [
          {
            type: '課題管理表',
            title: '本番リリース後障害報告（緊急）',
            content: `発生時刻: リリース後2時間
症状: データの不整合（移行漏れ）
影響範囲: 主要機能全体
顧客からの連絡: 「業務停止状態。至急対応を」
原因: データ移行スクリプトの検証不足`,
          },
        ],
        choices: [
          {
            id: 'emergency-response',
            label: '全員を緊急召集し、データ修正と暫定対応を最優先で実施する',
            summary: '問題解決を最優先に、緊急対応チームを立ち上げる。',
            effects: { quality: 6, cost: -8, schedule: -4, stakeholder: 5, morale: -4 },
            explanation:
              '本番障害への迅速な対応はPMの最重要責務のひとつです。コストと疲弊を伴いますが、顧客の信頼回復に向けた行動が優先されます。',
            pmBokTags: ['統合管理', 'リスク管理', 'ステークホルダー管理'],
            consequence: '迅速な対応で顧客の信頼を一部回復できる。メンバーの疲弊に注意が必要。',
          },
          {
            id: 'rollback',
            label: '旧システムに一時切り戻し、原因調査後に再リリースする',
            summary: 'リスクを最小化するため、安全な状態に戻す。',
            effects: { quality: 4, cost: -5, schedule: -6, stakeholder: 2, morale: -2 },
            explanation:
              'ロールバックは問題の拡大を防ぐ手段として有効です。顧客業務を止める前に安全な状態に戻す判断は品質管理の観点から正しいです。',
            pmBokTags: ['リスク管理', '品質管理', '統合管理'],
            consequence: '業務影響を最小化できるが、再リリースまでの期間が必要になる。',
          },
          {
            id: 'manual-workaround',
            label: '顧客に手動対応を依頼し、システム修正を並行して進める',
            summary: '顧客に一時的な手動運用を依頼しながら、修正を進める。',
            effects: { quality: -4, cost: -4, schedule: 0, stakeholder: -5, morale: -3 },
            explanation:
              '手動対応を顧客に依頼することは、顧客の業務負担を増やし信頼を損なうリスクがあります。PMは顧客への影響を最小化する方法を最優先に検討すべきです。',
            pmBokTags: ['ステークホルダー管理', 'コミュニケーション管理'],
            consequence: '顧客満足度が大幅に低下し、プロジェクト評価が悪化するリスクがある。',
          },
        ],
      },
      {
        id: 'release-scope-flood',
        learningImage: { src: '/game-assets/wbs.png', caption: 'WBS（作業分解構造） — スコープ外の要求はWBSへの影響を試算してから返答しましょう' },
        title: 'プロジェクト終了直前に他部門から「うちも使いたい」と横展開の要望が殺到',
        description:
          '本番リリースの成功を聞きつけた他部門から、「自分たちの業務にも使えそうなので機能追加してほしい」という要望が5部門から同時に届いた。追加開発の予算も体制も、現在の計画にはない。',
        pmTip: 'PMの仕事㉔：**スコープを守る**。成功の反動で追加要求が殺到することがあります。PMはチームを守るために**「断る勇気」**も必要です。',
        docs: [
          {
            type: 'メール',
            title: '他部門からの横展開要望（複数）',
            content: `総務部: 「備品管理にも使いたい。追加機能を検討してほしい」
人事部: 「人員配置管理に応用できそう。対応は可能ですか？」
経理部: 「コスト集計機能を追加してほしい」
※他2部門からも同様の連絡あり
PM: 対応方針の決定が必要`,
          },
        ],
        choices: [
          {
            id: 'define-roadmap',
            label: '要望を整理し、優先度をつけてロードマップに落とし込む',
            summary: '各部門の要望を可視化し、次フェーズの計画に組み込む。',
            effects: { quality: 4, cost: -2, schedule: -3, stakeholder: 7, morale: 2 },
            explanation:
              '横展開要望は本来のプロジェクト成功の証ですが、体制なしに受け入れると品質が下がります。ロードマップ化して計画的に対応する判断が適切です。',
            pmBokTags: ['統合管理', 'ステークホルダー管理', 'スコープ管理'],
            consequence: '将来の開発計画が明確になり、各部門の期待値が管理できる。',
          },
          {
            id: 'escalate-for-new-project',
            label: '経営層に報告し、横展開を新プロジェクトとして立案する',
            summary: '本プロジェクトの範囲を守り、横展開は別プロジェクトとして提案する。',
            effects: { quality: 3, cost: 0, schedule: 0, stakeholder: 5, morale: 3 },
            explanation:
              '成功したシステムの横展開を新プロジェクトとして組織的に扱う判断は、スコープを守りつつ将来の価値を最大化する方法です。',
            pmBokTags: ['統合管理', 'スコープ管理', 'ステークホルダー管理'],
            consequence: '現プロジェクトのスコープが守られ、組織としての次ステップが明確になる。',
          },
          {
            id: 'accept-all-requests',
            label: '全ての部門要望を受け入れて、追加開発を始める',
            summary: '全要望に対応し、横展開を最大化する。',
            effects: { quality: -8, cost: -10, schedule: -8, stakeholder: 4, morale: -8 },
            explanation:
              'チームが疲弊している中で全要望を受け入れると、品質と士気に深刻な影響が出ます。PMは組織の持続可能性を守るために断る判断も必要です。',
            pmBokTags: ['スコープ管理', 'リスク管理', '資源管理'],
            consequence: 'チームの疲弊が極限に達し、品質問題が多発するリスクがある。',
          },
        ],
      },
      {
        id: 'release-go-live',
        learningImage: { src: '/game-assets/v-model.png', caption: 'V字モデル — リリースはV字モデルの完成点。すべての工程が繋がっていたか振り返りましょう' },
        title: '本番リリースを最終決定する',
        description:
          '受入結果を踏まえ、本番リリースタイミングを決定。リスクコントロールと顧客合意のバランスを取ります。',
        pmTip: 'PMの仕事㉕：**最終判断をする**。リリースするかしないかの**最終判断を下す**のがPMです。リスクと顧客への影響を天秤にかけて決断します。',
        docs: [
          {
            type: 'リスク管理表',
            title: '本番リリース判断資料',
            content: `リスク: 追加修正によりリリース遅延
選択: 予定通りリリース / 品質優先で延期 / 顧客と検証後に判断`,
          },
        ],
        choices: [
          {
            id: 'go-live-on-time',
            label: '予定どおり本番リリースする',
            summary: '納期を最優先にし、リスクを最小限に抑える。',
            effects: { quality: -8, cost: 0, schedule: 10, stakeholder: 0, morale: -2 },
            explanation:
              '納期遵守が重視される現場では一時的にリリースを優先する判断もあります。PMはその影響とリスクを関係者に明確に伝える必要があります。',
            pmBokTags: ['スケジュール管理', 'リスク管理', 'コミュニケーション管理'],
          },
          {
            id: 'delay-for-quality',
            label: '品質優先で本番を延期する',
            summary: '重大リスクを避けるためにリリース日を見直す。',
            effects: { quality: 10, cost: -6, schedule: -10, stakeholder: 3, morale: 2 },
            explanation:
              '品質を優先する判断は、PMがQCDの中で品質と信頼を守るために必要な場合があります。合意形成を丁寧に行うことが重要です。',
            pmBokTags: ['品質管理', 'ステークホルダー管理', '統合管理'],
          },
          {
            id: 'follow-customer-wish',
            label: '顧客の判断を尊重して最終決定を委ねる',
            summary: '顧客と協議し、最終的なリリース判断を共有する。',
            effects: { quality: 2, cost: 0, schedule: -2, stakeholder: 2, morale: 0 },
            explanation:
              '顧客合意を重視する日本の現場では、最終的なリリース判断を顧客と共有することが望ましい判断です。',
            pmBokTags: ['ステークホルダー管理', '統合管理', 'リスク管理'],
          },
        ],
      },
      {
        id: 'release-sandwich-pm',
        learningImage: { src: '/game-assets/org-chart.png', caption: 'プロジェクト組織図 — 板挟みのとき、誰が最終決定権を持つか組織図で整理しましょう' },
        title: '経営・顧客・現場から同時に矛盾した要求——PMは三方向の板挟みになった',
        description:
          'リリース直前のタイミングで、役員から「コスト超過を報告しろ」、顧客から「追加機能を入れてリリースして」、チームから「今の状態ではリリースは無理」という三方向のプレッシャーが同時にかかっている。全員を満たす選択肢は存在しない。',
        pmTip: 'PMの仕事：**優先順位を決めて合意を取る**。PMの本質は「全部立てる」ではなく**「何を優先するか決めて、全員に誠実に伝える」**ことです。',
        clientChat: true,
        docs: [{ type: 'リスク管理表', title: '三方向の矛盾要求リスト', content: '役員: 「コスト超過を株主に説明する必要がある。詳細報告を」\n顧客: 「この機能がないとリリースできない。追加して」\nチーム: 「今のバグ状況では本番に出せない。延期を」\nPM: どこから手をつけるか' }],
        choices: [
          { id: 'all-must-wait', label: '三者を一堂に集め、現状と優先順位を全員で共有する', summary: '同じ情報を全員が持ち、優先順位を一緒に決める。', effects: { quality: 4, cost: -2, schedule: -3, stakeholder: 6, morale: 4 }, explanation: 'PMの本質は「全部立てる」ではなく「優先順位を決めて合意を取る」ことです。同じテーブルで話し合うことで誤解が減り、現実的な解決策が生まれます。', pmBokTags: ['統合管理', 'ステークホルダー管理', 'コミュニケーション管理'] },
          { id: 'customer-first-release', label: '顧客満足を最優先にして、追加機能込みで強行リリースする', summary: '品質問題を抱えたまま、顧客要求に応えてリリースする。', effects: { quality: -8, cost: -3, schedule: 4, stakeholder: 3, morale: -8 }, explanation: '品質問題を抱えたまま顧客優先でリリースすると、本番障害と残り二者の不満が同時に爆発します。短期の顧客満足のために長期の全てを失うリスクがあります。', pmBokTags: ['品質管理', 'リスク管理', 'ステークホルダー管理'] },
          { id: 'protect-quality-delay', label: 'チームの品質判断を尊重し、リリース延期を経営・顧客両方に説明する', summary: '品質を守る決断をし、全方面に誠実に伝える。', effects: { quality: 8, cost: -4, schedule: -6, stakeholder: 2, morale: 5 }, explanation: '品質を守るために延期を選び、全ステークホルダーに誠実に伝える判断はPMとして勇気ある正しい行動です。短期的な関係悪化より長期的な信頼を選びます。', pmBokTags: ['品質管理', 'ステークホルダー管理', '統合管理'] },
        ],
      },
    ],
  },
];
