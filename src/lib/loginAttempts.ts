interface AttemptEntry {
  count: number;
  lockedUntil: number;
}

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15分

const attempts = new Map<string, AttemptEntry>();

/** 指定キー（ユーザー名など）が現在ロック中かどうか。 */
export function isLocked(key: string): boolean {
  const entry = attempts.get(key);
  return !!entry && entry.lockedUntil > Date.now();
}

/** ログイン失敗を記録し、上限に達したら15分ロックする。 */
export function recordFailedAttempt(key: string): void {
  const entry = attempts.get(key) ?? { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCK_DURATION_MS;
    entry.count = 0;
  }
  attempts.set(key, entry);
}

/** ログイン成功時に失敗履歴をクリアする。 */
export function clearAttempts(key: string): void {
  attempts.delete(key);
}
