import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from './src/lib/rateLimit';

const PROTECTED_ROUTES = ['/api/chat-1on1', '/api/chat-client', '/api/evaluate'];
const MAX_BODY_BYTES = 10 * 1024; // 10KB

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // POSTのみ許可
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  // レートリミット: IPごとに1分間30リクエストまで
  if (!checkRateLimit(getClientIp(request))) {
    return NextResponse.json(
      { error: 'リクエストが多すぎます。しばらく待ってから再試行してください。' },
      { status: 429 }
    );
  }

  // Content-Type チェック
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return NextResponse.json({ error: '不正なリクエストです' }, { status: 415 });
  }

  // リクエストボディサイズ制限 (10KB)
  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'リクエストボディが大きすぎます' }, { status: 413 });
  }

  if (!PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('sb-access-token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'ログインが必要です', content: '※ログインが必要です', comment: '※ログインが必要です' },
      { status: 401 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: anonKey!,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'セッションが無効です', content: '※セッションが無効です', comment: '※セッションが無効です' },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
