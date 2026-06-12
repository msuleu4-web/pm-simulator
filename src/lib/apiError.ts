import { NextResponse } from 'next/server';

/** 想定外エラーをサーバーログにのみ記録し、汎用メッセージを返す。 */
export function handleApiError(error: unknown, context: string) {
  console.error(`[api:${context}]`, error);
  return NextResponse.json({ error: 'エラーが発生しました' }, { status: 500 });
}
