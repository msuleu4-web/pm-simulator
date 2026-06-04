import type { RandomEvent } from './types';

export const memberRandomEvents: RandomEvent[] = [

  // ── カテゴリ1: インフラ・リソース枯渇 ───────────────────────────────

  {
    id: 'mem-disk-full',
    title: '深夜、ディスクが100%に到達した——ログが書けない',
    description:
      '深夜2時、「ディスク使用率100%、書き込み失敗」のアラートが連発している。ログが書けないのでエラーの詳細が分からない。サービスは断続的にエラーを返している。',
    severity: 'critical',
    phaseIds: ['all'],
    choices: [
      {
        id: 'delete-old-logs',
        label: '古いログを手動で削除して今すぐ空きを作る',
        summary: '即時復旧を最優先にする。',
        effects: { quality: -2, cost: -4, schedule: 5, stakeholder: 2, morale: -2 },
        explanation:
          '即時復旧できる。ただし原因（ローテーション未設定・容量設計の誤り）は放置したままで、来月また同じことが起きる。今夜は乗り切れても根本は残る。',
        pmBokTags: ['インシデント管理'],
      },
      {
        id: 'delete-and-setup-rotation',
        label: '削除で復旧しつつ、ログローテーションと容量アラートを設定する',
        summary: '今夜の復旧と再発防止を同時に行う。',
        effects: { quality: 6, cost: -6, schedule: 3, stakeholder: 4, morale: 3 },
        explanation:
          'ログローテーション設定とディスク80%アラートを追加することで、次回は「障害」ではなく「予兆通知」になる。少し時間がかかるが、今夜がその設定の最良タイミングでもある。',
        pmBokTags: ['問題管理', '監視', '再発防止'],
      },
      {
        id: 'wait-morning',
        label: '朝担当者が来てから対応してもらう。夜中に触るのが怖い',
        summary: '朝まで待つ。',
        effects: { quality: -7, cost: 2, schedule: -6, stakeholder: -5, morale: -3 },
        explanation:
          'サービスが数時間エラーを返し続ける。SLA違反と大量のユーザー問い合わせが待っている。オンコール担当として「夜中に触るのが怖い」は通用しない。最低限の暫定対処は必要。',
        pmBokTags: ['インシデント管理'],
      },
    ],
  },

  {
    id: 'mem-memory-leak',
    title: '毎朝プロセスが落ちている。今日で5日連続',
    description:
      '5日間連続で朝6時にプロセスが落ちている。再起動すれば動くが、翌朝また同じ。メモリ使用量のグラフを見ると、毎日じわじわ上がって限界で落ちるパターンが見えている。',
    severity: 'high',
    phaseIds: ['all'],
    choices: [
      {
        id: 'daily-restart',
        label: '今日も再起動して復旧させる。明日も来る',
        summary: '毎日の儀式を続ける。',
        effects: { quality: -5, cost: -3, schedule: 2, stakeholder: -3, morale: -6 },
        explanation:
          '毎朝の再起動は「問題管理の放棄」。5日間放置した時点で、リークは確実に存在する。毎朝対応するコストと精神的疲弊が積み上がり続ける。終わりが見えない。',
        pmBokTags: ['問題管理'],
      },
      {
        id: 'investigate-leak',
        label: 'メモリ使用量のログを追って、どのプロセスが漏れているか特定する',
        summary: '原因を探って塞ぐ。',
        effects: { quality: 8, cost: -6, schedule: 1, stakeholder: 5, morale: 6 },
        explanation:
          'グラフがあるなら、どのプロセス・どのタイミングで増えているかは特定できる。原因箇所（設定・コード・外部ライブラリ）を潰せば毎朝の再起動から解放される。今日2時間かけた調査が、以降の毎朝の対応を不要にする。',
        pmBokTags: ['問題管理', '再発防止'],
      },
      {
        id: 'report-pm',
        label: 'PMに「5日連続で落ちています。調査の時間をください」と報告する',
        summary: '状況を可視化してPMを動かす。',
        effects: { quality: 5, cost: -4, schedule: 0, stakeholder: 4, morale: 4 },
        explanation:
          '5日間継続しているのに報告していなかったなら、今日が報告のタイミング。グラフを見せれば状況は一目瞭然。調査の時間をもらえれば根本解決ができる。「また再起動しました」だけ報告し続けることとは全く違う。',
        pmBokTags: ['コミュニケーション管理', '問題管理'],
      },
    ],
  },

  {
    id: 'mem-batch-overrun',
    title: 'バッチが終わらない——始業時刻になっても走っている',
    description:
      '夜間バッチが今朝も終わっていない。9時になってもまだ処理中。後続の業務システムは待機状態のまま。ユーザーから「データが反映されていない」問い合わせが届き始めた。',
    severity: 'critical',
    phaseIds: ['all'],
    choices: [
      {
        id: 'abort-rerun',
        label: '現在の処理を手動で打ち切って、データを整合させてから再実行する',
        summary: '強制終了してリカバリーする。',
        effects: { quality: -3, cost: -5, schedule: 4, stakeholder: 2, morale: -2 },
        explanation:
          '打ち切ることでサービスは再開できるが、途中まで処理されたデータの整合性確認が必要。急いでリカバリーすると不整合を見落とすリスクがある。この作業を一人でやるのか、チームで確認するのかが重要。',
        pmBokTags: ['インシデント管理'],
      },
      {
        id: 'notify-wait',
        label: 'ユーザーに状況を説明して待ってもらい、処理完了後にデータを確認する',
        summary: '正直に告知してそのまま待つ。',
        effects: { quality: 3, cost: -3, schedule: -2, stakeholder: 3, morale: 1 },
        explanation:
          '処理が終わるまで待てる見通しがあれば、正直な告知が最善。ユーザーは「何が起きているか分からない」状態が一番不安。「11時までに完了予定です」と伝えるだけで満足度が保てる。',
        pmBokTags: ['コミュニケーション管理', 'インシデント管理'],
      },
      {
        id: 'fix-batch-design',
        label: '今回は対処しつつ、処理分割・実行時間の見直しをPMに提案する',
        summary: '対処と改善提案を同時にする。',
        effects: { quality: 6, cost: -5, schedule: 2, stakeholder: 4, morale: 4 },
        explanation:
          '今回発生した原因（データ量増加・処理の最適化不足）をPMに伝えて、設計見直しを提案する。「毎月末はこのリスクがある」という事実を数字で示すことで、改善の優先度が上がる。',
        pmBokTags: ['問題管理', 'コミュニケーション管理'],
      },
    ],
  },

  // ── カテゴリ2: 外部要因系 ────────────────────────────────────────

  {
    id: 'mem-cloud-outage',
    title: 'クラウドが落ちた——自分たちは何もしていない',
    description:
      '使っているクラウドサービスのリージョンで大規模障害が発生。自社のコードは正常なのにサービスが落ちている。ダッシュボードを見るとクラウド側のステータスが赤。自分にできることは何か。',
    severity: 'high',
    phaseIds: ['all'],
    choices: [
      {
        id: 'honest-announce',
        label: 'ユーザーに「クラウド障害のため、当社サービスも影響を受けています」と正直に告知する',
        summary: '透明な告知で信頼を守る。',
        effects: { quality: 2, cost: -2, schedule: -4, stakeholder: 5, morale: 1 },
        explanation:
          '自分では直せない障害の時、正直な告知が唯一のコントロール可能な行動。「なぜ使えないのか分からない」状態より「クラウド障害のため復旧待ちです」と伝えた方がユーザーは冷静に待てる。復旧後のフォロー連絡も忘れずに。',
        pmBokTags: ['コミュニケーション管理'],
      },
      {
        id: 'blame-cloud',
        label: 'クラウドのせいだから自分たちに責任はない、復旧を待つだけ',
        summary: '何もせずに待つ。',
        effects: { quality: -4, cost: 2, schedule: -5, stakeholder: -5, morale: -2 },
        explanation:
          '「クラウドのせい」は技術的には正しくても、ユーザーには関係ない。告知もなく、問い合わせへの返答もなければ、「この会社は何もしない」という評価になる。外部要因でも対応できることはある。',
        pmBokTags: ['コミュニケーション管理'],
      },
      {
        id: 'check-failover',
        label: '事前に別リージョンへのフェイルオーバー手順を確認する',
        summary: '切り替え手順が使えるか確認する。',
        effects: { quality: 4, cost: -4, schedule: 2, stakeholder: 4, morale: 3 },
        explanation:
          'フェイルオーバー手順書があれば確認するタイミング。実際に切り替えできるかは事前の冗長構成次第だが、「手順を確認した」という行動が次の判断を速くする。手順がなければ、今回を機に作成することをPMに提案する。',
        pmBokTags: ['インシデント管理', 'リスク管理'],
      },
    ],
  },

  {
    id: 'mem-ssl-expired',
    title: 'サイトに「安全ではありません」——SSL証明書が切れていた',
    description:
      '朝イチでユーザーから「サイトに警告が出て開けない」と問い合わせが殺到。確認するとSSL証明書が昨夜失効していた。「自動更新されるはずだった」が、何かの条件を満たせず更新されなかったらしい。',
    severity: 'critical',
    phaseIds: ['all'],
    choices: [
      {
        id: 'reissue-asap',
        label: '今すぐ証明書を再発行・差し替えする。手順を確認しながら慎重に',
        summary: '急ぎつつも手順を守る。',
        effects: { quality: 4, cost: -5, schedule: 4, stakeholder: 3, morale: 0 },
        explanation:
          '焦りは誤操作の元。証明書の差し替えは手順通りに行えば難しくないが、間違えると別の問題が起きる。差し替え後は全ブラウザで動作確認することを忘れずに。',
        pmBokTags: ['インシデント管理'],
      },
      {
        id: 'explain-and-fix',
        label: 'ユーザーへの告知を先にしてから、証明書対応を進める',
        summary: '告知と対応を並行する。',
        effects: { quality: 6, cost: -5, schedule: 2, stakeholder: 6, morale: 2 },
        explanation:
          '証明書再発行に数十分かかる場合、その間に問い合わせが増え続ける。「現在対応中です。〇時頃に復旧予定です」という一言が、問い合わせを減らして対応に集中できる環境を作る。',
        pmBokTags: ['コミュニケーション管理', 'インシデント管理'],
      },
      {
        id: 'setup-expiry-monitoring',
        label: '対応後、証明書の有効期限を監視する仕組みを今日中に作る',
        summary: '再発防止策を即日実施する。',
        effects: { quality: 7, cost: -6, schedule: 0, stakeholder: 4, morale: 5 },
        explanation:
          '「自動更新だから大丈夫」という油断が今回の原因。証明書の有効期限を30日前・7日前にアラートする監視を追加することで、次回は「失効前の軽微タスク」に格下げできる。今日の対応が次の事故を防ぐ。',
        pmBokTags: ['再発防止', '監視', '問題管理'],
      },
    ],
  },

  {
    id: 'mem-external-api-down',
    title: '決済できない——原因は外部サービス側だった',
    description:
      '「決済が通らない」という問い合わせが急増。調査すると自社の決済処理コードは正常で、連携している決済代行会社のAPIが応答していないことが判明。こちらには直せない。',
    severity: 'high',
    phaseIds: ['all'],
    choices: [
      {
        id: 'suspend-and-notify',
        label: '決済機能を一時停止して「ただいまメンテナンス中」と表示し、復旧を待つ',
        summary: 'エラーを隠さず機能を止める。',
        effects: { quality: 4, cost: -3, schedule: -2, stakeholder: 4, morale: 1 },
        explanation:
          'エラーが出続けるより、「メンテナンス中」と表示して待ってもらう方がユーザーの不安を減らせる。決済代行会社のステータスページを確認し、復旧見込みを伝えられると更に良い。',
        pmBokTags: ['コミュニケーション管理', 'インシデント管理'],
      },
      {
        id: 'keep-showing-error',
        label: '外部サービスが復旧するまで、エラーが出るままにしておく',
        summary: '何もせず待つ。',
        effects: { quality: -4, cost: 1, schedule: -4, stakeholder: -6, morale: -3 },
        explanation:
          'ユーザーは「何が起きているか分からないエラー」が続く状態を最も不信に感じる。外部要因でも、ユーザーへの説明という形で対応できることがある。',
        pmBokTags: ['コミュニケーション管理'],
      },
      {
        id: 'contact-vendor',
        label: '決済代行会社のサポートに連絡して障害状況と復旧見込みを確認する',
        summary: '情報を集めてユーザーに伝える。',
        effects: { quality: 5, cost: -3, schedule: 1, stakeholder: 5, morale: 2 },
        explanation:
          '外部サービスのサポートに連絡することで復旧見込みが分かり、ユーザーへの告知内容が具体化できる。「〇時頃に復旧予定」と伝えられるかどうかで、ユーザーの対応（待つ/別手段を探す）が変わる。',
        pmBokTags: ['コミュニケーション管理', 'インシデント管理'],
      },
    ],
  },

  // ── カテゴリ3: ヒューマンエラー系 ──────────────────────────────────

  {
    id: 'mem-prod-deleted',
    title: 'ステージングのつもりで本番を操作していた',
    description:
      '作業中、手が止まった。コマンドの実行先が本番サーバーだった。データが削除された。ターミナルが静まり返っている。バックアップは昨夜取得済み。',
    severity: 'critical',
    phaseIds: ['all'],
    choices: [
      {
        id: 'stop-and-report',
        label: 'まず手を止めて、PMにすぐ報告してからバックアップで復旧する',
        summary: '手を止めて報告→正規手順で復旧。',
        effects: { quality: 6, cost: -5, schedule: -2, stakeholder: 5, morale: 2 },
        explanation:
          'パニックで続けると二次被害が起きる。まず手を止める。バックアップがあれば復旧できる。「やらかしました」と正直に報告することは、隠すより圧倒的に信頼を守る選択になる。PMは問題を把握した上で、正しく動ける。',
        pmBokTags: ['インシデント管理', 'コミュニケーション管理'],
      },
      {
        id: 'self-recover-silently',
        label: 'バックアップで自分で復旧させて、誰にも言わない',
        summary: '自己解決して隠す。',
        effects: { quality: 0, cost: -4, schedule: 2, stakeholder: -6, morale: -7 },
        explanation:
          '復旧できても、報告しないことで障害記録が残らず同じミスを繰り返す仕組みが作られない。後から発覚した時の信頼の損失は、最初に正直に報告するより格段に大きい。',
        pmBokTags: ['コミュニケーション管理'],
      },
      {
        id: 'panic-fix',
        label: '焦ってなんとかしようとコマンドを続ける',
        summary: 'パニックで操作を続ける。',
        effects: { quality: -8, cost: -5, schedule: -3, stakeholder: -5, morale: -8 },
        explanation:
          'パニック状態での操作は二次被害を生む。消えたデータをさらに上書きしてしまう・バックアップも壊してしまう——最悪のシナリオはこのパターンから始まる。最初にすべきことは「手を止めること」。',
        pmBokTags: ['インシデント管理'],
      },
    ],
  },

  {
    id: 'mem-release-regression',
    title: 'リリースしたら別の機能が壊れた',
    description:
      '今日のリリース直後、「帳票が出力できない」という問い合わせが3件来た。昨日まで正常だった機能。今日のリリース内容には帳票は含まれていなかったが、依存関係があったらしい。',
    severity: 'critical',
    phaseIds: ['all'],
    choices: [
      {
        id: 'rollback-first',
        label: 'まずロールバックして昨日の状態に戻し、原因を特定してから再リリースする',
        summary: '切り戻しを最優先にする。',
        effects: { quality: 7, cost: -5, schedule: -2, stakeholder: 4, morale: 2 },
        explanation:
          'ロールバック手順があれば使う。「直そうとして追加変更を本番に当てる」より、一度元に戻す方が安全。デグレの原因（依存関係の見落とし）を特定してからリリースし直す。切り戻せる準備が最大の保険。',
        pmBokTags: ['変更管理', 'インシデント管理'],
      },
      {
        id: 'patch-on-top',
        label: '帳票の修正パッチを急いで追加で本番に当てる',
        summary: 'パッチを重ねて直す。',
        effects: { quality: -6, cost: -5, schedule: 2, stakeholder: -3, morale: -4 },
        explanation:
          '「リリース直後のパッチ追加」は連鎖デグレのリスクが最も高い状況。急いで当てた修正がさらに別の機能を壊す可能性がある。「パッチにパッチを重ねる」が最悪の事態を招く。',
        pmBokTags: ['変更管理'],
      },
      {
        id: 'notify-pm-users',
        label: 'PMに状況を報告して、ユーザーへの告知とロールバック判断を仰ぐ',
        summary: 'PMを巻き込んで判断する。',
        effects: { quality: 5, cost: -4, schedule: -1, stakeholder: 5, morale: 3 },
        explanation:
          '自分のリリースが別機能を壊した時、一人で抱え込まずPMに正直に報告するのが正しい。ロールバックか追加修正かの判断はPMがすべき。ユーザーへの告知もPMが動くことで正式な形になる。',
        pmBokTags: ['コミュニケーション管理', '変更管理'],
      },
    ],
  },

  {
    id: 'mem-wrong-recovery',
    title: '直そうとしたら、もっとひどくなった',
    description:
      '障害対応中、早く復旧させようと手順を確認せずに操作を続けた。サービスは一部復旧したが、今度は別のコンポーネントが落ちた。最初の障害より影響範囲が広がっている。',
    severity: 'critical',
    phaseIds: ['all'],
    choices: [
      {
        id: 'stop-and-check',
        label: '一旦全ての操作を止めて、ナレッジベースと手順書を確認してから再開する',
        summary: 'まず手を止めて手順を確認する。',
        effects: { quality: 6, cost: -4, schedule: -2, stakeholder: 4, morale: 2 },
        explanation:
          '緊急時こそ手順書とナレッジ。経験則の場当たり対応は時に最悪手になる。「焦って動く」より「30秒手を止めて手順を確認してから動く」方が最終的に復旧が速い。',
        pmBokTags: ['インシデント管理', 'ナレッジ管理'],
      },
      {
        id: 'escalate-now',
        label: '二次担当に電話する。自分の判断ではこれ以上動かない',
        summary: '自分の限界を認めてエスカレーションする。',
        effects: { quality: 4, cost: -4, schedule: 0, stakeholder: 3, morale: -2 },
        explanation:
          '状況が悪化していることを認識してエスカレーションする判断は正しい。「自分でなんとかしよう」という意地が事態をさらに悪化させる。「現状を正確に伝えて引き継ぐ」が次善の一手。',
        pmBokTags: ['インシデント管理', 'コミュニケーション管理'],
      },
      {
        id: 'keep-going',
        label: 'このまま続ける。なんとかなるはず',
        summary: '操作を続ける。',
        effects: { quality: -8, cost: -4, schedule: -4, stakeholder: -5, morale: -6 },
        explanation:
          '「なんとかなる」は最も危険な判断。状況が悪化しているにもかかわらず同じアプローチを続けることは、被害を指数関数的に広げる可能性がある。誰かを呼ぶか、止まるか、どちらかしかない。',
        pmBokTags: ['インシデント管理'],
      },
    ],
  },

  {
    id: 'mem-near-miss',
    title: '危うく本番を消しそうになった——ギリギリで気づいた',
    description:
      '削除コマンドを打とうとした瞬間、対象が本番であることに気づいた。Ctrl+Cで止めた。冷や汗が出た。今回は何も起きなかった。この体験をどう扱うか。',
    severity: 'medium',
    phaseIds: ['all'],
    choices: [
      {
        id: 'share-and-improve',
        label: 'チームに「ヒヤリハットがあった」と共有して、本番誤操作の防止策を考える',
        summary: 'ヒヤリハットをチームの資産にする。',
        effects: { quality: 5, cost: -3, schedule: -1, stakeholder: 5, morale: 5 },
        explanation:
          'ハインリッヒの法則：1件の重大事故の裏に多数のヒヤリハットがある。今回気づけたのは幸運。「今回は大丈夫だった」で終わらせず、「なぜ間違えそうになったか」を共有することが、チーム全体の事故を防ぐ。',
        pmBokTags: ['ナレッジ管理', '再発防止'],
      },
      {
        id: 'keep-secret',
        label: '何も起きなかったし、誰にも言わない',
        summary: '自分の胸にしまっておく。',
        effects: { quality: -3, cost: 1, schedule: 0, stakeholder: -2, morale: -3 },
        explanation:
          '「何も起きなかった」からこそ、話せるタイミング。次に同じ状況が来たとき、気づけるかは分からない。ヒヤリハットを共有する文化があるチームは、重大事故が少ない。',
        pmBokTags: ['ナレッジ管理'],
      },
      {
        id: 'setup-guard',
        label: '本番環境を別の色・プロンプトに変えて、視覚的に区別できるようにする',
        summary: '自分で防止策を実装する。',
        effects: { quality: 6, cost: -3, schedule: 0, stakeholder: 3, morale: 4 },
        explanation:
          'ターミナルのプロンプトを本番は赤色、ステージングは緑色にするだけで誤操作のリスクが大幅に下がる。自分でできる改善を即日実施することが、次のヒヤリハットを防ぐ最善手。',
        pmBokTags: ['再発防止', '継続的改善'],
      },
    ],
  },

  // ── カテゴリ4: 負荷・アクセス集中 ──────────────────────────────────

  {
    id: 'mem-traffic-spike',
    title: 'テレビで紹介された——アクセスが10倍になってサイトが落ちた',
    description:
      '夕方のニュース番組で自社サービスが紹介され、アクセスが急増。レスポンスが遅くなり、タイムアウトエラーが出始め、ついにサービスが応答しなくなった。嬉しいニュースが障害の原因になった。',
    severity: 'critical',
    phaseIds: ['all'],
    choices: [
      {
        id: 'scale-up-manual',
        label: '今すぐサーバーを手動で増強する',
        summary: '緊急でスケールアップする。',
        effects: { quality: 3, cost: -6, schedule: 4, stakeholder: 3, morale: -1 },
        explanation:
          '手動でのスケールアップは時間と費用がかかるが、今できる選択肢。設定を誤らないよう手順書を確認しながら行う。増強後は効果を確認し、不要になったリソースを戻すことも忘れずに。',
        pmBokTags: ['インシデント管理', '資源管理'],
      },
      {
        id: 'notify-and-wait',
        label: 'ユーザーへ「現在アクセスが集中しています」と告知して、落ち着くのを待つ',
        summary: '告知して時間が解決するのを待つ。',
        effects: { quality: -2, cost: 2, schedule: -4, stakeholder: 0, morale: -1 },
        explanation:
          'テレビ効果によるスパイクは数時間で収まることが多い。ただし「落ち着くまで使えない」状態が続くと、せっかくの露出が悪評に変わる。告知しながら並行して増強を検討するのが現実的。',
        pmBokTags: ['コミュニケーション管理'],
      },
      {
        id: 'report-load-test',
        label: 'PMに状況を報告しつつ、「次回のために負荷試験と自動スケール設定が必要」と提案する',
        summary: '今回の教訓をすぐに提案につなげる。',
        effects: { quality: 4, cost: -4, schedule: 2, stakeholder: 4, morale: 4 },
        explanation:
          '「成功（人気）が障害の原因になった」という現実は、次回への投資の根拠になる。負荷試験・オートスケール設定への投資をPMに提案する最高のタイミング。問題対応と改善提案を同時にできる。',
        pmBokTags: ['コミュニケーション管理', '継続的改善', 'リスク管理'],
      },
    ],
  },

  {
    id: 'mem-month-end-load',
    title: '月末恒例の高負荷——今月は特に重い',
    description:
      '毎月末は締め処理・請求バッチが重なるが、今月は取引量が増えたため例年より処理が遅い。バッチ処理が遅延し始め、業務部門から「データが締まらない」と問い合わせが来た。',
    severity: 'high',
    phaseIds: ['all'],
    choices: [
      {
        id: 'just-wait',
        label: '今月も乗り切る。来月また考えればいい',
        summary: '今月もその場しのぎ。',
        effects: { quality: -3, cost: -3, schedule: -3, stakeholder: -3, morale: -4 },
        explanation:
          '毎月同じことを繰り返している。「来月また考えれば」を繰り返すたびにデータ量は増え、毎月末の負荷は増していく。「予測できる突発」を予測しながら備えないのは、運用の失敗。',
        pmBokTags: ['問題管理'],
      },
      {
        id: 'manual-optimize',
        label: '今月の対応をしながら、バッチ処理の一番重い部分のSQLを確認する',
        summary: 'その場で改善のヒントを探す。',
        effects: { quality: 4, cost: -4, schedule: 1, stakeholder: 2, morale: 2 },
        explanation:
          '対応しながら問題箇所を特定することで、来月までに改善できる可能性が生まれる。今月のログを後で解析する材料として保存しておくことも重要。',
        pmBokTags: ['問題管理', '継続的改善'],
      },
      {
        id: 'propose-improvement',
        label: 'PMに「月末の負荷が毎月問題になっています。設計見直しの時間をください」と提案する',
        summary: '月次の問題を組織課題として上げる。',
        effects: { quality: 6, cost: -4, schedule: 0, stakeholder: 5, morale: 5 },
        explanation:
          '毎月発生する問題は「突発」ではなく「設計の問題」。グラフで毎月末のパターンを見せればPMも判断しやすい。処理分割・インデックス改善・実行スケジュールの分散など、選択肢を複数持って提案すると動きやすい。',
        pmBokTags: ['コミュニケーション管理', '継続的改善'],
      },
    ],
  },

  // ── カテゴリ5: セキュリティ系 ────────────────────────────────────

  {
    id: 'mem-ddos-attack',
    title: '特定IPからの大量アクセス——DDoSかもしれない',
    description:
      '監視ダッシュボードに特定のIPアドレスからの異常なリクエスト数が見えている。レスポンスが遅くなり始めた。DDoS攻撃の可能性があるが、正規ユーザーのアクセスも混在している。',
    severity: 'critical',
    phaseIds: ['all'],
    choices: [
      {
        id: 'block-suspicious-ip',
        label: '異常なアクセス元のIPをファイアウォールで遮断する',
        summary: '怪しいIPを止める。',
        effects: { quality: 3, cost: -5, schedule: 4, stakeholder: 3, morale: 0 },
        explanation:
          '即時の暫定対処として有効。ただしIPが正規ユーザーの場合もあるためログを確認してから判断する。遮断後も状況が改善しなければ、攻撃元が複数IPに分散している可能性があり、WAFや上位レイヤーでの対処が必要になる。',
        pmBokTags: ['インシデント管理', 'セキュリティ'],
      },
      {
        id: 'full-incident-response',
        label: '検知→遮断→影響範囲調査→PM報告→恒久対策の順で対応する',
        summary: '手順に沿って一つずつ対応する。',
        effects: { quality: 7, cost: -6, schedule: 2, stakeholder: 6, morale: 3 },
        explanation:
          'セキュリティ障害は「復旧」だけでなく「何があったか・どこまで影響したか」の調査と報告まで対応。隠さず正しく記録することが、後の再発防止と顧客説明の根拠になる。WAF導入などの恒久対策もPMに提案する。',
        pmBokTags: ['インシデント管理', 'セキュリティ', 'コミュニケーション管理'],
      },
      {
        id: 'do-nothing-monitor',
        label: 'まだ大丈夫そうなのでしばらく様子を見る',
        summary: '経過観察する。',
        effects: { quality: -5, cost: 1, schedule: -4, stakeholder: -4, morale: -2 },
        explanation:
          'DDoS攻撃は待つほど被害が拡大する。「まだ大丈夫」の間に対処することで影響を最小化できる。セキュリティインシデントにおける「様子見」は対応の選択肢ではない。',
        pmBokTags: ['インシデント管理', 'セキュリティ'],
      },
    ],
  },

  {
    id: 'mem-vulnerability-patch',
    title: '使っているミドルウェアに重大な脆弱性——今すぐパッチを当てるか',
    description:
      'CVSSスコア9.2の脆弱性が公開された。使っているミドルウェアが対象で、リモートコード実行の可能性がある。パッチ適用には再起動が必要でサービスが数十分停止する。今日は13時、業務時間内。',
    severity: 'critical',
    phaseIds: ['all'],
    choices: [
      {
        id: 'patch-now-business-hours',
        label: '今すぐ適用する。ユーザーに事前告知して業務時間内に対応する',
        summary: 'セキュリティを優先して今すぐ当てる。',
        effects: { quality: 5, cost: -4, schedule: -2, stakeholder: 3, morale: 2 },
        explanation:
          'CVSS 9.2は放置してはいけない深刻度。業務時間内の停止はユーザーへの影響があるが、「深夜まで待つ」間にリスクが続く。事前告知をしてから適用することでユーザーの信頼を守る。停止時間は最小限になるよう手順を事前確認してから始める。',
        pmBokTags: ['変更管理', 'セキュリティ'],
      },
      {
        id: 'patch-tonight',
        label: 'ユーザーへの影響を最小にするため、今夜の深夜メンテで適用する',
        summary: 'ユーザー影響を抑えて深夜に当てる。',
        effects: { quality: 4, cost: -4, schedule: 2, stakeholder: 4, morale: -2 },
        explanation:
          '深夜での適用はユーザー影響が最小。ただし今夜まで脆弱性が残るリスクがある。深夜作業によるチームへの負荷と、代休・手当の確認も必要。CVSS 9.2を「明日」にしないことが前提。',
        pmBokTags: ['変更管理', 'セキュリティ', '資源管理'],
      },
      {
        id: 'postpone-patch',
        label: 'チームが疲弊しているので来週に延期する',
        summary: '来週まで先送りにする。',
        effects: { quality: -8, cost: 2, schedule: 0, stakeholder: -5, morale: 2 },
        explanation:
          'CVSS 9.2を1週間放置することは、リモートコード実行のリスクを1週間抱えること。チームの疲弊は別の方法で解決すべき問題で、セキュリティリスクと引き換えにしてはいけない。',
        pmBokTags: ['セキュリティ', 'リスク管理'],
      },
    ],
  },

  // ── カテゴリ6: 間が悪いあるある ─────────────────────────────────

  {
    id: 'mem-friday-alert',
    title: '定時5分前にアラートが鳴った',
    description:
      '金曜日の17時55分。あと5分で週末。「Webサービス応答時間悪化」のアラートが来た。今日の午後、誰かがリリース作業をした。帰りの新幹線のチケットを持っているメンバーもいる。',
    severity: 'high',
    phaseIds: ['all'],
    choices: [
      {
        id: 'investigate-rollback',
        label: '今日のリリースと関係があるか確認して、問題なら切り戻す',
        summary: '原因を確認して安全に週末に入る。',
        effects: { quality: 6, cost: -4, schedule: -1, stakeholder: 4, morale: -2 },
        explanation:
          '「金曜夕方のリリース直後のアラート」は最悪のパターン。切り戻しができるなら、今夜対応できない状態で週末に入るよりロールバックして安全な状態で帰る方が全員のためになる。「金曜の本番リリースはするな」という格言がある理由がここにある。',
        pmBokTags: ['変更管理', 'インシデント管理'],
      },
      {
        id: 'monitor-from-home',
        label: 'とりあえず帰って、スマホで監視しながら様子を見る',
        summary: '帰りながら監視を続ける。',
        effects: { quality: -2, cost: -3, schedule: 2, stakeholder: 1, morale: -4 },
        explanation:
          '「帰りながら監視」は休日を半分潰す状態になる。電車の中でアラートが鳴ったら対応できない。「様子を見る」で週末が終わることもある。その半端な状態が最もモチベーションを削る。',
        pmBokTags: ['インシデント管理'],
      },
      {
        id: 'stay-and-fix',
        label: '残って原因を特定し、修正または切り戻しまで完結させる',
        summary: '今日中に片をつける。',
        effects: { quality: 7, cost: -5, schedule: 2, stakeholder: 5, morale: -1 },
        explanation:
          '週末を安心して休むためには、「問題を抱えたまま帰らない」が最善。1〜2時間で解決できるなら今日やり切る方が、週末ずっと不安を抱えるより精神的に楽。ただし深夜まで引っ張らないよう時間の上限を決めておく。',
        pmBokTags: ['インシデント管理', '変更管理'],
      },
    ],
  },

  {
    id: 'mem-expert-on-leave',
    title: 'その領域の担当者が今日から1週間休暇——そこで障害が出た',
    description:
      'ベテランのAさんが今日から夏休みに入った初日。「Aさんしか分からない」と言われていたレガシーバッチで障害が出た。Aさんの電話番号は分かる。チームの全員がAさんに頼りたいと思っている。',
    severity: 'high',
    phaseIds: ['all'],
    choices: [
      {
        id: 'call-expert',
        label: 'Aさんに電話して状況を伝え、リモートで助けてもらう',
        summary: '休暇中の本人に連絡する。',
        effects: { quality: 4, cost: -3, schedule: 3, stakeholder: 2, morale: -4 },
        explanation:
          '短期的には解決できるが、Aさんの休暇を潰すことになる。これを繰り返すと「休めない」状態が固定化し、Aさんのモチベーション低下と離職リスクが高まる。「Aさんがいないと回らない」という属人化の証明でもある。',
        pmBokTags: ['インシデント管理'],
      },
      {
        id: 'try-with-logs',
        label: 'ログとAさんが残したメモを頼りに、チームで対処を試みる',
        summary: 'ある資料を使って自分たちで解決する。',
        effects: { quality: 3, cost: -5, schedule: -2, stakeholder: 3, morale: 3 },
        explanation:
          '成功すれば属人化が1つ解消される貴重な機会。失敗してもその過程で「どこが分からなかったか」が明確になり、次の引き継ぎ改善につながる。Aさんへの連絡は「最終手段」として残しておく。',
        pmBokTags: ['ナレッジ管理', 'インシデント管理'],
      },
      {
        id: 'report-and-propose',
        label: 'PMに状況を報告しつつ「休暇後にAさんに知識移転してもらう場を設けてほしい」と提案する',
        summary: '今回の事態を改善のきっかけにする。',
        effects: { quality: 2, cost: -3, schedule: -1, stakeholder: 5, morale: 4 },
        explanation:
          '「Aさんしか分からない」状態で障害が起きたという事実をPMに伝えることで、知識移転・ドキュメント化の優先度が上がる。今回の事態が「属人化解消プロジェクト」のきっかけになれば、Aさんの休暇を奪わない体制に近づける。',
        pmBokTags: ['コミュニケーション管理', 'ナレッジ管理'],
      },
    ],
  },

  {
    id: 'mem-quiet-period',
    title: '1週間インシデントがゼロ——何もない日が続いている',
    description:
      '先週から重大インシデントが起きていない。珍しく平和な時間が続いている。ただ手順書は古いまま、自動化できていない作業も残っている。この時間、どう使うか。',
    severity: 'medium',
    phaseIds: ['all'],
    choices: [
      {
        id: 'invest-improvement',
        label: '手順書の更新と自動化スクリプトの作成に充てる',
        summary: '平和な時間に改善投資をする。',
        effects: { quality: 6, cost: -4, schedule: 3, stakeholder: 3, morale: 6 },
        explanation:
          '平穏は「次に備えるための時間」。インシデントが起きていない今こそ、古い手順書の更新・定型作業の自動化・ナレッジ整備に投資できる。この積み上げが次の嵐を小さくする。',
        pmBokTags: ['ナレッジ管理', '継続的改善', '自動化'],
      },
      {
        id: 'take-it-easy',
        label: '珍しく落ち着いているので、ゆったり過ごす',
        summary: '休息を優先する。',
        effects: { quality: 0, cost: 5, schedule: 0, stakeholder: 0, morale: 4 },
        explanation:
          '疲れが溜まっているなら休息も大切。ただし完全にサボると次の波が来たときに余力がない状態で迎えることになる。少し休みながら小さな改善を一つだけやる、というバランスが現実的。',
        pmBokTags: ['資源管理'],
      },
      {
        id: 'do-proactive-check',
        label: '「なぜ平和なのか」を確認して、監視の死角がないか見直す',
        summary: '静けさを疑って予防的に確認する。',
        effects: { quality: 7, cost: -4, schedule: 2, stakeholder: 4, morale: 3 },
        explanation:
          '「嵐の前の静けさ」かもしれない。平和な時間に監視設定・ログの異常・リソース使用率のトレンドを確認することで、予兆を早期に発見できる。「問題がないから大丈夫」より「問題がないことを確認した」が本当の平和。',
        pmBokTags: ['監視', 'リスク管理', '継続的改善'],
      },
    ],
  },

  // ── 既存イベント（前回作成分） ────────────────────────────────────

  {
    id: 'mem-oncall-drunk',
    title: '飲み会の最中にオンコールが鳴った',
    description:
      '同期との久々の飲み会。2杯目のビールを飲んでいた瞬間、オンコール用スマホが振動した。「応答時間の悪化」アラート。正直、頭はもう酔っている。どうする。',
    severity: 'high',
    phaseIds: ['all'],
    choices: [
      {
        id: 'go-home-respond',
        label: '飲み会を抜けて帰宅、落ち着いてから対応する',
        summary: '場を離れてから対応。',
        effects: { quality: 5, cost: -5, schedule: 2, stakeholder: 3, morale: -3 },
        explanation:
          '酔った状態での判断ミスは障害を拡大させる。飲み会を抜けることで信頼は保てる。ただし帰宅時間のロスが発生する。',
        pmBokTags: ['インシデント管理', '資源管理'],
      },
      {
        id: 'respond-on-spot',
        label: 'トイレに隠れてスマホで対応を試みる',
        summary: 'その場で即対応。',
        effects: { quality: -4, cost: -3, schedule: 4, stakeholder: -1, morale: -5 },
        explanation:
          '早い対応は評価されるが、酔った状態でのリモート作業はミスのリスクが高い。本番に接続して誤操作した場合の損害は大きい。',
        pmBokTags: ['インシデント管理'],
      },
      {
        id: 'escalate-colleague',
        label: '同じチームの同僚に電話して代わりに対応を頼む',
        summary: '仲間に代打を頼む。',
        effects: { quality: 3, cost: -2, schedule: 2, stakeholder: 1, morale: -2 },
        explanation:
          'エスカレーションは正しい判断。ただし同僚の時間を奪うことになる。後日きちんと当番を交代するなどフォローが必要。',
        pmBokTags: ['インシデント管理', 'コミュニケーション管理'],
      },
    ],
  },

  {
    id: 'mem-runbook-wrong',
    title: '手順書通りに作業したら、システムが落ちた',
    description:
      '定期メンテナンスの手順書に従って作業を進めたところ、手順の3番目でサービスが停止した。後から確認すると手順書は1年前のもので、環境が変わっていた。手順書は間違っていた。でも自分は「手順書通りにやった」だけだ。',
    severity: 'high',
    phaseIds: ['all'],
    choices: [
      {
        id: 'restore-and-report',
        label: 'まず復旧に集中して、その後に手順書の誤りをPMに報告する',
        summary: '復旧優先→正直に報告。',
        effects: { quality: 5, cost: -4, schedule: 2, stakeholder: 5, morale: 3 },
        explanation:
          '手順書の誤りは自分のせいではないが、正直に報告することでナレッジが更新される。「復旧しました。手順書に誤りがあったので修正しました」の方がPMの信頼を得やすい。',
        pmBokTags: ['インシデント管理', 'ナレッジ管理'],
      },
      {
        id: 'fix-runbook-silently',
        label: '自分で復旧して手順書を更新する。PMには報告しない',
        summary: '自己解決して静かに修正。',
        effects: { quality: 3, cost: -3, schedule: 3, stakeholder: -3, morale: 0 },
        explanation:
          '手順書の修正は正しい行動。ただし障害をPMに報告しないと、インシデント記録が残らず再発防止につながらない。',
        pmBokTags: ['ナレッジ管理', 'インシデント管理'],
      },
      {
        id: 'blame-runbook',
        label: 'PMに「手順書が間違っていたから落ちた」と報告する',
        summary: '原因を明確にして報告。',
        effects: { quality: 2, cost: -2, schedule: 1, stakeholder: -2, morale: -2 },
        explanation:
          '「手順書が悪かった」という伝え方だけでは、復旧と修正が済んでいるかどうかが伝わらない。「復旧しました。手順書を修正しました。確認をお願いします」という形で伝える方が建設的。',
        pmBokTags: ['コミュニケーション管理', 'ナレッジ管理'],
      },
    ],
  },

  {
    id: 'mem-veteran-quits',
    title: 'チームの最古参が「来月辞めます」と言い出した',
    description:
      '入社15年のベテランが突然「来月いっぱいで退職します」と宣言した。そのベテランは誰も知らないレガシーシステムの生き字引で、障害があるたびに助けてもらっていた。引き継ぎは「2週間でできる範囲でやります」と言っている。',
    severity: 'critical',
    phaseIds: ['all'],
    choices: [
      {
        id: 'intensive-handover',
        label: '残り2週間、毎日1〜2時間ベテランに横につきっきりで教えてもらう',
        summary: '限られた時間で最大限の移転をする。',
        effects: { quality: 6, cost: -5, schedule: -3, stakeholder: 3, morale: 2 },
        explanation:
          '2週間は短い。でも毎日集中して教えてもらえれば、最重要の手順だけは移転できる。自分でメモを取りながらそのままドキュメント化することで、後から来るメンバーの資産にもなる。',
        pmBokTags: ['ナレッジ管理', 'リスク管理'],
      },
      {
        id: 'document-first',
        label: '「とにかく全部ドキュメントに書いてください」とお願いする',
        summary: '文書化を依頼する。',
        effects: { quality: 4, cost: -3, schedule: -2, stakeholder: 2, morale: 0 },
        explanation:
          '文書化は重要だが、ベテランが「全部書く」のは現実的に難しい。15年分の暗黙知は文章だけでは伝わらない部分も多い。文書化と並行して実際の作業の同席が必要。',
        pmBokTags: ['ナレッジ管理'],
      },
      {
        id: 'give-up',
        label: '2週間で移転できる範囲に諦める。なるようになる',
        summary: '割り切って最低限だけ引き継ぐ。',
        effects: { quality: -6, cost: 2, schedule: 0, stakeholder: -4, morale: -4 },
        explanation:
          '「なるようになる」精神は、退職後の最初の障害で砕かれる。ベテランが知っていたことを誰も知らない状態での深夜障害対応は、チーム全体の疲弊に直結する。',
        pmBokTags: ['ナレッジ管理', 'リスク管理'],
      },
    ],
  },

  {
    id: 'mem-same-incident-again',
    title: '先月と全く同じ障害が起きた。先月も自分が対応した',
    description:
      '先月の深夜、DBのコネクション枯渇で障害が起きた。「再起動で解決」でクローズした。今月また同じ時間帯に同じ障害が起きた。ログを見ると全く同じパターン。先月調査しなかった自分も悪いが、再発した事実をどう扱うか。',
    severity: 'high',
    phaseIds: ['all'],
    choices: [
      {
        id: 'own-it',
        label: 'PMに「先月の調査不足でした。今回こそ根本を潰します」と報告して調査する',
        summary: '自分から認めて根本対策に動く。',
        effects: { quality: 8, cost: -5, schedule: 2, stakeholder: 6, morale: 5 },
        explanation:
          '再発を正直に報告することで信頼が積み上がる。「今回は根本を直します」という姿勢が最終的に評価される。',
        pmBokTags: ['問題管理', 'コミュニケーション管理'],
      },
      {
        id: 'investigate-quietly',
        label: '今回こそ原因を調査するが、再発したことは強調せずに報告する',
        summary: '調査はするが再発の事実は薄めて伝える。',
        effects: { quality: 5, cost: -4, schedule: 1, stakeholder: 1, morale: -2 },
        explanation:
          '調査すること自体は正しい。ただし再発の事実を薄めると、PMが体制や監視の改善に動けなくなる。',
        pmBokTags: ['問題管理', 'コミュニケーション管理'],
      },
      {
        id: 'restart-again',
        label: '今回も再起動で復旧させる。また次回気をつければいい',
        summary: '今回もその場をしのぐ。',
        effects: { quality: -8, cost: 1, schedule: 3, stakeholder: -5, morale: -6 },
        explanation:
          '2回連続で同じ障害を再起動でクローズした。3回目は来月くるかもしれない。火消しのループから抜け出せない典型的な判断だ。',
        pmBokTags: ['問題管理', 'インシデント管理'],
      },
    ],
  },

  {
    id: 'mem-user-urgent-impossible',
    title: '「今日中にやってほしい」——絶対に無理な依頼が来た',
    description:
      '営業部の部長から「今日の15時までに画面に新しい集計項目を追加してほしい。明日の経営会議で使う」と依頼が来た。現在13時。その機能はDB改修を伴い、どう見ても2日かかる作業だ。',
    severity: 'high',
    phaseIds: ['all'],
    choices: [
      {
        id: 'explain-reality',
        label: '「2日かかります。PMに確認を取って代替案を提示します」と正直に伝える',
        summary: '現実を説明してPMを巻き込む。',
        effects: { quality: 4, cost: -2, schedule: 1, stakeholder: 3, morale: 3 },
        explanation:
          '「無理です」だけでなく「PMに確認します」「代替案があります」をセットで伝えることが、部長の怒りを最小化する。',
        pmBokTags: ['コミュニケーション管理', '変更管理'],
      },
      {
        id: 'try-somehow',
        label: '無理を承知で取り組む。できるところまでやる',
        summary: '可能な限り対応する。',
        effects: { quality: -5, cost: -5, schedule: -3, stakeholder: 1, morale: -6 },
        explanation:
          '「やります」と言って中途半端な状態で15時を迎えると、部長への信頼も失い、システムには未完成の変更が残る。',
        pmBokTags: ['変更管理'],
      },
      {
        id: 'contact-pm',
        label: 'PMに今すぐ連絡して状況を伝え、対応方針の判断を仰ぐ',
        summary: '自分では判断せずPMに上げる。',
        effects: { quality: 3, cost: -2, schedule: 1, stakeholder: 4, morale: 2 },
        explanation:
          '優先度の判断や部長への説明はPMの役割。自分が引き受けると以降も同じことが繰り返される。',
        pmBokTags: ['コミュニケーション管理', '変更管理'],
      },
    ],
  },

  {
    id: 'mem-alert-real-this-time',
    title: 'いつものアラートだと思って流したら、今回は本物だった',
    description:
      '「またこのアラートか」と流していたら、今回は本物の障害だった。気づいたのはユーザーから「画面が真っ白です」と問い合わせが来てから。アラートから30分以上経過していた。',
    severity: 'critical',
    phaseIds: ['all'],
    choices: [
      {
        id: 'respond-and-reflect',
        label: 'まず障害対応する。その後、監視設定の見直しをPMに提案する',
        summary: '対応してから再発防止を提案。',
        effects: { quality: 5, cost: -5, schedule: 2, stakeholder: 3, morale: 2 },
        explanation:
          '「またか」という慣れがヒヤリハットを起こした。「アラートが多すぎてトリアージできていない」という問題をPMに数字で伝える。',
        pmBokTags: ['インシデント管理', '継続的改善', '監視'],
      },
      {
        id: 'hide-delay',
        label: '30分の遅延は報告書に書かない。対応した事実だけ伝える',
        summary: '遅延の事実は隠す。',
        effects: { quality: -4, cost: 0, schedule: 1, stakeholder: -5, morale: -5 },
        explanation:
          '遅延を隠すとPMが正確に状況を把握できなくなる。隠蔽が続いていたことが明らかになれば信頼は一気に失われる。',
        pmBokTags: ['コミュニケーション管理', 'インシデント管理'],
      },
      {
        id: 'report-honestly',
        label: '「アラートを流してしまいました。30分遅延しました」と正直に報告する',
        summary: '遅延を含めて正直に報告。',
        effects: { quality: 4, cost: -3, schedule: 0, stakeholder: 5, morale: 4 },
        explanation:
          '正直な報告で問題の本質（アラートが多すぎて機能していない）をPMが把握できれば、体制改善につながる。',
        pmBokTags: ['コミュニケーション管理', '監視'],
      },
    ],
  },

  {
    id: 'mem-legacy-touch-break',
    title: '「絶対触るな」と言われていたレガシーを触ったら壊れた',
    description:
      '「絶対に触るな」と言われていた古いシェルスクリプトを、どうしても変更しなければならない事情ができた。変更したら別のジョブが動かなくなった。スクリプトの依存関係が誰にも分かっていなかった。',
    severity: 'critical',
    phaseIds: ['all'],
    choices: [
      {
        id: 'rollback-report',
        label: '変更を戻してから、PMに状況を報告する',
        summary: 'まず元に戻してから正直に話す。',
        effects: { quality: 5, cost: -4, schedule: -2, stakeholder: 4, morale: 2 },
        explanation:
          '変更を戻すことで影響範囲を最小化できる。「触ったら壊れた、ロールバックしました」は正直な報告。依存関係を調査してから再度変更する手順を踏む必要がある。',
        pmBokTags: ['変更管理', 'コミュニケーション管理'],
      },
      {
        id: 'fix-deeper',
        label: '壊れたジョブも自分で直そうとする',
        summary: '自力でなんとかしようとする。',
        effects: { quality: -6, cost: -4, schedule: -3, stakeholder: -4, morale: -4 },
        explanation:
          '全体像が見えていない状態でさらに変更を重ねると、影響範囲が広がる可能性がある。一人で抱え込まず報告すべき局面。',
        pmBokTags: ['変更管理'],
      },
      {
        id: 'ask-veteran',
        label: 'チームの古株に相談する',
        summary: '知っている人に聞く。',
        effects: { quality: 4, cost: -3, schedule: -1, stakeholder: 2, morale: 2 },
        explanation:
          '知見がある人に頼るのは正しい判断。レガシーを知る人の知識をこの機会にドキュメント化することも忘れずに。',
        pmBokTags: ['ナレッジ管理', '変更管理'],
      },
    ],
  },

  {
    id: 'mem-junior-mistake',
    title: '後輩が誤操作して本番データを一部削除した',
    description:
      '作業を見守っていたら、後輩が本番とステージングを間違えてコマンドを実行した。数千件のデータが削除された。後輩は青ざめて固まっている。バックアップは取れている。',
    severity: 'critical',
    phaseIds: ['all'],
    choices: [
      {
        id: 'calm-lead',
        label: 'まず後輩を落ち着かせ、一緒にバックアップからリストアする',
        summary: '冷静にリカバリーをリードする。',
        effects: { quality: 6, cost: -4, schedule: -1, stakeholder: 4, morale: 5 },
        explanation:
          'バックアップがある。パニックにならず手順通りに動けば復旧できる。後輩を責めるより「一緒にやろう」という姿勢が後輩の成長にもつながる。',
        pmBokTags: ['インシデント管理', 'コミュニケーション管理'],
      },
      {
        id: 'report-blame',
        label: '後輩がやったことをPMにすぐ報告する',
        summary: 'すぐにPMへ報告する。',
        effects: { quality: 2, cost: -3, schedule: -2, stakeholder: 3, morale: -3 },
        explanation:
          '報告は必要だが、リストアより先に「後輩がやった」を報告しに行くと、復旧が遅れる。まず復旧、その後に報告の順番が正しい。',
        pmBokTags: ['コミュニケーション管理', 'インシデント管理'],
      },
      {
        id: 'cover-up',
        label: 'バックアップから戻して、誰にも言わないことにする',
        summary: '隠して終わらせる。',
        effects: { quality: 1, cost: -2, schedule: 2, stakeholder: -5, morale: -6 },
        explanation:
          '復旧できても、報告しないことで同様のミスを防ぐ仕組みが作られない。後で発覚した時の信頼の損失は大きい。',
        pmBokTags: ['コミュニケーション管理', 'ナレッジ管理'],
      },
    ],
  },

  {
    id: 'mem-oncall-holiday',
    title: '旅行先に向かう新幹線の中でアラートが来た',
    description:
      '半年ぶりに取った3連休。新幹線に乗ってから1時間、スマホに監視アラートが来た。オンコール当番は自分ではないはずだが、当番の同僚が「スマホを家に忘れた」と連絡してきた。',
    severity: 'high',
    phaseIds: ['all'],
    choices: [
      {
        id: 'help-remotely',
        label: '旅行先からリモートで対応できる範囲だけ助けて、あとは同僚に頑張ってもらう',
        summary: '部分的にサポートしながら休日を守る。',
        effects: { quality: 3, cost: -4, schedule: 2, stakeholder: 2, morale: -2 },
        explanation:
          '協力は大切だが、自分の休日を全て潰す必要はない。「初動だけ確認する、あとは戻って対応してほしい」という線引きは正当。',
        pmBokTags: ['資源管理', 'インシデント管理'],
      },
      {
        id: 'fully-support',
        label: '折り返して対応する。旅行は諦める',
        summary: '旅行をキャンセルして対応する。',
        effects: { quality: 6, cost: -3, schedule: 4, stakeholder: 4, morale: -8 },
        explanation:
          '対応は評価されるが、自分の有給・休日がこのような形で奪われることが続くとモチベーションが低下する。個人の犠牲で成り立つ体制は持続しない。',
        pmBokTags: ['資源管理'],
      },
      {
        id: 'tell-pm',
        label: 'PMに電話して「当番の体制が崩壊しています」と報告する',
        summary: 'PMに体制の問題を伝える。',
        effects: { quality: 2, cost: -2, schedule: -1, stakeholder: 3, morale: 3 },
        explanation:
          '「スマホを忘れた」ことで体制が崩壊する時点で、オンコール設計に問題がある。今回の事案をPMに伝えることで体制の見直しにつながる。',
        pmBokTags: ['コミュニケーション管理', '資源管理'],
      },
    ],
  },

  {
    id: 'mem-spec-nobody-knows',
    title: '「この処理、なんでこうなってるんですか？」——誰も答えられなかった',
    description:
      '障害調査中に不思議な処理を発見した。なぜこうなっているのか誰も知らない。前任者はいない。コメントもない。とりあえず触らなければ動いているが、触らないわけにもいかない状況だ。',
    severity: 'medium',
    phaseIds: ['all'],
    choices: [
      {
        id: 'reverse-engineer',
        label: '時間をかけてコードを読み解き、分かったことをドキュメントに残す',
        summary: '理解して、記録に残す。',
        effects: { quality: 5, cost: -5, schedule: -3, stakeholder: 3, morale: 4 },
        explanation:
          '誰かがいつかやらなければならない作業。「今の自分がやる」ことで、チームの負債を少し減らせる。完全に理解しなくても、分かった範囲を書き残すだけで次の人が助かる。',
        pmBokTags: ['ナレッジ管理'],
      },
      {
        id: 'minimum-touch',
        label: '障害対応に必要な最小限の変更だけして、詳細調査は後日にする',
        summary: '今は最小限だけ触る。',
        effects: { quality: 3, cost: -2, schedule: 1, stakeholder: 1, morale: 0 },
        explanation:
          '完全に理解できていない状態での変更は最小限にするのが原則。作業後に簡単なメモだけでも残しておくと、次の担当者が助かる。',
        pmBokTags: ['変更管理', 'ナレッジ管理'],
      },
      {
        id: 'ask-pm-time',
        label: 'PMに「この領域の調査と文書化に1週間ください」と提案する',
        summary: '組織的に解決するよう提案する。',
        effects: { quality: 4, cost: -3, schedule: -3, stakeholder: 4, morale: 3 },
        explanation:
          '技術的負債の解消には時間が必要。「誰も知らない処理が障害の原因になっている」という現状のリスクをPMに伝えて時間を確保してもらう。',
        pmBokTags: ['ナレッジ管理', 'コミュニケーション管理'],
      },
    ],
  },
];
