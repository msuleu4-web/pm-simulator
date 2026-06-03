import type { Phase } from './types';

export const ultraPhases: Phase[] = [
  {
    id: 'operations',
    label: '運用移行',
    description: '本番稼働後の運用体制を確立する。インフラ・サポート・SLA定義が鍵です。',
    scenarios: [
      {
        id: 'ops-night-outage',
        title: '本番稼働初日の夜間に突然ダウンが発生した',
        description:
          '本番稼働から18時間後の深夜2時、監視アラートが鳴り続けている。オンコール体制が整っておらず、誰に連絡すればよいかも混乱している状況です。',
        pmTip: 'PMの仕事：インシデント管理。障害発生時、PMは冷静に「誰が何をするか」を指揮する役割があります。パニックを防ぐことが最優先です。',
        docs: [{ type: 'リスク管理表', title: '初回本番障害レポート', content: '発生: 深夜2:12\n症状: ユーザーログイン不能\n対応者: 不在（オンコール未設定）\n影響: 全ユーザーへの影響継続中' }],
        choices: [
          { id: 'establish-oncall', label: 'オンコール体制を即時整備し、役割を明確化する', summary: '障害対応フローを確立し、再発防止の体制を作る。', effects: { quality: 8, cost: -4, schedule: -3, stakeholder: 4, morale: 2 }, explanation: 'インシデント管理体制の整備は運用の基本です。PMが体制設計をリードすることで、組織として安定した運用が実現します。', pmBokTags: ['統合管理', 'リスク管理', '資源管理'] },
          { id: 'quick-fix-only', label: '今夜の障害を直すだけで、体制整備は後回しにする', summary: '目の前の障害解消を優先し、体制は次の機会に。', effects: { quality: -4, cost: 0, schedule: 2, stakeholder: -3, morale: -3 }, explanation: '障害対応だけで体制整備をしないと、同じ問題が繰り返されます。PMは「今」だけでなく「次回」も考える必要があります。', pmBokTags: ['リスク管理', '品質管理'] },
          { id: 'escalate-management', label: '経営層に状況を報告し、リソース確保を依頼する', summary: 'リソース不足を上層部に伝え、組織的解決を求める。', effects: { quality: 2, cost: -3, schedule: -2, stakeholder: 3, morale: 3 }, explanation: '運用リソース不足は経営判断が必要な問題です。PMが適切にエスカレーションすることで、組織として対応できます。', pmBokTags: ['統合管理', 'ステークホルダー管理'] },
        ],
      },
      {
        id: 'ops-knowledge-transfer',
        title: '運用チームへの知識移転が全く進んでいない',
        description:
          '本番稼働1ヶ月後、開発チームが問い合わせ対応を続けている。運用チームはシステムを理解できておらず、ドキュメントも不足しています。このまま開発チームが抜けると運用が崩壊します。',
        pmTip: 'PMの仕事：知識の引き継ぎ。プロジェクト完了後もシステムが正常に動き続けるための知識移転は、PMの重要な責務です。',
        docs: [{ type: '課題管理表', title: '運用移行チェックリスト（未完了多数）', content: '完了: 8項目 / 未完了: 22項目\n主な未完了: 手順書・トラブルシュート・権限移管\n現状: 開発チームが全問い合わせを対応中' }],
        choices: [
          { id: 'systematic-training', label: '運用チームへの集中研修プログラムを組む', summary: '2週間の集中トレーニングで、運用に必要な知識を移転する。', effects: { quality: 6, cost: -5, schedule: -4, stakeholder: 5, morale: 1 }, explanation: '計画的な知識移転は、長期的な運用安定に不可欠です。短期的なコストより長期的な自立性を優先する判断が重要です。', pmBokTags: ['資源管理', '統合管理', 'コミュニケーション管理'] },
          { id: 'create-runbooks', label: 'まずドキュメントを整備し、運用手順を標準化する', summary: 'ランブックとFAQを作成し、知識を文書化する。', effects: { quality: 5, cost: -3, schedule: -3, stakeholder: 3, morale: 2 }, explanation: 'ドキュメント化は知識をチームに依存させない重要な手段です。誰が担当しても同じ品質で対応できる仕組みを作ります。', pmBokTags: ['品質管理', 'コミュニケーション管理', '統合管理'] },
          { id: 'keep-dev-team', label: '開発チームを運用サポートとして当面残留させる', summary: 'コストはかかるが、開発チームに引き続き対応してもらう。', effects: { quality: 2, cost: -8, schedule: 0, stakeholder: 1, morale: -6 }, explanation: '開発チームの残留は短期的に安心できますが、長期化するとコストと士気に深刻な影響が出ます。根本的な知識移転が必要です。', pmBokTags: ['資源管理', 'コスト管理'] },
        ],
      },
      {
        id: 'ops-sla-ambiguity',
        title: 'SLAが曖昧なままサービスが稼働しているためクレームが絶えない',
        description:
          '稼働3ヶ月が経過するが、応答時間・可用性・障害対応時間などのSLAが正式に定義されていないため、顧客からの期待値と実態のギャップが拡大しています。',
        pmTip: 'PMの仕事：期待値を管理する。SLA（サービスレベル合意）は顧客との約束です。明確な合意がないと、クレームが止まらなくなります。',
        docs: [{ type: 'メール', title: '顧客からのクレームメール', content: '顧客: 「障害が起きた際の復旧時間が遅すぎる。契約書にも何も書かれていない。これでは困る」\nPM: SLAの明文化が急務' }],
        choices: [
          { id: 'define-sla', label: 'SLAを定義し、顧客と正式に合意する', summary: '可用性・応答時間・障害対応時間を数値で定義し契約化する。', effects: { quality: 7, cost: -3, schedule: -4, stakeholder: 8, morale: 1 }, explanation: 'SLAの明文化は顧客との信頼関係を構築します。数値目標を設定することで、運用チームの目標も明確になります。', pmBokTags: ['ステークホルダー管理', '品質管理', '調達管理'] },
          { id: 'improve-monitoring', label: 'まず監視体制を強化し、可視性を高める', summary: '実態データを収集してから、SLA定義の議論に入る。', effects: { quality: 4, cost: -4, schedule: -2, stakeholder: 2, morale: 2 }, explanation: '監視データがなければSLAの設定も難しいです。まず実態を把握してから合意形成するアプローチは合理的です。', pmBokTags: ['品質管理', 'リスク管理', '統合管理'] },
          { id: 'deflect-claims', label: '契約書に書かれていないとして、クレームを受け流す', summary: '法的責任がないことを根拠に、顧客のクレームに対応しない。', effects: { quality: -2, cost: 0, schedule: 2, stakeholder: -12, morale: -4 }, explanation: '顧客クレームを無視すると、信頼関係が壊れます。PMは法的責任の有無より、顧客との長期的な関係を優先すべきです。', pmBokTags: ['ステークホルダー管理', 'リスク管理'] },
        ],
      },
    ],
  },
  {
    id: 'expansion',
    label: '機能拡張',
    description: '初期リリース後の継続開発フェーズ。技術的負債との戦いと新機能追加のバランスが課題です。',
    scenarios: [
      {
        id: 'exp-tech-debt',
        title: '技術的負債のせいで新機能追加に時間がかかりすぎる',
        description:
          '初期開発のコード品質が低く、新機能を追加するたびにリグレッションが発生する。開発速度は当初比40%まで低下しており、このままでは競合に追いつけない状況です。',
        pmTip: 'PMの仕事：技術的負債の経営判断。技術的負債はコードの問題ですが、解決には予算と時間が必要です。PMはビジネス価値として経営層に説明する役割があります。',
        docs: [{ type: '課題管理表', title: '開発速度低下レポート', content: '初期比開発速度: 40%\n主因: コードの複雑性、テスト不足\nリグレッション率: 週平均4件\n新機能追加の見積もり: 当初の2.5倍' }],
        choices: [
          { id: 'refactor-sprint', label: 'リファクタリング専用スプリントを設け、負債を計画的に解消する', summary: '機能追加を一時停止し、コード品質の改善に集中する。', effects: { quality: 8, cost: -6, schedule: -6, stakeholder: -2, morale: 5 }, explanation: '技術的負債の計画的解消は、長期的な開発速度を回復します。短期的な機能停止より長期的な生産性を選ぶ判断です。', pmBokTags: ['品質管理', '統合管理', 'スコープ管理'] },
          { id: 'incremental-improvement', label: '新機能追加と並行して少しずつリファクタリングする', summary: '毎スプリントの20%を技術改善に充てる。', effects: { quality: 4, cost: -3, schedule: -3, stakeholder: 1, morale: 2 }, explanation: '継続的な改善は開発を止めずに品質を向上させる現実的な方法です。ただし改善速度は遅くなります。', pmBokTags: ['品質管理', 'スケジュール管理'] },
          { id: 'ignore-debt', label: '技術的負債は後回しにして、機能追加を優先する', summary: 'ビジネス要求を優先し、技術改善は先送りにする。', effects: { quality: -8, cost: 0, schedule: 3, stakeholder: 2, morale: -6 }, explanation: '技術的負債を無視し続けると、最終的に開発が完全に停止するリスクがあります。PMは長期的な視点でバランスを判断すべきです。', pmBokTags: ['リスク管理', '品質管理'] },
        ],
      },
      {
        id: 'exp-competitor-feature',
        title: '競合他社が主要機能を大幅強化——緊急対応を求められた',
        description:
          '競合が大型アップデートをリリース。役員から「来月中に同等機能を出してほしい」という指示が来た。現在の開発ロードマップでは対応は3ヶ月先の予定です。',
        pmTip: 'PMの仕事：戦略的優先度判断。感情的な競合対応は品質を破壊します。PMはデータで判断し、現実的なプランを経営層に提示する役割があります。',
        docs: [{ type: 'メール', title: '役員からの指示メール', content: '役員: 「競合Aが新機能をリリースした。我々も来月中に同等のものを出さないと顧客が流れる。どうにかしてほしい」\nPM: 影響評価と選択肢の検討が必要' }],
        choices: [
          { id: 'strategic-roadmap', label: 'ロードマップを見直し、優先度を再設定して合意する', summary: 'データを示して経営層と議論し、現実的な対応スケジュールを合意する。', effects: { quality: 5, cost: -3, schedule: -2, stakeholder: 4, morale: 3 }, explanation: 'PMはデータに基づいて経営層に現実的な選択肢を提示する役割があります。感情的な判断ではなく、根拠のある判断を求めることが重要です。', pmBokTags: ['統合管理', 'スコープ管理', 'ステークホルダー管理'] },
          { id: 'emergency-dev', label: '全力を挙げて来月中に間に合わせる', summary: '他の全てを後回しにして競合機能の開発に集中する。', effects: { quality: -8, cost: -6, schedule: 4, stakeholder: 3, morale: -10 }, explanation: '緊急開発は品質と士気に深刻なダメージを与えます。リリースできても後続のバグ対応でさらに消耗します。', pmBokTags: ['スコープ管理', 'リスク管理'] },
          { id: 'partial-response', label: '競合の主要機能だけを優先して部分的に対応する', summary: '全機能ではなく競争力に直結する機能だけを先行リリースする。', effects: { quality: -3, cost: -4, schedule: 2, stakeholder: 3, morale: -4 }, explanation: '部分的な対応はリスクを分散しますが、顧客の期待に完全には応えられない可能性があります。透明な説明が重要です。', pmBokTags: ['スコープ管理', 'ステークホルダー管理', '品質管理'] },
        ],
      },
      {
        id: 'exp-team-burnout',
        title: 'バグ修正と新機能追加の両立でチームが疲弊している',
        description:
          '運用保守と新機能開発を同じチームが担当しており、緊急バグ対応で新機能開発が常に中断される状況が続いています。メンバーから「どちらも中途半端で辛い」という声が上がっています。',
        pmTip: 'PMの仕事：体制設計。「保守」と「開発」を同じチームに押しつけると生産性が落ちます。PMはチームの働き方を最適化する責任があります。',
        docs: [{ type: '議事録', title: 'チーム振り返り議事録', content: 'メンバーA: 「バグ対応で集中できない。開発が全然進まない」\nメンバーB: 「保守を軽視しているわけでもないのに、常に割り込まれる」\nPM: チーム体制の見直しが必要' }],
        choices: [
          { id: 'split-teams', label: '保守チームと開発チームを分離する', summary: '役割を分けることで集中力と生産性を向上させる。', effects: { quality: 6, cost: -5, schedule: -3, stakeholder: 3, morale: 8 }, explanation: '保守と開発の分離はエンジニアの集中力を高め、生産性を向上させます。コスト増はありますが、長期的な品質と士気の回復につながります。', pmBokTags: ['資源管理', '統合管理', '品質管理'] },
          { id: 'rotation-system', label: '保守担当をローテーションし、負担を分散する', summary: '全員が交代で保守を担当し、特定メンバーへの集中を防ぐ。', effects: { quality: 2, cost: -1, schedule: -2, stakeholder: 1, morale: 4 }, explanation: 'ローテーションは負担の公平化に有効ですが、コンテキストスイッチが多くなる点は考慮が必要です。', pmBokTags: ['資源管理', 'コミュニケーション管理'] },
          { id: 'freeze-maintenance', label: '緊急以外の保守は止めて、新機能優先で進める', summary: 'ビジネス価値の高い機能開発に集中する。', effects: { quality: -7, cost: 0, schedule: 4, stakeholder: -4, morale: -3 }, explanation: '保守を停止すると技術的負債と品質問題が蓄積します。短期的な開発速度より長期的な信頼性を守る判断が必要です。', pmBokTags: ['品質管理', 'リスク管理'] },
        ],
      },
    ],
  },
  {
    id: 'organizational-change',
    label: '組織変革',
    description: '会社の変革期に伴うチーム崩壊リスクへの対応。人・組織・戦略の変化が同時に押し寄せます。',
    scenarios: [
      {
        id: 'org-merger',
        title: '会社合併でプロジェクト体制が大きく変わった',
        description:
          '会社合併が発表され、合併先のシステムとの統合が課題となった。合併先の部門は独自システムへの強いこだわりを持っており、どちらのシステムを残すかで社内政治が激化しています。',
        pmTip: 'PMの仕事：変革期のファシリテーション。合併時はシステムより人間関係の調整が重要です。PMは政治的に中立な立場で合意形成を促進します。',
        docs: [{ type: 'リスク管理表', title: '合併統合リスク評価', content: '技術リスク: システム間の連携・データ移行\n組織リスク: 文化の衝突・意思決定権の曖昧さ\n人材リスク: キーメンバーの流出\n期限: 合併後6ヶ月以内に統合方針決定が必要' }],
        choices: [
          { id: 'proactive-integration', label: '早期に合併先チームと合同WSを開き、方針を共同決定する', summary: 'どちらが正しいかより、ともに最良の解を作る姿勢で進める。', effects: { quality: 5, cost: -4, schedule: -5, stakeholder: 8, morale: 4 }, explanation: 'PMが中立的なファシリテーターとして機能することで、政治的対立を技術的議論に転換できます。早期の合意形成が後の混乱を防ぎます。', pmBokTags: ['ステークホルダー管理', '統合管理', 'コミュニケーション管理'] },
          { id: 'wait-for-decision', label: '経営層の方針決定を待ち、それに従う', summary: '上位の判断を待ってから動く。', effects: { quality: 0, cost: 0, schedule: -6, stakeholder: -2, morale: -3 }, explanation: '経営判断を待つことは安全ですが、決定が遅れるほど現場の混乱と士気低下が進みます。PMは上位判断を促す働きかけが必要です。', pmBokTags: ['ステークホルダー管理', 'リスク管理'] },
          { id: 'push-own-system', label: '自社システムの優位性を主張し、自社側の採用を推進する', summary: '自社システムを残すよう積極的に働きかける。', effects: { quality: 2, cost: 0, schedule: -3, stakeholder: -6, morale: -2 }, explanation: '自社システムを推す姿勢は政治的対立を深める可能性があります。PMは中立性を保ちながら最良の結果を追求すべきです。', pmBokTags: ['ステークホルダー管理', 'コミュニケーション管理'] },
        ],
      },
      {
        id: 'org-talent-drain',
        title: 'キーメンバーが次々と異動・退職している',
        description:
          '組織変革の影響でこの3ヶ月間に、コアメンバー5名中3名が他部門への異動や退職。プロジェクト固有の知識が急速に失われており、新メンバーへの引き継ぎが追いつかない状況です。',
        pmTip: 'PMの仕事：知識を組織の資産にする。特定の人に依存した知識は危険です。PMは「誰がいなくなっても回る」仕組みを作ります。',
        docs: [{ type: '課題管理表', title: '知識流出リスク評価', content: '3ヶ月間の離脱: 3名（コアメンバー60%）\n知識移転状況: 不十分（ドキュメント化率20%）\nリスク: 特定機能の知識保有者がゼロになる可能性' }],
        choices: [
          { id: 'knowledge-transfer-system', label: '知識移転プロセスを仕組み化し、属人化を解消する', summary: 'ドキュメント・ペアプロ・ランブックで知識を組織の資産にする。', effects: { quality: 6, cost: -4, schedule: -4, stakeholder: 2, morale: 3 }, explanation: '知識の組織化は短期的なコストはかかりますが、属人化のリスクを根本的に解消します。PMはこの仕組みを推進する役割があります。', pmBokTags: ['資源管理', '品質管理', '統合管理'] },
          { id: 'retention-bonus', label: '残っているメンバーへの待遇改善を経営層に働きかける', summary: 'キーメンバーの流出を防ぐため、待遇改善を提案する。', effects: { quality: 2, cost: -5, schedule: -1, stakeholder: 2, morale: 7 }, explanation: '優秀なメンバーの引き留めは即効性がありますが、根本的な組織課題の解決にはなりません。知識移転と並行して行う必要があります。', pmBokTags: ['資源管理', 'ステークホルダー管理'] },
          { id: 'rapid-onboarding', label: '新メンバーを急いで採用・育成し、人数で補う', summary: '即戦力を外部から招き、数で知識流出をカバーする。', effects: { quality: -4, cost: -8, schedule: -3, stakeholder: -1, morale: -3 }, explanation: '急採用は短期的に人数を補えますが、新メンバーの立ち上がりに時間がかかり、即戦力になるまでの品質低下リスクがあります。', pmBokTags: ['資源管理', '調達管理'] },
        ],
      },
      {
        id: 'org-management-challenge',
        title: '新経営陣がプロジェクトの継続価値に疑問を持っている',
        description:
          '経営交代後、新任CEO が「このプロジェクトは本当に必要か？ROIが見えない」と発言。予算委員会での継続承認が不透明な状況になっています。',
        pmTip: 'PMの仕事：ビジネス価値の説明責任。PMはプロジェクトの存在意義を経営言語で説明する責任があります。技術の話だけでは伝わりません。',
        docs: [{ type: 'メール', title: '新任CEOからの質問メール', content: 'CEO: 「このプロジェクトに投資してきた金額と得られた成果を教えてほしい。来月の予算委員会で継続判断する」\nPM: ROIと価値の可視化が急務' }],
        choices: [
          { id: 'roi-presentation', label: 'ROIとビジネス価値をデータで可視化し、経営層に説明する', summary: '定量データと定性的価値を整理し、継続の必要性を説明する。', effects: { quality: 3, cost: -3, schedule: -2, stakeholder: 8, morale: 4 }, explanation: 'PMはプロジェクトの価値を経営言語で語る責任があります。技術の話だけでなく、ビジネスへの貢献を数値で示すことが重要です。', pmBokTags: ['統合管理', 'ステークホルダー管理', 'コミュニケーション管理'] },
          { id: 'cost-reduction', label: 'コスト削減案を提示して、予算獲得の条件を整える', summary: '規模を縮小してでも継続できるプランを提案する。', effects: { quality: -2, cost: 5, schedule: -2, stakeholder: 4, morale: -2 }, explanation: 'コスト削減は短期的な承認を得るのに有効ですが、必要な機能や品質を犠牲にしないよう慎重に判断する必要があります。', pmBokTags: ['コスト管理', 'ステークホルダー管理'] },
          { id: 'accept-termination-risk', label: 'プロジェクト廃止も選択肢として経営層の判断に委ねる', summary: '継続・廃止の両シナリオを提示し、経営判断を求める。', effects: { quality: 1, cost: 0, schedule: 0, stakeholder: 2, morale: -5 }, explanation: 'プロジェクト廃止シナリオを含めた提案は正直な対応ですが、チームの士気に大きな影響を与えます。廃止の影響範囲も含めた詳細な説明が必要です。', pmBokTags: ['統合管理', 'ステークホルダー管理', 'リスク管理'] },
        ],
      },
    ],
  },
  {
    id: 'legacy-renewal',
    label: 'レガシー刷新',
    description: '技術的負債とシステムの老朽化に正面から向き合う。刷新の判断と移行リスク管理がPMの真価を問います。',
    scenarios: [
      {
        id: 'leg-recurring-outage',
        title: '5年前のコードが原因で月に数回の障害が発生している',
        description:
          '誰も全体を把握していない5年前のコードが原因で、月平均2.3回の本番障害が発生。パッチを当てるたびに別の場所が壊れ、根本的な刷新が必要と分かっているが決断できていません。',
        pmTip: 'PMの仕事：技術的判断のビジネス化。「刷新すべきかどうか」は技術の問題ですが、「いつ・どのように」はPMが経営と技術をつなぐ判断です。',
        docs: [{ type: 'リスク管理表', title: 'レガシー障害リスク分析', content: '月間障害件数: 平均2.3件\n年間損失見積: 約4,200万円\n刷新コスト概算: 2.5億円\n現状維持コスト（5年間）: 3.1億円\n結論: 経済的には刷新が合理的' }],
        choices: [
          { id: 'modernization-plan', label: '段階的な刷新ロードマップを策定し、経営承認を得る', summary: 'ビジネスへの影響を最小化しながら、計画的に刷新する。', effects: { quality: 8, cost: -8, schedule: -6, stakeholder: 5, morale: 4 }, explanation: '段階的な刷新はリスクを分散しながら技術的負債を解消します。データで経営承認を得ることで、チームが安心して刷新に集中できます。', pmBokTags: ['統合管理', 'リスク管理', 'コスト管理'] },
          { id: 'continuous-patching', label: '引き続きパッチ対応で現状維持し、刷新は先送りにする', summary: '現行システムを維持しながら、機会を待つ。', effects: { quality: -5, cost: -2, schedule: 2, stakeholder: -3, morale: -4 }, explanation: 'パッチ対応の継続は問題の根本解決になりません。技術的負債が蓄積するにつれ、最終的な刷新コストはさらに膨らみます。', pmBokTags: ['リスク管理', '品質管理'] },
          { id: 'big-bang-rewrite', label: '現行システムを全停止して一気に作り直す', summary: '移行期間を設けず、新旧切り替えを一度に行う。', effects: { quality: 5, cost: -12, schedule: -12, stakeholder: -5, morale: -3 }, explanation: 'ビッグバンリライトは高リスクです。複雑なシステムほど一気の書き直しは失敗しやすく、段階的移行と比較検討が必要です。', pmBokTags: ['リスク管理', 'スケジュール管理', '統合管理'] },
        ],
      },
      {
        id: 'leg-migration-timing',
        title: '新技術への移行タイミングと方法の判断を迫られた',
        description:
          '現在使用しているフレームワークとインフラのサポートが2年後に終了する通知が来た。移行先の候補技術は3つあり、それぞれにコスト・リスク・学習コストのトレードオフがある。',
        pmTip: 'PMの仕事：技術選択の責任。技術選定はエンジニアの判断だけでなく、PMがビジネス視点（コスト・リスク・スケジュール）を加えて意思決定に関与します。',
        docs: [{ type: 'リスク管理表', title: '技術移行選択肢比較', content: '選択肢A: クラウドネイティブへ全移行（高コスト・高将来性）\n選択肢B: 現行技術の後継バージョンに移行（低コスト・低リスク）\n選択肢C: マイクロサービスへ段階移行（中コスト・中リスク・長期間）\nデッドライン: 2年後のEOL' }],
        choices: [
          { id: 'phased-migration', label: '段階的移行計画を立て、リスクを分散して進める', summary: '2年の期限内に安全に移行できる現実的なプランを選択する。', effects: { quality: 5, cost: -5, schedule: -4, stakeholder: 3, morale: 2 }, explanation: '段階的移行はリスクを分散し、移行中のサービス継続性を確保します。PMはビジネス影響を最小化する移行計画の策定が重要な役割です。', pmBokTags: ['リスク管理', '統合管理', 'スケジュール管理'] },
          { id: 'safe-successor', label: '現行技術の後継版に移行し、学習コストを最小化する', summary: '既存知識を活かせる最も安全な移行パスを選ぶ。', effects: { quality: 3, cost: -2, schedule: -2, stakeholder: 2, morale: 3 }, explanation: '保守的な技術選択はリスクを最小化します。ただし将来的な競争力に制約が生じる可能性があります。長期戦略との整合性を確認する必要があります。', pmBokTags: ['リスク管理', 'コスト管理'] },
          { id: 'cloud-native-leap', label: 'クラウドネイティブへの全面移行で将来競争力を確保する', summary: '高コストだが、最も将来性の高い技術基盤に移行する。', effects: { quality: 6, cost: -12, schedule: -8, stakeholder: 3, morale: 4 }, explanation: 'クラウドネイティブへの全面移行は長期的競争力を確保しますが、コストと工数が大きく、移行リスクも高いです。ビジネス価値との比較検討が必要です。', pmBokTags: ['統合管理', 'コスト管理', 'リスク管理'] },
        ],
      },
      {
        id: 'leg-unknown-system',
        title: '誰もシステム全体を把握していない——ブラックボックス化が深刻',
        description:
          '開発から7年が経過し、当初のメンバーは全員退職。コードは動いているが設計意図を理解できる人間がおらず、改修のたびに「どこか壊れるかもしれない」という恐怖から身動きが取れない状態になっています。',
        pmTip: 'PMの仕事：技術的リスクを可視化する。「わからない」という状態がビジネスリスクです。PMはこの不確実性を定量化して経営に伝える責任があります。',
        docs: [{ type: '課題管理表', title: 'システム理解度調査結果', content: 'アーキテクチャを理解しているメンバー: 0名\n各モジュールの担当者: 不在\nドキュメント最終更新: 4年前\n現状: 改修時の影響範囲が予測不能' }],
        choices: [
          { id: 'reverse-engineering', label: 'リバースエンジニアリングとドキュメント化を計画的に進める', summary: '動いているコードから設計を逆算し、知識を再構築する。', effects: { quality: 7, cost: -6, schedule: -5, stakeholder: 2, morale: 3 }, explanation: 'リバースエンジニアリングはコストはかかりますが、ブラックボックスを解消する根本的な方法です。理解度が高まるほど改修リスクが下がります。', pmBokTags: ['品質管理', '統合管理', 'リスク管理'] },
          { id: 'specialist-hire', label: 'レガシーシステムの専門家を外部から招聘する', summary: '社外の専門知識を活用し、急速に理解を深める。', effects: { quality: 5, cost: -8, schedule: -3, stakeholder: 2, morale: 2 }, explanation: 'レガシー専門家の招聘は即効性があります。ただし内部に知識が残らないリスクがあるため、社内移転を並行して進める必要があります。', pmBokTags: ['資源管理', '調達管理', 'リスク管理'] },
          { id: 'accept-risk', label: 'リスクを把握した上で、現状維持のまま運用を続ける', summary: 'コストをかけず、壊れたら対応するスタンスを維持する。', effects: { quality: -6, cost: 0, schedule: 2, stakeholder: -2, morale: -5 }, explanation: 'ブラックボックスのまま運用を続けると、障害発生時の対応コストが膨大になります。PMはリスクを経営層に正確に説明する責任があります。', pmBokTags: ['リスク管理', '品質管理'] },
        ],
      },
    ],
  },
  {
    id: 'project-closure',
    label: '長期プロジェクト完結',
    description: '200週に及ぶ旅の終着点。最終報告・チーム解散・次世代への引き継ぎがPMの最後の仕事です。',
    scenarios: [
      {
        id: 'closure-executive-report',
        title: '4年間のプロジェクトを経営層に最終報告する',
        description:
          '200週のプロジェクトの最終成果を役員会でプレゼンする機会が与えられた。成功と失敗の両方を含む4年間をどう総括し、組織の学びとして残すかが問われています。',
        pmTip: 'PMの仕事：プロジェクトを組織の学びに変える。最終報告は「終わり」ではなく「次のプロジェクトへの贈り物」です。成功も失敗も正直に伝えることがPMの誠実さです。',
        docs: [{ type: 'リスク管理表', title: '最終成果サマリー', content: '開始: 4年前\n総投資: 約18億円\n主な成果: 業務効率30%向上・顧客満足度大幅改善\n課題: 当初計画比40%のコスト超過\n学び: 多数あり' }],
        choices: [
          { id: 'honest-comprehensive', label: '成功も課題も全て含む正直な最終報告を行う', summary: '達成事項と反省点を両方含め、組織の学びとして共有する。', effects: { quality: 8, cost: 0, schedule: 0, stakeholder: 8, morale: 6 }, explanation: 'PMの誠実さは、成功だけでなく失敗の教訓を正直に伝えることで示されます。組織学習のためには、良いことも悪いことも開示することが重要です。', pmBokTags: ['コミュニケーション管理', '統合管理', 'ステークホルダー管理'] },
          { id: 'highlight-success', label: '成功実績を強調し、ポジティブな印象を残す', summary: '課題は最小限に触れ、達成した価値を最大限アピールする。', effects: { quality: 0, cost: 0, schedule: 0, stakeholder: 3, morale: 2 }, explanation: '成功の強調は短期的な評価を高めますが、課題が見えないことで組織が同じミスを繰り返すリスクがあります。', pmBokTags: ['コミュニケーション管理', 'ステークホルダー管理'] },
          { id: 'delegate-report', label: 'チームメンバーに報告を任せ、自分はサポートに回る', summary: 'PMとしての前面に出ず、チームの成果として報告する。', effects: { quality: 2, cost: 0, schedule: 0, stakeholder: 2, morale: 8 }, explanation: 'チームに報告を任せることはメンバーの成長機会になります。ただしPMとしての説明責任を完全に委譲するのは適切ではない場合があります。', pmBokTags: ['資源管理', 'コミュニケーション管理'] },
        ],
      },
      {
        id: 'closure-team-transition',
        title: 'チームメンバーの次の配置を決める時期が来た',
        description:
          'プロジェクト完了に伴い、チームメンバーの次の配置を決める必要がある。4年間を共にした仲間たちへの配慮と、次のプロジェクトへの貢献のバランスが求められます。',
        pmTip: 'PMの仕事：チームメンバーのキャリアを考える。優秀なメンバーが次も活躍できるよう、PMはキャリアを考えた配置を人事・経営層に働きかける責任があります。',
        docs: [{ type: '議事録', title: 'チーム今後の進路確認メモ', content: 'メンバーA: 「次は新技術に挑戦したい」\nメンバーB: 「慣れた業務を続けたい」\nメンバーC: 「このプロジェクトの運用を続けたい」\nPM: 個々の希望と組織のニーズをどう調整するか' }],
        choices: [
          { id: 'career-conscious-placement', label: '個々のキャリア希望を人事と調整し、最適な配置を提案する', summary: 'メンバー一人ひとりの希望と強みを活かした配置を実現する。', effects: { quality: 2, cost: 0, schedule: -2, stakeholder: 4, morale: 10 }, explanation: 'PMがメンバーのキャリアを考えて動くことは、組織への貢献だけでなく、人材を大切にする文化を作ります。次のプロジェクトでも信頼されるPMになれます。', pmBokTags: ['資源管理', 'ステークホルダー管理', 'コミュニケーション管理'] },
          { id: 'let-them-choose', label: 'メンバー自身で次の配置を探させ、PMは口出しをしない', summary: '自律性を尊重し、各自が次のキャリアを選ぶ。', effects: { quality: 0, cost: 0, schedule: 0, stakeholder: 0, morale: 4 }, explanation: '自律性を尊重するアプローチは良いですが、PMが積極的に関与することでメンバーはより良い機会を得られる場合があります。', pmBokTags: ['資源管理'] },
          { id: 'organizational-needs-first', label: '組織のニーズを優先し、最も必要な部署に配置する', summary: 'チームの希望より会社の必要性を優先する。', effects: { quality: 0, cost: 0, schedule: 0, stakeholder: 2, morale: -4 }, explanation: '組織ニーズの優先は短期的に効率的ですが、メンバーの不満が蓄積すると優秀な人材の流出につながります。個人と組織両方のニーズを考慮する判断が重要です。', pmBokTags: ['資源管理', 'ステークホルダー管理'] },
        ],
      },
      {
        id: 'closure-handover',
        title: '次世代チームへの最終引き継ぎと、プロジェクトの終息処理',
        description:
          '4年間の全ての知識・ドキュメント・教訓を次のチームに引き継ぐ最終作業。どれだけ丁寧に引き継ぐかが、このプロジェクトの最終評価を決めます。',
        pmTip: 'PMの仕事：有終の美。プロジェクトの終わり方がそのPMの評価を決めます。丁寧な引き継ぎは「次のプロジェクトへの最大の贈り物」です。',
        docs: [{ type: '課題管理表', title: 'プロジェクト終息チェックリスト', content: '必要な引き継ぎ: 技術ドキュメント・運用手順・教訓集・連絡先リスト\n完了状況: 40%\n残り時間: 3週間\n次チームのリーダー: 未定' }],
        choices: [
          { id: 'thorough-handover', label: '3週間かけて完全な引き継ぎを実施し、有終の美を飾る', summary: 'ドキュメント・face-to-faceセッション・Q&Aを全て実施する。', effects: { quality: 10, cost: -4, schedule: -4, stakeholder: 10, morale: 8 }, explanation: 'PMとしての最後の仕事は、次のチームが迷わないようにすることです。丁寧な引き継ぎは「良いPMだった」という最終評価に直結します。', pmBokTags: ['統合管理', 'コミュニケーション管理', '品質管理'] },
          { id: 'minimal-handover', label: '必要最低限の引き継ぎだけ行い、早期に解散する', summary: '主要ドキュメントのみ渡して、次のチームに任せる。', effects: { quality: -4, cost: 2, schedule: 4, stakeholder: -4, morale: 0 }, explanation: '引き継ぎを省略すると次のチームが困ります。4年間の知識が失われ、同じ失敗が繰り返されるリスクがあります。', pmBokTags: ['リスク管理', 'コミュニケーション管理'] },
          { id: 'extend-project', label: '引き継ぎ完了を理由にプロジェクトの期間延長を申請する', summary: '十分な引き継ぎのために、正式な延長を求める。', effects: { quality: 5, cost: -5, schedule: -5, stakeholder: -2, morale: 2 }, explanation: '延長申請は引き継ぎ品質を守るために有効ですが、コストと時間の正当化が必要です。まず3週間で最大限効率的な引き継ぎができないか検討すべきです。', pmBokTags: ['統合管理', 'ステークホルダー管理', 'コスト管理'] },
        ],
      },
    ],
  },
];
