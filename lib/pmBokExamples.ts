export const pmBokExamples: Record<string, { question: string; answer: string }> = {
  'スコープ管理': {
    question: '顧客が追加機能を要求したとき、まず何を確認すべきか？',
    answer: '要求の目的・価値と影響範囲を確認し、要件として受け入れるか変更管理で扱うか判断する。',
  },
  '品質管理': {
    question: '受け入れ基準が不明確な場合はどうする？',
    answer: 'ステークホルダーと受け入れ条件を合意し、テスト基準を明文化する。',
  },
  'ステークホルダー管理': {
    question: '利害関係者の期待値が異なる場合、最初のアクションは？',
    answer: '各利害関係者の優先事項を把握し、調整ミーティングで合意点を作る。',
  },
  'リスク管理': {
    question: '高影響・低確率のリスクに対して取るべき戦略は？',
    answer: '緩和策や監視を用意し、発生時の対応計画を事前に準備する。',
  },
};

export default pmBokExamples;
