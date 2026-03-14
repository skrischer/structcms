import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRateLimiter } from './rate-limiter';

describe('Rate Limiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should allow requests within the limit', () => {
    const limiter = createRateLimiter({ windowMs: 1000, maxRequests: 3 });

    const result1 = limiter.check('user1');
    const result2 = limiter.check('user1');
    const result3 = limiter.check('user1');

    expect(result1.allowed).toBe(true);
    expect(result2.allowed).toBe(true);
    expect(result3.allowed).toBe(true);
  });

  it('should block requests exceeding the limit', () => {
    const limiter = createRateLimiter({ windowMs: 1000, maxRequests: 2 });

    limiter.check('user1');
    limiter.check('user1');
    const result = limiter.check('user1');

    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it('should track different keys separately', () => {
    const limiter = createRateLimiter({ windowMs: 1000, maxRequests: 2 });

    limiter.check('user1');
    limiter.check('user1');
    const user1Result = limiter.check('user1');

    const user2Result = limiter.check('user2');

    expect(user1Result.allowed).toBe(false);
    expect(user2Result.allowed).toBe(true);
  });

  it('should reset limit after window expires (sliding window)', () => {
    const limiter = createRateLimiter({ windowMs: 1000, maxRequests: 2 });

    // Make 2 requests
    limiter.check('user1');
    limiter.check('user1');

    // Try 3rd - should be blocked
    const blockedResult = limiter.check('user1');
    expect(blockedResult.allowed).toBe(false);

    // Advance time past the window
    vi.advanceTimersByTime(1100);

    // Should be allowed again
    const allowedResult = limiter.check('user1');
    expect(allowedResult.allowed).toBe(true);
  });

  it('should provide correct retryAfter value', () => {
    const limiter = createRateLimiter({ windowMs: 60000, maxRequests: 1 });

    limiter.check('user1');

    // Advance time by 10 seconds
    vi.advanceTimersByTime(10000);

    const result = limiter.check('user1');

    expect(result.allowed).toBe(false);
    // Should be roughly 50 seconds (60 - 10)
    expect(result.retryAfter).toBeGreaterThanOrEqual(49);
    expect(result.retryAfter).toBeLessThanOrEqual(51);
  });

  it('should reset a specific key', () => {
    const limiter = createRateLimiter({ windowMs: 1000, maxRequests: 2 });

    limiter.check('user1');
    limiter.check('user1');

    // Should be blocked
    const blockedResult = limiter.check('user1');
    expect(blockedResult.allowed).toBe(false);

    // Reset
    limiter.reset('user1');

    // Should be allowed again
    const allowedResult = limiter.check('user1');
    expect(allowedResult.allowed).toBe(true);
  });

  it('should handle reset of non-existent key gracefully', () => {
    const limiter = createRateLimiter({ windowMs: 1000, maxRequests: 2 });

    expect(() => limiter.reset('nonexistent')).not.toThrow();
  });

  it('should cleanup old timestamps in sliding window', () => {
    const limiter = createRateLimiter({ windowMs: 1000, maxRequests: 3 });

    // Make 2 requests at time 0
    limiter.check('user1');
    limiter.check('user1');

    // Advance time by 600ms
    vi.advanceTimersByTime(600);

    // Make 1 more request (total 3 in window)
    limiter.check('user1');

    // This should be blocked (3 in window)
    const blockedResult = limiter.check('user1');
    expect(blockedResult.allowed).toBe(false);

    // Advance time by 500ms (total 1100ms from start)
    // First 2 requests should be outside window now
    vi.advanceTimersByTime(500);

    // Should be allowed now (only 1 request in window)
    const allowedResult = limiter.check('user1');
    expect(allowedResult.allowed).toBe(true);
  });

  it('should handle high request rates', () => {
    const limiter = createRateLimiter({ windowMs: 1000, maxRequests: 100 });

    // Make 100 requests
    for (let i = 0; i < 100; i++) {
      const result = limiter.check('user1');
      expect(result.allowed).toBe(true);
    }

    // 101st should be blocked
    const result = limiter.check('user1');
    expect(result.allowed).toBe(false);
  });
});
