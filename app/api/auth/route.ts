import { NextResponse } from 'next/server';
import { findUser, verifyPassword } from '../../../lib/users';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ success: false, error: 'ユーザー名とパスワードを入力してください' }, { status: 400 });
  }

  const user = findUser(username);
  if (!user || !verifyPassword(password, user.hash, user.salt)) {
    return NextResponse.json({ success: false, error: 'ユーザー名またはパスワードが違います' }, { status: 401 });
  }

  return NextResponse.json({ success: true, username: user.username });
}
