import { describe, expect, it } from 'vitest';
import { generateCsrfToken, validateCsrfToken } from './csrf';

describe('CSRF Protection', () => {
  describe('generateCsrfToken', () => {
    it('should generate a token', () => {
      const token = generateCsrfToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBe(64); // 32 bytes = 64 hex chars
    });

    it('should generate unique tokens', () => {
      const token1 = generateCsrfToken();
      const token2 = generateCsrfToken();
      expect(token1).not.toBe(token2);
    });

    it('should generate tokens with only hex characters', () => {
      const token = generateCsrfToken();
      expect(token).toMatch(/^[0-9a-f]{64}$/);
    });
  });

  describe('validateCsrfToken', () => {
    it('should return true for matching tokens', () => {
      const token = generateCsrfToken();
      expect(validateCsrfToken(token, token)).toBe(true);
    });

    it('should return false for non-matching tokens', () => {
      const token1 = generateCsrfToken();
      const token2 = generateCsrfToken();
      expect(validateCsrfToken(token1, token2)).toBe(false);
    });

    it('should return false when cookie token is missing', () => {
      const token = generateCsrfToken();
      expect(validateCsrfToken(undefined, token)).toBe(false);
    });

    it('should return false when header token is missing', () => {
      const token = generateCsrfToken();
      expect(validateCsrfToken(token, undefined)).toBe(false);
    });

    it('should return false when both tokens are missing', () => {
      expect(validateCsrfToken(undefined, undefined)).toBe(false);
    });

    it('should return false for empty cookie token', () => {
      const token = generateCsrfToken();
      expect(validateCsrfToken('', token)).toBe(false);
    });

    it('should return false for empty header token', () => {
      const token = generateCsrfToken();
      expect(validateCsrfToken(token, '')).toBe(false);
    });

    it('should return false for whitespace-only tokens', () => {
      expect(validateCsrfToken('   ', 'token')).toBe(false);
      expect(validateCsrfToken('token', '   ')).toBe(false);
    });
  });
});
