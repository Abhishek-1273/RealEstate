import { Redis } from '@upstash/redis';

// ─────────────────────────────────────────────────────────────────────────────
// Upstash Redis client
// Falls back gracefully if env vars are not set (no crash in dev without Redis)
// ─────────────────────────────────────────────────────────────────────────────
let redis = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url:   process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  console.info('✅ Redis (Upstash) connected');
} else {
  console.warn('⚠️  Redis not configured — UPSTASH_REDIS_REST_URL/TOKEN missing. Falling back to MongoDB for OTP/cache.');
}

export default redis;
