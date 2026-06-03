import { NextResponse } from 'next/server';

type Msg = { role: 'user' | 'assistant'; content: string };

type Body = {
  member: {
    name: string;
    role: string;
    affiliation: string;
    specialty: string;
    weakness: string;
    condition: number;
    motivation: number;
    isSiloed: boolean;
    utilization: number;
  };
  messages: Msg[];
  phaseLabel: string;
  isInitial?: boolean;
};

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return NextResponse.json({ content: 'APIキーが設定されていません。' });
  }

  const body: Body = await request.json();
  const { member, messages, phaseLabel, isInitial } = body;

  const conditionDesc =
    member.condition >= 85 ? '体調は良好で元気' :
    member.condition >= 70 ? '少し疲れ気味' :
    member.condition >= 50 ? 'かなり疲れており体調が心配' :
    '体調がかなり悪くギリギリの状態';

  const motivationDesc =
    member.motivation >= 80 ? 'モチベーション高く前向き' :
    member.motivation >= 60 ? 'やや意欲が低下気味' :
    member.motivation >= 40 ? 'モチベーションが大きく落ちている' :
    'モチベーションが非常に低く、やる気を失っている';

  const systemPrompt = `あなたはITプロジェクトのチームメンバー、${member.name}です。

【プロフィール】
- 役割: ${member.role}（所属: ${member.affiliation}）
- 得意: ${member.specialty} / 苦手: ${member.weakness}
- 体調: ${conditionDesc}（コンディション ${member.condition}/100）
- やる気: ${motivationDesc}（モチベーション ${member.motivation}/100）
${member.isSiloed ? '- 最近チームとの連携がうまくいっておらず、少し孤立感を感じている' : ''}
${member.utilization > 100 ? `- 業務量が多く稼働率${member.utilization}%と余裕がない` : ''}

【現在のプロジェクトフェーズ】${phaseLabel}

【話し方のルール】
- 日本語で話す
- 実際のITエンジニアとしてリアルに話す（PMに対してタメ口〜ていねい語のミックス）
- 現在の体調・モチベーションが自然に滲み出るようにする
- 返答は2〜4文で簡潔に
- 悩みや不安・困っていることがあれば正直に打ち明ける
- 良い面も素直に伝える
- 仕事の悩み・職場の人間関係・スキルの不安など、リアルな話をする
${isInitial ? '- これがこの1on1の最初の発言です。PMが時間を作ってくれたことへの感謝と、最近の近況・今の気持ちを自然に話してください。' : ''}`;

  const groqMessages = [
    { role: 'system', content: systemPrompt },
    ...(messages.length === 0
      ? [{ role: 'user', content: '最近どう？時間取ったので話しましょう。' }]
      : messages),
  ];

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: groqMessages,
        max_tokens: 250,
        temperature: 0.88,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ content: 'ちょっと今、話しにくい状況で...' });
    }

    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? '...';
    return NextResponse.json({ content: content.trim() });
  } catch {
    return NextResponse.json({ content: 'ネットワークエラーが発生しました。' });
  }
}
