import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/api/chat-1on1', '/api/chat-client', '/api/evaluate'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  matcher: ['/api/chat-1on1', '/api/chat-client', '/api/evaluate'],
};
