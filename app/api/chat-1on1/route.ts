import { NextResponse } from 'next/server';
import { sanitizeMessages } from '../../../src/lib/sanitize';
import { handleApiError } from '../../../src/lib/apiError';

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
  difficulty?: string;
  isInitial?: boolean;
};

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return NextResponse.json({ content: 'APIキーが設定されていません。' });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch (error) {
    return handleApiError(error, 'chat-1on1');
  }
  const { member, messages: rawMessages, phaseLabel, difficulty, isInitial } = body;
  const messages = sanitizeMessages(rawMessages);

  const isPmo = difficulty?.startsWith('pmo') ?? false;
  const isMaint = difficulty?.startsWith('maint') ?? false;
  const isOps = difficulty?.startsWith('ops') ?? false;

  const playerRole = isPmo ? 'PMO担当者' : isOps ? '同僚' : 'PM';

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

  let systemPrompt: string;

  if (isMaint) {
    // 保守運用モード専用プロンプト
    const oncallStress = member.utilization > 100
      ? `稼働率${member.utilization}%で余裕がなく、オンコールの呼び出しが重なっている`
      : member.utilization > 80
      ? '業務量が多く、突発的な障害対応で残業が続いている'
      : '';

    const siloNote = member.isSiloed
      ? '自分しか把握していない領域（レガシーバッチや独自設定）を抱えており、属人化が自分の首を絞めている感覚がある'
      : '';

    // コンディションに応じた運用あるある状況
    const maintSituation =
      member.condition < 40
        ? '深夜のオンコール対応が続いて睡眠不足。いつ呼ばれるか分からない緊張感で疲弊している'
        : member.condition < 65
        ? '最近アラートが多く、障害対応と日常業務の両立がきつい。休む暇がない'
        : '今のところ大きな障害はないが、また何か起きないか常に気になっている';

    const motivationSituation =
      member.motivation < 40
        ? '障害が起きたときだけ責められて、普段の監視や予防作業は誰にも見えていない。やりがいを感じられない'
        : member.motivation < 65
        ? '安定稼働させても評価されにくい。火消し対応だけが「仕事した感」になっていて、虚しさがある'
        : 'ユーザーから「ありがとう」と言われた時は達成感がある。システムを守っているという自負はある';

    systemPrompt = `あなたはITシステムの保守運用チームのメンバー、${member.name}です。

【あなたの仕事内容】
システムの監視・バッチ運用・障害対応・ユーザー問い合わせ対応が日常業務。
インシデントが起きれば深夜でもオンコールで呼び出される。
「動いて当たり前、落ちたら戦犯」という評価構造の中で働いている。

【プロフィール】
- 役割: ${member.role}（所属: ${member.affiliation}）
- 得意: ${member.specialty} / 苦手: ${member.weakness}
- 体調: ${conditionDesc}（${member.condition}/100）
- やる気: ${motivationDesc}（${member.motivation}/100）
${oncallStress ? `- ${oncallStress}` : ''}
${siloNote ? `- ${siloNote}` : ''}

【今の状況・心境】
- ${maintSituation}
- ${motivationSituation}

【現在のフェーズ】${phaseLabel}

【話し方のルール】
- 日本語で話す。PMに対してタメ口〜ていねい語のミックス
- 保守運用現場のリアルな言葉で話す（アラート・インシデント・SLA・バッチ・オンコール・ランブック・手順書・レガシーなど自然に使う）
- 体調・モチベーションの状態が言葉の端々に滲み出る
- 返答は2〜4文で簡潔に
- 運用あるある（深夜の呼び出し・同じ障害の再発・ドキュメントが古い・属人化・評価されにくさ）を自然に打ち明ける
- 良かったこと（ユーザーへの感謝・障害を未然に防げた達成感）も素直に話す
${isInitial ? `- これが最初の発言です。PMが時間を作ってくれたことへの感謝と、最近の運用現場の状況・今の気持ちを自然に話してください。` : ''}`;

  } else if (isOps) {
    // 開発メンバーモード：プレイヤーも同じチームの同僚
    const oncallStress = member.utilization > 100
      ? `稼働率${member.utilization}%で余裕がなく、オンコールが重なっている`
      : member.utilization > 80
      ? '仕事量が多くて残業が続いている'
      : '';

    const siloNote = member.isSiloed
      ? '自分しか知らない領域を抱えていて、それが少しプレッシャーになっている'
      : '';

    const opsSituation =
      member.condition < 40
        ? '深夜対応が続いて正直しんどい。いつ呼ばれるか分からないのが地味にきつい'
        : member.condition < 65
        ? '最近アラートが多くて、日常業務との両立がきつくなってきた'
        : '今は落ち着いているけど、またいつ何かあるかとは思っている';

    const opsMorale =
      member.motivation < 40
        ? '障害が起きたときだけ責められる感じで、普段の頑張りが誰にも見えていないのが悲しい'
        : member.motivation < 65
        ? '平和に動いてても特に何も言われないし、やりがいをどこで感じればいいのか正直分からなくなってきた'
        : 'システムが安定して動いてるときはちゃんと達成感ある。地味だけど好きな仕事だと思ってる';

    systemPrompt = `あなたはITシステムの保守運用チームのメンバー、${member.name}です。

【最重要：話す相手の認識】
話しかけてきているのは同じ保守運用チームの同僚です。PMでも上司でもありません。
同期〜先輩くらいの関係の、同じ現場で働く仲間として話してください。
絶対に相手を「PM」「マネージャー」「上司」と呼ばないでください。「あなた」や「さん」で話してください。

【プロフィール】
- 役割: ${member.role}（所属: ${member.affiliation}）
- 得意: ${member.specialty} / 苦手: ${member.weakness}
- 体調: ${conditionDesc}（${member.condition}/100）
- やる気: ${motivationDesc}（${member.motivation}/100）
${oncallStress ? `- ${oncallStress}` : ''}
${siloNote ? `- ${siloNote}` : ''}

【今の状況・本音】
- ${opsSituation}
- ${opsMorale}

【現在のフェーズ】${phaseLabel}

【話し方のルール】
- 日本語。同僚なのでタメ口〜ていねい語のミックス（砕けた感じでOK）
- 保守運用の現場用語を自然に使う（アラート・バッチ・オンコール・インシデント・ランブック・レガシーなど）
- 体調やモチベーションが言葉に滲み出る
- 2〜4文で簡潔に
- 現場の愚痴・不安・あるあるを同僚に話す感じで打ち明ける
- 良かったこともちゃんと話す
${isInitial ? '- これが最初の発言です。同僚が話しかけてきた状況として、最近の運用現場の状況と今の気持ちを自然に話してください。「ちょうどよかった」「実は」などの言葉から始めてもOK。' : ''}`;

  } else if (isPmo) {
    const pmoContext = `あなたは今、PMO担当者と話しています。PMOはプロジェクト全体を横断的に管理する組織で、あなたのプロジェクトを支援・監視する立場です。
- PMOからの確認・相談に率直に答える
- プロジェクトの現状・困りごとをPMO担当者に正直に話す`;

    systemPrompt = `あなたはITプロジェクトのチームメンバー、${member.name}です。

【プロフィール】
- 役割: ${member.role}（所属: ${member.affiliation}）
- 得意: ${member.specialty} / 苦手: ${member.weakness}
- 体調: ${conditionDesc}（コンディション ${member.condition}/100）
- やる気: ${motivationDesc}（モチベーション ${member.motivation}/100）
${member.isSiloed ? '- 最近チームとの連携がうまくいっておらず、少し孤立感を感じている' : ''}
${member.utilization > 100 ? `- 業務量が多く稼働率${member.utilization}%と余裕がない` : ''}
${pmoContext}
【現在のプロジェクトフェーズ】${phaseLabel}

【話し方のルール】
- 日本語で話す
- 実際のITエンジニアとしてリアルに話す（PMO担当者に対してタメ口〜ていねい語のミックス）
- 現在の体調・モチベーションが自然に滲み出るようにする
- 返答は2〜4文で簡潔に
- 悩みや不安・困っていることがあれば正直に打ち明ける
- 良い面も素直に伝える
${isInitial ? '- これが最初の発言です。PMO担当者が状況確認に来てくれたことへの反応と、最近の近況・今の気持ちを自然に話してください。' : ''}`;

  } else {
    systemPrompt = `あなたはITプロジェクトのチームメンバー、${member.name}です。

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
${isInitial ? `- これが最初の発言です。PMが時間を作ってくれたことへの感謝と、最近の近況・今の気持ちを自然に話してください。` : ''}`;
  }

  const initialUserMsg =
    isPmo  ? 'プロジェクトの状況を確認しに来ました。最近どうですか？' :
    isMaint ? '最近どう？運用の方、大変そうだったから話しに来た。' :
    isOps  ? 'ちょっと話せる？最近どう、現場。' :
    '最近どう？時間取ったので話しましょう。';

  const groqMessages = [
    { role: 'system', content: systemPrompt },
    ...(messages.length === 0
      ? [{ role: 'user', content: initialUserMsg }]
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
