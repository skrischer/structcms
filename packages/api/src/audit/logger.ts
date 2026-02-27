export interface AuditEntry {
  action: string;
  entity: string;
  entityId: string;
  userId?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

type AuditSink = (entry: AuditEntry) => void | Promise<void>;

const defaultSink: AuditSink = (entry) => {
  const output = JSON.stringify(entry, null, 2);
  // Use globalThis to access console in both Node.js and browser environments
  // biome-ignore lint/suspicious/noExplicitAny: console may not be in type definitions
  (globalThis as any).console?.log?.(output);
};

export function createAuditLogger(sink: AuditSink = defaultSink) {
  return {
    log: async (entry: Omit<AuditEntry, 'timestamp'>) => {
      await sink({
        ...entry,
        timestamp: new Date(),
      });
    },
  };
}

export interface WithAuditLogOptions {
  action: string;
  entity: string;
  extractEntityId: (args: unknown[]) => string;
  extractUserId?: (args: unknown[]) => string | undefined;
  metadata?: (args: unknown[]) => Record<string, unknown> | undefined;
}

// biome-ignore lint/suspicious/noExplicitAny: generic wrapper for any handler signature
export function withAuditLog<T extends (...args: any[]) => any>(
  handler: T,
  options: WithAuditLogOptions,
  sink?: AuditSink
): T {
  const logger = createAuditLogger(sink);

  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const result = await handler(...args);

    await logger.log({
      action: options.action,
      entity: options.entity,
      entityId: options.extractEntityId(args),
      userId: options.extractUserId?.(args),
      metadata: options.metadata?.(args),
    });

    return result;
  }) as T;
}
