/**
 * Configuration for rate limiter
 */
export interface RateLimiterConfig {
  /** Time window in milliseconds */
  windowMs: number;
  /** Maximum number of requests allowed in the time window */
  maxRequests: number;
}

/**
 * Result of rate limit check
 */
export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Number of seconds to wait before retrying (only set if not allowed) */
  retryAfter?: number;
}

/**
 * Entry in the rate limiter tracking map
 */
interface RateLimitEntry {
  /** Timestamps of requests in the current window */
  timestamps: number[];
  /** Timeout ID for auto-cleanup */
  timeoutId?: number;
}

/**
 * Rate limiter using sliding window algorithm with in-memory storage
 */
export interface RateLimiter {
  /**
   * Check if a request from the given key is allowed
   * @param key - Unique identifier for the requester (e.g., IP address, user ID)
   * @returns Result indicating if request is allowed and retry time if not
   */
  check(key: string): RateLimitResult;

  /**
   * Reset the rate limit for a specific key
   * @param key - The key to reset
   */
  reset(key: string): void;
}

/**
 * Creates a new rate limiter instance
 * @param config - Configuration for the rate limiter
 * @returns A new RateLimiter instance
 */
export function createRateLimiter(config: RateLimiterConfig): RateLimiter {
  const { windowMs, maxRequests } = config;
  const entries = new Map<string, RateLimitEntry>();

  /**
   * Clean up old timestamps from an entry
   */
  function cleanupEntry(entry: RateLimitEntry, now: number): void {
    const windowStart = now - windowMs;
    entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);
  }

  /**
   * Schedule auto-cleanup for an entry
   */
  function scheduleCleanup(key: string): void {
    const entry = entries.get(key);
    if (!entry) return;

    // Clear existing timeout
    if (entry.timeoutId) {
      clearTimeout(entry.timeoutId);
    }

    // Schedule cleanup after window expires
    entry.timeoutId = setTimeout(() => {
      const currentEntry = entries.get(key);
      if (currentEntry) {
        cleanupEntry(currentEntry, Date.now());

        // Remove entry if no more timestamps
        if (currentEntry.timestamps.length === 0) {
          entries.delete(key);
        } else {
          // Reschedule if still has timestamps
          scheduleCleanup(key);
        }
      }
    }, windowMs);
  }

  return {
    check(key: string): RateLimitResult {
      const now = Date.now();
      let entry = entries.get(key);

      if (!entry) {
        entry = { timestamps: [] };
        entries.set(key, entry);
      }

      // Clean up old timestamps
      cleanupEntry(entry, now);

      // Check if limit exceeded
      if (entry.timestamps.length >= maxRequests) {
        const oldestTimestamp = entry.timestamps[0] ?? now;
        const retryAfterMs = oldestTimestamp + windowMs - now;
        const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);

        return {
          allowed: false,
          retryAfter: retryAfterSeconds,
        };
      }

      // Allow request and track timestamp
      entry.timestamps.push(now);
      scheduleCleanup(key);

      return {
        allowed: true,
      };
    },

    reset(key: string): void {
      const entry = entries.get(key);
      if (entry?.timeoutId) {
        clearTimeout(entry.timeoutId);
      }
      entries.delete(key);
    },
  };
}
