import { NextResponse } from 'next/server';
import { sanitizeMessages } from '../../../src/lib/sanitize';
import { handleApiError } from '../../../src/lib/apiError';

type Message = { role: 'user' | 'assistant'; content: string };

type ReflectRequest = {
  messages: Message[];
  turnNumber: number;   // 1-indexed current turn (client sends before incrementing)
  context: {
    playerName: string;
    endingType: string;
    quality: number;
    cost: number;
    delivery: number;
    trust: number;
    total: number;
  };
};

const MAX_TURNS = 7;

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: '（AIとの接続に失敗しました）', finished: false }, { status: 200 });
  }

  let parsedBody: ReflectRequest;
  try {
    parsedBody = await request.json();
  } catch (error) {
    return handleApiError(error, 'game-reflect');
  }
  const { messages: rawMessages, turnNumber, context } = parsedBody;
  const messages = sanitizeMessages(rawMessages);
  const { playerName, endingType, quality, cost, delivery, trust, total } = context;

  const endingDesc = endingType === 'A'
    ? '大成功・顧客から高評価'
    : endingType === 'B' ? 'なんとか無事に完了'
    : endingType === 'C' ? '炎上しながらも完了したが課題多数'
    : '信頼を大きく損ない失敗';

  // Build turn-aware instructions
  const isFirst  = turnNumber === 1;
  const isLast   = turnNumber >= MAX_TURNS;
  const isMid    = !isFirst && !isLast;

  let turnInstruction = '';
  if (isFirst) {
    turnInstruction = `これは第1ターン（全${MAX_TURNS}ターン）。
「お疲れ様でした」から始め、プロジェクト全体の感想と、最も印象的だったスコア（品質${quality}、信頼度${trust}など）に触れてください。
また、あなた（クライアント）から気になった点を1つ具体的に指摘してください。`;
  } else if (isLast) {
    turnInstruction = `これは最終ターン（第${turnNumber}/${MAX_TURNS}ターン）。
これまでの会話を受けて、${playerName}さんへのまとめのメッセージを伝えてください。
今後に活かしてほしいアドバイスを1つ添えて、温かく締めくくってください。`;
  } else {
    turnInstruction = `これは第${turnNumber}/${MAX_TURNS}ターン。
${playerName}さんの前の発言に共感または補足しながら、
スコアの別の側面（品質・コスト・納期・信頼度いずれか未言及のもの）について
具体的なコメントか質問を1つしてください。`;
  }

  const systemPrompt = `あなたは〇〇銀行のシステム部門担当、佐々木部長です。
今期の勘定系サブシステム刷新プロジェクトを発注した立場として、
担当SE「${playerName}」と一緒にプロジェクトを振り返っています。

【プロジェクト結果】
- 総評：エンディング${endingType}（${endingDesc}）
- 品質：${quality}/100　コスト：${cost}/100　納期：${delivery}/100　信頼度：${trust}/100
- 合計スコア：${total}/400

【会話ルール】
・顧客（銀行側）の担当者として自然に話す
・150〜200文字以内、敬語すぎず話しかける口調
・スコアや数値を参照しながら具体的に
・${isMid ? 'クライアントから見た指摘や質問を必ず1つ含める' : ''}

【今ターンの指示】
${turnInstruction}`;

  const finished = isLast;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 350,
        temperature: 0.75,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ reply: '（AI応答の取得に失敗しました）', finished }, { status: 200 });
    }

    const data = await res.json();
    const reply: string = data?.choices?.[0]?.message?.content ?? '（応答がありませんでした）';
    return NextResponse.json({ reply: reply.trim(), finished });
  } catch {
    return NextResponse.json({ reply: '（ネットワークエラー）', finished }, { status: 200 });
  }
}
