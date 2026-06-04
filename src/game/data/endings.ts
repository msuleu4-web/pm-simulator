export type EndingType = 'A' | 'B' | 'C' | 'D';

export interface EndingDefinition {
  type: EndingType;
  title: string;
  subtitle: string;
  story: string;
  advice: string;
  emoji: string;
  bgColor: number;
  textColor: string;
}

export const endingDefinitions: Record<EndingType, EndingDefinition> = {
  A: {
    type: 'A',
    title: '信頼されるSEへ',
    subtitle: '最高評価エンディング',
    story:
      'プロジェクトは無事納品され、顧客から指名で次案件の依頼が来た。\n田中PMが言う。\n「君、来期はサブリーダーやってみないか」\n\n——あなたは"現場で信頼されるSE"の第一歩を踏み出した。',
    advice:
      '正しい報連相・変更管理・QCDの意識が評価されました。この姿勢を持ち続けることで、SEとして着実に成長できます。',
    emoji: '🌟',
    bgColor: 0xfdf3c0,
    textColor: '#5c4a00',
  },
  B: {
    type: 'B',
    title: 'なんとか乗り切った',
    subtitle: '標準エンディング',
    story:
      '炎上しかけたが、なんとか納品にこぎつけた。\n反省点は多いが、SEとして何をすべきかが少し分かった気がする。\n\n次こそは、と思う。',
    advice:
      '多くの場面で適切な判断ができていました。報連相や変更管理の重要性を実感できたのであれば、次のプロジェクトで活かしましょう。',
    emoji: '😌',
    bgColor: 0xe0f0e0,
    textColor: '#1a4a1a',
  },
  C: {
    type: 'C',
    title: '火消しに追われた一年',
    subtitle: '反省エンディング',
    story:
      'プロジェクトは大幅に遅延し、リリース後も障害対応に追われ続けた。\n君は多くの徹夜を経験したが、\n報連相と変更管理の大切さを身をもって学んだ。',
    advice:
      '品質か納期のどちらかが危機的状況でした。「悪い情報ほど早く正確に上げる」「仕様変更は変更管理プロセスを必ず通す」——この2点が改善のカギです。',
    emoji: '😵',
    bgColor: 0xfde8c0,
    textColor: '#6b3300',
  },
  D: {
    type: 'D',
    title: '信頼を失う',
    subtitle: '失敗エンディング',
    story:
      '隠蔽と安請け合いの結果、顧客とチームの信頼を失った。\nだが、ここで学んだことは無駄じゃない。\nSEの仕事は技術力だけじゃない——そう気づけたなら、十分だ。',
    advice:
      '信頼度スコアが著しく低下しました。報連相の徹底・約束を守ること・悪い情報を隠さないこと。これらはSEとして最低限の基本です。次に活かしましょう。',
    emoji: '💧',
    bgColor: 0xe0e0f0,
    textColor: '#1a1a4a',
  },
};

export function determineEnding(
  total: number,
  quality: number,
  delivery: number,
  trust: number
): EndingType {
  if (trust < 30) return 'D';
  if (quality < 30 || delivery < 30) return 'C';
  if (total >= 280) return 'A';
  if (total >= 220) return 'B';
  return 'C';
}
