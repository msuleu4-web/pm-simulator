import type { RandomEvent } from './types';

export const randomEvents: RandomEvent[] = [
  {
    id: 'exec-deadline-pressure',
    title: '経営層から「1ヶ月前倒しで届けてほしい」と圧力がかかった',
    description:
      '部長から突然「競合の動きが早いから、現計画より1ヶ月早くリリースしてほしい」と直接指示が入った。チームキャパと品質基準を考えると、そのまま受け入れるのは難しい状況です。',
    severity: 'high',
    phaseIds: ['all'],
    choices: [
      {
        id: 'negotiate-scope',
        label: 'スコープを絞って前倒しに応える',
        summary: '機能を一部削減し、期限短縮に対応する。',
        effects: { quality: -4, cost: 2, schedule: 8, stakeholder: 3, morale: -3 },
        explanation:
          'スコープを調整して期限に対応する判断は現実的です。削減機能についての顧客合意と品質影響の管理が前提になります。',
        pmBokTags: ['スコープ管理', 'ステークホルダー管理', '統合管理'],
      },
      {
        id: 'push-back-with-data',
        label: 'WBSデータを示して現実的な判断を求める',
        summary: '工数実績と根拠を提示し、前倒しの困難さを説明する。',
        effects: { quality: 5, cost: 0, schedule: -2, stakeholder: 2, morale: 6 },
        explanation:
          'PMはデータに基づいて経営層に根拠を示すことが重要です。チームを守る姿勢がモチベーション維持にもつながります。',
        pmBokTags: ['統合管理', 'スケジュール管理', 'コミュニケーション管理'],
      },
      {
        id: 'accept-with-overtime',
        label: 'チームに残業を要請して前倒しを目指す',
        summary: '現行スコープのまま、残業で期限短縮に対応する。',
        effects: { quality: -8, cost: -4, schedule: 6, stakeholder: 4, morale: -12 },
        explanation:
          '残業で強引に対応しようとすると、品質と士気に深刻な悪影響を及ぼします。PMはチームの持続可能性を守る判断が求められます。',
        pmBokTags: ['資源管理', 'リスク管理', 'スケジュール管理'],
      },
    ],
  },
  {
    id: 'member-burnout',
    title: 'メンバーの疲弊が限界に近い——「最近眠れていない」と打ち明けられた',
    description:
      '週次1on1でPL田中さんが「残業が続いて最近眠れていない」と打ち明けた。チーム全体の疲弊サインが見え始めており、このまま見逃すと病欠や突然の離脱につながるリスクがあります。',
    severity: 'high',
    phaseIds: ['all'],
    choices: [
      {
        id: 'reduce-load',
        label: '負荷を分散し、休暇取得を優先する',
        summary: 'タスク再配分と有給取得を促し、コンディションを回復する。',
        effects: { quality: 2, cost: -2, schedule: -4, stakeholder: 0, morale: 10 },
        explanation:
          'チームの持続可能性を守る判断は長期的な生産性につながります。「今のスケジュールより後の継続性」という視点がPMに求められます。',
        pmBokTags: ['資源管理', 'コミュニケーション管理', '統合管理'],
      },
      {
        id: 'monitor-only',
        label: '様子を見ながら観察を続ける',
        summary: '今すぐ対処せず、状況をモニタリングする。',
        effects: { quality: 0, cost: 0, schedule: 0, stakeholder: 0, morale: -6 },
        explanation:
          'バーンアウトの初期サインを「様子見」で放置すると、後で大きなリスクになります。早期対処が最善です。',
        pmBokTags: ['資源管理', 'リスク管理'],
      },
      {
        id: 'escalate-hr',
        label: '人事・上長にエスカレーションし、体制を見直す',
        summary: '状況を報告し、人員補充や体制変更を検討する。',
        effects: { quality: 3, cost: -4, schedule: -2, stakeholder: 2, morale: 8 },
        explanation:
          'PMが問題を抱え込まず、組織として対応する姿勢は正しい判断です。心理的安全性を守ることがプロジェクトの質を維持します。',
        pmBokTags: ['資源管理', 'ステークホルダー管理', '統合管理'],
      },
    ],
  },
  {
    id: 'team-conflict',
    title: 'プロパーとSESの間で口論が発生——チャットも冷え切っている',
    description:
      '自社プロパーとSES（協力会社）の間で業務の進め方について口論が発生。チャット上でも冷たいやり取りが続き、会議での発言が極端に減っています。放置すると情報共有が止まり、品質に影響が出るリスクがあります。',
    severity: 'medium',
    phaseIds: ['all'],
    choices: [
      {
        id: 'mediate-1on1',
        label: '双方と個別面談し、PMが仲裁に入る',
        summary: '当事者の話を聞き、認識のずれを解消する。',
        effects: { quality: 2, cost: 0, schedule: -2, stakeholder: 1, morale: 8 },
        explanation:
          'PMは心理的安全性を守る責任があります。個別面談で双方の立場を理解し、建設的な関係に戻すアプローチが有効です。',
        pmBokTags: ['コミュニケーション管理', '資源管理', 'ステークホルダー管理'],
      },
      {
        id: 'ignore-conflict',
        label: '仕事に支障がなければ介入しない',
        summary: '個人間の問題として放置する。',
        effects: { quality: -4, cost: 0, schedule: -2, stakeholder: 0, morale: -8 },
        explanation:
          '人間関係トラブルを放置すると情報のサイロ化が進み、進捗管理や品質管理に悪影響が出ます。PMは早期に介入すべきです。',
        pmBokTags: ['コミュニケーション管理', 'リスク管理'],
      },
      {
        id: 'reorganize-tasks',
        label: 'タスクを見直し、接触機会を最小化する',
        summary: '関係者が関わる業務を分離し、摩擦を一時的に減らす。',
        effects: { quality: -2, cost: 1, schedule: -2, stakeholder: 0, morale: 3 },
        explanation:
          '物理的分離は一時的な対処です。根本的な関係修復を行わないとサイロリスクが残ります。',
        pmBokTags: ['資源管理', 'コミュニケーション管理'],
      },
    ],
  },
  {
    id: 'client-contact-transfer',
    title: '要件をよく知る顧客担当者が突然異動になった',
    description:
      '要件をよく理解していた顧客担当の山田さんが人事異動で別部門へ。後任の鈴木さんは業務背景の理解が浅く「前任者から何も引き継がれていない」と話しています。今後の合意形成に支障が出る可能性があります。',
    severity: 'high',
    phaseIds: ['requirements', 'basicDesign'],
    choices: [
      {
        id: 'onboard-successor',
        label: '後任者向け引き継ぎミーティングをPM主導で設定する',
        summary: '後任担当者に要件・決定事項を再共有して認識合わせを行う。',
        effects: { quality: 4, cost: -2, schedule: -4, stakeholder: 7, morale: 1 },
        explanation:
          '担当者交代はよくあるリスクです。PMが主体的に引き継ぎを支援し、関係者間の認識ずれを防ぐのが正しい対応です。',
        pmBokTags: ['ステークホルダー管理', 'コミュニケーション管理', 'リスク管理'],
      },
      {
        id: 'document-and-reconfirm',
        label: '合意済み内容を文書化して後任者と再確認する',
        summary: '仕様・合意事項を整理して確認の場を設ける。',
        effects: { quality: 6, cost: -3, schedule: -5, stakeholder: 5, morale: 0 },
        explanation:
          '議事録・合意資料を整理して後任者とレビューする姿勢は、プロジェクトの透明性を高めます。ドキュメント化の価値が発揮される場面です。',
        pmBokTags: ['コミュニケーション管理', '統合管理', 'ステークホルダー管理'],
      },
      {
        id: 'rely-on-predecessor',
        label: '前任者に非公式に連絡して情報を補う',
        summary: '前任者のサポートを非公式に得ながら継続する。',
        effects: { quality: 2, cost: 0, schedule: 0, stakeholder: -3, morale: 0 },
        explanation:
          '前任者への非公式依存は短期的には有効ですが、正式な引き継ぎが完了しないまま進めるとリスクが残ります。',
        pmBokTags: ['リスク管理', 'コミュニケーション管理'],
      },
    ],
  },
  {
    id: 'key-member-resign',
    title: 'コア開発者から「今月末で辞めたい」と相談を受けた',
    description:
      '開発の要となっていたPG遠藤さんから「体調と家庭の事情で今月末に退職したい」と相談を受けた。担当機能の実装は6割完了しており、引き継ぎが間に合わなければクリティカルパスに直接影響が出ます。',
    severity: 'critical',
    phaseIds: ['detailedDesign', 'testing'],
    choices: [
      {
        id: 'negotiate-handover',
        label: '引き継ぎ期間を確保しつつ知識移転を最優先にする',
        summary: '残留交渉と並行して、ドキュメント化と引き継ぎを進める。',
        effects: { quality: -3, cost: -4, schedule: -5, stakeholder: 0, morale: -2 },
        explanation:
          'PMは感情的にならず、現実的な知識移転計画を立てることが重要です。ドキュメントと引き継ぎが後続メンバーを助けます。',
        pmBokTags: ['資源管理', 'リスク管理', '統合管理'],
      },
      {
        id: 'emergency-recruit',
        label: '協力会社に緊急で追加要員を依頼する',
        summary: '即戦力を外部調達し、空白を埋める。',
        effects: { quality: -5, cost: -12, schedule: -3, stakeholder: 2, morale: 1 },
        explanation:
          '緊急調達はコストと品質リスクが高いですが、デリバリーを守るためには現実的な手段です。スキルマッチングの確認が重要です。',
        pmBokTags: ['調達管理', '資源管理', 'コスト管理'],
      },
      {
        id: 'redistribute-work',
        label: '既存メンバーで業務を再分配して吸収する',
        summary: '残りのチームで担当を再割り振りする。',
        effects: { quality: -6, cost: 0, schedule: -8, stakeholder: -2, morale: -10 },
        explanation:
          '既存体制での吸収は、チーム全員の負荷増加と品質リスクにつながります。PMは無理な吸収をさせる前にリスクを報告すべきです。',
        pmBokTags: ['資源管理', 'スケジュール管理', 'リスク管理'],
      },
    ],
  },
  {
    id: 'vendor-contact-change',
    title: '協力会社の担当者が無断で変更されていた——新担当は状況を把握していない',
    description:
      '協力会社Aの主担当者が先週から変わっており、新担当者は現在の仕様や進捗をほとんど把握していないことが判明。引き継ぎがなされておらず、週次報告の精度も著しく落ちています。',
    severity: 'medium',
    phaseIds: ['basicDesign', 'detailedDesign'],
    choices: [
      {
        id: 'demand-proper-handover',
        label: '協力会社に正式な引き継ぎプロセスを要求する',
        summary: '契約上の義務として、適切な引き継ぎを求める。',
        effects: { quality: 4, cost: -2, schedule: -3, stakeholder: 2, morale: 1 },
        explanation:
          '調達管理の観点から、PMは協力会社に適切な体制維持を求める権利があります。正式な要求により関係を適切に維持します。',
        pmBokTags: ['調達管理', 'コミュニケーション管理', 'リスク管理'],
      },
      {
        id: 'onboard-new-contact',
        label: '自社主導で新担当者の立ち上げを支援する',
        summary: '相手を信頼し、自社側で引き継ぎを補う。',
        effects: { quality: 3, cost: -3, schedule: -3, stakeholder: 3, morale: 0 },
        explanation:
          '自社側でのオンボーディング支援は短期的なコストがかかりますが、関係維持と進捗管理の安定化につながります。',
        pmBokTags: ['調達管理', '統合管理', 'コミュニケーション管理'],
      },
      {
        id: 'accept-and-monitor',
        label: 'まず現状の進捗を確認し、状況に応じて対処する',
        summary: '実害の出方を見てから動く。',
        effects: { quality: -3, cost: 0, schedule: 0, stakeholder: -2, morale: -2 },
        explanation:
          '問題を先送りすると、後工程で品質やスケジュールへの影響が拡大する可能性があります。早期対処が重要です。',
        pmBokTags: ['リスク管理', '調達管理'],
      },
    ],
  },
  {
    id: 'budget-freeze',
    title: '財務部門から「追加発注を一時凍結」との通知が来た',
    description:
      '財務部門から「来期予算の見直しにより、本プロジェクトの追加発注は一時凍結する」という通知が届いた。追加工数の外部委託が計画通りできなくなり、内製での対応切り替えが必要になっています。',
    severity: 'critical',
    phaseIds: ['basicDesign', 'detailedDesign'],
    choices: [
      {
        id: 'scope-reduction',
        label: 'スコープを絞り、現有リソースで完遂できる計画に見直す',
        summary: '機能優先度を再設定し、予算内で最大限の成果を出す。',
        effects: { quality: -3, cost: 8, schedule: 2, stakeholder: -4, morale: 2 },
        explanation:
          'PMはスコープとコストのトレードオフを明確にし、制約下での最大成果を目指す計画を立てる判断が求められます。',
        pmBokTags: ['コスト管理', 'スコープ管理', '統合管理'],
      },
      {
        id: 'escalate-to-sponsor',
        label: 'スポンサーに影響を説明し、予算解除を働きかける',
        summary: '影響範囲を整理してスポンサーに報告し、解決を求める。',
        effects: { quality: 2, cost: -2, schedule: -3, stakeholder: 3, morale: 2 },
        explanation:
          'PMは問題をステークホルダーに透明に伝え、意思決定を支援する役割があります。エスカレーションは責任ある行動です。',
        pmBokTags: ['統合管理', 'ステークホルダー管理', 'コスト管理'],
      },
      {
        id: 'continue-as-is',
        label: 'なんとかなると判断し、計画をそのまま継続する',
        summary: '予算問題を楽観視して現計画を維持する。',
        effects: { quality: -5, cost: -8, schedule: -5, stakeholder: -3, morale: -4 },
        explanation:
          '予算制約を無視して進めると、後で大きな支出や品質問題として表面化します。PMは早期に現実的な判断をすべきです。',
        pmBokTags: ['コスト管理', 'リスク管理'],
      },
    ],
  },
  {
    id: 'library-vulnerability',
    title: '使用OSSライブラリにCVSSスコア9.8の重大脆弱性が公開された',
    description:
      '開発で使用しているOSSライブラリに、CVSSスコア9.8の重大な脆弱性が公開された。対象バージョンは現在使用中のもので、影響範囲の確認とバージョンアップが急務となっています。',
    severity: 'critical',
    phaseIds: ['detailedDesign', 'testing'],
    choices: [
      {
        id: 'immediate-patch',
        label: '緊急対応チームを組み、即時バージョンアップを実施する',
        summary: 'セキュリティを最優先にして修正バージョンへの移行を最速で行う。',
        effects: { quality: 8, cost: -5, schedule: -6, stakeholder: 3, morale: -2 },
        explanation:
          'セキュリティリスクへの迅速な対応はPMの責任です。短期的な遅延を承知でリスクを閉じる判断が評価されます。',
        pmBokTags: ['リスク管理', '品質管理', '統合管理'],
      },
      {
        id: 'assess-and-plan',
        label: '影響範囲を評価して計画的にパッチを当てる',
        summary: '影響範囲を確認し、スケジュールを調整しながら対応する。',
        effects: { quality: 5, cost: -3, schedule: -4, stakeholder: 2, morale: 1 },
        explanation:
          '焦らず影響を整理して対応するアプローチは、パニックを防ぎつつ安全性を確保します。',
        pmBokTags: ['リスク管理', '品質管理', 'スケジュール管理'],
      },
      {
        id: 'defer-to-release',
        label: 'リリース後の修正パッチで対応することにする',
        summary: '今のスケジュールを優先し、リリース後に対応する。',
        effects: { quality: -10, cost: 0, schedule: 5, stakeholder: -5, morale: -3 },
        explanation:
          '重大なセキュリティ脆弱性を先送りすることは顧客・エンドユーザーへのリスクと法的責任問題につながります。PMはリスクの重大性を正確に判断すべきです。',
        pmBokTags: ['リスク管理', '品質管理'],
      },
    ],
  },
  {
    id: 'infra-outage',
    title: '共有開発・テスト環境が突然ダウン——復旧まで最大3日かかる',
    description:
      '開発チームが使用している社内サーバーが障害で停止。インフラ担当に問い合わせると、復旧まで最大3日かかる可能性があるとのこと。テストが止まり、開発作業も著しく遅延しています。',
    severity: 'high',
    phaseIds: ['detailedDesign', 'testing'],
    choices: [
      {
        id: 'cloud-backup',
        label: 'クラウド環境に一時移行して作業を継続する',
        summary: '代替環境を素早く用意し、ダウンタイムを最小化する。',
        effects: { quality: 2, cost: -6, schedule: 2, stakeholder: 2, morale: 3 },
        explanation:
          '迅速に代替手段を手配するPMの判断は、チームのロスタイムを減らします。コスト増でも継続性を確保する判断は評価されます。',
        pmBokTags: ['リスク管理', '資源管理', 'スケジュール管理'],
      },
      {
        id: 'use-downtime',
        label: '復旧を待ちながら設計レビューや資料整備を行う',
        summary: 'ダウンタイムをドキュメント整備作業に充てる。',
        effects: { quality: 3, cost: 0, schedule: -5, stakeholder: -1, morale: -2 },
        explanation:
          'ダウンタイムをドキュメント作業に転用するのは合理的ですが、3日間の遅延がスケジュール全体に与える影響の報告が必要です。',
        pmBokTags: ['スケジュール管理', 'リスク管理', 'コミュニケーション管理'],
      },
      {
        id: 'escalate-infra',
        label: 'インフラ担当に優先対応を要請し、SLAを確認する',
        summary: '復旧優先度を上げるよう交渉し、影響を最小化する。',
        effects: { quality: 1, cost: 0, schedule: -2, stakeholder: 1, morale: 1 },
        explanation:
          'SLAや優先対応の交渉は社内リソース管理の一環です。PMは他部門との調整力も重要なスキルです。',
        pmBokTags: ['統合管理', 'コミュニケーション管理', 'リスク管理'],
      },
    ],
  },
  {
    id: 'vendor-bankruptcy',
    title: '二次請けの協力会社が「来月末で撤退」と突然通知してきた',
    description:
      '二次請けの協力会社Bから「事業縮小のため来月末で本プロジェクトから撤退する」と連絡が来た。担当範囲の約20%が未完了のまま引き継ぎが発生する見通しで、代替体制の確保が急務です。',
    severity: 'critical',
    phaseIds: ['basicDesign', 'detailedDesign'],
    choices: [
      {
        id: 'find-replacement',
        label: '代替ベンダーを緊急で探し、体制を維持する',
        summary: '既存の取引先や新規ベンダーへの移行を最優先で進める。',
        effects: { quality: -3, cost: -10, schedule: -4, stakeholder: 2, morale: -2 },
        explanation:
          'ベンダー撤退への迅速な代替確保はPMの調達管理能力が問われます。引き継ぎドキュメントと品質の継続性が鍵です。',
        pmBokTags: ['調達管理', 'リスク管理', '資源管理'],
      },
      {
        id: 'insource-work',
        label: '撤退分を自社チームで内製化する',
        summary: '残業や社内増員で不足分を吸収する。',
        effects: { quality: -5, cost: -3, schedule: -7, stakeholder: 0, morale: -8 },
        explanation:
          '内製化による吸収はコスト以上に工数と品質に影響します。PMはメンバーへの過負荷を考慮して慎重に判断すべきです。',
        pmBokTags: ['資源管理', 'コスト管理', '調達管理'],
      },
      {
        id: 'escalate-and-replan',
        label: '上長にエスカレーションし、プロジェクト計画を見直す',
        summary: 'スポンサーと協議し、体制・スコープ・納期を再設定する。',
        effects: { quality: 2, cost: -4, schedule: -5, stakeholder: 3, morale: 2 },
        explanation:
          '大きな体制変化はPMだけで解決できないこともあります。エスカレーションと透明な情報共有で組織的に対処する判断が重要です。',
        pmBokTags: ['統合管理', 'ステークホルダー管理', '調達管理'],
      },
    ],
  },
  {
    id: 'law-change',
    title: '個人情報保護法改正でシステム要件の変更が必要になった',
    description:
      '個人情報保護法の改正により、現在設計中の画面でのデータ表示方法が新基準を満たさないことが判明。要件の一部見直しが必要になり、設計の手戻りが発生する可能性があります。',
    severity: 'high',
    phaseIds: ['requirements', 'basicDesign', 'release'],
    choices: [
      {
        id: 'revise-and-document',
        label: '法改正への対応を要件に組み込み、合意を更新する',
        summary: '影響範囲を明確にし、顧客と共に要件を修正する。',
        effects: { quality: 6, cost: -5, schedule: -5, stakeholder: 4, morale: 0 },
        explanation:
          'コンプライアンス対応はPMの重要な責務です。発覚した時点で迅速に要件更新と合意形成を行うことが後のリスクを最小化します。',
        pmBokTags: ['品質管理', 'ステークホルダー管理', 'リスク管理'],
      },
      {
        id: 'minimal-compliance',
        label: '最小限の修正で法的要件のみ満たす対応をする',
        summary: '機能面は最小限の変更で法的義務を果たす。',
        effects: { quality: 2, cost: -2, schedule: -3, stakeholder: 1, morale: 1 },
        explanation:
          '最小限の法令対応で済ませる判断は工数を抑えつつリスクを回避します。ただし将来的な追加対応リスクが残る場合があります。',
        pmBokTags: ['リスク管理', 'スコープ管理', 'コスト管理'],
      },
      {
        id: 'ignore-for-now',
        label: 'リリース後の運用対応でカバーすることにする',
        summary: 'リリースを優先し、法的対応を後回しにする。',
        effects: { quality: -8, cost: 2, schedule: 4, stakeholder: -6, morale: -2 },
        explanation:
          '法改正への対応を先送りすることは顧客・エンドユーザーへの法的リスクを生じさせます。PMはコンプライアンスリスクの重大性を正しく判断すべきです。',
        pmBokTags: ['リスク管理', '品質管理'],
      },
    ],
  },
  {
    id: 'decision-maker-change',
    title: '顧客の最終承認者が定期異動で交代——「合意を改めて確認したい」と言われた',
    description:
      '最終承認を担っていた顧客の部長が定期異動で変わり、新任の田村部長は「前任者の判断は改めて確認が必要」というスタンスを取っています。合意済み事項が覆るリスクが生じています。',
    severity: 'high',
    phaseIds: ['requirements', 'basicDesign'],
    choices: [
      {
        id: 'formal-review',
        label: '合意済み事項を正式に再確認する場を設ける',
        summary: '新任者向けに合意内容を整理し、確認会議を開く。',
        effects: { quality: 3, cost: -3, schedule: -5, stakeholder: 7, morale: 0 },
        explanation:
          '意思決定者の交代は珍しくありません。PMが合意資料を整理し新任者の理解を得ることが信頼関係構築の第一歩です。',
        pmBokTags: ['ステークホルダー管理', 'コミュニケーション管理', '統合管理'],
      },
      {
        id: 'keep-existing-agreements',
        label: '合意済み事項は有効として変更のみ受け付ける',
        summary: '既存合意の有効性を主張し、変更要求のみ議論する。',
        effects: { quality: 2, cost: 0, schedule: 0, stakeholder: -4, morale: 1 },
        explanation:
          '合意の有効性を守る姿勢は正しいですが、新任者との関係が悪化すると後の合意形成が難しくなります。バランスが求められます。',
        pmBokTags: ['変更管理', 'ステークホルダー管理'],
      },
      {
        id: 'full-renegotiation',
        label: '全て一から確認し直すことを受け入れる',
        summary: '時間はかかるが、新任者の理解から改めて合意を作り直す。',
        effects: { quality: 4, cost: -5, schedule: -8, stakeholder: 8, morale: -3 },
        explanation:
          '一から作り直すことは工数がかかりますが、新任者との信頼構築という長期的メリットがあります。スケジューへの影響を明確にすることが重要です。',
        pmBokTags: ['ステークホルダー管理', 'スコープ管理', 'コミュニケーション管理'],
      },
    ],
  },
  {
    id: 'competitor-pressure',
    title: '競合他社の新機能リリースで「同等機能を入れてほしい」と打診が来た',
    description:
      '競合他社が同様のシステムに新機能を追加リリース。顧客から「競合と同等の機能を入れたい。どうにかなりませんか？」という非公式な打診が来ています。現在のスコープとスケジュールへの影響が懸念されます。',
    severity: 'medium',
    phaseIds: ['requirements', 'basicDesign'],
    choices: [
      {
        id: 'formal-change-request',
        label: '正式な変更要求として影響評価し、合意を取る',
        summary: '追加機能の工数・コストを見積り、顧客と正式に協議する。',
        effects: { quality: 3, cost: -4, schedule: -4, stakeholder: 5, morale: 1 },
        explanation:
          '変更管理プロセスで工数・コスト・納期への影響を明確にし、合意を得る対応が適切です。',
        pmBokTags: ['変更管理', 'スコープ管理', 'ステークホルダー管理'],
      },
      {
        id: 'reject-addition',
        label: '現在のスコープに集中し、追加は次フェーズ以降とする',
        summary: '既存スコープと品質を守り、追加要求を後回しにする。',
        effects: { quality: 4, cost: 0, schedule: 2, stakeholder: -4, morale: 2 },
        explanation:
          '競合対策による場当たり的なスコープ変更は品質を損なうリスクがあります。現在の計画を守る判断は長期的な品質確保に有効です。',
        pmBokTags: ['スコープ管理', '品質管理'],
      },
      {
        id: 'accept-urgently',
        label: '競合対抗のため、とにかく機能を詰め込む',
        summary: '競合への危機感から、スコープ外の機能を急ぎ追加する。',
        effects: { quality: -8, cost: -5, schedule: -6, stakeholder: 3, morale: -6 },
        explanation:
          '十分な検討なしに追加要件を詰め込むと、品質・コスト・士気への悪影響が集中します。PMは感情的判断ではなくデータに基づいた判断をすべきです。',
        pmBokTags: ['スコープ管理', 'リスク管理', '品質管理'],
      },
    ],
  },
  {
    id: 'offshore-quality',
    title: 'オフショアの納品コードが品質基準を大きく下回っていた',
    description:
      'コスト削減のため一部機能をオフショアに委託していたが、納品されたコードのレビューで標準規約違反・ドキュメント不足・テスト未実施が多数発覚。このまま使用すると品質リスクが高い状況です。',
    severity: 'high',
    phaseIds: ['detailedDesign'],
    choices: [
      {
        id: 'rework-with-bridge',
        label: 'ブリッジSEを立て、品質基準の再教育と修正を依頼する',
        summary: '橋渡し役を設置し、オフショアの品質を改善させる。',
        effects: { quality: 5, cost: -5, schedule: -5, stakeholder: 1, morale: -1 },
        explanation:
          'ブリッジSEを活用した品質改善は、オフショアとの協働を維持しながら成果物の品質を引き上げる有効な手段です。',
        pmBokTags: ['調達管理', '品質管理', 'コミュニケーション管理'],
      },
      {
        id: 'take-back-insource',
        label: '委託を取り消し、国内で作り直す',
        summary: 'コスト増を許容して品質を回復させる。',
        effects: { quality: 8, cost: -12, schedule: -6, stakeholder: 2, morale: -3 },
        explanation:
          'オフショアの品質問題を国内で解決することはコストと工数が増えますが、品質と納期のリスクを確実に低減できます。',
        pmBokTags: ['調達管理', '品質管理', 'コスト管理'],
      },
      {
        id: 'accept-with-review',
        label: '国内レビューを強化して、今の成果物で進める',
        summary: 'レビューで補いながら、現状の成果物をベースに進行する。',
        effects: { quality: -4, cost: -2, schedule: 0, stakeholder: -1, morale: -2 },
        explanation:
          '品質基準を下回る成果物をレビューで補おうとすると、後工程での品質問題とレビュー工数の増加につながります。',
        pmBokTags: ['品質管理', '調達管理', 'リスク管理'],
      },
    ],
  },
  {
    id: 'pm-sick',
    title: 'PM自身が高熱で「3日は安静に」と医師に言われた',
    description:
      '高熱が続き医師から「3日は安静に」と言われた。急いで対処しなければならない課題がいくつかあり、完全な不在は難しいが、フル対応も無理な状況です。チームと顧客への影響をどう最小化するかが問われます。',
    severity: 'medium',
    phaseIds: ['all'],
    choices: [
      {
        id: 'delegate-to-pl',
        label: 'PLに権限を委譲し、自分は最低限の監視だけにする',
        summary: 'PLに一時的な意思決定を委任し、休養と最低限の管理を両立する。',
        effects: { quality: 0, cost: 0, schedule: -2, stakeholder: 0, morale: 6 },
        explanation:
          'PMがPLへ委任する判断はチームの自律性を高める機会にもなります。信頼の委譲がチームを成長させます。',
        pmBokTags: ['資源管理', 'コミュニケーション管理', '統合管理'],
      },
      {
        id: 'work-sick',
        label: '無理してリモートで全て対応し続ける',
        summary: '体調が悪い状態でも判断・対応を全て継続する。',
        effects: { quality: -4, cost: 0, schedule: 0, stakeholder: 1, morale: -6 },
        explanation:
          '体調不良でのフル対応は判断ミスや長期化リスクを高めます。PMの自己管理も重要なリスク管理の一部です。',
        pmBokTags: ['資源管理', 'リスク管理'],
      },
      {
        id: 'escalate-to-superior',
        label: '上長に状況を共有し、代理判断者を立てる',
        summary: '不在リスクを上長に正直に伝え、代理体制を整える。',
        effects: { quality: 2, cost: 0, schedule: -1, stakeholder: 2, morale: 3 },
        explanation:
          '問題を抱え込まず組織として対応することはPMの成熟した判断です。透明性と報連相がチームの信頼を守ります。',
        pmBokTags: ['ステークホルダー管理', 'コミュニケーション管理', '統合管理'],
      },
    ],
  },

  // ─── あるある追加イベント ───────────────────────────────────────

  {
    id: 'sandwich-pressure',
    title: '三方向の板挟み——経営・顧客・現場から矛盾した要求が同時に届いた',
    description:
      '部長から「コストを削れ」、顧客から「機能追加・納期短縮」、チームから「この工数では無理」という三方向の要求が同時に届いた。全てを同時に満たす選択肢は存在しない。PMとして何を優先するか、正念場の判断を迫られています。',
    severity: 'critical',
    phaseIds: ['all'],
    choices: [
      {
        id: 'prioritize-customer',
        label: '顧客要求を最優先にし、内部で無理をして吸収する',
        summary: 'チームに無理をかけてでも顧客満足を守る。',
        effects: { quality: -5, cost: -4, schedule: 3, stakeholder: 5, morale: -10 },
        explanation: '顧客優先は短期的に関係を守りますが、チームの無理が続くと品質・士気の両方が崩壊します。PMはトレードオフを明示すべきです。',
        pmBokTags: ['ステークホルダー管理', 'リスク管理', '資源管理'],
      },
      {
        id: 'protect-team',
        label: 'チームの限界を守り、顧客に現状と選択肢を説明する',
        summary: '現実を伝えた上で、顧客と共に解決策を考える。',
        effects: { quality: 4, cost: 0, schedule: -4, stakeholder: -2, morale: 5 },
        explanation: 'チームを守りながら顧客に誠実に状況を説明するアプローチは、長期的な信頼関係と品質を維持します。PMは守護者であると同時に交渉者です。',
        pmBokTags: ['資源管理', 'コミュニケーション管理', 'ステークホルダー管理'],
      },
      {
        id: 'negotiate-tradeoff',
        label: '三者を集め、優先順位とトレードオフを明文化して合意を取る',
        summary: '全員が同じ情報を持ち、優先順位を一緒に決める。',
        effects: { quality: 5, cost: -2, schedule: -3, stakeholder: 5, morale: 4 },
        explanation: 'PMの本質は「全部立てる」ではなく「優先順位を決めて合意を取る」ことです。三者に同じテーブルで議論させることが最善の解決策です。',
        pmBokTags: ['統合管理', 'ステークホルダー管理', 'コミュニケーション管理'],
      },
    ],
  },
  {
    id: 'meeting-overload',
    title: '週3時間の進捗会議が「報告のための報告」になっている',
    description:
      '毎週月曜の進捗会議が3時間に及ぶ。全員が20ページのスライドを用意して読み上げるだけ。会議が終わっても何も決まらず、翌日からまた来週の資料作りが始まる。チームからは「会議の準備だけで半日消える」という不満が出ている。',
    severity: 'medium',
    phaseIds: ['all'],
    choices: [
      {
        id: 'keep-meeting',
        label: '前例踏襲で現状のまま続ける',
        summary: '変化を避け、既存の進め方を維持する。',
        effects: { quality: -2, cost: -3, schedule: -3, stakeholder: 0, morale: -5 },
        explanation: '非効率な会議を続けることは、チームの士気と実作業時間を確実に蝕みます。会議の目的を問い直すことがPMの責任です。',
        pmBokTags: ['コミュニケーション管理', '資源管理'],
      },
      {
        id: 'signal-report',
        label: '「信号報告方式」に切り替える（赤/黄/青＋依頼事項のみ）',
        summary: '状態と必要な意思決定だけを端的に共有する形式に変える。',
        effects: { quality: 3, cost: 3, schedule: 3, stakeholder: 2, morale: 6 },
        explanation: '報告の目的は「状態と必要な支援を伝えること」です。信号報告（赤=問題あり/黄=要注意/青=正常）と依頼事項だけで済む仕組みは、全員の時間を節約します。',
        pmBokTags: ['コミュニケーション管理', '統合管理'],
      },
      {
        id: 'async-report',
        label: '会議を非同期レポートに置き換え、必要時のみ招集する',
        summary: 'テキストで進捗を共有し、会議は課題解決時のみに絞る。',
        effects: { quality: 2, cost: 2, schedule: 2, stakeholder: 1, morale: 5 },
        explanation: '非同期報告はチームの集中時間を守ります。ただし情報の非共有・認識ずれが起きやすいため、定期的な情報同期の工夫が必要です。',
        pmBokTags: ['コミュニケーション管理', 'リスク管理'],
      },
    ],
  },
  {
    id: 'key-person-monopoly',
    title: '「あの人にしか分からない」——鍵機能が一人の頭の中にだけある',
    description:
      'ある機能の仕様・実装・設計意図が全てSE鈴木さんの頭の中にだけある。鈴木さんが1日休んだだけで他の誰も対応できない状況が発覚。このまま続けると、もし急な離脱があった際にプロジェクトが止まるリスクがあります。',
    severity: 'high',
    phaseIds: ['detailedDesign', 'testing'],
    choices: [
      {
        id: 'accept-monopoly',
        label: '属人化は仕方ないとして現状を維持する',
        summary: '対策を取らずに続ける。',
        effects: { quality: 0, cost: 0, schedule: 2, stakeholder: 0, morale: -2 },
        explanation: '属人化を放置するのは時限爆弾を抱えているようなものです。その人が離脱した瞬間にプロジェクトは止まります。PMは早期にリスクを解消すべきです。',
        pmBokTags: ['リスク管理', '資源管理'],
      },
      {
        id: 'pair-programming',
        label: 'ペアプロ・勉強会でナレッジを即時共有する',
        summary: '複数人が同じ知識を持てる状態を作る。',
        effects: { quality: 5, cost: -3, schedule: -3, stakeholder: 1, morale: 4 },
        explanation: 'ペアプログラミングはスキル移転と属人化解消の両方に効果的です。短期的な工数増加より、長期的なチームの耐障害性を優先する判断です。',
        pmBokTags: ['資源管理', '品質管理', 'コミュニケーション管理'],
      },
      {
        id: 'document-knowledge',
        label: 'ドキュメント化を義務付けて、知識を文書に残す',
        summary: 'コードと設計意図をドキュメントとして残す。',
        effects: { quality: 4, cost: -2, schedule: -2, stakeholder: 2, morale: 1 },
        explanation: 'ドキュメント化は誰が担当しても同じ品質を維持できる仕組みを作ります。「知識を人に依存させない」ことがPMの重要なリスク管理です。',
        pmBokTags: ['品質管理', '統合管理', 'リスク管理'],
      },
    ],
  },
  {
    id: 'ses-contract-gray',
    title: 'SESメンバーに直接細かく指示していたら「偽装請負では？」と法務から指摘が来た',
    description:
      '客先常駐のSESメンバーに、タスクの細かい指示・進め方・優先順位を直接指示していたところ、法務部門から「それは偽装請負に該当する可能性がある」と指摘が来た。契約形態の違いについて、PM自身が理解できていなかったことが露呈しています。',
    severity: 'high',
    phaseIds: ['basicDesign', 'detailedDesign'],
    choices: [
      {
        id: 'ignore-legal',
        label: '法務の指摘を無視して現状の指示方法を続ける',
        summary: '業務効率を優先して法的リスクを受け入れる。',
        effects: { quality: 0, cost: -8, schedule: 2, stakeholder: -6, morale: 0 },
        explanation: '偽装請負は法的リスクだけでなく、会社全体の信頼を損なう問題です。PMが契約形態を無視して指示を続けることは、大きな組織リスクになります。',
        pmBokTags: ['調達管理', 'リスク管理'],
      },
      {
        id: 'fix-contract-flow',
        label: '契約形態を確認し、指揮命令の流れを正しく整備する',
        summary: '協力会社の窓口経由での指示に切り替え、適法な体制にする。',
        effects: { quality: 3, cost: -3, schedule: -3, stakeholder: 3, morale: 1 },
        explanation: 'PMは契約形態（請負/準委任/派遣）による指揮命令の違いを理解し、適法な体制を整える責任があります。法的リスクの回避はプロジェクト継続の前提です。',
        pmBokTags: ['調達管理', '統合管理', 'リスク管理'],
      },
      {
        id: 'change-to-dispatch',
        label: '契約を派遣契約に切り替えて、直接指示が可能な体制にする',
        summary: '法的に直接指示できる契約形態に変更する。',
        effects: { quality: 4, cost: -5, schedule: -3, stakeholder: 2, morale: 2 },
        explanation: '派遣契約への切り替えは直接指揮命令が可能になりますが、コスト増加と契約変更の手続きが必要です。業務実態に合った契約選択がPMの調達管理の核心です。',
        pmBokTags: ['調達管理', 'コスト管理', '資源管理'],
      },
    ],
  },
  {
    id: 'project-chained',
    title: 'プロジェクトが終わった瞬間、次のキックオフメールが届いた',
    description:
      '長い戦いをなんとか乗り越え、リリース完了の達成感に浸っていたその夜、「来週から次のプロジェクトのキックオフです」というメールが届いた。休む間がない。PM自身が燃え尽き状態なのに、また同じことが始まろうとしています。',
    severity: 'high',
    phaseIds: ['release'],
    choices: [
      {
        id: 'jump-to-next',
        label: 'すぐに次のプロジェクトへ。PM魂で乗り越える',
        summary: '休まずに次の案件にそのまま突入する。',
        effects: { quality: -5, cost: 0, schedule: 0, stakeholder: 1, morale: -10 },
        explanation: 'PM自身が燃え尽きた状態で次に突入すると、判断力の低下・ミスの増加が起きます。PMの持続可能性も「管理対象」です。自己管理が出来ないPMは他も管理できません。',
        pmBokTags: ['資源管理', 'リスク管理'],
      },
      {
        id: 'take-vacation',
        label: '有給を取り、一週間しっかり休んでから臨む',
        summary: '次の戦いに備え、PM自身のリカバリーを優先する。',
        effects: { quality: 4, cost: 0, schedule: -2, stakeholder: 0, morale: 8 },
        explanation: 'PM自身のメンタルとコンディション回復は、次のプロジェクトの品質に直結します。休暇を取ることは怠慢ではなく、戦略的な自己管理です。',
        pmBokTags: ['資源管理', '統合管理'],
      },
      {
        id: 'negotiate-start',
        label: '上長に状況を伝え、次のキックオフを2週間後ろ倒しにする',
        summary: 'チーム全体の疲弊を伝え、リカバリー期間を交渉する。',
        effects: { quality: 3, cost: 0, schedule: -3, stakeholder: 1, morale: 6 },
        explanation: 'PMが自身とチームの限界を組織に正直に伝え、現実的な体制を交渉することは重要なステークホルダー管理です。黙って無理をするより誠実な対話が必要です。',
        pmBokTags: ['ステークホルダー管理', 'コミュニケーション管理', '資源管理'],
      },
    ],
  },
  {
    id: 'overutilization-crisis',
    title: '全員の稼働率が100%超——誰もバッファを持っていない',
    description:
      'チームメンバー全員の稼働率が100〜130%になっていることが発覚。タスクが詰め込まれすぎており、誰も予備の余裕を持っていない。この状態では小さなトラブル一つでスケジュール全体が崩壊するリスクがあります。',
    severity: 'critical',
    phaseIds: ['detailedDesign', 'testing'],
    choices: [
      {
        id: 'continue-overload',
        label: '全員が頑張れば乗り切れる、このまま進める',
        summary: '過稼働を許容してスケジュールを維持する。',
        effects: { quality: -8, cost: 0, schedule: 2, stakeholder: 1, morale: -12 },
        explanation: '100%超の稼働を続けるとバグ発生率・離職率が急上昇します。健全な稼働率は70〜80%。余白こそが品質と士気の安全装置です。',
        pmBokTags: ['資源管理', 'リスク管理', '品質管理'],
      },
      {
        id: 'reprioritize-tasks',
        label: 'タスクの優先度を下げ、稼働率を80%ラインに正常化する',
        summary: '低優先度タスクを後回しにして、余裕を回復させる。',
        effects: { quality: 5, cost: -2, schedule: -4, stakeholder: -2, morale: 7 },
        explanation: '優先度の整理によって稼働を健全化することはPMのスケジュール管理の基本です。全部やろうとするより、大事なことをしっかりやることを選びます。',
        pmBokTags: ['スケジュール管理', '資源管理', 'スコープ管理'],
      },
      {
        id: 'emergency-recruit',
        label: '緊急で協力会社を追加し、負荷を分散する',
        summary: '人員を増強して全体の稼働率を下げる。',
        effects: { quality: 2, cost: -8, schedule: 1, stakeholder: 2, morale: 4 },
        explanation: '緊急増員はコストはかかりますが、チームの崩壊を防ぐ現実的な手段です。ただし新メンバーの立ち上がりコストも計画に含める必要があります。',
        pmBokTags: ['資源管理', '調達管理', 'コスト管理'],
      },
    ],
  },
  {
    id: 'hoard-work',
    title: '「自分がやった方が早い」——気づけばPMがメンバーの仕事を全部引き受けていた',
    description:
      'チームのミスが怖くて、いつの間にかPM自身が設計書レビュー・議事録作成・顧客メール・進捗確認を全部抱え込んでいる。PMが作業者になってしまい、マネジメントに使える時間がゼロになっています。',
    severity: 'medium',
    phaseIds: ['all'],
    choices: [
      {
        id: 'keep-hoarding',
        label: 'このまま自分でやり続ける。品質を守るためだから仕方ない',
        summary: 'PM自身が全てこなしてプロジェクトを支える。',
        effects: { quality: 3, cost: 0, schedule: -3, stakeholder: 1, morale: -6 },
        explanation: 'PM自身が作業者になると、マネジメント機能が失われます。問題が起きた時に対応する余力がなく、プロジェクト全体の舵取りができなくなります。',
        pmBokTags: ['資源管理', '統合管理'],
      },
      {
        id: 'gradual-delegation',
        label: '少しずつ権限委譲し、PLに判断を任せる練習を始める',
        summary: 'メンバーが育つように、段階的に仕事を渡す。',
        effects: { quality: 1, cost: -2, schedule: -2, stakeholder: 1, morale: 6 },
        explanation: '委譲はすぐには完璧にいきません。でも「任せる文化」を作ることが、PMの最も大切なマネジメント行動のひとつです。失敗から学ばせる余裕を持つことが重要です。',
        pmBokTags: ['資源管理', 'コミュニケーション管理', '統合管理'],
      },
      {
        id: 'delegate-fully',
        label: 'マネジメントに専念し、実作業は全てメンバーに委譲する',
        summary: 'PMの役割を「やる人」ではなく「やってもらう人」に変える。',
        effects: { quality: -2, cost: 0, schedule: 0, stakeholder: 0, morale: 8 },
        explanation: 'マネージャーの本質は「自分がやる」ではなく「メンバーが動ける環境を整える」ことです。全委譲は短期的に品質が揺れますが、チームの自律性と成長につながります。',
        pmBokTags: ['資源管理', '統合管理', 'コミュニケーション管理'],
      },
    ],
  },
  {
    id: 'relay-lies',
    title: '元請けが顧客に「順調です」と報告しつつ、しわ寄せだけを下請けに押しつけている',
    description:
      '元請けから「顧客には順調と伝えているから、あとは巻きで頼む」と言われた。顧客への報告と実態が乖離しており、無理なスケジュールのしわ寄せだけが自分たちに来ている。このまま従うべきか、正直に状況を伝えるべきか判断を迫られています。',
    severity: 'high',
    phaseIds: ['basicDesign', 'detailedDesign'],
    choices: [
      {
        id: 'accept-pressure',
        label: '元請けの言う通りに「巻きで」頑張る',
        summary: '無理を承知でスケジュールに従う。',
        effects: { quality: -6, cost: -2, schedule: 2, stakeholder: -2, morale: -8 },
        explanation: '上位からのプレッシャーに従い、無理を重ねると下請けチームが破綻します。情報の歪みは多重下請け構造で増幅し、最終的に最も立場の弱い層に最大の負担が集中します。',
        pmBokTags: ['コミュニケーション管理', 'リスク管理', '調達管理'],
      },
      {
        id: 'honest-escalation',
        label: '実態を元請けに正直に伝え、顧客への正確な情報共有を求める',
        summary: '情報の歪みを是正し、現実に基づいた合意形成を求める。',
        effects: { quality: 5, cost: -2, schedule: -3, stakeholder: 3, morale: 4 },
        explanation: '情報の透明性を保つことは、長期的なプロジェクトの健全性を守ります。現実を隠すことは後で必ず大きな問題として表面化します。PMは誠実な情報共有を主張すべきです。',
        pmBokTags: ['コミュニケーション管理', 'ステークホルダー管理', '統合管理'],
      },
      {
        id: 'negotiate-buffer',
        label: '元請けに追加工数・バッファの確保を交渉する',
        summary: 'タダでしわ寄せを受けるのでなく、条件交渉をする。',
        effects: { quality: 3, cost: -3, schedule: -2, stakeholder: 2, morale: 3 },
        explanation: '下請けが発言できない空気を黙って受け入れると状況は改善しません。PMは現実的な条件を交渉し、持続可能な体制を確保する責任があります。',
        pmBokTags: ['調達管理', 'コミュニケーション管理', 'コスト管理'],
      },
    ],
  },
];
