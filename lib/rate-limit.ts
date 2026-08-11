const buckets = new Map<string, number[]>();

export const getRequestIp = (request: Request): string => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") || "unknown";
};

export const enforceRateLimit = (
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } => {
  const now = Date.now();
  const windowStart = now - windowMs;
  const recent = (buckets.get(key) || []).filter((timestamp) => timestamp > windowStart);

  if (recent.length >= limit) {
    const retryAfterMs = recent[0] + windowMs - now;
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  recent.push(now);
  buckets.set(key, recent);

  return { allowed: true, retryAfterSeconds: 0 };
};