import { describe, expect, it, vi } from 'vitest';
import { type AuditEntry, createAuditLogger, withAuditLog } from './logger.js';

describe('createAuditLogger', () => {
  it('should use default sink when none provided', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const logger = createAuditLogger();

    await logger.log({
      action: 'create',
      entity: 'page',
      entityId: 'page-123',
      userId: 'user-456',
    });

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('"action": "create"'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('"entity": "page"'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('"entityId": "page-123"'));
    consoleSpy.mockRestore();
  });

  it('should use custom sink when provided', async () => {
    const customSink = vi.fn();
    const logger = createAuditLogger(customSink);

    await logger.log({
      action: 'update',
      entity: 'media',
      entityId: 'media-789',
    });

    expect(customSink).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'update',
        entity: 'media',
        entityId: 'media-789',
        timestamp: expect.any(Date),
      })
    );
  });

  it('should add timestamp automatically', async () => {
    const sink = vi.fn();
    const logger = createAuditLogger(sink);

    const before = new Date();
    await logger.log({
      action: 'delete',
      entity: 'navigation',
      entityId: 'nav-001',
    });
    const after = new Date();

    const entry = sink.mock.calls[0][0] as AuditEntry;
    expect(entry.timestamp).toBeInstanceOf(Date);
    expect(entry.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(entry.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('should support metadata', async () => {
    const sink = vi.fn();
    const logger = createAuditLogger(sink);

    await logger.log({
      action: 'create',
      entity: 'page',
      entityId: 'page-new',
      userId: 'user-123',
      metadata: { title: 'New Page', status: 'draft' },
    });

    expect(sink).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: { title: 'New Page', status: 'draft' },
      })
    );
  });
});

describe('withAuditLog', () => {
  it('should wrap handler and log after execution', async () => {
    const sink = vi.fn();
    const handler = vi.fn(async (id: string) => ({ success: true, id }));

    const wrapped = withAuditLog(
      handler,
      {
        action: 'create',
        entity: 'page',
        extractEntityId: (args) => args[0] as string,
      },
      sink
    );

    const result = await wrapped('page-123');

    expect(result).toEqual({ success: true, id: 'page-123' });
    expect(handler).toHaveBeenCalledWith('page-123');
    expect(sink).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'create',
        entity: 'page',
        entityId: 'page-123',
      })
    );
  });

  it('should extract userId when provided', async () => {
    const sink = vi.fn();
    const handler = vi.fn(async (id: string, userId: string) => ({ id, userId }));

    const wrapped = withAuditLog(
      handler,
      {
        action: 'update',
        entity: 'media',
        extractEntityId: (args) => args[0] as string,
        extractUserId: (args) => args[1] as string,
      },
      sink
    );

    await wrapped('media-456', 'user-789');

    expect(sink).toHaveBeenCalledWith(
      expect.objectContaining({
        entityId: 'media-456',
        userId: 'user-789',
      })
    );
  });

  it('should extract metadata when provided', async () => {
    const sink = vi.fn();
    const handler = vi.fn(async (id: string, data: object) => ({ id, data }));

    const wrapped = withAuditLog(
      handler,
      {
        action: 'update',
        entity: 'page',
        extractEntityId: (args) => args[0] as string,
        metadata: (args) => args[1] as Record<string, unknown>,
      },
      sink
    );

    await wrapped('page-001', { title: 'Updated', status: 'published' });

    expect(sink).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: { title: 'Updated', status: 'published' },
      })
    );
  });

  it('should preserve handler return value', async () => {
    const handler = vi.fn(async () => ({ data: [1, 2, 3] }));
    const wrapped = withAuditLog(
      handler,
      {
        action: 'read',
        entity: 'test',
        extractEntityId: () => 'test-id',
      },
      vi.fn()
    );

    const result = await wrapped();
    expect(result).toEqual({ data: [1, 2, 3] });
  });

  it('should handle synchronous handlers', async () => {
    const sink = vi.fn();
    const handler = vi.fn((id: string) => ({ id }));

    const wrapped = withAuditLog(
      handler,
      {
        action: 'delete',
        entity: 'navigation',
        extractEntityId: (args) => args[0] as string,
      },
      sink
    );

    const result = await wrapped('nav-123');

    expect(result).toEqual({ id: 'nav-123' });
    expect(sink).toHaveBeenCalled();
  });
});
