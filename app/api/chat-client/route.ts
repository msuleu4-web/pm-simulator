import { NextResponse } from 'next/server';

type Msg = { role: 'user' | 'assistant'; content: string };

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
};

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return NextResponse.json({ content: 'APIキーが設定されていません。' });
  }

  const body: Body = await request.json();
  const { scenarioTitle, scenarioDescription, clientName, clientDescription, phaseLabel, kpiSummary, messages, turnCount, maxTurns } = body;

  const remainingTurns = maxTurns - turnCount;
  const isAlmostDone = remainingTurns <= 2;

  const kpiNote = [
    kpiSummary.quality < 60 ? '品質が心配な状況' : '',
    kpiSummary.cost < 60 ? '予算が逼迫している' : '',
    kpiSummary.schedule < -10 ? 'スケジュールが遅れている' : '',
    kpiSummary.stakeholder < 60 ? '顧客との関係が不安定' : '',
  ].filter(Boolean).join('、');

  const systemPrompt = `あなたは「${clientName}」の担当者です。
クライアントのプロフィール: ${clientDescription}

【現在のシナリオ】
フェーズ: ${phaseLabel}
状況: ${scenarioTitle}
詳細: ${scenarioDescription}

${kpiNote ? `【プロジェクトの現状（あなたは知らないが参考に】: ${kpiNote}】` : ''}

【あなたの話し方ルール】
- 日本語でビジネス敬語を使う
- クライアントとしての立場・利益を守りながら発言する
- 2〜3文で簡潔に返答する
- 要求・懸念・条件があれば率直に伝える
- PMの提案に対して条件付きで応じることもある
- 完全に拒絶せず、交渉の余地を残す
${isAlmostDone ? '- そろそろ会議を締めくくる方向で、結論に向けた発言をしてください。' : ''}
- 残り会議時間は約${remainingTurns}ターン`;

  const groqMessages = [
    { role: 'system', content: systemPrompt },
    ...(messages.length === 0
      ? [{ role: 'user', content: 'お時間をいただきありがとうございます。今日の件について確認させてください。' }]
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
