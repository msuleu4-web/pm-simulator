import type { Difficulty, ProjectTheme } from './types';

export type DifficultyConfig = {
  id: Difficulty;
  label: string;
  weeks: number;
  phaseCount: number;
  scenariosPerPhase: number;
  effectMultiplier: number;
  eventProbability: number;
  teamSize: number;
  useMaintPhases?: boolean;
  initialStats: {
    quality: number;
    cost: number;
    schedule: number;
    stakeholder: number;
    morale: number;
    pmMental: number;
  };
  description: string;
  badge: string;
  color: string;
  unlockCondition?: { difficulty: Difficulty; minScore: number; label: string };
};

export const difficultyConfigs: Record<Difficulty, DifficultyConfig> = {
  easy: {
    id: 'easy',
    label: 'イージー',
    weeks: 15,
    phaseCount: 3,
    scenariosPerPhase: 2,
    effectMultiplier: 0.55,
    eventProbability: 0,
    teamSize: 5,
    initialStats: { quality: 82, cost: 88, schedule: 65, stakeholder: 78, morale: 83, pmMental: 88 },
    description: '初めてPMの仕事を体験する入門モード。5人チーム、突発イベントなし、判断ミスの影響も小さいです。',
    badge: '入門',
    color: 'emerald',
  },
  normal: {
    id: 'normal',
    label: 'ノーマル',
    weeks: 30,
    phaseCount: 5,
    scenariosPerPhase: 5,
    effectMultiplier: 1.0,
    eventProbability: 0.42,
    teamSize: 10,
    initialStats: { quality: 72, cost: 80, schedule: 48, stakeholder: 67, morale: 72, pmMental: 75 },
    description: '現場に近い難易度。10人チームで突発事象が発生し、QCDのバランス管理が求められます。',
    badge: '標準',
    color: 'blue',
  },
  hard: {
    id: 'hard',
    label: 'ハード',
    weeks: 50,
    phaseCount: 5,
    scenariosPerPhase: 6,
    effectMultiplier: 1.45,
    eventProbability: 0.68,
    teamSize: 20,
    initialStats: { quality: 63, cost: 68, schedule: 33, stakeholder: 58, morale: 62, pmMental: 62 },
    description: '20人の大規模チーム。判断ミスの連鎖が炎上を招き、プロジェクト崩壊のリスクが常にあります。',
    badge: '上級',
    color: 'orange',
  },
  ultra: {
    id: 'ultra',
    label: 'ウルトラ',
    weeks: 200,
    phaseCount: 10,
    scenariosPerPhase: 5,
    effectMultiplier: 1.7,
    eventProbability: 0.78,
    teamSize: 50,
    initialStats: { quality: 55, cost: 60, schedule: 25, stakeholder: 50, morale: 55, pmMental: 55 },
    description: '50人の超大規模チームで200週の旅。運用移行・組織変革・レガシー刷新。炎上は避けられない前提。',
    badge: '超上級',
    color: 'violet',
    unlockCondition: { difficulty: 'hard', minScore: 75, label: 'ハードモードをスコア75以上でクリア' },
  },
  'maint-easy': {
    id: 'maint-easy',
    label: '保守運用 Easy',
    weeks: 24,
    phaseCount: 3,
    scenariosPerPhase: 3,
    effectMultiplier: 0.65,
    eventProbability: 0.35,
    teamSize: 5,
    useMaintPhases: true,
    initialStats: { quality: 68, cost: 75, schedule: 72, stakeholder: 58, morale: 65, pmMental: 78 },
    description: '既存システムの保守・障害対応が中心。SLA遵守と技術的負債との戦い。5人の少数精鋭チーム。',
    badge: '保守 入門',
    color: 'teal',
  },
  'maint-hard': {
    id: 'maint-hard',
    label: '保守運用 Hard',
    weeks: 52,
    phaseCount: 5,
    scenariosPerPhase: 5,
    effectMultiplier: 1.4,
    eventProbability: 0.62,
    teamSize: 20,
    useMaintPhases: true,
    initialStats: { quality: 58, cost: 62, schedule: 65, stakeholder: 45, morale: 55, pmMental: 60 },
    description: '大規模システムの24時間運用。深夜障害・SLA超過・レガシー刷新を同時に回す20人体制。',
    badge: '保守 上級',
    color: 'teal',
  },
};

export const projectThemes: Record<Difficulty, ProjectTheme[]> = {
  easy: [
    {
      id: 'restaurant-order',
      title: '飲食チェーンの注文管理システム',
      client: '株式会社ハーベスト（都内10店舗の洋食チェーン）',
      description: '紙の注文票からデジタル化へ。シンプルな構成で小規模チームが対応。',
      statModifiers: { morale: 5 },
    },
    {
      id: 'juku-grade',
      title: '学習塾の成績・進捗管理アプリ',
      client: 'あすなろ学習院（生徒500名の個別指導塾）',
      description: '講師と保護者が使いやすい成績管理ツール。予算は少ないが要件はシンプル。',
      statModifiers: { cost: -8, stakeholder: 5 },
    },
    {
      id: 'realestate-db',
      title: '不動産仲介会社の物件管理DB',
      client: 'ミライホーム不動産（地域密着の中小企業）',
      description: 'Excelで管理していた物件情報をシステム化。操作が簡単なことが最優先。',
      statModifiers: { morale: 3, cost: -5 },
    },
    {
      id: 'library-renewal',
      title: '地域図書館の蔵書・貸出管理更新',
      client: '市立中央図書館（公共施設）',
      description: '老朽化したシステムの更新。公共調達のため変更は少ないが意思決定が遅い。',
      statModifiers: { schedule: -5, stakeholder: 8 },
    },
    {
      id: 'salon-booking',
      title: '美容院チェーンの予約・顧客管理',
      client: 'ヘアーサロン「ルーチェ」（15店舗展開）',
      description: '電話予約からオンライン予約への移行。現場スタッフの使いやすさが鍵。',
      statModifiers: { morale: 5, stakeholder: 3 },
    },
  ],
  normal: [
    {
      id: 'retail-inventory',
      title: '中堅小売チェーンの在庫管理システム',
      client: '株式会社マルタカリテール（スーパー28店舗）',
      description: '在庫のリアルタイム可視化と発注自動化。業務改善の期待が高い。',
      statModifiers: {},
    },
    {
      id: 'manufacturing-quality',
      title: '製造業の品質管理・検査システム',
      client: '東洋精機株式会社（自動車部品メーカー）',
      description: '紙の検査記録をデジタル化し、品質トレーサビリティを確保する。',
      statModifiers: { quality: 5, stakeholder: -3 },
    },
    {
      id: 'hospital-reception',
      title: '中堅病院の予約・受付・会計システム',
      client: '医療法人みなと病院（200床・外来1日400名）',
      description: '医療システムはコンプライアンスが厳しく、稼働後の変更が難しい。',
      statModifiers: { stakeholder: 8, schedule: -5 },
    },
    {
      id: 'logistics-delivery',
      title: '物流会社の配送管理プラットフォーム',
      client: '全国通運株式会社（関東圏の中堅物流）',
      description: 'ドライバー・倉庫・顧客が連携するリアルタイム配送管理システム。',
      statModifiers: { cost: -5, morale: -3 },
    },
    {
      id: 'ec-order-integration',
      title: 'EC企業の受注・在庫統合管理システム',
      client: '株式会社ネクストショップ（年商30億のEC企業）',
      description: '複数モールの受注を一元管理。システム障害が直接売上に影響する。',
      statModifiers: { quality: 3, schedule: -5 },
    },
  ],
  hard: [
    {
      id: 'dept-store-core',
      title: '大手百貨店の基幹システム全面刷新',
      client: '帝都百貨店株式会社（年商3,000億・6店舗）',
      description: '30年稼働する既存基幹システムを全面刷新。失敗は許されない大型案件。',
      statModifiers: { quality: -5, stakeholder: 5 },
    },
    {
      id: 'bank-online',
      title: 'メガバンクのオンラインバンキング基盤移行',
      client: '東洋銀行（全国展開のメガバンク、口座数2,000万）',
      description: '24時間止められないシステムの世代交代。セキュリティと可用性が最優先。',
      statModifiers: { quality: 5, morale: -8, schedule: -8 },
    },
    {
      id: 'ec-nationwide',
      title: '全国展開ECサイトの大規模構築',
      client: '株式会社グランドモール（上場EC企業）',
      description: 'ピーク時数十万アクセスを処理するECプラットフォームをゼロから構築。',
      statModifiers: { cost: -8, morale: -5 },
    },
    {
      id: 'gov-dx',
      title: '自治体DXプロジェクト（行政手続き電子化）',
      client: '関東圏A市（人口35万人・市役所）',
      description: '行政特有の縦割り組織と厳しい調達規制の中で市民サービスを改善する。',
      statModifiers: { schedule: -10, stakeholder: 8, morale: -5 },
    },
    {
      id: 'global-erp',
      title: 'グローバル製造業のERP全社導入',
      client: '株式会社サンライズマニュファクチャリング（海外6拠点）',
      description: '国内外10拠点に渡るERPの展開。文化・言語・時差の壁を超えた調整が必要。',
      statModifiers: { cost: -10, stakeholder: -5, morale: -5 },
    },
  ],
  ultra: [
    {
      id: 'city-bank-core',
      title: '大手都市銀行の勘定系システム完全刷新',
      client: '太平洋銀行（口座数5,000万・国内最大級）',
      description: '国内最大規模の金融基盤を200週かけて世代交代。国家経済に影響しかねない。',
      statModifiers: { quality: -5, stakeholder: 8, morale: -8 },
    },
    {
      id: 'mega-ec-replatform',
      title: '国内最大手ECモールのフルリプレイス',
      client: '株式会社ジャパンモール（流通総額2兆円）',
      description: '日本最大のECプラットフォームを停止ゼロで全面刷新。失敗は即座に社会問題化する。',
      statModifiers: { cost: -8, schedule: -8 },
    },
    {
      id: 'hospital-chain-emr',
      title: '全国チェーン病院の統合電子カルテ構築',
      client: '医療法人アドバンスケア（全国100病院・2万床）',
      description: '患者の命に直結する医療情報システム。コンプライアンスと品質が絶対条件。',
      statModifiers: { quality: -8, stakeholder: 10 },
    },
    {
      id: 'national-digital-id',
      title: '国家レベルのデジタルIDプラットフォーム',
      client: '内閣府デジタル庁（国民1億2000万人が対象）',
      description: '全国民が使う認証基盤。政治的圧力・予算制約・セキュリティ要件が極限レベル。',
      statModifiers: { schedule: -10, stakeholder: 5, morale: -8 },
    },
    {
      id: 'connected-car',
      title: '自動車メーカーのコネクテッドカーPF構築',
      client: '日本モーター株式会社（世界シェア5位の自動車メーカー）',
      description: '走行中の車両と繋がるクラウド基盤。OTAアップデート・AI解析・グローバル展開を含む。',
      statModifiers: { cost: -10, quality: -5, morale: -5 },
    },
  ],
  'maint-easy': [
    {
      id: 'maint-easy-juku',
      title: '学習塾システムの保守・問い合わせ対応',
      client: 'あすなろ学習院（生徒500名の個別指導塾）',
      description: '成績管理・出欠システムの定常保守。月1回の定期メンテと講師からの問い合わせ対応が主業務。',
      category: '保守運用',
      statModifiers: { morale: 3 },
    },
    {
      id: 'maint-easy-ec',
      title: '小規模ECサイトの運用・障害対応',
      client: '手作り雑貨「てのひらマーケット」（月商200万円）',
      description: '注文・在庫・配送システムの日次確認と障害対応。深夜に突然電話が来ることも。',
      category: '保守運用',
      statModifiers: { morale: -4, stakeholder: -5 },
    },
    {
      id: 'maint-easy-realestate',
      title: '不動産管理システムの保守・改善要望対応',
      client: 'ミライホーム不動産（地域密着の中小企業）',
      description: '物件DB・顧客管理システムの保守。改善要望は多いが予算は厳しく、優先度判断が常に求められる。',
      category: '保守運用',
      statModifiers: { cost: -5, schedule: 5 },
    },
    {
      id: 'maint-easy-groupware',
      title: '社内グループウェアの運用管理',
      client: 'ある中小製造業（社員150名）',
      description: '社内メール・スケジュール・ファイル共有の日常管理。地味だが誰かが怠ると全社に影響が出る。',
      category: '保守運用',
      statModifiers: { schedule: 8, morale: -6 },
    },
    {
      id: 'maint-easy-library',
      title: '地域図書館システムの保守・年次更新',
      client: '市立中央図書館（公共施設）',
      description: '蔵書・貸出管理システムの保守と年次ライセンス更新。予算が少なく、無償対応を求められがち。',
      category: '保守運用',
      statModifiers: { cost: -8, stakeholder: -3, schedule: 5 },
    },
  ],
  'maint-hard': [
    {
      id: 'maint-hard-securities',
      title: '証券会社 夜間バッチ・障害対応運用',
      client: '東洋証券株式会社（口座数150万）',
      description: '毎日深夜に走る約定・清算バッチの監視。障害が市場開場前に解決されなければ損失が直撃する。',
      category: '保守運用',
      statModifiers: { morale: -8, stakeholder: -8, cost: -5 },
    },
    {
      id: 'maint-hard-factory',
      title: '大手製造業 生産管理システム 24h運用保守',
      client: '東洋精機株式会社（自動車部品メーカー）',
      description: '24時間稼働の生産ラインを支えるシステム。ダウンタイムは1分で数百万の損失。改善要望も絶えない。',
      category: '保守運用',
      statModifiers: { morale: -6, stakeholder: -7, quality: -5 },
    },
    {
      id: 'maint-hard-hospital',
      title: '中堅病院グループ 電子カルテシステム保守',
      client: '医療法人みなと病院グループ（3病院・500床）',
      description: '複数拠点の電子カルテ・オーダリングシステムの24h運用。障害は患者の命に関わる可能性がある。',
      category: '保守運用',
      statModifiers: { morale: -7, stakeholder: -6, quality: -4 },
    },
    {
      id: 'maint-hard-bank',
      title: '地方銀行 勘定系・インターネットバンキング保守',
      client: '東海地方銀行（支店数80・口座数50万）',
      description: '勘定系とネットバンキングの保守。障害は即座に金融庁報告義務が発生し、社会的信用が毀損する。',
      category: '保守運用',
      statModifiers: { morale: -8, stakeholder: -8, cost: -6, quality: -3 },
    },
    {
      id: 'maint-hard-logistics',
      title: '全国物流会社の配送管理プラットフォーム保守',
      client: '全国通運株式会社（ドライバー3000名）',
      description: '全国のドライバー・倉庫・顧客をつなぐシステムの保守。年末年始・お盆の繁忙期に必ず障害が起きる。',
      category: '保守運用',
      statModifiers: { morale: -5, stakeholder: -6, cost: -4 },
    },
  ],
};
