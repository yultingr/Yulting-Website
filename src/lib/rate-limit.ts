// In-memory rate limiter for login and API endpoints

const attempts = new Map<string, { count: number; resetAt: number }>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// API rate limiter (separate store, higher limits)
const apiAttempts = new Map<string, { count: number; resetAt: number }>();
const API_MAX = 30; // 30 requests per window
const API_WINDOW_MS = 60 * 1000; // 1 minute

export function checkApiRateLimit(key: string): { allowed: boolean; resetIn: number } {
  const now = Date.now();
  const entry = apiAttempts.get(key);

  if (entry && now > entry.resetAt) {
    apiAttempts.delete(key);
  }

  const current = apiAttempts.get(key);
  if (!current) {
    apiAttempts.set(key, { count: 1, resetAt: now + API_WINDOW_MS });
    return { allowed: true, resetIn: 0 };
  }

  current.count++;
  if (current.count > API_MAX) {
    return { allowed: false, resetIn: Math.ceil((current.resetAt - now) / 1000) };
  }

  return { allowed: true, resetIn: 0 };
}

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
