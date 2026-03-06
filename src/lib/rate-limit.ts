// Simple in-memory rate limiter for admin login
// Tracks failed attempts per IP-like key (in dev, uses a global key)

const attempts = new Map<string, { count: number; resetAt: number }>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(key: string = "global"): {
  allowed: boolean;
  remaining: number;
  resetIn: number;
} {
  const now = Date.now();
  const entry = attempts.get(key);

  // Reset if window expired
  if (entry && now > entry.resetAt) {
    attempts.delete(key);
  }

  const current = attempts.get(key);
  if (!current) {
    return { allowed: true, remaining: MAX_ATTEMPTS, resetIn: 0 };
  }

  if (current.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - current.count,
    resetIn: 0,
  };
}

export function recordFailedAttempt(key: string = "global"): void {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count++;
  }
}

export function resetAttempts(key: string = "global"): void {
  attempts.delete(key);
}
