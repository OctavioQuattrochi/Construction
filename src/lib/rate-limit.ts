// Rate limiter en memoria (por instancia). Primera capa anti-abuso, sin
// dependencias ni configuración. Para alta escala se puede migrar a Upstash/Redis.

type Entry = { count: number; reset: number };
const buckets = new Map<string, Entry>();

export interface RateResult {
  ok: boolean;
  remaining: number;
  retryAfter: number; // segundos
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateResult {
  const now = Date.now();

  // Limpieza ocasional para que el Map no crezca sin límite.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (now > v.reset) buckets.delete(k);
  }

  const entry = buckets.get(key);
  if (!entry || now > entry.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }
  if (entry.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((entry.reset - now) / 1000) };
  }
  entry.count += 1;
  return { ok: true, remaining: limit - entry.count, retryAfter: 0 };
}

export function getClientIp(req: Request): string {
  const h = req.headers;
  return (
    h.get("x-nf-client-connection-ip") ||
    h.get("x-forwarded-for")?.split(",")[0] ||
    h.get("x-real-ip") ||
    "unknown"
  ).trim();
}

/** Helper: aplica límite y devuelve la respuesta 429 lista, o null si pasa. */
export function checkRate(
  req: Request,
  bucket: string,
  limit: number,
  windowMs: number
): RateResult {
  return rateLimit(`${bucket}:${getClientIp(req)}`, limit, windowMs);
}
