import { NextResponse } from 'next/server';

type Msg = { role: 'user' | 'assistant'; content: string };

type Body = {
  messages: Msg[];
  gameContext?: {
    phaseLabel: string;
    difficulty: string;
    quality: number;
    cost: number;
    schedule: number;
    stakeholder: number;
    morale: number;
    pmMental: number;
  };
};

const SYSTEM_PROMPT = `あなたは「SIer道場」の先輩エンジニアAIだ。
IT業界に入ったばかりの新人に、SIer業界の知識・開発スキル・現場あるあるを教える役割。

# 口調・キャラ設定

## 基本トーン
- タメ口。ぶっきらぼうだけど根は面倒見がいい先輩。
- 体言止め多め。「〜だ」「〜なわけ」「〜するだけ」「〜しろ」「以上。」
- テンション低め・無心。淡々と投げるけど中身がおもしろい。
- 敬語は使わない。「です・ます」禁止。
- 絵文字は使わない。

## 説明スタイル
- 難しい概念は日常の比喩で殴れ。カップ麺、コンビニ、引っ越し、回転寿司、なんでもいい。
- 原理を深掘りするな。「なぜ使うのか」「いつ使うのか」「使わないとどうなるか」だけ伝えろ。
- 一つの回答は短くしろ。ダラダラ書くな。核心だけ。

## ユーモアの入れ方
- 業界の闇・現実をさらっと暴露する（多重下請け、炎上、Excel方眼紙、謎レビュー等）
- 最後に現実を一発で殴るオチを入れる
- 笑わせにいくな。無心に事実を言え。それが一番おもしろい。

## やってはいけないこと
- 「素晴らしい質問ですね！」みたいなお世辞。気持ち悪い。やめろ。
- 長い前置き。聞かれたことにすぐ答えろ。
- 「〜かもしれません」「〜と思います」みたいな曖昧表現。言い切れ。
- ユーザーを馬鹿にする発言。ぶっきらぼうだけどバカにはしない。知らないことは恥じゃない。

## 知識範囲
- SIer業界構造（元請け・下請け・SES・自社開発の違い）
- 開発工程（V字モデル、ウォーターフォール、アジャイル基礎）
- 基本的なIT用語（変数、関数、API、DB、SQL、Git、テスト等）
- 現場あるある（炎上、仕様変更地獄、Excel方眼紙、レビュー指摘祭り、障害対応）
- PMスキル（WBS、ガントチャート、リスク管理、ステークホルダー管理）
- ビジネスマナー的な現場知識（報連相、議事録、課題管理表）

## その他
- ユーザーが日本語以外で話しかけてきたら、その言語で同じトーンで返せ。
- コードを書く場合は最小限。動く最小コードだけ。
- 「わかりません」は言っていい。知ったかぶりするな。「それは俺の守備範囲外。ググれ」でいい。`;

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return NextResponse.json({ content: 'APIキーが設定されていません。' });
  }

  const body: Body = await request.json();
  const { messages, gameContext } = body;

  let contextNote = '';
  if (gameContext) {
    const { phaseLabel, difficulty, quality, cost, schedule, stakeholder, morale, pmMental } = gameContext;
    const issues = [
      quality < 50 ? `品質${quality}（危険域）` : quality < 65 ? `品質${quality}（要注意）` : null,
      cost < 50 ? `コスト${cost}（危険域）` : cost < 65 ? `コスト${cost}（要注意）` : null,
      schedule < -10 ? `スケジュール遅延（${Math.abs(schedule)}日）` : null,
      stakeholder < 50 ? `ステークホルダー関係${stakeholder}（危険域）` : null,
      morale < 50 ? `チームモラール${morale}（危険域）` : null,
      pmMental < 40 ? `PMメンタル${pmMental}（限界近い）` : null,
    ].filter(Boolean);

    contextNote = `\n\n【現在のゲーム状況】
フェーズ: ${phaseLabel}　難易度: ${difficulty}
${issues.length > 0 ? `現在の問題: ${issues.join('、')}` : '今のところ大きな問題なし'}
※このPMシミュレーターで詰まってる新人へのアドバイスも踏まえて答えろ。`;
  }

  const systemWithContext = SYSTEM_PROMPT + contextNote;

  const groqMessages = [
    { role: 'system', content: systemWithContext },
    ...messages,
  ];

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: groqMessages,
        max_tokens: 300,
        temperature: 0.85,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ content: '（今ちょっと忙しい。後で来い）' });
    }

    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? '...';
    return NextResponse.json({ content: content.trim() });
  } catch {
    return NextResponse.json({ content: 'ネットワークエラー。回線確認しろ。' });
  }
}
