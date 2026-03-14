/* Minimal global declarations for Node.js / Web Crypto API */
declare const crypto: {
  getRandomValues<T extends ArrayBufferView>(array: T): T;
};

declare function setTimeout(callback: () => void, ms: number): number;
declare function clearTimeout(id: number | undefined): void;
