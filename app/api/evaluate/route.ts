import { NextResponse } from 'next/server';

type EvaluationItem = {
  label: string;
  score: number;
};

type EvaluateRequest = {
  averageScore: number;
  overallRank: string;
  evaluationItems: EvaluationItem[];
  decisionCount: number;
  topTags: string[];
  siloCount: number;
};

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return NextResponse.json(
      { comment: 'APIキーが設定されていません。.env.local に GROQ_API_KEY を設定してください。' },
      { status: 200 }
    );
  }

  const body: EvaluateRequest = await request.json();
  const { averageScore, overallRank, evaluationItems, decisionCount, topTags, siloCount } = body;

  const weakItems = evaluationItems
    .filter((item) => item.score < 60)
    .map((item) => `${item.label}(${item.score})`)
    .join('、');

  const strongItems = evaluationItems
    .filter((item) => item.score >= 80)
    .map((item) => `${item.label}(${item.score})`)
    .join('、');

  const prompt = `あなたはプロジェクトマネジメントの専門家です。
以下のシミュレーション結果をもとに、PMへの一言評価コメントを日本語で3文以内で書いてください。
具体的な数値や傾向に触れながら、改善点と強みを率直に伝えてください。

【結果サマリー】
- 総合スコア: ${averageScore} / ランク: ${overallRank}
- 意思決定回数: ${decisionCount}回
- 得意分野: ${strongItems || 'なし'}
- 課題分野: ${weakItems || 'なし'}
- サイロ化メンバー数: ${siloCount}名
- 多く使ったPMBOK領域: ${topTags.join('、') || 'なし'}

コメントのみを返してください（見出し不要）。`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Groq API error:', err);
      return NextResponse.json({ comment: 'AI評価の取得に失敗しました。しばらくしてから再試行してください。' }, { status: 200 });
    }

    const data = await res.json();
    const comment: string = data?.choices?.[0]?.message?.content ?? 'コメントを生成できませんでした。';
    return NextResponse.json({ comment: comment.trim() });
  } catch {
    return NextResponse.json({ comment: 'ネットワークエラーが発生しました。' }, { status: 200 });
  }
}
