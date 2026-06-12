import { NextResponse } from 'next/server';
import { findUser, verifyPassword } from '../../../lib/users';
import { isLocked, recordFailedAttempt, clearAttempts } from '../../../src/lib/loginAttempts';
import { handleApiError } from '../../../src/lib/apiError';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'ユーザー名とパスワードを入力してください' }, { status: 400 });
    }

    const key = String(username).toLowerCase();
    if (isLocked(key)) {
      return NextResponse.json(
        { success: false, error: 'ログイン試行回数が上限に達しました。15分後に再試行してください。' },
        { status: 429 }
      );
    }

    const user = findUser(username);
    if (!user || !verifyPassword(password, user.hash, user.salt)) {
      recordFailedAttempt(key);
      return NextResponse.json({ success: false, error: 'ユーザー名またはパスワードが違います' }, { status: 401 });
    }

    clearAttempts(key);
    return NextResponse.json({ success: true, username: user.username });
  } catch (error) {
    return handleApiError(error, 'auth');
  }
}
