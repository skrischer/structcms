/**
 * Global console declaration for TypeScript DTS generation
 * without requiring DOM lib
 */
declare global {
  const console: {
    error: (...data: unknown[]) => void;
    log: (...data: unknown[]) => void;
    warn: (...data: unknown[]) => void;
  };
}

export {};
