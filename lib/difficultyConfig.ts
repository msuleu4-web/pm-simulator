import type { Difficulty, ProjectTheme } from './types';

export type DifficultyConfig = {
  id: Difficulty;
  label: string;
  weeks: number;
  phaseCount: number;
  scenariosPerPhase: number;
  effectMultiplier: number;
  eventProbability: number;
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
    effectMultiplier: 0.6,
    eventProbability: 0,
    initialStats: { quality: 85, cost: 100, schedule: 70, stakeholder: 80, morale: 85, pmMental: 90 },
    description: '初めてPMの仕事を体験する入門モード。突発イベントなし、判断ミスの影響も小さいです。',
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
    initialStats: { quality: 80, cost: 100, schedule: 60, stakeholder: 75, morale: 80, pmMental: 80 },
    description: '現場に近い難易度。突発事象が発生し、QCDのバランス管理が求められます。',
    badge: '標準',
    color: 'blue',
  },
  hard: {
    id: 'hard',
    label: 'ハード',
    weeks: 50,
    phaseCount: 5,
    scenariosPerPhase: 6,
    effectMultiplier: 1.35,
    eventProbability: 0.65,
    initialStats: { quality: 72, cost: 88, schedule: 45, stakeholder: 68, morale: 70, pmMental: 70 },
    description: '大規模プロジェクト。判断ミスの影響が大きく、頻繁な突発事象が連続して発生します。',
    badge: '上級',
    color: 'orange',
  },
  ultra: {
    id: 'ultra',
    label: 'ウルトラ',
    weeks: 200,
    phaseCount: 10,
    scenariosPerPhase: 5,
    effectMultiplier: 1.6,
    eventProbability: 0.75,
    initialStats: { quality: 65, cost: 82, schedule: 38, stakeholder: 62, morale: 65, pmMental: 62 },
    description: '200週に及ぶ超長期プロジェクト。運用移行・組織変革・レガシー刷新まで全てを乗り越えます。',
    badge: '超上級',
    color: 'violet',
    unlockCondition: { difficulty: 'hard', minScore: 75, label: 'ハードモードをスコア75以上でクリア' },
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
};
