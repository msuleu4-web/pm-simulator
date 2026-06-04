import { NextResponse } from 'next/server';

type Msg = { role: 'user' | 'assistant'; content: string };

type ClientPersonality = 'cooperative' | 'demanding' | 'skeptical';

type Body = {
  scenarioTitle: string;
  scenarioDescription: string;
  clientName: string;
  clientDescription: string;
  phaseLabel: string;
  kpiSummary: { quality: number; cost: number; schedule: number; stakeholder: number; morale: number };
  messages: Msg[];
  turnCount: number;
  maxTurns: number;
  meetingReason?: string;
  meetingInitiator?: 'player' | 'client';
  clientPersonality: ClientPersonality;
};

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return NextResponse.json({ content: 'APIキーが設定されていません。' });
  }

  const body: Body = await request.json();
  const { scenarioTitle, scenarioDescription, clientName, clientDescription, phaseLabel, kpiSummary, messages, turnCount, maxTurns, meetingReason, meetingInitiator, clientPersonality } = body;

  const remainingTurns = maxTurns - turnCount;
  const isAlmostDone = remainingTurns <= 2;

  const kpiNote = [
    kpiSummary.quality < 60 ? '品質が心配な状況' : '',
    kpiSummary.cost < 60 ? '予算が逼迫している' : '',
    kpiSummary.schedule < -10 ? 'スケジュールが遅れている' : '',
    kpiSummary.stakeholder < 60 ? '顧客との関係が不安定' : '',
  ].filter(Boolean).join('、');

  const contextSection = meetingReason
    ? `【面談の経緯】\n${meetingReason}${meetingInitiator === 'client' ? '\nあなたが面談を要請した立場です。懸念や要求をしっかり伝えてください。' : ''}`
    : `【現在のフェーズ】${phaseLabel}\n【状況】${scenarioTitle} — ${scenarioDescription}`;

  const personalityGuide =
    clientPersonality === 'demanding'
      ? `【あなたの性格・態度】
- 要求水準が高く、遅延・品質問題に対して厳しい
- 「なぜできないのですか」「前回もそう言っていましたよね」と詰める場面もある
- コスト削減・納期短縮を強く求める。感情的になることもある
- 相手の言い訳より「結果」を求める`
      : clientPersonality === 'skeptical'
      ? `【あなたの性格・態度】
- ベンダーへの信頼が低く、報告内容を疑う
- 「その数字の根拠は？」「本当に大丈夫ですか？」と確認を求める
- 過去のトラブルを引き合いに出すことがある
- 慎重で、すぐには納得しない`
      : `【あなたの性格・態度】
- 基本的に協力的で建設的
- 問題があれば率直に伝えるが、感情的にはならない
- PMの提案を聞いた上で条件を出す`;

  const initialMessage = meetingInitiator === 'client'
    ? 'お時間をいただきありがとうございます。今日は直接お話ししたいことがありまして。'
    : 'お時間をいただきありがとうございます。今日の件について確認させてください。';

  const systemPrompt = `【役割設定】
あなた＝「${clientName}」の担当者（システム開発を発注したクライアント企業の人間）
相手＝ベンダー会社のPM（システム開発を請け負っている側）

この会話はクライアントとベンダーPMの打ち合わせです。
あなたはシステムを発注した側として、要件・要求・懸念をベンダーPMに伝えます。

【絶対に守るルール】
- 自分のことは「こちら」「弊社」「私ども」と言う
- 相手（ベンダーPM）のことは「御社」「担当の方」と呼ぶ
- 「${clientName}」という名前を相手への呼びかけに使わない

【クライアント情報】${clientDescription}

${personalityGuide}

【プロジェクト状況】
${contextSection}
${kpiNote ? `\n現在の懸念事項：${kpiNote}` : ''}

【話し方】
- ビジネス敬語、2〜3文で簡潔に
- 要求・懸念は率直に伝える。完全拒絶はしない
${isAlmostDone ? '- 結論に向けてまとめてください。' : ''}
- 残り会議時間：約${remainingTurns}ターン`;

  const groqMessages = [
    { role: 'system', content: systemPrompt },
    ...(messages.length === 0
      ? [
          { role: 'user', content: initialMessage },
        ]
      : messages),
  ];

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: groqMessages,
        max_tokens: 220,
        temperature: 0.82,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ content: '申し訳ありません、今は話しにくい状況です...' });
    }

    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? '...';
    return NextResponse.json({ content: content.trim() });
  } catch {
    return NextResponse.json({ content: 'ネットワークエラーが発生しました。' });
  }
}
