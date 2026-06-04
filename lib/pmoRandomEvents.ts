import type { RandomEvent } from './types';

export const pmoRandomEvents: RandomEvent[] = [
  {
    id: 'pmo-resource-conflict',
    title: '2つのプロジェクトが同じSEを「来月から専任で」と要求してきた',
    description:
      'インフラに強いSE田中さんを、PJ-AのPMとPJ-BのPMが同時に「来月からうちに専任でアサインしてほしい」と要求してきた。両PMとも譲らず、PMOとして調整が必要な状況です。どちらかが割を食うことになります。',
    severity: 'high',
    phaseIds: ['all'],
    choices: [
      {
        id: 'negotiate-share',
        label: '両PMを同席させ、スケジュールを調整して分担割り当てを合意する',
        summary: '双方の要件を可視化し、妥協点を見つける。',
        effects: { quality: 3, cost: -3, schedule: -4, stakeholder: 6, morale: 3 },
        explanation:
          'PMO本来の役割は横断調整です。両者を同席させて合意を作ることが現場信頼を高めます。ただし調整工数がかかります。',
        pmBokTags: ['ポートフォリオ管理', 'ステークホルダー管理', '資源管理'],
      },
      {
        id: 'priority-call',
        label: '経営優先度に従い、優先度の高いPJに田中さんを割り当てる',
        summary: 'ポートフォリオ優先度を根拠に決定する。',
        effects: { quality: 5, cost: 0, schedule: 2, stakeholder: -4, morale: 4 },
        explanation:
          '優先度に基づく意思決定はPMOの統制機能として正しいですが、割を食ったPMの信頼低下に注意が必要です。',
        pmBokTags: ['ポートフォリオ管理', 'ガバナンス', '資源管理'],
      },
      {
        id: 'recruit-second',
        label: '外部から類似スキルの要員を調達し、両PJに割り当てる',
        summary: 'リソース追加で競合を解消する。',
        effects: { quality: 2, cost: -8, schedule: -3, stakeholder: 5, morale: 2 },
        explanation:
          '根本解決策ですがコストと調達時間がかかります。特定人材への依存リスクを解消する点では長期的に有効です。',
        pmBokTags: ['調達管理', '資源管理', 'ポートフォリオ管理'],
      },
    ],
  },
  {
    id: 'pmo-pm-hiding-status',
    title: 'あるPMが「順調です」と報告し続けているが、何かがおかしい',
    description:
      '毎週「順調です」と報告してくるPJ-CのPMだが、成果物の提出が遅れ、チームの残業が増え、顧客との会議もキャンセルが続いている。データは赤信号なのに口頭では問題ないと言い張っています。',
    severity: 'high',
    phaseIds: ['all'],
    choices: [
      {
        id: 'direct-interview',
        label: 'PMと個別に話し、実態を正直に話せる場を作る',
        summary: '心理的安全性を確保し、本音を引き出す。',
        effects: { quality: 4, cost: -3, schedule: -2, stakeholder: 7, morale: 2 },
        explanation:
          'PMが隠す背景には恐怖・プレッシャーがあることが多いです。責める姿勢より「一緒に解決する」姿勢が正しい状況把握につながります。',
        pmBokTags: ['コミュニケーション管理', 'リスク管理', 'ステークホルダー管理'],
      },
      {
        id: 'data-audit',
        label: 'PMOとして成果物・進捗データを直接確認する監査を実施する',
        summary: '口頭報告ではなく数値で実態を把握する。',
        effects: { quality: 6, cost: -4, schedule: -3, stakeholder: -3, morale: 5 },
        explanation:
          'データドリブンな実態把握はPMOの重要な機能です。ただし「監視」と受け取られると現場信頼が下がるため、目的の説明が重要です。',
        pmBokTags: ['ガバナンス', '品質管理', 'リスク管理'],
      },
      {
        id: 'trust-pm',
        label: 'PMの自己報告を信頼し、もう少し様子を見る',
        summary: '現場のPMを信頼し、介入を控える。',
        effects: { quality: -5, cost: 0, schedule: 0, stakeholder: -4, morale: 0 },
        explanation:
          '問題の兆候を無視して放置すると、炎上後にPMOが「なぜ早く動かなかったか」と批判されます。PMOは早期検知・早期介入が存在意義の一つです。',
        pmBokTags: ['リスク管理', 'ガバナンス'],
      },
    ],
  },
  {
    id: 'pmo-exception-request',
    title: '「うちだけ標準プロセスを免除してほしい」——PM3名から同時に例外申請が来た',
    description:
      '複数のPMから「うちのプロジェクトは特殊なので、PMO標準プロセスから外してほしい」という申請が同時に届いた。理由はそれぞれ「顧客要件が独特」「チームが小さすぎる」「納期が超短期」。',
    severity: 'medium',
    phaseIds: ['all'],
    choices: [
      {
        id: 'reject-all',
        label: '全て却下。標準プロセスはすべてのPJに適用するルールだと伝える',
        summary: '一貫性を守り、例外を認めない。',
        effects: { quality: 8, cost: 0, schedule: 0, stakeholder: -6, morale: 3 },
        explanation:
          '標準化の一貫性はPMOの信頼性の根幹です。しかし正当な理由のある例外を却下すると、現場は「PMOは現実を分かっていない」と感じます。',
        pmBokTags: ['ガバナンス', '標準化', 'ステークホルダー管理'],
      },
      {
        id: 'case-by-case',
        label: '申請理由を個別評価し、妥当な案件のみ承認・条件付き例外とする',
        summary: '状況に応じて柔軟に判断する。',
        effects: { quality: 5, cost: -4, schedule: -2, stakeholder: 5, morale: 4 },
        explanation:
          '例外申請の審査プロセスを設けることで、ガバナンスを維持しながら現場の実情にも対応できます。承認基準の透明性が重要です。',
        pmBokTags: ['ガバナンス', 'ファシリテーション', '統合管理'],
      },
      {
        id: 'review-standard',
        label: '例外申請が集中したことを標準プロセス自体の問題と捉え、見直しを開始する',
        summary: '多数の例外申請を「標準の改善機会」として扱う。',
        effects: { quality: 4, cost: -5, schedule: -4, stakeholder: 8, morale: 5 },
        explanation:
          '多くのPMが同じ理由で例外を求めるなら、標準プロセスに改善余地がある可能性があります。PMOが自ら変化できる姿勢が現場の信頼を得ます。',
        pmBokTags: ['標準化', '継続的改善', 'ステークホルダー管理'],
      },
    ],
  },
  {
    id: 'pmo-burning-project-sos',
    title: 'あるPMから「手に負えない、助けてほしい」とSOS連絡',
    description:
      'PJ-BのPMから「スケジュールが3週間遅延、品質も基準以下、チームの士気が崩壊している。PMOに入ってきてほしい」とSOSが来た。PMO工数も限られているが、放置すれば組織全体への影響が出る規模のプロジェクトです。',
    severity: 'critical',
    phaseIds: ['all'],
    choices: [
      {
        id: 'direct-intervention',
        label: 'PMOメンバーをPJに常駐させ、直接立て直しを支援する',
        summary: 'PMO工数を使って現場に入り込む。',
        effects: { quality: 5, cost: -10, schedule: 4, stakeholder: 6, morale: 3 },
        explanation:
          'PMOが直接介入することで迅速な立て直しが可能ですが、PMO工数を大幅に消耗します。他のPJへの支援が薄くなるリスクがあります。',
        pmBokTags: ['ポートフォリオ管理', '統合管理', 'リスク管理'],
      },
      {
        id: 'assign-advisor',
        label: 'PMOアドバイザーとして週次で関与し、PMを支援する体制を取る',
        summary: '介入レベルを絞り、PMの自律を支援する。',
        effects: { quality: 3, cost: -5, schedule: 2, stakeholder: 4, morale: 2 },
        explanation:
          '適度な関与で自律支援するアプローチは、PMの成長にもつながります。ただし深刻な状況では効果が遅いリスクがあります。',
        pmBokTags: ['コーチング', 'ポートフォリオ管理', 'ステークホルダー管理'],
      },
      {
        id: 'escalate-sponsor',
        label: '経営層にエスカレーションし、プロジェクトの継続・中止を判断してもらう',
        summary: 'PMOの判断範囲を超えた問題として経営に上げる。',
        effects: { quality: 2, cost: -2, schedule: -3, stakeholder: 3, morale: 6 },
        explanation:
          'PMOが判断できない規模の問題は経営層に上げることが正しい対応です。PMOの役割は「何でも解決する」ではなく「適切な意思決定を促す」ことです。',
        pmBokTags: ['ガバナンス', 'ステークホルダー管理', 'エスカレーション'],
      },
    ],
  },
  {
    id: 'pmo-report-ignored',
    title: 'PMOが毎月作っているポートフォリオ報告書——誰も読んでいないことが判明',
    description:
      '3ヶ月間、毎月20ページのポートフォリオ報告書を作成していたが、経営層が「そんな報告書があったのか」と言ったことから、誰にも読まれていないことが発覚。PMO工数を大量に投じていたのに全く活用されていない状態です。',
    severity: 'medium',
    phaseIds: ['all'],
    choices: [
      {
        id: 'continue-reporting',
        label: '読まれなくても記録として続ける。いつか役立つはず',
        summary: '現状維持で作成を継続する。',
        effects: { quality: 0, cost: -5, schedule: -2, stakeholder: -2, morale: -3 },
        explanation:
          '価値を生まない活動にPMO工数を使い続けることは機会損失です。「形式の継続」より「価値の創出」に目を向けるべきです。',
        pmBokTags: ['コミュニケーション管理', 'ナレッジ管理'],
      },
      {
        id: 'redesign-report',
        label: 'ステークホルダーのニーズを調査し、1ページサマリーに刷新する',
        summary: '読まれる報告書に作り直す。',
        effects: { quality: 4, cost: -3, schedule: -2, stakeholder: 7, morale: 5 },
        explanation:
          '報告書は「作ること」が目的ではなく「意思決定を助けること」が目的です。読み手のニーズに合わせたシンプルな報告に変えることが正しい改善です。',
        pmBokTags: ['コミュニケーション管理', '継続的改善', 'ステークホルダー管理'],
      },
      {
        id: 'stop-and-confirm',
        label: '一度報告書の作成を止め、経営層が本当に必要な情報を確認する',
        summary: 'ゼロベースで報告設計を見直す。',
        effects: { quality: 3, cost: 4, schedule: 0, stakeholder: 5, morale: 6 },
        explanation:
          '不要な活動を止める勇気もPMOには必要です。経営層が本当に求める情報から報告設計し直すことで、PMO工数を価値ある活動に向けられます。',
        pmBokTags: ['コミュニケーション管理', 'ガバナンス', '継続的改善'],
      },
    ],
  },
  {
    id: 'pmo-new-project-review',
    title: '経営層から「このPJを追加でポートフォリオに入れてほしい」——明らかに過負荷',
    description:
      '経営層から「競合対策として新プロジェクトを緊急で立ち上げたい。既存の体制で回せるか確認してほしい」と依頼が来た。現在すでに5つのPJが動いており、全PMが限界稼働中。PMOとして正直に評価するべき状況です。',
    severity: 'high',
    phaseIds: ['all'],
    choices: [
      {
        id: 'accept-optimistic',
        label: '「なんとかなります」と答え、追加を受け入れる',
        summary: '経営層の意向に応えるため前向きに受諾する。',
        effects: { quality: -6, cost: -8, schedule: -5, stakeholder: 3, morale: -6 },
        explanation:
          '無理を承知で受け入れると既存PJ全体の品質・士気が連鎖的に悪化します。PMOは現実を正直に伝える役割があります。耳障りの良い答えより正確な評価が求められます。',
        pmBokTags: ['ポートフォリオ管理', 'ガバナンス', 'リスク管理'],
      },
      {
        id: 'capacity-analysis',
        label: '現在の全PJキャパシティを数値化し、追加可否を根拠付きで報告する',
        summary: 'データで判断材料を経営層に提示する。',
        effects: { quality: 5, cost: -3, schedule: -2, stakeholder: 4, morale: 7 },
        explanation:
          'PMOは感覚ではなくデータで経営判断を支援します。「無理です」より「現状はXX稼働率で、追加するとYYリスクがあります」という提示が正しい報告です。',
        pmBokTags: ['ポートフォリオ管理', 'ガバナンス', 'ステークホルダー管理'],
      },
      {
        id: 'tradeoff-proposal',
        label: '新PJ追加の条件として既存PJの1つを一時停止する選択肢を提示する',
        summary: '追加するなら何かを止めるトレードオフを経営層に明示する。',
        effects: { quality: 4, cost: 0, schedule: -3, stakeholder: 5, morale: 5 },
        explanation:
          '「Aを足すならBを止める」という選択肢を明示することはポートフォリオマネジャーとして正しい判断です。経営層に現実的な意思決定を促します。',
        pmBokTags: ['ポートフォリオ管理', 'ガバナンス', 'コミュニケーション管理'],
      },
    ],
  },
  {
    id: 'pmo-pm-skill-gap',
    title: '同じPMが複数のPJで同じ失敗を繰り返している',
    description:
      'あるPMが担当した複数のプロジェクトで「ステークホルダーへの報告遅れ」「スコープ変更の管理漏れ」が繰り返し発生している。個別事案ではなくスキルギャップの問題です。PMOとしてどう対応するか判断が必要です。',
    severity: 'high',
    phaseIds: ['all'],
    choices: [
      {
        id: 'pm-coaching',
        label: 'PMOが定期的なコーチングを実施する',
        summary: 'PMのスキル向上を個別支援する。',
        effects: { quality: 4, cost: -5, schedule: -2, stakeholder: 3, morale: 4 },
        explanation:
          'PMOのサポート機能を使ってPMを育てる判断は長期的に組織のPM品質を上げます。コーチングには時間と工数がかかりますが、組織能力への投資です。',
        pmBokTags: ['コーチング', 'ナレッジ管理', 'ステークホルダー管理'],
      },
      {
        id: 'training-program',
        label: 'PM全員向けの研修プログラムに組み込み、横展開で底上げする',
        summary: '個人問題を組織問題として捉え、全体底上げを図る。',
        effects: { quality: 6, cost: -6, schedule: -4, stakeholder: 5, morale: 6 },
        explanation:
          '一人の問題が組織的な弱点を反映していることがあります。個人攻撃ではなく制度として改善する判断がPMO組織の成熟度を示します。',
        pmBokTags: ['ナレッジ管理', '標準化', 'コミュニケーション管理'],
      },
      {
        id: 'reassign-pm',
        label: '小規模PJのみに担当を限定し、大型PJは別PMに切り替える',
        summary: '担当変更でリスクを低減する。',
        effects: { quality: 3, cost: -3, schedule: -3, stakeholder: -2, morale: -3 },
        explanation:
          '担当制限はリスク管理としては有効ですが、PMの成長機会を奪い士気を下げます。コーチングや研修と組み合わせた移行措置が望ましいです。',
        pmBokTags: ['資源管理', 'リスク管理', 'ガバナンス'],
      },
    ],
  },
  {
    id: 'pmo-dissolution-threat',
    title: '「PMOは管理コストが増えるだけで無駄」——現場PMが経営層に廃止を直訴',
    description:
      'ベテランPM数名が経営層に直接「PMOができてから書類が増えただけで現場には何の恩恵もない。廃止すべき」と訴えた。経営層から「PMOの存在意義を説明してほしい」と呼ばれています。',
    severity: 'critical',
    phaseIds: ['all'],
    choices: [
      {
        id: 'defend-with-data',
        label: 'PMO活動の成果をデータで示し、存在意義を説明する',
        summary: '実績と数値で価値を証明する。',
        effects: { quality: 3, cost: -3, schedule: -2, stakeholder: 5, morale: 8 },
        explanation:
          'PMOの存在意義は「感覚」ではなく「成果」で示す必要があります。標準化率・リスク早期検知件数・支援PJのKPI改善などを数値で提示することが最も有効です。',
        pmBokTags: ['ガバナンス', 'コミュニケーション管理', 'ステークホルダー管理'],
      },
      {
        id: 'listen-and-reform',
        label: 'PMたちの批判を正面から受け止め、PMOのあり方を見直す機会にする',
        summary: '反発を改善のフィードバックとして取り込む。',
        effects: { quality: 4, cost: -4, schedule: -4, stakeholder: 9, morale: 6 },
        explanation:
          '批判の中に改善すべき点があることを認めて変わる姿勢は、最も強力な信頼回復策です。「管理のためのPMO」から「現場支援のPMO」への転換を示します。',
        pmBokTags: ['継続的改善', 'ステークホルダー管理', 'ファシリテーション'],
      },
      {
        id: 'reduce-overhead',
        label: 'PMOの報告・承認プロセスを即座に半減させ、現場負担を減らす',
        summary: '不評な管理工数を削減して実益を示す。',
        effects: { quality: -2, cost: 3, schedule: 2, stakeholder: 7, morale: 4 },
        explanation:
          '管理工数の削減は現場からすぐに評価されます。ただし必要なガバナンスまで捨てないよう、削減対象の精査が必要です。',
        pmBokTags: ['継続的改善', 'ガバナンス', '標準化'],
      },
    ],
  },
  {
    id: 'pmo-portfolio-reprioritize',
    title: '経営戦略の転換で、重要だったPJが突然「優先度最低」になった',
    description:
      '経営会議で事業戦略が変更され、これまで最優先だったPJ-Aが「優先度最低」に格下げ。逆に準備不足だったPJ-Fが「最優先」に昇格。PMOとしてポートフォリオ全体を再編する必要があります。',
    severity: 'critical',
    phaseIds: ['all'],
    choices: [
      {
        id: 'immediate-reallocation',
        label: '経営判断に従い、速やかにリソースをPJ-Fへ集中させる',
        summary: '経営判断を尊重して素早く体制を切り替える。',
        effects: { quality: -3, cost: -4, schedule: -4, stakeholder: 5, morale: -4 },
        explanation:
          '迅速な対応は経営層の信頼を高めますが、急な変更はPJ-Aチームの混乱と士気低下を招きます。影響を受けるメンバーへの適切な説明が必要です。',
        pmBokTags: ['ポートフォリオ管理', 'ガバナンス', 'ステークホルダー管理'],
      },
      {
        id: 'transition-plan',
        label: '影響範囲を整理し、段階的移行計画を作成して経営層と合意する',
        summary: '急な変更のリスクを可視化し、現実的な移行を設計する。',
        effects: { quality: 5, cost: -3, schedule: -3, stakeholder: 6, morale: 3 },
        explanation:
          '戦略転換の意思は尊重しつつ、現実的な移行計画を提示することがPMOの責務です。「いつ・誰が・何を」という計画の明確化が現場の混乱を最小化します。',
        pmBokTags: ['ポートフォリオ管理', '統合管理', 'コミュニケーション管理'],
      },
      {
        id: 'protect-pja',
        label: 'PJ-Aの重要性を改めて経営層に説明し、優先度変更の再考を求める',
        summary: 'PMOとして戦略判断に異議を唱える。',
        effects: { quality: 3, cost: -2, schedule: -2, stakeholder: 3, morale: 5 },
        explanation:
          'PMOは経営の伝言係ではなく、ポートフォリオ全体を見渡した助言者です。意思決定に根拠ある異議を唱えることも重要な役割です。ただし最終判断は経営層にあることを忘れずに。',
        pmBokTags: ['ポートフォリオ管理', 'ガバナンス', 'ステークホルダー管理'],
      },
    ],
  },
  {
    id: 'pmo-knowledge-loss',
    title: 'PMOの中核メンバーが突然退職——ナレッジが一人の頭の中にしかなかった',
    description:
      'PMOの主担当で、全プロジェクトの過去経緯・判断履歴・関係者情報を把握していたメンバーが突然退職。後任への引き継ぎはなく、PMOのナレッジが空洞化しています。',
    severity: 'critical',
    phaseIds: ['all'],
    choices: [
      {
        id: 'emergency-doc',
        label: '退職者に連絡し、可能な範囲で緊急ドキュメント化を依頼する',
        summary: '退職者の協力を得て情報流出を最小化する。',
        effects: { quality: 3, cost: -4, schedule: -3, stakeholder: 2, morale: 1 },
        explanation:
          '円満退職であれば協力を得られることがあります。しかし全情報の回収は難しく、ナレッジ管理の仕組みを作れなかった根本問題は残ります。',
        pmBokTags: ['ナレッジ管理', 'リスク管理', '統合管理'],
      },
      {
        id: 'rebuild-knowledge',
        label: '各PMへのインタビューと既存資料の整理でナレッジを再構築する',
        summary: 'ゼロから情報を集め直す。',
        effects: { quality: 5, cost: -6, schedule: -5, stakeholder: 4, morale: 2 },
        explanation:
          '時間とコストはかかりますが、現場に直接聞いてナレッジを再構築することで、関係者との関係強化という副次効果もあります。',
        pmBokTags: ['ナレッジ管理', 'コミュニケーション管理', '統合管理'],
      },
      {
        id: 'prevent-recurrence',
        label: 'ナレッジ管理のルール整備を最優先にし、属人化を解消する仕組みを作る',
        summary: '今後の再発防止策を優先して整備する。',
        effects: { quality: 6, cost: -5, schedule: -4, stakeholder: 3, morale: 7 },
        explanation:
          'PMOがナレッジ管理の属人化に陥るのは最大の矛盾です。ドキュメント標準化・複数担当制・定期共有会など再発防止策を優先することが長期的に正しい投資です。',
        pmBokTags: ['ナレッジ管理', '標準化', 'ガバナンス'],
      },
    ],
  },
];
