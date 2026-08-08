/* ------------------------------------------------------------------ */
/*  Debounced localStorage persistence                                 */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "catalog-studio-pro:v1";

type Listener = () => void;

interface DebouncedStorage {
  /** Read the raw persisted string (or null). */
  read(): string | null;
  /** Write a value, debounced. */
  write(value: string): void;
  /** Flush any pending write immediately. */
  flush(): void;
  /** Subscribe to external storage changes (e.g. other tabs). */
  subscribe(listener: Listener): () => void;
}

const listeners = new Set<Listener>();

function notify() {
  for (const listener of listeners) listener();
}

export function createDebouncedStorage(
  key: string = STORAGE_KEY,
  delayMs = 400,
): DebouncedStorage {
  let pending: string | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  function schedule() {
    if (timer !== null) return;
    timer = setTimeout(() => {
      timer = null;
      if (pending !== null) {
        try {
          localStorage.setItem(key, pending);
        } catch {
          /* storage full / unavailable — ignore */
        }
        pending = null;
      }
    }, delayMs);
  }

  return {
    read() {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    write(value: string) {
      pending = value;
      schedule();
    },
    flush() {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      if (pending !== null) {
        try {
          localStorage.setItem(key, pending);
        } catch {
          /* ignore */
        }
        pending = null;
      }
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

/** Shared singleton used across the app. */
export const storage = createDebouncedStorage();

/** Cross-tab sync: notify listeners when another tab writes. */
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) notify();
  });
}
