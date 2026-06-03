import { NextResponse } from 'next/server';
import { createUser } from '../../../../lib/users';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ success: false, error: 'ユーザー名とパスワードを入力してください' }, { status: 400 });
  }

  if (username.length < 2 || username.length > 20) {
    return NextResponse.json({ success: false, error: 'ユーザー名は2〜20文字で入力してください' }, { status: 400 });
  }

  if (!/^[a-zA-Z0-9_぀-ヿ一-鿿]+$/.test(username)) {
    return NextResponse.json({ success: false, error: 'ユーザー名に使えない文字が含まれています' }, { status: 400 });
  }

  if (password.length < 4) {
    return NextResponse.json({ success: false, error: 'パスワードは4文字以上で入力してください' }, { status: 400 });
  }

  const user = createUser(username, password);
  if (!user) {
    return NextResponse.json({ success: false, error: 'このユーザー名はすでに使用されています' }, { status: 400 });
  }

  return NextResponse.json({ success: true, username: user.username });
}
