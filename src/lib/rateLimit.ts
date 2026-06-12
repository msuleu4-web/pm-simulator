interface RateLimitEntry {
  count: number;
  timestamp: number;
}

const WINDOW_MS = 60 * 1000; // 1分
const MAX_REQUESTS = 30; // 1分あたり30リクエストまで

const requests = new Map<string, RateLimitEntry>();

/** IPごとに1分間30リクエストまで許可する。超えていればfalseを返す。 */
export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = requests.get(ip);

  if (!entry || now - entry.timestamp >= WINDOW_MS) {
    requests.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  entry.count += 1;
  return true;
}

/** リバースプロキシ経由のヘッダーからクライアントIPを取得する。 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}
