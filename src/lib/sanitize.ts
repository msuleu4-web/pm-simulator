/** HTMLタグを除去し、前後の空白を取り除く。AIへ送る前のユーザー入力サニタイズに使う。 */
export function sanitizeText(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

/** チャットメッセージ配列のcontentをサニタイズする。 */
export function sanitizeMessages<T extends { content: string }>(messages: T[]): T[] {
  return messages.map((m) => ({ ...m, content: sanitizeText(m.content) }));
}
