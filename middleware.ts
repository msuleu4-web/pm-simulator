import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from './src/lib/rateLimit';

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

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
