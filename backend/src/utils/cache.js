import redis from '../config/redis.js';

// ─────────────────────────────────────────────────────────────────────────────
// Cache helper utilities
// All functions are no-ops if Redis is not configured (graceful fallback)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get a cached value by key
 * @param {string} key
 * @returns {any|null}
 */
export const cacheGet = async (key) => {
  if (!redis) return null;
  try {
    return await redis.get(key);
  } catch (err) {
    console.error(`[Cache] GET error for key "${key}":`, err.message);
    return null;
  }
};

/**
 * Set a value in cache with optional TTL
 * @param {string} key
 * @param {any} value
 * @param {number} ttlSeconds - default 300 (5 min)
 */
export const cacheSet = async (key, value, ttlSeconds = 300) => {
  if (!redis) return;
  try {
    await redis.set(key, JSON.stringify(value), { ex: ttlSeconds });
  } catch (err) {
    console.error(`[Cache] SET error for key "${key}":`, err.message);
  }
};

/**
 * Delete one or more cache keys
 * @param {...string} keys
 */
export const cacheDel = async (...keys) => {
  if (!redis || !keys.length) return;
  try {
    await redis.del(...keys);
  } catch (err) {
    console.error(`[Cache] DEL error:`, err.message);
  }
};

/**
 * Delete all keys matching a pattern (uses SCAN to avoid blocking)
 * @param {string} pattern - e.g. "blogs:*"
 */
export const cacheDelPattern = async (pattern) => {
  if (!redis) return;
  try {
    let cursor = 0;
    do {
      const [nextCursor, keys] = await redis.scan(cursor, { match: pattern, count: 100 });
      cursor = Number(nextCursor);
      if (keys.length > 0) await redis.del(...keys);
    } while (cursor !== 0);
  } catch (err) {
    console.error(`[Cache] DEL pattern "${pattern}" error:`, err.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// OTP helpers (replaces MongoDB Otp model)
// ─────────────────────────────────────────────────────────────────────────────
const OTP_PREFIX = 'otp:';
const OTP_TTL    = 5 * 60; // 5 minutes

/**
 * Save OTP for a target (email). Auto-expires in 5 min.
 */
export const otpSet = async (target, code) => {
  if (!redis) return false;
  try {
    await redis.set(`${OTP_PREFIX}${target}`, code, { ex: OTP_TTL });
    return true;
  } catch (err) {
    console.error(`[OTP] SET error:`, err.message);
    return false;
  }
};

/**
 * Verify OTP for a target. Returns true if valid, deletes it.
 */
export const otpVerify = async (target, code) => {
  if (!redis) return null; // null = Redis not available, fall back to MongoDB
  try {
    const stored = await redis.get(`${OTP_PREFIX}${target}`);
    if (!stored) return false;
    if (String(stored) !== String(code)) return false;
    await redis.del(`${OTP_PREFIX}${target}`);
    return true;
  } catch (err) {
    console.error(`[OTP] VERIFY error:`, err.message);
    return null;
  }
};

/**
 * Delete OTP for a target (cleanup on resend)
 */
export const otpDel = async (target) => {
  if (!redis) return;
  try {
    await redis.del(`${OTP_PREFIX}${target}`);
  } catch (err) {
    console.error(`[OTP] DEL error:`, err.message);
  }
};

/**
 * Increment the OTP request count for a target email.
 * Limits to 3 sends per 15 minutes.
 */
export const otpIncrementLimit = async (target) => {
  if (!redis) return { ok: true };
  const key = `otp_limit:${target}`;
  try {
    const current = await redis.get(key);
    const count = current ? parseInt(current, 10) : 0;
    if (count >= 3) {
      const ttl = await redis.ttl(key);
      return { ok: false, retryAfter: ttl > 0 ? ttl : 900 };
    }
    
    if (count === 0) {
      // Set to 1 with 15 minutes expiry (900 seconds)
      await redis.set(key, '1', { ex: 900 });
    } else {
      await redis.incr(key);
    }
    return { ok: true, remaining: 3 - (count + 1) };
  } catch (err) {
    console.error(`[OTP Limit] error:`, err.message);
    return { ok: true }; // Fallback to allow OTP request on redis exception
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Wishlist cache helpers (per-user, short TTL)
// ─────────────────────────────────────────────────────────────────────────────
const WISHLIST_TTL = 60; // 60 seconds

export const wishlistGet = (userId) => cacheGet(`wishlist:${userId}`);
export const wishlistSet = (userId, data) => cacheSet(`wishlist:${userId}`, data, WISHLIST_TTL);
export const wishlistDel = (userId) => cacheDel(`wishlist:${userId}`);
